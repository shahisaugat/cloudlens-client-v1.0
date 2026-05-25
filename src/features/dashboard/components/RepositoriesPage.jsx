import React from "react";
import { GitBranch, GitFork, RefreshCw, Terminal, Plus } from "lucide-react";

export function RepositoriesPage({ onToast }) {
  const reposData = [
    { name: "cloudlens-client-v1.0", desc: "React frontend client powered by Vite and TailwindCSS for real-time telemetry metrics.", branches: 5, commits: 142, status: "Active", link: "github.com/cloudlens/client", sha: "e6f49a2", msg: "Refactor workspace navigation panel" },
    { name: "cloudlens-core-service", desc: "Spring Boot orchestration service that parses telemetry payloads and maps active run logs.", branches: 3, commits: 88, status: "Active", link: "github.com/cloudlens/core", sha: "7a83d1c", msg: "Optimize telemetry indexing queries" },
    { name: "cloudlens-k8s-operator", desc: "Kubernetes orchestration controller for managing staging and production cluster deployment pools.", branches: 2, commits: 34, status: "Staging Only", link: "github.com/cloudlens/operator", sha: "d8c114f", msg: "Update autoscaler replica min-bounds" }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[20px] font-black text-gray-900 tracking-tight">Codebases & Repositories</h2>
          <p className="text-[13px] text-gray-400 font-medium">Browse connected git sources and track branch activities.</p>
        </div>
        <button 
          onClick={() => onToast("Repository connection wizard")}
          className="px-4 py-2.5 bg-[#0061AA] hover:bg-blue-700 text-white rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-sm"
        >
          <Plus size={14} /> Connect Repository
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reposData.map((repo, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 p-6 shadow-sm flex flex-col gap-4 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-[16px] font-black text-gray-900 group-hover:text-[#0061AA] transition-colors">{repo.name}</h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${repo.status === "Active" ? "bg-blue-50 text-[#0061AA] border-blue-100" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {repo.status}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 mt-1 font-medium max-w-2xl">{repo.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{repo.link}</p>
                <div className="flex items-center gap-4 mt-2 justify-end text-[12px] font-bold text-gray-500">
                  <span className="flex items-center gap-1"><GitFork size={13} /> {repo.branches} Branches</span>
                  <span className="flex items-center gap-1"><RefreshCw size={13} /> {repo.commits} Commits</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-50" />

            <div className="bg-gray-50/50 rounded-xl p-3.5 flex items-center justify-between border border-gray-100/50">
              <div className="flex items-center gap-3 min-w-0">
                <Terminal size={14} className="text-gray-400 shrink-0" />
                <span className="text-[11px] font-black px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-md shrink-0">{repo.sha}</span>
                <p className="text-[12px] font-bold text-gray-600 truncate">{repo.msg}</p>
              </div>
              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">by @saugatshahi · 3m ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
