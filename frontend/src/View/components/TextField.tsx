import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  endIcon?: React.ReactNode
}

export function TextField({ label, error, endIcon, className = "", ...rest }: Props) {
  return (
    <div className="space-y-2">
      {label ? <label className="block text-sm text-white/70">{label}</label> : null}

      <div
        className={[
          "flex items-center gap-4 rounded-full px-8 py-7",
          "bg-[rgba(10,14,24,0.35)]",
          "border border-white/10",
          "backdrop-blur-[18px]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          "transition",
          "focus-within:border-white/20 focus-within:bg-[rgba(10,14,24,0.45)]",
          className,
        ].join(" ")}
      >
        <input
          {...rest}
          className="w-full bg-transparent text-white/90 placeholder:text-white/35 outline-none"
        />
        {endIcon ? <div className="text-white/40">{endIcon}</div> : null}
      </div>

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  )
}