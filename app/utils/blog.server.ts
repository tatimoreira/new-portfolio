const BLOG_API_URL = process.env.BLOG_API_URL!

async function gql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(BLOG_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  const contentType = res.headers.get("content-type") ?? ""
  if (!res.ok || !contentType.includes("application/json")) {
    throw new Error(`Blog API error: ${res.status} ${res.statusText}`)
  }
  const { data } = await res.json()
  return data
}

export async function getAllPosts() {
  const data = await gql<{ posts: { slug: string; title: string }[] }>(`
    query { posts { slug title } }
  `)
  return data.posts
}

export async function getPost(slug: string) {
  const data = await gql<{
    post: { slug: string; title: string; body: string } | null
  }>(
    `query GetPost($slug: String!) { post(slug: $slug) { slug title body } }`,
    { slug }
  )
  return data.post
}
