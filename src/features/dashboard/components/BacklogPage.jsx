import React, { useState } from "react";
import { Layers, ChevronRight, AlertCircle, Plus, Calendar, Activity, Check } from "lucide-react";

export function BacklogPage({ onToast }) {
  const [backlogTasks, setBacklogTasks] = useState([
    { id: "DEV-201", title: "Configure auto-scaling groups on staging ECS cluster", epic: "Infrastructure", points: 8, priority: "High", isSprint: false },
    { id: "DEV-204", title: "Audit SQL database slow indexing query logs", epic: "Database", points: 5, priority: "High", isSprint: false },
    { id: "DEV-208", title: "Implement dark mode theme colors configuration", epic: "Frontend UI", points: 3, priority: "Low", isSprint: false },
    { id: "DEV-210", title: "Create API integration webhook for Stripe payments", epic: "Integrations", points: 5, priority: "Medium", isSprint: false },
    { id: "DEV-212", title: "Write end-to-end integration tests for Auth flows", epic: "Testing", points: 8, priority: "Medium", isSprint: false }
  ]);

  const [sprintTasks, setSprintTasks] = useState([
    { id: "DEV-104", title: "Optimize Redis caching pool layers", epic: "Database", points: 5, priority: "High" },
    { id: "DEV-108", title: "Redesign CreateTeamModal gallery viewport", epic: "Frontend UI", points: 3, priority: "Medium" },
    { id: "DEV-112", title: "Implement session refresh cookie timeouts", epic: "Security", points: 8, priority: "High" }
  ]);

  const moveTaskToSprint = (task) => {
    setBacklogTasks(backlogTasks.filter(t => t.id !== task.id));
    setSprintTasks([...sprintTasks, { ...task }]);
    onToast(`Moved ${task.id} to Active Sprint 4!`);
  };

  const adjustPoints = (taskId, amount, inSprint) => {
    if (inSprint) {
      setSprintTasks(sprintTasks.map(t => {
        if (t.id === taskId) {
          const newPoints = Math.max(1, t.points + amount);
          return { ...t, points: newPoints };
        }
        return t;
      }));
    } else {
      setBacklogTasks(backlogTasks.map(t => {
        if (t.id === taskId) {
          const newPoints = Math.max(1, t.points + amount);
          return { ...t, points: newPoints };
        }
        return t;
      }));
    }
  };

  const getPriorityStyle = (p) => {
    switch (p.toLowerCase()) {
      case "high": return "text-rose-600 bg-rose-50 border-rose-100";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-[#0061AA] bg-blue-50 border-blue-100";
    }
  };

  const totalSprintPoints = sprintTasks.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[20px] font-black text-gray-900 tracking-tight">Sprint Backlog & Planning</h2>
          <p className="text-[13px] text-gray-400 font-medium">Plan epics, manage backlog tickets, and drag scopes into Active Sprint 4.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-2 bg-gray-50 border border-gray-150 rounded-xl text-[12px] font-black text-gray-500 flex items-center gap-1.5 shadow-inner">
            <Calendar size={14} className="text-[#0061AA]" />
            Sprint 4: 5 Days Left
          </span>
        </div>
      </div>

      {/* Burndown and estimations highlight banner */}
      <div className="grid grid-cols-[1fr_1.8fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
          <div>
            <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest">Sprint scope allocated</h3>
            <p className="text-[36px] font-black text-gray-900 mt-2 tracking-tighter">{totalSprintPoints} <span className="text-[16px] text-gray-400 font-medium">Story Points</span></p>
          </div>
          <div className="mt-4 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
              <span>Sprint Commit Velocity</span>
              <span className="text-gray-900 font-black">20 SP</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#0061AA] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (totalSprintPoints / 20) * 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Dynamic Burndown Chart representation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-gray-200 transition-all flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[14px] font-black text-gray-900 tracking-tight">Active Sprint Burndown</h3>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Remaining capacity vs target line</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
              <Activity size={12} /> On Target
            </span>
          </div>

          <div className="h-28 flex items-end gap-3 px-2 pt-2 border-b border-gray-100">
            {/* Visualizer columns representing burndown */}
            {[
              { day: "D1", rem: 20, targ: 20 },
              { day: "D2", rem: 18, targ: 17 },
              { day: "D3", rem: 16, targ: 14 },
              { day: "D4", rem: 16, targ: 11 },
              { day: "D5", rem: 12, targ: 8 },
              { day: "D6", rem: 11, targ: 5 },
              { day: "D7", rem: 6, targ: 2 },
              { day: "D8", rem: 0, targ: 0 },
            ].map((dayData, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex justify-center gap-0.5 items-end h-full">
                  <div 
                    className="w-2.5 bg-gray-200 rounded-t-sm group-hover:bg-gray-300 transition-colors" 
                    style={{ height: `${(dayData.targ / 20) * 100}%` }}
                    title={`Ideal remaining: ${dayData.targ} SP`}
                  />
                  <div 
                    className="w-2.5 bg-[#0061AA] rounded-t-sm group-hover:bg-blue-600 transition-colors" 
                    style={{ height: `${(dayData.rem / 20) * 100}%` }}
                    title={`Actual remaining: ${dayData.rem} SP`}
                  />
                </div>
                <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">{dayData.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Split Planner Boards */}
      <div className="grid grid-cols-2 gap-6">
        {/* Active Sprint Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#0061AA] rounded-full animate-pulse" />
              <h3 className="text-[14px] font-black text-gray-900 tracking-tight uppercase">Sprint 4 Active Tasks</h3>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-blue-50 text-[#0061AA]">
              {sprintTasks.length} Tickets
            </span>
          </div>

          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {sprintTasks.map((task) => (
              <div key={task.id} className="p-3.5 rounded-xl border border-gray-50 hover:border-gray-150 bg-gray-50/20 transition-all flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{task.id}</span>
                    <span className="text-gray-300 text-[10px]">•</span>
                    <span className="px-1.5 py-0.25 rounded bg-[#F1F5F9] text-gray-600 text-[9px] font-bold uppercase tracking-wider">{task.epic}</span>
                  </div>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-gray-800 leading-snug tracking-tight">{task.title}</h4>
                <div className="flex justify-between items-center mt-1 border-t border-gray-50/50 pt-2">
                  <span className="text-[10px] font-bold text-gray-400">Owner: Saugat Shahi</span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => adjustPoints(task.id, -1, true)} 
                      className="w-5 h-5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-[12px] border border-gray-100 transition-colors"
                    >-</button>
                    <span className="text-[11px] font-black text-gray-900 w-4 text-center">{task.points}</span>
                    <button 
                      onClick={() => adjustPoints(task.id, 1, true)} 
                      className="w-5 h-5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-[12px] border border-gray-100 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Backlog Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-gray-400" />
              <h3 className="text-[14px] font-black text-gray-900 tracking-tight uppercase">Product Backlog</h3>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-gray-50 text-gray-400">
              {backlogTasks.length} Tickets
            </span>
          </div>

          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {backlogTasks.map((task) => (
              <div key={task.id} className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-300 transition-all flex flex-col gap-2 relative group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{task.id}</span>
                    <span className="text-gray-300 text-[10px]">•</span>
                    <span className="px-1.5 py-0.25 rounded bg-gray-50 text-gray-500 text-[9px] font-bold uppercase tracking-wider">{task.epic}</span>
                  </div>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-gray-800 leading-snug tracking-tight pr-6">{task.title}</h4>
                <div className="flex justify-between items-center mt-1 border-t border-gray-50/50 pt-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => adjustPoints(task.id, -1, false)} 
                      className="w-5 h-5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-[12px] border border-gray-100 transition-colors"
                    >-</button>
                    <span className="text-[11px] font-black text-gray-900 w-4 text-center">{task.points}</span>
                    <button 
                      onClick={() => adjustPoints(task.id, 1, false)} 
                      className="w-5 h-5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center font-bold text-[12px] border border-gray-100 transition-colors"
                    >+</button>
                  </div>
                  
                  {/* Quick add action */}
                  <button
                    onClick={() => moveTaskToSprint(task)}
                    className="px-2.5 py-1 bg-blue-50 text-[#0061AA] hover:bg-[#0061AA] hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm"
                  >
                    Add to Sprint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
