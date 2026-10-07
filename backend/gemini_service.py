import os
import httpx
import logging
from typing import Tuple, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

def get_api_key() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip()

def get_model_name() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

def check_gemini_status() -> dict:
    key = get_api_key()
    configured = bool(key and len(key) > 5 and not key.startswith("your_"))
    return {
        "configured": configured,
        "model": get_model_name()
    }

async def generate_text(prompt: str) -> Tuple[bool, str]:
    """
    Generate text using Gemini API with fallbacks.
    Returns (success: bool, content_or_error: str)
    """
    api_key = get_api_key()
    if not api_key or api_key.startswith("your_"):
        return False, (
            "API Key missing. Please set GEMINI_API_KEY in backend/.env file or environment variables. "
            "You can get a free key from Google AI Studio: https://aistudio.google.com/app/apikey"
        )
        
    if not prompt or not prompt.strip():
        return False, "Input prompt cannot be empty."

    model_name = get_model_name()
    
    # 1. Try google-genai library if installed
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
        )
        if response and response.text:
            return True, response.text.strip()
    except Exception as sdk_err:
        logger.warning(f"SDK call failed or google-genai not available: {sdk_err}. Falling back to Direct REST API.")

    # 2. Direct REST HTTP API call fallback (100% reliable across environments)
    # Support model fallback list if initial model errors out
    models_to_try = [model_name, "gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]
    # De-duplicate while preserving order
    seen = set()
    models_to_try = [m for m in models_to_try if not (m in seen or seen.add(m))]
    
    last_error = ""
    async with httpx.AsyncClient(timeout=45.0) as http_client:
        for m_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m_name}:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.95,
                    "maxOutputTokens": 4096,
                }
            }
            try:
                resp = await http_client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            text_result = parts[0].get("text", "")
                            if text_result:
                                return True, text_result.strip()
                    return False, "Gemini returned an empty response."
                elif resp.status_code == 429:
                    last_error = "Rate limit exceeded (HTTP 429). Please wait a moment and try again."
                elif resp.status_code == 400:
                    error_msg = resp.json().get("error", {}).get("message", "Bad request")
                    last_error = f"Invalid Request to Gemini API ({m_name}): {error_msg}"
                elif resp.status_code == 403:
                    return False, "Access Denied (HTTP 403). Please verify that your GEMINI_API_KEY is valid and has API access."
                else:
                    last_error = f"Gemini API returned error code {resp.status_code}: {resp.text}"
            except httpx.TimeoutException:
                last_error = "Request to Gemini API timed out after 45 seconds. Please try again."
            except Exception as req_err:
                last_error = f"Network communication error with Gemini API: {str(req_err)}"

    return False, last_error or "Failed to generate content from Gemini API."
