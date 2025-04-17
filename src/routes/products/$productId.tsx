import { RatingStars } from "@/components/RatingStars";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../login";
import React from "react";
import { toast } from "sonner";
import { useCartStore, CartItem } from "@/store/cartStore";
import { Product } from "./index";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { NotFoundPage } from "@/components/NotFoundPage";
import { motion } from "framer-motion";
import { getProductById, updateProduct, deleteProduct } from "@/api/productId";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productId")({
   beforeLoad: () => {
      if (!isAuthenticated()) {
         throw redirect({ to: "/login" });
      }
   },
   component: ProductDetailPage,
});

const cartIconPosition = { x: 300, y: -300 }; // настрой под свою иконку на Navbar

function ProductDetailPage() {
   const [isFlying, setIsFlying] = React.useState(false);
   const queryClient = useQueryClient();
   const { productId } = Route.useParams();
   const { addToCart } = useCartStore();
   const [isEditing, setIsEditing] = React.useState(false);
   const [isAddingToCart, setIsAddingToCart] = React.useState(false);
   const [isUpdating, setIsUpdating] = React.useState(false);
   const navigate = useNavigate();

   const deleteMutation = useMutation({
      mutationFn: () => deleteProduct(productId),
      onSuccess: () => {
         toast.success("Product deleted successfully", { duration: 900 });
         queryClient.invalidateQueries({ queryKey: ["products"] }); // если есть список
         navigate({ to: "/products" }); // редирект на список
      },
      onError: () => {
         toast.error("Failed to delete the product.");
      },
   });

   const { data: product, isLoading } = useQuery<Product>({
      queryKey: ["product", productId],
      queryFn: () => getProductById(productId),
   });

   const [editedData, setEditedData] = React.useState({
      title: "",
      price: 0,
      description: "",
   });

   // Sync state after product is loaded
   React.useEffect(() => {
      if (product) {
         setEditedData({
            title: product.title,
            price: product.price,
            description: product.description,
         });
         window.scrollTo(0, 0);
      }
   }, [product]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-100 to-white">
            <svg
               className="w-16 h-16 text-amber-600 animate-spin-slow"
               viewBox="0 0 100 100"
               xmlns="http://www.w3.org/2000/svg"
               fill="none">
               <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset="75"
               />
            </svg>
            <style>
               {`
						@keyframes spin-slow {
						0% { transform: rotate(0deg); }
						100% { transform: rotate(360deg); }
						}
						.animate-spin-slow {
						animation: spin-slow 2s linear infinite;
						}
   			   `}
            </style>
         </div>
      );
   }

   if (!product) {
      return <NotFoundPage />;
   }

   const handleRate = (rating: number) => {
      console.log("Foydalanuvchi baholadi:", rating);
   };

   const toCartItem = (product: Product): CartItem => ({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
   });

   console.log(toCartItem(product));

   const handleUpdate = async () => {
      try {
         setIsUpdating(true);
         const updated = await updateProduct(productId, editedData);
         toast.success("Product updated successfully", { duration: 900 });

         setIsEditing(false);
         setEditedData({
            title: updated.title,
            price: updated.price,
            description: updated.description,
         });
         queryClient.setQueryData(["product", productId], updated);
      } catch (error) {
         console.error("Update error:", error);
         toast.error("Failed to update the product.");
      } finally {
         setIsUpdating(false);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-b from-amber-100 to-white py-16 px-4">
         <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 flex items-center justify-center bg-amber-50">
               <motion.img
                  className="w-64 h-64 object-cover rounded-xl border-4 border-amber-200 shadow-md"
                  src={product?.thumbnail}
                  alt={product?.title}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={
                     isFlying
                        ? {
                             x: cartIconPosition.x,
                             y: cartIconPosition.y,
                             scale: 0.1,
                             opacity: 0,
                          }
                        : { x: 0, y: 0, scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.8, ease: "easeInOut" }}
               />
            </div>
            <div className="p-8 space-y-4">
               {isEditing ? (
                  <>
                     <input
                        type="text"
                        value={editedData.title}
                        onChange={(e) =>
                           setEditedData({
                              ...editedData,
                              title: e.target.value,
                           })
                        }
                        className="w-full border p-2 rounded"
                     />
                     <input
                        type="number"
                        value={editedData.price}
                        onChange={(e) =>
                           setEditedData({
                              ...editedData,
                              price: parseFloat(e.target.value),
                           })
                        }
                        className="w-full border p-2 rounded"
                     />
                     <textarea
                        value={editedData.description}
                        onChange={(e) =>
                           setEditedData({
                              ...editedData,
                              description: e.target.value,
                           })
                        }
                        className="w-full border p-2 rounded"
                     />
                  </>
               ) : (
                  <>
                     <h1 className="text-3xl font-extrabold text-amber-800">
                        {product?.title}
                     </h1>
                     <p className="text-gray-700 text-lg">
                        {product?.description}
                     </p>
                     <p className="text-xl font-semibold text-green-600">
                        ${product?.price}
                     </p>
                  </>
               )}

               <div className="flex items-center gap-2">
                  <RatingStars
                     initialRating={product?.rating || 0}
                     onRate={handleRate}
                  />
                  <span className="text-sm text-gray-600">
                     ({product?.rating || 0})
                  </span>
               </div>

               <p className="text-sm text-gray-500">ID: #{product?.id}</p>

               <div className="flex flex-wrap gap-2 mt-4">
                  <button
                     onClick={() => {
                        setIsFlying(true);
                        setIsAddingToCart(true);
                        setTimeout(() => {
                           addToCart(toCartItem(product));
                           toast.success("Added to cart!", { duration: 900 });
                           setIsFlying(false);
                           setIsAddingToCart(false);
                        }, 800);
                     }}
                     disabled={isAddingToCart}
                     className={`px-5 py-2 font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 min-w-[140px] ${
                        isAddingToCart
                           ? "bg-amber-400 cursor-not-allowed"
                           : "bg-amber-600 hover:bg-amber-700 text-white"
                     }`}>
                     {isAddingToCart ? (
                        <>
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
                           Adding...
                        </>
                     ) : (
                        "Add to Cart"
                     )}
                  </button>

                  {isEditing ? (
                     <>
                        <button
                           onClick={handleUpdate}
                           disabled={isUpdating}
                           className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow flex items-center justify-center gap-2 min-w-[140px]">
                           {isUpdating ? (
                              <>
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
                                 Saving...
                              </>
                           ) : (
                              "Save Changes"
                           )}
                        </button>

                        <button
                           onClick={() => setIsEditing(false)}
                           className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-xl shadow">
                           Cancel
                        </button>
                     </>
                  ) : (
                     <>
                        <button
                           onClick={() => setIsEditing(true)}
                           className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow">
                           Edit
                        </button>
                        <button
                           onClick={() => deleteMutation.mutate()}
                           disabled={deleteMutation.isPending}
                           className={`px-5 py-2 rounded-xl shadow text-white ${
                              deleteMutation.isPending
                                 ? "bg-red-400 cursor-not-allowed"
                                 : "bg-red-600 hover:bg-red-700"
                           }`}>
                           {deleteMutation.isPending ? (
                              <>
                                 <svg
                                    className="animate-spin h-5 w-5 text-white inline mr-2"
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
                                 Deleting...
                              </>
                           ) : (
                              "Delete"
                           )}
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
