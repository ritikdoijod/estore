import * as customerRepo from "#/repositories/customer.js";
import * as orderRepo from "#/repositories/order.js";
import type { CreateOrderRequestDTO } from "#/schemas/order.js";
import { HTTPException } from "hono/http-exception";

export async function getOrders() {
  return orderRepo.findAll();
}

export async function getOrder(id: string) {
  const order = await orderRepo.findById(id);
  if (!order) throw new HTTPException(404, { message: "Order not found" });
  return order;
}

export async function createOrder(payload: CreateOrderRequestDTO) {
  const customer = await customerRepo.findById(payload.customer);

  if (!customer)
    throw new HTTPException(404, { message: "Customer not found" });
  
  return orderRepo.create(payload);
}
