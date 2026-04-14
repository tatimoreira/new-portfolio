/**
 * One-time import script for 跟宝宝说话.txt
 * Run: npx ts-node --require tsconfig-paths/register prisma/seed-mandarin.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Chinese character range
const HAN_RE = /[\u4e00-\u9fff\u3400-\u4dbf]/;
// Pinyin tone marks
const PINYIN_RE = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;

function hasHanzi(s: string) {
  return HAN_RE.test(s);
}
function looksLikePinyin(s: string) {
  return PINYIN_RE.test(s);
}

// Known sub-categories from the document and which top-level category they belong to.
// Sub-categories are used as the app category name.
const SUBCATEGORY_EMOJI: Record<string, string> = {
  "Aseo personal": "🛁",
  "Baño": "🛁",
  "Lavarse las manos": "🤲",
  "Lavarse los dientes": "🦷",
  "Nariz": "👃",
  "Cortarse las uñas": "✂️",
  "Pelo": "💇",
  "Caca y orines": "🚽",
  "走走": "🚶‍♀️",
  "de prisa": "💨",
  "En el  parque": "🌳",
  "En el parque": "🌳",
  "Clima": "☁️",
  "Lluvia": "🌧️",
  "Soleado": "☀️",
  "Bosque": "🌲",
  "Flores": "🌸",
  "Animales": "🐾",
  "animales": "🐾",
  "Mariposas": "🦋",
  "Dinosaurios": "🦕",
  "Perro": "🐶",
  "Gatos": "🐱",
  "Emociones": "😊",
  "Amor": "❤️",
  "Abrazos": "🤗",
  "Besos": "💋",
  "Llanto": "😢",
  "Enojo": "😡",
  "Dolor": "🤕",
  "Prohibiciones": "🚫",
  "睡觉": "💤",
  "Dormir": "💤",
  "Juego": "🧸",
  "Escondido": "🙈",
  "Limpieza": "🧹",
  "Lectura": "📚",
  "natacion": "🏊‍♀️",
  "Natación": "🏊‍♀️",
  "Ropa": "🎽",
  "Ayuda": "🙌",
  "Carro": "🚗",
  "carro": "🚗",
  "Naturaleza": "🌿",
  "Comida": "🥦",
  "Frutas": "🍎",
  "Tienda": "🛍️",
  "Festivos": "🎉",
  "Halloween": "🎃",
  "身体指令": "💪",
  "Cute": "🥰",
};

// Lines that should be treated as category headers (not entries)
const KNOWN_HEADERS = new Set(Object.keys(SUBCATEGORY_EMOJI).map((k) => k.toLowerCase().trim()));


function isLikelyCategoryHeader(line: string): boolean {
  const clean = line.replace(/[\p{Emoji_Presentation}]/gu, "").trim();
  // Pure Spanish/English text (no Chinese chars)
  if (!hasHanzi(line) && clean.length > 0 && clean.length < 50) return true;
  // Has Chinese but matches a known header
  if (KNOWN_HEADERS.has(clean.toLowerCase())) return true;
  return false;
}

interface Entry {
  hanzi: string;
  pinyin: string;
  english: string;
  notes?: string;
}

interface CategoryData {
  name: string;
  emoji: string;
  entries: Entry[];
}

function parseTxt(filePath: string): CategoryData[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");

  // Skip the table of contents — find the separator ________________
  const separatorIdx = lines.findIndex((l) => l.trim().startsWith("________________"));
  const contentLines = separatorIdx >= 0 ? lines.slice(separatorIdx + 1) : lines;

  // Group non-empty lines into blocks separated by blank lines
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of contentLines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
    } else {
      current.push(trimmed);
    }
  }
  if (current.length > 0) blocks.push(current);

  // State machine: track current category
  const categories: CategoryData[] = [];
  let currentCat: CategoryData | null = null;

  function getOrCreateCategory(name: string): CategoryData {
    // Normalize name
    const normalName = name.replace(/[\p{Emoji_Presentation}]/gu, "").trim();
    const existing = categories.find(
      (c) => c.name.toLowerCase() === normalName.toLowerCase()
    );
    if (existing) return existing;
    const emoji = SUBCATEGORY_EMOJI[normalName] || SUBCATEGORY_EMOJI[name] || "📚";
    const cat: CategoryData = { name: normalName, emoji, entries: [] };
    categories.push(cat);
    return cat;
  }

  for (const block of blocks) {
    // Skip decorative-only blocks (just emoji)
    const combined = block.join(" ").trim();
    if (combined.replace(/[\p{Emoji_Presentation}\s]/gu, "").length === 0) continue;

    if (block.length === 1) {
      const line = block[0];

      // Try inline format: "椅子Yǐzi silla" (hanzi+pinyin+translation on one line)
      const inlineMatch = line.match(/^([\u4e00-\u9fff\u3400-\u4dbf]+)\s*([A-ZĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛ][a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\s]+?)\s+([^\u4e00-\u9fff]{4,})$/);
      if (inlineMatch) {
        const [, hanzi, pinyin, english] = inlineMatch;
        if (currentCat) {
          currentCat.entries.push({ hanzi: hanzi.trim(), pinyin: pinyin.trim(), english: english.trim() });
        }
        continue;
      }

      // Category header
      if (isLikelyCategoryHeader(line)) {
        const clean = line.replace(/[\p{Emoji_Presentation}]/gu, "").trim();
        if (clean.length > 0) {
          currentCat = getOrCreateCategory(clean);
        }
        continue;
      }

      // Single Chinese line without pinyin — skip (incomplete entry)
      continue;
    }

    // Multi-line block — try to parse as entry
    const nonEmpty = block.filter((l) => l.trim().length > 0);

    if (nonEmpty.length >= 2) {
      const line1 = nonEmpty[0];
      const line2 = nonEmpty[1];
      const line3 = nonEmpty[2] || "";

      // Pattern: hanzi / pinyin / translation
      if (hasHanzi(line1) && looksLikePinyin(line2)) {
        const pinyin = looksLikePinyin(line2) ? line2 : "";
        const english = line3 || line2;

        if (!currentCat) {
          currentCat = getOrCreateCategory("General");
        }
        currentCat.entries.push({
          hanzi: line1.trim(),
          pinyin: pinyin.trim(),
          english: english.trim(),
        });
        continue;
      }

      // Pattern: category header on line1, entries start after — treat as header
      if (isLikelyCategoryHeader(line1) && !hasHanzi(line1)) {
        const clean = line1.replace(/[\p{Emoji_Presentation}]/gu, "").trim();
        if (clean.length > 0) currentCat = getOrCreateCategory(clean);
        // Try to parse remaining lines as entry
        if (nonEmpty.length >= 3 && hasHanzi(nonEmpty[1]) && looksLikePinyin(nonEmpty[2])) {
          currentCat!.entries.push({
            hanzi: nonEmpty[1].trim(),
            pinyin: nonEmpty[2].trim(),
            english: nonEmpty[3]?.trim() || "",
          });
        }
        continue;
      }
    }
  }

  return categories.filter((c) => c.entries.length > 0);
}

async function main() {
  const filePath = path.join(process.env.HOME || "~", "Downloads", "跟宝宝说话.txt");

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log("Parsing file...");
  const categories = parseTxt(filePath);

  const totalEntries = categories.reduce((a, c) => a + c.entries.length, 0);
  console.log(`Found ${categories.length} categories, ${totalEntries} entries`);

  for (const cat of categories) {
    console.log(`  ${cat.emoji} ${cat.name}: ${cat.entries.length} entries`);
  }

  console.log("\nInserting into database...");

  for (const cat of categories) {
    const dbCat = await prisma.vocabCategory.upsert({
      where: { name: cat.name },
      update: { emoji: cat.emoji },
      create: { name: cat.name, emoji: cat.emoji },
    });

    for (const entry of cat.entries) {
      // Skip entries with empty translation
      if (!entry.english) continue;
      await prisma.vocabEntry.create({
        data: {
          hanzi: entry.hanzi,
          pinyin: entry.pinyin,
          english: entry.english,
          notes: entry.notes,
          categoryId: dbCat.id,
        },
      });
    }
  }

  console.log("\nDone!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
