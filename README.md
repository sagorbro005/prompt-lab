# PromptLab 🧪 — AI-Powered Prompt Engineering IDE

![PromptLab Banner](https://img.shields.io/badge/Status-Operational-green?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

**PromptLab** is a professional, high-performance IDE designed to help developers and prompt engineers optimize, test and manage LLM prompts with precision.

It combines genetic improvement algorithms, multi-model testing and a premium "Cyber-Laboratory" UI to provide a state-of-the-art workflow for crafting perfect AI instructions.

---

## 🚀 Key Features

### 🧬 Genetic Prompt Optimization
- **AI-Driven Refinement**: Automatically generates 3 distinct variations of your draft prompt (Structural, Cognitive, Creative).
- **Expert Critiques**: Provides detailed reasoning *why* a variation is better.
- **Scoring System**: Assigns a quality score (0-100) to each prompt variation.

### ⚡ Live Test Playground
- **Instant Execution**: Test any optimized prompt directly within the IDE.
- **Multi-Model Support**: Switch between top-tier models instantly:
  - ⚡ **Gemini 1.5 Flash** (Google)
  - 🦙 **Llama 3.3 70B** (Groq)
  - 💎 **Gemma 2 9B** (Groq)
  - 🚀 **MiMo-V2 Flash** (OpenRouter)
  - 🤗 **Qwen 2.5 7B** (Hugging Face)

### 💎 Premium Experience
- **Futuristic UI**: Glassmorphism, animated gradients and vibrant neon aesthetics.
- **Visual Analytics**: Color-coded badges and score indicators.
- **History Tracking**: Automatically archives all optimization runs using Supabase.
- **Persistent Settings**: Remembers your preferred default model.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `tw-animate-css`
- **UI Components**: Shadcn/UI (Radix Primitives)
- **Icons**: Lucide React
- **State Management**: TanStack Query

### Backend
- **API**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.9+)
- **AI Orchestration**: Custom `GeneticPromptOptimizer` service
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Clients**: `httpx`, `litellm`

---

## 🏗️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Supabase Project (for History)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/prompt-lab.git
cd prompt-lab
```

### 2. Backend Setup
```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment
# Rename .env.example to .env and add your API keys:
# GEMINI_API_KEY=...
# GROQ_API_KEY=...
# SUPABASE_URL=...
# SUPABASE_KEY=...

# Run the API Server
uvicorn main:app --reload
```
*The backend runs on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the Development Server
npm run dev
```
*The frontend runs on `http://localhost:3000`*

---

## 🗄️ Database Schema (Supabase)

To enable the History feature, run the following SQL in your Supabase SQL Editor:

```sql
create table public.optimizations (
  id uuid primary key default gen_random_uuid(),
  original_prompt text not null,
  optimized_prompt text not null,
  improvement_score integer not null,
  improvements text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.optimizations enable row level security;

create policy "Enable insert for all users" on public.optimizations for insert with check (true);
create policy "Enable select for all users" on public.optimizations for select using (true);
```

---

## 👤 Attribution

**Built by [Shahadat Sagor](https://github.com/sagorbro005)**

Designed with a passion for AI and modern UI/UX.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
