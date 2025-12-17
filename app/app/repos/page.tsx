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
} from "@phosphor-icons/react";
import { useReposStore } from "@/store/useReposStore";
import { ConnectRepoModal } from "@/components/modals/ConnectRepoModal";
import Link from "next/link";

export default function ReposPage() {
  const { repos, fetchRepos, disconnectRepo, loading } = useReposStore();
  const [repoEvents, setRepoEvents] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Subscribe to SSE channels for each repo to display live backend events
  useEffect(() => {
    if (!repos || repos.length === 0) return;

    const sources: Record<string, EventSource> = {};

    repos.forEach((r) => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
        const es = new EventSource(
          `${apiBase}/api/${
            process.env.NEXT_PUBLIC_API_VERSION || "v1"
          }/events/${r._id}`
        );
        es.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            setRepoEvents((prev) => ({ ...prev, [r._id]: data }));
          } catch (err) {
            console.error("Failed to parse SSE message for repo", r._id, err);
          }
        };
        es.onerror = () => {
          try {
            es.close();
          } catch {}
        };
        sources[r._id] = es;
      } catch (err) {
        console.warn("Failed to open SSE for repo", r._id, err);
      }
    });

    return () => {
      Object.values(sources).forEach((s) => s.close());
    };
  }, [repos]);

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
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              Repositories
            </h1>
            <p className="text-white/60">
              {repos.length} repositor{repos.length !== 1 ? "ies" : "y"}{" "}
              connected
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-3 bg-white text-black font-semibold rounded-lg text-sm hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Plus size={16} weight="bold" />
            Connect Repository
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      {repos.length > 0 && (
        <div className="mb-6 relative max-w-md">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-3 text-white/40"
          />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-base border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      )}

      {/* Repos Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-white/20 border-t-white"></div>
          <p className="text-white/60 mt-4">Loading repositories...</p>
        </div>
      ) : repos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
            <GithubLogo size={40} className="text-white/40" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            No repositories connected
          </h2>
          <p className="text-white/60 mb-6">
            Connect a repository to start generating documentation automatically
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
          >
            <Plus size={20} weight="bold" />
            Connect Your First Repository
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-base border border-white/10 hover:border-white/20 rounded-3xl p-6 overflow-hidden transition-all hover:shadow-xl hover:shadow-black/5"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-white/60">{repo.fullName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {repo.lastProcessedCommit && (
                        <div className="text-xs text-white/60">
                          {repo.lastProcessedSummary || "Docs updated"}
                        </div>
                      )}
                      <div
                        className={`w-3 h-3 rounded-full ${
                          repo.isActive ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <GitBranch size={16} className="text-white/50" />
                    <span>{repo.defaultBranch}</span>
                  </div>
                  {repo.language && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <FireSimple size={16} className="text-white/50" />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  {repo.lastProcessedAt && (
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <ClockClockwise size={16} className="text-white/50" />
                      <span>
                        {new Date(repo.lastProcessedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      repo.isActive
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {repo.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Link href={`/app/repos/${repo._id}`} className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors cursor-pointer"
                    >
                      <span>View</span>
                      {/* <CaretRight size={16} /> */}
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDisconnect(repo._id, repo.name)}
                    disabled={disconnecting === repo._id}
                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 font-medium rounded-full transition-colors cursor-pointer disabled:opacity-50 text-sm"
                  >
                    {disconnecting === repo._id ? "..." : "Disconnect"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Connect Repo Modal */}
      <ConnectRepoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
