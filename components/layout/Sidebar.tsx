"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GridFourIcon,
  FileText,
  ClockClockwiseIcon,
  Stack,
  GearIcon,
  StackSimpleIcon,
} from "@phosphor-icons/react";
import Logo from "@/components/Logo";
import LogoIcon from "../LogoIcon";

const navItems = [
  { icon: GridFourIcon, label: "Dashboard", path: "/app" },
  { icon: StackSimpleIcon, label: "Repositories", path: "/app/repos" },
  { icon: ClockClockwiseIcon, label: "History", path: "/app/history" },
  { icon: GearIcon, label: "Settings", path: "/app/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-16 bg-[#1A1A1A] flex flex-col items-center py-6 gap-6"
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer"
      >
        <LogoIcon size={32} />
      </motion.div>

      <nav className="flex h-full items-center justify-center flex-col gap-3 flex-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <motion.button
              key={`${item.label}-${index}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(item.path)}
              className={`relative p-3 cursor-pointer rounded-lg transition-colors ${
                isActive
                  ? "text-white hover:bg-transparent"
                  : "text-white/50 hover:text-white"
              }`}
              title={item.label}
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-lg -z-10"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}

