---
date: 2026-03-27
---
# Adding an AI Chat to My Portfolio Card

The centerpiece of my portfolio is a 3D flip card — front shows my name and links, back reveals an AI chat that answers questions about my experience. This post covers how I built it: the card flip mechanic, the chat UI, and the API layer that powers it.

## The Idea

I wanted a way for visitors — especially recruiters — to get quick answers without having to read everything. Instead of a FAQ section, an AI that knows my resume felt more interesting to build and more useful to use. The constraint was that it had to live inside the existing card component, not as a separate page.

## The Card Flip

The card uses a CSS 3D flip technique powered by Framer Motion. The outer container has `perspective` set, and two absolutely positioned divs (front and back) share the same space. Each has `backface-hidden` applied, and flipping just animates `rotateY` from 0 to 180 degrees:

```tsx
<motion.div
    className="relative w-full h-full [transform-style:preserve-3d]"
    animate={{ rotateY: flipped ? 180 : 0 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
>
    {/* Front */}
    <div className="absolute w-full h-full ... backface-hidden">
        ...
    </div>

    {/* Back */}
    <div className="absolute w-full h-full ... backface-hidden" style={{ rotateY: 180 }}>
        ...
    </div>
</motion.div>
```

The back starts pre-rotated at 180 degrees, so when the container flips, it lands face-forward. The front disappears behind it because it has `backfaceVisibility: hidden`.

The card also has a 3D tilt effect on hover — tracking mouse position relative to the card center and mapping it to `rotateX`/`rotateY` values with `useSpring` for a natural feel. This only applies on the front; once flipped to chat, the tilt is disabled so it doesn't interfere with typing.

## The Chat UI

The back of the card is a self-contained chat interface with three parts:

**Message list** — scrollable area that renders user and assistant bubbles differently. User messages are right-aligned with a mauve/pink tint; assistant messages are left-aligned on white/10. `useRef` + `scrollIntoView` keeps the latest message visible as the conversation grows.

**Suggested prompts** — shown when the conversation is empty. Clicking one calls `handleSend` directly with the suggestion text, skipping the input field. This makes the first interaction frictionless:

```tsx
const SUGGESTIONS = [
    "What's your tech stack?",
    "Tell me about Web3 work",
    "Are you open to work?",
    "What's your best project?",
];
```

**Loading indicator** — three bouncing dots using `animate-bounce` with staggered `animation-delay` values. A small touch, but it makes the response feel alive while the API call is in flight.

## The API

The Remix action at `/api/chat` receives the message and full conversation history, then calls the OpenAI API:

```ts
// app/routes/api.chat.tsx
export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;
    const reply = await getChatResponse(message, conversationHistory);
    return json({ reply });
};
```

```ts
// app/utils/openai.server.ts
export async function getChatResponse(message, conversationHistory) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 80,
            temperature: 0.7,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...conversationHistory,
                { role: "user", content: message },
            ],
        }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
}
```

The conversation history is passed on each request so the model has context. The client keeps it in React state and sends the full array with every new message.

The raw `fetch` instead of the OpenAI SDK is intentional — the SDK adds weight to the bundle that matters on serverless cold starts. The API shape is stable enough that the SDK isn't buying much.

## The System Prompt

The system prompt is where the AI gets its "knowledge." It's a compact block of text with my experience, skills, availability, and personality — written to be dense but readable. I keep it tight to minimize token usage and to control the tone:

```
You are a concise AI assistant on Tatiana Moreira's portfolio.
Answer only from the info below. Keep replies to 1-2 sentences max. Be direct.
If something isn't covered, say so briefly.
```

The key constraint is `Answer only from the info below`. Without it, the model will happily invent details. With it, the AI declines gracefully when something isn't covered rather than hallucinating an answer.

## What I'd Do Differently

**Rate limiting.** Right now anyone can hammer the endpoint. A simple IP-based rate limit in the Remix action would be enough to prevent abuse.

**Streaming.** `gpt-4o-mini` is fast, but streaming the response word-by-word would feel more interactive. The OpenAI API supports it; it just requires handling a `ReadableStream` on the client instead of waiting for the full JSON response.

**Cost.** `gpt-4o-mini` is cheap — fractions of a cent per conversation — but it's not free. For a personal portfolio with modest traffic it's fine. If traffic were higher I'd consider caching common answers.

## Result

The chat has been the most-commented-on part of the portfolio. Recruiters in particular like being able to ask "are you open to work?" and get a direct answer instead of hunting through a page. Building it took less than a day — most of the complexity is in the CSS 3D transforms, not the AI integration itself.

The full source is on [GitHub](https://github.com/tatimoreira).
