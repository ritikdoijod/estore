import z, { email } from "zod";

const customerSchema = z.object({
    firstName: z.string().min(3).max(255),
    lastName: z.string().min(1).max(255),
    email: z.email()
})

export type CreateCustomerRequestDTO = z.infer<typeof customerSchema>;