"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Warning, MagnifyingGlass } from "@phosphor-icons/react";
import { useReposStore } from "@/store/useReposStore";

interface Repo {
  id: number;
  name: string;
  owner: { login: string };
  language?: string;
  stargazers_count: number;
}

interface ConnectRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectRepoModal({ isOpen, onClose }: ConnectRepoModalProps) {
  const { availableRepos, fetchAvailable, connectRepo } = useReposStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAvailable().finally(() => setLoading(false));
    }
  }, [isOpen, fetchAvailable]);

  const filteredRepos = (availableRepos as Repo[]).filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConnect = async (repo: Repo) => {
    setError(null);
    setSuccess(null);
    setConnecting(String(repo.id));

    try {
      await connectRepo(repo.id, repo.owner.login, repo.name);
      setSuccess(`${repo.name} connected successfully!`);
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setSearchTerm("");
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "Failed to connect repository");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-base border-2 border-white/2 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Connect Repository
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  Select a repository to start generating documentation
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-white/10">
              <div className="relative">
                <MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-3 text-white/40"
                />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border-2 border-white/2 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3"
              >
                <Warning
                  size={20}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start gap-3"
              >
                <Check
                  size={20}
                  className="text-green-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-green-400">{success}</p>
              </motion.div>
            )}

            {/* Repos List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-white/20 border-t-white"></div>
                  <p className="text-white/60 mt-3">Loading repositories...</p>
                </div>
              ) : filteredRepos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">
                    {searchTerm
                      ? "No repositories found"
                      : "No repositories available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRepos.map((repo: Repo, index: number) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg border-2 border-white/2 hover:border-white/20 transition-all group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white truncate">
                          {repo.name}
                        </p>
                        <p className="text-xs text-white/50 truncate">
                          {repo.owner.login}/{repo.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                          {repo.language && (
                            <span className="px-2 py-1 bg-white/5 rounded">
                              {repo.language}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-white/5 rounded">
                            {repo.stargazers_count} ⭐
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConnect(repo)}
                        disabled={connecting === String(repo.id)}
                        className="ml-4 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                      >
                        {connecting === String(repo.id)
                          ? "Connecting..."
                          : "Connect"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
