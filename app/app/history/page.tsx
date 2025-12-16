"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Warning,
  Clock,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { jobsApi } from "@/lib/api-client";

interface Job {
  _id: string;
  jobType: string;
  status: "pending" | "processing" | "completed" | "failed";
  repoId?: string;
  repoName?: string;
  createdAt: string;
  completedAt?: string;
  output?: Record<string, unknown>;
  error?: string;
}

export default function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "completed" | "failed" | "processing"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.list({
        status: filter === "all" ? undefined : filter,
        limit: 100,
      });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.repoName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatJobType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold text-white mb-2">History</h1>
        <p className="text-white/60">Track all documentation generation jobs</p>
      </motion.div>

      {/* Controls */}
      <div className="bg-base border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 relative max-w-md">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-3 text-white/40"
            />
            <input
              type="text"
              placeholder="Search by repo name or job type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {["all", "completed", "processing", "failed"].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilter(
                    status as "all" | "completed" | "failed" | "processing"
                  )
                }
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-white/20 border-t-white"></div>
          <p className="text-white/60 mt-4">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base border border-white/10 rounded-2xl"
        >
          <Clock size={48} className="mx-auto mb-4 text-white/30" />
          <p className="text-white mb-2">No jobs found</p>
          <p className="text-white/60">
            {filter === "all"
              ? "Get started by connecting a repository"
              : `No ${filter} jobs yet`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-base border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(job.status)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white">
                      {formatJobType(job.jobType)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${getStatusBadge(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/60">
                    {job.repoName || "Unknown repo"} •{" "}
                    {formatDate(job.createdAt)}
                  </p>
                </div>

                {job.error && (
                  <div className="text-right">
                    <p className="text-xs text-red-400">{job.error}</p>
                  </div>
                )}
                {job.output && "filesWritten" in job.output && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {String(
                        (job.output as Record<string, unknown>).filesWritten
                      )}
                    </p>
                    <p className="text-xs text-white/60">files updated</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
