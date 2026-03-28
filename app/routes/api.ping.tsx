import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import OpenAI from "openai";

export const loader: LoaderFunction = async () => {
    const start = Date.now();

    if (!process.env.OPENAI_API_KEY) {
        return json({ error: "OPENAI_API_KEY not set" }, { status: 500 });
    }

    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const res = await client.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 5,
            messages: [{ role: "user", content: "hi" }],
        });
        return json({
            ok: true,
            ms: Date.now() - start,
            reply: res.choices[0].message.content,
        });
    } catch (err) {
        return json({
            ok: false,
            ms: Date.now() - start,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};
