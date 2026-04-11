import { Hono } from "hono";
import * as orderService from "#/services/order.js";

const router = new Hono();

router.get("/", async (c) => {
  const orders = await orderService.getOrders();
  return c.json(orders);
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const order = await orderService.getOrder(id);
  return c.json(order);
});

router.post("/", async (c) => {
  const payload = await c.req.json();
  const order = await orderService.createOrder(payload);
  return c.json(order, 201);
});

export default router;
