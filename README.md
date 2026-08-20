# [tatimoreira.me](https://www.tatimoreira.me/)

My personal website, version 3!

I wanted to build this site with the intent of it to be my personal playground where I can explore cool stuff that sometimes you don't get to work on a typical job.

This site is built with Remix.

## Features

- **Blog** — posts written in Markdown, parsed and chunked by a Rust API (`api/ssg.rs`)
- **AI chat** — ask questions about my blog posts; answers are grounded via RAG (retrieval-augmented generation) over the post content
- **Mandarin vocab app** — a small admin-gated tool for practicing vocabulary (Turso/libsql + Prisma)
- **Now / About / Experience pages**
- **Theme switching** — light/dark, driven by CSS custom properties
- **3D touches** — react-three-fiber/drei for background elements, card tilt on hover, a custom cursor with pointer animation

## How it's built

- **Frontend**: Remix + Tailwind CSS
- **Content API**: Rust (`api/ssg.rs`) reads and parses markdown from `content/`, chunking posts for retrieval
- **AI chat**: OpenAI + Supabase for embeddings/vector search, grounded in blog content
- **Data**: Turso (libsql) + Prisma for the Mandarin vocab feature
- **Animation**: Framer Motion + React Three Fiber
- **Testing**: Vitest (unit) + Cypress (e2e)

## Future stuff

Internationalization is in place for English and Spanish (my native language) — next up is adding Mandarin support, since studying Chinese is one of my biggest hobbies.

Other things on the roadmap:

- A **guest book** for visitors
- **Telegram integration** to see what people are asking the AI chat about me

## Tech

- [Remix](https://remix.run/) - Web framework
- [Tailwind](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D
- [Prisma](https://www.prisma.io/) + [Turso](https://turso.tech/) - Database
- [Supabase](https://supabase.com/) - Vector storage for RAG
- Rust - Content API (markdown parsing, chunking)

## Getting started

```bash
npm install

# run the dev server (Remix + Tailwind watch)
npm run dev

# run unit tests
npm test

# run e2e tests
npm run test:e2e:dev

# type check / lint
npm run typecheck
npm run lint
```

The Rust API (blog content) needs to be running separately — see `CLAUDE.md` for deployment notes.
