"use client";
import { motion } from "framer-motion";
import {
  ClockCounterClockwiseIcon,
  CoinsIcon,
  GitCommitIcon,
} from "@phosphor-icons/react";
import React from "react";

const RepoCard = () => {
  return (
    <div className="h-72 w-80 flex flex-col justify-between rounded-3xl bg-base p-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-medium">zentra-api</h3>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 items-center">
            <GitCommitIcon className="size-5 text-white" />
            <p className="text-sm">24 commits</p>
          </div>
          <div className="flex gap-2 items-center">
            <ClockCounterClockwiseIcon className="size-5 text-white" />
            <p className="text-sm">17 edits made</p>
          </div>
          <div className="flex gap-2 items-center">
            <CoinsIcon className="size-5 text-white" />
            <p className="text-sm">134 credits used</p>
          </div>
        </div>
        <p className="text-white/50 font-light text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
          dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05, y: -1 }}
        className="bg-white cursor-pointer text-base rounded-full w-full p-3 font-semibold"
      >
        View Project
      </motion.button>
    </div>
  );
};

export default RepoCard;
