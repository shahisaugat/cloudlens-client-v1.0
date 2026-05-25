import React from "react";
import { ShieldCheck } from "lucide-react";

export const AuditLog = ({ auditLog }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex-1 flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">Audit trail</h2>
          <p className="text-[14px] text-gray-400 mt-0.5 font-medium">
            Who did what, and when
          </p>
        </div>
        <button className="text-[14px] text-[#0061AA] font-black hover:underline">
          Full log →
        </button>
      </div>
      <div className="flex-1 flex flex-col divide-y divide-gray-50 min-h-[180px]">
        {auditLog.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-3 border border-gray-100/50">
              <ShieldCheck size={24} />
            </div>
            <p className="text-[14px] font-black text-gray-400">No recent activity</p>
            <p className="text-[12px] text-gray-300 mt-1">System events will appear here</p>
          </div>
        ) : (
          auditLog.slice(0, 4).map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0"
            >
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt={entry.initials}
                  className="w-8 h-8 rounded-lg shrink-0 mt-0.5 object-cover shadow-sm border border-gray-100"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black text-white shrink-0 mt-0.5 shadow-sm`}
                  style={{ background: entry.color }}
                >
                  {entry.initials}
                </div>
              )}
              <div className="flex-1 min-w-0 flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="text-[14px] font-black text-gray-900 tracking-tight leading-tight">
                    {entry.action} <span className="font-medium text-gray-400 ml-1">{entry.target}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 truncate">
                    <span className="text-[12px] font-medium text-gray-400 lowercase">by</span>
                    <span className="text-[14px] font-bold text-[#0061AA] truncate">
                      {entry.user || "System"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0 pt-0.5">
                  <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">
                    {entry.ago || "Just now"}
                  </p>
                  <p className="text-[12px] font-medium text-gray-400 mt-1 whitespace-nowrap">
                    {entry.date}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
