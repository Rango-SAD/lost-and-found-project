import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "نام کاربری حداقل ۳ کاراکتر باشد")
    .max(20, "نام کاربری حداکثر ۲۰ کاراکتر باشد")
    .regex(/^[a-zA-Z0-9_]+$/, "فقط حروف/عدد و _ مجاز است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

export type LoginSchema = z.infer<typeof loginSchema>;