import { createClient } from "@libsql/client";

function getDb() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error("TURSO_DATABASE_URL is not set");
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
}

export async function getCategories() {
  const db = getDb();
  const [cats, entries] = await Promise.all([
    db.execute("SELECT id, name, emoji, createdAt FROM VocabCategory ORDER BY name ASC"),
    db.execute("SELECT id, hanzi, pinyin, english, notes, categoryId, createdAt FROM VocabEntry ORDER BY createdAt ASC"),
  ]);

  const categories = cats.rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    emoji: r.emoji as string,
    createdAt: r.createdAt as string,
  }));

  const allEntries = entries.rows.map((r) => ({
    id: r.id as string,
    hanzi: r.hanzi as string,
    pinyin: r.pinyin as string,
    english: r.english as string,
    notes: r.notes as string | null,
    categoryId: r.categoryId as string,
    createdAt: r.createdAt as string,
  }));

  return categories.map((cat) => ({
    ...cat,
    entries: allEntries.filter((e) => e.categoryId === cat.id),
  }));
}

export async function addCategory(name: string, emoji: string) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO VocabCategory (id, name, emoji, createdAt) VALUES (?, ?, ?, datetime('now'))",
    args: [id, name, emoji],
  });
}

export async function updateCategory(id: string, name: string, emoji: string) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE VocabCategory SET name = ?, emoji = ? WHERE id = ?",
    args: [name, emoji, id],
  });
}

export async function deleteCategory(id: string) {
  const db = getDb();
  await db.execute({ sql: "DELETE FROM VocabCategory WHERE id = ?", args: [id] });
}

export async function addEntry(data: {
  hanzi: string;
  pinyin: string;
  english: string;
  notes?: string;
  categoryId: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO VocabEntry (id, hanzi, pinyin, english, notes, categoryId, createdAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
    args: [id, data.hanzi, data.pinyin, data.english, data.notes ?? null, data.categoryId],
  });
}

export async function updateEntry(
  id: string,
  data: { hanzi: string; pinyin: string; english: string; notes?: string }
) {
  const db = getDb();
  await db.execute({
    sql: "UPDATE VocabEntry SET hanzi = ?, pinyin = ?, english = ?, notes = ? WHERE id = ?",
    args: [data.hanzi, data.pinyin, data.english, data.notes ?? null, id],
  });
}

export async function deleteEntry(id: string) {
  const db = getDb();
  await db.execute({ sql: "DELETE FROM VocabEntry WHERE id = ?", args: [id] });
}

export async function getQueue() {
  const db = getDb();
  const result = await db.execute(
    "SELECT id, description, context, priority, createdAt FROM VocabQueue ORDER BY priority DESC, createdAt ASC"
  );
  return result.rows.map((r) => ({
    id: r.id as string,
    description: r.description as string,
    context: r.context as string | null,
    priority: Boolean(r.priority),
    createdAt: r.createdAt as string,
  }));
}

export async function addQueueItem(data: {
  description: string;
  context?: string;
  priority?: boolean;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO VocabQueue (id, description, context, priority, createdAt) VALUES (?, ?, ?, ?, datetime('now'))",
    args: [id, data.description, data.context ?? null, data.priority ? 1 : 0],
  });
}

export async function deleteQueueItem(id: string) {
  const db = getDb();
  await db.execute({ sql: "DELETE FROM VocabQueue WHERE id = ?", args: [id] });
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
  const db = getDb();
  const newId = crypto.randomUUID();
  await db.batch([
    {
      sql: "INSERT INTO VocabEntry (id, hanzi, pinyin, english, notes, categoryId, createdAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
      args: [newId, entry.hanzi, entry.pinyin, entry.english, entry.notes ?? null, entry.categoryId],
    },
    {
      sql: "DELETE FROM VocabQueue WHERE id = ?",
      args: [id],
    },
  ]);
}
