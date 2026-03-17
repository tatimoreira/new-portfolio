import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getPost } from "~/utils/blog.server"

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPost(params.slug!)
  if (!post) throw new Response("Not Found", { status: 404 })
  return json(post)
}

export default function BlogPost() {
  const post = useLoaderData<typeof loader>()

  return (
    <div className="py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 capitalize">{post.title}</h1>
      <article
        className="prose dark:prose-invert prose-headings:text-[#f5b1cc] prose-a:text-link-color prose-code:text-link-color dark:prose-a:text-[--accent1] dark:prose-code:text-[--accent1] max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </div>
  )
}
