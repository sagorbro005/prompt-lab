"use client";

import { Button } from "@/components/ui/button";
import { Variation, generateCompletion } from "@/lib/api";
import { Loader2, Play, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VariationCardProps {
    variation: Variation;
    index: number;
    model: string;
}

export function VariationCard({ variation, index, model }: VariationCardProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const res = await generateCompletion(variation.variation, model);
            setOutput(res.result);
        } catch (error) {
            console.error("Run failed:", error);
            setOutput("Error generating output. Please check the backend logs.");
        } finally {
            setIsRunning(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(variation.variation);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Score-based styling
    const getScoreStyle = () => {
        if (variation.score >= 90) return { badge: "score-excellent", border: "border-green-500/30", glow: "shadow-green-500/10" };
        if (variation.score >= 80) return { badge: "score-good", border: "border-cyan-500/30", glow: "shadow-cyan-500/10" };
        return { badge: "score-average", border: "border-yellow-500/30", glow: "shadow-yellow-500/10" };
    };

    const scoreStyle = getScoreStyle();

    return (
        <div className={cn(
            "glass-card glass-card-hover rounded-xl overflow-hidden",
            scoreStyle.border,
            `shadow-lg ${scoreStyle.glow}`
        )}>
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-xs font-bold text-purple-300">
                            #{index + 1}
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-bold", scoreStyle.badge)}>
                            Score {variation.score}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
                        onClick={copyToClipboard}
                        title="Copy Prompt"
                    >
                        {isCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Prompt Text */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="relative font-mono text-sm leading-relaxed text-foreground/90 bg-background/30 border border-white/5 rounded-lg p-4 whitespace-pre-wrap">
                        {variation.variation}
                    </p>
                </div>

                {/* Critique */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 text-purple-400/60 flex-shrink-0" />
                    <p className="italic leading-relaxed">{variation.critique}</p>
                </div>

                {/* Test Button */}
                <Button
                    onClick={handleRun}
                    disabled={isRunning}
                    variant="secondary"
                    className={cn(
                        "w-full h-11 rounded-lg font-medium transition-all duration-300",
                        "bg-gradient-to-r from-purple-600/80 to-cyan-600/80",
                        "hover:from-purple-500 hover:to-cyan-500",
                        "text-white border-0",
                        "shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                    )}
                >
                    {isRunning ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing Prompt...
                        </>
                    ) : (
                        <>
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            Test with {model.split('-')[0].toUpperCase()}
                        </>
                    )}
                </Button>
            </div>

            {/* Output Area */}
            {(output || isRunning) && (
                <div className="border-t border-white/5 bg-gradient-to-b from-purple-500/5 to-transparent p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                            AI Response
                        </span>
                        {isRunning && <span className="text-xs text-muted-foreground animate-pulse">Generating...</span>}
                    </div>
                    <div className="bg-background/50 rounded-lg border border-white/5 p-4 font-mono text-sm min-h-[80px] max-h-[300px] overflow-y-auto whitespace-pre-wrap shadow-inner">
                        {output || <span className="text-muted-foreground/40">Waiting for response...</span>}
                    </div>
                </div>
            )}
        </div>
    );
}
