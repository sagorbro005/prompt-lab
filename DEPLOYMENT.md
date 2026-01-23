# ☁️ PromptLab Deployment Guide

This guide will help you deploy **PromptLab** for **FREE** using **Vercel** (Frontend) and **Render** (Backend).

---

## 🏗️ Phase 1: Deploy Backend (Render)
We will deploy the Python FastAPI backend first.

1.  **Push your code to GitHub** (if you haven't already).
2.  **Sign Up/Login to [Render](https://render.com/)**.
3.  Click **"New +"** and select **"Web Service"**.
4.  Connect your GitHub repository.
5.  **Settings**:
    - **Name**: `promptlab-backend` (or similar)
    - **Root Directory**: `backend`
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6.  **Environment Variables**:
    - Add the API keys you used locally (`GEMINI_API_KEY`, `GROQ_API_KEY`, etc.).
    - `SUPABASE_URL`: Your Supabase Project URL.
    - `SUPABASE_KEY`: Your Supabase Anon Key.
    - `FRONTEND_URL`: `*` (or your future Vercel URL).
7.  Click **"Create Web Service"**.
8.  **Copy the URL**: Once deployed, Render will give you a URL like `https://promptlab-backend.onrender.com`. **Save this.**

> **Note**: The free tier on Render spins down after inactivity. The first request might take 50 seconds to wake it up.

---

## 🎨 Phase 2: Deploy Frontend (Vercel)
Now we deploy the Next.js frontend.

1.  **Sign Up/Login to [Vercel](https://vercel.com/)**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Framework Preset**: It should auto-detect **Next.js**.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    - Key: `NEXT_PUBLIC_API_URL`
    - Value: `https://promptlab-backend.onrender.com` (The URL you got from Render).
    - **Important**: Do NOT add a trailing slash `/` at the end.
7.  Click **"Deploy"**.

---

## ✅ Verification
1.  Open your new Vercel URL (e.g., `https://promptlab.vercel.app`).
2.  **Test**: Try optimizing a prompt.
3.  **Troubleshooting**:
    - If it fails, check the "Console" in browser developer tools (F12).
    - If it says "CORS error", ensure `FRONTEND_URL` in Render matches your Vercel URL exactly (or use `*` for testing).
