import { prisma } from "~/db.server";

export async function getCategories() {
  const [categories, entries] = await Promise.all([
    prisma.vocabCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.vocabEntry.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return categories.map((cat: { id: string; name: string; emoji: string; createdAt: Date }) => ({
    ...cat,
    entries: entries.filter((e: { categoryId: string }) => e.categoryId === cat.id),
  }));
}

export function addCategory(name: string, emoji: string) {
  return prisma.vocabCategory.create({ data: { name, emoji } });
}

export function updateCategory(id: string, name: string, emoji: string) {
  return prisma.vocabCategory.update({ where: { id }, data: { name, emoji } });
}

export function deleteCategory(id: string) {
  return prisma.vocabCategory.delete({ where: { id } });
}

export function addEntry(data: {
  hanzi: string;
  pinyin: string;
  english: string;
  notes?: string;
  categoryId: string;
}) {
  return prisma.vocabEntry.create({ data });
}

export function updateEntry(
  id: string,
  data: { hanzi: string; pinyin: string; english: string; notes?: string }
) {
  return prisma.vocabEntry.update({ where: { id }, data });
}

export function deleteEntry(id: string) {
  return prisma.vocabEntry.delete({ where: { id } });
}

export function getQueue() {
  return prisma.vocabQueue.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });
}

export function addQueueItem(data: {
  description: string;
  context?: string;
  priority?: boolean;
}) {
  return prisma.vocabQueue.create({ data });
}

export function deleteQueueItem(id: string) {
  return prisma.vocabQueue.delete({ where: { id } });
}

export async function completeQueueItem(
  id: string,
  entry: {
    hanzi: string;
    pinyin: string;
    english: string;
    notes?: string;
    categoryId: string;
  }
) {
  await prisma.vocabEntry.create({ data: entry });
  await prisma.vocabQueue.delete({ where: { id } });
}
