

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

const SYSTEM_PROMPT = `You are a concise AI assistant on Tatiana Moreira's portfolio. Answer only from the info below. Keep replies to 1-2 sentences max. Be direct. If something isn't covered, say so briefly.

TATIANA MOREIRA — Senior Full-Stack Developer, Costa Rica
Stack: React, Next.js, Remix, TypeScript, Node.js, Tailwind CSS, GraphQL, Rust, PostgreSQL, MongoDB, GCP, Solana/Web3
Languages: Spanish (native), English (advanced), Mandarin Chinese (intermediate)

EXPERIENCE:
- Augeo (Aug 2025–now): Full-stack, React/Node/PostgreSQL/MongoDB, microservices migration
- Granicus (Jan–Jul 2025): CMS-based products, accessible UIs
- FrankieLabs (Jan–Aug 2024, contract): Solana Web3 app, smart contracts, solana/web3.js
- Parsley Health (Dec 2021–Aug 2023): Full-stack, mentoring, cross-platform features
- TradeStation (Apr 2020–Nov 2021): YouCanTrade platform

EDUCATION: MSc Computer Science — Nanjing University (China, 2016–18) | BSc Computer Science — National University of Costa Rica (2009–15)

PROJECTS: Portfolio (Remix + Tailwind, 3D flip card, AI chat) | Rust GraphQL SSG serving blog posts | Solana dApp

AVAILABILITY: Actively job hunting. Open to full-time remote/hybrid frontend or full-stack senior/lead roles.
Contact: linkedin.com/in/tmoreirab | github.com/tatimoreira

PERSONALITY: Curious, disciplined, builds things to learn. Works out to recharge. Bridges cultures, stays adaptable.`;





export async function getChatResponse(
    message: string,
    conversationHistory: any[] = []
): Promise<string> {
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
                { role: "system", content: SYSTEM_PROMPT },
                ...conversationHistory,
                { role: "user", content: message },
            ],
        }),
    });
    const data = await res.json();
    return data.choices[0].message.content ?? "";
}
