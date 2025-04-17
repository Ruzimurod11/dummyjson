import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { isAuthenticated } from "./login";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/cart")({
   beforeLoad: () => {
      if (!isAuthenticated()) {
         throw redirect({ to: "/login" });
      }
   },
   component: CartPage,
});

function CartPage() {
   const { items, removeFromCart, clearCart, addToCart } = useCartStore();

   const [loadingId, setLoadingId] = useState<number | null>(null);
   const [clearing, setClearing] = useState(false);

   const decreaseQuantity = async (productId: number) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;

      setLoadingId(productId);
      await new Promise((r) => setTimeout(r, 500)); // Симуляция задержки

      if (item.quantity === 1) {
         removeFromCart(productId);
      } else {
         useCartStore.setState((state) => ({
            items: state.items.map((i) =>
               i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
            ),
         }));
      }

      setLoadingId(null);
   };

   const increaseQuantity = async (productId: number) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;

      setLoadingId(productId);
      await new Promise((r) => setTimeout(r, 500));
      addToCart(item);
      setLoadingId(null);
   };

   const handleRemove = async (productId: number) => {
      setLoadingId(productId);
      await new Promise((r) => setTimeout(r, 500));
      removeFromCart(productId);
      toast.success("Removed from cart", { duration: 900 });
      setLoadingId(null);
   };

   const handleClear = async () => {
      setClearing(true);
      await new Promise((r) => setTimeout(r, 600));
      clearCart();
      toast.success("Cart cleared", { duration: 900 });
      setClearing(false);
   };

   const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
   );

   return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
         <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

            {items.length === 0 ? (
               <p className="text-gray-500">Your cart is empty.</p>
            ) : (
               <>
                  <ul className="space-y-6">
                     {items.map((item) => (
                        <li
                           key={item.id}
                           className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                           <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                              <img
                                 src={item.thumbnail}
                                 alt={item.title}
                                 className="w-full max-w-[100px] h-auto object-cover rounded self-center md:self-auto"
                              />
                              <div className="text-center md:text-left">
                                 <h2 className="text-lg font-semibold">
                                    {item.title}
                                 </h2>
                                 <p className="text-gray-600">
                                    ${item.price} x {item.quantity}
                                 </p>
                                 <p className="text-gray-800 font-medium">
                                    Total: ${item.price * item.quantity}
                                 </p>
                              </div>
                           </div>

                           <div className="flex justify-center md:justify-end items-center gap-2">
                              <button
                                 onClick={() => decreaseQuantity(item.id)}
                                 disabled={
                                    item.quantity === 1 || loadingId === item.id
                                 }
                                 className={`px-3 py-1 rounded flex items-center justify-center min-w-[30px] ${
                                    item.quantity === 1 || loadingId === item.id
                                       ? "bg-gray-300 cursor-not-allowed"
                                       : "bg-gray-200 hover:bg-gray-300"
                                 }`}>
                                 {loadingId === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                 ) : (
                                    "-"
                                 )}
                              </button>

                              <span className="px-2">{item.quantity}</span>

                              <button
                                 onClick={() => increaseQuantity(item.id)}
                                 disabled={loadingId === item.id}
                                 className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center min-w-[30px]">
                                 {loadingId === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                 ) : (
                                    "+"
                                 )}
                              </button>

                              <button
                                 onClick={() => handleRemove(item.id)}
                                 disabled={loadingId === item.id}
                                 className="ml-2 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded min-w-[80px] text-sm">
                                 {loadingId === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                 ) : (
                                    "Remove"
                                 )}
                              </button>
                           </div>
                        </li>
                     ))}
                  </ul>

                  <div className="mt-6 text-right">
                     <p className="text-xl font-bold text-gray-800 flex flex-col ">
                        Total: ${totalPrice.toFixed(2)}
                     </p>
                     <button
                        onClick={handleClear}
                        disabled={clearing}
                        className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-end justify-center min-w-[120px]">
                        {clearing ? (
                           <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Tozalanyapti...
                           </>
                        ) : (
                           "Clear Cart"
                        )}
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
