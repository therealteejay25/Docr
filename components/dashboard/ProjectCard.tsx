"use client";

import { motion } from "framer-motion";
import { Eye, Clock, Lightbulb } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Repo } from "@/store/useReposStore";

interface ProjectCardProps {
  repo: Repo;
  index: number;
  liveEvent?: any;
  lastSummary?: string | null;
}

export function ProjectCard({ repo, index }: ProjectCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-white">{repo.name}</h3>
        {repo.lastProcessedCommit && (
          <div className="ml-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/60">Live</span>
          </div>
        )}
      </div>

      {repo.lastProcessedSummary && (
        <p className="text-sm text-gray-300 line-clamp-2">
          {repo.lastProcessedSummary}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Eye size={16} />
          <span>{repo.lastProcessedCommit ? "Active" : "No commits yet"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock size={16} />
          <span>
            {repo.lastProcessedAt
              ? new Date(repo.lastProcessedAt).toLocaleDateString()
              : "Never updated"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Lightbulb size={16} />
          <span>
            {repo.language || "Unknown"} • {repo.size || 0} KB
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2">
        Repository: {repo.fullName}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push(`/app/repos/${repo._id}`)}
        className="mt-auto bg-white text-[#1E1E1E] rounded-lg py-3 font-medium hover:bg-white transition-colors"
      >
        View Project
      </motion.button>
    </motion.div>
  );
}
