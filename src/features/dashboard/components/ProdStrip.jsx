import React from "react";
import { ExternalLink } from "lucide-react";

export const ProdStrip = ({ env, envData, repo }) => {
  const d = envData[env];

  const repoUrl = repo ? `https://github.com/${repo.owner}/${repo.name}` : null;
  const compareUrl = repoUrl ? `${repoUrl}/compare/master...${d.commit.sha}` : "#";
  const prUrl = (repoUrl && d.commit.pr && d.commit.pr.startsWith("#"))
    ? `${repoUrl}/pull/${d.commit.pr.substring(1)}`
    : "#";

  return (
    <div className="bg-white backdrop-blur-sm rounded-2xl border border-gray-100 p-5 flex items-center gap-6 flex-wrap shadow-sm group transition-all duration-300">
      <div className="flex-1 min-w-[300px]">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-black">
            {env === "prod"
              ? "Production Instance"
              : env === "staging"
                ? "Staging Head"
                : "Development Head"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={repoUrl ? `${repoUrl}/commit/${d.commit.sha}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-black bg-[#0061AA] text-white px-2.5 py-1 rounded-lg border border-[#0061AA]/20 hover:bg-[#005190] transition-colors"
          >
            {d.commit.sha}
          </a>
          <span className="text-[16px] font-black text-gray-900 truncate tracking-tight">
            {d.commit.msg}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[12px] text-gray-400 font-bold tracking-tight">
            by <span className="text-gray-900 uppercase" >{d.commit.author}</span> · {d.commit.ago} ·{" "}
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-black hover:underline lowercase transition-all"
            >
              {d.commit.pr}
            </a>
          </p>
        </div>
      </div>

      <div className="h-10 w-px bg-gray-100 hidden md:block" />

      <div className="flex items-center gap-8 px-2">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Live Since</p>
          <div className="flex items-center gap-2 text-[14px] font-black text-gray-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            {d.deployedAt}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Diff Delta</p>
          <span className="text-[12px] font-black bg-amber-50 text-amber-700 px-3 py-1 rounded-lg">
            {d.diffFiles} Files changed
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Queue Status</p>
          <span
            className={`text-[12px] font-black px-3 py-1 rounded-lg ${d.queueDepth > 4
              ? "bg-rose-50 text-rose-700"
              : "bg-blue-50 text-[#0061AA]"
              }`}
          >
            {d.queueDepth} Waiting
          </span>
        </div>
      </div>

      <a
        href={compareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto flex items-center gap-1.5 px-8 py-2 text-gray-400 text-[13px] font-bold hover:text-[#0061AA] hover:underline underline-offset-4 transition-all"
      >
        Diff Engine <ExternalLink size={14} />
      </a>
    </div>
  );
};
