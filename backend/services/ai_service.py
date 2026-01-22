import os
import httpx
import json
from typing import List
from models.schemas import OptimizationRequest, OptimizationResponse, Variation
from dotenv import load_dotenv

load_dotenv()

class GeneticPromptOptimizer:
    def __init__(self, api_key: str = None):
        # Priority: Request Key > Env Key (Gemini)
        self.gemini_key = api_key or os.getenv("GEMINI_API_KEY")
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY")
        self.hf_key = os.getenv("HUGGINGFACE_API_KEY")

    def generate_variations(self, prompt: str, goal: str = None, model: str = "gemini-flash") -> List[Variation]:
        """
        Generates 3 variations of the prompt using AI (Gemini, Groq, OpenRouter, or Hugging Face).
        """


        effective_goal = goal if goal and goal.strip() else "Improve clarity, structure, and effectiveness."


        user_msg = f"""
        You are a World-Class Prompt Engineer and AI Optimization Specialist. 
        Your objective is to transform the user's Draft Prompt into a professional, high-performance prompt that yields perfect results.

        ---
        INPUTS:
        DRAFT PROMPT: "{prompt}"
        OPTIMIZATION GOAL: "{effective_goal}"
        ---

        INSTRUCTIONS:
        1. Analyze the Draft Prompt for ambiguity, weak verbs, lack of context, and structural issues.
        2. Generate 3 DISTINCT variations that achieve the Optimization Goal with professional excellence:
           - Variation 1: The "Structural Enhancement". Focus on formatting, clear sections, and step-by-step instructions.
           - Variation 2: The "Cognitive Precision". Focus on precise terminology, constraints, and chain-of-thought requirements.
           - Variation 3: The "Creative/Persuasive". Focus on tone, engagement, and compelling language (if relevant to goal).
        
        3. CRITIQUE REQUIREMENTS:
           - Do not just say "Improved clarity." Be specific such as "Replaced passive voice with active commands."
           - The critique must justify WHY this variation is professional and effective.

        4. OUTPUT FORMAT:
        You must output strict, valid JSON. Do not include markdown naming like ```json.
        [
            {{
                "variation": "...", 
                "critique": "...", 
                "score": 92 
            }},
            ...
        ]
        """

        try:
            if "llama" in model.lower():
                return self._generate_groq(user_msg, "llama-3.3-70b-versatile")
            elif "gemma" in model.lower() and "groq" in model.lower():
                return self._generate_groq(user_msg, "gemma2-9b-it")
            elif "mimo" in model.lower() or "openrouter" in model.lower():
                return self._generate_openrouter(user_msg, "xiaomi/mimo-v2-flash:free")
            elif "qwen" in model.lower() or "huggingface" in model.lower():
                # Qwen 2.5 72B is likely too large for free tier (404/410 errors).
                # Switching to Qwen 2.5 7B Instruct which is definitely supported on free tier.
                return self._generate_huggingface(user_msg, "Qwen/Qwen2.5-7B-Instruct")
            else:
                # Default to Gemini for gemini-flash or unknown
                return self._generate_gemini(user_msg)

        except Exception as e:
            print(f"AI Generation failed ({model}): {e}")
            return [
                Variation(
                    variation=f"Fallback Variation (Error in {model})",
                    critique=f"Error: {str(e)}",
                    score=50
                )
            ]

    def generate_completion(self, prompt: str, model: str) -> str:
        """
        Raw generation for the Playground feature.
        """
        # Simple routing logic similar to above, but returning raw string
        if "llama" in model.lower():
            # Groq Llama
            return self._generate_groq_raw(prompt, "llama-3.3-70b-versatile")
        elif "gemma" in model.lower() and "groq" in model.lower():
            return self._generate_groq_raw(prompt, "gemma2-9b-it")
        elif "mimo" in model.lower() or "openrouter" in model.lower():
            return self._generate_openrouter_raw(prompt, "xiaomi/mimo-v2-flash:free")
        elif "qwen" in model.lower() or "huggingface" in model.lower():
            return self._generate_huggingface_raw(prompt, "Qwen/Qwen2.5-7B-Instruct")
        else:
            # Default Gemini
            return self._generate_gemini_raw(prompt)


    def _generate_gemini_raw(self, message: str) -> str:
        if not self.gemini_key: raise Exception("Gemini Key missing")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={self.gemini_key}"
        payload = {"contents": [{"parts": [{"text": message}]}]}
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload, headers={"Content-Type": "application/json"})
        if response.status_code != 200: raise Exception(f"Gemini Error: {response.text}")
        return response.json()['candidates'][0]['content']['parts'][0]['text']

    def _generate_groq_raw(self, message: str, model_id: str) -> str:
        if not self.groq_key: raise Exception("Groq Key missing")
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.groq_key}", "Content-Type": "application/json"}
        payload = {"model": model_id, "messages": [{"role": "user", "content": message}], "temperature": 0.7}
        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload, headers=headers)
        if response.status_code != 200: raise Exception(f"Groq Error: {response.text}")
        return response.json()['choices'][0]['message']['content']

    def _generate_openrouter_raw(self, message: str, model_id: str) -> str:
        if not self.openrouter_key: raise Exception("OpenRouter Key missing")
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.openrouter_key}", "Content-Type": "application/json"}
        payload = {"model": model_id, "messages": [{"role": "user", "content": message}], "temperature": 0.7}
        with httpx.Client(timeout=45.0) as client:
            response = client.post(url, json=payload, headers=headers)
        if response.status_code != 200: raise Exception(f"OpenRouter Error: {response.text}")
        return response.json()['choices'][0]['message']['content']

    def _generate_huggingface_raw(self, message: str, model_id: str) -> str:
        if not self.hf_key: raise Exception("HF Key missing")
        url = "https://router.huggingface.co/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.hf_key}", "Content-Type": "application/json"}
        payload = {"model": model_id, "messages": [{"role": "user", "content": message}], "max_tokens": 1024}
        with httpx.Client(timeout=60.0) as client:
            response = client.post(url, json=payload, headers=headers)
        if response.status_code != 200: raise Exception(f"HF Error: {response.text}")
        return response.json()['choices'][0]['message']['content']

    def _generate_huggingface(self, message: str, model_id: str) -> List[Variation]:
        if not self.hf_key:
            raise Exception("Hugging Face API Key missing. Please set HUGGINGFACE_API_KEY in .env")

        # Unified Router Endpoint (OpenAI Compatible)
        url = "https://router.huggingface.co/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.hf_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model_id, # e.g. "Qwen/Qwen2.5-7B-Instruct"
            "messages": [
                {"role": "system", "content": "You are a JSON-only API. You must return ONLY a JSON array."},
                {"role": "user", "content": message}
            ],
            "max_tokens": 2048,
            "temperature": 0.7
        }

        with httpx.Client(timeout=60.0) as client:
            response = client.post(url, json=payload, headers=headers)

        if response.status_code != 200:
             # Try to parse error
            try:
                err_msg = response.json().get('error', response.text)
            except:
                err_msg = response.text
            raise Exception(f"Hugging Face API Error {response.status_code}: {err_msg}")

        data = response.json()
        try:
             # Standard OpenAI-style response for HF v1/chat/completions
            content = data['choices'][0]['message']['content']
        except (KeyError, IndexError):
             raise Exception(f"Unexpected Hugging Face response: {data}")
             
        return self._parse_json_response(content)



    def _generate_gemini(self, message: str) -> List[Variation]:
        if not self.gemini_key:
            raise Exception("Gemini API Key missing")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={self.gemini_key}"
        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": [{"text": message}]}]}

        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            raise Exception(f"Gemini API Error {response.status_code}: {response.text}")

        data = response.json()
        content = data['candidates'][0]['content']['parts'][0]['text']
        return self._parse_json_response(content)

    def _generate_groq(self, message: str, model_id: str) -> List[Variation]:
        if not self.groq_key:
            raise Exception("Groq API Key missing. Please set GROQ_API_KEY in .env")

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.groq_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": "You are a JSON-only API. You must return ONLY a JSON array."},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7
        }


        with httpx.Client(timeout=30.0) as client:
            response = client.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            raise Exception(f"Groq API Error {response.status_code}: {response.text}")

        data = response.json()
        try:
            content = data['choices'][0]['message']['content']
        except (KeyError, IndexError):
            raise Exception(f"Unexpected Groq response: {data}")
            
        return self._parse_json_response(content)

    def _generate_openrouter(self, message: str, model_id: str) -> List[Variation]:
        if not self.openrouter_key:
            raise Exception("OpenRouter API Key missing. Please set OPENROUTER_API_KEY in .env")

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.openrouter_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model_id,
            "messages": [
                {"role": "system", "content": "You are a JSON-only API. You must return ONLY a JSON array."},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7
        }

        with httpx.Client(timeout=45.0) as client:
            response = client.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            raise Exception(f"OpenRouter API Error {response.status_code}: {response.text}")

        data = response.json()
        try:
            content = data['choices'][0]['message']['content']
        except (KeyError, IndexError):
             raise Exception(f"Unexpected OpenRouter response: {data}")
             
        return self._parse_json_response(content)

    def _parse_json_response(self, content: str) -> List[Variation]:
        clean_content = content.replace("```json", "").replace("```", "").strip()
        variations_data = json.loads(clean_content)
        return [Variation(**v) for v in variations_data]


    def optimize(self, request: OptimizationRequest) -> OptimizationResponse:
        variations = self.generate_variations(request.prompt, request.goal, request.model)
        
        # Sort by score descending
        variations.sort(key=lambda x: x.score, reverse=True)
        
        return OptimizationResponse(
            original_prompt=request.prompt,
            optimized_prompt=variations[0].variation,
            improvements=variations[0].critique,
            variations=variations
        )

