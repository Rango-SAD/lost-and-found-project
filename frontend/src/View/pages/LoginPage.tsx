import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchema } from "../../Domain/Validators/loginValidator"
import { useLoginVM } from "../handlers/useLoginVM"
import { GlassCard } from "../components/GlassCard"
import { TextField } from "../components/TextField"
import { PrimaryButton } from "../components/PrimaryButton"
import logo from "../assets/logo.png"

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

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const { login, loading, error } = useLoginVM()
  const navigate = useNavigate()

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
              <p className="text-3xl font-extrabold text-white/90">
                گمشده‌ها تنها نمی‌مانند؛
              </p>
              <p className="mt-4 text-[22px] font-medium text-white/65">
                اینجا دوباره پیدا می‌شوند.
              </p>
            </div>
          </div>

          <div className="order-2 md:order-1 flex flex-col justify-center mt-28">
            <h1 className="mb-10 mr-[200px] text-4xl font-extrabold text-white/90">
              وارد شوید
            </h1>

            <form onSubmit={handleSubmit(login)} className="mt-[28px] space-y-6">
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

              {error ? <p className="text-sm text-red-300">{error}</p> : null}

              <div className="pt-4 flex items-center justify-between gap-6">
                <div className="text-sm text-white/55 text-right">
                  حساب کاربری ندارید؟{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register/code")}
                    className="text-white/80 underline underline-offset-4 decoration-white/40 hover:decoration-white/70 hover:text-white"
                  >
                    ثبت نام کنید
                  </button>
                </div>

                <PrimaryButton
                  type="submit"
                  disabled={loading}
                  className="w-[110px] py-4 text-sm bg-white/8 hover:bg-white/12"
                >
                  {loading ? "..." : "ورود"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}