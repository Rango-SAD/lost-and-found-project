import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  endIcon?: React.ReactNode
}

export function TextField({ label, error, endIcon, className = "", ...rest }: Props) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-sm" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      ) : null}

      <div
        className={[
          "flex items-center gap-4 rounded-full px-8 py-7",
          "backdrop-blur-[18px]",
          "transition",
          className,
        ].join(" ")}
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-soft)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)"
        }}
      >
        <input
          {...rest}
          className="w-full bg-transparent outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        {endIcon ? (
          <div style={{ color: "var(--text-muted)" }}>{endIcon}</div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  )
}