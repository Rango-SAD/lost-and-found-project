import { z } from "zod"

export const registerSchema = z
  .object({
    username: z.string().min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد"),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(6, "تکرار رمز عبور الزامی است"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیستند",
  })

export type RegisterSchema = z.infer<typeof registerSchema>