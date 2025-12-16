"use client";

import { motion } from "framer-motion";
import { CaretDown, SignOut, Gear } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    logout();
    router.push("/auth");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between p-6 border-b border-white/10"
    >
      <div className="flex items-center gap-4">
        {/* Breadcrumb or title can go here */}
      </div>

      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 bg-base border-2 border-white/2 hover:border-white/10 rounded-lg text-white transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={user?.avatarUrl || "/img.svg"}
              alt={user?.name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          {/* <span className="font-medium text-sm">
            {user?.name || user?.email}
          </span> */}
          <CaretDown size={16} className="text-white/50" weight="bold" />
        </motion.button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-base border-2 border-white/2 rounded-lg shadow-xl min-w-[250px] overflow-hidden z-50"
          >
            {/* User Info */}
            {/* <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/50">{user?.email}</p>
            </div> */}

            {/* Menu Items */}
            <Link href="/app/settings" className="block">
              <button
                onClick={() => setShowDropdown(false)}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/5 transition-colors flex items-center gap-3 text-sm"
              >
                <Gear size={16} />
                Settings
              </button>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors border-t-2 border-white/2 flex items-center gap-3 text-sm"
            >
              <SignOut size={16} />
              Sign Out
            </button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
