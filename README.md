# GenAI Content Studio 🚀

**AI-Powered Content Generation using Large Language Models**

> **College Mini-Project Aim:**  
> Develop a Generative AI chatbot capable of generating emails, reports, and technical explanations using an LLM with prompt engineering techniques.

---

## 📌 Project Overview

**GenAI Content Studio** is a full-stack Generative AI web application built to demonstrate practical LLM capabilities, production-grade prompt engineering, and clean web architecture. Powered by **Google Gemini 2.5 Flash**, **FastAPI**, **React + Vite**, and **Tailwind CSS**, it features 5 specialized AI generation modes designed for college practical demonstrations and real-world productivity.

---

## ✨ Features & AI Studio Modes

### 1. 📧 Mode 1 — Email Generator
- Custom parameters: Purpose, Recipient, Key Points, Tone (*Professional, Formal, Friendly, Persuasive, Apologetic*), and Length (*Short, Medium, Detailed*).
- Outputs: Formatted Email Subject Line + Structured Email Body.

### 2. 📊 Mode 2 — Report Generator
- Custom parameters: Topic, Purpose, Length, Academic Level (*High School, Undergraduate, Postgraduate, Executive*), and Section Selection (*Introduction, Problem Statement, Objectives, Methodology, Results, Discussion, Conclusion, Future Scope*).
- Outputs: Structured report using Markdown headings, paragraphs, and bullet points.

### 3. 💡 Mode 3 — Technical Explainer
- Custom parameters: Technical Topic (*CNN, REST API, Transformers, Docker, SQL Joins, Kubernetes, etc.*) and Difficulty Level (*Beginner, Intermediate, Advanced*).
- Outputs: 8-part structured breakdown (Definition, Simple Analogy, How It Works, Key Concepts, Code Example, Advantages, Limitations, Real-World Use Cases).

### 4. ✍️ Mode 4 — Text Improver
- Custom parameters: Raw / ungrammatical / informal text input.
- Outputs: Corrected version, Executive/Professional variant, Grammar fixes, and Readability style notes.

### 5. 🎯 Mode 5 — Prompt Generator
- Custom parameters: Informal user requirement.
- Outputs: Production-grade 6-part Prompt Engineering System Template (*ROLE, CONTEXT, TASK, REQUIREMENTS, CONSTRAINTS, EXPECTED OUTPUT FORMAT*) plus prompt design analysis.

### 📜 History & Storage
- SQLite database backend storing generation records.
- View history, filter by mode/search, re-copy content, delete items, or clear all history.

### ⚡ Additional Capabilities
- 1-Click Sample Prompts pre-filling input forms.
- One-click Copy to Clipboard.
- Download output as `.txt` or `.pdf` file.
- API status indicator and diagnostic settings page.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-performance Single Page Application |
| **Styling** | Tailwind CSS, Lucide Icons | Modern dark SaaS-inspired UI |
| **Backend** | Python 3.13, FastAPI, Uvicorn | Asynchronous REST API service |
| **LLM Engine** | Google Gemini API (`gemini-2.5-flash`) | State-of-the-art Generative AI model |
| **Database** | SQLite (`genai_studio.db`) | Lightweight relational storage for history |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud deployment with CORS enabled |

---

## 🧠 Prompt Engineering Implementation

The application strictly avoids sending raw user inputs to the LLM. Every request passes through a modular prompt builder inside `backend/prompts.py` using the standard 6-part prompt architecture:

$$\text{Prompt} = \text{ROLE} + \text{CONTEXT} + \text{TASK} + \text{USER INPUT} + \text{CONSTRAINTS} + \text{OUTPUT FORMAT}$$

---

## 📁 Project Structure

```
genai-content-studio/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Navbar.jsx
│       │   ├── OutputPanel.jsx
│       │   └── SamplePrompts.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── EmailGenerator.jsx
│       │   ├── ReportGenerator.jsx
│       │   ├── TechnicalExplainer.jsx
│       │   ├── TextImprover.jsx
│       │   ├── PromptGenerator.jsx
│       │   ├── HistoryPage.jsx
│       │   ├── SettingsPage.jsx
│       │   └── AboutPage.jsx
│       └── services/
│           └── api.js
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── prompts.py
│   ├── models.py
│   ├── database.py
│   ├── gemini_service.py
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── render.yaml
├── .gitignore
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Gemini API Key (Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Setup Backend
```bash
cd backend
python -m pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=8000
```

Start the FastAPI backend server:
```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```
Backend Swagger API docs will be available at: `http://localhost:8000/docs`

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📡 API Endpoints

- `GET /api/health` — Check server status & Gemini API key status
- `POST /api/email` — Email generator endpoint
- `POST /api/report` — Report generator endpoint
- `POST /api/explain` — Technical explainer endpoint
- `POST /api/improve` — Text improver endpoint
- `POST /api/prompt` — Prompt generator endpoint
- `GET /api/history` — Fetch generation history list
- `DELETE /api/history/{id}` — Delete specific history record
- `DELETE /api/history` — Clear all history records

---

## 🌐 Deployment Instructions

### Deploy Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable: `GEMINI_API_KEY` = `your_gemini_api_key`.

### Deploy Frontend to Vercel
1. Create a new Project on [Vercel](https://vercel.com).
2. Root directory: `frontend`
3. Framework preset: **Vite**
4. Set Environment Variable: `VITE_API_URL` = `https://your-backend.onrender.com`
5. Click **Deploy**.

---

## 🔮 Future Scope
- Add multi-language translation for email and report generators.
- Integrate voice-to-text input for hands-free prompt generation.
- Support PDF document upload for automatic document summarization (RAG pipeline).
