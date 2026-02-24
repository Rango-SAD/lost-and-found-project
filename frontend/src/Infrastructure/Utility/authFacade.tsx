import { IAuthFacade } from "../../Domain/Services/Interface/IAuthFacade";
import { LoginForm } from "../../Domain/Types/Auth";
import { loginApi, requestRegisterCodeApi, verifyRegisterCodeApi, registerApi } from "../Interfaces/AuthApi";

const API_URL = 'http://127.0.0.1:8000'

export const authFacade = {
  login: async (data: LoginForm) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error("Login failed");
    
    const result = await response.json();
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("username", result.username);
    return result;
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