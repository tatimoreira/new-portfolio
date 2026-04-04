import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getAllPosts } from "~/utils/blog.server"

export async function loader() {
  try {
    const posts = await getAllPosts()
    return json(posts)
  } catch {
    return json([] as { slug: string; title: string; date: string }[])
  }
}

function parseDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00")
}

function groupByYear(posts: { slug: string; title: string; date: string }[]) {
  const map = new Map<number, typeof posts>()
  for (const post of posts) {
    const year = post.date ? parseDate(post.date).getFullYear() : 0
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return Array.from(map.entries()).sort(([a], [b]) => b - a)
}

function monthDay(dateStr: string) {
  const d = parseDate(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${mm}/${dd}`
}

export default function BlogIndex() {
  const posts = useLoaderData<typeof loader>()
  const grouped = groupByYear(posts)

  return (
    <div className="py-12 max-w-2xl w-full">
      <h1 className="text-2xl font-semibold mb-10 text-caret-color">
        Writing
      </h1>
      <div className="flex flex-col">
        {grouped.map(([year, yearPosts]) => (
          <div key={year} className="border-t border-main-color/20 dark:border-main-color/20 frutiger:border-main-color/30">
            {yearPosts.map((post, i) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group grid grid-cols-[80px_1fr_48px] items-baseline gap-4 py-4 border-b border-main-color/20 dark:border-main-color/20 frutiger:border-main-color/30 hover:bg-main-color/5 transition-colors duration-150 rounded"
              >
                <span className="text-sm font-mono text-sub-color">
                  {i === 0 ? year : ""}
                </span>
                <span className="text-sm text-main-color group-hover:text-link-color dark:group-hover:text-link-color frutiger:group-hover:text-link-color transition-colors duration-150">
                  {post.title}
                </span>
                <span className="text-sm font-mono text-sub-color text-right">
                  {post.date ? monthDay(post.date) : ""}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
