import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { INTERESTS } from "../src/lib/taxonomy";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const interest of INTERESTS) {
    await prisma.interest.upsert({
      where: { key: interest.key },
      update: {
        label: interest.label,
        arxivCodes: interest.arxivCodes.join(","),
        s2Fields: interest.s2Fields.join(","),
      },
      create: {
        key: interest.key,
        label: interest.label,
        arxivCodes: interest.arxivCodes.join(","),
        s2Fields: interest.s2Fields.join(","),
      },
    });
  }
  console.log(`Seeded ${INTERESTS.length} interests.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
