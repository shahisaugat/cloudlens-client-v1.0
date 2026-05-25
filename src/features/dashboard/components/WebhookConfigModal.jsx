import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Globe, Link2, ShieldCheck, Zap, Info, Loader2, ExternalLink } from "lucide-react";
import { useUpdateWebhookConfigMutation } from "../../../store/api/githubApi";

export const WebhookConfigModal = ({ isOpen, onClose, onToast, initialConfig, type = "webhook" }) => {
  const [webhookUrl, setWebhookUrl] = useState(initialConfig?.webhookUrl || "");
  const [updateWebhookConfig, { isLoading: isSaving }] = useUpdateWebhookConfigMutation();
  const isConnected = !!initialConfig?.webhookUrl;

  useEffect(() => {
    if (initialConfig?.webhookUrl) {
      setWebhookUrl(initialConfig.webhookUrl);
    } else {
      setWebhookUrl("");
    }
  }, [initialConfig, isOpen]);

  const handleSave = async () => {
    if (!webhookUrl.startsWith("http")) {
      onToast?.("Please enter a valid URL starting with http:// or https://");
      return;
    }
    try {
      await updateWebhookConfig({ type, webhookUrl }).unwrap();
      onToast?.("Webhook configuration updated successfully!");
      onClose();
    } catch (err) {
      onToast?.("Failed to update webhook.");
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 p-2.5 shadow-sm">
                <Globe size={24} className="text-[#0061AA]" />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-gray-900 tracking-tight">
                  {isConnected ? "Manage Webhook" : "Connect Webhook"}
                </h2>
                <p className="text-[14px] font-medium text-gray-400 mt-0.5">
                  Configure real-time outgoing payloads
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-gray-900"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Visual Connector */}
            <div className="flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-2 transition-all duration-500 ${isConnected ? "ring-4 ring-emerald-500/10 border-emerald-100" : ""}`}>
                  <Globe size={20} className={isConnected ? "text-emerald-500" : "text-gray-400"} />
                </div>
                <div className="h-px w-12 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={14} className={`transition-all duration-500 ${isConnected ? "text-emerald-500 fill-emerald-500" : "text-gray-300"}`} />
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-[#0061AA] shadow-sm flex items-center justify-center p-2 text-white font-black text-xs transition-all duration-500 ${isConnected ? "ring-4 ring-blue-500/10" : ""}`}>
                  CL
                </div>
              </div>
              <p className="text-[13px] text-gray-500 font-medium px-8 text-center leading-relaxed">
                {isConnected 
                  ? "Connected to your custom endpoint. Data is flowing to the URL below." 
                  : "CloudLens will push real-time event payloads to your custom API endpoint."}
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Configuration</h3>
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0061AA] transition-colors">
                    <Link2 size={18} />
                  </div>
                  <input 
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-api.com/webhook"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[15px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[12px] text-gray-400 font-bold tracking-tight">End-to-end delivery encryption</span>
                  </div>
                  <a 
                    href="https://cloudlens.hq/docs/api" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] font-black text-[#0061AA] hover:underline uppercase tracking-widest flex items-center gap-1"
                  >
                    API Reference <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#FAFCFF] text-slate-600 rounded-2xl text-[15px] font-black hover:bg-gray-50 transition-all active:scale-[0.98] border border-gray-200/60"
            >
              {isConnected ? "Close" : "Cancel"}
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-[1.5] py-3 px-6 bg-[#0061AA] text-white rounded-2xl text-[15px] font-black hover:bg-[#004d8a] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {isConnected ? "Update Settings" : "Save Webhook"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
