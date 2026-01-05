import { IAuthFacade } from "../../Domain/Services/Interface/IAuthFacade";
import { LoginForm } from "../../Domain/Types/Auth";
import { loginApi, requestRegisterCodeApi, verifyRegisterCodeApi, registerApi } from "../Interfaces/AuthApi";

export const authFacade: IAuthFacade = {
  login: async (data: LoginForm) => {
    await loginApi(data);
  },

  requestRegisterCode: async (arg: { email: string }) => {
    return await requestRegisterCodeApi(arg);
  },

  verifyRegisterCode: async (arg: { email: string; code: string }) => {
    return await verifyRegisterCodeApi(arg);
  },

  register: async (arg: { tempToken: string; username: string; password: string }) => {
    return await registerApi(arg);
  },
};