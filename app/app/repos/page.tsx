"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  GitBranch,
  FireSimple,
  ClockClockwise,
  GithubLogo,
  CaretRight,
  MagnifyingGlass,
  Trash,
  Info,
  FolderOpen,
} from "@phosphor-icons/react";
import { useReposStore } from "@/store/useReposStore";
import { ConnectRepoModal } from "@/components/modals/ConnectRepoModal";
import Link from "next/link";

export default function ReposPage() {
  const { repos, fetchRepos, disconnectRepo, loading } = useReposStore();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDisconnect = async (repoId: string, repoName: string) => {
    if (
      confirm(
        `Are you sure you want to disconnect ${repoName}? This cannot be undone.`
      )
    ) {
      setDisconnecting(repoId);
      try {
        await disconnectRepo(repoId);
      } catch (error) {
        console.error("Failed to disconnect:", error);
      } finally {
        setDisconnecting(null);
      }
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-[#181818] to-[#0f0f0f]">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Repositories</h1>
            <p className="text-white/60 text-lg">
              Manage {repos.length} connected repository
              {repos.length !== 1 ? "ies" : ""}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Plus size={22} weight="bold" />
            Connect Repository
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      {repos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 relative max-w-xl"
        >
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
          />
        </motion.div>
      )}

      {/* Content Section */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-500"></div>
            <p className="text-white/60 mt-6 text-lg">
              Loading repositories...
            </p>
          </div>
        </div>
      ) : repos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-16"
        >
          <div className="text-center py-20 px-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/20 mb-8">
              <GithubLogo size={48} className="text-blue-400" weight="fill" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              No repositories yet
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 text-lg">
              Connect your first GitHub repository to start automatically
              generating professional documentation with AI
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              <Plus size={22} weight="bold" />
              Connect Your First Repository
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-transparent group-hover:to-blue-500/5 transition-all duration-300" />

              <div className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <GithubLogo
                        size={28}
                        className="text-blue-400"
                        weight="fill"
                      />
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
                        {repo.name}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm ml-11 mb-4">
                      {repo.fullName}
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-6 ml-11">
                      <div className="flex items-center gap-2">
                        <GitBranch size={16} className="text-white/40" />
                        <span className="text-sm text-white/60">
                          {repo.defaultBranch}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-white/40" />
                        <span className="text-sm text-white/60">
                          {repo.language || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 ml-4">
                    <Link href={`/app/repos/${repo._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="View details"
                      >
                        <Info size={18} />
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDisconnect(repo._id, repo.name)}
                      disabled={disconnecting === repo._id}
                      className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      title="Disconnect repository"
                    >
                      {disconnecting === repo._id ? (
                        <div className="inline-block animate-spin h-4 w-4">
                          <div className="h-4 w-4 border-2 border-transparent border-t-red-400 rounded-full"></div>
                        </div>
                      ) : (
                        <Trash size={18} />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Click to view */}
                <Link
                  href={`/app/repos/${repo._id}`}
                  className="inline-flex items-center gap-2 mt-6 text-sm text-blue-400 hover:text-blue-300 transition-colors group/link"
                >
                  View project details
                  <CaretRight
                    size={16}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ConnectRepoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
