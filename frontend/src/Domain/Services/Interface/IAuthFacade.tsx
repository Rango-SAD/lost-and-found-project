import { LoginForm } from "../../Types/Auth"

export interface IAuthFacade {
  requestRegisterCode(arg0: { email: string }): unknown
  login(data: LoginForm): Promise<void>
}