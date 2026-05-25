import React, { useState } from "react";
import { BookOpen, Search, Hash, ChevronRight, FileText, Info, AlertTriangle, ShieldCheck } from "lucide-react";

export function WikiPage({ onToast }) {
  const [selectedDoc, setSelectedDoc] = useState("onboarding");
  const [searchQuery, setSearchQuery] = useState("");

  const documents = [
    { id: "onboarding", title: "Developer Onboarding", category: "Getting Started" },
    { id: "api-specs", title: "API Gateway Architecture", category: "Core Design" },
    { id: "db-sharding", title: "Database Sharding Protocol", category: "Core Design" },
    { id: "security-runbook", title: "Security Incident Runbook", category: "Operations" },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocContent = () => {
    switch (selectedDoc) {
      case "api-specs":
        return (
          <div className="flex flex-col gap-5 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0061AA]">Architecture Blueprint</span>
              <h3 className="text-[22px] font-black text-gray-900 tracking-tight mt-1">API Gateway Architecture</h3>
              <p className="text-[13px] text-gray-400 font-medium mt-1">Written by @jane_ops · Last updated 2 days ago</p>
            </div>

            <div className="h-[1px] bg-gray-100" />

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <Info size={16} className="text-[#0061AA] mt-0.5 shrink-0" />
              <p className="text-[12px] font-medium text-blue-700 leading-relaxed">
                CloudLens uses a highly-hardened Kubernetes API ingress gateway based on Envoy to proxy inbound real-time telemetry pipelines directly to internal Kafka queues.
              </p>
            </div>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">1. Request Authentication Flow</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              Every request targeting the telemetry ingress must supply an active bearer authentication token inside the headers structure:
            </p>
            <pre className="p-4 bg-gray-900 text-gray-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
{`curl -X POST https://api.cloudlens.dev/v1/telemetry \\
  -H "Authorization: Bearer <cl_auth_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"repoId": 104, "metrics": []}'`}
            </pre>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">2. Rate Limiting</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              Local endpoints are rate-limited to <strong>1,200 events/minute</strong> per unique project subscription ID to prevent DoS vector congestion.
            </p>
          </div>
        );

      case "db-sharding":
        return (
          <div className="flex flex-col gap-5 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0061AA]">Database Topology</span>
              <h3 className="text-[22px] font-black text-gray-900 tracking-tight mt-1">Database Sharding Protocol</h3>
              <p className="text-[13px] text-gray-400 font-medium mt-1">Written by @john_dev · Last updated 1 week ago</p>
            </div>

            <div className="h-[1px] bg-gray-100" />

            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertTriangle size={16} className="text-rose-600 mt-0.5 shrink-0" />
              <p className="text-[12px] font-medium text-rose-700 leading-relaxed">
                Direct queries to root database tables without supplying a partition shard index will bypass indexes and trigger heavy full-table sequentials. Avoid this.
              </p>
            </div>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">1. Shard Partition Mapping</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              Telemetry database runs on PostgreSQL and is horizontally partitioned across 12 database instances using the <code>repoId</code> property as the hash sharding key:
            </p>
            <pre className="p-4 bg-gray-900 text-gray-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
{`-- SQL Command to query target shard partition
SELECT * FROM telemetry_metrics_partitioned
WHERE repo_id = 104
ORDER BY created_at DESC LIMIT 50;`}
            </pre>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">2. Index Re-indexing Schedules</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              Indices are re-evaluated and vacuumed automatically every Sunday at 02:00 UTC during off-peak system hours.
            </p>
          </div>
        );

      case "security-runbook":
        return (
          <div className="flex flex-col gap-5 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0061AA]">Operations Playbook</span>
              <h3 className="text-[22px] font-black text-gray-900 tracking-tight mt-1">Security Incident Runbook</h3>
              <p className="text-[13px] text-gray-400 font-medium mt-1">Written by @jane_ops · Last updated 5 days ago</p>
            </div>

            <div className="h-[1px] bg-gray-100" />

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
              <ShieldCheck size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-[12px] font-medium text-emerald-700 leading-relaxed">
                If a critical vulnerability scan alert triggers, this runbook details how to immediately establish system locks and deploy hot-reloading pipeline patches.
              </p>
            </div>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">Phase 1: Lock Telemetry Pipeline</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              Establish a pipeline quarantine rule using our Kubernetes operator interface to reject non-verified inbound webhook payloads:
            </p>
            <pre className="p-4 bg-gray-900 text-gray-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
{`kubectl patch operatorConfig main-operator \\
  --type='json' \\
  -p='[{"op": "replace", "path": "/spec/quarantine", "value": true}]'`}
            </pre>
          </div>
        );

      default: // onboarding
        return (
          <div className="flex flex-col gap-5 text-left animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0061AA]">Workspace Integration</span>
              <h3 className="text-[22px] font-black text-gray-900 tracking-tight mt-1">Developer Onboarding</h3>
              <p className="text-[13px] text-gray-400 font-medium mt-1">Written by @saugatshahi · Last updated 3 hours ago</p>
            </div>

            <div className="h-[1px] bg-gray-100" />

            <p className="text-[14px] text-gray-600 font-bold leading-relaxed tracking-tight">
              Welcome to the CloudLens development team! This handbook compiles essential system details, setup configurations, and engineering workspace guides to get you rolling.
            </p>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">1. Local Staging Provisioning</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              CloudLens front-end client operates locally on port <code>5173</code> via Vite. Initialize environment assets using standard commands:
            </p>
            <pre className="p-4 bg-gray-900 text-gray-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed">
{`# 1. Install workspace dependencies
npm install

# 2. Run local hot-reloaded dev server
npm run dev`}
            </pre>

            <h4 className="text-[15px] font-black text-gray-800 tracking-tight mt-2">2. Architecture Principles</h4>
            <ul className="list-disc pl-5 text-[13px] text-gray-600 font-medium space-y-2 leading-relaxed">
              <li>Keep pages and views modularized to optimize rendering latency.</li>
              <li>Always verify code changes inside the API sandbox.</li>
              <li>Ensure unit checks pass before merging pull requests.</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="h-[650px] bg-white rounded-2xl border border-gray-100 shadow-sm flex overflow-hidden animate-in fade-in duration-300">
      {/* Wiki Navigation Directory */}
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0 bg-gray-50/20">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-[14px] font-black text-gray-900 tracking-tight">Engineering Wiki</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Knowledge Base</p>
        </div>

        {/* Wiki Search */}
        <div className="p-3 border-b border-gray-100/50">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-150 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search handbook..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] text-gray-900 font-bold placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Directory Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {["Getting Started", "Core Design", "Operations"].map((category) => {
            const catDocs = filteredDocs.filter(d => d.category === category);
            if (catDocs.length === 0) return null;
            return (
              <div key={category} className="flex flex-col gap-1">
                <span className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{category}</span>
                {catDocs.map((doc) => {
                  const isActive = selectedDoc === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoc(doc.id);
                        onToast(`Opened ${doc.title}`);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left ${isActive ? "bg-blue-50 text-[#0061AA] font-black shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold"}`}
                    >
                      <FileText size={13} className={isActive ? "text-[#0061AA]" : "text-gray-400"} />
                      <span className="text-[12.5px] truncate flex-1">{doc.title}</span>
                      <ChevronRight size={11} className={isActive ? "text-[#0061AA]" : "text-gray-300"} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wiki Document Reader Viewer */}
      <div className="flex-1 overflow-y-auto p-8 h-full bg-white">
        {getDocContent()}
      </div>
    </div>
  );
}
