import React, { useState, useRef, useCallback } from "react";
import { CheckSquare, Plus, Trash2, ChevronLeft, ChevronRight, X, GripVertical } from "lucide-react";

export function TasksPage({ onToast }) {
  const [tasks, setTasks] = useState([
    { id: "DEV-104", title: "Optimize Redis caching pool layers", priority: "High", points: 5, status: "in-progress", assignee: "Saugat Shahi", initials: "SS" },
    { id: "DEV-108", title: "Redesign CreateTeamModal gallery viewport", priority: "Medium", points: 3, status: "todo", assignee: "John Dev", initials: "JD" },
    { id: "DEV-112", title: "Implement session refresh cookie timeouts", priority: "High", points: 8, status: "todo", assignee: "Jane Ops", initials: "JO" },
    { id: "DEV-115", title: "Fix Webhook status refresh timers", priority: "Low", points: 2, status: "done", assignee: "Saugat Shahi", initials: "SS" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newPoints, setNewPoints] = useState(3);
  const [newStatus, setNewStatus] = useState("todo");

  // Drag state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [droppedTaskId, setDroppedTaskId] = useState(null);

  const moveTask = (taskId, direction) => {
    const statusOrder = ["todo", "in-progress", "done"];
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const currentIndex = statusOrder.indexOf(task.status);
        let nextIndex = currentIndex + direction;
        if (nextIndex >= 0 && nextIndex < statusOrder.length) {
          return { ...task, status: statusOrder[nextIndex] };
        }
      }
      return task;
    }));
    onToast(`Task moved!`);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    onToast("Task deleted successfully!");
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onToast("Task title is required");
      return;
    }
    const newId = `DEV-${Math.floor(Math.random() * 900) + 200}`;
    const newTask = {
      id: newId,
      title: newTitle,
      priority: newPriority,
      points: Number(newPoints),
      status: newStatus,
      assignee: "Saugat Shahi",
      initials: "SS"
    };

    setTasks([...tasks, newTask]);
    setNewTitle("");
    setNewPriority("Medium");
    setNewPoints(3);
    setNewStatus("todo");
    setShowModal(false);
    onToast(`Created task ${newId}!`);
  };

  const getPriorityColor = (p) => {
    switch (p.toLowerCase()) {
      case "high": return "bg-rose-50 text-rose-600 border-rose-100";
      case "medium": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-blue-50 text-[#0061AA] border-blue-100";
    }
  };

  // ── Drag Handlers ──
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
    // Make the drag image slightly transparent
    if (e.target) {
      setTimeout(() => {
        e.target.style.opacity = "0.4";
      }, 0);
    }
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e, colStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colStatus);
  };

  const handleDragLeave = (e, colStatus) => {
    // Only clear if we're actually leaving the column (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, colStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: colStatus } : t));
      setDroppedTaskId(taskId);
      setTimeout(() => setDroppedTaskId(null), 500);
      onToast(`Task moved!`);
    }
    setDraggedTaskId(null);
    setDragOverCol(null);
  };

  const renderColumn = (colStatus, colTitle, colBg) => {
    const colTasks = tasks.filter(t => t.status === colStatus);
    const isDragTarget = dragOverCol === colStatus && draggedTaskId && tasks.find(t => t.id === draggedTaskId)?.status !== colStatus;

    return (
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        {/* Column Header */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${colBg}`} />
            <h3 className="text-[15px] font-black text-gray-900 tracking-tight uppercase">{colTitle}</h3>
            <span className="text-[12px] font-black px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500">
              {colTasks.length}
            </span>
          </div>
        </div>

        {/* Task Cards Container — Drop Zone */}
        <div
          className={`flex-1 border rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] max-h-[600px] overflow-y-auto transition-all duration-300 ${
            isDragTarget
              ? "bg-blue-50/40 dark:bg-blue-900/20 border-blue-300 dark:border-blue-500 ring-2 ring-blue-400/30 dark:ring-blue-500/20 shadow-lg shadow-blue-500/10"
              : "bg-white dark:bg-[#111827] border-gray-200/60"
          }`}
          onDragOver={(e) => handleDragOver(e, colStatus)}
          onDragLeave={(e) => handleDragLeave(e, colStatus)}
          onDrop={(e) => handleDrop(e, colStatus)}
        >
          {colTasks.length === 0 ? (
            <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 rounded-xl border-2 border-dashed transition-colors duration-200 ${
              isDragTarget ? "border-blue-300 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10" : "border-gray-200/50 dark:border-gray-700/50"
            }`}>
              <CheckSquare size={28} className="text-gray-300 stroke-1 mb-3" />
              <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                {isDragTarget ? "Drop here" : "No tickets"}
              </p>
            </div>
          ) : (
            colTasks.map((task) => {
              const isDragging = draggedTaskId === task.id;
              const justDropped = droppedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-[#F9FAFB] dark:bg-[#0B0F19] rounded-xl border border-gray-200/60 hover:border-gray-300 p-5 flex flex-col gap-3 transition-all cursor-grab active:cursor-grabbing select-none ${
                    isDragging
                      ? "opacity-40 scale-95 rotate-1 ring-2 ring-blue-400/40"
                      : justDropped
                        ? "animate-[magnetSnap_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
                        : "hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  {/* ID & Priority */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="text-gray-300 dark:text-gray-500 shrink-0" />
                      <span className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{task.id}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h4 className="text-[15px] font-bold text-gray-800 leading-snug tracking-tight">
                    {task.title}
                  </h4>

                  {/* Footer metadata */}
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-blue-50 text-[#0061AA] border border-blue-100 rounded-lg flex items-center justify-center font-black text-[11px]">
                        {task.initials}
                      </div>
                      <span className="text-[13px] font-medium text-gray-500 dark:text-gray-600">{task.assignee}</span>
                    </div>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 border border-gray-200/50">
                      {task.points} SP
                    </span>
                  </div>

                  <div className="h-[1px] bg-gray-100 dark:bg-gray-200 my-1" />

                  {/* Card Controls */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete ticket"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex gap-1">
                      <button
                        disabled={task.status === "todo"}
                        onClick={() => moveTask(task.id, -1)}
                        className="p-1.5 hover:bg-gray-100 disabled:opacity-30 text-gray-500 rounded-lg transition-colors"
                        title="Move backward"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      <button
                        disabled={task.status === "done"}
                        onClick={() => moveTask(task.id, 1)}
                        className="p-1.5 hover:bg-gray-100 disabled:opacity-30 text-gray-500 rounded-lg transition-colors"
                        title="Move forward"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 relative">
      {/* Magnetic snap animation */}
      <style>{`
        @keyframes magnetSnap {
          0% { transform: scale(0.92) translateY(10px); opacity: 0.6; }
          50% { transform: scale(1.03) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-black text-gray-900 tracking-tight">Active Task Board</h2>
          <p className="text-[14px] text-gray-400 dark:text-gray-500 font-medium mt-1">Coordinate task states and story allocations for Active Sprint 4.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-[#0061AA] hover:bg-blue-700 text-white rounded-xl text-[13px] font-black uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-sm"
        >
          <Plus size={16} /> Create Task
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="flex flex-row gap-6 overflow-x-auto pb-4">
        {renderColumn("todo", "To Do", "bg-gray-400")}
        {renderColumn("in-progress", "In Progress", "bg-[#0061AA]")}
        {renderColumn("done", "Completed", "bg-emerald-500")}
      </div>

      {/* Add Task Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[17px] font-black text-gray-900 tracking-tight">Create Workspace Ticket</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Task Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Optimize Redis caching pool layers"
                  className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-bold focus:outline-none focus:border-[#0061AA] focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-bold focus:outline-none focus:border-[#0061AA] transition-all bg-gray-50/50 cursor-pointer"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-bold focus:outline-none focus:border-[#0061AA] transition-all bg-gray-50/50 cursor-pointer"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Story Points</label>
                  <span className="text-[14px] font-black text-[#0061AA]">{newPoints} SP</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="13"
                  step="1"
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                  className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-[#0061AA]"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1 mt-0.5">
                  <span>1 SP</span>
                  <span>3 SP</span>
                  <span>5 SP</span>
                  <span>8 SP</span>
                  <span>13 SP</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-[13px] font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0061AA] hover:bg-blue-700 text-white rounded-xl text-[13px] font-black uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
