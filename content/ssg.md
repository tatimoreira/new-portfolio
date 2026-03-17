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

## Lessons

**Check if your dependencies are maintained before building on them.** `vercel-rust` had no commits in years. That's a sign.

**"Free tier" doesn't mean "works."** Several platforms offer free Rust hosting in theory. In practice, CLI tools time out, runtimes are deprecated, and documentation lags behind reality.

**Sometimes the architecture needs to change, not the config.** The live GraphQL API wasn't wrong — it just wasn't necessary. Removing the requirement for a persistent server eliminated the entire class of hosting problems.

The Rust code is still in the repo. It still compiles. It still does exactly what it was written to do. It just doesn't need to run 24/7 to do it.
