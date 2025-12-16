"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  GitCommit,
  Stack,
  CheckCircle,
  Warning,
  Clock,
  ToggleRight,
  ToggleLeft,
  Gear,
} from "@phosphor-icons/react";
import { useReposStore } from "@/store/useReposStore";
import { useCreditsStore } from "@/store/useCreditsStore";
import { jobsApi } from "@/lib/api-client";
import { useParams } from "next/navigation";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "jobs", label: "Jobs", icon: Clock },
  { id: "settings", label: "Settings", icon: Gear },
];

interface Job {
  _id: string;
  jobType: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  output?: Record<string, unknown>;
  error?: string;
}

export default function RepoDetailPage() {
  const params = useParams();
  const repoId = params.id as string;
  const { repos } = useReposStore();
  const { balance } = useCreditsStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [updating, setUpdating] = useState(false);

  const repo = repos.find((r) => r._id === repoId);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobsApi.list({ repoId, limit: 50 });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    if (repoId) {
      loadJobs();
    }
  }, [repoId, loadJobs]);

  const handleAutoUpdateToggle = async () => {
    setUpdating(true);
    try {
      // TODO: Add API call to update repo settings
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAutoUpdate(!autoUpdate);
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !repo) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-white/20 border-t-white mb-4"></div>
          <p className="text-white/60">Loading repository...</p>
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-2">Repository not found</p>
          <p className="text-white/60">
            The repository you&apos;re looking for doesn&apos;t exist
          </p>
        </div>
      </div>
    );
  }

  const stats = {
    commits: jobs.filter((j) => j.jobType === "process_commit").length,
    edits: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle size={20} className="text-green-500" weight="fill" />
        );
      case "failed":
        return <Warning size={20} className="text-red-500" weight="fill" />;
      case "processing":
        return <Clock size={20} className="text-blue-500" weight="fill" />;
      default:
        return <Clock size={20} className="text-yellow-500" />;
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              {repo.name}
            </h1>
            <p className="text-white/60">{repo.fullName}</p>
          </div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              repo.isActive
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            }`}
          >
            {repo.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-base border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Total Commits</p>
              <GitCommit size={20} className="text-white/40" />
            </div>
            <p className="text-2xl font-semibold text-white">{stats.commits}</p>
          </div>
          <div className="bg-base border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Completed Jobs</p>
              <CheckCircle size={20} className="text-green-500" weight="fill" />
            </div>
            <p className="text-2xl font-semibold text-white">{stats.edits}</p>
          </div>
          <div className="bg-base border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Failed Jobs</p>
              <Warning size={20} className="text-red-500" weight="fill" />
            </div>
            <p className="text-2xl font-semibold text-white">{stats.failed}</p>
          </div>
          <div className="bg-base border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">Credits Balance</p>
              <Stack size={20} className="text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-white">{balance}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Last Update & Branch Info */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-base border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Repository Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                      Default Branch
                    </p>
                    <p className="text-white font-medium mt-1">
                      {repo.defaultBranch}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                      Language
                    </p>
                    <p className="text-white font-medium mt-1">
                      {repo.language || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                      Repository Size
                    </p>
                    <p className="text-white font-medium mt-1">
                      {repo.size
                        ? `${(repo.size / 1024).toFixed(2)} MB`
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                      Last Updated
                    </p>
                    <p className="text-white font-medium mt-1">
                      {repo.lastProcessedAt
                        ? new Date(repo.lastProcessedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Never"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Documentation Types */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-base border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Documentation Types
                </h3>
                <div className="space-y-3">
                  {Object.entries(repo.settings.docTypes).map(
                    ([type, enabled]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-white capitalize">
                          {type.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            enabled ? "bg-green-500" : "bg-white/20"
                          }`}
                        />
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </div>

            {/* Recent Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Activity
              </h3>
              {jobs.length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  No jobs yet. Commits to this repository will trigger automated
                  documentation generation.
                </p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getStatusIcon(job.status)}
                        <div className="min-w-0">
                          <p className="text-white font-medium capitalize truncate">
                            {job.jobType.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-white/50">
                            {new Date(job.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusBadge(
                          job.status
                        )} whitespace-nowrap`}
                      >
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeTab === "jobs" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Job History
            </h3>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-white/20 border-t-white mb-4"></div>
                <p className="text-white/60">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto mb-4 text-white/30" />
                <p className="text-white/60">No jobs yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getStatusIcon(job.status)}
                      <div className="min-w-0">
                        <p className="text-white font-medium capitalize">
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
                    {job.error && (
                      <div className="mr-3 text-right">
                        <p className="text-xs text-red-400">{job.error}</p>
                      </div>
                    )}
                    {job.output && "filesWritten" in job.output && (
                      <div className="mr-3 text-right">
                        <p className="text-sm font-medium text-white">
                          {String(
                            (job.output as Record<string, unknown>).filesWritten
                          )}
                        </p>
                        <p className="text-xs text-white/60">files</p>
                      </div>
                    )}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusBadge(
                        job.status
                      )} whitespace-nowrap`}
                    >
                      {job.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Auto Update */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Auto Update Documentation
                  </h3>
                  <p className="text-white/60 mt-1">
                    Automatically generate documentation on commits
                  </p>
                </div>
                <button
                  onClick={handleAutoUpdateToggle}
                  disabled={updating}
                  className="cursor-pointer"
                >
                  {autoUpdate ? (
                    <ToggleRight
                      size={40}
                      className="text-blue-500"
                      weight="fill"
                    />
                  ) : (
                    <ToggleLeft size={40} className="text-white/30" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Documentation Types */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Documentation Types
              </h3>
              <div className="space-y-4">
                {Object.entries(repo.settings.docTypes).map(
                  ([type, enabled]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="text-white font-medium capitalize">
                          {type.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                          {type === "readme" && "README.md generation"}
                          {type === "changelog" && "CHANGELOG.md generation"}
                          {type === "apiDocs" && "API documentation generation"}
                          {type === "architectureDocs" &&
                            "Architecture documentation"}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          enabled ? "bg-green-500" : "bg-white/20"
                        }`}
                      />
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Email Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Email Notifications
                  </h3>
                  <p className="text-white/60 mt-1">
                    Get notified when jobs complete or fail
                  </p>
                </div>
                <button className="cursor-pointer">
                  <ToggleRight
                    size={40}
                    className="text-blue-500"
                    weight="fill"
                  />
                </button>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-red-400 mb-4">
                Danger Zone
              </h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                Disconnect Repository
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
