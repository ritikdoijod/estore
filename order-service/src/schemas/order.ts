import z from "zod";

const orderSchema = z.object({
  customer: z.uuidv7()
})

export type CreateOrderRequestDTO = z.infer<typeof orderSchema>;