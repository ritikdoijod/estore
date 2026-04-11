import { db } from "#/db/index.js";
import { customers } from "#/db/schema.js";
import type { CreateCustomerRequestDTO } from "#/schemas/customer.js";
import { eq } from "drizzle-orm";

export async function findAll() {
  return db.select().from(customers);
}

export async function findById(id: string) {
  const result = await db.select().from(customers).where(eq(customers.id, id));
  return result[0];
}

export async function findByEmail(email: string) {
  const result = await db.select().from(customers).where(eq(customers.email, email));
  return result[0];
}

export async function create(payload: CreateCustomerRequestDTO) {
  const result = await db.insert(customers).values(payload).returning();
  return result[0];
}