import os
import asyncio
import random
import httpx
import logging
from typing import Tuple
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


def get_api_key() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip()


def get_model_name() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-3.7-flash").strip()


def check_gemini_status() -> dict:
    key = get_api_key()
    configured = bool(
        key and len(key) > 5 and not key.startswith("your_")
    )

    return {
        "configured": configured,
        "model": get_model_name()
    }


async def generate_text(prompt: str) -> Tuple[bool, str]:
    """
    Generate text using Gemini API.
    Returns:
        (True, generated_text) on success
        (False, error_message) on failure
    """

    # 1. Get API key
    api_key = get_api_key()

    if not api_key or api_key.startswith("your_"):
        return False, (
            "API Key missing. Please set GEMINI_API_KEY "
            "in backend/.env file or environment variables."
        )

    # 2. Validate prompt
    if not prompt or not prompt.strip():
        return False, "Input prompt cannot be empty."

    # 3. Get model
    model_name = get_model_name()

    # 4. Try Google GenAI SDK
    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        if response and response.text:
            return True, response.text.strip()

    except Exception as sdk_err:
        logger.warning(
            f"SDK call failed: {sdk_err}. "
            "Falling back to REST API."
        )

    # 5. REST API fallback
    models_to_try = [model_name,"gemini-3.7-flash","gemini-3.6-flash","gemini-3.5-flash"]

    # Remove duplicate model names
    models_to_try = list(dict.fromkeys(models_to_try))

    last_error = ""

    async with httpx.AsyncClient(timeout=60.0) as http_client:

        # 6. Try each model
        for m_name in models_to_try:

            # 7. Retry temporary errors
            for attempt in range(3):

                url = (
                    "https://generativelanguage.googleapis.com/"
                    f"v1beta/models/{m_name}:generateContent"
                    f"?key={api_key}"
                )

                payload = {
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": prompt
                                }
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topP": 0.95,
                        "maxOutputTokens": 4096
                    }
                }

                try:
                    # 8. Send request
                    resp = await http_client.post(
                        url,
                        json=payload
                    )

                    # 9. Successful response
                    if resp.status_code == 200:

                        data = resp.json()

                        candidates = data.get(
                            "candidates",
                            []
                        )

                        if candidates:

                            content = candidates[0].get(
                                "content",
                                {}
                            )

                            parts = content.get(
                                "parts",
                                []
                            )

                            if parts:

                                text_result = parts[0].get(
                                    "text",
                                    ""
                                )

                                if text_result:
                                    return (
                                        True,
                                        text_result.strip()
                                    )

                        last_error = (
                            "Gemini returned an empty response."
                        )
                        break

                    # 10. Rate limit or temporary overload
                    elif resp.status_code in (429, 503):

                        last_error = (
                            f"Gemini temporarily unavailable "
                            f"(HTTP {resp.status_code}) "
                            f"for model {m_name}."
                        )

                        if attempt < 2:

                            wait_time = (
                                (2 ** attempt)
                                + random.uniform(0, 1)
                            )

                            logger.warning(
                                f"Retrying {m_name} "
                                f"in {wait_time:.2f} seconds..."
                            )

                            await asyncio.sleep(
                                wait_time
                            )

                            continue

                        break

                    # 11. Bad request
                    elif resp.status_code == 400:

                        try:
                            error_msg = resp.json().get(
                                "error",
                                {}
                            ).get(
                                "message",
                                "Bad request"
                            )
                        except Exception:
                            error_msg = resp.text

                        last_error = (
                            f"Invalid Request to Gemini API "
                            f"({m_name}): {error_msg}"
                        )

                        break

                    # 12. Invalid API key / access denied
                    elif resp.status_code == 403:

                        return False, (
                            "Access Denied (HTTP 403). "
                            "Please verify that your "
                            "GEMINI_API_KEY is valid."
                        )

                    # 13. Model not found
                    elif resp.status_code == 404:

                        last_error = (
                            f"Model {m_name} is unavailable "
                            f"(HTTP 404)."
                        )

                        break

                    # 14. Other API errors
                    else:

                        last_error = (
                            f"Gemini API returned error code "
                            f"{resp.status_code}: {resp.text}"
                        )

                        break

                # 15. Timeout
                except httpx.TimeoutException:

                    last_error = (
                        "Request to Gemini API timed out "
                        "after 60 seconds."
                    )

                    if attempt < 2:
                        await asyncio.sleep(2)
                        continue

                    break

                # 16. Other network errors
                except Exception as req_err:

                    last_error = (
                        "Network communication error "
                        f"with Gemini API: {str(req_err)}"
                    )

                    break

    # 17. Final failure
    return False, (
        last_error
        or "Failed to generate content from Gemini API."
    )

