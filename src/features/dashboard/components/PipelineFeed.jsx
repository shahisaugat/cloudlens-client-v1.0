import React, { useState } from "react";
import {
  Search,
  X,
  ChevronRight,
  Filter,
  GitPullRequest,
  Clock,
  GitCommit,
  AlertTriangle,
  ExternalLink,
  Hash,
  Terminal,
  Archive,
  Play,
  ArrowRight,
  Activity,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const STATUS_MAP = {
  running: {
    dot: "bg-[#185FA5] ring-2 ring-[#B5D4F4]",
    pill: "bg-[#E6F1FB] text-[#185FA5]",
    label: "Running",
  },
  success: {
    dot: "bg-[#639922]",
    pill: "bg-[#EAF3DE] text-[#3B6D11]",
    label: "Passed",
  },
  failed: {
    dot: "bg-[#E24B4A]",
    pill: "bg-[#FCEBEB] text-[#A32D2D]",
    label: "Failed",
  },
  queued: {
    dot: "bg-[#EF9F27]",
    pill: "bg-[#FAEEDA] text-[#854F0B]",
    label: "Queued",
  },
};

const STAGE_COLORS = {
  success: "bg-[#639922]",
  failed: "bg-[#E24B4A]",
  running: "bg-[#378ADD] animate-pulse",
  pending: "bg-gray-200",
  skipped: "bg-gray-100",
};

const STAGE_TEXT = {
  success: "text-[#3B6D11]",
  failed: "text-[#A32D2D]",
  running: "text-[#185FA5]",
  pending: "text-gray-400",
  skipped: "text-gray-300",
};

function fmtDuration(s) {
  if (s == null) return "—";
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function TriggerIcon({ type }) {
  const ICON_SIZE = 12;
  if (type === "pull_request")
    return <GitPullRequest size={ICON_SIZE} className="text-blue-500" />;
  if (type === "schedule")
    return <Clock size={ICON_SIZE} className="text-purple-500" />;
  if (type === "workflow_dispatch")
    return <Play size={ICON_SIZE} className="text-orange-500" />;
  return <GitCommit size={ICON_SIZE} className="text-gray-400 dark:text-gray-500" />;
}

function SparkHistory({ runs }) {
  return (
    <div className="flex items-center gap-[3px]" title="Last 10 runs">
      {runs.map((v, i) => (
        <div
          key={i}
          className={`w-[5px] h-[5px] rounded-full ${v ? "bg-[#639922]" : "bg-[#E24B4A]"}`}
        />
      ))}
    </div>
  );
}

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetPipelineDetailsQuery, useGetJobLogsQuery, useRerunPipelineMutation } from "../../../store/api/githubApi";

function RetriggerButton({ owner, repo, runId, onTriggered }) {
  const [rerunPipeline, { isLoading }] = useRerunPipelineMutation();
  const [done, setDone] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    try {
      await rerunPipeline({ owner, repo, runId }).unwrap();
      setDone(true);
      onTriggered?.();
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("Failed to rerun:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || done}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[14px] font-semibold transition-all ${done
        ? "bg-[#EAF3DE] text-[#3B6D11] border border-[#C0DD97]"
        : isLoading
          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
          : "bg-[#0061AA] text-white border border-[#0061AA] hover:bg-[#004d8a]"
        }`}
    >
      <Play size={11} className={isLoading ? "animate-spin" : ""} />
      {done ? "Triggered!" : isLoading ? "Queuing…" : "Re-trigger"}
    </button>
  );
}

function LogViewer({ owner, repo, jobId }) {
  const { data: logs, isLoading, error } = useGetJobLogsQuery(
    jobId ? { owner, repo, jobId } : skipToken
  );

  if (isLoading) return <p className="text-gray-500 italic p-4">Loading logs from GitHub...</p>;
  if (error) return <p className="text-red-400 p-4 font-mono text-xs overflow-auto max-h-32">Failed to load logs. {JSON.stringify(error)}</p>;
  if (!logs) return <p className="text-gray-500 p-4">No log data available.</p>;

  const lines = logs.split("\n").slice(-100);

  return (
    <div className="bg-[#1a1d23] rounded-lg p-3 font-mono text-[12px] leading-relaxed overflow-y-auto max-h-[400px] text-gray-300 shadow-inner">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-all border-l border-gray-800 pl-3 mb-0.5 hover:bg-gray-800/30 dark:hover:bg-gray-100/30 transition-colors">
          <span className="text-gray-600 mr-2 select-none inline-block w-6 text-right">{i + 1}</span>
          {line}
        </div>
      ))}
      <div className="animate-pulse inline-block w-2 h-4 bg-blue-500 ml-1" />
    </div>
  );
}

function StageBreakdown({ pipeline, onClose, onToast }) {
  const { data: details, isLoading } = useGetPipelineDetailsQuery(
    pipeline.id ? { owner: pipeline.owner, repo: pipeline.repoName, runId: pipeline.id } : skipToken
  );

  const [activeJobId, setActiveJobId] = useState(null);
  const stages = details?.stages || pipeline.stages || [];
  const maxDur = Math.max(...stages.map((s) => s.duration ?? 0), 60);
  const failedStage = stages.find((s) => s.status === "failed");

  React.useEffect(() => {
    if (failedStage && failedStage.id && !activeJobId) {
      setActiveJobId(failedStage.id);
    }
  }, [failedStage]);

  return (
    <div className="bg-gray-50/50 dark:bg-[#111827] border-t border-gray-100 p-6">
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#0061AA] opacity-20 animate-ping" />
            <div className="absolute -inset-4 rounded-full border border-blue-100/50 animate-[spin_3s_linear_infinite]" />
            <div className="relative w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-xl shadow-blue-500/5">
              <FaGithub size={28} className="text-[#0061AA] animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[15px] text-gray-900 font-bold tracking-tight">Syncing Pipeline Engine</p>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1.5">
              Fetching real-time telemetry 
              <span className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" />
              </span>
            </p>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-600 font-bold uppercase tracking-widest text-[11px]">
              <Activity size={12} />
              <span>Workflow Execution Graph</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            {stages.map((stage) => {
              const pct = stage.duration ? Math.round((stage.duration / maxDur) * 100) : 0;
              const isActive = activeJobId === stage.id;

              return (
                <div key={stage.id || stage.name} className="flex flex-col">
                  <div
                    className={`flex items-center gap-4 p-2.5 rounded-xl transition-all cursor-pointer ${isActive ? "bg-white dark:bg-[#1E293B] shadow-sm ring-1 ring-black/5 dark:ring-white/5" : "hover:bg-gray-200/30 dark:hover:bg-[#1E293B]/50"}`}
                    onClick={(e) => { e.stopPropagation(); setActiveJobId(isActive ? null : stage.id); }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${STAGE_COLORS[stage.status]}`} />
                    <p className={`text-[13px] w-24 shrink-0 font-bold ${STAGE_TEXT[stage.status]}`}>
                      {stage.name}
                    </p>
                    <div className="flex-1 h-1.5 bg-gray-200/50 dark:bg-[#334155] rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${STAGE_COLORS[stage.status]} transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 w-12 text-right shrink-0 font-black font-mono">
                      {fmtDuration(stage.duration)}
                    </p>
                    <Terminal size={14} className={isActive ? "text-blue-500" : "text-gray-300"} />
                  </div>

                  {isActive && stage.id && (
                    <div className="mt-2 mb-4 ml-5 border-l-2 border-blue-100 pl-5 animate-in zoom-in-95 duration-200">
                      <LogViewer
                        owner={pipeline.owner}
                        repo={pipeline.repoName}
                        jobId={stage.id}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="flex gap-3 flex-wrap border-t border-gray-200/50 pt-5 items-center justify-end">
          <RetriggerButton
            owner={pipeline.owner}
            repo={pipeline.repoName}
            runId={pipeline.id}
            onTriggered={() => onToast?.("Pipeline re-queued")}
          />
          <a
            href={`https://github.com/${pipeline.owner}/${pipeline.repoName}/actions/runs/${pipeline.id}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-[14px] font-bold text-gray-600 hover:bg-gray-100/50 transition-all"
          >
            <Archive size={14} /> Artifacts
          </a>
        <a
          href={`https://github.com/${pipeline.owner}/${pipeline.repoName}/actions/runs/${pipeline.id}`}
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 text-white dark:text-gray-100 text-[14px] font-bold hover:bg-black dark:hover:bg-gray-800 transition-all"
        >
          <ExternalLink size={14} /> GitHub Run
        </a>
      </div>
    </div>
  );
}

function PipelineCard({ p, isSelected, onClick, onToast }) {
  const s = STATUS_MAP[p.status];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isSelected
        ? "border-blue-300 bg-white"
        : "border-gray-100 hover:border-gray-200 bg-white"
        } shadow-sm`}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${isSelected ? "bg-blue-50/30 dark:bg-[#0c1e36]" : "hover:bg-gray-50/50 dark:hover:bg-[#111827]"
          }`}
      >
        {/* Left: Status & Actor */}
        <div className="relative shrink-0">
          <img
            src={p.actorAvatar}
            alt={p.owner}
            className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700"
            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${p.owner}&background=random`}
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-700 ${s.dot}`} />
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[16px] font-bold text-gray-900 truncate">
              {p.name}
            </h3>
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-gray-50 rounded-md border border-gray-100">
              <Hash size={10} className="text-gray-400 dark:text-gray-500" />
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-600 uppercase tracking-tighter">{p.sha}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-[13px] font-medium">
            <div className="flex items-center gap-1.5">
              <TriggerIcon type={p.triggeredBy} />
              <span className="font-bold text-gray-700 dark:text-gray-800">{p.owner}</span>
              <span className="text-gray-400 dark:text-gray-500">·</span>
              <span className="capitalize text-gray-500 dark:text-gray-600">{p.triggeredBy?.replace('_', ' ')}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500">·</span>
            <span className="truncate text-gray-500 dark:text-gray-600">{p.branch}</span>
            <span className="text-gray-400 dark:text-gray-500">·</span>
            <span className="shrink-0 text-gray-500 dark:text-gray-600">{p.time}</span>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-6 shrink-0">
          <SparkHistory runs={p.spark} />
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-[12px] font-bold px-3 py-1 rounded-full border border-white/50 ${s.pill}`}
            >
              {s.label}
            </span>
            <p className="text-[12px] font-bold text-gray-400 dark:text-gray-600 font-mono tracking-tighter">
              {p.duration}
            </p>
          </div>
        </div>
      </button>

      {isSelected && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <StageBreakdown
            pipeline={p}
            onClose={() => onClick()}
            onToast={onToast}
          />
        </div>
      )}
    </div>
  );
}

const STATUS_FILTERS = ["All", "Running", "Failed", "Queued", "Passed"];

export const PipelineFeed = ({ pipelines, onToast, selectedSha, onSelect }) => {
  const [internalSelected, setInternalSelected] = useState(null);
  const selected = selectedSha || internalSelected;
  const setSelected = onSelect || setInternalSelected;
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = pipelines.filter((p) => {
    const matchStatus =
      filter === "All" ||
      (filter === "Running" && p.status === "running") ||
      (filter === "Failed" && p.status === "failed") ||
      (filter === "Queued" && p.status === "queued") ||
      (filter === "Passed" && p.status === "success");
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.branch.toLowerCase().includes(search.toLowerCase()) ||
      p.commitMsg.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[20px] font-black text-gray-900 tracking-tight">
              System Activity
            </h2>
            <p className="text-[14px] text-gray-400 dark:text-gray-500 mt-1 font-bold uppercase tracking-tighter">
              Real-time CI/CD telemetry
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/60 rounded-2xl px-5 py-3.5 flex-1 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-400 transition-all">
            <Search size={18} className="text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Filter by commit, branch, or workflow..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[15px] text-gray-700 placeholder-gray-400 w-full font-bold tracking-tight"
            />
          </div>
          <div className="flex gap-1.5 p-1.5 bg-gray-50/80 dark:bg-[#111827] rounded-2xl border border-gray-200/50">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[14px] font-bold transition-all ${filter === f
                  ? "bg-white text-[#0061AA] dark:text-blue-400 shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-700"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Filter size={40} className="mx-auto mb-4 text-gray-300 opacity-50" />
              <p className="text-[18px] font-black text-gray-500 tracking-tight">Zero Results</p>
              <p className="text-[14px] text-gray-400 mt-1 font-medium italic">Adjust your active telemetry filters</p>
            </div>
          )}
          {filtered.map((p) => (
            <PipelineCard
              key={p.id}
              p={p}
              isSelected={selected === p.sha}
              onClick={() => setSelected(selected === p.sha ? null : p.sha)}
              onToast={onToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
