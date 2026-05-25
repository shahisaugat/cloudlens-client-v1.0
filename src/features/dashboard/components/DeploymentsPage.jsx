import React, { useState } from "react";
import {
  Rocket,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  RotateCcw,
  Eye,
  Terminal,
  MoreVertical,
  ChevronRight,
  Zap,
  History,
} from "lucide-react";

import { useGetDeploymentsQuery } from "../../../store/api/githubApi";
import { EmptyState } from "./EmptyState";
import { NewDeploymentModal } from "./NewDeploymentModal";

const ENV_STYLES = {
  Production: "bg-rose-50 text-rose-600",
  Staging: "bg-amber-50 text-amber-600",
  Dev: "bg-blue-50 text-blue-600",
};

const STATUS_CHIPS = {
  Success: "bg-emerald-50 text-emerald-600",
  Running: "bg-blue-50 text-blue-600",
  Failed: "bg-rose-50 text-rose-600",
};

export const DeploymentsPage = ({ onToast }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: deployments = [], isLoading } = useGetDeploymentsQuery(null, {
    pollingInterval: 30000,
  });

  const filteredDeployments = deployments.filter((dep) =>
    dep.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dep.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeRollouts = deployments.filter(d => d.status === 'Running').length;
  const successRate = deployments.length > 0 
    ? ((deployments.filter(d => d.status === 'Success').length / deployments.length) * 100).toFixed(1) + '%'
    : '0%';
  const failed24h = deployments.filter(d => d.status === 'Failed').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0061AA]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Deployments
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time status and history of all service rollouts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0061AA] text-white rounded-lg text-sm font-bold hover:bg-[#004d8a] transition-all"
          >
            <Rocket size={16} /> New Deployment
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Active Rollouts",
            value: activeRollouts,
            sub: activeRollouts === 1 ? "1 Running" : `${activeRollouts} Running`,
            icon: Activity,
            color: "text-[#185FA5]",
            bg: "bg-blue-50",
          },
          {
            label: "Success Rate",
            value: successRate,
            sub: deployments.length > 0 ? "Historical accuracy" : "No deployments yet",
            icon: Zap,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Failed (Total)",
            value: failed24h,
            sub: failed24h > 0 ? "Needs attention" : "System healthy",
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Avg. Duration",
            value: deployments.length > 0 ? "4m 20s" : "—",
            sub: "Goal: < 5m",
            icon: History,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
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

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[18px] font-black text-gray-900 tracking-tight">Deployment Feed</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search services, versions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 transition-all font-medium"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {filteredDeployments.length > 0 ? (
            filteredDeployments.map((dep, i) => (
              <div
                key={dep.id}
                className="p-6 flex items-start gap-6 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${dep.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : dep.status === "Running" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                >
                  <Rocket size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-lg tracking-widest ${ENV_STYLES[dep.env] || "bg-gray-50 text-gray-600"}`}
                    >
                      {(dep.env || "unknown").toUpperCase()}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {dep.id}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-black text-gray-900 mb-1 group-hover:text-[#0061AA] transition-colors tracking-tight">
                    {dep.service}{" "}
                    <span className="text-gray-400 font-mono font-bold ml-2">
                      {dep.version}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-500 mb-5 flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-700">
                      {dep.author}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium">{dep.strategy}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-mono text-[11px] font-bold bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100">
                      {dep.commit}
                    </span>
                  </div>

                  <div className="flex items-center gap-8 flex-wrap">
                    <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
                      <Clock size={15} className="opacity-70" />
                      {dep.startedAt}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-400 font-medium">
                      <RotateCcw size={15} className="opacity-70" />
                      {dep.duration}
                    </div>
                    {dep.health > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${dep.health >= 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${dep.health}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          {dep.health}% Health
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0">
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border ${STATUS_CHIPS[dep.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                  >
                    {dep.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToast?.("Opening logs")}
                      className="p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all border border-transparent hover:border-gray-200"
                      title="View Logs"
                    >
                      <Terminal size={18} />
                    </button>
                    <button
                      onClick={() => onToast?.("Viewing details")}
                      className="p-2.5 text-[#0061AA] hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                      title="View Details"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20">
              <EmptyState 
                icon={Rocket}
                title="No deployments yet"
                description="Once you start rolling out services, they will appear here in real-time."
                actionLabel="New Deployment"
                onAction={() => onToast?.("Starting new deployment...")}
              />
            </div>
          )}
        </div>
      </div>

      <NewDeploymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToast={onToast}
      />
    </div>
  );
};
