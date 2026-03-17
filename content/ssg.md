# Building a SSG in Rust for my personal blog

My intention in developing a static site generator to build my personal blog is to document my way to learn Rust and start once and for all my writing journey.

## Static Site Generator

A SSG's are system engines that use text input files to generate static pages.

## Development

### General idea

- Input markdown to the engine
- Having predefined templates to match that input
- Output the HTML result
- Generate a GraphQL endpoint to serve the generated pages/posts to a client
- Consume the GraphQL endpoints into a Remix client (my personal web page)
- Render the list of posts and the post details

I decided to use [Tera](https://docs.rs/tera/latest/tera/) as template engine. I have a base template and a post template which extends from base and builds the post from a content folder which contains md files. I also added a GraphQL handler using [async_graphql](https://docs.rs/async-graphql/latest/async_graphql/) so in this way I can consume them and use them in my Remix portfolio as the client.

## Technologies

- **Rust** — systems language used to build the SSG binary
- **pulldown-cmark** — markdown to HTML parser
- **async-graphql** — GraphQL server library (original architecture)
- **Axum** — HTTP framework (original architecture)
- **Tera** — template engine
- **Remix** — React framework used as the client
- **Tailwind CSS** — styling, with `@tailwindcss/typography` for blog post rendering
- **Vercel** — deployment platform for the Remix frontend
- **Claude Code** — AI coding assistant used throughout development

## Deployment: What Nobody Tells You

When I set out to deploy this to Vercel, I assumed it would be a matter of a few config lines and a `vercel deploy`. It was not.

### The Original Plan

The SSG started as an Axum web server. The Rust binary would run as a live GraphQL API, the Remix frontend would call it at request time to fetch posts. This required a hosted server running 24/7 — for a personal portfolio that felt like unnecessary overhead, so the next step was to move it to Vercel as a serverless function using `vercel_runtime`. No server to manage, pay for, or keep alive.

This worked locally. Then came deployment.

### Problem 1: `vercel-rust` is Abandoned

The first error was blunt:

```
Error: The following Serverless Functions contain an invalid "runtime":
  - api/graphql (provided)
```

The `vercel-rust` community runtime — the npm package responsible for compiling `.rs` files into Vercel serverless functions — was last seriously maintained in 2021. It depends on `@vercel/build-utils@2.x` while Vercel's current platform runs `5.x`. The API changed, the package didn't follow, and there is no official replacement. No amount of version tweaking fixes this.

### Problem 2: Shuttle Wouldn't Connect

The next idea was to host the Rust API on Shuttle.rs — a Rust-native cloud platform with a free tier. The code changes would be minimal: swap `vercel_runtime` for Shuttle's handler macro and deploy.

```
cargo shuttle login
Error: failed to connect to auth endpoint
Operation timed out (os error 60)
```

The CLI couldn't connect to Shuttle's auth endpoint at all. Another dead end.

### Rethinking the Architecture

After two failed paths, the question became: does this API actually need to run live?

The Rust code reads markdown files and converts them to HTML. That work doesn't need to happen at request time — it can happen at deploy time. The result is the same HTML either way. This is what a static site generator is supposed to do.

### The Fix: Build-time Generation

Instead of running as a live HTTP server, the Rust binary now runs once during the Vercel build:

```
Markdown files → Rust runs at deploy time → TypeScript module → Remix bundles it
```

The binary generates `app/blog-data.server.ts` containing all post data, which Remix bundles at build time. No live server. No external API. No runtime filesystem reads. The core Rust logic is unchanged — `find_content()`, `load_post()`, `pulldown-cmark` parsing — all the same. What changed is only the output: instead of an HTTP response, it writes a file to disk.

## Working with Claude Code

This project was developed with Claude Code as an AI coding assistant. The experience taught me as much about working with AI tools as it did about Rust and deployment.

### The Cost of Missing Context

Early in the deployment debugging, Claude suggested replacing the Rust blog API with a Node.js implementation that read the markdown files directly in Remix. The suggestion was technically sound. It would have worked. But the Rust code was the point — removing it would have defeated the purpose of the project entirely.

The AI had no way of knowing that without being told. And I hadn't told it.

After pushing back, I asked directly: how can I work with you better so this doesn't happen again? The answer was a `CLAUDE.md` file — a plain text file at the project root where you document architectural constraints, decisions, and things that must not change. Claude reads it at the start of every conversation.

Adding a single constraint:

```
The Rust GraphQL API must remain functional, not just decorative. Do not replace Rust logic with Node.js equivalents.
```

Would have changed the entire direction of that conversation from the start.

### AI Still Requires a Developer

Even with context, AI suggestions need to be validated. During this project, Claude proposed solutions that seemed reasonable but turned out to be wrong — packages that were abandoned, platform features that no longer existed, version numbers that didn't exist on npm.

The AI doesn't know what it doesn't know. It can't check whether a library is actively maintained, whether a CLI tool actually connects, or whether a platform has changed its infrastructure since its training data was collected. That verification is still the developer's job.

The practical lesson: use AI to move fast, but own the decisions. Understand what every suggested change does before applying it. When something fails, read the error yourself rather than just passing it back and asking for a fix.

## Lessons

**Check if your dependencies are maintained before building on them.** `vercel-rust` had no commits in years. That's a sign.

**"Free tier" doesn't mean "works."** Several platforms offer free Rust hosting in theory. In practice, CLI tools time out, runtimes are deprecated, and documentation lags behind reality.

**Sometimes the architecture needs to change, not the config.** The live GraphQL API wasn't wrong — it just wasn't necessary. Removing the requirement for a persistent server eliminated the entire class of hosting problems.

**Give your AI assistant context upfront.** A `CLAUDE.md` file with key architectural decisions saves significant back-and-forth and prevents suggestions that technically work but miss the point entirely.

**AI is a tool, not a decision maker.** The best use of Claude Code in this project was generating code quickly and exploring options. The decisions — what to keep, what to change, what mattered — those were mine.

The Rust code is still in the repo. It still compiles. It still does exactly what it was written to do. It just doesn't need to run 24/7 to do it.
