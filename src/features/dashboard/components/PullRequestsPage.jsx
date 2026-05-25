import React, { useState } from "react";
import { GitPullRequest, GitBranch, MessageSquare, Check, X, ShieldAlert, FileCode, CheckCircle2, RotateCw } from "lucide-react";

export function PullRequestsPage({ onToast }) {
  const [prs, setPrs] = useState([
    { id: "PR-201", title: "feat: redesign chat modal user flow", repo: "cloudlens-client-v1.0", author: "saugatshahi", source: "feature/chat-modal", target: "main", checks: "passing", comments: 3, fileChanges: 12, additions: 240, deletions: 45, status: "open" },
    { id: "PR-202", title: "fix: resolve memory leak in worker scheduler", repo: "cloudlens-core-service", author: "john_dev", source: "bugfix/worker-leak", target: "main", checks: "passing", comments: 0, fileChanges: 2, additions: 18, deletions: 4, status: "open" },
    { id: "PR-203", title: "infra: configure load balancer autoscaler rule", repo: "cloudlens-k8s-operator", author: "jane_ops", source: "infra/autoscaler", target: "main", checks: "warning", comments: 5, fileChanges: 1, additions: 7, deletions: 1, status: "open" }
  ]);

  const [selectedPr, setSelectedPr] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeStep, setMergeStep] = useState(0); // 0 = default, 1 = merging, 2 = success

  const openPrDetails = (pr) => {
    setSelectedPr(pr);
    setMergeStep(0);
  };

  const executeMerge = () => {
    if (!selectedPr) return;
    setMergeStep(1);
    setIsMerging(true);
    
    // Simulate merge stages
    setTimeout(() => {
      // Step 2: Merge complete
      setMergeStep(2);
      setIsMerging(false);
      onToast(`Pull Request ${selectedPr.id} merged successfully!`);
      
      // Update PR state list (remove from open)
      setTimeout(() => {
        setPrs(prs.filter(p => p.id !== selectedPr.id));
        setSelectedPr(null);
        setMergeStep(0);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">
      <div>
        <h2 className="text-[20px] font-black text-gray-900 tracking-tight">Pull Requests & Code Reviews</h2>
        <p className="text-[13px] text-gray-400 font-medium">Review code changes, inspect integration checks, and merge pull requests safely.</p>
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* Open PRs Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
          <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tight pb-2 border-b border-gray-50">
            Open Reviews ({prs.length})
          </h3>

          {prs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400">
              <CheckCircle2 size={36} className="text-emerald-500 mb-2 stroke-1" />
              <p className="text-[12px] font-black uppercase tracking-wider text-gray-800">All PRs merged!</p>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">Nothing pending code review.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {prs.map((pr) => (
                <div 
                  key={pr.id}
                  onClick={() => openPrDetails(pr)}
                  className={`p-4 rounded-xl border transition-all text-left cursor-pointer flex flex-col gap-2 ${selectedPr?.id === pr.id ? "bg-blue-50/30 border-[#0061AA]" : "bg-white border-gray-100 hover:border-gray-250"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{pr.id}</span>
                      <span className="text-gray-300 text-[10px]">•</span>
                      <span className="text-[11px] font-bold text-gray-400">by @{pr.author}</span>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${pr.checks === "passing" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                      {pr.checks === "passing" ? (
                        <>✔ Checks Passing</>
                      ) : (
                        <>⚠ Warning Checks</>
                      )}
                    </span>
                  </div>

                  <h4 className="text-[14px] font-black text-gray-800 leading-snug tracking-tight hover:text-[#0061AA] transition-colors">
                    {pr.title}
                  </h4>

                  <div className="flex justify-between items-center mt-1 text-[11px] font-bold text-gray-400">
                    <span className="flex items-center gap-1"><GitBranch size={13} /> {pr.source} → {pr.target}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {pr.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PR Review Sandbox / Detail Drawer */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 min-h-[400px]">
          {!selectedPr ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <GitPullRequest size={36} className="text-gray-300 stroke-1 mb-2" />
              <p className="text-[12px] font-black uppercase tracking-wider text-gray-800">Select a Pull Request</p>
              <p className="text-[11px] font-bold text-gray-400 mt-1 max-w-[200px]">Click any item from the left feed to perform code audits and execute merges.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              {/* Card Header details */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                <div>
                  <span className="text-[11px] font-black text-[#0061AA] uppercase tracking-widest">{selectedPr.id} Details</span>
                  <h3 className="text-[15px] font-black text-gray-900 tracking-tight leading-snug mt-0.5">{selectedPr.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedPr(null)}
                  className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Code Changes visual statistics */}
              <div className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-[#0061AA]" />
                  <span className="text-[12px] font-bold text-gray-700">{selectedPr.fileChanges} files changed</span>
                </div>
                <div className="flex gap-1.5 text-[11px] font-black">
                  <span className="text-emerald-600 font-extrabold">+{selectedPr.additions}</span>
                  <span className="text-rose-600 font-extrabold">-{selectedPr.deletions}</span>
                </div>
              </div>

              {/* Mock Diff container */}
              <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-900 text-[11px] font-mono text-gray-300 h-44 overflow-y-auto">
                <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 text-gray-400 font-black shrink-0 flex items-center justify-between">
                  <span>diff --git a/src/features/chat/ChatModal.jsx</span>
                  <span className="text-[9px] uppercase bg-[#0061AA] text-white px-1.5 py-0.25 rounded">Unified Diff</span>
                </div>
                <div className="p-3 leading-relaxed flex-1 select-text">
                  <div className="text-gray-500">@@ -15,10 +15,12 @@</div>
                  <div className="bg-rose-950/40 text-rose-300 px-1">-  const [isOpen, setIsOpen] = useState(false);</div>
                  <div className="bg-rose-950/40 text-rose-300 px-1">-  return &lt;div className="modal"&gt;Basic template&lt;/div&gt;;</div>
                  <div className="bg-emerald-950/40 text-emerald-300 px-1">+  const [isOpen, setIsOpen] = useState(true);</div>
                  <div className="bg-emerald-950/40 text-emerald-300 px-1">+  const [activeTab, setActiveTab] = useState("general");</div>
                  <div className="bg-emerald-950/40 text-emerald-300 px-1">+  return (</div>
                  <div className="bg-emerald-950/40 text-emerald-300 px-1">+    &lt;div className="bg-white rounded-2xl shadow-xl p-6"&gt;Premium design&lt;/div&gt;</div>
                  <div className="bg-emerald-950/40 text-emerald-300 px-1">+  );</div>
                </div>
              </div>

              {/* Security check log warnings */}
              {selectedPr.checks !== "passing" && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                  <ShieldAlert size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium text-amber-700 leading-normal">
                    SonarQube scan raised 2 alerts regarding potential memory leak references on worker scheduler dependencies. Review carefully before merging.
                  </p>
                </div>
              )}

              {/* Merging steps controls */}
              <div className="mt-2">
                {mergeStep === 0 && (
                  <button 
                    onClick={executeMerge}
                    className="w-full py-3 bg-[#0061AA] hover:bg-blue-700 text-white rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:scale-102 shadow-md active:scale-98"
                  >
                    Approve & Merge Pull Request
                  </button>
                )}

                {mergeStep === 1 && (
                  <div className="w-full py-3 bg-blue-50 text-[#0061AA] border border-blue-100 rounded-xl text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2.5">
                    <RotateCw size={14} className="animate-spin" />
                    <span>Executing safe-merge workflow...</span>
                  </div>
                )}

                {mergeStep === 2 && (
                  <div className="w-full py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 animate-in zoom-in-95 duration-200">
                    <Check size={14} strokeWidth={3} />
                    <span>Branch Merged Successfully!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
