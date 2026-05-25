import React, { useState } from "react";
import {
  GitBranch,
  Clock,
  Zap,
  MessageSquare,
  Play,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  GitPullRequest,
  CheckCircle2,
  Calendar,
  Users
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const SPRINT_BURNDOWN_DATA = [
  { name: "Day 1", ideal: 31, actual: 31 },
  { name: "Day 2", ideal: 27.9, actual: 30 },
  { name: "Day 3", ideal: 24.8, actual: 29 },
  { name: "Day 4", ideal: 21.7, actual: 24 },
  { name: "Day 5", ideal: 18.6, actual: 20 },
  { name: "Day 6", ideal: 15.5, actual: 16 },
  { name: "Day 7", ideal: 12.4, actual: 12 },
  { name: "Day 8", ideal: 9.3, actual: 7 },
  { name: "Day 9", ideal: 6.2, actual: null },
  { name: "Day 10", ideal: 3.1, actual: null },
  { name: "End", ideal: 0, actual: null }
];

const DEV_WORKLOAD_DATA = [
  { name: "Saugat Shahi", commits: 28, prs: 5 },
  { name: "John Dev", commits: 19, prs: 3 },
  { name: "Jane Ops", commits: 14, prs: 4 },
  { name: "Alex QA", commits: 8, prs: 2 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#0B0F19] border border-gray-150 dark:border-gray-800 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2">
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-gray-700 dark:text-gray-300 text-[12px] font-bold capitalize">
                  {entry.name === "ideal" ? "Ideal Burndown" : entry.name === "actual" ? "Remaining SP" : entry.name}
                </span>
              </div>
              <span className="text-gray-900 dark:text-white text-[12px] font-black font-mono">
                {entry.value} {entry.name === "commits" ? "" : entry.name === "prs" ? "" : "SP"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function DeveloperHubPage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState("sprint");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      {/* Redesigned Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Card 1: Sprint Progress */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sprint Progress</p>
              <p className="text-[26px] font-black text-gray-900 mt-1 tracking-tight">78.2%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0061AA] flex items-center justify-center">
              <Layers size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center gap-1.5 text-[12px] font-bold text-gray-500 dark:text-gray-600">
            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp size={12} /> +4.1%
            </span>
            <span>vs previous sprint</span>
          </div>
        </div>

        {/* Stat Card 2: Cycle Time */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Avg Cycle Time</p>
              <p className="text-[26px] font-black text-gray-900 mt-1 tracking-tight">2.4 Hrs</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center gap-1.5 text-[12px] font-bold text-gray-500 dark:text-gray-600">
            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp size={12} /> -15.2%
            </span>
            <span>faster PR review cycle</span>
          </div>
        </div>

        {/* Stat Card 3: Test Coverage */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Test Coverage</p>
              <p className="text-[26px] font-black text-gray-900 mt-1 tracking-tight">94.25%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center gap-1.5 text-[12px] font-bold text-gray-500 dark:text-gray-600">
            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp size={12} /> +0.4%
            </span>
            <span>1,248 total assertions</span>
          </div>
        </div>

        {/* Stat Card 4: Build Health */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">CI Success Rate</p>
              <p className="text-[26px] font-black text-gray-900 mt-1 tracking-tight">98.6%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center gap-1.5 text-[12px] font-bold text-gray-500 dark:text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>24 passed, 1 failed (last 24h)</span>
          </div>
        </div>

      </div>

      {/* Redesigned Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Sprint Burndown */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col hover:border-gray-300 dark:hover:border-gray-700 transition-all h-[420px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[16px] font-black text-gray-900 tracking-tight">Sprint Burndown Chart</h3>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Track completed vs ideal story points burndown</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-[#0061AA]" /> Actual
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-350 border border-dashed border-gray-400" /> Ideal
              </span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPRINT_BURNDOWN_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0061AA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0061AA" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 800 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  name="actual" 
                  stroke="#0061AA" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="ideal" 
                  name="ideal" 
                  stroke="#9CA3AF" 
                  strokeWidth={1.5} 
                  strokeDasharray="5 5" 
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Developer Commits & PRs */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col hover:border-gray-300 dark:hover:border-gray-700 transition-all h-[420px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[16px] font-black text-gray-900 tracking-tight">Team Workload & Contributions</h3>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Commits and Pull Requests created in this sprint</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Commits
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> PRs
              </span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEV_WORKLOAD_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 800 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="commits" name="commits" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="prs" name="prs" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Two Column Task and PR List */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        
        {/* Active Backlog Highlight */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col hover:border-gray-300 dark:hover:border-gray-700 transition-all">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[16px] font-black text-gray-900 tracking-tight">Active Backlog</h3>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">High-priority tasks currently in progress</p>
            </div>
            <button 
              onClick={() => onNavigate("tasks")}
              className="text-[12px] font-black text-[#0061AA] hover:underline flex items-center gap-1"
            >
              Full Backlog <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="space-y-3 flex-1">
            {[
              { title: "Optimize Redis caching pool layers", id: "DEV-104", status: "In Progress", color: "text-[#0061AA] bg-blue-50 border-blue-100/50" },
              { title: "Redesign CreateTeamModal gallery viewport", id: "DEV-108", status: "Under Review", color: "text-amber-600 bg-amber-50 border-amber-100/50" },
              { title: "Implement session refresh cookie timeouts", id: "DEV-112", status: "In Progress", color: "text-[#0061AA] bg-blue-50 border-blue-100/50" },
              { title: "Fix Webhook status refresh timers", id: "DEV-115", status: "Blocked", color: "text-rose-600 bg-rose-50 border-rose-100/50" }
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100/60 hover:bg-[#F9FAFB] dark:hover:bg-[#111827] transition-all">
                <div className="min-w-0 flex items-center gap-3.5">
                  <span className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest shrink-0">{task.id}</span>
                  <p className="text-[14px] font-bold text-gray-800 truncate tracking-tight">{task.title}</p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${task.color}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest PRs Feed */}
        <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm flex flex-col hover:border-gray-300 dark:hover:border-gray-700 transition-all">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[16px] font-black text-gray-900 tracking-tight">Active Pull Requests</h3>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Code changes awaiting approval or merge</p>
            </div>
            <button 
              onClick={() => onNavigate("prs")}
              className="text-[12px] font-black text-[#0061AA] hover:underline flex items-center gap-1"
            >
              All PRs <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { title: "feat: redesign chat modal user flow", repo: "cloudlens-client", author: "saugatshahi", comments: 2, status: "Passing" },
              { title: "fix: resolve memory leak in worker scheduler", repo: "cloudlens-service", author: "john_dev", comments: 0, status: "Passing" },
              { title: "infra: configure load balancer autoscaler rule", repo: "infra-iac", author: "jane_ops", comments: 5, status: "Review Required" }
            ].map((pr, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100/60 hover:bg-[#F9FAFB] dark:hover:bg-[#111827] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <p 
                    onClick={() => onNavigate("prs")}
                    className="text-[14px] font-bold text-gray-800 tracking-tight hover:text-[#0061AA] cursor-pointer truncate flex-1"
                  >
                    {pr.title}
                  </p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${pr.status === "Passing" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                    {pr.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-150/40">{pr.repo}</span>
                  <span className="text-gray-300 text-[10px]">•</span>
                  <span className="text-[11px] font-medium text-gray-400">by @{pr.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
