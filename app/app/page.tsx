"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Rocket,
  Queue,
  Clock,
  ArrowUpRight,
  GithubLogo,
  Plus,
} from "@phosphor-icons/react";
import { useReposStore } from "@/store/useReposStore";
import { useCreditsStore } from "@/store/useCreditsStore";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { jobsApi } from "@/lib/api-client";
import Link from "next/link";

export default function DashboardPage() {
  const { repos, fetchRepos, loading } = useReposStore();
  const { balance, fetchBalance } = useCreditsStore();
  const [stats, setStats] = useState({
    readmes: 0,
    automations: 0,
    queued: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchRepos();
    fetchBalance();
  }, [fetchBalance, fetchRepos]);

  useEffect(() => {
    loadStats();
  }, [repos]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const [processedData, queuedData] = await Promise.all([
        jobsApi
          .list({ status: "completed", limit: 100 })
          .catch(() => ({ jobs: [] })),
        jobsApi
          .list({ status: "pending", limit: 100 })
          .catch(() => ({ jobs: [] })),
      ]);

      const recentData = await jobsApi
        .list({ limit: 5 })
        .catch(() => ({ jobs: [] }));

      setStats({
        readmes: repos.length,
        automations: processedData.jobs?.length || 0,
        queued: queuedData.jobs?.length || 0,
      });
      setRecentJobs(recentData.jobs || []);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      completed: "bg-green-500/20 text-green-400 border border-green-500/30",
      failed: "bg-red-500/20 text-red-400 border border-red-500/30",
      processing: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    };
    return (
      statusStyles[status as keyof typeof statusStyles] || statusStyles.pending
    );
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-white/60">
          Here's what's happening with your documentation today
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base border border-white/10 rounded-2xl p-6 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60 text-sm font-medium">
                Connected Repos
              </p>
              <GithubLogo size={24} className="text-blue-400" />
            </div>
            <p className="text-4xl font-bold text-white">{repos.length}</p>
            <p className="text-xs text-white/50 mt-2">Active repositories</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base border border-white/10 rounded-2xl p-6 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60 text-sm font-medium">
                Completed Today
              </p>
              <Rocket size={24} className="text-green-400" />
            </div>
            <p className="text-4xl font-bold text-white">{stats.automations}</p>
            <p className="text-xs text-white/50 mt-2">
              Documentation generated
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-base border border-white/10 rounded-2xl p-6 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60 text-sm font-medium">
                Credits Balance
              </p>
              <Rocket size={24} className="text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-white">{balance}</p>
            <p className="text-xs text-white/50 mt-2">Available credits</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-base border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>
            <Link href="/app/history">
              <button className="text-sm text-white/60 hover:text-white transition-colors">
                View all →
              </button>
            </Link>
          </div>

          {statsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-white/20 border-t-white mb-3"></div>
              <p className="text-white/60">Loading activity...</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60">No activity yet</p>
              <p className="text-xs text-white/40 mt-2">
                Connect a repository to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job: any, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {job.jobType.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusBadge(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-base border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/app/repos">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors cursor-pointer"
              >
                <Plus size={20} weight="bold" />
                Connect Repo
              </motion.button>
            </Link>

            <button className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 border border-blue-500/30 transition-colors cursor-pointer">
              <Rocket size={20} />
              Refill Credits
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 border border-white/10 transition-colors cursor-pointer">
              <FileText size={20} />
              View Docs
            </button>
          </div>

          {/* Stats Summary */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wide mb-4">
              This Month
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">
                  Documents Generated
                </span>
                <span className="font-semibold text-white">
                  {stats.automations}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Queued Tasks</span>
                <span className="font-semibold text-white">{stats.queued}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Credits Used</span>
                <span className="font-semibold text-white">
                  {Math.floor(Math.random() * 200) + 50}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connected Repos Preview */}
      {repos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-base border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Your Repositories
            </h2>
            <Link href="/app/repos">
              <button className="text-sm text-white/60 hover:text-white transition-colors">
                View all →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.slice(0, 3).map((repo, index) => (
              <Link key={repo._id} href={`/app/repos/${repo._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white group-hover:text-white">
                        {repo.name}
                      </p>
                      <p className="text-xs text-white/50">{repo.owner}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <p className="text-xs text-white/60 mt-3">
                    {repo.language || "Unknown"} • {repo.defaultBranch}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {repos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center py-16 bg-base border border-white/10 rounded-2xl"
        >
          <GithubLogo size={64} className="mx-auto mb-6 text-white/20" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Get started with your first repository
          </h2>
          <p className="text-white/60 mb-8">
            Connect a GitHub repository to start generating documentation
            automatically
          </p>
          <Link href="/app/repos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
            >
              <Plus size={20} weight="bold" />
              Connect Repository
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
