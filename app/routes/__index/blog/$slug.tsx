import { json } from "@remix-run/node"
import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getPost } from "~/utils/blog.server"

export const loader: LoaderFunction = async ({ params }) => {
  const post = await getPost(params.slug!)
  if (!post) throw new Response("Not Found", { status: 404 })
  return json(post)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return {}
  const title = `${data.title} | Tatiana Moreira`
  return {
    title,
    "og:title": title,
    "og:type": "article",
  }
}

export default function BlogPost() {
  const post = useLoaderData<typeof loader>()

  return (
    <div className="p-12 max-w-3xl w-full overflow-x-hidden">
      <article
        className="prose dark:prose-invert prose-headings:text-[#f5b1cc] prose-a:text-link-color prose-code:text-link-color dark:prose-a:text-[--accent1] dark:prose-code:text-[--accent1] max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </div>
  )
}
