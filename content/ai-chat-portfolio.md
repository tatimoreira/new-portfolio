---
date: 2026-03-27
---
# Adding a AI chat to interact with my personal site and some thoughts about AI

## Why?
### Interactive portfolio
I always wanted an interactive portfolio where the visitors really have fun and feel emotions. Thats why the idea to have a chat where you can ask and being answered came natural to this concept.
### AI is taking our jobs
As many of my peers currently Im looking for a job, in a context where AI is “taking our jobs”
Building this feature into my personal space is in part a way to explore the capabilities of this technology but there's also, I have to admit, a sarcastic aspect in it, the human in me reclaiming her place in the collective HUMAN creativity.
Are “AI” “agents” “LLMs” “prompt" “assisted" the new buzz words? So let's build something with what they want to find now in our resume ;)


### The IndieWeb
I currently found out about the [IndieWeb](https://indieweb.org/)   community and I got very excited because to own my "digital corner" and make it mine was the first motivation to start building my site. 

From the moment I conceveid to this site I wanted it to be a digital playground for my creativity regarding web development as many of my artistic expressions.

I think that cultivate intelligence (the real one) is crucial in this era, Im still learning about The IndieWeb but I feel that if you're a rebel like me and like many others you should check it out and start building and owning your digital space, let's make the internet fun again!

## The Idea
My portfolio is very simple. It consists of a main card which flips. In the first version when the user flips the card you can read a text showing more about my tech stack, this was ok for a first version but I wanted something more interactive.
So taking advantage of the card effect I decided that the AI chat must replace the “About” text on the back part of the Card instead.
I wanted a simple chat window which can answer questions about my career, my experience, my state of currently looking for a job and very important to highlight the work done in this personal site.

## The Architecture

The stack was already Remix + Vercel, so I leaned into what the framework gives you.

**Server-side action, not a client-side fetch to OpenAI directly.** I could have called the OpenAI API from the browser, but that would expose the API key. Remix's `action` functions run on the server, so the key never leaves the backend. The frontend just POSTs to `/api/chat` and gets a reply back.

**gpt-4o-mini over gpt-4o.** For this use case Mini is around 15x cheaper per token. 

**The system prompt as text** 

**Conversation history in the client.** Remix actions are stateless — there's no session store between requests. Rather than adding a database or Redis just to track chat history, I keep the conversation array in React state and send it with each POST. The server forwards it to OpenAI alongside the new message. The model gets full context, no persistence layer required.

## The UI Decisions

**Suggestion chips on empty state.** The hardest UX problem with a chat interface is the blank slate — people freeze when they don't know what to ask. Four chips handle this: "What's your stack?", "Tell me about Web3 work", "Are you open to work?", "What's your best project?". They also double as a soft signal of what the AI is good at answering.

**Typing indicator.** Three bouncing dots while the AI is responding. Small detail, but it makes the wait feel intentional rather than broken.

**Flip back button.** The card back has a `← back` button that flips to the front. Clicking the input or send button doesn't accidentally re-flip the card.


## Implementation

### UI related

#### The chat: 
At the back of the Card there is this CardChat component which consist on the below parts

* **Message list**:  scrollable area that renders user and assistant bubbles differently. 
Suggested prompts: shown when the conversation is empty. Clicking one calls handleSend directly with the suggestion text, skipping the input field. This makes the first interaction frictionless:

```
const SUGGESTIONS = [
    "What's your tech stack?",
    "Tell me about Web3 work",
    "Are you open to work?",
    "What's your best project?",
];
```

* **Loading indicator**:  three bouncing dots using animate-bounce with staggered animation-delay values. A small touch, but it makes the response feel alive while the API call is in flight.


### The System Prompt and some thoughts about subscriptions 

The system prompt is where the AI gets its “knowledge.” It’s a compact block of text with my experience, skills, availability, and some aspects of my personality. 

One of the constrains I found when aspiring to make the context of "my AI" to be very detailed,   I needed to keep it tight to minimize token usage and this limited the precision about "me" that I really wanted to give to this project.
At the beggining I added my full resume as a JavaScript object, and wanted the context to contemplate my blog post contents, know about my life outside work, my hobbies and really make it "know a lot about me" so people can relate.
But you know everything is a payed subscribtion and I didnt want to pay more for "my intelligence".
And this bugs me a little bit that now in order to stand out as a "developer" you need to pay this and that susbcription to have access to "intelligence" and now you need to learn how to use these tools and let's accept it being a little bit nostalgic about the feeling of how programming felt before..., but a lot of us dont even have a job to keep up with our basic bills but if you are not "AI fluent" and pay yours subscriptions on time you're screwed and left behind the industry. So people to have access to this "high paying" jobs are now just the ones who can pay and "invest in their careers" paying for intelligence, agents and the next essential tool.


### The API
The Remix action at /api/chat receives the message and full conversation history, then calls the OpenAI API:

``` js
// app/routes/api.chat.tsx
export const action: ActionFunction = async ({ request }) => {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;
    const reply = await getChatResponse(message, conversationHistory);
    return json({ reply });
};

```


``` js
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


# What's Next

The natural next step is RAG — Retrieval-Augmented Generation. Right now, every request includes the full resume in the prompt. As I write more blog posts, I'll want to bring that content in too, but injecting every post into every prompt gets expensive fast.

The plan: chunk the content (resume sections + blog posts), generate embeddings at build time, store them in a JSON file, and at query time find only the most relevant chunks to inject. The chat gets richer context; the prompt stays lean.

For now though, the card talks back. That's enough.







