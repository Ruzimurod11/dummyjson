// Универсальный API-клиент с базовой обработкой ошибок

const BASE_URL = "https://dummyjson.com";

export const apiClient = async <T>(
   endpoint: string,
   options: RequestInit = {}
): Promise<T> => {
   const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
         "Content-Type": "application/json",
         ...options.headers,
      },
      ...options,
   });

   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
         errorData.message || "Serverdan noma'lum xatolik yuz berdi"
      );
   }

   return response.json();
};
