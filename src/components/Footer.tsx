import { Link } from "@tanstack/react-router";

export const Footer = () => {
   return (
      <footer className="bg-gray-800 text-white py-6 mt-10">
         <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
               <p className="text-lg font-semibold">My App</p>
               <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} All rights reserved
               </p>
            </div>
            <ul className="flex space-x-4">
               <Link to="/" className="hover:text-gray-300">
                  Home
               </Link>
               <Link to="/about" className="hover:text-gray-300">
                  About
               </Link>
               <Link to="/products" className="hover:text-gray-300">
                  Products
               </Link>
            </ul>
         </div>
      </footer>
   );
};
