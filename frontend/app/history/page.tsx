'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { PromptLabLogo, PromptLabWordmark } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HistoryItem {
    id: string;
    original_prompt: string;
    optimized_prompt: string;
    improvement_score: number;
    improvements: string;
    created_at: string;
}

const fetchHistory = async () => {
    const response = await api.get<HistoryItem[]>('/history');
    return response.data;
};

export default function HistoryPage() {
    const { data: history, isLoading, isError } = useQuery({
        queryKey: ['history'],
        queryFn: fetchHistory,
    });

    const getScoreBadgeClass = (score: number) => {
        if (score >= 90) return "score-excellent";
        if (score >= 80) return "score-good";
        return "score-average";
    };

    return (
        <div className="min-h-screen flex flex-col font-sans relative">
            {/* Animated Background */}
            <div className="animated-bg" />

            {/* Header */}
            <header className="glass border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="hover:bg-white/5">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <PromptLabLogo size="md" animated />
                        <div>
                            <PromptLabWordmark />
                            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Optimization History</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8">
                <div className="max-w-4xl mx-auto w-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                            <p className="text-muted-foreground">Loading history...</p>
                        </div>
                    ) : isError ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-4">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-400 mb-2">Connection Error</h3>
                            <p className="text-muted-foreground">Failed to load history. Is the backend running?</p>
                        </div>
                    ) : history?.length === 0 ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <div className="inline-flex p-4 rounded-full bg-purple-500/10 mb-4">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">No History Yet</h3>
                            <p className="text-muted-foreground mb-6">Your optimized prompts will appear here</p>
                            <Link href="/">
                                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border-0">
                                    Start Optimizing
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {history?.map((item) => (
                                <Card key={item.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden">
                                    <CardHeader className="pb-3 border-b border-white/5">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base font-mono truncate text-foreground/90">
                                                    {item.original_prompt}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleString()}
                                                </CardDescription>
                                            </div>
                                            <div className={cn("px-3 py-1 rounded-full text-xs font-bold flex-shrink-0", getScoreBadgeClass(item.improvement_score))}>
                                                Score {item.improvement_score}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase text-cyan-400 tracking-wider flex items-center gap-2">
                                                <Sparkles className="w-3 h-3" />
                                                Optimized Version
                                            </p>
                                            <div className="bg-background/30 border border-white/5 rounded-lg p-4 font-mono text-sm text-foreground/90">
                                                {item.optimized_prompt}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider">Improvements</p>
                                            <p className="text-sm text-muted-foreground italic pl-3 border-l-2 border-purple-500/30">{item.improvements}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="glass border-t border-white/5 py-3 px-6 text-center text-xs text-muted-foreground/50">
                <span className="gradient-text font-medium">PromptLab</span> — AI-Powered Prompt Engineering · Built by <span className="text-foreground/70 font-medium">Shahadat Sagor</span>
            </footer>
        </div>
    );
}
