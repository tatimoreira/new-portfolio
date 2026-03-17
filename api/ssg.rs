use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Serialize)]
struct Post {
    slug: String,
    title: String,
    body: String,
}

fn content_dir() -> String {
    std::env::var("CONTENT_DIR").unwrap_or_else(|_| "content".into())
}

fn find_content() -> Vec<String> {
    walkdir::WalkDir::new(content_dir())
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().display().to_string().ends_with(".md"))
        .map(|e| e.path().display().to_string())
        .collect()
}

fn load_post(file: &str) -> Option<Post> {
    let markdown = fs::read_to_string(file).ok()?;
    let parser = pulldown_cmark::Parser::new_ext(&markdown, pulldown_cmark::Options::all());
    let mut body = String::new();
    pulldown_cmark::html::push_html(&mut body, parser);

    let slug = Path::new(file)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_owned();

    let title = slug.replace('-', " ").replace('_', " ");

    Some(Post { slug, title, body })
}

fn main() {
    let out_dir = "generated";
    fs::create_dir_all(out_dir).expect("failed to create generated dir");

    let posts: Vec<Post> = find_content()
        .into_iter()
        .filter_map(|f| load_post(&f))
        .collect();

    // Write individual post files
    for post in &posts {
        let out = format!("{}/{}.json", out_dir, post.slug);
        fs::write(&out, serde_json::to_string(post).unwrap())
            .expect("failed to write post file");
    }

    // Write posts index (slug + title only)
    #[derive(Serialize)]
    struct PostMeta<'a> { slug: &'a str, title: &'a str }
    let meta: Vec<PostMeta> = posts.iter()
        .map(|p| PostMeta { slug: &p.slug, title: &p.title })
        .collect();
    fs::write(
        format!("{}/posts.json", out_dir),
        serde_json::to_string(&meta).unwrap(),
    ).expect("failed to write posts index");

    println!("Generated {} posts into {}/", posts.len(), out_dir);
}
