import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { requestCodeSchema, RequestCodeSchema } from "../../Domain/Validators/requestCodeValidator"
import { useRequestCodeVM } from "../handlers/useRequestCodeVM"

import { GlassCard } from "../components/GlassCard"
import { TextField } from "../components/TextField"
import { PrimaryButton } from "../components/PrimaryButton"
import { Modal } from "../components/Modal"

import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../Infrastructure/Contexts/ThemeContext"

function MailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 8l6 5 6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 4v6c0 5-3.5 8.8-8 10-4.5-1.2-8-5-8-10V7l8-4Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 12.2l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type CodeForm = { code: string }

export function RequestCodePage() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState("")
  const { theme, toggleTheme } = useTheme()

  const { register, handleSubmit, formState } = useForm<RequestCodeSchema>({
    resolver: zodResolver(requestCodeSchema),
  })
  const { register: registerCode, handleSubmit: handleSubmitCode, formState: formStateCode, reset: resetCode } =
    useForm<CodeForm>({ defaultValues: { code: "" } })

  const { requestCode, loading, error } = useRequestCodeVM()

  const onSubmitEmail = async (data: RequestCodeSchema) => {
    const res = await requestCode({ email: data.email })
    if (res.ok) {
      setEmailForOtp(data.email)
      resetCode({ code: "" })
      setModalOpen(true)
    }
  }

  const onSubmitCode = async (data: CodeForm) => {
    const code = data.code?.trim()
    sessionStorage.setItem("registerOtpCode", code)
    sessionStorage.setItem("registerEmail", emailForOtp)
    setModalOpen(false)
    navigate("/register/complete")
  }

  return (
    <>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 p-6 sm:p-10 md:p-14 md:items-center">

            <div className="hidden md:flex order-2 flex-col justify-center items-center text-center">
              <img src={logo} alt="Sharif Finder"
                className="w-[360px] lg:w-[560px] select-none drop-shadow-[0_18px_50px_rgba(170,80,255,0.35)]" />
              <div className="-mt-8 flex flex-col items-center text-center">
                <p className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                  گم‌شده‌ها تنها نمی‌مانند؛
                </p>
                <p className="mt-4 text-[24px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  اینجا دوباره پیدا می‌شوند.
                </p>
              </div>
            </div>

            <div className="order-1 md:order-1 flex flex-col justify-center md:mt-24">

              <div className="flex md:hidden justify-center mb-6">
                <img src={logo} alt="Sharif Finder"
                  className="w-[180px] select-none drop-shadow-[0_10px_30px_rgba(170,80,255,0.35)]" />
              </div>

              <h1
                className="mb-8 text-2xl sm:text-5xl font-extrabold text-center md:text-right md:mr-[180px]"
                style={{ color: "var(--text-primary)" }}
              >
                ثبت نام کنید
              </h1>

              <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-6 sm:space-y-7">
                <TextField
                  placeholder="ایمیل"
                  endIcon={<MailIcon />}
                  {...register("email")}
                  error={formState.errors.email?.message}
                />

                {error && <p className="text-sm text-red-300">{error}</p>}

                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="text-sm text-right" style={{ color: "var(--text-secondary)" }}>
                    حساب دارید؟{" "}
                    <button type="button" onClick={() => navigate("/login")}
                      className="underline underline-offset-4 hover:opacity-80"
                      style={{ color: "var(--text-primary)" }}>
                      وارد شوید
                    </button>
                  </div>
                  <PrimaryButton type="submit" disabled={loading}
                    className="w-[140px] py-4 text-sm bg-white/8 hover:bg-white/12">
                    {loading ? "..." : "دریافت کد"}
                  </PrimaryButton>
                </div>
              </form>
            </div>

          </div>
        </GlassCard>
      </div>

      {/* ── مودال OTP ── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div dir="rtl" className="relative p-8 sm:p-10 md:p-12">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="absolute top-5 left-5 text-2xl leading-none hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            ×
          </button>

          <div className="text-2xl sm:text-3xl font-extrabold text-center mb-8" style={{ color: "var(--text-primary)" }}>
            کد ارسال شده
          </div>

          <form onSubmit={handleSubmitCode(onSubmitCode)} className="space-y-7">
            <TextField
              placeholder="کد تایید"
              endIcon={<ShieldCheckIcon />}
              inputMode="numeric"
              autoComplete="one-time-code"
              {...registerCode("code", {
                required: "کد را وارد کنید",
                pattern: { value: /^[0-9]+$/, message: "فقط عدد وارد کنید" },
              })}
              error={formStateCode.errors.code?.message}
            />
            <div className="flex items-center justify-start">
              <PrimaryButton type="submit" disabled={loading}
                className="w-[140px] py-4 text-sm bg-white/8 hover:bg-white/12">
                {loading ? "..." : "تایید"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}