import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, AlertCircle, CheckCircle2, ShieldCheck, LogOut, Zap, Unlink } from "lucide-react";
import { useDisconnectSlackMutation } from "../../../store/api/slackApi";
import { useUpdateWebhookConfigMutation } from "../../../store/api/githubApi";
import slackLogo from "../../../assets/svgs/slack.svg";

export const SlackConfigModal = ({ isOpen, onClose, onToast, initialConfig, userId }) => {
  const [isNotifyOnFailure, setIsNotifyOnFailure] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState(initialConfig?.webhookUrl || "");
  const [disconnectSlack] = useDisconnectSlackMutation();
  const [updateWebhookConfig, { isLoading: isSaving }] = useUpdateWebhookConfigMutation();
  const isConnected = initialConfig?.status === "connected" || initialConfig?.status === "ok";

  useEffect(() => {
    if (initialConfig?.webhookUrl) {
      setWebhookUrl(initialConfig.webhookUrl);
    }
  }, [initialConfig]);

  const handleSave = async () => {
    try {
      await updateWebhookConfig({ type: 'slack', webhookUrl }).unwrap();
      onToast?.("Slack configuration updated successfully!");
      onClose();
    } catch (err) {
      onToast?.("Failed to update Slack configuration.");
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      console.info("LOG: Slack Config Modal opened. Status:", isConnected ? "Connected" : "Not Connected");
    }
  }, [isOpen, isConnected]);

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
                <img src={slackLogo} alt="Slack" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-gray-900 tracking-tight">
                  {isConnected ? "Manage Slack" : "Connect Slack"}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[14px] font-medium text-gray-400">
                    {isConnected ? "Configure real-time incident alerts" : "Connect your workspace"}
                  </p>
                </div>
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
            {/* Visual Connector / Hero Area - Always visible or only when disconnected? User liked it so I'll keep it as a branding piece */}
            <div className="flex flex-col items-center justify-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-2 transition-all duration-500 ${isConnected ? "ring-4 ring-emerald-500/10 border-emerald-100" : ""}`}>
                  <img src={slackLogo} alt="Slack" className="w-full h-full" />
                </div>
                <div className="h-px w-12 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <Zap
                        size={14}
                        className={`transition-all duration-500 ${isConnected ? "text-emerald-500 fill-emerald-500" : "text-gray-300"}`}
                      />
                      {isConnected && (
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                      )}
                    </div>
                  </div>
                  {isConnected && (
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-[#0061AA] shadow-sm flex items-center justify-center p-2 text-white font-black text-xs transition-all duration-500 ${isConnected ? "ring-4 ring-blue-500/10" : ""}`}>
                  CL
                </div>
              </div>
              <p className="text-[13px] text-gray-500 font-medium px-8 text-center leading-relaxed">
                {isConnected
                  ? `Connected to your ${initialConfig?.name || "Slack"} workspace.`
                  : "Connect your Slack workspace to receive real-time alerts and pipeline insights."}
              </p>
            </div>


            {/* Config Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Alert Preferences</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                      <AlertCircle size={18} className="text-rose-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-gray-900 tracking-tight">Notify on failures</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Immediate Alerts</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNotifyOnFailure(!isNotifyOnFailure)}
                    className={`w-10 h-5.5 rounded-full transition-all duration-300 relative ${isNotifyOnFailure ? "bg-[#0061AA]" : "bg-gray-200"
                      }`}
                  >
                    <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all duration-300 shadow-sm ${isNotifyOnFailure ? "left-5" : "left-0.5"
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-black text-gray-900 tracking-tight">Notify on success</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Enterprise Only</p>
                    </div>
                  </div>
                  <div className="w-10 h-5.5 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#FAFCFF] text-slate-600 rounded-2xl text-[15px] font-black hover:bg-gray-50 transition-all active:scale-[0.98] border border-gray-200/60"
            >
              {isConnected ? "Close Settings" : "Cancel"}
            </button>

            {!isConnected ? (
              <a
                href={`http://localhost:8080/api/v1/slack/install?userId=${userId}`}
                className="flex-[1.5] flex items-center justify-center gap-2 px-6 py-3 bg-[#0061AA] text-white rounded-2xl hover:bg-[#004f8a] transition-all group active:scale-[0.98]"
              >
                <img src={slackLogo} alt="" className="w-4 h-4" />
                <span className="text-[15px] font-black">Connect Workspace</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await disconnectSlack().unwrap();
                    onToast?.("Slack disconnected successfully");
                    onClose();
                  } catch (err) {
                    onToast?.("Failed to disconnect Slack");
                  }
                }}
                className="flex-[1.5] flex items-center justify-center gap-2 px-6 py-3 bg-rose-100 text-rose-700 rounded-2xl text-[14px] font-bold hover:bg-rose-200 transition-all active:scale-[0.98] border border-rose-200"
              >
                <Unlink size={16} /> Disconnect Slack
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};