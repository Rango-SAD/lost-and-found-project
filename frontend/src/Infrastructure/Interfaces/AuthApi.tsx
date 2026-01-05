import { LoginForm } from "../../Domain/Types/Auth";

type MockUser = { id: string; email: string; username: string; password: string };

const USERS_KEY = "mock.users.v1";
const OTP_KEY = "mock.otp.v1";
const TEMP_KEY = "mock.temp.v1";

const OTP_TTL_MS = 2 * 60 * 1000;    // 2 min
const TEMP_TTL_MS = 5 * 60 * 1000;   // 5 min
const OTP_MIN_RESEND_MS = 20 * 1000; // 20 sec

function sleep(ms = 700) {
  return new Promise((r) => setTimeout(r, ms));
}
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateUsername(username: string) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
function validatePassword(password: string) {
  return password.length >= 6;
}
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

function getUsers(): MockUser[] {
  return load<MockUser[]>(USERS_KEY, []);
}
function setUsers(users: MockUser[]) {
  save(USERS_KEY, users);
}

// -------------------- LOGIN (همان ماک قبلی) --------------------
export const loginApi = async (data: LoginForm): Promise<void> => {
  await sleep(800);

  const users = getUsers();
  const u = data.username.trim().toLowerCase();
  const p = data.password;

  const ok = users.some(
    (x) => x.username.toLowerCase() === u && x.password === p
  );

  if (!ok) throw new Error("نام کاربری یا رمز عبور اشتباه است.");

  localStorage.setItem("accessToken", "mock-token");
  localStorage.setItem("username", data.username);
};

// -------------------- REGISTER STEP 1: REQUEST OTP --------------------
export const requestRegisterCodeApi = async (arg: { email: string }) => {
  await sleep(700);

  const email = arg.email.trim().toLowerCase();
  if (!validateEmail(email)) throw new Error("ایمیل معتبر نیست.");

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("این ایمیل قبلاً ثبت‌نام کرده است.");
  }

  const otpMap = load<Record<string, { otp: string; expiresAt: number; lastSentAt: number; attempts: number }>>(
    OTP_KEY,
    {}
  );

  const now = Date.now();
  const existing = otpMap[email];
  if (existing && now - existing.lastSentAt < OTP_MIN_RESEND_MS) {
    throw new Error("لطفاً کمی صبر کنید و دوباره تلاش کنید.");
  }

  const otp = generateOtp();
  otpMap[email] = { otp, expiresAt: now + OTP_TTL_MS, lastSentAt: now, attempts: 0 };
  save(OTP_KEY, otpMap);

  console.info(`[MOCK OTP] email=${email} otp=${otp}`);
  return { ok: true as const };
};

// -------------------- REGISTER STEP 2: VERIFY OTP => tempToken --------------------
export const verifyRegisterCodeApi = async (arg: { email: string; code: string }) => {
  await sleep(700);

  const email = arg.email.trim().toLowerCase();
  const code = arg.code.trim();

  const otpMap = load<Record<string, { otp: string; expiresAt: number; lastSentAt: number; attempts: number }>>(
    OTP_KEY,
    {}
  );

  const rec = otpMap[email];
  if (!rec) throw new Error("ابتدا کد را دریافت کنید.");

  const now = Date.now();
  if (now > rec.expiresAt) {
    delete otpMap[email];
    save(OTP_KEY, otpMap);
    throw new Error("کد منقضی شده است.");
  }

  rec.attempts += 1;
  if (rec.attempts > 5) {
    delete otpMap[email];
    save(OTP_KEY, otpMap);
    throw new Error("تعداد تلاش زیاد است. دوباره کد بگیرید.");
  }

  if (rec.otp !== code) {
    otpMap[email] = rec;
    save(OTP_KEY, otpMap);
    throw new Error("کد وارد شده صحیح نیست.");
  }

  // success
  delete otpMap[email];
  save(OTP_KEY, otpMap);

  const tempToken = `tmp_${uuid()}`;
  const tempMap = load<Record<string, { email: string; expiresAt: number }>>(TEMP_KEY, {});
  tempMap[tempToken] = { email, expiresAt: now + TEMP_TTL_MS };
  save(TEMP_KEY, tempMap);

  return { ok: true as const, tempToken };
};

// -------------------- REGISTER STEP 3: FINISH REGISTER --------------------
export const registerApi = async (arg: { tempToken: string; username: string; password: string }) => {
  await sleep(900);

  const username = arg.username.trim();
  const password = arg.password;

  if (!validateUsername(username)) throw new Error("نام کاربری معتبر نیست.");
  if (!validatePassword(password)) throw new Error("رمز عبور حداقل ۶ کاراکتر باشد.");

  const tempMap = load<Record<string, { email: string; expiresAt: number }>>(TEMP_KEY, {});
  const rec = tempMap[arg.tempToken];
  if (!rec) throw new Error("ثبت‌نام را دوباره شروع کنید.");

  const now = Date.now();
  if (now > rec.expiresAt) {
    delete tempMap[arg.tempToken];
    save(TEMP_KEY, tempMap);
    throw new Error("زمان ثبت‌نام تمام شد. دوباره شروع کنید.");
  }

  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error("این نام کاربری قبلاً استفاده شده است.");
  }
  if (users.some((u) => u.email === rec.email)) {
    throw new Error("این ایمیل قبلاً ثبت‌نام کرده است.");
  }

  const newUser: MockUser = { id: uuid(), email: rec.email, username, password };
  setUsers([...users, newUser]);

  delete tempMap[arg.tempToken];
  save(TEMP_KEY, tempMap);

  // mock session
  localStorage.setItem("accessToken", "mock-token");
  localStorage.setItem("username", username);

  return { ok: true as const };
};