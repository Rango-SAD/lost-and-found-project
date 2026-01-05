import { LoginForm } from "../../Domain/Types/Auth"

type MockUser = { username: string; password: string }

const MOCK_USERS: MockUser[] = [
  { username: "testuser", password: "123456" },
  { username: "admin", password: "admin123" },
]

export const loginApi = async (data: LoginForm): Promise<void> => {
  await new Promise((res) => setTimeout(res, 800))

  const u = data.username.trim().toLowerCase()
  const p = data.password

  const ok = MOCK_USERS.some(
    (x) => x.username.toLowerCase() === u && x.password === p
  )

  if (!ok) {
    throw new Error("نام کاربری یا رمز عبور اشتباه است.")
  }

  localStorage.setItem("accessToken", "mock-token")
  localStorage.setItem("username", data.username)
}