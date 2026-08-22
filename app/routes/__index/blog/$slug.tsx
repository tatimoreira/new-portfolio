import { json } from "@remix-run/node"
import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { motion } from "framer-motion"
import { getPost } from "~/utils/blog.server"
import { monthDay } from "~/utils/format-date"
import { ArrowLeftIcon } from "~/components/Icons/ArrowLeftIcon"

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
    <div className="py-12 sm:pb-28 max-w-3xl w-full overflow-x-hidden">
      <Link
        to="/blog"
        className="group inline-flex items-center gap-1.5 mb-6 text-sm text-sub-color hover:text-link-color dark:hover:text-link-color frutiger:hover:text-link-color transition-colors duration-150"
      >
        <ArrowLeftIcon className="transition-transform duration-150 group-hover:-translate-x-0.5" />
        Back to writing
      </Link>
      <header className="mb-12 pb-6 flex items-baseline justify-between gap-4 border-b border-main-color/20 dark:border-main-color/20 frutiger:border-main-color/30">
        <motion.h1
          layoutId={`blog-title-${post.slug}`}
          className="text-2xl sm:text-3xl font-semibold text-main-color leading-tight"
        >
          {post.title}
        </motion.h1>
        {post.date && (
          <motion.span
            layoutId={`blog-date-${post.slug}`}
            className="shrink-0 text-sm font-mono text-sub-color"
          >
            {monthDay(post.date)}
          </motion.span>
        )}
      </header>
      <article
        className="prose dark:prose-invert prose-headings:text-[#f5b1cc] prose-a:text-link-color prose-code:text-link-color dark:prose-a:text-[--accent1] dark:prose-code:text-[--accent1] max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </div>
  )
}
