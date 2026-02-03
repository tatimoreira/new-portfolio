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
            degree: "Master’s in Computer Science & Information Systems",
            institution:
                "Nanjing University of Information Science and Technology",
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
If you are unsure, say you don't know.

## Tatiana's Profile
${JSON.stringify(RESUME, null, 2)}

ABOUT TATI:
- Web Developer focused on frontend and full-stack development
- Strong experience with React, Remix, TypeScript, and TailwindCSS
- Comfortable working with serverless architectures and APIs
- Interested in UI/UX, performance, and clean code

PROJECTS:
- Personal portfolio built with Remix and TailwindCSS
- AI-powered assistant using OpenAI and Vercel serverless functions
- Experience migrating monoliths to microservices (professional work)

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





export async function getChatResponse(
    message: string,
    conversationHistory: any[] = []
) {
    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: "user", content: message },
        ],
    });

    return completion.choices[0].message.content;
}
