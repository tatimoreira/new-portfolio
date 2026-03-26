import type { LoaderFunction } from "@remix-run/node"
import { getAllPosts } from "~/utils/blog.server"

const SITE_URL = "https://www.tatimoreira.me"

const staticRoutes = ["/", "/about", "/experience", "/blog"]

export const loader: LoaderFunction = async () => {
  const posts = await getAllPosts()

  const urls = [
    ...staticRoutes.map((path) => ({
      loc: `${SITE_URL}${path}`,
      priority: path === "/" ? "1.0" : "0.8",
    })),
    ...posts.map((post: { slug: string }) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      priority: "0.6",
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
