import { LoginForm } from "../../Types/Auth"

export interface IAuthFacade {
  login(data: LoginForm): Promise<void>
}