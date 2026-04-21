import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { config } from "./config";
import { logger } from "./logger";
import { redis } from "./redis";
import router from "./router";

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

  logger.error(err);

  return c.json(
    {
      message: "Internal Server Error",
    },
    500,
  );
});

app.route("/", router);

const server = serve(
  {
    fetch: app.fetch,
    port: config.SERVER_PORT,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  },
);

server.on("close", () => {
  redis.disconnect();
});
