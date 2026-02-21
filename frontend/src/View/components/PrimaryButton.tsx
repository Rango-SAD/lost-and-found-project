import { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ className = "", disabled, style, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        "rounded-full px-6 py-3 text-sm font-semibold",
        "disabled:opacity-50 disabled:cursor-not-allowed transition-all",
        className,
      ].join(" ")}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-soft)",
        color: "var(--text-primary)",
        boxShadow: "0 10px 30px var(--overlay)",
        ...style
      }}
    />
  )
}