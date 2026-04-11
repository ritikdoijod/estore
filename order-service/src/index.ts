import { config } from "#/config.js";
import customerRoute from "#/routes/customer.js";
import orderRoute from "#/routes/order.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
      },
      err.status,
    );
  }

  console.error(err);

  return c.json(
    {
      message: "Internal Server Error",
    },
    500,
  );
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/customers", customerRoute);
app.route("/orders", orderRoute);

serve(
  {
    fetch: app.fetch,
    port: config.SERVER_PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
