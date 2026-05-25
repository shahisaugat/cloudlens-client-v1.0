import React, { useState } from "react";
import { 
  Plus, Globe, Activity, Database, ShieldCheck, 
  Search, ExternalLink, Settings2, Clock, 
  Terminal, ChevronRight, AlertCircle, Loader2,
  Trash2, Play, Pause
} from "lucide-react";
import { 
  useGetCustomIntegrationsQuery, 
  useGetWebhookPayloadsQuery 
} from "../../../store/api/githubApi";
import { CustomIntegrationWizard } from "./CustomIntegrationWizard";

const TYPE_ICONS = {
  WEBHOOK: Globe,
  POLLING: Activity,
  DATABASE: Database,
  OAUTH: ShieldCheck
};

export const CustomIntegrationManager = ({ onToast }) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: integrations = [], isLoading } = useGetCustomIntegrationsQuery();
  const { data: payloads = [], isLoading: loadingPayloads } = useGetWebhookPayloadsQuery(selectedId, {
    skip: !selectedId,
    pollingInterval: 5000 // Poll for live updates
  });

  const filteredIntegrations = integrations.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Custom Integrations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Build and manage your own ingestion pipelines</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0061AA] text-white rounded-xl text-sm font-black hover:bg-[#004d8a] transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} /> Create Custom
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Side */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search custom integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#0061AA]/20 shadow-sm"
            />
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0061AA]" /></div>
            ) : filteredIntegrations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-300">
                  <Terminal size={20} />
                </div>
                <p className="text-sm font-bold text-gray-400">No custom integrations yet</p>
              </div>
            ) : filteredIntegrations.map(integration => {
              const Icon = TYPE_ICONS[integration.type] || Globe;
              return (
                <button
                  key={integration.id}
                  onClick={() => setSelectedId(integration.id)}
                  className={`w-full p-4 rounded-[24px] border transition-all text-left flex items-center gap-4 group ${
                    selectedId === integration.id 
                      ? "bg-[#0061AA] border-[#0061AA] text-white shadow-xl shadow-blue-500/20" 
                      : "bg-white border-gray-100 text-gray-900 hover:border-[#0061AA]/30 hover:shadow-md"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedId === integration.id ? "bg-white/10" : "bg-gray-50 group-hover:bg-blue-50 transition-colors"
                  }`}>
                    <Icon size={20} className={selectedId === integration.id ? "text-white" : "text-gray-400 group-hover:text-[#0061AA]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[15px] font-black tracking-tight truncate ${selectedId === integration.id ? "text-white" : "text-gray-900"}`}>
                      {integration.name}
                    </div>
                    <div className={`text-[11px] font-black uppercase tracking-widest mt-0.5 ${selectedId === integration.id ? "text-white/60" : "text-gray-400"}`}>
                      {integration.type} • {integration.status}
                    </div>
                  </div>
                  <ChevronRight size={18} className={selectedId === integration.id ? "text-white/40" : "text-gray-200"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Side */}
        <div className="lg:col-span-8">
          {!selectedId ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm text-gray-200 animate-pulse">
                <Settings2 size={40} />
              </div>
              <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Select an Integration</h3>
              <p className="text-sm text-gray-400 font-medium mt-2">Choose from the left to view live telemetry and configuration.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm min-h-[600px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Detail Header */}
              <div className="p-8 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <Globe size={28} className="text-[#0061AA]" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-black text-gray-900 tracking-tight">
                      {integrations.find(i => i.id === selectedId)?.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </div>
                      <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">Created 2 days ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"><Settings2 size={20} /></button>
                  <button className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={20} /></button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-[#FAFCFF] rounded-3xl border border-blue-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-50">
                        <Activity size={20} className="text-blue-600" />
                      </div>
                      <h4 className="text-[14px] font-black text-gray-900 tracking-tight uppercase">Health Metrics</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">Successful Hits</span>
                        <span className="text-[24px] font-black text-gray-900 leading-none">1,284</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">Avg Latency</span>
                        <span className="text-[24px] font-black text-gray-900 leading-none">42ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#FAFCFF] rounded-3xl border border-blue-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-50">
                        <ShieldCheck size={20} className="text-blue-600" />
                      </div>
                      <h4 className="text-[14px] font-black text-gray-900 tracking-tight uppercase">Security</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="text-[13px] font-medium text-gray-600">Unique Endpoint:</div>
                      <div className="px-3 py-2 bg-white rounded-xl border border-blue-100 font-mono text-[11px] text-blue-600 break-all">
                        /hooks/{integrations.find(i => i.id === selectedId)?.uniqueId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Feed */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-black text-gray-900 tracking-tight uppercase">Live Payload Inspector</h3>
                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Listening</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {loadingPayloads ? (
                      <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0061AA]" /></div>
                    ) : payloads.length === 0 ? (
                      <div className="p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-[13px] text-gray-400 font-bold">Waiting for first payload...</p>
                        <p className="text-[11px] text-gray-400 mt-1">Send a POST request to your ingestion URL to see it here.</p>
                      </div>
                    ) : payloads.map(payload => (
                      <div key={payload.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white hover:border-[#0061AA]/30 transition-all">
                        <div className="p-4 flex items-center justify-between bg-gray-50/30">
                          <div className="flex items-center gap-3">
                            <span className="text-[12px] font-black text-[#0061AA] tracking-tight">POST</span>
                            <span className="text-[12px] font-bold text-gray-400 font-mono">/hooks/{integrations.find(i => i.id === selectedId)?.uniqueId}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{payload.sourceIp}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">200 OK</span>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-900 text-gray-100 font-mono text-[12px] overflow-x-auto whitespace-pre">
                          {JSON.stringify(JSON.parse(payload.payload), null, 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomIntegrationWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onToast={onToast}
      />
    </div>
  );
};
