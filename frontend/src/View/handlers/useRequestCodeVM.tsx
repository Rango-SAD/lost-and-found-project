import { useState } from "react"

export function useRequestCodeVM() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestCode = async (_payload: { email: string }) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 450))
      return { ok: true as const }
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در دریافت کد")
      return { ok: false as const }
    } finally {
      setLoading(false)
    }
  }

  return { requestCode, loading, error }
}