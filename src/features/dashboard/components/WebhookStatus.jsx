import React from "react";
import { RefreshCw, Plus } from "lucide-react";

export const WebhookStatus = ({ webhooks, onToast }) => {
  const STATUS_STYLE = {
    ok: {
      chip: "bg-[#EAF3DE] text-[#3B6D11]",
      label: "OK",
    },
    connected: {
      chip: "bg-[#EAF3DE] text-[#3B6D11]",
      label: "Connected",
    },
    degraded: {
      chip: "bg-[#FAEEDA] text-[#854F0B]",
      label: "Degraded",
    },
    error: {
      chip: "bg-[#FCEBEB] text-[#A32D2D]",
      label: "Error",
    },
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Integration health
          </h2>
          <p className="text-[14px] text-gray-400 mt-0.5 font-medium">
            Webhooks + downstream services
          </p>
        </div>
        <button
          onClick={() => onToast?.("Re-testing all webhooks…")}
          className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition-all"
        >
          <RefreshCw size={10} /> Test all
        </button>
      </div>
      <div className="flex flex-col divide-y divide-gray-50 flex-1">
        {webhooks.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10">
            <h3 className="text-[16px] font-black text-gray-900 tracking-tight">No active integrations</h3>
            <p className="text-[13px] text-gray-400 mt-1 max-w-[280px]">
              Connect applications to start tracking health.
            </p>
          </div>
        ) : (
          webhooks.map((w) => {
            const s = STATUS_STYLE[w.status] || STATUS_STYLE.ok;
            return (
              <div
                key={w.name}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 tracking-tight">
                    {w.name}
                  </p>
                  <p className="text-[13px] text-gray-400 mt-0.5">
                    Last fired {w.lastFired} · {w.success} deliveries
                  </p>
                </div>
                <span
                  className={`text-[12px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${s.chip}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
        <button
          onClick={() => {
            const event = new CustomEvent("navigate", { detail: "integrations" });
            window.dispatchEvent(event);
          }}
          className="text-[14px] text-[#0061AA] font-black hover:underline flex items-center gap-2"
        >
          <Plus size={14} /> Connect Service
        </button>
      </div>
    </div>
  );
};
