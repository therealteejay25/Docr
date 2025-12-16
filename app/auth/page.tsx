"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/Logo";
import { authApi } from "@/lib/api-client";

export default function AuthPage() {
  const handleGitHubLogin = () => {
    authApi.githubLogin();
  };

  return (
    <div className="h-screen w-screen flex bg-[#181818] text-white">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex w-[30%] p-6 flex-col"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Logo size={72} />
        </motion.div>
        <div className="flex items-center justify-center h-full flex-col gap-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold"
          >
            Documentation on Autopilot.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1E1E1E] mx-9 rounded-4xl p-6 flex flex-col gap-32 border border-[#333]"
          >
            <div className="flex flex-col gap-3">
              <Image src="/github.svg" alt="GitHub" height={48} width={48} />
              <p className="text-white/50">
                Connect your GitHub repositories to automatically generate and
                update documentation with AI-powered insights.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGitHubLogin}
              className="bg-white cursor-pointer rounded-full w-full p-3.5 text-base font-medium hover:bg-gray-100 transition-colors"
            >
              Continue with GitHub
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm mx-9 text-center text-white/75"
          >
            By continuing, you agree to our terms of condition and privacy
            policy.
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg w-[70%] h-screen"
      />
    </div>
  );
}
