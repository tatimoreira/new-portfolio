import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostListItems } from "~/models/post.server";

export const loader = async () => {
  const posts = await getPostListItems();
  return json({ posts });
};

export default function Posts() {
  console.log("posts");
  const { posts } = useLoaderData<typeof loader>();
  console.log("posts", posts);
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
