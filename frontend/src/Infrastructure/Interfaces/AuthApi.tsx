import { LoginForm } from "../../Domain/Types/Auth";

const BASE_URL = "http://127.0.0.1:8000";

export const loginApi = async (data: LoginForm): Promise<void> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: data.username,
      password: data.password
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "نام کاربری یا رمز عبور اشتباه است.");
  }

  const result = await response.json();
  localStorage.setItem("accessToken", result.access_token);
  localStorage.setItem("username", data.username);
};


export const requestRegisterCodeApi = async (arg: { email: string }) => {
  const response = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: arg.email })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "خطا در ارسال کد تایید");
  }
  return { ok: true as const };
};

export const verifyRegisterCodeApi = async (arg: { email: string; code: string }) => {
  return { ok: true as const, tempToken: "verified_locally" };
};


export const registerApi = async (arg: { 
  username: string; 
  password: string; 
  confirm_password: string;
  email: string; 
  otp_code: string 
}) => {
  const response = await fetch(`${BASE_URL}/auth/register/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: arg.email,
      username: arg.username,
      password: arg.password,
      confirm_password: arg.confirm_password,
      otp_code: arg.otp_code
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "خطا در ثبت‌نام نهایی");
  }

  return { ok: true as const };
};