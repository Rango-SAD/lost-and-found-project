import { ReactNode, useEffect } from "react"

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, onClose, children }: Props) {
  // ESC closes
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  // lock scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop: blur + dark tint */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-black/35 backdrop-blur-[10px]"
      />

      {/* Modal content */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className="
            relative w-full max-w-[560px]
            rounded-[44px] border border-white/12
            bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04),rgba(255,255,255,0.02))]
            backdrop-blur-[28px]
            shadow-[0_40px_120px_rgba(0,0,0,0.65)]
            overflow-hidden
          "
        >
          <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.12)]" />
          {children}
        </div>
      </div>
    </div>
  )
}