import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema"; // Import all schema definitions

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined");
}

// Create postgres client
const client = postgres(process.env.DATABASE_URL);

// Create and export drizzle instance
export const db = drizzle(client, { schema });
