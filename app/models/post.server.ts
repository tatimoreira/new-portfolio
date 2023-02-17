import { prisma } from "~/db.server";

export async function getPostListItems() {
  //from the db it just request these values
  return prisma.post.findMany({ select: { title: true, slug: true } });
}
