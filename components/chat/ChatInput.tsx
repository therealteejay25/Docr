"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, PaperPlaneTilt, Stack } from "@phosphor-icons/react";
import { useAIStore } from "@/store/useAIStore";
import toast from "react-hot-toast";
import LogoIcon from "../LogoIcon";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { sendMessage, isStreaming } = useAIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const message = input.trim();
    setInput("");

    try {
      await sendMessage(message);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <motion.form
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onSubmit={handleSubmit}
      className="fixed bottom-6 left-1/2 bg-base -translate-x-1/2 w-full rounded-3xl shadow-xl max-w-2xl p-2 z-40"
    >
      <div className="p-3 rounded-2xl bg-white/3">
      <div className="relative rounded-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <LogoIcon size={24} />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hello, how can I help you today?"
          disabled={isStreaming}
          className="w-full bg-white/3 rounded-full pl-12 pr-14 py-4 text-white placeholder-white/50 outline-none transition-colors disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || isStreaming}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-[#1E1E1E] rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpRightIcon size={20} weight="bold" />
        </motion.button>
      </div>
      </div>
    </motion.form>
  );
}

