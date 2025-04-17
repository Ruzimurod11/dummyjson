import React, { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, useCartStore } from "@/store/cartStore";
import { AddToCartButtonProps } from "@/routes/products";
import { cn } from "@/lib/utils";

export const AddToCartButton: React.FC<{ product: AddToCartButtonProps }> = ({
   product,
}) => {
   const addToCart = useCartStore((state) => state.addToCart);
   const [added, setAdded] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const toCartItem = (product: AddToCartButtonProps): CartItem => ({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
   });

   const handleAdd = async (e: React.MouseEvent) => {
      e.preventDefault();
      setIsLoading(true);

      // Симулируем задержку (можно убрать если addToCart асинхронный)
      await new Promise((resolve) => setTimeout(resolve, 800));

      addToCart(toCartItem(product));
      setAdded(true);
      setIsLoading(false);

      setTimeout(() => setAdded(false), 1500);
   };

   return (
      <Button
         onClick={handleAdd}
         size="sm"
         disabled={isLoading}
         className={cn(
            "group w-full justify-center gap-2 transition-all duration-300 ease-in-out",
            added
               ? "bg-green-600 hover:bg-green-700 text-white"
               : "bg-red border hover:bg-red-100"
         )}>
         {isLoading ? (
            <>
               <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
               <span>Yuklanmoqda...</span>
            </>
         ) : added ? (
            <>
               <Check className="w-4 h-4 text-white animate-pop-in" />
               <span className="font-semibold">Qo‘shildi</span>
            </>
         ) : (
            <>
               <ShoppingCart className="w-4 h-4 text-gray-600 group-hover:text-black transition-colors" />
               <span className="text-gray-800 font-medium group-hover:text-black">
                  Savatga
               </span>
            </>
         )}
      </Button>
   );
};
