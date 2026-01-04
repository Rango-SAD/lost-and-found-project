import { IAuthFacade } from "../../Domain/Services/Interface/IAuthFacade"
import { LoginForm } from "../../Domain/Types/Auth"
import { loginApi } from "../Interfaces/AuthApi"

export const authFacade: IAuthFacade = {
  login: async (data: LoginForm) => {
    await loginApi(data)
  },
}