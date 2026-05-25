import React from "react";
import { Cpu } from "lucide-react";

export const RunnerPanel = ({ runners }) => {
  const totalJobs = runners.reduce((a, r) => a + r.jobs, 0);
  const onlineRunners = runners.filter((r) => r.status !== "offline").length;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[18px] font-black text-gray-900 tracking-tight">
            Node Topology
          </h2>
          <p className="text-[13px] text-gray-400 mt-1 font-medium">
            {runners.length > 0 ? `${onlineRunners}/${runners.length} Nodes Active · ${totalJobs} Active Tasks` : "No computing nodes detected"}
          </p>
        </div>
        {runners.length > 0 && (
          <span
            className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase border ${totalJobs >= 8
              ? "bg-rose-50 text-rose-700 border-rose-100"
              : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}
          >
            {totalJobs >= 8 ? "Peak Saturation" : "Optimal Load"}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-6">
        {runners.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 border border-gray-100/50">
              <Cpu size={32} />
            </div>
            <p className="text-[15px] font-black text-gray-900 tracking-tight">Zero Infrastructure Nodes</p>
            <p className="text-[13px] text-gray-400 mt-1 leading-relaxed max-w-[280px]">
              Connect your self-hosted runners or GitHub agents to see compute telemetry.
            </p>
          </div>
        ) : (
          runners.map((r) => (
            <div key={r.name} className="flex flex-col gap-2 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${r.status === "offline" ? "bg-gray-300" : r.pct > 80 ? "bg-rose-500" : "bg-emerald-500"
                      }`}
                  />
                  <p className="text-[14px] font-black text-gray-700 group-hover:text-gray-900 transition-colors tracking-tight truncate w-32">
                    {r.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-black text-gray-400 font-mono">
                    {r.jobs} WORKERS
                  </p>
                  <p className={`text-[12px] font-black font-mono w-8 text-right ${r.pct > 80 ? "text-rose-600" : "text-gray-900"}`}>
                    {r.pct}%
                  </p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${r.status === "offline"
                    ? "bg-gray-200"
                    : r.pct > 80
                      ? "bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.4)]"
                      : r.pct > 50
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                        : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    }`}
                  style={{ width: `${r.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
