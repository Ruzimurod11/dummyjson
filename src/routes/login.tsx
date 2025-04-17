import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import {
   AuthResponse,
   loginUser,
   RegisterPayload,
   registerUser,
} from "@/api/auth";
import { FormInput } from "@/components/FormInput";

export const Route = createFileRoute("/login")({
   component: LoginPage,
});

export const isAuthenticated = () => {
   return !!localStorage.getItem("authToken");
};

const loginSchema = z.object({
   username: z.string().min(1, "Foydalanuvchi nomi kerak"),
   password: z.string().min(1, "Parol kerak"),
});

const registerSchema = loginSchema.extend({
   email: z.string().email("Email noto‘g‘ri"),
   firstName: z.string().min(1, "Ism kerak"),
   lastName: z.string().min(1, "Familiya kerak"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type FormData = LoginFormData & Partial<RegisterFormData>;

function LoginPage() {
   const [error, setError] = useState<string | null>(null);
   const [isRegistering, setIsRegistering] = useState(false);
   const navigate = useNavigate();
   const { login } = useAuthStore();

   const defaultLogin = {
      username: "emilys",
      password: "emilyspass",
   };

   const defaultRegister = {
      ...defaultLogin,
      email: "emily@example.com",
      firstName: "Emily",
      lastName: "Smith",
   };

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<FormData>({
      resolver: zodResolver(isRegistering ? registerSchema : loginSchema),
      defaultValues: isRegistering ? defaultRegister : defaultLogin,
   });

   const onSubmit = async (data: FormData) => {
      try {
         if (isRegistering) {
            await registerUser(data as RegisterPayload);
            setIsRegistering(false);
            setError(null);
         } else {
            const result: AuthResponse = await loginUser({
               username: data.username,
               password: data.password,
            });
            login(result);
            navigate({ to: "/" });
         }
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err.message);
         } else {
            setError("Noto'g'ri ma'lumotlar");
         }
      }
   };

   return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
         <Card className="w-full max-w-md p-6">
            <CardHeader>
               <CardTitle className="text-center text-2xl">
                  {isRegistering ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {error && <p className="text-red-500">{error}</p>}

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {isRegistering && (
                     <>
                        <FormInput<FormData>
                           name="firstName"
                           placeholder="Ism"
                           register={register}
                           error={errors.firstName}
                        />
                        <FormInput<FormData>
                           name="lastName"
                           placeholder="Familiya"
                           register={register}
                           error={errors.lastName}
                        />
                        <FormInput<FormData>
                           name="email"
                           placeholder="Email"
                           type="email"
                           register={register}
                           error={errors.email}
                        />
                     </>
                  )}

                  <FormInput<FormData>
                     name="username"
                     placeholder="Foydalanuvchi nomi"
                     register={register}
                     error={errors.username}
                  />
                  <FormInput<FormData>
                     name="password"
                     placeholder="Parol"
                     type="password"
                     register={register}
                     error={errors.password}
                  />

                  <Button
                     type="submit"
                     className="w-full"
                     disabled={isSubmitting}>
                     {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                           <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24">
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              />
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                              />
                           </svg>
                           {isRegistering ? "Yuklanmoqda..." : "Kirish..."}
                        </div>
                     ) : isRegistering ? (
                        "Ro'yxatdan o'tish"
                     ) : (
                        "Kirish"
                     )}
                  </Button>
               </form>

               <p className="text-center text-sm text-gray-600">
                  {isRegistering ? (
                     <>
                        Akkountingiz bormi?{" "}
                        <button
                           disabled={isSubmitting}
                           className="text-blue-600 underline disabled:opacity-50"
                           onClick={() => setIsRegistering(false)}>
                           Kirish
                        </button>
                     </>
                  ) : (
                     <>
                        Akkountingiz yo'qmi?{" "}
                        <button
                           disabled={isSubmitting}
                           className="text-blue-600 underline disabled:opacity-50"
                           onClick={() => setIsRegistering(true)}>
                           Ro'yxatdan o'tish
                        </button>
                     </>
                  )}
               </p>
            </CardContent>
         </Card>
      </div>
   );
}

export default LoginPage;
