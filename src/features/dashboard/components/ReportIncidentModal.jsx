import React, { useState } from "react";
import ReactDOM from "react-dom";
import { 
  X, ShieldAlert, AlertTriangle, Info, 
  Clock, User, Activity, Loader2, Check
} from "lucide-react";
import { useCreateIncidentMutation } from "../../../store/api/githubApi";

const SEVERITIES = [
  { id: "critical", label: "Critical", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
  { id: "warning", label: "Warning", icon: Info, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "resolved", label: "Resolved", icon: Check, color: "text-emerald-500", bg: "bg-emerald-50" }
];

export const ReportIncidentModal = ({ isOpen, onClose, onToast }) => {
  const [formData, setFormData] = useState({
    title: "",
    service: "",
    severity: "warning",
    description: "",
    impact: "",
    owner: "System Admin"
  });

  const [createIncident, { isLoading }] = useCreateIncidentMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIncident({
        ...formData,
        status: formData.severity === "resolved" ? "Resolved" : "Investigating",
        acknowledged: false
      }).unwrap();
      onToast?.("Incident reported successfully");
      onClose();
    } catch (err) {
      onToast?.("Failed to report incident");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-[550px] overflow-hidden border border-gray-100 flex flex-col animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 pb-6 flex justify-between items-start">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 p-3">
              <ShieldAlert size={28} className="text-rose-600" />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-gray-900 tracking-tight leading-tight">Report Incident</h2>
              <p className="text-[14px] text-gray-500 font-medium mt-1">Manual override for undetected service interruptions.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Incident Title</label>
              <input 
                required
                type="text"
                placeholder="e.g., Auth Service timeout in us-east-1"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Affected Service</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g., api-gateway"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Severity Level</label>
                <div className="flex gap-2">
                  {SEVERITIES.map(sev => (
                    <button
                      key={sev.id}
                      type="button"
                      onClick={() => setFormData({...formData, severity: sev.id})}
                      className={`flex-1 py-3.5 rounded-xl border text-[13px] font-black transition-all flex items-center justify-center gap-2 ${
                        formData.severity === sev.id 
                          ? `${sev.bg} ${sev.color} border-current ring-2 ring-current ring-opacity-10` 
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <sev.icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Root Cause / Description</label>
              <textarea 
                required
                rows={3}
                placeholder="Describe what happened and any initial observations..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Business Impact</label>
              <input 
                required
                type="text"
                placeholder="e.g., 20% of checkout requests failing"
                value={formData.impact}
                onChange={e => setFormData({...formData, impact: e.target.value})}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-[#FAFCFF] text-slate-600 border border-gray-200/60 rounded-2xl text-[15px] font-black hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[1.5] py-4 bg-[#0061AA] text-white rounded-2xl text-[15px] font-black hover:bg-[#004d8a] transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Broadcast Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
