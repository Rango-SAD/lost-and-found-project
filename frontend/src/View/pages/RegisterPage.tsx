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

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 11V8a5 5 0 0 0-10 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 11h10a2 2 0 0 1 2 2v7H5v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
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

  useEffect(() => {
    const temp = sessionStorage.getItem("registerOtpCode")
    if (!temp) navigate("/register/verify")
  }, [navigate])


  const onSubmit = async (data: RegisterSchema) => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const otp_code = sessionStorage.getItem("registerOtpCode"); 
      const email = sessionStorage.getItem("registerEmail");

      if (!otp_code || !email) {
        navigate("/register/verify");
        return;
      }

      await authFacade.register({
        email,
        otp_code,
        username: data.username,
        password: data.password,
        confirm_password: data.confirmPassword,
      });

    
      await authFacade.login({
        username: data.username,
        password: data.password
      });

      sessionStorage.removeItem("registerOtpCode");
      sessionStorage.removeItem("registerEmail");

      navigate("/posts"); 
      
    } catch (e: any) {
      setSubmitError(e?.message ?? "خطا در فرآیند ثبت‌نام یا ورود");
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[linear-gradient(45deg,rgba(18,24,43,0.5)_0%,rgba(16,21,39,0.77)_0%,rgba(15,19,36,1)_63%,rgba(14,18,34,0.77)_100%,rgba(11,15,26,0)_100%)]"
    >
      <GlassCard className="w-full max-w-[1200px] min-h-[640px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 p-10 md:p-14">
          <div className="order-1 md:order-2 flex flex-col justify-center items-center text-center">
            <img
              src={logo}
              alt="Sharif Finder"
              className="mt-0 w-[260px] md:w-[360px] lg:w-[560px] select-none drop-shadow-[0_18px_50px_rgba(170,80,255,0.35)]"
            />

            <div className="-mt-20 flex flex-col items-center text-center">
              <p className="text-3xl font-extrabold text-white/90">گمشده‌ها تنها نمی‌مانند؛</p>
              <p className="mt-4 text-[22px] font-medium text-white/65">اینجا دوباره پیدا می‌شوند.</p>
            </div>
          </div>

          <div className="order-2 md:order-1 flex flex-col justify-center mt-16">
            <h1 className="mb-10 mr-[100px] text-4xl font-extrabold text-white/90">
              حساب خود را کامل کنید
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}

              <div className="pt-4 flex items-center gap-6">
                <div className="text-sm text-white/55 text-right">
                  حساب کاربری دارید؟{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-white/80 underline underline-offset-4 decoration-white/40 hover:decoration-white/70 hover:text-white"
                  >
                    وارد شوید
                  </button>
                </div>

                <PrimaryButton
                  type="submit"
                  disabled={submitting}
                  className="mr-auto w-[110px] py-4 text-sm bg-white/8 hover:bg-white/12"
                >
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
