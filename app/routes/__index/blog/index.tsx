import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getAllPosts } from "~/utils/blog.server"

export async function loader() {
  try {
    const posts = await getAllPosts()
    return json(posts)
  } catch {
    return json([] as { slug: string; title: string }[])
  }
}

export default function BlogIndex() {
  const posts = useLoaderData<typeof loader>()

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="text-xl hover:underline capitalize">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
