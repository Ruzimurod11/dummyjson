import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "@tanstack/react-router";
import { AddToCartButton } from "./AddToCartButton";

type Product = {
   id: number;
   title: string;
   price: number;
   thumbnail: string;
};

type ProductPage = {
   products: Product[];
   total: number;
   skip: number;
   limit: number;
};

export const ProductGallery: React.FC = () => {
   const [category, setCategory] = useState<string>("all");
   const LIMIT = 6;

   const {
      data,
      isError,
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      isLoading,
      refetch,
   } = useInfiniteQuery<ProductPage, Error>({
      queryKey: ["products", category],
      queryFn: async ({ pageParam = 0 }) => {
         const url =
            category === "all"
               ? `https://dummyjson.com/products?limit=${LIMIT}&skip=${pageParam}`
               : `https://dummyjson.com/products/category/${category}?limit=${LIMIT}&skip=${pageParam}`;

         try {
            const { data } = await axios.get<ProductPage>(url);
            return data;
         } catch (error) {
            throw new Error("Mahsulotlar olinmadi");
         }
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
         const total = lastPage.total ?? 0;
         const loaded = allPages.length * LIMIT;
         return loaded < total ? loaded : undefined;
      },
      staleTime: 0,
      gcTime: 0, // ✅ заменяет устаревший cacheTime
   });

   const products = data?.pages.flatMap((page) => page.products) ?? [];

   // Handle category change: refetch from first page
   useEffect(() => {
      refetch();
   }, [category, refetch]);

   // Observer ref & logic
   const observer = useRef<IntersectionObserver | null>(null);
   const lastElementRef = useCallback(
      (node: HTMLDivElement | null) => {
         if (isFetchingNextPage) return;
         if (observer.current) observer.current.disconnect();

         observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
               fetchNextPage();
            }
         });

         if (node) observer.current.observe(node);
      },
      [isFetchingNextPage, fetchNextPage, hasNextPage]
   );

   return (
      <motion.div
         className="max-w-6xl mx-auto px-4 mt-12"
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}>
         <motion.h2
            className="text-2xl font-semibold text-gray-800 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            Eng ommabop mahsulotlar
         </motion.h2>

         {/* CATEGORY BUTTONS */}
         <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
               variant={category === "all" ? "default" : "outline"}
               onClick={() => setCategory("all")}>
               Barchasi
            </Button>
            {["smartphones", "laptops", "fragrances", "skincare"].map((cat) => (
               <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  onClick={() => setCategory(cat)}>
                  {cat}
               </Button>
            ))}
         </div>

         {isLoading ? (
            <p className="text-center mt-8">Yuklanmoqda...</p>
         ) : isError ? (
            <p className="text-center mt-8 text-red-500">Xatolik yuz berdi</p>
         ) : (
            <motion.div
               className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
               variants={container}
               initial="hidden"
               animate="show">
               <AnimatePresence>
                  {products.map((product, index) => {
                     const isLast = index === products.length - 1;
                     return (
                        <motion.div
                           key={product.id}
                           variants={item}
                           exit={{ opacity: 0, scale: 0.9 }}
                           whileHover={{ scale: 1.03 }}
                           whileTap={{ scale: 0.98 }}
                           className="transition-shadow duration-300"
                           ref={isLast ? lastElementRef : null}>
                           <Link
                              to="/products/$productId"
                              params={{ productId: String(product.id) }}>
                              <Card className="shadow hover:shadow-xl transition-all h-full flex flex-col justify-between cursor-pointer">
                                 <CardHeader className="p-0">
                                    <img
                                       src={product.thumbnail}
                                       alt={product.title}
                                       className="w-full h-48 object-cover rounded-t-xl"
                                    />
                                 </CardHeader>
                                 <CardContent className="flex flex-col justify-between flex-1 space-y-2 p-4">
                                    <CardTitle className="text-lg line-clamp-2 min-h-[48px]">
                                       {product.title}
                                    </CardTitle>
                                    <p className="text-gray-600 text-base font-medium">
                                       ${product.price}
                                    </p>
                                    <AddToCartButton product={product} />
                                 </CardContent>
                              </Card>
                           </Link>
                        </motion.div>
                     );
                  })}
               </AnimatePresence>
            </motion.div>
         )}

         {isFetchingNextPage && (
            <p className="text-center mt-4 text-sm text-gray-500">
               Ko‘proq mahsulotlar yuklanmoqda...
            </p>
         )}
      </motion.div>
   );
};

const container = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.15,
      },
   },
};

const item = {
   hidden: { opacity: 0, y: 30 },
   show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
