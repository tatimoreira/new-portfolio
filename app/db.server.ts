import { PrismaClient } from "@prisma/client";
// @ts-ignore
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return new PrismaClient();
  }

  const client = createClient({ url, authToken });
  const adapter = new PrismaLibSQL(client);
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
