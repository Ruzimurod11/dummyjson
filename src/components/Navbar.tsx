import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   const { user, logout, isAuthenticated } = useAuthStore();
   const cartCount = useCartStore((state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0)
   );

   const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
         await new Promise((resolve) => setTimeout(resolve, 1000));
         logout();
         location.href = "/login";
      } finally {
         setIsLoggingOut(false);
      }
   };

   const toggleMenu = () => setIsOpen(!isOpen);

   return (
      <nav className="bg-gray-800 p-4">
         <div className="container max-w-7xl px-4 mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-lg font-bold">
               My App
            </Link>

            <button className="md:hidden text-white" onClick={toggleMenu}>
               {isOpen ? (
                  <X className="w-6 h-6" />
               ) : (
                  <Menu className="w-6 h-6" />
               )}
            </button>

            <ul
               className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent px-4 md:px-0 transition-all duration-200 ease-in-out z-50 ${
                  isOpen ? "block p-5" : "hidden md:flex"
               }`}>
               <li>
                  <Link to="/" className="text-white hover:text-gray-300">
                     Home
                  </Link>
               </li>
               <li>
                  <Link to="/about" className="text-white hover:text-gray-300">
                     About
                  </Link>
               </li>
               <li>
                  <Link
                     to="/products"
                     className="text-white hover:text-gray-300">
                     Products
                  </Link>
               </li>
               <li className="relative">
                  <Link to="/cart" className="text-white hover:text-gray-300">
                     <ShoppingCart className="w-6 h-6 inline-block" />
                     {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full shadow">
                           {cartCount}
                        </span>
                     )}
                  </Link>
               </li>

               {isAuthenticated ? (
                  <>
                     <li className="text-white">Hello, {user?.firstName}</li>
                     <li>
                        <button
                           onClick={handleLogout}
                           disabled={isLoggingOut}
                           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                           {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                     </li>
                  </>
               ) : (
                  <li>
                     <Link
                        to="/login"
                        className="text-white text-center bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
                        Login
                     </Link>
                  </li>
               )}
            </ul>
         </div>
      </nav>
   );
};
