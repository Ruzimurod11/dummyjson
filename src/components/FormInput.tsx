import { Input } from "@/components/ui/input";
import { FieldError, Path, UseFormRegister } from "react-hook-form";

interface FormInputProps<T extends Record<string, any>> {
   name: Path<T>;
   placeholder?: string;
   type?: string;
   register: UseFormRegister<T>;
   error?: FieldError;
}

export const FormInput = <T extends Record<string, any>>({
   name,
   placeholder,
   type = "text",
   register,
   error,
}: FormInputProps<T>) => {
   return (
      <div>
         <Input type={type} placeholder={placeholder} {...register(name)} />
         {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
   );
};
