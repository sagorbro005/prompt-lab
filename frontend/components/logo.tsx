"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    animated?: boolean;
    className?: string;
}

export function PromptLabLogo({ size = "md", animated = true, className }: LogoProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-16 h-16",
    };

    return (
        <div className={cn("relative", className)}>
            {/* Glow Effect */}
            {animated && (
                <div className={cn(
                    "absolute inset-0 rounded-xl blur-xl opacity-60",
                    "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400",
                    "animate-pulse"
                )} />
            )}

            {/* Main Logo */}
            <div className={cn(
                "relative rounded-xl p-2",
                "bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400",
                "shadow-lg shadow-fuchsia-500/30",
                sizeClasses[size]
            )}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* Lab Flask / Beaker Shape */}
                    <path
                        d="M9 3V8.5L4.5 17C3.5 19 5 21 7 21H17C19 21 20.5 19 19.5 17L15 8.5V3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={animated ? "animate-[stroke-draw_2s_ease-in-out_infinite]" : ""}
                    />

                    {/* Flask Top */}
                    <path
                        d="M8 3H16"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />

                    {/* Bubbles / AI Nodes */}
                    <circle
                        cx="8"
                        cy="15"
                        r="1.5"
                        fill="white"
                        className={animated ? "animate-bounce" : ""}
                        style={{ animationDelay: "0s", animationDuration: "2s" }}
                    />
                    <circle
                        cx="12"
                        cy="17"
                        r="1.5"
                        fill="white"
                        className={animated ? "animate-bounce" : ""}
                        style={{ animationDelay: "0.3s", animationDuration: "2s" }}
                    />
                    <circle
                        cx="16"
                        cy="15"
                        r="1.5"
                        fill="white"
                        className={animated ? "animate-bounce" : ""}
                        style={{ animationDelay: "0.6s", animationDuration: "2s" }}
                    />

                    {/* Connection Lines (Neural Network Style) */}
                    <path
                        d="M8.5 14.5L11.5 16.5M12.5 16.5L15.5 14.5"
                        stroke="white"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        opacity="0.6"
                    />

                    {/* Spark / Magic Element */}
                    <path
                        d="M12 6L12.5 7.5L14 8L12.5 8.5L12 10L11.5 8.5L10 8L11.5 7.5L12 6Z"
                        fill="white"
                        className={animated ? "animate-pulse" : ""}
                    />
                </svg>
            </div>
        </div>
    );
}

// Alternative: Text-based stylized logo
export function PromptLabWordmark({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-baseline gap-0.5", className)}>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Prompt
            </span>
            <span className="text-xl font-bold text-white">
                Lab
            </span>
            <span className="text-fuchsia-400 text-lg font-light ml-0.5">.</span>
        </div>
    );
}
