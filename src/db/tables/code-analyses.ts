import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { roasts } from "./roasts"; // Circular import for relations

// Define the cruel phrase enum based on score ranges
// CRITICAL: 0-2 (Isso precisa de ajuda urgentemente)
// BAD: 3-5 (Ainda tem salvação?)
// MEDIOCRE: 6-8 (Funciona, mas a que custo?)
// DECENT: 9-10 (Até que não está horrível)
export const cruelPhraseEnum = pgEnum("cruel_phrase", [
  "CRITICAL",
  "BAD",
  "MEDIOCRE",
  "DECENT",
]);

export const codeAnalyses = pgTable("code_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  roastId: uuid("roast_id")
    .references(() => roasts.id, { onDelete: "cascade" })
    .notNull(),
  improvedCode: text("improved_code").notNull(),
  sarcasticPhrase: text("sarcastic_phrase").notNull(),
  loc: integer("loc").notNull(), // Lines of Code
  shameScore: integer("shame_score").notNull(), // 0-10
  cruelPhrase: cruelPhraseEnum("cruel_phrase").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const codeAnalysesRelations = relations(codeAnalyses, ({ one }) => ({
  roast: one(roasts, {
    fields: [codeAnalyses.roastId],
    references: [roasts.id],
  }),
}));
