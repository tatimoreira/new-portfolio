import { PrismaClient } from "@prisma/client";

// Runtime export is PrismaLibSQL (all caps) despite type mismatch
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaLibSQL } = require("@prisma/adapter-libsql");

function createPrismaClient() {
  const adapter = new PrismaLibSQL({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
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
