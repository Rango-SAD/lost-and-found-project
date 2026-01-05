import { LoginForm } from "../../Domain/Types/Auth"

export const loginApi = async (_: LoginForm): Promise<void> => {
  await new Promise((res) => setTimeout(res, 800))
}