import React, { useState } from "react";
import ReactDOM from "react-dom";
import { 
  X, Globe, Activity, Database, ShieldCheck, 
  Settings2, Clock, Terminal, Trash2, Loader2,
  Copy, Check, AlertCircle, Trash, Zap, ExternalLink
} from "lucide-react";
import { 
  useGetWebhookPayloadsQuery 
} from "../../../store/api/githubApi";

const TYPE_ICONS = {
  WEBHOOK: Globe,
  POLLING: Activity,
  DATABASE: Database,
  OAUTH: ShieldCheck
};

export const CustomIntegrationDetailModal = ({ isOpen, onClose, integration, onToast }) => {
  const [activeTab, setActiveTab] = useState("logs"); // logs or settings
  const [copied, setCopied] = useState(false);

  const { data: payloads = [], isLoading: loadingPayloads } = useGetWebhookPayloadsQuery(integration?.id, {
    skip: !isOpen || !integration?.id,
    pollingInterval: 3000 // Poll every 3 seconds for live telemetry
  });

  if (!isOpen || !integration) return null;

  const Icon = TYPE_ICONS[integration.type] || Globe;
  const webhookUrl = `${window.location.protocol}//${window.location.hostname}:8080/api/v1/hooks/${integration.uniqueId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast?.("URL copied to clipboard");
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl w-full max-w-[650px] overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 pb-6 flex justify-between items-start">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#FAFCFF] rounded-2xl flex items-center justify-center border border-gray-100 p-3">
              <Icon size={28} className="text-[#0061AA]" />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-gray-900 tracking-tight leading-tight">{integration.name}</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{integration.type}</span>
                <div className="h-1 w-1 rounded-full bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 mb-4">
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
            <button 
              onClick={() => setActiveTab("logs")}
              className={`flex-1 py-2 rounded-lg text-[13px] font-black transition-all ${
                activeTab === "logs" ? "bg-white text-[#0061AA] border border-gray-100/50" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Telemetry Stream
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 rounded-lg text-[13px] font-black transition-all ${
                activeTab === "settings" ? "bg-white text-[#0061AA] border border-gray-100/50" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Configuration
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {activeTab === "logs" ? (
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Ingestion Feed</h3>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                   <span className="text-[10px] font-bold text-blue-500">Awaiting Payloads</span>
                </div>
              </div>

              {loadingPayloads ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 size={32} className="animate-spin text-[#0061AA] opacity-20" />
                  <p className="text-[12px] font-bold text-gray-300">Streaming...</p>
                </div>
              ) : payloads.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 border border-gray-100 text-gray-200">
                    <Terminal size={32} />
                  </div>
                  <h4 className="text-[15px] font-black text-gray-900 tracking-tight">Terminal is empty</h4>
                  <p className="text-[13px] text-gray-400 font-medium mt-2 max-w-[300px] leading-relaxed">
                    No data received yet. Connect your endpoint and send a JSON payload to see live metrics.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payloads.map(payload => (
                    <div key={payload.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-[#0061AA]/20">
                      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-[#FAFCFF]/50">
                        <div className="flex items-center gap-4">
                          <div className="px-2 py-1 bg-blue-50 text-[#0061AA] text-[10px] font-black rounded-md border border-blue-100 uppercase">Post</div>
                          <span className="text-[11px] font-bold text-gray-400 font-mono tracking-tight">/hooks/{integration.uniqueId}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-gray-300">{payload.sourceIp}</span>
                          <span className="text-[10px] font-black text-emerald-600">200 OK</span>
                        </div>
                      </div>
                      <div className="p-5 bg-slate-900 text-gray-100 font-mono text-[12px] overflow-x-auto whitespace-pre leading-relaxed border-t border-white/5 opacity-90">
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(payload.payload), null, 2);
                          } catch (e) {
                            return payload.payload;
                          }
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 pt-2">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Ingestion Architecture</h3>
                <div className="p-6 bg-[#FAFCFF] rounded-3xl border border-blue-50 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Globe size={80} className="text-[#0061AA]" />
                   </div>
                   <label className="text-[11px] font-bold text-blue-400 mb-3 block">Your Private Webhook URL</label>
                   <div className="flex gap-3 relative z-10">
                    <div className="flex-1 px-5 py-3.5 bg-white border border-blue-100/50 rounded-xl font-mono text-[12px] text-[#0061AA] truncate flex items-center">
                      {webhookUrl}
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="p-3.5 bg-[#0061AA] text-white rounded-xl hover:bg-[#004d8a] transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-blue-500/10"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="p-5 bg-white border border-gray-100 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-400">
                       <Clock size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Metadata ID</h4>
                  </div>
                  <div className="text-[15px] font-mono font-bold text-gray-900 leading-none">{integration.uniqueId}</div>
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-500">
                       <ShieldCheck size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Pipeline Status</h4>
                  </div>
                  <div className="text-[14px] font-black text-emerald-600 leading-none">Operational</div>
                </div>
              </div>

              <div className="p-6 bg-rose-50/30 border border-rose-100 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-rose-100 text-rose-500 shadow-sm">
                       <Trash2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-gray-900 tracking-tight">Danger Zone</h4>
                      <p className="text-[12px] text-gray-500 font-medium mt-0.5">Destructive action. All ingested data will be lost.</p>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-white text-rose-600 border border-rose-200 rounded-xl text-[12px] font-black hover:bg-rose-600 hover:text-white transition-all active:scale-95">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[#FAFCFF] text-slate-600 border border-gray-200/60 rounded-2xl text-[15px] font-black hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
