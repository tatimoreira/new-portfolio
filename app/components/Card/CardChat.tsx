import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
    "What's your tech stack?",
    "Tell me about Web3 work",
    "Are you open to work?",
    "What's your best project?",
];

interface CardChatProps {
    onBack: () => void;
}

export default function CardChat({ onBack }: CardChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function handleSend(text?: string) {
        const message = text ?? input;
        if (!message.trim() || loading) return;

        const newMessages: Message[] = [...messages, { role: "user", content: message }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, conversationHistory: messages }),
            });
            const data = await res.json();
            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch {
            setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Try again!" }]);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        handleSend();
    }

    return (
        <motion.div
            className="absolute w-full h-full rounded-2xl shadow-xl backface-hidden bg-white/10 backdrop-blur-md border border-white/25"
            style={{ backfaceVisibility: "hidden", rotateY: 180 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col h-full p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 shrink-0">
                    <span className="font-work font-bold text-[#f5b1cc] text-sm sm:text-base">
                        Ask Tati's AI anything
                    </span>
                    <button
                        onClick={onBack}
                        className="text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded hover:bg-white/10"
                    >
                        ← back
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1">
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col gap-2 pt-2">
                            <p className="text-xs text-gray-400 mb-1">Try asking:</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleSend(s)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-[#f5b1cc]/40 text-[#f5b1cc] hover:bg-[#f5b1cc]/10 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <span
                                className={`text-xs sm:text-sm px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                                    m.role === "user"
                                        ? "bg-[#f5b1cc]/20 text-light-text-color dark:text-dark-text-color rounded-br-sm"
                                        : "bg-white/10 text-light-text-color dark:text-dark-text-color rounded-bl-sm"
                                }`}
                            >
                                {m.content}
                            </span>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <span className="text-xs px-3 py-2 rounded-2xl bg-white/10 text-gray-400 rounded-bl-sm">
                                <span className="inline-flex gap-1">
                                    <span className="animate-bounce [animation-delay:0ms]">·</span>
                                    <span className="animate-bounce [animation-delay:150ms]">·</span>
                                    <span className="animate-bounce [animation-delay:300ms]">·</span>
                                </span>
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex gap-2 mt-3 shrink-0">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about skills, experience..."
                        className="flex-1 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-full px-4 py-2 outline-none focus:border-[#f5b1cc]/50 text-light-text-color dark:text-dark-text-color placeholder-gray-400 transition-colors"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="text-xs px-4 py-2 rounded-full bg-[#f5b1cc]/20 text-[#f5b1cc] border border-[#f5b1cc]/40 hover:bg-[#f5b1cc]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
