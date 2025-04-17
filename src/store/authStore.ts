import { create } from "zustand";
import { AuthResponse } from "@/api/auth";

interface AuthState {
   user: AuthResponse | null;
   isAuthenticated: boolean;
   login: (data: AuthResponse) => void;
   logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
   // LocalStorage dan boshlang‘ich qiymatlarni o‘qish
   const token = localStorage.getItem("authToken");
   const userString = localStorage.getItem("user");
   const user = userString ? (JSON.parse(userString) as AuthResponse) : null;

   return {
      user,
      isAuthenticated: !!token,

      login: (data) => {
         localStorage.setItem("authToken", data.token);
         localStorage.setItem("user", JSON.stringify(data));
         set({ user: data, isAuthenticated: true });
      },

      logout: () => {
         localStorage.removeItem("authToken");
         localStorage.removeItem("user");
         localStorage.removeItem("cart-storage");
         set({ user: null, isAuthenticated: false });
      },
   };
});
