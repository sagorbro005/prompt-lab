"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings, Check, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function SettingsDialog({ defaultModel, onDefaultModelChange }: { defaultModel: string, onDefaultModelChange: (model: string) => void }) {
    const [localModel, setLocalModel] = useState(defaultModel)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setLocalModel(defaultModel)
    }, [defaultModel])

    const handleSave = () => {
        onDefaultModelChange(localModel)
        localStorage.setItem('promptlab_default_model', localModel)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 sm:max-w-[450px]">
                <DialogHeader className="pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                            <Settings className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <DialogTitle className="gradient-text">Settings</DialogTitle>
                            <DialogDescription className="text-muted-foreground/80">
                                Configure your PromptLab preferences
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="model" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Default AI Model
                        </Label>
                        <Select value={localModel} onValueChange={setLocalModel}>
                            <SelectTrigger className="h-11 bg-background/50 border-white/10 rounded-lg focus:border-purple-500/50 focus:ring-purple-500/20">
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-white/10">
                                <SelectItem value="gemini-flash">⚡ Gemini 1.5 Flash</SelectItem>
                                <SelectItem value="llama3-70b">🦙 Llama 3.3 70B (Groq)</SelectItem>
                                <SelectItem value="gemma-9b-groq">💎 Gemma 2 9B (Groq)</SelectItem>
                                <SelectItem value="mimo-v2">🚀 MiMo-V2 Flash (OpenRouter)</SelectItem>
                                <SelectItem value="qwen-2.5-7b">🤗 Qwen 2.5 7B (Hugging Face)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground/60 pl-1">
                            This model will be selected by default when you open PromptLab
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <Button
                        onClick={handleSave}
                        className="w-full h-11 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border-0 shadow-lg shadow-purple-500/20"
                    >
                        {saved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            "Save Preferences"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
