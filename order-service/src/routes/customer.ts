import { Hono } from "hono";
import * as customerService from "#/services/customer.js";

const router = new Hono();

router.get("/", async (c) => {
  const customers = await customerService.getCustomers();
  return c.json(customers);
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const customer = await customerService.getCustomer(id);
  return c.json(customer);
});

router.post("/", async (c) => {
  const payload = await c.req.json();
  const customer = await customerService.createOrder(payload);
  return c.json(customer, 201);
});

export default router;
