import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Zap,
  MoreVertical,
  Activity,
  History,
  LifeBuoy,
  Loader2,
} from "lucide-react";
import { 
  useGetIncidentsQuery, 
  useAcknowledgeIncidentMutation 
} from "../../../store/api/githubApi";
import { EmptyState } from "./EmptyState";
import { ReportIncidentModal } from "./ReportIncidentModal";

const SEV_STYLES = {
  critical: {
    badge: "bg-rose-50 text-rose-600",
    icon: "text-rose-500",
    label: "CRITICAL",
  },
  warning: {
    badge: "bg-amber-50 text-amber-600",
    icon: "text-amber-500",
    label: "WARNING",
  },
  resolved: {
    badge: "bg-emerald-50 text-emerald-600",
    icon: "text-emerald-500",
    label: "RESOLVED",
  },
};

const STATUS_CHIPS = {
  Investigating: "bg-blue-50 text-blue-600",
  Identified: "bg-purple-50 text-purple-600",
  Monitoring: "bg-indigo-50 text-indigo-600",
  Resolved: "bg-gray-50 text-gray-500",
};

const formatTime = (dateStr) => {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

export const IncidentsPage = ({ onToast }) => {
  const [activeTab, setActiveTab] = useState("Open");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const { data: incidents = [], isLoading } = useGetIncidentsQuery();
  const [acknowledgeIncident] = useAcknowledgeIncidentMutation();

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeIncident(id).unwrap();
      onToast?.("Incident acknowledged");
    } catch (err) {
      onToast?.("Failed to acknowledge incident");
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Open") return matchesSearch && (inc.status === "Investigating" || inc.status === "Identified");
    if (activeTab === "Acknowledged") return matchesSearch && inc.acknowledged && inc.status !== "Resolved";
    if (activeTab === "Resolved") return matchesSearch && inc.status === "Resolved";
    return matchesSearch;
  });

  const stats = [
    {
      label: "Active Incidents",
      value: incidents.filter(i => i.status !== "Resolved").length.toString(),
      sub: `${incidents.filter(i => i.severity === 'critical' && i.status !== 'Resolved').length} Critical`,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Mean Time to Detect",
      value: "4m",
      sub: "-12% vs last week",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "MTTR (Avg)",
      value: "38m",
      sub: "Goal: < 30m",
      icon: History,
      color: "text-[#185FA5]",
      bg: "bg-blue-50",
    },
    {
      label: "SLA Uptime",
      value: "99.98%",
      sub: "Last 30 days",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((m, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div>
              <p className="text-[16px] text-gray-400 font-bold mb-1">
                {m.label}
              </p>
              <p className="text-[28px] font-black text-gray-900 tracking-tight leading-none">
                {m.value}
              </p>
              <p className="text-[12px] text-gray-400 font-medium mt-2">{m.sub}</p>
            </div>
            <div className={`p-3 rounded-xl ${m.bg}`}>
              <m.icon size={22} className={m.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[20px] font-black text-gray-900 tracking-tight">
              Incident Feed
            </h2>
            <p className="text-[14px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">
              Real-time service health & interruptions
            </p>
          </div>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl text-[14px] font-bold hover:bg-rose-700 transition-all active:scale-95"
          >
            <ShieldAlert size={16} /> Report Incident
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/60 rounded-2xl px-5 py-3.5 flex-1 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-400 transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by service, title, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[15px] text-gray-700 placeholder-gray-400 w-full font-bold tracking-tight"
            />
          </div>
          <div className="flex gap-1.5 p-1.5 bg-gray-50/80 rounded-2xl border border-gray-200/50">
            {["Open", "Acknowledged", "Resolved", "All"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveTab(f)}
                className={`px-6 py-2 rounded-xl text-[14px] font-bold transition-all ${activeTab === f
                  ? "bg-white text-[#0061AA] shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col min-h-[400px]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#0061AA]" size={32} />
            </div>
          ) : filteredIncidents.length === 0 ? (
            <EmptyState 
              icon={ShieldAlert}
              title={`No ${activeTab.toLowerCase()} incidents found`}
              description={searchQuery ? `We couldn't find anything matching "${searchQuery}"` : "Your infrastructure is looking healthy. No active incidents reported."}
              actionLabel="Report Incident"
              onAction={() => setIsReportModalOpen(true)}
            />
          ) : (
            filteredIncidents.map((inc) => {
              const s = SEV_STYLES[inc.severity] || SEV_STYLES.warning;
              return (
                <div
                  key={inc.id}
                  className={`p-6 flex items-start gap-5 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors group`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${s.badge}`}
                  >
                    <AlertTriangle size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider ${s.badge} uppercase border border-current opacity-70`}
                      >
                        {s.label}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs font-mono text-gray-400 font-bold">
                        {inc.incidentId}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-black text-gray-900 mb-1 group-hover:text-[#0061AA] transition-colors tracking-tight">
                      {inc.title}
                    </h3>
                    <p className="text-[14px] text-gray-500 mb-4 line-clamp-2 leading-relaxed font-medium">
                      {inc.description}
                    </p>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-[#0061AA]" />
                        <span className="text-[13px] font-black text-gray-700">
                          {inc.service}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400">
                        <Clock size={15} />
                        {formatTime(inc.startedAt)}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400">
                        <User size={15} />
                        {inc.owner}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] font-black text-rose-500/80 italic">
                        {inc.impact}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-black px-4 py-1.5 rounded-full border ${STATUS_CHIPS[inc.status] || "bg-gray-50 text-gray-500 border-gray-200"}`}
                    >
                      {inc.status}
                    </span>
                    <div className="flex items-center gap-2 transition-opacity">
                      {!inc.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(inc.id)}
                          className="px-4 py-2 bg-[#0061AA] text-white text-[13px] font-black rounded-xl hover:bg-[#004d8a] transition-all"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button className="p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all border border-transparent hover:border-gray-100">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-2.5 text-[#0061AA] hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <ReportIncidentModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onToast={onToast}
      />
    </div>
  );
};
