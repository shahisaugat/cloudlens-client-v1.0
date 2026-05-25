import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, ChevronDown, TrendingUp } from "lucide-react";

const MOCK_CHART_DATA = [
  { name: "Mon", passed: 42, failed: 8 },
  { name: "Tue", passed: 55, failed: 4 },
  { name: "Wed", passed: 48, failed: 12 },
  { name: "Thu", passed: 62, failed: 6 },
  { name: "Fri", passed: 75, failed: 3 },
  { name: "Sat", passed: 32, failed: 2 },
  { name: "Sun", passed: 28, failed: 1 },
];

const CustomTooltip = ({ active, payload, label, timeframe }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
          {timeframe === "24h" ? data.label : new Date(data.name).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-gray-900 text-[12px] font-bold capitalize">{entry.name}</span>
              </div>
              <span className="text-gray-900 text-[12px] font-black font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardChart = ({ data = MOCK_CHART_DATA, timeframe = "7d", setTimeframe }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const TIMEFRAMES = {
    "24h": "Last 24 Hours",
    "7d": "Last 7 Days",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col h-[462px] relative group">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[18px] font-black text-gray-900 tracking-tight">
              Pipeline Health
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              Active
            </span>
          </div>
          <p className="text-[14px] text-gray-400 font-medium">
            Overall success–failure distribution
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#639922]" />
              <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">
                Passed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E24B4A]" />
              <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">
                Failed
              </span>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[12px] font-black text-gray-700 hover:bg-white transition-all uppercase tracking-widest"
            >
              <Calendar size={14} className="text-gray-400" />
              {timeframe}
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-1 animate-in slide-in-from-top-2">
                {Object.entries(TIMEFRAMES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTimeframe?.(key);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[12px] font-bold transition-colors ${timeframe === key ? "text-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10 overflow-x-auto scrollbar-hide">
        <div style={{ minWidth: data.length > 7 ? `${(data.length / 7) * 100}%` : "100%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -30, bottom: 20 }}
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 13, fontWeight: 700 }}
                dy={15}
                dx={-5}
                tickFormatter={(val, index) => data[index]?.label || ""}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 800 }}
              />
              <Tooltip
                content={<CustomTooltip timeframe={timeframe} />}
                cursor={{ fill: "#F9FAFB", radius: 8 }}
              />
              <Bar
                dataKey="passed"
                name="Passed"
                fill="#639922"
                radius={[2, 2, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="failed"
                name="Failed"
                fill="#E24B4A"
                radius={[2, 2, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
