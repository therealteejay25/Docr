"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#181818] text-white flex-col p-6">
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Logo size={72} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-7 items-center p-4 px-8 rounded-full bg-[#1E1E1E] border border-[#333]"
        >
          <a
            href="#"
            className="text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            Features
          </a>
          <a
            href="#"
            className="text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            Pricing
          </a>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/auth")}
          className="flex gap-7 items-center p-3 font-semibold px-8 rounded-full bg-white text-[#1E1E1E] hover:bg-gray-100 transition-colors"
        >
          Get Started
        </motion.button>
      </div>
      <div className="flex flex-col pt-10 md:pt-24 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-[#DDDDDD] to-[#5E5E5E] text-center text-5xl font-semibold">
            Unified Platform To Build <br />
            And{" "}
            <span className="bg-white bg-clip-text text-transparent">
              Automate
            </span>{" "}
            Documentations
          </h1>
          <p className="text-white/50 max-w-2xl text-center">
            Automatically generate and update documentation for your GitHub
            repositories with AI-powered insights.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
