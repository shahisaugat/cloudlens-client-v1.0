import React, { useState } from "react";
import ReactDOM from "react-dom";
import { 
  X, Plus, Globe, Zap, ShieldCheck, 
  ChevronRight, Copy, Check, Terminal,
  Cpu, LayoutGrid, Database, Activity,
  Loader2, Info, ArrowLeft, Settings2
} from "lucide-react";
import { useCreateCustomIntegrationMutation } from "../../../store/api/githubApi";

const INTEGRATION_TYPES = [
  { id: 'WEBHOOK', name: 'Incoming Webhook', icon: Globe, desc: 'Push data from external systems via HTTP POST.', color: 'bg-blue-50 text-blue-600' },
  { id: 'POLLING', name: 'API Polling', icon: Activity, desc: 'CloudLens fetches data periodically from a REST API.', color: 'bg-purple-50 text-purple-600' },
  { id: 'OAUTH', name: 'OAuth App', icon: ShieldCheck, desc: 'Connect to external apps using OAuth2 flow.', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'DATABASE', name: 'Database Connector', icon: Database, desc: 'Ingest metrics directly from SQL or NoSQL.', color: 'bg-orange-50 text-orange-600' },
];

export const CustomIntegrationWizard = ({ isOpen, onClose, onToast }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "WEBHOOK",
    category: "Monitoring",
    description: ""
  });
  const [createdIntegration, setCreatedIntegration] = useState(null);
  const [copied, setCopied] = useState(false);

  const [createIntegration, { isLoading: isCreating }] = useCreateCustomIntegrationMutation();

  const handleCreate = async () => {
    try {
      const result = await createIntegration(formData).unwrap();
      setCreatedIntegration(result);
      setStep(3);
      onToast?.("Integration created successfully!");
    } catch (err) {
      onToast?.("Failed to create integration.");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const webhookUrl = createdIntegration ? `${window.location.origin}/api/v1/hooks/${createdIntegration.uniqueId}` : "";

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-[550px] overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#0061AA] rounded-xl flex items-center justify-center text-white">
              <Plus size={22} />
            </div>
            <div>
              <h2 className="text-[18px] font-black text-gray-900 tracking-tight">New Custom Integration</h2>
              <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Step {step} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-8 pb-8 pt-4 min-h-[400px] flex flex-col">
          {/* Step 1: Choose Type */}
          {step === 1 && (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Select Integration Type</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {INTEGRATION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setFormData({...formData, type: type.id}); setStep(2); }}
                    className="flex items-center gap-4 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-[#0061AA]/30 hover:bg-blue-50/30 transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                      <type.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-black text-gray-900">{type.name}</div>
                      <div className="text-[12px] text-gray-500 font-medium leading-relaxed truncate max-w-[300px]">{type.desc}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-200 group-hover:text-[#0061AA] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configure Details */}
          {step === 2 && (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300 space-y-5">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Integration Name</label>
                <input 
                  type="text"
                  placeholder="e.g., Payment Gateway Monitoring"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                <textarea 
                  placeholder="Briefly describe what this integration will do..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl">
                <Info size={14} className="text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-900/70 font-bold uppercase tracking-tight">
                  {formData.type === 'WEBHOOK' 
                    ? "Unique endpoint generated on completion." 
                    : "Auth and endpoint configuration follows."}
                </p>
              </div>

              <div className="mt-auto pt-4 flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-50 text-slate-600 rounded-xl text-[14px] font-black border border-gray-200/60 hover:bg-gray-100 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={isCreating || !formData.name}
                  className="flex-[2] py-3 bg-[#0061AA] text-white rounded-xl text-[14px] font-black disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                  Complete Setup
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success & Keys */}
          {step === 3 && createdIntegration && (
            <div className="flex-1 animate-in zoom-in duration-500 space-y-6">
              <div className="flex flex-col items-center text-center pb-2">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                  <ShieldCheck size={28} className="text-emerald-500" />
                </div>
                <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Integration Live!</h3>
                <p className="text-[13px] text-gray-500 font-medium mt-1 px-10 leading-relaxed">
                  Your custom integration is ready. Push data to the endpoint below.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Ingestion URL</label>
                  <div className="relative group">
                    <input 
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="w-full pl-4 pr-12 py-3.5 bg-gray-900 text-gray-100 font-mono text-[12px] rounded-xl focus:outline-none"
                    />
                    <button 
                      onClick={() => handleCopy(webhookUrl)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 overflow-hidden border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Terminal size={12} className="text-blue-400" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">CURL Example</span>
                    </div>
                  </div>
                  <pre className="text-[11px] font-mono text-gray-300 leading-relaxed whitespace-pre-wrap opacity-80">
                    {`curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"service":"api","status":"ok"}'`}
                  </pre>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-[#0061AA] text-white rounded-xl text-[14px] font-black hover:bg-[#004d8a] transition-all active:scale-[0.98]"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
