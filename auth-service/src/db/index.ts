import { config } from "../config";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./schema";
import { eq } from "drizzle-orm";

const db = drizzle(config.DATABASE_URL);

export async function findUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function findUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function createUser(data: any) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}
