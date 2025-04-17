import { motion } from "framer-motion";
import { Ghost } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
   return (
      <div className="relative h-screen bg-gradient-to-br from-zinc-900 via-purple-900 to-black overflow-hidden flex items-center justify-center text-white px-4">
         {/* Летающие привидения */}
         <GhostAnimation />
         <GhostAnimation delay={2} top="20%" />
         <GhostAnimation delay={4} top="60%" />

         {/* Контент */}
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-glow">
               404 - Sahifa yo‘qolib qoldi!
            </h1>
            <p className="text-xl mb-6 text-zinc-300">
               Xatolik yuz berdi. Bu yerda faqat 🕷️ chang va 👻 ruhlar bor.
            </p>
            <Link
               to="/"
               className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 transition rounded-full text-lg font-semibold shadow-md">
               Bosh sahifaga qaytish
            </Link>
         </motion.div>
      </div>
   );
}

function GhostAnimation({
   delay = 0,
   top = "10%",
}: {
   delay?: number;
   top?: string;
}) {
   return (
      <motion.div
         initial={{ x: "-10vw", opacity: 0 }}
         animate={{ x: "110vw", opacity: 1 }}
         transition={{
            delay,
            duration: 10,
            repeat: Infinity,
            repeatType: "loop",
         }}
         className="absolute"
         style={{ top }}>
         <Ghost className="w-10 h-10 text-white opacity-30 animate-pulse" />
      </motion.div>
   );
}
