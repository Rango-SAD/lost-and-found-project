import { z } from "zod"

export const requestCodeSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
})

export type RequestCodeSchema = z.infer<typeof requestCodeSchema>