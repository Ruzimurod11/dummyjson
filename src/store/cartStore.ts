import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
   id: number;
   title: string;
   price: number;
   thumbnail: string;
   quantity: number;
};

type CartStore = {
   items: CartItem[];
   addToCart: (item: Omit<CartItem, "quantity">) => void;
   removeFromCart: (id: number) => void;
   clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
   persist(
      (set, get) => ({
         items: [],
         addToCart: (item) => {
            const existing = get().items.find((i) => i.id === item.id);
            if (existing) {
               set({
                  items: get().items.map((i) =>
                     i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                  ),
               });
            } else {
               set({
                  items: [...get().items, { ...item, quantity: 1 }],
               });
            }
         },
         removeFromCart: (id) =>
            set({
               items: get().items.filter((item) => item.id !== id),
            }),
         clearCart: () => set({ items: [] }),
      }),
      {
         name: "cart-storage",
         storage: createJSONStorage(() => localStorage),
      }
   )
);
