import { useState } from "react";
import { authFacade } from "../../Infrastructure/Utility/authFacade";

export function useRequestCodeVM() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCode = async (arg: { email: string }) => {
    setLoading(true);
    setError(null);
    try {
      await authFacade.requestRegisterCode(arg);
      return { ok: true as const };
    } catch (e: any) {
      setError(e?.message ?? "خطا در ارسال کد");
      return { ok: false as const };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (arg: { email: string; code: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await authFacade.verifyRegisterCode(arg);
      return { ok: true as const, tempToken: res.tempToken as string };
    } catch (e: any) {
      setError(e?.message ?? "خطا در تایید کد");
      return { ok: false as const, tempToken: null as string | null };
    } finally {
      setLoading(false);
    }
  };

  return { requestCode, verifyCode, loading, error };
}