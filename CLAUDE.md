# Project: Tatiana Moreira Portfolio

## Architecture

- This is a **Remix** app (frontend) + a **Rust GraphQL API** (`api/graphql.rs`) that serves blog posts from markdown files in `content/`
- The Rust API is **functional and intentional** — it must remain running, not just decorative
- Do **not** replace Rust logic with Node.js/TypeScript equivalents
- Do **not** move markdown reading into the Remix server

## Blog

- Blog posts are `.md` files in `content/`
- The Rust API (`api/graphql.rs`) reads and parses them, serves via GraphQL
- The Remix app fetches from `BLOG_API_URL` env var (set in Vercel)

## Deployment

- Frontend: Vercel
- Rust API: needs its own hosting (Cloudflare Workers or Shuttle.rs) — `vercel-rust` npm package is abandoned and incompatible with Vercel's current infrastructure
- `BLOG_API_URL` in Vercel env vars must point to wherever the Rust API is deployed

## Styling

- Tailwind CSS with `@tailwindcss/typography` for blog post rendering
- Dark mode via `darkMode: "class"` (Tailwind) + CSS custom properties
- Design tokens: `#f5b1cc` (mauve/pink) for headings and accents, `link-color` for body links
