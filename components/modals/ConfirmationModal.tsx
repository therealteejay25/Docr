"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, XCircle, Pencil } from "@phosphor-icons/react";
import { useAIStore } from "@/store/useAIStore";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmationModal({ isOpen, onClose }: ConfirmationModalProps) {
  const { confirmation, handleConfirmation } = useAIStore();

  if (!confirmation) return null;

  const handleAction = async (action: "accept" | "reject" | "modify") => {
    await handleConfirmation(action);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E1E1E] border border-[#333] rounded-2xl p-6 w-full max-w-md z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Confirmation Required</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-300 mb-6">{confirmation.message}</p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction("accept")}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1E1E1E] rounded-lg py-3 font-medium hover:bg-gray-100 transition-colors"
              >
                <Check size={20} weight="bold" />
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction("reject")}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2A2A2A] text-white border border-[#333] rounded-lg py-3 font-medium hover:bg-[#333] transition-colors"
              >
                <XCircle size={20} weight="bold" />
                Reject
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction("modify")}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2A2A2A] text-white border border-[#333] rounded-lg py-3 font-medium hover:bg-[#333] transition-colors"
              >
                <Pencil size={20} weight="bold" />
                Modify
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

