import { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ className = "", disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        "rounded-full px-6 py-3 text-sm font-semibold text-white",
        "bg-white/10 hover:bg-white/14 border border-white/10",
        "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    />
  )
}