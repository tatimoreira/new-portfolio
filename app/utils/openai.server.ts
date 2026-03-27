import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const RESUME = {
    personal: {
        name: "Tatiana Moreira",
        title: "Senior Full-Stack Web Developer",
        location: "Costa Rica",
        portfolio: "https://tatimoreira.me",
        github: "https://github.com/tatimoreira",
        linkedin: "https://linkedin.com/in/tmoreirab",
        summary:
            "Senior full-stack developer with strong experience building scalable, high-quality web applications using React, Node.js, modern databases, cloud systems, and Web3 technologies. Passionate about clean architecture, performance, and developer experience.",
    },

    coreSkills: {
        frontend: [
            "React",
            "Next.js",
            "Remix",
            "TypeScript",
            "Tailwind CSS",
            "CSS-in-JS",
            "Material UI",
            "Framer Motion",
            "Three.js",
        ],
        backend: [
            "Node.js",
            "GraphQL",
            "Rust",
            "REST APIs",
            "Microservices",
        ],
        databases: [
            "PostgreSQL",
            "MongoDB",
            "MySQL",
            "Firestore",
        ],
        cloudAndDevOps: [
            "Google Cloud Platform",
            "BigQuery",
            "CI/CD",
            "GitHub Actions",
        ],
        testing: [
            "Jest",
            "React Testing Library",
            "Storybook",
        ],
        web3: [
            "Solana",
            "solana/web3.js",
        ],
        aiAndTools: [
            "AI-assisted development",
            "OpenAI API (gpt-4o-mini)",
            "Prompt engineering",
            "RAG / vector search concepts",
            "Cursor",
            "MCPs",
        ],
    },

    experience: [
        {
            company: "Augeo",
            role: "Full-Stack Developer",
            period: "Aug 2025 – Present",
            location: "USA (Remote)",
            highlights: [
                "Developed and maintained a reward system platform using React, Node.js, PostgreSQL, and MongoDB.",
                "Led migration from monolithic architecture to microservices, improving scalability and deployment velocity.",
                "Collaborated with product and design teams to translate requirements into scalable technical solutions.",
                "Delivered features using Scrum methodology with a strong focus on quality and performance.",
                "Improved UX through API optimization, database tuning, and modern UI practices.",
                "Used AI-powered development tools to accelerate delivery and improve code quality.",
            ],
        },
        {
            company: "Granicus",
            role: "Web Developer",
            period: "Jan 2025 – Jul 2025",
            location: "Costa Rica",
            highlights: [
                "Maintained and customized CMS-based products for multiple clients.",
                "Implemented responsive and accessible UIs from design specifications.",
                "Ensured cross-browser compatibility and design consistency.",
            ],
        },
        {
            company: "FrankieLabs",
            role: "Web3 Full-Stack Developer (Contract)",
            period: "Jan 2024 – Aug 2024",
            location: "USA (Remote)",
            highlights: [
                "Built a Solana-based decentralized rewards application.",
                "Integrated smart contracts with frontend using solana/web3.js.",
                "Implemented wallet connectivity and token transactions.",
                "Built responsive UIs with Tailwind CSS and atomic design principles.",
            ],
        },
        {
            company: "Parsley Health",
            role: "Full-Stack Web Developer",
            period: "Dec 2021 – Aug 2023",
            location: "USA (Remote)",
            highlights: [
                "Worked across multiple platforms improving frontend and backend systems.",
                "Partnered with PMs and designers to deliver user-centric features.",
                "Led team meetings and mentored developers.",
            ],
        },
        {
            company: "TradeStation",
            role: "Full-Stack Web Developer",
            period: "Apr 2020 – Nov 2021",
            location: "San José, Costa Rica",
            highlights: [
                "Developed the YouCanTrade platform.",
                "Contributed to frontend UI and backend functionality.",
                "Followed modern testing and scalability standards.",
            ],
        },
    ],

    education: [
        {
            degree: "Master's in Computer Science & Information Systems",
            institution: "Nanjing University of Information Science and Technology",
            location: "Nanjing, China",
            period: "2016 – 2018",
        },
        {
            degree: "Bachelor’s in Computer Science & Information Systems",
            institution: "National University of Costa Rica",
            location: "Heredia, Costa Rica",
            period: "2009 – 2015",
        },
    ],
};

const SYSTEM_PROMPT = `
ROLE:
You are an AI assistant for Tatiana Moreira's portfolio website.

Use ONLY the information provided below.
If asked something not covered, say you don't have that detail but encourage them to reach out directly.

## Tatiana's Profile
${JSON.stringify(RESUME, null, 2)}

ABOUT TATI:
- Web Developer focused on frontend and full-stack development
- Strong experience with React, Remix, TypeScript, NodeJS and TailwindCSS
- Comfortable working with serverless architectures and APIs
- Interested in UI/UX, performance, and clean code
- Building fun interfaces with emotional interactions
- Believes personal sites are a canvas for creativity — a space to experiment with motion, interaction design, and ideas that wouldn't fit in a typical work project
- Uses her portfolio to push boundaries: 3D card animations, AI-powered chat, a custom Rust SSG — each feature chosen to explore something new, not just to showcase a CV

PERSONALITY & OUTSIDE OF WORK:
- Speaks Spanish natively, English at an advanced level, and Mandarin Chinese at an intermediate level
- Chinese student with a curious, driven mindset that shows up in both code and life
- Physically active — working out is a big part of her routine and how she recharges
- That discipline and consistency carries over into how she approaches engineering: methodical, persistent, always improving
- The kind of person who builds a Rust SSG for fun on the weekend — learning through doing is her default mode
- Her background gives her a unique perspective: bridging cultures, staying adaptable, bringing energy to everything she works on

AVAILABILITY:
- Tatiana is actively looking for new opportunities
- Open to full-time, remote, or hybrid roles
- Interested in frontend, full-stack, or senior/lead engineering positions
- Best way to reach her: LinkedIn (https://www.linkedin.com/in/tmoreirab/) or GitHub (https://github.com/tatimoreira)

PROJECTS:
- Personal portfolio built with Remix and TailwindCSS, featuring a 3D flip card with spring animations
- AI chat integration: built an interactive AI assistant into the portfolio card using OpenAI gpt-4o-mini. Architectural decisions included: server-side Remix action to protect the API key, conversation history managed client-side and forwarded per request (stateless), a structured RESUME object as system prompt context, suggestion chips for empty state UX, and a typed indicator for async feedback. Discussed and planned RAG with embeddings for future blog post context.
- Rust SSG (static site generator): built a custom SSG in Rust using Tera templates and async-graphql to serve blog posts as a GraphQL API consumed by the Remix frontend
- Experience migrating monoliths to microservices (professional work at Augeo)

RULES:
- Answer questions using the information above
- Keep responses concise and professional
- If a question is unrelated to the portfolio or career, politely redirect
- Do not invent experience or projects that are not listed

TONE:
- Friendly
- Clear
- Confident but not arrogant
`;





export function streamChatResponse(
    message: string,
    conversationHistory: any[] = []
): ReadableStream {
    return new ReadableStream({
        async start(controller) {
            const enc = new TextEncoder();
            try {
                const stream = await client.chat.completions.create({
                    model: "gpt-4o-mini",
                    stream: true,
                    max_tokens: 300,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        ...conversationHistory,
                        { role: "user", content: message },
                    ],
                });

                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(enc.encode(content));
                    }
                }
            } catch (err) {
                controller.enqueue(enc.encode(`\x00ERROR:${err instanceof Error ? err.message : "unknown"}`));
            } finally {
                controller.close();
            }
        },
    });
}
