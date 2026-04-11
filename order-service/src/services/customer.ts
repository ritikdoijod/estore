import { HTTPException } from "hono/http-exception";
import * as customerRepo from "#/repositories/customer.js";
import type { CreateOrderRequestDTO } from "#/schemas/order.js";
import type { CreateCustomerRequestDTO } from "#/schemas/customer.js";

export async function getCustomers() {
  return customerRepo.findAll();
}

export async function getCustomer(id: string) {
  const customer = await customerRepo.findById(id);
  if (!customer) throw new HTTPException(404, { message: "Customer not found" });
  return customer;
}

export async function createOrder(payload: CreateCustomerRequestDTO) {
  const customer = await customerRepo.findByEmail(payload.email);

  if (customer)
    throw new HTTPException(400, { message: `Customer already exist with email: ${payload.email}` });
  
  return customerRepo.create(payload);
}
