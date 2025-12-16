"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { useCreditsStore } from "@/store/useCreditsStore";
import toast from "react-hot-toast";

interface RefillCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const creditAmounts = [1000, 5000, 10000, 25000];

export function RefillCreditsModal({
  isOpen,
  onClose,
}: RefillCreditsModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const { addCredits, fetchBalance } = useCreditsStore();
  const [loading, setLoading] = useState(false);

  const handleRefill = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await addCredits(amount);
      await fetchBalance();
      toast.success(`Added ${amount} credits successfully!`);
      onClose();
      setCustomAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to add credits");
    } finally {
      setLoading(false);
    }
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Refill Credits</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {creditAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? "bg-white text-[#1E1E1E] border-white"
                        : "bg-[#2A2A2A] text-white border-[#333] hover:border-white/50"
                    }`}
                  >
                    {amount.toLocaleString()}
                  </motion.button>
                ))}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Or enter custom amount
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-[#2A2A2A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefill}
                disabled={loading}
                className="w-full bg-white text-[#1E1E1E] rounded-lg py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Refill Credits"}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

