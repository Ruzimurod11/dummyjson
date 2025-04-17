import { Product } from "@/routes/products/index";

const BASE_URL = "https://dummyjson.com/products";

export const getProductById = async (id: string): Promise<Product> => {
   const res = await fetch(`${BASE_URL}/${id}`);
   if (!res.ok) throw new Error("Product not found");
   return res.json();
};

export const updateProduct = async (
   id: string,
   data: Partial<Product>
): Promise<Product> => {
   const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });
   if (!res.ok) throw new Error("Failed to update product");
   return res.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
   const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
   if (!res.ok) throw new Error("Failed to delete product");
};
