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

function MailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 8l6 5 6-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 4v6c0 5-3.5 8.8-8 10-4.5-1.2-8-5-8-10V7l8-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.2l2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type CodeForm = {
  code: string
}

export function RequestCodePage() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const { register, handleSubmit, formState } = useForm<RequestCodeSchema>({
    resolver: zodResolver(requestCodeSchema),
  })

  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: formStateCode,
    reset: resetCode,
  } = useForm<CodeForm>({
    defaultValues: { code: "" },
  })

  const { requestCode, loading, error } = useRequestCodeVM()

  const onSubmitEmail = async (data: RequestCodeSchema) => {
    const res = await requestCode({ email: data.email })
    if (res.ok) {
      resetCode({ code: "" })
      setModalOpen(true)
    }
  }

  const onSubmitCode = async (data: CodeForm) => {
    if (!data.code || data.code.trim().length < 4) return
    setModalOpen(false)
  }

  return (
    <>
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
              <div className="-mt-16 flex flex-col items-center text-center">
                <p className="text-3xl font-extrabold text-white/90">گمشده‌ها تنها نمی‌مانند؛</p>
                <p className="mt-4 text-[24px] font-medium text-white/65">اینجا دوباره پیدا می‌شوند.</p>
              </div>
            </div>

            <div className="order-2 md:order-1 flex flex-col justify-center mt-24">
              <h1 className="mb-10 mr-[180px] text-5xl font-extrabold text-white/90 text-right">
                ثبت نام کنید
              </h1>

              <form onSubmit={handleSubmit(onSubmitEmail)} className="mt-4 space-y-7">
                <TextField
                  placeholder="ایمیل"
                  endIcon={<MailIcon />}
                  {...register("email")}
                  error={formState.errors.email?.message}
                />

                {error ? <p className="text-sm text-red-300">{error}</p> : null}

                <div className="pt-2 flex items-center justify-between gap-6">
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
                    disabled={loading}
                    className="w-[150px] py-4 text-sm bg-white/8 hover:bg-white/12"
                  >
                    {loading ? "..." : "دریافت کد"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </GlassCard>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div dir="rtl" className="relative p-10 md:p-12">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="absolute top-6 left-6 text-white/45 hover:text-white text-2xl leading-none"
          >
            ×
          </button>

          <div className="flex items-center justify-center gap-3">
            <div className="text-white/35">
            </div>
            <div className="text-white/90 text-3xl font-extrabold text-center">
              کد ارسال شده
            </div>
          </div>

          <form onSubmit={handleSubmitCode(onSubmitCode)} className="mt-10 space-y-7">
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
              <PrimaryButton
                type="submit"
                className="w-[140px] py-4 text-sm bg-white/8 hover:bg-white/12"
              >
                تایید
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}