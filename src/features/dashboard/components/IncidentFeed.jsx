import React, { useState } from "react";
import {
  AlertTriangle,
  FlaskConical,
  Package,
  CloudOff,
  Check,
  ShieldCheck,
} from "lucide-react";
import { EmptyState } from "./EmptyState";

export const IncidentFeed = ({ incidents: initialIncidents, onToast, onViewLogs }) => {
  const [incidents, setIncidents] = React.useState(initialIncidents);

  React.useEffect(() => {
    setIncidents(initialIncidents);
  }, [initialIncidents]);
  const ack = (id) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, acked: true } : i)),
    );
    onToast?.("Incident acknowledged");
  };

  const SEV_COLORS = {
    critical: {
      bg: "bg-rose-50",
      icon: "text-rose-600",
      chip: "bg-rose-50 text-rose-700 border-rose-100",
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      chip: "bg-amber-50 text-amber-700 border-amber-100",
    },
  };

  const ICON_MAP = {
    "Test timeout": FlaskConical,
    "Dependency missing": Package,
    "Registry unreachable": CloudOff,
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[18px] font-black text-gray-900 tracking-tight">System Events</h2>
          <p className="text-[14px] text-gray-400 mt-1 font-medium">
            Real-time security & ops telemetry
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-[#EAF3DE] flex items-center">
          <span className="text-[10px] font-black text-[#3B6D11] uppercase tracking-widest">
            {incidents.filter((i) => !i.acked).length} Active
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {incidents.length === 0 ? (
          <EmptyState 
            icon={ShieldCheck}
            title="All systems healthy"
            description="No critical security or infrastructure incidents detected in the last 24 hours."
          />
        ) : (
          incidents.slice(0, 2).map((inc) => {
          const c = SEV_COLORS[inc.severity];
          const Icon = ICON_MAP[inc.title.split("—")[0].trim()] || AlertTriangle;
          return (
            <div
              key={inc.id}
              className={`flex items-start gap-4 p-4 rounded-2xl transition-all border ${inc.acked
                ? "bg-gray-50/50 dark:bg-[#111827] border-gray-100 opacity-60"
                : "bg-white border-gray-100"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white dark:border-gray-700 ${c.bg}`}
              >
                <Icon size={16} className={c.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[15px] font-black text-gray-900 tracking-tight">
                    {inc.title}
                  </p>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${c.chip}`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 font-medium">{inc.detail}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1.5">
                    {inc.avatar ? (
                      <img src={inc.avatar} alt={inc.owner} className="w-5 h-5 rounded-lg border border-white/20 object-cover" />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black text-white border border-white/20"
                        style={{ background: inc.ownerColor }}
                      >
                        {inc.owner}
                      </div>
                    )}
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-tight">{inc.ago}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[11px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                    RECURRENCE: {inc.count}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => !inc.acked && ack(inc.id)}
                  className={`min-w-[48px] h-8 flex items-center justify-center rounded-xl border transition-all ${inc.acked
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                    : "bg-white text-gray-400 border-gray-200 hover:text-gray-400 hover:border-gray-400"
                    }`}
                >
                  {inc.acked ? <Check size={14} /> : <span className="text-[13px] px-2">Ack</span>}
                </button>
                <button
                  onClick={() => onViewLogs?.(inc)}
                  className="text-[13px] text-[#0061AA] font-black hover:underline px-1"
                >
                  Analyze
                </button>
              </div>
            </div>
          );
        }))}
      </div>
      <div className="mt-8 border-gray-50 flex justify-center">
        <button
          onClick={() => {
            const event = new CustomEvent("navigate", { detail: "incidents" });
            window.dispatchEvent(event);
          }}
          className="text-[14px] text-[#0061AA] font-black hover:underline"
        >
          See All →
        </button>
      </div>
    </div>
  );
};
