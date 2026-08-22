import { posts, postsBySlug } from "~/blog-data.server"

export async function getAllPosts() {
  return posts
}

export async function getPost(slug: string) {
  const post = postsBySlug[slug]
  if (!post) return null

  // The rendered body's first element duplicates the title as an <h1>;
  // the route renders its own title so the shared layout transition has
  // a real element to morph into, so strip the duplicate here.
  const body = post.body.replace(/^\s*<h1>.*?<\/h1>\s*/, "")
  return { ...post, body }
}
