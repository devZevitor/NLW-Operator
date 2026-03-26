import "dotenv/config";
import { faker } from "@faker-js/faker";
import { codeAnalyses, roasts } from "@/db/schema";
import { db } from "@/lib/db";

const codeSnippets = [
  {
    lang: "javascript",
    code: `const isEven = (n) => {\n  if (n == 0) return true;\n  if (n == 1) return false;\n  return isEven(n - 2);\n};`,
    shame: 1,
    phrase: "CRITICAL",
  },
  {
    lang: "python",
    code: `def sleep(ms):\n  start = time.time()\n  while time.time() - start < ms:\n    pass`,
    shame: 2,
    phrase: "CRITICAL",
  },
  {
    lang: "javascript",
    code: `try {\n  doSomething();\n} catch (e) {\n  console.log(e);\n  throw e;\n}`,
    shame: 3,
    phrase: "BAD",
  },
  {
    lang: "typescript",
    code: `const data: any = await fetchData();\nconst user = data.user as any;\nconsole.log(user.name);`,
    shame: 4,
    phrase: "BAD",
  },
  {
    lang: "java",
    code: `public Boolean isTrue(Boolean value) {\n    if (value.toString().length() == 4) {\n        return true;\n    }\n    return false;\n}`,
    shame: 0,
    phrase: "CRITICAL",
  },
  {
    lang: "python",
    code: `if user.role == 'admin' or user.role == 'superadmin' or user.role == 'manager' or user.role == 'owner':\n  return True`,
    shame: 5,
    phrase: "BAD",
  },
  {
    lang: "javascript",
    code: `// TODO: fix this later\n// TODO: really fix this later\n// TODO: please for the love of god fix this later\nconst x = 1;`,
    shame: 6,
    phrase: "MEDIOCRE",
  },
];

async function seed() {
  console.log("🌱 Seeding database with REALISTIC roasts...");

  try {
    // Clear existing data to fix the "lorem ipsum" issue
    await db.delete(codeAnalyses);
    await db.delete(roasts);
    console.log("🧹 Cleared existing data");

    // Insert curated snippets
    for (const snippet of codeSnippets) {
      const isSarcastic = faker.datatype.boolean();

      const [insertedRoast] = await db
        .insert(roasts)
        .values({
          originalCode: snippet.code,
          language: snippet.lang,
          sarcasmMode: isSarcastic,
        })
        .returning({ id: roasts.id });

      await db.insert(codeAnalyses).values({
        roastId: insertedRoast.id,
        improvedCode: "// Use a proper algorithm or library instead.",
        sarcasticPhrase: faker.company.catchPhrase(),
        loc: snippet.code.split("\n").length,
        shameScore: snippet.shame,
        cruelPhrase: snippet.phrase as
          | "CRITICAL"
          | "BAD"
          | "MEDIOCRE"
          | "DECENT",
      });
    }

    // Add some random filler data but with slightly better code structure
    for (let i = 0; i < 15; i++) {
      const language = faker.helpers.arrayElement([
        "typescript",
        "javascript",
        "python",
        "go",
        "rust",
        "java",
      ]);
      const shameScore = faker.number.int({ min: 0, max: 10 });
      let cruelPhrase: "CRITICAL" | "BAD" | "MEDIOCRE" | "DECENT";

      if (shameScore <= 2) cruelPhrase = "CRITICAL";
      else if (shameScore <= 5) cruelPhrase = "BAD";
      else if (shameScore <= 8) cruelPhrase = "MEDIOCRE";
      else cruelPhrase = "DECENT";

      const [insertedRoast] = await db
        .insert(roasts)
        .values({
          originalCode: `function randomCode${i}() {\n  // This is a placeholder for roast #${i}\n  console.log("Hello World");\n  return ${i};\n}`,
          language: language,
          sarcasmMode: faker.datatype.boolean(),
        })
        .returning({ id: roasts.id });

      await db.insert(codeAnalyses).values({
        roastId: insertedRoast.id,
        improvedCode: "console.log('Better code');",
        sarcasticPhrase: faker.company.catchPhrase(),
        loc: 5,
        shameScore: shameScore,
        cruelPhrase: cruelPhrase,
      });
    }

    console.log("✅ Successfully seeded database with realistic code!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seed();
