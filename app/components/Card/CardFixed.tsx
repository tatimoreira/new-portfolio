import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "~/utils/hooks/useIsMobile";
import ParagraphText from "../ParagraphText/ParagraphText";
import { GithubIcon } from "../Icons/GithubIcon";
import { LinkedInLogo } from "../Icons/LinkedInLogo";
import Button from "../Button/Button";
import { Theme, useTheme } from "~/utils/theme-provider";
import { DocumentIcon } from "../Icons/DocumentIcon";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
    "What's your tech stack?",
    "Tell me about Web3 work",
    "Are you open to work?",
    "What's your best project?",
];

export default function CardFixed() {
    const [theme] = useTheme();
    const tiltX = useMotionValue(0);
    const tiltY = useMotionValue(0);
    const rotateX = useSpring(tiltX, { stiffness: 150, damping: 20 });
    const rotateY = useSpring(tiltY, { stiffness: 150, damping: 20 });

    const [flipped, setFlipped] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isMobile = useIsMobile();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const initial = isMobile
        ? { x: -300, y: 200, rotate: -180, scale: 0.9, opacity: 0 }
        : { x: -1400, y: 500, rotate: -540, scale: 0.85, opacity: 0 };

    const animate = isMobile
        ? { x: [-300, 80, 0], y: [200, 40, 0], rotate: [-180, 20, 0], scale: [0.9, 1.05, 1], opacity: 1 }
        : { x: [-1400, 100, 50], y: [500, 120, 50], rotate: [-540, 30, 0], scale: [0.85, 1.05, 1], opacity: 1 };

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
        <div className="w-full px-4">
            <div className="flex justify-center [perspective:1000px]">
                <motion.div
                    className="pointer-events-auto w-full max-w-[300px] h-[450px] sm:max-w-[700px] sm:h-96"
                    style={{ rotateX, rotateY }}
                    initial={initial}
                    animate={animate}
                    transition={{
                        x: { type: "spring", stiffness: isMobile ? 140 : 120, damping: isMobile ? 18 : 20, mass: 0.8 },
                        y: { type: "spring", stiffness: 130, damping: 22 },
                        rotate: { type: "spring", stiffness: 90, damping: 16 },
                        scale: { duration: 0.6, ease: "easeOut" },
                        opacity: { duration: 0.2 },
                    }}
                    onMouseMove={(e) => {
                        if (flipped) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        tiltX.set((y / rect.height) * -15);
                        tiltY.set((x / rect.width) * 15);
                    }}
                    onMouseLeave={() => {
                        tiltX.set(0);
                        tiltY.set(0);
                    }}
                >
                    <motion.div
                        className="relative w-full h-full [transform-style:preserve-3d]"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        {/* FRONT */}
                        <div className="absolute w-full h-full rounded-2xl shadow-xl flex items-center justify-center backface-hidden bg-white/10 backdrop-blur-md border border-white/25">
                            <div className="p-4 text-center">
                                <span className="font-work text-3xl sm:text-5xl font-extrabold text-[#f5b1cc]">
                                    Tatiana Moreira
                                </span>
                                <p className="font-work text-3xl sm:text-5xl font-extrabold text-light-text-color dark:text-dark-text-color">
                                    Software Developer
                                </p>
                                <ParagraphText>Crafting web experiences</ParagraphText>
                                <div className="flex mb-4 justify-center gap-2">
                                    <a href="https://github.com/tatimoreira" target="_blank" rel="noopener noreferrer">
                                        <GithubIcon fillColor={theme === Theme.LIGHT ? "black" : "white"} />
                                    </a>
                                    <a href="https://www.linkedin.com/in/tmoreirab/" target="_blank" rel="noopener noreferrer">
                                        <LinkedInLogo fillColor={theme === Theme.LIGHT ? "black" : "white"} />
                                    </a>
                                </div>
                                <div className="flex gap-2 justify-center flex-wrap">
                                    <Button
                                        onClick={() => window.open("https://drive.google.com/file/d/1Px0G7dOpRjqvlDODfOHANUBqqEdBppaA/view?usp=sharing", "_blank")}
                                        icon={<DocumentIcon fillColor="#f5b1cc" />}
                                    >
                                        Resume
                                    </Button>
                                    <Button onClick={() => setFlipped(true)} icon={<span>✨</span>}>
                                        Ask me
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* BACK — Chat */}
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
                                        onClick={() => setFlipped(false)}
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
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
