import { type ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[56px]",
        "border border-white/10",
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03),rgba(255,255,255,0.02))]",
        "backdrop-blur-[28px]",
        "shadow-[0_50px_140px_rgba(0,0,0,0.65)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[56px] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.10)]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      {children}
    </div>
  )
}