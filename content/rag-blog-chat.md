---
date: 2026-08-19
---
# Teaching the AI chat to actually read my blog (RAG)

## Why?
### The context problem
When I [built the AI chat](/blog/ai-chat-portfolio), the assistant only knew what I stuffed into one static system prompt: a compressed version of my resume, personality, and a few bullet points about my projects. It worked, but it had a ceiling. If someone asked something specific about *how* I built the mandarin app, or what the SSG post actually says about static site generation, the model had nothing to go on beyond a one-line summary. It would either hallucinate a plausible-sounding answer or shrug and tell them to reach out directly.

The honest fix is: let the model read the blog. Not paste the blog into the prompt — actually read it, only the relevant part, only when it's needed.

### The cost problem
This is the part that actually pushed me to build it. Every request to the chat sends the full system prompt as input tokens, on top of the conversation history. As I write more posts, the temptation is to just keep appending more content to that static prompt so the AI "knows more." But that means every single message, even "hi", pays for the full weight of everything I've ever written, whether it's relevant or not.

That doesn't scale, and it doesn't need to. Most questions only touch a fraction of what I've written. Retrieval-Augmented Generation exists exactly for this: embed everything once, at build time, and at query time pull in only the handful of chunks that are actually relevant to the question being asked. The prompt stays lean, the cost stays flat as content grows, and the answers get *more* specific instead of less.

So the motivation was really two sides of the same coin: cheaper per-request cost, and richer context per relevant request. RAG is one of the few techniques where you don't have to trade one for the other.

## The Architecture
The stack already had a natural seam for this. The Rust binary at `api/ssg.rs` runs at build time to turn my markdown files into JSON the Remix app can read — it was already parsing every post. So instead of adding a separate ingestion pipeline, I extended that same binary to also chunk, embed, and upsert each post into a vector store as part of the existing build step.

**Chunking by heading, not by fixed size.** A naive approach splits text every N characters, which cuts sentences and ideas in half. Instead, `chunk_markdown` in `api/ssg.rs` splits each post along its `##` sections, and if a section is too big (over ~1800 chars) it falls back to `###` subheadings, and if there still aren't any, to paragraph boundaries with a small character overlap so context isn't lost at the seam. Each chunk keeps its heading path prefixed (e.g. `The Architecture > Chunking by heading`) so the embedding captures *what part of the post* this is, not just the raw text.

**Content-hash skip.** Re-embedding every post on every deploy would waste OpenAI calls for content that hasn't changed. Each post's markdown gets SHA-256 hashed; if the hash matches what's already stored for that slug in Supabase, ingestion skips it entirely. Only new or edited posts get re-chunked and re-embedded.

**Supabase + pgvector.** Chunks are stored in a `content_chunks` table with their embedding vector, heading, source slug, and URL. A Postgres RPC function (`match_content_chunks`) does the similarity search server-side using pgvector, so the app never has to pull all embeddings into memory to compare them.

**Best-effort, never blocking.** If `OPENAI_API_KEY`, `SUPABASE_URL`, or `SUPABASE_SERVICE_ROLE_KEY` aren't set, ingestion just logs and skips — the actual site build must never fail because a vector store isn't configured. Same philosophy on the read side.

## Implementation

### Ingestion (build time, Rust)
```rust
// api/ssg.rs — runs during the build, alongside existing markdown parsing
fn ingest_for_rag(posts: &[Post]) {
    for post in posts {
        let hash = content_hash(&post.markdown);
        if existing_hash(...) == Some(hash) {
            continue; // unchanged, skip re-embedding
        }

        let chunks = chunk_markdown(&post.markdown);
        let embeddings = embed_batch(&client, &openai_key, &texts)?;

        delete_chunks_for_slug(&client, &supabase_url, &supabase_key, &post.slug)?;
        insert_chunks(&client, &supabase_url, &supabase_key, &rows)?;
    }
}
```
Each chunk is embedded with `text-embedding-3-small` — cheap, and plenty precise for a personal site's worth of content. Orphaned slugs (posts that got deleted) get their chunks cleaned up too, so the table never grows stale.

### Retrieval (request time, TypeScript)
```ts
// app/utils/openai.server.ts
async function retrieveContext(query: string): Promise<string> {
    if (!supabase) return "";
    const embedding = await getEmbedding(query);
    if (!embedding) return "";

    const { data } = await supabase.rpc("match_content_chunks", {
        query_embedding: embedding,
        match_count: 5,
        min_similarity: 0.15,
        filter_source_type: null,
    });
    if (!data?.length) return "";

    return "RELEVANT CONTEXT FROM TATIANA'S BLOG:\n" +
        data.map(c => `[${c.heading ?? c.source_id}] (${c.url})\n${c.content}`).join("\n\n");
}
```
The incoming user message gets embedded, compared against the stored chunk vectors via `match_content_chunks`, and the top 5 relevant chunks (above a similarity floor) get appended to the system prompt — only for that request. Ask "what's your stack?" and it costs about the same as before. Ask "how does the RAG chunking work?" and suddenly the model has the actual paragraph I wrote about heading-based splitting, with a link back to this post.

One detail I had to be careful about: the embedding model has to match *exactly* between ingestion (Rust) and retrieval (TypeScript). A mismatch wouldn't throw an error — it would just silently produce meaningless similarity scores, since the vectors would live in different spaces. Both sides are commented to point at each other so a future me doesn't change one without the other.

## What changed for the chat
Before, the system prompt was static and identical for every single message. Now it's the static prompt plus, when relevant, a few hundred tokens of the exact blog content that answers the question — and nothing extra when the question doesn't need it. Cost per request went down on average, and answer quality went up on anything content-specific. That's the trade RAG is supposed to give you, and it's nice to feel it actually show up.

## What's Next
Writing this post did something I didn't fully expect: it made the RAG system itself better. The more I write, the more chunks exist to retrieve, and the more specific the chat can get about my work. That's a genuinely good incentive to keep writing — every post isn't just content anymore, it's context the AI chat can actually draw on. So consider this a note to future me: write more blog posts. The system gets smarter every time you do.
