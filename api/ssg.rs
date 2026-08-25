use serde::Serialize;
use sha2::{Digest, Sha256};
use std::fs;
use std::path::Path;

#[derive(Serialize)]
struct Post {
    slug: String,
    title: String,
    body: String,
    date: String,
    #[serde(skip)]
    markdown: String,
}

struct Chunk {
    chunk_index: i32,
    heading: Option<String>,
    content: String,
}

const MAX_CHUNK_CHARS: usize = 1800;
const PARAGRAPH_OVERLAP_CHARS: usize = 150;

fn parse_frontmatter(content: &str) -> (Option<String>, String) {
    if !content.starts_with("---\n") {
        return (None, content.to_owned());
    }
    let rest = &content[4..];
    if let Some(end) = rest.find("\n---") {
        let frontmatter = &rest[..end];
        let date = frontmatter.lines().find_map(|line| {
            line.trim().strip_prefix("date:").map(|d| d.trim().to_owned())
        });
        let body = rest[end + 4..].trim_start_matches('\n').to_owned();
        (date, body)
    } else {
        (None, content.to_owned())
    }
}

fn content_dir() -> String {
    std::env::var("CONTENT_DIR").unwrap_or_else(|_| "content".into())
}

fn personal_content_dir() -> String {
    std::env::var("PERSONAL_CONTENT_DIR").unwrap_or_else(|_| "personal".into())
}

fn find_markdown_in(dir: &str) -> Vec<String> {
    walkdir::WalkDir::new(dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().display().to_string().ends_with(".md"))
        .map(|e| e.path().display().to_string())
        .collect()
}

fn find_content() -> Vec<String> {
    find_markdown_in(&content_dir())
}

fn find_personal_content() -> Vec<String> {
    find_markdown_in(&personal_content_dir())
}

fn load_post(file: &str) -> Option<Post> {
    let content = fs::read_to_string(file).ok()?;
    let (date, markdown) = parse_frontmatter(&content);
    let parser = pulldown_cmark::Parser::new_ext(&markdown, pulldown_cmark::Options::all());
    let mut body = String::new();
    pulldown_cmark::html::push_html(&mut body, parser);

    let slug = Path::new(file)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_owned();

    let title = markdown
        .lines()
        .find_map(|line| line.strip_prefix("# ").map(|t| t.trim().to_owned()))
        .unwrap_or_else(|| slug.replace('-', " ").replace('_', " "));

    Some(Post { slug, title, body, date: date.unwrap_or_default(), markdown })
}

/// Splits markdown text into (heading, body) sections at each line starting with `prefix`
/// (e.g. "## " or "### "). Content before the first matching heading, if any, is returned
/// with a `None` heading.
fn split_by_heading(text: &str, prefix: &str) -> Vec<(Option<String>, String)> {
    let mut sections = Vec::new();
    let mut current_heading: Option<String> = None;
    let mut current_body = String::new();

    for line in text.lines() {
        if let Some(title) = line.trim_start().strip_prefix(prefix) {
            let trimmed = current_body.trim();
            if !trimmed.is_empty() || current_heading.is_some() {
                sections.push((current_heading.clone(), trimmed.to_string()));
            }
            current_heading = Some(title.trim().to_string());
            current_body.clear();
        } else {
            current_body.push_str(line);
            current_body.push('\n');
        }
    }
    let trimmed = current_body.trim();
    if !trimmed.is_empty() || current_heading.is_some() {
        sections.push((current_heading, trimmed.to_string()));
    }
    sections
}

/// Fallback for oversized sections with no H3 subheadings: splits on paragraph breaks,
/// keeping a small char overlap between parts so context isn't lost at the boundary.
fn split_by_paragraphs(text: &str, max_chars: usize, overlap: usize) -> Vec<String> {
    let paragraphs: Vec<&str> = text.split("\n\n").filter(|p| !p.trim().is_empty()).collect();
    let mut parts = Vec::new();
    let mut current = String::new();

    for para in paragraphs {
        if !current.is_empty() && current.len() + para.len() + 2 > max_chars {
            parts.push(current.clone());
            let tail: String = current.chars().rev().take(overlap).collect::<Vec<_>>().into_iter().rev().collect();
            current = tail;
        }
        if !current.is_empty() {
            current.push_str("\n\n");
        }
        current.push_str(para);
    }
    if !current.trim().is_empty() {
        parts.push(current);
    }
    parts
}

fn with_heading_prefix(heading: &Option<String>, body: &str) -> String {
    match heading {
        Some(h) => format!("{}\n\n{}", h, body),
        None => body.to_string(),
    }
}

/// Chunks a post's raw markdown by H2 section, splitting further on H3 (or, failing that,
/// paragraph breaks) when a section is too large for a single embedding chunk.
fn chunk_markdown(markdown: &str) -> Vec<Chunk> {
    let mut chunks = Vec::new();
    let mut index = 0;

    for (heading, body) in split_by_heading(markdown, "## ") {
        if body.is_empty() {
            continue;
        }
        if body.len() <= MAX_CHUNK_CHARS {
            chunks.push(Chunk {
                chunk_index: index,
                content: with_heading_prefix(&heading, &body),
                heading,
            });
            index += 1;
            continue;
        }

        let sub_sections = split_by_heading(&body, "### ");
        if sub_sections.len() <= 1 {
            for part in split_by_paragraphs(&body, MAX_CHUNK_CHARS, PARAGRAPH_OVERLAP_CHARS) {
                chunks.push(Chunk {
                    chunk_index: index,
                    content: with_heading_prefix(&heading, &part),
                    heading: heading.clone(),
                });
                index += 1;
            }
        } else {
            for (sub_heading, sub_body) in sub_sections {
                if sub_body.is_empty() {
                    continue;
                }
                let full_heading = match (&heading, &sub_heading) {
                    (Some(h), Some(sh)) => Some(format!("{} > {}", h, sh)),
                    (Some(h), None) => Some(h.clone()),
                    (None, Some(sh)) => Some(sh.clone()),
                    (None, None) => None,
                };
                chunks.push(Chunk {
                    chunk_index: index,
                    content: with_heading_prefix(&full_heading, &sub_body),
                    heading: full_heading,
                });
                index += 1;
            }
        }
    }

    chunks
}

fn content_hash(markdown: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(markdown.as_bytes());
    format!("{:x}", hasher.finalize())
}

fn existing_hash(
    client: &reqwest::blocking::Client,
    supabase_url: &str,
    supabase_key: &str,
    source_type: &str,
    slug: &str,
) -> Option<String> {
    let url = format!(
        "{}/rest/v1/content_chunks?source_type=eq.{}&source_id=eq.{}&select=content_hash&limit=1",
        supabase_url, source_type, slug
    );
    let res = client
        .get(&url)
        .header("apikey", supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .send()
        .ok()?;
    let rows: Vec<serde_json::Value> = res.json().ok()?;
    rows.first()?.get("content_hash")?.as_str().map(|s| s.to_string())
}

// Must match the embedding model used in app/utils/openai.server.ts's getEmbedding —
// a mismatch won't error, it'll just silently produce meaningless similarity scores.
fn embed_batch(
    client: &reqwest::blocking::Client,
    openai_key: &str,
    texts: &[&str],
) -> Result<Vec<Vec<f32>>, String> {
    let res = client
        .post("https://api.openai.com/v1/embeddings")
        .header("Authorization", format!("Bearer {}", openai_key))
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "model": "text-embedding-3-small",
            "input": texts,
        }))
        .send()
        .map_err(|e| e.to_string())?;

    let status = res.status();
    let body: serde_json::Value = res.json().map_err(|e| e.to_string())?;
    if !status.is_success() {
        return Err(format!("OpenAI API error {}: {}", status, body));
    }

    let data = body.get("data").and_then(|d| d.as_array()).ok_or("missing data field")?;
    let mut embeddings = vec![Vec::new(); data.len()];
    for item in data {
        let idx = item.get("index").and_then(|i| i.as_u64()).ok_or("missing index")? as usize;
        let embedding: Vec<f32> = item
            .get("embedding")
            .and_then(|e| e.as_array())
            .ok_or("missing embedding")?
            .iter()
            .filter_map(|v| v.as_f64().map(|f| f as f32))
            .collect();
        if idx < embeddings.len() {
            embeddings[idx] = embedding;
        }
    }
    Ok(embeddings)
}

fn delete_chunks_for_slug(
    client: &reqwest::blocking::Client,
    supabase_url: &str,
    supabase_key: &str,
    source_type: &str,
    slug: &str,
) -> Result<(), String> {
    let url = format!(
        "{}/rest/v1/content_chunks?source_type=eq.{}&source_id=eq.{}",
        supabase_url, source_type, slug
    );
    let res = client
        .delete(&url)
        .header("apikey", supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .send()
        .map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        return Err(format!("delete failed with status {}", res.status()));
    }
    Ok(())
}

fn insert_chunks(
    client: &reqwest::blocking::Client,
    supabase_url: &str,
    supabase_key: &str,
    rows: &[serde_json::Value],
) -> Result<(), String> {
    let url = format!("{}/rest/v1/content_chunks", supabase_url);
    let res = client
        .post(&url)
        .header("apikey", supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .header("Content-Type", "application/json")
        .header("Prefer", "return=minimal")
        .json(rows)
        .send()
        .map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        let status = res.status();
        let text = res.text().unwrap_or_default();
        return Err(format!("insert failed with status {}: {}", status, text));
    }
    Ok(())
}

fn delete_orphaned_slugs(
    client: &reqwest::blocking::Client,
    supabase_url: &str,
    supabase_key: &str,
    source_type: &str,
    current_slugs: &[&str],
) -> Result<(), String> {
    let url = format!(
        "{}/rest/v1/content_chunks?source_type=eq.{}&select=source_id",
        supabase_url, source_type
    );
    let res = client
        .get(&url)
        .header("apikey", supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .send()
        .map_err(|e| e.to_string())?;
    let rows: Vec<serde_json::Value> = res.json().map_err(|e| e.to_string())?;

    let mut existing_slugs: Vec<String> = rows
        .iter()
        .filter_map(|r| r.get("source_id").and_then(|s| s.as_str()).map(|s| s.to_string()))
        .collect();
    existing_slugs.sort();
    existing_slugs.dedup();

    let orphans: Vec<&String> = existing_slugs
        .iter()
        .filter(|s| !current_slugs.contains(&s.as_str()))
        .collect();
    if orphans.is_empty() {
        return Ok(());
    }

    let list = orphans.iter().map(|s| s.as_str()).collect::<Vec<_>>().join(",");
    let del_url = format!(
        "{}/rest/v1/content_chunks?source_type=eq.{}&source_id=in.({})",
        supabase_url, source_type, list
    );
    let res = client
        .delete(&del_url)
        .header("apikey", supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .send()
        .map_err(|e| e.to_string())?;
    if !res.status().is_success() {
        return Err(format!("orphan delete failed with status {}", res.status()));
    }
    for slug in &orphans {
        println!("rag: removed orphaned chunks for {}", slug);
    }
    Ok(())
}

/// Chunks each doc, embeds via OpenAI, and upserts into Supabase's `content_chunks` table
/// under the given `source_type` (e.g. "blog_post", "personal"). Best-effort throughout:
/// a failure here must never block the actual site build.
fn ingest_documents(
    client: &reqwest::blocking::Client,
    openai_key: &str,
    supabase_url: &str,
    supabase_key: &str,
    docs: &[Post],
    source_type: &str,
    url_for: impl Fn(&str) -> String,
) {
    let current_slugs: Vec<&str> = docs.iter().map(|p| p.slug.as_str()).collect();

    for doc in docs {
        let hash = content_hash(&doc.markdown);

        if let Some(existing) = existing_hash(client, supabase_url, supabase_key, source_type, &doc.slug) {
            if existing == hash {
                println!("rag: skip {}/{} (unchanged)", source_type, doc.slug);
                continue;
            }
        }

        let chunks = chunk_markdown(&doc.markdown);
        if chunks.is_empty() {
            continue;
        }

        let texts: Vec<&str> = chunks.iter().map(|c| c.content.as_str()).collect();
        let embeddings = match embed_batch(client, openai_key, &texts) {
            Ok(e) => e,
            Err(e) => {
                eprintln!("rag: embedding failed for {}/{}: {}", source_type, doc.slug, e);
                continue;
            }
        };
        if embeddings.len() != chunks.len() {
            eprintln!("rag: embedding count mismatch for {}/{}", source_type, doc.slug);
            continue;
        }

        if let Err(e) = delete_chunks_for_slug(client, supabase_url, supabase_key, source_type, &doc.slug) {
            eprintln!("rag: delete failed for {}/{}: {}", source_type, doc.slug, e);
            continue;
        }

        let url = url_for(&doc.slug);
        let rows: Vec<serde_json::Value> = chunks
            .iter()
            .zip(embeddings.iter())
            .map(|(chunk, embedding)| {
                serde_json::json!({
                    "source_type": source_type,
                    "source_id": doc.slug,
                    "chunk_index": chunk.chunk_index,
                    "heading": chunk.heading,
                    "content": chunk.content,
                    "content_hash": hash,
                    "embedding": embedding,
                    "url": url,
                })
            })
            .collect();

        if let Err(e) = insert_chunks(client, supabase_url, supabase_key, &rows) {
            eprintln!("rag: insert failed for {}/{}: {}", source_type, doc.slug, e);
            continue;
        }

        println!("rag: ingested {} chunks for {}/{}", chunks.len(), source_type, doc.slug);
    }

    if let Err(e) = delete_orphaned_slugs(client, supabase_url, supabase_key, source_type, &current_slugs) {
        eprintln!("rag: orphan cleanup failed for {}: {}", source_type, e);
    }
}

fn ingest_for_rag(posts: &[Post], personal_docs: &[Post]) {
    let (openai_key, supabase_url, supabase_key) = match (
        std::env::var("OPENAI_API_KEY").ok(),
        std::env::var("SUPABASE_URL").ok(),
        std::env::var("SUPABASE_SERVICE_ROLE_KEY").ok(),
    ) {
        (Some(a), Some(b), Some(c)) => (a, b, c),
        _ => {
            eprintln!("rag: skipping ingestion, OPENAI_API_KEY/SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set");
            return;
        }
    };

    let client = reqwest::blocking::Client::new();

    // Technical/blog content — the primary source the chat should lean on.
    ingest_documents(
        &client,
        &openai_key,
        &supabase_url,
        &supabase_key,
        posts,
        "blog_post",
        |slug| format!("/blog/{}", slug),
    );

    // Hobbies/personality — supplementary, surfaced only for non-technical questions.
    ingest_documents(
        &client,
        &openai_key,
        &supabase_url,
        &supabase_key,
        personal_docs,
        "personal",
        |_slug| "/about".to_string(),
    );
}

fn main() {
    let posts: Vec<Post> = find_content()
        .into_iter()
        .filter_map(|f| load_post(&f))
        .collect();

    // Not part of the blog listing — ingested into the vector store as supplementary
    // "personal" context only, never written to blog-data.server.ts.
    let personal_docs: Vec<Post> = find_personal_content()
        .into_iter()
        .filter_map(|f| load_post(&f))
        .collect();

    #[derive(Serialize)]
    struct PostMeta<'a> { slug: &'a str, title: &'a str, date: &'a str }
    let meta: Vec<PostMeta> = posts.iter()
        .map(|p| PostMeta { slug: &p.slug, title: &p.title, date: &p.date })
        .collect();

    let posts_json = serde_json::to_string(&meta).unwrap();
    let by_slug_json = serde_json::to_string(
        &posts.iter().map(|p| (&p.slug, p)).collect::<std::collections::HashMap<_, _>>()
    ).unwrap();

    let output = format!(
        "// Auto-generated by api/ssg.rs — do not edit\n\
         export const posts = {};\n\
         export const postsBySlug: Record<string, {{ slug: string; title: string; body: string; date: string }}> = {};\n",
        posts_json, by_slug_json
    );

    fs::write("app/blog-data.server.ts", output).expect("failed to write blog-data.server.ts");
    println!("Generated {} posts into app/blog-data.server.ts", posts.len());

    ingest_for_rag(&posts, &personal_docs);
}
