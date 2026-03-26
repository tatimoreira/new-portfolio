import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getChatResponse } from "~/utils/openai.server";

export const config = { maxDuration: 30 };

export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
        return json({ error: "Invalid message" }, { status: 400 });
    }

    const reply = await getChatResponse(message, conversationHistory);

    return json({ reply });
};
