import { useState } from "react"
import { LoginForm } from "../../Domain/Types/Auth"
import { authFacade } from "../../Infrastructure/Utility/authFacade"

export const useLoginVM = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: LoginForm) => {
    try {
      setLoading(true)
      setError(null)
      await authFacade.login(data)
    } catch {
      setError("خطا در ورود")
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}