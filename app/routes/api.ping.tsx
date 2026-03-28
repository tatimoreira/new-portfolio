import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    const start = Date.now();

    if (!process.env.OPENAI_API_KEY) {
        return json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                max_tokens: 5,
                messages: [{ role: "user", content: "hi" }],
            }),
        });
        const data = await res.json();
        return json({ ok: true, ms: Date.now() - start, reply: data.choices[0].message.content });
    } catch (err) {
        return json({ ok: false, ms: Date.now() - start, error: err instanceof Error ? err.message : String(err) });
    }
};
