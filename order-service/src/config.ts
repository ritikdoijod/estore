import 'dotenv/config';
import z from 'zod';

const configSchema = z.object({
    SERVER_PORT: z.coerce.number().int().min(4000).max(4999),
    DATABASE_URL: z.string().min(1)
});

export const config = configSchema.parse(process.env);