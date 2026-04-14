import { PrismaClient } from "@prisma/client";
// @ts-ignore — types say PrismaLibSql but runtime export is PrismaLibSQL
import { PrismaLibSQL } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Fall back to local SQLite if Turso env vars are not set (dev without Turso)
  if (!url) {
    return new PrismaClient();
  }

  const adapter = new PrismaLibSQL({ url, authToken } as any);
  return new PrismaClient({ adapter } as any);
}

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = createPrismaClient();
  }
  prisma = global.__db__;
}

export { prisma };
