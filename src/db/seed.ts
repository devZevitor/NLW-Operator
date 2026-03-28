import "dotenv/config";
import { faker } from "@faker-js/faker";
import { codeAnalyses, type Highlight, type Issue, roasts } from "@/db/schema";
import { db } from "@/lib/db";

interface SeedSnippet {
  lang: string;
  code: string;
  shame: number;
  phrase: "CRITICAL" | "BAD" | "MEDIOCRE" | "DECENT";
  issues: Issue[];
  highlights: Highlight[];
}

const codeSnippets: SeedSnippet[] = [
  {
    lang: "javascript",
    code: `const isEven = (n) => {
  if (n == 0) return true;
  if (n == 1) return false;
  return isEven(n - 2);
};`,
    shame: 1,
    phrase: "CRITICAL",
    issues: [
      {
        severity: "critical",
        title: "Use of == instead of ===",
        description:
          "Loose equality can cause unexpected type coercion. Use strict equality.",
      },
      {
        severity: "warning",
        title: "Recursive function without memoization",
        description:
          "This recursive approach may cause stack overflow for large inputs.",
      },
    ],
    highlights: [],
  },
  {
    lang: "python",
    code: `def sleep(ms):
  start = time.time()
  while time.time() - start < ms:
    pass`,
    shame: 2,
    phrase: "CRITICAL",
    issues: [
      {
        severity: "critical",
        title: "Busy waiting loop",
        description:
          "Using a while loop with time.time() is CPU-intensive. Use time.sleep() instead.",
      },
      {
        severity: "warning",
        title: "Missing import",
        description: "time module is used but not imported.",
      },
    ],
    highlights: [],
  },
  {
    lang: "javascript",
    code: `try {
  doSomething();
} catch (e) {
  console.log(e);
  throw e;
}`,
    shame: 3,
    phrase: "BAD",
    issues: [
      {
        severity: "warning",
        title: "Rethrowing the same error",
        description:
          "Catching and rethrowing without handling loses the original stack trace context.",
      },
      {
        severity: "info",
        title: "Empty catch block for logging",
        description:
          "Consider more specific error handling or logging frameworks.",
      },
    ],
    highlights: [],
  },
  {
    lang: "typescript",
    code: `const data: any = await fetchData();
const user = data.user as any;
console.log(user.name);`,
    shame: 4,
    phrase: "BAD",
    issues: [
      {
        severity: "critical",
        title: "Using 'any' type",
        description:
          "The 'any' type bypasses TypeScript's type safety. Use proper types instead.",
      },
      {
        severity: "warning",
        title: "No null checking",
        description:
          "Accessing user.name without checking if data.user exists can cause runtime errors.",
      },
    ],
    highlights: [],
  },
  {
    lang: "java",
    code: `public Boolean isTrue(Boolean value) {
    if (value.toString().length() == 4) {
        return true;
    }
    return false;
}`,
    shame: 0,
    phrase: "CRITICAL",
    issues: [
      {
        severity: "critical",
        title: "Nonsensical logic",
        description:
          "Checking if string length equals 4 to determine boolean is completely illogical.",
      },
      {
        severity: "critical",
        title: "Using == with objects",
        description:
          "Comparing Boolean objects with == causes object equality, not value equality.",
      },
      {
        severity: "warning",
        title: "Returning boxed Boolean",
        description:
          "Primitive boolean should be used instead of Boolean object.",
      },
    ],
    highlights: [],
  },
  {
    lang: "python",
    code: `if user.role == 'admin' or user.role == 'superadmin' or user.role == 'manager' or user.role == 'owner':
  return True`,
    shame: 5,
    phrase: "BAD",
    issues: [
      {
        severity: "warning",
        title: "Repeated string comparisons",
        description: "Use 'in' operator with a tuple/list for cleaner code.",
      },
      {
        severity: "info",
        title: "Magic strings",
        description: "Role names as magic strings could be constants or enums.",
      },
    ],
    highlights: [
      {
        title: "Simple conditional",
        description: "The if statement is straightforward and readable.",
      },
    ],
  },
  {
    lang: "javascript",
    code: `// TODO: fix this later
// TODO: really fix this later
// TODO: please for the love of god fix this later
const x = 1;`,
    shame: 6,
    phrase: "MEDIOCRE",
    issues: [
      {
        severity: "warning",
        title: "Multiple TODO comments",
        description: "Multiple TODO comments suggest unfinished work.",
      },
      {
        severity: "info",
        title: "Dead code",
        description: "Constant x is declared but never used.",
      },
    ],
    highlights: [
      {
        title: "Clean variable declaration",
        description:
          "Using const appropriately for a value that won't be reassigned.",
      },
    ],
  },
  {
    lang: "typescript",
    code: `const filtrarAdultos = lista => lista.filter(user => user.idade >= 18)
const adultos = filtrarAdultos(usuarios)
adultos.forEach((user, index) => {
  console.log(\`\${index} - \${user.nome.toUpperCase()}\`)
})
let total = adultos.reduce((acc, user) => acc + user.idade, 0)
console.log(\`Total de idades: \${total}\`)`,
    shame: 8,
    phrase: "DECENT",
    issues: [
      {
        severity: "info",
        title: "Consistent naming",
        description:
          "Consider using Portuguese or English consistently throughout the code.",
      },
    ],
    highlights: [
      {
        title: "Use of filter",
        description: "Clean use of filter for processing arrays.",
      },
      {
        title: "Use of reduce",
        description: "Appropriate use of reduce for calculating totals.",
      },
      {
        title: "Template literals",
        description: "Good use of template literals for string interpolation.",
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding database with REALISTIC roasts...");

  try {
    await db.delete(codeAnalyses);
    await db.delete(roasts);
    console.log("🧹 Cleared existing data");

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

      const improvedCode = `// Improved version
${snippet.code.replace(/=/g, "===").replace(/console\.log/g, "console.info")}`;

      await db.insert(codeAnalyses).values({
        roastId: insertedRoast.id,
        improvedCode,
        sarcasticPhrase: faker.company.catchPhrase(),
        loc: snippet.code.split("\n").length,
        shameScore: snippet.shame,
        cruelPhrase: snippet.phrase,
        issues: JSON.stringify(snippet.issues),
        highlights: JSON.stringify(snippet.highlights),
      });
    }

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

      const code = `function randomCode${i}() {
  // This is a placeholder for roast #${i}
  console.log("Hello World");
  return ${i};
}`;

      const [insertedRoast] = await db
        .insert(roasts)
        .values({
          originalCode: code,
          language: language,
          sarcasmMode: faker.datatype.boolean(),
        })
        .returning({ id: roasts.id });

      const issues: Issue[] =
        shameScore <= 3
          ? [
              {
                severity: "warning",
                title: "Placeholder code",
                description:
                  "This is a placeholder function that should be replaced with actual implementation.",
              },
            ]
          : [];
      const highlights: Highlight[] =
        shameScore >= 8
          ? [
              {
                title: "Basic function structure",
                description: "Function has proper syntax and return statement.",
              },
            ]
          : [];

      await db.insert(codeAnalyses).values({
        roastId: insertedRoast.id,
        improvedCode: `function randomCode${i}() {\n  // TODO: Implement\n  return ${i};\n}`,
        sarcasticPhrase: faker.company.catchPhrase(),
        loc: 5,
        shameScore,
        cruelPhrase,
        issues: JSON.stringify(issues),
        highlights: JSON.stringify(highlights),
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
