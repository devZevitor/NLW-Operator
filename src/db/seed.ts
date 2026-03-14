import "dotenv/config"; // Load env vars first!
import { faker } from "@faker-js/faker";
import { codeAnalyses, cruelPhraseEnum, roasts } from "@/db/schema";
import { db } from "@/lib/db";

async function seed() {
  console.log("🌱 Seeding database with fake roasts...");

  try {
    // Generate 100 fake roasts
    for (let i = 0; i < 100; i++) {
      const language = faker.helpers.arrayElement([
        "typescript",
        "javascript",
        "python",
        "go",
        "rust",
        "java",
      ]);
      const isSarcastic = faker.datatype.boolean();

      // Create Roast
      const [insertedRoast] = await db
        .insert(roasts)
        .values({
          originalCode: faker.lorem.paragraphs(2), // Fake code snippet
          language: language,
          sarcasmMode: isSarcastic,
        })
        .returning({ id: roasts.id });

      // Determine Score & Enum logic
      const shameScore = faker.number.int({ min: 0, max: 10 });
      let cruelPhrase: "CRITICAL" | "BAD" | "MEDIOCRE" | "DECENT";

      if (shameScore <= 2) cruelPhrase = "CRITICAL";
      else if (shameScore <= 5) cruelPhrase = "BAD";
      else if (shameScore <= 8) cruelPhrase = "MEDIOCRE";
      else cruelPhrase = "DECENT";

      // Create Analysis
      await db.insert(codeAnalyses).values({
        roastId: insertedRoast.id,
        improvedCode: faker.lorem.paragraphs(2), // Fake improved code
        sarcasticPhrase: faker.company.catchPhrase(), // Just a placeholder for "roast" text
        loc: faker.number.int({ min: 5, max: 200 }),
        shameScore: shameScore,
        cruelPhrase: cruelPhrase,
      });
    }

    console.log("✅ Successfully seeded 100 roasts!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seed();
