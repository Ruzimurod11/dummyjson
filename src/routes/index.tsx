import { Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { isAuthenticated } from "./login";
import { ProductGallery } from "@/components/ProductGallery";

export const Route = createFileRoute("/")({
   beforeLoad: () => {
      if (!isAuthenticated()) {
         throw redirect({ to: "/login" });
      }
   },
   component: () => <Index />,
});

function Index() {
   return (
      <div className="bg-gray-100 py-16 px-4">
         <div className="max-w-7xl mx-auto text-center space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">
               MyCRUDApp-ga Xush Kelibsiz!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Bu ilova orqali siz postlar yaratishingiz, ularni tahrirlashingiz
               va o‘chirishingiz mumkin. Hammasi bir joyda — oddiy va qulay!
            </p>

            <Button asChild size="lg">
               <Link to="/products">Mahsulotlar bo‘limiga o‘tish</Link>
            </Button>
         </div>

         <div className="mt-16">
            <ProductGallery />
         </div>
      </div>
   );
}
