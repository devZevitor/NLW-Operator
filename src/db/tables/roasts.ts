import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { codeAnalyses } from "./code-analyses"; // Circular import for relations

export const roasts = pgTable("roasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  originalCode: text("original_code").notNull(),
  language: text("language").notNull(), // e.g. 'typescript', 'python'
  sarcasmMode: boolean("sarcasm_mode").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const roastsRelations = relations(roasts, ({ one }) => ({
  analysis: one(codeAnalyses, {
    fields: [roasts.id],
    references: [codeAnalyses.roastId],
  }),
}));
