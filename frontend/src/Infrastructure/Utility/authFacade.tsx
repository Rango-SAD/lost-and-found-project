import { IAuthFacade } from "../../Domain/Services/Interface/IAuthFacade"
import { LoginForm } from "../../Domain/Types/Auth"
import { loginApi } from "../Interfaces/AuthApi"

export const authFacade: IAuthFacade = {
    login: async (data: LoginForm) => {
        await loginApi(data)
    },
    requestRegisterCode: function (arg0: { email: string }): unknown {
        throw new Error("Function not implemented.")
    }
}