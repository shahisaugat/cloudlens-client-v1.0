import React from "react";
import { Users, TrendingUp } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const TeamVelocity = ({ team = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[17px] font-black text-gray-900 tracking-tight">Team velocity</h2>
          <p className="text-[14px] text-gray-400 mt-0.5 font-medium">
            Pass rate + MTTR per engineer
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0061AA]">
          <TrendingUp size={18} />
        </div>
      </div>

      <div className={`flex-1 flex flex-col divide-y divide-gray-50 ${team.length === 0 ? 'justify-center' : ''}`}>
        {team.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No activity"
            description="Engineer metrics will appear here once pipelines start running."
            className="py-4"
          />
        ) : (
          team.map((m) => {
            const mttrValue = parseInt(m.mttr) || 0;
            const mttrColor = mttrValue < 15 
              ? "bg-[#EAF3DE] text-[#3B6D11]" 
              : mttrValue < 30 
                ? "bg-[#FAEEDA] text-[#854F0B]" 
                : "bg-[#FCEBEB] text-[#A32D2D]";

            return (
              <div
                key={m.initials}
                className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0 shadow-sm"
                  style={{ background: m.color || "#0061AA" }}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-[15px] font-bold text-gray-900 tracking-tight truncate">
                      {m.name}
                    </p>
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${mttrColor}`}>
                      MTTR {m.mttr}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${m.pass}%`, 
                          background: m.bar || "#639922" 
                        }}
                      />
                    </div>
                    <span className="text-[12px] font-black text-gray-400 w-12 text-right">
                      {m.pass}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex justify-center">
        <button className="text-[14px] text-[#0061AA] font-black hover:underline flex items-center gap-2">
          Team Reports →
        </button>
      </div>
    </div>
  );
};
