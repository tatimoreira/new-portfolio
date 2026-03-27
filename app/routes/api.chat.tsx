import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { streamChatResponse } from "~/utils/openai.server";

export const config = { runtime: "edge", maxDuration: 30 };

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
        return json({ error: "Invalid message" }, { status: 400 });
    }

    const stream = streamChatResponse(message, conversationHistory);

    return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
