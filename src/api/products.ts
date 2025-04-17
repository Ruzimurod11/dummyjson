// src/api/products.ts
import axios from "axios";
import { Product } from "@/routes/products";

const BASE_URL = "https://dummyjson.com/products";

export async function fetchProducts() {
   try {
      const { data } = await axios.get(BASE_URL);
      return data;
   } catch {
      throw new Error("Failed to fetch products");
   }
}

export async function createProduct(product: {
   title: string;
   price: number;
   description: string;
}) {
   try {
      const { data } = await axios.post(`${BASE_URL}/add`, product, {
         headers: { "Content-Type": "application/json" },
      });
      return data;
   } catch {
      throw new Error("Failed to create product");
   }
}

export async function updateProduct(product: Product) {
   try {
      const { data } = await axios.put(
         `${BASE_URL}/${product.id}`,
         {
            title: product.title,
            price: product.price,
            description: product.description,
         },
         {
            headers: { "Content-Type": "application/json" },
         }
      );
      return data;
   } catch {
      throw new Error("Failed to update product");
   }
}

export async function deleteProduct(id: number) {
   try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
   } catch {
      throw new Error("Failed to delete product");
   }
}
