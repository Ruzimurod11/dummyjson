// src/api/auth.ts

// --- Tiplar ---
export interface LoginPayload {
   username: string;
   password: string;
}

export interface RegisterPayload extends LoginPayload {
   email: string;
   firstName: string;
   lastName: string;
}

export interface AuthResponse {
   id: number;
   username: string;
   email: string;
   firstName: string;
   lastName: string;
   gender: string;
   image: string;
   token: string;
}

// --- API bazasi URL ---
const API_BASE = "https://dummyjson.com";

// 🔐 Login qilish
export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
   const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });

   if (!res.ok) {
      throw new Error("Login yoki parol noto‘g‘ri");
   }

   const result: AuthResponse = await res.json();
   return result;
}

// 🧾 Ro'yxatdan o'tkazish
export async function registerUser(
   data: RegisterPayload
): Promise<AuthResponse> {
   const res = await fetch(`${API_BASE}/users/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });

   if (!res.ok) {
      throw new Error("Ro‘yxatdan o‘tishda xatolik yuz berdi");
   }

   const result: AuthResponse = await res.json();
   return result;
}
