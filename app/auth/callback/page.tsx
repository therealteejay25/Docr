"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { CircleNotch } from "@phosphor-icons/react";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const refresh = searchParams.get("refresh");

    if (token && refresh) {
      // Store tokens
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refresh);

      // Set auth state (user will be fetched from API)
      setAuth(
        { userId: "", email: "" }, // Will be updated from API
        token,
        refresh
      );

      // Redirect to dashboard
      router.push("/app");
    } else {
      router.push("/auth");
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <CircleNotch size={48} className="text-white mx-auto" />
        </motion.div>
        <p className="text-white text-lg">Completing authentication...</p>
      </motion.div>
    </div>
  );
}

