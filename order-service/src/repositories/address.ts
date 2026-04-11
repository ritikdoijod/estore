// import { db } from "@/db";
// import { addresses } from "@/db/schema";
// // import type { CreateOrderRequestDTO } from "@/schemas/order";
// import { eq } from "drizzle-orm";

// export async function findByUserId() {
//   return db.select().from(addresses).where(eq(addresses.));
// }

// export async function findById(id: string) {
//   const result = await db.select().from(orders).where(eq(orders.id, id));
//   return result[0];
// }

// // export async function create(payload: CreateOrderRequestDTO) {
// //   const result = await db.insert(orders).values(payload).returning();
// //   return result[0];
// // }

// export async function updateById(id: string, payload: any) {
//   const result = await db
//     .update(orders)
//     .set(payload)
//     .where(eq(orders.id, id))
//     .returning();
//   return result[0];
// }

// export async function deleteById(id: string) {
//   db.delete(orders).where(eq(orders.id, id));
// }
