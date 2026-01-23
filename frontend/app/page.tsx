'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { optimizePrompt, OptimizationResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from '@/components/settings-dialog';
import { VariationCard } from '@/components/variation-card';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PromptLabLogo, PromptLabWordmark } from '@/components/logo';
import { Loader2, Zap, History, Wand2, Rocket, Sparkles } from 'lucide-react';

import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Workbench() {
  const [prompt, setPrompt] = useState('');
  const [goal, setGoal] = useState('');
  const [model, setModel] = useState('gemini-flash');

  useEffect(() => {
    const savedModel = localStorage.getItem('promptlab_default_model');
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  const [result, setResult] = useState<OptimizationResponse | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const effectiveGoal = goal.trim() === '' ? undefined : goal;
      return await optimizePrompt(prompt, effectiveGoal, model);
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      console.error('Optimization failed:', error);
    }
  });

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Header */}
      <header className="glass border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <PromptLabLogo size="md" animated />
            <div>
              <PromptLabWordmark />
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Prompt Engineering</p>
            </div>
          </div>

          {/* Model Selector */}
          <div className="ml-6 glass-card rounded-xl px-3 py-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[180px] h-7 text-xs font-medium border-none bg-transparent shadow-none focus:ring-0 text-foreground">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="gemini-flash">⚡ Gemini 1.5 Flash</SelectItem>
                <SelectItem value="llama3-70b">🦙 Llama 3.3 70B</SelectItem>
                <SelectItem value="gemma-9b-groq">💎 Gemma 2 9B</SelectItem>
                <SelectItem value="mimo-v2">🚀 MiMo-V2 Flash</SelectItem>
                <SelectItem value="qwen-2.5-7b">🤗 Qwen 2.5 7B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-white/5">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </Link>
          <SettingsDialog defaultModel={model} onDefaultModelChange={setModel} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-w-[1800px] mx-auto">

          {/* LEFT: Input Panel */}
          <div className="flex flex-col gap-6 h-full">
            <Card className="glass-card glass-card-hover flex-1 flex flex-col rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="gradient-text text-lg">Draft Prompt</CardTitle>
                    <CardDescription className="text-muted-foreground/80">Enter your prompt and optimization goal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-5 p-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Original Prompt
                  </label>
                  <Textarea
                    placeholder="Enter your prompt to optimize... e.g., 'Write a marketing email for our new product'"
                    className="flex-1 resize-none font-mono text-sm leading-relaxed bg-background/50 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl placeholder:text-muted-foreground/40"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Optimization Goal
                    <span className="text-xs text-muted-foreground/60">(Optional)</span>
                  </label>
                  <Textarea
                    placeholder="e.g., Make it more persuasive and concise"
                    className="h-24 resize-none bg-background/50 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl placeholder:text-muted-foreground/40"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Optimize Button */}
            <Button
              size="lg"
              onClick={() => mutation.mutate()}
              disabled={!prompt || mutation.isPending}
              className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:via-purple-400 hover:to-cyan-400 border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 btn-glow"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Forging Perfection...
                </>
              ) : (
                <>
                  <Rocket className="mr-3 h-5 w-5" />
                  Optimize with AI
                </>
              )}
            </Button>
          </div>

          {/* RIGHT: Results Panel */}
          <div className="h-full flex flex-col">
            <Card className="glass-card h-full flex flex-col rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-pink-500/20">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="gradient-text text-lg">Optimization Results</CardTitle>
                    <CardDescription className="text-muted-foreground/80">
                      {result ? `${result.variations.length} variations generated` : "Results will appear here"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0 relative">
                {!result ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full blur-2xl" />
                      <div className="relative p-6 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/5">
                        <Sparkles className="w-12 h-12 text-purple-400/50 float" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground/70 mb-2">Ready to Forge</h3>
                    <p className="text-sm text-muted-foreground/50 max-w-[280px]">
                      Enter a prompt and click optimize to see AI-powered improvements
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                      {/* Best Result Highlight */}
                      <div className="gradient-border p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-md bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-sm font-semibold text-yellow-400">Best Variation</span>
                        </div>
                        <p className="font-mono text-sm leading-relaxed text-foreground/90 bg-background/30 rounded-lg p-3 border border-white/5">
                          {result.optimized_prompt}
                        </p>
                        <p className="text-xs text-muted-foreground mt-3 italic pl-3 border-l-2 border-yellow-500/30">
                          {result.improvements}
                        </p>
                      </div>

                      {/* All Variations */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <span className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
                          All Variations
                        </h3>
                        <div className="grid gap-4">
                          {result.variations.map((v, i) => (
                            <VariationCard
                              key={i}
                              variation={v}
                              index={i}
                              model={model}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-3 px-6 text-center text-xs text-muted-foreground/50">
        <span className="gradient-text font-medium">PromptLab</span> — AI-Powered Prompt Engineering · Built by <span className="text-foreground/70 font-medium">Shahadat Sagor</span>
      </footer>
    </div>
  );
}
