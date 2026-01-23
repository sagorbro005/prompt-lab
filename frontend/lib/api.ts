import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Variation {
    variation: string;
    critique: string;
    score: number;
}

export interface OptimizationResponse {
    original_prompt: string;
    optimized_prompt: string;
    improvements: string;
    variations: Variation[];
    created_at: string;
}

export const optimizePrompt = async (prompt: string, goal?: string, model?: string) => {
    const response = await api.post<OptimizationResponse>('/optimize', {
        prompt,
        goal,
        model,
    });
    return response.data;
};

export const generateCompletion = async (prompt: string, model: string) => {
    const response = await api.post<{ result: string }>('/generate', {
        prompt,
        model
    });
    return response.data;
};

export default api;
