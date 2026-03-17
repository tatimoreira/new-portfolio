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
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </div>
  )
}
