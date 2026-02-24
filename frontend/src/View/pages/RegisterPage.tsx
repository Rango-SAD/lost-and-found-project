import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

import { GlassCard } from "../components/GlassCard"
import { TextField } from "../components/TextField"
import { PrimaryButton } from "../components/PrimaryButton"
import logo from "../assets/logo.png"
import { registerSchema, type RegisterSchema } from "../../Domain/Validators/registerValidator"
import { authFacade } from "../../Infrastructure/Utility/authFacade"
import { useTheme } from '../../Infrastructure/Contexts/ThemeContext';

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M17 11V8a5 5 0 0 0-10 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 11h10a2 2 0 0 1 2 2v7H5v-7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export function RegisterPage() {
  const { register, handleSubmit, formState } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const temp = sessionStorage.getItem("registerOtpCode")
    if (!temp) navigate("/register/verify")
  }, [navigate])

  const onSubmit = async (data: RegisterSchema) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const otp_code = sessionStorage.getItem("registerOtpCode")
      const email = sessionStorage.getItem("registerEmail")
      if (!otp_code || !email) { navigate("/register/verify"); return; }

      await authFacade.register({
        email, otp_code,
        username: data.username,
        password: data.password,
        confirm_password: data.confirmPassword,
      })
      await authFacade.login({ username: data.username, password: data.password })

      sessionStorage.removeItem("registerOtpCode")
      sessionStorage.removeItem("registerEmail")
      navigate("/posts")
    } catch (e: any) {
      setSubmitError(e?.message ?? "خطا در فرآیند ثبت‌نام یا ورود")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-8">

      <button
        onClick={toggleTheme}
        className="fixed top-6 left-6 z-50 rounded-full p-3 transition-all"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
        title={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
      >
        {theme === "dark" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      <GlassCard className="w-full max-w-[1200px] min-h-[640px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 p-6 sm:p-10 md:p-14">

          <div className="hidden md:flex order-2 flex-col justify-center items-center text-center">
            <img
              src={logo} alt="Sharif Finder"
              className="w-[360px] lg:w-[560px] select-none drop-shadow-[0_18px_50px_rgba(170,80,255,0.35)]"
            />
            <div className="-mt-20 flex flex-col items-center text-center">
              <p className="text-3xl font-extrabold text-white/90">گمشده‌ها تنها نمی‌مانند؛</p>
              <p className="mt-4 text-[22px] font-medium text-white/65">اینجا دوباره پیدا می‌شوند.</p>
            </div>
          </div>

          <div className="order-1 md:order-1 flex flex-col justify-center md:pt-16">

            <div className="flex md:hidden justify-center mb-6">
              <img src={logo} alt="Sharif Finder"
                className="w-[180px] select-none drop-shadow-[0_10px_30px_rgba(170,80,255,0.35)]" />
            </div>

            <h1
              className="mb-8 text-2xl sm:text-4xl font-extrabold text-center md:text-right md:mr-[100px] text-white/90"
            >
              حساب خود را کامل کنید
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              <TextField
                placeholder="نام کاربری"
                endIcon={<UserIcon />}
                {...register("username")}
                error={formState.errors.username?.message}
              />
              <TextField
                type="password"
                placeholder="رمز عبور"
                endIcon={<LockIcon />}
                {...register("password")}
                error={formState.errors.password?.message}
              />
              <TextField
                type="password"
                placeholder="تکرار رمز عبور"
                endIcon={<LockIcon />}
                {...register("confirmPassword")}
                error={formState.errors.confirmPassword?.message}
              />

              {submitError && <p className="text-sm text-red-300">{submitError}</p>}

              <div className="pt-3 flex items-center gap-4">
                <div className="text-sm text-right" style={{ color: "var(--text-secondary)" }}>
                  حساب دارید؟{" "}
                  <button type="button" onClick={() => navigate("/login")}
                    className="underline underline-offset-4 hover:opacity-80"
                    style={{ color: "var(--text-primary)" }}>
                    وارد شوید
                  </button>
                </div>
                <PrimaryButton type="submit" disabled={submitting}
                  className="mr-auto w-[110px] py-4 text-sm bg-white/8 hover:bg-white/12">
                  {submitting ? "..." : "ثبت نام"}
                </PrimaryButton>
              </div>
            </form>
          </div>

        </div>
      </GlassCard>
    </div>
  )
}