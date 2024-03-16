import { z } from "zod";

export const jwtPayloadSchema = z.object({
    email: z.string().email(),
    exp: z.number(),
    new_user: z.boolean()
})