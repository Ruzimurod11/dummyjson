import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "./login";

export const Route = createFileRoute("/about")({
   beforeLoad: () => {
      if (!isAuthenticated()) {
         throw redirect({ to: "/login" });
      }
   },
   component: AboutPage,
});

function AboutPage() {
   return (
      <div className="max-w-7xl mx-auto px-4 py-16 mt-12">
         <h1 className="text-3xl font-bold mb-4 text-green-700">
            Biz haqimizda
         </h1>
         <p className="text-lg text-gray-700 mb-8">
            MyCRUDApp — bu foydalanuvchilarga CRUD (Create, Read, Update,
            Delete) amallarini bajarishga imkon beruvchi zamonaviy va qulay web
            ilova. Ilova yordamida siz postlar qo‘shishingiz, tahrirlashingiz va
            o‘chirishingiz mumkin.
         </p>
      </div>
   );
}
