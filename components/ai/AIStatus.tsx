"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAIStore } from "@/store/useAIStore";
import {
  CircleNotch,
  CheckCircle,
  XCircle,
  Question,
} from "@phosphor-icons/react";

export function AIStatus() {
  const { status, steps, actions, message } = useAIStore();

  if (status === "idle") return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-30"
    >
      <div className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-6 backdrop-blur-xl">
        {/* Status Indicator */}
        <div className="flex items-center gap-3 mb-4">
          {status === "thinking" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <CircleNotch size={24} className="text-white" weight="bold" />
            </motion.div>
          )}
          {status === "executing" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <CircleNotch size={24} className="text-blue-500" weight="bold" />
            </motion.div>
          )}
          {status === "asking" && (
            <Question size={24} className="text-yellow-500" weight="bold" />
          )}
          {status === "completed" && (
            <CheckCircle size={24} className="text-green-500" weight="bold" />
          )}
          {status === "error" && (
            <XCircle size={24} className="text-red-500" weight="bold" />
          )}
          <span className="text-white font-medium capitalize">{status}</span>
        </div>

        {/* Steps Progress */}
        <AnimatePresence>
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 mb-4"
            >
              {steps.map((step) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    step.status === "in_progress"
                      ? "bg-blue-500/10 border border-blue-500/20"
                      : step.status === "completed"
                      ? "bg-green-500/10 border border-green-500/20"
                      : step.status === "failed"
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-[#2A2A2A] border border-[#333]"
                  }`}
                >
                  {step.status === "in_progress" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <CircleNotch size={16} className="text-blue-500" />
                    </motion.div>
                  )}
                  {step.status === "completed" && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  {step.status === "failed" && (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className="text-sm text-gray-300 flex-1">
                    {step.description}
                  </span>
                  {step.totalSteps && (
                    <span className="text-xs text-gray-500">
                      {step.step}/{step.totalSteps}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <AnimatePresence>
          {actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 mb-4"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                    action.status === "executing"
                      ? "bg-blue-500/10 text-blue-400"
                      : action.status === "completed"
                      ? "bg-green-500/10 text-green-400"
                      : action.status === "failed"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-[#2A2A2A] text-gray-400"
                  }`}
                >
                  {action.status === "executing" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <CircleNotch size={14} />
                    </motion.div>
                  )}
                  {action.status === "completed" && <CheckCircle size={14} />}
                  {action.status === "failed" && <XCircle size={14} />}
                  <span>{action.description}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-sm"
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

