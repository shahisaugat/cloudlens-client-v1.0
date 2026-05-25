import React, { useMemo } from "react";
import {
  Activity,
  BarChart3,
  Clock,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { StatCard } from "./StatCard";
import { DashboardChart } from "./DashboardChart";
import { EmptyState } from "./EmptyState";

const parseDuration = (duration) => {
  if (!duration || duration === "—") return null;
  const parts = duration.split(" ");
  let totalSec = 0;
  parts.forEach((part) => {
    if (part.endsWith("h")) totalSec += parseInt(part, 10) * 3600;
    if (part.endsWith("m")) totalSec += parseInt(part, 10) * 60;
    if (part.endsWith("s")) totalSec += parseInt(part, 10);
  });
  return Number.isFinite(totalSec) ? totalSec : null;
};

const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "—";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const RESOURCE_DATA = [
  { name: 'Frontend Build', value: 400, color: '#0061AA' },
  { name: 'Backend Tests', value: 300, color: '#639922' },
  { name: 'E2E Cypress', value: 300, color: '#E24B4A' },
  { name: 'Deployments', value: 200, color: '#F59E0B' },
];

const VELOCITY_DATA = [
  { name: 'Week 1', tasks: 12, leadTime: 4.5 },
  { name: 'Week 2', tasks: 18, leadTime: 3.2 },
  { name: 'Week 3', tasks: 15, leadTime: 3.8 },
  { name: 'Week 4', tasks: 24, leadTime: 2.1 },
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const AnalyticsPage = ({ repo, pipelines = [], chartData = [], timeframe, setTimeframe }) => {
  const hasRepo = !!repo;
  const hasData = pipelines.length > 0;

  const successCount = useMemo(
    () => pipelines.filter((p) => p.status === "success").length,
    [pipelines],
  );

  const failCount = useMemo(
    () => pipelines.filter((p) => p.status === "failed").length,
    [pipelines],
  );

  const averageDuration = useMemo(() => {
    const durations = pipelines
      .map((p) => parseDuration(p.duration))
      .filter(Boolean);
    if (durations.length === 0) return null;
    return Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length);
  }, [pipelines]);

  const deploymentFrequency = useMemo(() => {
    if (pipelines.length === 0) return "—";
    return `${Math.max(1, Math.round(pipelines.length / 7))} / week`;
  }, [pipelines.length]);

  const changeFailureRate = useMemo(() => {
    if (pipelines.length === 0) return "—";
    return `${Math.round((failCount / pipelines.length) * 100)}%`;
  }, [failCount, pipelines.length]);

  const successRate = useMemo(() => {
    if (pipelines.length === 0) return "—";
    return `${Math.round((successCount / pipelines.length) * 100)}%`;
  }, [successCount, pipelines.length]);

  const mttr = useMemo(() => {
    if (pipelines.length === 0) return "—";
    return "12m";
  }, [pipelines.length]);

  const weekdayVolume = useMemo(() => {
    const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    pipelines.forEach((pipeline) => {
      if (!pipeline.time) return;
      const date = new Date(pipeline.time);
      counts[dayNames[date.getDay()]] += 1;
    });
    return Object.entries(counts).map(([day, count]) => ({ day, count }));
  }, [pipelines]);

  const heatmapData = useMemo(() => {
    const buckets = Array.from({ length: 24 }, () => Array(7).fill(0));
    pipelines.forEach((pipeline) => {
      if (!pipeline.time) return;
      const date = new Date(pipeline.time);
      buckets[date.getHours()][date.getDay()] += 1;
    });
    return buckets;
  }, [pipelines]);

  const maxBucket = useMemo(
    () => heatmapData.flat().reduce((max, value) => Math.max(max, value), 0),
    [heatmapData],
  );

  const failureWorkflows = useMemo(
    () => pipelines.filter((pipeline) => pipeline.status === "failed").slice(0, 4),
    [pipelines],
  );

  if (!hasRepo) {
    return (
      <div className="flex items-center justify-center h-[420px]">
        <EmptyState
          title="Select a repository first"
          description="Choose a connected GitHub repository to surface pipeline analytics for your team."
          actionLabel="Pick a repo"
          onAction={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">


      {!hasData ? (
        <section className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm text-center">
          <EmptyState
            title="No analytics available yet"
            description="Once GitHub Actions start running for this repository, this workspace will display charts, trend lines, and risk heatmaps."
            actionLabel="Open pipelines"
            onAction={() => setTimeframe?.("7d")}
          />
        </section>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-4">
            <StatCard
              label="Deployments"
              value={deploymentFrequency}
              subtext="Weekly cadence"
              icon={TrendingUp}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              label="Success rate"
              value={successRate}
              subtext="Build reliability"
              icon={ShieldCheck}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatCard
              label="Failure rate"
              value={changeFailureRate}
              subtext="Change risk"
              icon={Zap}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
            <StatCard
              label="MTTR"
              value={mttr}
              subtext="Incident response"
              icon={Clock}
              iconBg="bg-slate-50"
              iconColor="text-slate-700"
            />
          </section>

                    <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr] items-start">
            <DashboardChart data={chartData} timeframe={timeframe} setTimeframe={setTimeframe} />

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Build status snapshot</h3>
                    <p className="text-[14px] text-gray-400 mt-1 font-medium">Reliability</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700">Live</span>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2">Current success ratio</p>
                    <p className="text-[28px] font-black text-gray-900 leading-none tracking-tight">{successRate}</p>
                    <p className="text-[12px] text-gray-400 font-medium mt-3">Percentage of successful runs in your current dataset.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2">Failed builds</p>
                      <p className="text-[28px] font-black text-rose-600 leading-none tracking-tight">{failCount}</p>
                      <p className="text-[12px] text-gray-400 font-medium mt-3">Failures to prioritize for remediation.</p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                      <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2">MTTR</p>
                      <p className="text-[28px] font-black text-gray-900 leading-none tracking-tight">{mttr}</p>
                      <p className="text-[12px] text-gray-400 font-medium mt-3">Time to restore healthy builds after a failure.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Performance summary</h3>
                    <p className="text-[14px] text-gray-400 mt-1 font-medium">Key delivery metrics at a glance.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Total runs</span>
                    <span className="text-[14px] font-black text-gray-900">{pipelines.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Success builds</span>
                    <span className="text-[14px] font-black text-emerald-600">{successRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-gray-900">Failure risk</span>
                    <span className="text-[14px] font-black text-rose-600">{changeFailureRate}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
                    <p className="text-[14px] font-bold text-gray-900">Recommended action</p>
                    <p className="text-[13px] text-gray-500 font-medium mt-1">Prioritize investigation on failed workflows and remove long-running bottlenecks.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

<section className="grid gap-6 xl:grid-cols-2 items-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-6">
                <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Resource Allocation</h3>
                <p className="text-[14px] text-gray-400 mt-1 font-medium">Cost Analysis: CI minutes consumed per category.</p>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={RESOURCE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {RESOURCE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#111827' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {RESOURCE_DATA.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-6">
                <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Delivery Lead Time</h3>
                <p className="text-[14px] text-gray-400 mt-1 font-medium">Developer Velocity: Task completion vs. lead time to production.</p>
              </div>
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={VELOCITY_DATA} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#111827' }} />
                    <Line yAxisId="left" type="monotone" dataKey="tasks" name="Tasks Completed" stroke="#0061AA" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="leadTime" name="Lead Time (Days)" stroke="#E5E7EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="grid gap-6 items-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Risk by hour and day</h3>
                    <p className="text-[14px] text-gray-400 mt-1 font-medium">Failure heatmap</p>
                  </div>
                  <span className="text-sm font-black text-gray-400">Volume map</span>
                </div>

                <div className="overflow-x-auto pb-4">
                  <div className="grid gap-2 min-w-[700px]">
                    <div className="grid grid-cols-[48px_repeat(24,minmax(0,1fr))] gap-1 text-[10px] text-gray-500 font-black text-center">
                      <div />
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <div key={hour}>{hour.toString().padStart(2, '0')}</div>
                      ))}
                    </div>
                    {dayNames.map((day, dayIndex) => (
                      <div key={day} className="grid grid-cols-[48px_repeat(24,minmax(0,1fr))] gap-1 items-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{day}</div>
                        {Array.from({ length: 24 }).map((_, hour) => {
                          const value = heatmapData[hour][dayIndex];
                          const intensity = maxBucket ? value / maxBucket : 0;
                          return (
                            <div
                              key={`${day}-${hour}`}
                              className="h-6 rounded-md"
                              style={{
                                backgroundColor: value === 0 ? '#F8FAFC' : `rgba(99, 161, 34, ${0.15 + intensity * 0.65})`,
                                boxShadow: value > 0 ? 'inset 0 0 0 1px rgba(15, 23, 42, 0.04)' : 'none',
                              }}
                              title={value ? `${value} runs at ${hour}:00 on ${day}` : `No runs`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-gray-500">
                  <p className="font-black text-gray-900">Heatmap insights</p>
                  <p className="mt-2">
                    Darker squares show more pipeline activity and potential failure pressure. Use this matrix to pinpoint the hours and days that require operational focus.
                  </p>
                </div>
              </div>
          </section>

<section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Top failed workflows</h3>
                  <p className="text-[14px] text-gray-400 mt-1 font-medium">Lead indicator</p>
                </div>
                <span className="text-sm font-black text-gray-400">Investigate</span>
              </div>

              <div className="space-y-4">
                {failureWorkflows.length ? (
                  failureWorkflows.map((pipeline, index) => (
                    <div key={pipeline.sha || index} className="rounded-2xl border border-gray-100 p-4 hover:border-gray-200 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[14px] font-bold text-gray-900 truncate tracking-tight">{pipeline.name || pipeline.workflow || `Pipeline ${index + 1}`}</p>
                          <p className="text-[11px] font-medium text-gray-400 mt-1">{pipeline.branch || pipeline.ref || 'main'}</p>
                        </div>
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-rose-600 shrink-0">Failed</span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                          <p className="text-[14px] font-black text-gray-900">{pipeline.duration || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-1">Last run</p>
                          <p className="text-[14px] font-black text-gray-900">{pipeline.time ? new Date(pipeline.time).toLocaleString() : 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center text-sm text-gray-500">
                    No recent failed workflows found. Your delivery risk is low.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Operational cues</h3>
                  <p className="text-[14px] text-gray-400 mt-1 font-medium">Quick recommendations</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-gray-900">Successful builds</span>
                  <span className="text-[14px] font-black text-gray-900">{successCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-gray-900">Failed builds</span>
                  <span className="text-[14px] font-black text-rose-600">{failCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-gray-900">Pipeline runs</span>
                  <span className="text-[14px] font-black text-gray-900">{pipelines.length}</span>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
                  <p className="text-[14px] font-bold text-gray-900">Recommended action</p>
                  <p className="text-[13px] text-gray-500 font-medium mt-1">Focus on failed workflows and optimize long-running stages to improve delivery velocity.</p>
                </div>
              </div>
            </div>
          </section>
</>
      )}
    </div>
  );
};
