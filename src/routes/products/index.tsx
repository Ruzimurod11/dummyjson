// src/routes/products/index.tsx
import React from "react";
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../login";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ProductImage } from "@/components/ProductImage";

// src/routes/products/index.tsx
import {
   fetchProducts,
   createProduct,
   updateProduct,
   deleteProduct,
} from "@/api/products";

export type AddToCartButtonProps = {
   id: number;
   title: string;
   price: number;
   thumbnail: string;
};

export type Product = {
   id: number;
   title: string;
   description: string;
   price: number;
   discountPercentage?: number;
   rating: number;
   stock: number;
   brand: string;
   category: string;
   thumbnail: string;
   images: string[];
};

type ProductsResponse = {
   products: Product[];
   total: number;
   skip: number;
   limit: number;
};

export const Route = createFileRoute("/products/")({
   beforeLoad: () => {
      if (!isAuthenticated()) {
         throw redirect({ to: "/login" });
      }
   },
   component: ProductsPage,
});

function ProductsPage() {
   const queryClient = useQueryClient();
   const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
   const [editingProduct, setEditingProduct] = React.useState<Product | null>(
      null
   );
   const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
   const [newProduct, setNewProduct] = React.useState({
      title: "",
      price: 0,
      description: "",
   });

   const { data, isLoading } = useQuery<ProductsResponse>({
      queryKey: ["products"],
      queryFn: fetchProducts,
   });

   console.log(data);

   const products = data?.products ?? [];

   const handleEdit = (product: Product) => {
      setEditingProduct(product);
      setIsEditModalOpen(true);
   };

   const createProductMutation = useMutation({
      mutationFn: createProduct,
      onSuccess: (newProduct) => {
         toast.success("Post yaratildi", { duration: 900 });
         queryClient.setQueryData<ProductsResponse>(["products"], (oldData) => {
            if (!oldData)
               return { products: [newProduct], total: 1, skip: 0, limit: 10 };
            return { ...oldData, products: [...oldData.products, newProduct] };
         });
         setIsCreateModalOpen(false);
         setNewProduct({ title: "", price: 0, description: "" });
      },
      onError: (error) => console.error("Create error:", error),
   });
   const updateProductMutation = useMutation({
      mutationFn: updateProduct,
      onSuccess: (updatedProduct) => {
         toast.success("Post muvaqqiyatli yangilandi", { duration: 900 });
         queryClient.setQueryData<ProductsResponse>(["products"], (oldData) => {
            if (!oldData) return oldData;
            return {
               ...oldData,
               products: oldData.products.map((product) =>
                  product.id === updatedProduct.id ? updatedProduct : product
               ),
            };
         });
         setIsEditModalOpen(false);
         setEditingProduct(null);
      },
      onError: (error) => console.error("Update error:", error),
   });

   const deleteProductMutation = useMutation({
      mutationFn: deleteProduct,
      onSuccess: (deletedId) => {
         toast.success("Post muvaqqiyatli o'chirildi", { duration: 900 });
         queryClient.setQueryData<ProductsResponse>(["products"], (oldData) => {
            if (!oldData) return oldData;
            return {
               ...oldData,
               products: oldData.products.filter(
                  (product) => product.id !== deletedId
               ),
            };
         });
      },
      onError: (error) => console.error("Delete error:", error),
   });

   const handleCreate = () => {
      createProductMutation.mutate(newProduct);
   };

   const handleUpdate = (product: Product) => {
      updateProductMutation.mutate(product);
   };

   const handleDelete = (id: number) => {
      deleteProductMutation.mutate(id);
   };

   const columns: ColumnDef<Product>[] = [
      {
         header: "ID",
         accessorKey: "id",
      },
      {
         header: "Title",
         cell: ({ row }) => (
            <Link
               to="/products/$productId"
               params={{ productId: row.original.id.toString() }}
               className="text-blue-600 hover:underline">
               {row.original.title}
            </Link>
         ),
      },
      {
         header: "Price",
         accessorKey: "price",
         cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
      },
      {
         header: "Description",
         cell: ({ row }) => (
            <p className="text-gray-700 text-lg">
               {row.original.description.length > 50
                  ? `${row.original.description.slice(0, 50)}...`
                  : row.original.description}
            </p>
         ),
      },
      {
         header: "Image",
         cell: ({ row }) => (
            <ProductImage
               src={row.original.thumbnail}
               alt={row.original.title}
            />
         ),
      },
      {
         header: "Actions",
         cell: ({ row }) => (
            <div className="space-x-2 max-w-2xl">
               <Button
                  onClick={() => handleEdit(row.original)}
                  className="text-white bg-green-500 hover:underline cursor-pointer">
                  Edit
               </Button>

               <Button
                  variant={"destructive"}
                  onClick={() => handleDelete(row.original.id)}
                  disabled={
                     deleteProductMutation.isPending &&
                     deleteProductMutation.variables === row.original.id
                  }
                  className={`text-white hover:underline cursor-pointer ${
                     deleteProductMutation.isPending &&
                     deleteProductMutation.variables === row.original.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                  }`}>
                  {deleteProductMutation.isPending &&
                  deleteProductMutation.variables === row.original.id
                     ? "Deleting..."
                     : "Delete"}
               </Button>
            </div>
         ),
      },
   ];

   const table = useReactTable({
      data: products,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   return (
      <div className="max-w-7xl mx-auto px-4 py-5">
         <h1 className="text-xl font-bold mb-4 text-green-700">Mahsulotlar</h1>
         <p className="text-lg text-gray-700 mb-4">
            MyCRUDApp — bu foydalanuvchilarga CRUD (Create, Read, Update,
            Delete) amallarini bajarishga imkon beruvchi zamonaviy va qulay web
            ilova.
         </p>

         <div className="flex justify-end mb-4">
            <Button
               className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
               onClick={() => setIsCreateModalOpen(true)}>
               + Add Product
            </Button>
         </div>

         {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Create Product</h2>
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        handleCreate();
                     }}
                     className="space-y-4">
                     <input
                        type="text"
                        value={newProduct.title}
                        onChange={(e) =>
                           setNewProduct((prev) => ({
                              ...prev,
                              title: e.target.value,
                           }))
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Title"
                        required
                     />
                     <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                           setNewProduct((prev) => ({
                              ...prev,
                              price: parseFloat(e.target.value),
                           }))
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Price"
                        required
                     />
                     <textarea
                        value={newProduct.description}
                        onChange={(e) =>
                           setNewProduct((prev) => ({
                              ...prev,
                              description: e.target.value,
                           }))
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Description"
                        required
                     />
                     <div className="flex justify-end space-x-2 mt-4">
                        <button
                           type="button"
                           className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                           onClick={() => setIsCreateModalOpen(false)}>
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={createProductMutation.isPending}
                           className={`px-4 py-2 bg-blue-600 text-white rounded cursor-pointer ${
                              createProductMutation.isPending
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }`}>
                           {createProductMutation.isPending
                              ? "Creating..."
                              : "Create"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => (
                  <div
                     key={i}
                     className="p-4 border rounded-lg shadow-sm bg-white space-y-3 animate-pulse">
                     <div className="h-40 bg-gray-200 rounded w-full" />
                     <div className="h-4 bg-gray-200 rounded w-3/4" />
                     <div className="h-4 bg-gray-200 rounded w-1/2" />
                     <div className="h-4 bg-gray-200 rounded w-full" />
                     <div className="flex justify-between">
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-200 rounded" />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <>
               {/* Table for larger screens */}
               <div className="hidden md:block border rounded-lg overflow-hidden shadow-sm bg-white">
                  <Table>
                     <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                           <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                 <TableHead
                                    key={header.id}
                                    className="border-r text-lg font-semibold bg-gray-100">
                                    {header.isPlaceholder
                                       ? null
                                       : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                         )}
                                 </TableHead>
                              ))}
                           </TableRow>
                        ))}
                     </TableHeader>
                     <TableBody>
                        {table.getRowModel().rows.map((row) => (
                           <TableRow key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell
                                    key={cell.id}
                                    className="border-r text-lg">
                                    {flexRender(
                                       cell.column.columnDef.cell,
                                       cell.getContext()
                                    )}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>

               {/* Cards for small screens */}
               <div className="md:hidden space-y-4">
                  {products.map((product) => (
                     <Link
                        key={product.id}
                        to="/products/$productId"
                        params={{ productId: product.id.toString() }}
                        className="block border rounded-lg p-4 shadow-sm bg-white space-y-3 hover:bg-gray-50 transition-all">
                        <div className="flex justify-between items-center">
                           <h2 className="text-lg font-semibold text-green-700">
                              {product.title}
                           </h2>
                           <span className="text-blue-600 font-bold">
                              ${product.price.toFixed(2)}
                           </span>
                        </div>
                        <ProductImage
                           src={product.thumbnail}
                           alt={product.title}
                           className="w-16 h-20 object-cover rounded transition-opacity duration-300"
                        />
                        <p className="text-gray-700">
                           {product.description.length > 100
                              ? product.description.slice(0, 100) + "..."
                              : product.description}
                        </p>
                        <div className="flex justify-end space-x-2">
                           <Button
                              className="bg-green-500 text-white"
                              onClick={(e) => {
                                 e.preventDefault();
                                 handleEdit(product);
                              }}>
                              Edit
                           </Button>
                           <Button
                              variant={"destructive"}
                              onClick={(e) => {
                                 e.preventDefault();
                                 handleDelete(product.id);
                              }}
                              disabled={
                                 deleteProductMutation.isPending &&
                                 deleteProductMutation.variables === product.id
                              }>
                              {deleteProductMutation.isPending &&
                              deleteProductMutation.variables === product.id
                                 ? "Deleting..."
                                 : "Delete"}
                           </Button>
                        </div>
                     </Link>
                  ))}
               </div>
            </>
         )}

         {isEditModalOpen && editingProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(editingProduct);
                     }}
                     className="space-y-4">
                     <input
                        type="text"
                        value={editingProduct.title}
                        onChange={(e) =>
                           setEditingProduct((prev) =>
                              prev ? { ...prev, title: e.target.value } : prev
                           )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Title"
                     />
                     <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) =>
                           setEditingProduct((prev) =>
                              prev
                                 ? {
                                      ...prev,
                                      price: parseFloat(e.target.value),
                                   }
                                 : prev
                           )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Price"
                     />
                     <textarea
                        value={editingProduct.description}
                        onChange={(e) =>
                           setEditingProduct((prev) =>
                              prev
                                 ? { ...prev, description: e.target.value }
                                 : prev
                           )
                        }
                        className="w-full border p-2 rounded"
                        placeholder="Description"
                     />
                     <div className="flex justify-end space-x-2 mt-4">
                        <button
                           type="button"
                           className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                           onClick={() => setIsEditModalOpen(false)}>
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={updateProductMutation.isPending}
                           className={`px-4 py-2 bg-green-600 text-white rounded cursor-pointer ${
                              updateProductMutation.isPending
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }`}>
                           {updateProductMutation.isPending
                              ? "Saving..."
                              : "Save"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
