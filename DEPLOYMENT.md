# 🚀 Deployment Guide for PromptLab

This guide will walk you through deploying your **Next.js Frontend** to Vercel and your **FastAPI Backend** to Render.

---

## 📋 Prerequisites
1.  **GitHub Account**: Push your code to a new GitHub repository.
2.  **Supabase Project**: You already have this set up.
3.  **API Keys**: Have all your keys ready (`GEMINI_API_KEY`, etc.).

---

## 1️⃣ Deploy Backend (Render)
We will use [Render](https://render.com/) because it has a native Python support and a free tier.

1.  Create an account on **Render**.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables** (Add these in the "Environment" tab):
    *   `GEMINI_API_KEY`: (Your Key)
    *   `GROQ_API_KEY`: (Your Key)
    *   `OPENROUTER_API_KEY`: (Your Key)
    *   `HUGGINGFACE_API_KEY`: (Your Key)
    *   `SUPABASE_URL`: (Your URL)
    *   `SUPABASE_KEY`: (Your Key)
    *   `PYTHON_VERSION`: `3.9.0` (Optional, ensures compatibility)
6.  Click **Create Web Service**.
7.  **Copy URL**: Once deployed, copy your backend URL (e.g., `https://promptlab-backend.onrender.com`).

---

## 2️⃣ Deploy Frontend (Vercel)
Vercel is the creators of Next.js and the best place to host it.

1.  Create an account on [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should detect automatically).
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste your **Render Backend URL** here (e.g., `https://promptlab-backend.onrender.com`).
    *   *Note: Do not add a trailing slash `/` at the end.*
6.  Click **Deploy**.

---

## 3️⃣ Final Check
1.  Open your Vercel URL (e.g., `https://promptlab.vercel.app`).
2.  Try optimizing a prompt.
3.  If it works, you are live! 🚀

---

### ⚠️ Troubleshooting
- **CORS Error**: If the frontend cannot talk to the backend, check `backend/main.py`. You might need to update the `origins` list to include your new Vercel domain.
  ```python
  origins = [
      "http://localhost:3000",
      "https://your-project-name.vercel.app" # Add me!
  ]
  ```
