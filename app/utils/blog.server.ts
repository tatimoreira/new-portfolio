import fs from "fs"
import path from "path"

const GENERATED_DIR = path.join(process.cwd(), "generated")

export async function getAllPosts(): Promise<{ slug: string; title: string }[]> {
  const file = path.join(GENERATED_DIR, "posts.json")
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, "utf-8"))
}

export async function getPost(slug: string) {
  const file = path.join(GENERATED_DIR, `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, "utf-8")) as {
    slug: string
    title: string
    body: string
  }
}
