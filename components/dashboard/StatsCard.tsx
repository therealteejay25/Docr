"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  index: number;
}

export function StatsCard({ icon, label, value, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-[#1E1E1E] border-2 shadow-xl shadow-black/3 border-white/1 rounded-3xl p-6 flex flex-col gap-4"
    >
      <div className="flex gap-2 items-center">
      <div className="text-white">{icon}</div>
        <p className=" text-white">{label}</p>
      </div>
        <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

