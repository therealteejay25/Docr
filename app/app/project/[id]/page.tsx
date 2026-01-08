"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GitCommit,
  ClockClockwise,
  Stack,
  CaretDown,
  FileText,
  ArrowLeft,
  CheckCircle,
  Warning,
} from "@phosphor-icons/react";
import { useReposStore } from "@/store/useReposStore";
import { useCreditsStore } from "@/store/useCreditsStore";
import { jobsApi } from "@/lib/api-client";
import { reposApi } from "@/lib/api-client";
import Link from "next/link";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "credits", label: "Credits" },
  { id: "history", label: "History" },
];

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchRepos } = useReposStore();
  const { balance, fetchBalance } = useCreditsStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState<any[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [repo, setRepo] = useState<any | null>(null);

  useEffect(() => {
    // Fetch repo details and balance
    (async () => {
      fetchRepos().catch(() => {});
      fetchBalance().catch(() => {});
      await loadRepo();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (repo) {
      loadJobs();
    }
  }, [repo]);

  // Subscribe to server-sent events for realtime updates
  useEffect(() => {
    if (!repo) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const es = new EventSource(
      `${apiBase}/api/${process.env.NEXT_PUBLIC_API_VERSION || "v1"}/events/${
        repo._id
      }`
    );

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setLiveEvents((prev) => [data, ...prev].slice(0, 50));
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    es.onerror = (err) => {
      console.warn("SSE error", err);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [repo]);

  const loadJobs = async () => {
    if (!repo) return;
    try {
      setLoading(true);
      const data = await jobsApi.list({ repoId: repo._id, limit: 50 });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRepo = async () => {
    try {
      setLoading(true);
      const data = await reposApi.get(params.id as string);
      // backend may return { repo } or the repo directly
      setRepo(data.repo || data);
    } catch (error) {
      console.error("Failed to load repo:", error);
      setRepo(null);
    } finally {
      setLoading(false);
    }
  };

  if (!repo && !loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Repository not found</p>
          <Link href="/app/repos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              Back to Repos
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    commits: jobs.filter((j) => j.jobType === "process_commit").length,
    edits: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  const documentTypes = {
    "README.md": "Main documentation file",
    "CHANGELOG.md": "Version history and changes",
    "API_DOCS.md": "API documentation",
    "ARCHITECTURE.md": "System architecture overview",
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-white/60 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} />
        Back
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              {repo?.name}
            </h1>
            <p className="text-white/60">{repo?.fullName}</p>
          </div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              repo?.isActive
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            }`}
          >
            {repo?.isActive ? "Active" : "Inactive"}
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
              className={`pb-4 px-1 font-medium transition-colors relative ${
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Repository Info
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">
                    Language
                  </p>
                  <p className="text-white font-medium mt-2">
                    {repo?.language || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">
                    Default Branch
                  </p>
                  <p className="text-white font-medium mt-2">
                    {repo?.defaultBranch}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">
                    Repository Size
                  </p>
                  <p className="text-white font-medium mt-2">
                    {repo?.size
                      ? `${(repo.size / 1024).toFixed(2)} MB`
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wide">
                    Last Updated
                  </p>
                  <p className="text-white font-medium mt-2">
                    {repo?.lastProcessedAt
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
            {/* Live Events Feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-base border border-white/10 rounded-2xl p-6 mt-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Live Activity
              </h2>
              {liveEvents.length === 0 ? (
                <p className="text-white/60">No live events</p>
              ) : (
                <div className="space-y-2">
                  {liveEvents.map((ev, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                        <div>
                          <p className="text-white text-sm">{ev.type}</p>
                          <p className="text-xs text-white/50">
                            {ev.summary ||
                              ev.commitSha ||
                              (ev.files && ev.files.join(", "))}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/50">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Recent Activity
              </h2>
              {jobs.length === 0 ? (
                <p className="text-white/60 text-center py-8">
                  No activity yet
                </p>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        {job.status === "completed" && (
                          <CheckCircle
                            size={20}
                            className="text-green-500"
                            weight="fill"
                          />
                        )}
                        {job.status === "failed" && (
                          <Warning
                            size={20}
                            className="text-red-500"
                            weight="fill"
                          />
                        )}
                        {["pending", "processing"].includes(job.status) && (
                          <ClockClockwise size={20} className="text-blue-500" />
                        )}
                        <div>
                          <p className="text-white font-medium capitalize">
                            {job.output?.aiSummary ||
                              job.jobType.replace(/_/g, " ")}
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
                        className={`text-xs px-3 py-1 rounded-full font-medium border ${
                          job.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : job.status === "failed"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
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

        {activeTab === "documents" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">
              Generated Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(documentTypes).map(([name, description]) => (
                <div
                  key={name}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">{name}</p>
                      <p className="text-xs text-white/60 mt-1">
                        {description}
                      </p>
                    </div>
                    <FileText
                      size={20}
                      className="text-blue-400 flex-shrink-0"
                    />
                  </div>
                  <button className="text-xs text-blue-400 hover:text-blue-300 mt-2">
                    View Document →
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "credits" && (
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Update Costs
              </h2>
              <div className="space-y-3">
                {jobs
                  .filter(
                    (j) =>
                      j.jobType === "apply_patch" && j.status === "completed"
                  )
                  .slice(0, 4)
                  .map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-white/50" />
                        <span className="text-sm text-white/70">
                          Updated {job.output?.filesWritten || 0} file(s)
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {(job.output?.filesWritten || 0) * 3} credits
                      </span>
                    </motion.div>
                  ))}
                {jobs.filter(
                  (j) => j.jobType === "apply_patch" && j.status === "completed"
                ).length === 0 && (
                  <p className="text-white/60 text-center py-8">
                    No updates yet
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-base border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Monthly Usage
              </h2>
              <div className="flex items-center justify-center h-48 text-white/50">
                <p className="text-center">
                  <p className="text-3xl font-bold text-white mb-2">
                    {Math.floor(Math.random() * 500) + 50}
                  </p>
                  <p className="text-sm">credits used this month</p>
                </p>
              </div>
            </motion.div>

            <div className="col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-black rounded-lg py-4 font-medium hover:bg-white/90 transition-colors cursor-pointer"
              >
                Refill Credits
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">
              Full Job History
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-white/20 border-t-white mb-3"></div>
                <p className="text-white/60">Loading history...</p>
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-white/60 text-center py-8">No jobs yet</p>
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
                      {job.status === "completed" && (
                        <CheckCircle
                          size={20}
                          className="text-green-500"
                          weight="fill"
                        />
                      )}
                      {job.status === "failed" && (
                        <Warning
                          size={20}
                          className="text-red-500"
                          weight="fill"
                        />
                      )}
                      {["pending", "processing"].includes(job.status) && (
                        <ClockClockwise size={20} className="text-blue-500" />
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-medium capitalize truncate">
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
                    {job.output?.filesWritten && (
                      <div className="mr-3 text-right">
                        <p className="text-sm font-medium text-white">
                          {job.output.filesWritten}
                        </p>
                        <p className="text-xs text-white/60">files</p>
                      </div>
                    )}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border ${
                        job.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : job.status === "failed"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      } whitespace-nowrap`}
                    >
                      {job.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
