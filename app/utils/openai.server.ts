import { supabase } from "~/utils/supabase.server";

export const RESUME = {
    personal: {
        name: "Tatiana Moreira",
        title: "Full Stack Software Engineer",
        location: "Costa Rica",
        portfolio: "https://tatimoreira.me",
        github: "https://github.com/tatimoreira",
        linkedin: "https://linkedin.com/in/tmoreirab",
        summary:
            "Full-stack software engineer with 8+ years of experience building scalable applications across backend and frontend using React, Node.js, databases, and cloud systems. Experienced with modern front-end interfaces, APIs, microservices, CI/CD workflows, and performance-focused applications for SaaS, healthtech, fintech, and ecommerce.",
    },

    coreSkills: {
        frontend: [
            "React",
            "Next.js",
            "Remix",
            "TypeScript",
            "Tailwind CSS",
            "CSS-in-JS",
            "Apollo",
            "Jest",
            "Material UI",
            "React Testing Library",
        ],
        backend: [
            "Node.js",
            "Rust",
            "GraphQL",
            "REST APIs",
            "Microservices",
        ],
        databases: [
            "PostgreSQL",
            "MongoDB",
            "MySQL",
            "Firestore",
        ],
        web3: [
            "Solana",
            "solana/web3.js",
            "dApp Development",
            "Smart Contract Integration",
        ],
        cmsAndEcommerce: [
            "Shopify",
            "Sanity",
            "MedusaJs",
        ],
        uiAndAnimation: [
            "Framer Motion",
            "Three.js",
        ],
        aiAndTools: [
            "Cursor",
            "Claude Code",
            "OpenAI API (gpt-4o-mini)",
            "Prompt engineering",
            "RAG / vector search concepts",
            "MCPs",
        ],
        toolsAndDx: [
            "Git",
            "Storybook",
            "Bit (Bit.dev)",
        ],
    },

    experience: [
        {
            company: "Open Earth Foundation",
            role: "Full-Stack Developer",
            period: "Jun 2026 – Present",
            location: "USA (Remote)",
            highlights: [
                "Helped build out the platform's support for AI agents, working on the API layer that lets AI assistants pull city climate data and interact with the product directly.",
                "Worked on AI-powered features — an action-recommendation tool for city climate plans and a conversational climate assistant — fixing bugs and improving the experience.",
                "Used AI-assisted coding tools day to day to move faster while ramping up solo on a large, unfamiliar codebase.",
                "Cleaned up type safety and code quality issues to keep the codebase reliable and CI green.",
                "Redesigned parts of the emissions dashboard UI and wrote a technical proposal for bringing a climate-risk feature natively into the platform.",
                "Improved onboarding/login experience, fixed a redirect-link security issue, and kept tests and translations (5 languages) up to date.",
            ],
        },
        {
            company: "Augeo",
            role: "Full-Stack Developer",
            period: "Aug 2025 – Apr 2026",
            location: "USA (Remote)",
            highlights: [
                "Developed and maintained a scalable rewards platform using React, TypeScript, Node.js, PostgreSQL, and MongoDB.",
                "Led migration from monolithic architecture to microservices, improving deployment frequency by ~30% and reducing system coupling.",
                "Designed and implemented RESTful and GraphQL APIs, optimizing data access patterns and reducing average response times by ~20%.",
                "Improved performance and UX by optimizing database queries, API endpoints, and front-end rendering.",
                "Contributed to CI/CD pipelines, automated testing, and code reviews.",
                "Leveraged AI-assisted development tools (Cursor) to accelerate delivery and improve code consistency.",
            ],
        },
        {
            company: "Granicus",
            role: "Web Developer",
            period: "Jan 2025 – Jul 2025",
            location: "Costa Rica",
            highlights: [
                "Maintained and customized CMS-driven web applications for multiple clients, ensuring responsive design and cross-browser compatibility.",
                "Translated wireframes and high-fidelity designs into accessible, high-performance UIs.",
                "Ensured compliance with web accessibility standards (WCAG).",
            ],
        },
        {
            company: "FrankieLabs",
            role: "Web3 Full-Stack Developer (Contract)",
            period: "Jan 2024 – Aug 2024",
            location: "USA (Remote)",
            highlights: [
                "Built a Solana-based decentralized rewards application (dApp) using JavaScript, React, and Node.js.",
                "Integrated Solana smart contracts with frontend using solana/web3.js for real-time blockchain communication.",
                "Implemented wallet connectivity, token transactions, and on-chain data retrieval.",
                "Built responsive UIs with Tailwind CSS and atomic design principles.",
            ],
        },
        {
            company: "Parsley Health",
            role: "Full-Stack Web Developer",
            period: "Dec 2021 – Aug 2023",
            location: "USA (Remote)",
            highlights: [
                "Worked across established codebases and greenfield projects, both frontend and backend.",
                "Improved legacy applications with new features, refactoring, and bug fixes.",
                "Helped build and scale a company-wide design system using Bit.dev and Tailwind CSS.",
                "Led team meetings and mentored new team members.",
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
        {
            company: "Proximity",
            role: "Full-Stack Web Developer",
            period: "Jun 2019 – Mar 2020",
            location: "San José, Costa Rica",
            highlights: [
                "Built web applications with reusable UI components and REST APIs.",
                "Played a key role developing a social job platform for professionals aged 45+.",
                "Followed strong engineering practices — testing, pull requests, peer reviews.",
            ],
        },
        {
            company: "Softon",
            role: "Front-End Developer",
            period: "Oct 2018 – Apr 2019",
            location: "San José, Costa Rica",
            highlights: [
                "Developed reusable UI components and managed application state using GraphQL and REST APIs.",
                "Created test suites for UI components and data layers, working with IBM Carbon Components.",
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

const SYSTEM_PROMPT = `You are a concise AI assistant on Tatiana Moreira's portfolio. Answer only from the info below. Keep replies to 1-2 sentences max. Be direct. If you don't have that detail, encourage them to reach out directly.

TATIANA MOREIRA — Full Stack Software Engineer, 8+ years experience, Costa Rica
Stack: React, Next.js, Remix, TypeScript, Node.js, Tailwind CSS, GraphQL/Apollo, Rust, PostgreSQL, MongoDB, Solana/Web3, Shopify/Sanity/MedusaJs
Languages: Spanish (native), English (advanced), Mandarin Chinese (intermediate)

EXPERIENCE:
- Open Earth Foundation (Jun 2026–now): Full-stack, AI agent API layer for city climate data, conversational climate assistant, emissions dashboard UI
- Augeo (Aug 2025–Apr 2026): Full-stack, React/TypeScript/Node/PostgreSQL/MongoDB, microservices migration
- Granicus (Jan–Jul 2025): CMS-based products, accessible UIs
- FrankieLabs (Jan–Aug 2024, contract): Solana Web3 app, smart contracts, solana/web3.js
- Parsley Health (Dec 2021–Aug 2023): Full-stack, mentoring, design system (Bit.dev)
- TradeStation (Apr 2020–Nov 2021): Full-stack development
- Proximity (Jun 2019–Mar 2020) & Softon (Oct 2018–Apr 2019): Earlier full-stack/front-end roles

EDUCATION: MSc Computer Science — Nanjing University (China, 2016–18) | BSc Computer Science — National University of Costa Rica (2009–15)

PROJECTS: Portfolio (Remix + Tailwind, 3D flip card, AI chat with RAG) | Rust GraphQL SSG serving blog posts | Solana dApp

AVAILABILITY: Currently full-time at Open Earth Foundation. Open to hearing about interesting opportunities.
Contact: linkedin.com/in/tmoreirab | github.com/tatimoreira

PERSONALITY: Curious, disciplined, builds things to learn. Works out to recharge. Bridges cultures, stays adaptable.`;

// Must match the embedding model/dims used in api/ssg.rs's embed_batch — a mismatch
// won't error, it'll just silently produce meaningless similarity scores.
const EMBEDDING_MODEL = "text-embedding-3-small";

async function getEmbedding(text: string): Promise<number[] | null> {
    try {
        const res = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data?.[0]?.embedding ?? null;
    } catch {
        return null;
    }
}

function formatChunks(data: any[]): string {
    return data
        .map((c: any) => `[${c.heading ?? c.source_id}] (${c.url})\n${c.content}`)
        .join("\n\n");
}

async function retrieveContext(query: string): Promise<string> {
    if (!supabase) return "";
    try {
        const embedding = await getEmbedding(query);
        if (!embedding) return "";

        // Params passed explicitly (not omitted) — PostgREST did not reliably fall
        // through to this RPC function's SQL-level defaults for omitted args.
        //
        // Two-tier retrieval: technical/blog content is the primary source and gets
        // a generous match count and a lower similarity floor. Personal content
        // (hobbies/personality) is supplementary — it only gets pulled in above a
        // higher similarity floor, so it surfaces for "what do you do for fun?" but
        // doesn't crowd out technical answers on unrelated questions.
        const [technical, personal] = await Promise.all([
            supabase.rpc("match_content_chunks", {
                query_embedding: embedding,
                match_count: 5,
                min_similarity: 0.15,
                filter_source_type: "blog_post",
            }),
            supabase.rpc("match_content_chunks", {
                query_embedding: embedding,
                match_count: 2,
                min_similarity: 0.25,
                filter_source_type: "personal",
            }),
        ]);

        const sections: string[] = [];
        if (technical.data?.length) {
            sections.push("RELEVANT CONTEXT FROM TATIANA'S BLOG:\n" + formatChunks(technical.data));
        }
        if (personal.data?.length) {
            sections.push(
                "RELEVANT PERSONAL CONTEXT (hobbies/personality — use only if the question calls for it):\n" +
                    formatChunks(personal.data)
            );
        }
        return sections.join("\n\n");
    } catch (err) {
        console.error("RAG retrieval failed:", err);
        return "";
    }
}

export async function getChatResponse(
    message: string,
    conversationHistory: any[] = []
): Promise<string> {
    const context = await retrieveContext(message);
    const systemPrompt = context
        ? `${SYSTEM_PROMPT}\n\n${context}\n\nPrioritize technical/professional details (skills, experience, blog/project content) over personal context. Only draw on the personal context section for questions about hobbies, interests, or personality — and even then, keep it brief. If neither context section is relevant, rely on the summary above.`
        : SYSTEM_PROMPT;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 80,
            temperature: 0.7,
            messages: [
                { role: "system", content: systemPrompt },
                ...conversationHistory,
                { role: "user", content: message },
            ],
        }),
    });
    const data = await res.json();
    return data.choices[0].message.content ?? "";
}
