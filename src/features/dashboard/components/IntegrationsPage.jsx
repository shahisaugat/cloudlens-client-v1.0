import React, { useState } from "react";
import {
  Search,
  Plus,
  ExternalLink,
  Search as SearchIcon,
} from "lucide-react";
import { SlackConfigModal } from "./SlackConfigModal";
import { WebhookConfigModal } from "./WebhookConfigModal";
import { CustomIntegrationWizard } from "./CustomIntegrationWizard";
import { CustomIntegrationDetailModal } from "./CustomIntegrationDetailModal";
import { 
  useGetIntegrationsQuery, 
  useGetCustomIntegrationsQuery 
} from "../../../store/api/githubApi";
import { 
  Globe, Terminal, Activity, Database, ShieldCheck, 
  ChevronRight, Settings2, Trash2, Clock, Zap
} from "lucide-react";

// Import real SVGs from assets/svgs
import awsLogo from "../../../assets/svgs/aws.svg";
import githubLogo from "../../../assets/svgs/github.svg";
import slackLogo from "../../../assets/svgs/slack.svg";
import datadogLogo from "../../../assets/svgs/datadog.svg";
import redisLogo from "../../../assets/svgs/redis.svg";
import pagerdutyLogo from "../../../assets/svgs/pagerduty.svg";
import webhookLogo from "../../../assets/svgs/aws.svg"; // Fallback for webhook or use a globe icon
import { EmptyState } from "./EmptyState";

const CATEGORIES = [
  "All",
  "Cloud",
  "Monitoring",
  "CI/CD",
  "Alerting",
  "Database",
];

const INTEGRATIONS = [
  {
    id: "aws",
    name: "AWS CloudWatch",
    category: "Cloud",
    description:
      "Import metrics, logs, and traces from AWS services directly into CloudLens.",
    status: "connected",
    installed: true,
    logo: awsLogo,
    color: "bg-orange-50",
    docs: "https://aws.amazon.com/cloudwatch",
  },
  {
    id: "github",
    name: "GitHub Actions",
    category: "CI/CD",
    description:
      "Monitor workflow performance and sync deployment triggers automatically.",
    status: "available",
    installed: false,
    logo: githubLogo,
    color: "bg-gray-50",
    docs: "https://github.com/features/actions",
  },
  {
    id: "slack",
    name: "Slack Notify",
    category: "Alerting",
    description:
      "Get real-time incident alerts and deployment status in your Slack channels.",
    status: "available",
    installed: false,
    logo: slackLogo,
    color: "bg-purple-50",
    docs: "https://slack.com",
  },
  {
    id: "datadog",
    name: "Datadog Sync",
    category: "Monitoring",
    description:
      "Bidirectional sync for dashboard snapshots and unified alerting policies.",
    status: "available",
    installed: false,
    logo: datadogLogo,
    color: "bg-indigo-50",
    docs: "https://datadoghq.com",
  },
  {
    id: "redis",
    name: "Redis Insights",
    category: "Database",
    description:
      "Deep observability into cache hit rates, memory usage, and slow queries.",
    status: "available",
    installed: false,
    logo: redisLogo,
    color: "bg-red-50",
    docs: "https://redis.io",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    category: "Alerting",
    description:
      "Synchronize on-call schedules and escalate critical CloudLens incidents.",
    status: "available",
    installed: false,
    logo: pagerdutyLogo,
    color: "bg-emerald-50",
    docs: "https://pagerduty.com",
  },
];

const TYPE_ICONS = {
  WEBHOOK: Globe,
  POLLING: Activity,
  DATABASE: Database,
  OAUTH: ShieldCheck
};

export const IntegrationsPage = ({ githubConnected, onToast, userId }) => {
  const { data: realIntegrations } = useGetIntegrationsQuery();
  const { data: customIntegrations = [] } = useGetCustomIntegrationsQuery();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSlackModalOpen, setIsSlackModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedCustom, setSelectedCustom] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetail = (integration, tab = "logs") => {
    setSelectedCustom(integration);
    setIsDetailModalOpen(true);
  };

  const displayIntegrations = INTEGRATIONS.map(item => {
    if (item.id === 'github' && githubConnected) {
      return { ...item, status: 'connected', installed: true };
    }
    
    const realInfo = realIntegrations?.find(ri => ri.id === item.id);
    if (realInfo) {
      return { ...item, ...realInfo, name: item.name };
    }
    
    return item;
  });

  const filteredIntegrations = displayIntegrations.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-10 p-1 pb-20">
      {/* Native Integrations Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Native Connectors
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Official integrations for industry-standard tools.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-60 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0061AA] text-white rounded-lg text-sm font-semibold hover:bg-[#004d8a] transition-colors"
            >
              <Plus size={16} /> Add Custom
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#0061AA] text-white"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-100/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col transition-all duration-300 group relative overflow-hidden shadow-sm"
            >
              {/* Background Logo Decoration */}
              <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-500 pointer-events-none group-hover:scale-110 grayscale group-hover:grayscale-0">
                <img src={item.logo} alt="" className="w-32 h-32 object-contain" />
              </div>
              
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 p-2 border border-white`}
                  >
                    <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-black text-gray-900 tracking-tight group-hover:text-[#0061AA] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
                {item.status === "connected" ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg border border-gray-100 text-[10px] font-black uppercase tracking-widest">
                    Available
                  </div>
                )}
              </div>

              <div className="flex-1 mb-6 relative z-10">
                <p className="text-[14px] text-gray-500 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-gray-50 mt-auto relative z-10">
                <a
                  href={item.docs}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-black text-gray-400 hover:text-[#0061AA] flex items-center gap-1.5 transition-all uppercase tracking-widest"
                  onClick={(e) => e.stopPropagation()}
                >
                  Docs <ExternalLink size={12} className="opacity-50" />
                </a>
                <div className="flex gap-2">
                  {item.status === "connected" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (item.id === "slack") {
                            setIsSlackModalOpen(true);
                          } else if (item.id === "webhook") {
                            setIsWebhookModalOpen(true);
                          } else {
                            onToast?.(`Settings opened for ${item.name}`);
                          }
                        }}
                        className="px-4 pt-[11px] pb-[9px] text-[#0061AA] bg-blue-50 hover:bg-blue-100 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 leading-none flex items-center justify-center"
                      >
                        Configure
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.id === "github") {
                          window.location.href = "http://localhost:8080/oauth2/authorization/github";
                        } else if (item.id === "slack") {
                          setIsSlackModalOpen(true);
                        } else if (item.id === "webhook") {
                          setIsWebhookModalOpen(true);
                        } else {
                          onToast?.(`Starting ${item.name} setup...`);
                        }
                      }}
                      className="px-5 pt-[11px] pb-[9px] bg-[#0061AA] text-white hover:bg-[#004f8a] rounded-xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 leading-none flex items-center justify-center"
                    >
                      Install
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Integrations Section */}
      <div className="flex flex-col gap-6 pt-10 border-t border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Your Custom Pipelines
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Integrations you've built using our Custom Engine.
          </p>
        </div>

        {customIntegrations.length === 0 ? (
          <div className="p-12 text-center bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-300">
              <Terminal size={22} />
            </div>
            <h3 className="text-[15px] font-black text-gray-400 uppercase tracking-widest">No Custom Pipelines</h3>
            <p className="text-sm text-gray-500 mt-2">Connect your internal APIs to CloudLens.</p>
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="mt-6 px-6 py-2 bg-white text-[#0061AA] border border-[#0061AA]/20 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-[0.98]"
            >
              Build Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {customIntegrations.map((ci) => {
              const Icon = TYPE_ICONS[ci.type] || Globe;
              return (
                <div 
                  key={ci.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col transition-all duration-300 hover:border-[#0061AA]/30 group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-white group-hover:bg-[#0061AA]/5 transition-colors">
                        <Icon size={20} className="text-[#0061AA]" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-black text-gray-900 tracking-tight leading-tight">{ci.name}</h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1 block">{ci.type}</span>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </div>
                  </div>

                  <div className="flex-1 mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock size={10} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Last seen: Just now</span>
                    </div>
                    <div className="px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100 font-mono text-[10px] text-gray-400 truncate">
                      {ci.uniqueId}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => handleOpenDetail(ci, "logs")}
                      className="text-[10px] font-black text-gray-400 hover:text-[#0061AA] uppercase tracking-widest transition-all"
                    >
                      Logs
                    </button>
                    <button 
                      onClick={() => handleOpenDetail(ci, "settings")}
                      className="px-3 py-1.5 bg-[#FAFCFF] text-[#0061AA] border border-blue-100/50 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100/30 transition-all"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SlackConfigModal 
        isOpen={isSlackModalOpen} 
        onClose={() => setIsSlackModalOpen(false)} 
        onToast={onToast}
        initialConfig={realIntegrations?.find(ri => ri.id === 'slack')}
        userId={userId}
      />
      <WebhookConfigModal 
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onToast={onToast}
        initialConfig={realIntegrations?.find(ri => ri.id === 'webhook')}
        type="webhook"
      />
      <CustomIntegrationWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onToast={onToast}
      />
      <CustomIntegrationDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        integration={selectedCustom}
        onToast={onToast}
      />
    </div>
  );
};
