import { db } from "#/db/index.js";
import { orders } from "#/db/schema.js";
import type { CreateOrderRequestDTO } from "#/schemas/order.js";
import { eq } from "drizzle-orm";

export async function findAll() {
  return db.select().from(orders);
}

export async function findById(id: string) {
  const result = await db.select().from(orders).where(eq(orders.id, id));
  return result[0];
}

export async function create(data: CreateOrderRequestDTO) {
  const result = await db.insert(orders).values(data).returning();
  return result[0];
}

export async function updateById(id: string, data: any) {
  const result = await db
    .update(orders)
    .set(data)
    .where(eq(orders.id, id))
    .returning();
  return result[0];
}

export async function deleteById(id: string) {
  db.delete(orders).where(eq(orders.id, id));
}
