import "dotenv/config";
import z from "zod";

const configSchema = z.object({
  SERVER_PORT: z.coerce.number().int().min(4000).max(4999),
  DATABASE_URL: z.string().min(1),
  LOG_LEVEL: z.enum([
    "debug",
    "error",
    "fatal",
    "info",
    "silent",
    "trace",
    "warn",
  ]),
  REDIS_URL: z.string(),
  // KAFKA_BROKERS: z.string(),
  JWT_SECRET: z.string()
});

export const config = configSchema.parse(process.env);
