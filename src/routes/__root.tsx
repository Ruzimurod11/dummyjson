import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";
import { Footer } from "@/components/Footer";
import { NotFoundPage } from "@/components/NotFoundPage";

export const Route = createRootRoute({
   component: RootComponent,
   notFoundComponent: NotFoundPage,
});

function RootComponent() {
   return (
      <div className="min-h-screen flex flex-col">
         <Navbar />
         <Toaster richColors position="top-right" />

         {/* Main content: grows to fill space */}
         <main className="flex-grow">
            <Outlet />
         </main>

         {/* Always sticks to the bottom */}
         <Footer />
      </div>
   );
}
