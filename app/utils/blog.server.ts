import { posts, postsBySlug } from "~/blog-data.server"

export async function getAllPosts() {
  return posts
}

export async function getPost(slug: string) {
  return postsBySlug[slug] ?? null
}
