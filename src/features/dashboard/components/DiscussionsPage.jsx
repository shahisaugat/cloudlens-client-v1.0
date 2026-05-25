import React, { useState } from "react";
import { Hash, Video, Send } from "lucide-react";

export function DiscussionsPage({ onToast }) {
  const [activeChannel, setActiveChannel] = useState("sprint-planning");
  const [messages, setMessages] = useState([
    { author: "saugatshahi", text: "Hey team, did we verify the GitHub Actions pipeline fix on main?", time: "11:24 AM", initial: "SS", bg: "bg-blue-50 text-[#0061AA]" },
    { author: "john_dev", text: "Yes, I just checked. All staging workflows passed successfully. It's deployed and hot-reloading correctly.", time: "11:26 AM", initial: "JD", bg: "bg-indigo-50 text-indigo-600" },
    { author: "jane_ops", text: "Excellent! I am running load tests on staging environment now. Telemetry should pop up inside the live dashboard.", time: "11:29 AM", initial: "JO", bg: "bg-amber-50 text-amber-600" },
    { author: "saugatshahi", text: "Perfect. I am going to align the active team boards next.", time: "11:30 AM", initial: "SS", bg: "bg-blue-50 text-[#0061AA]" }
  ]);
  const [inputVal, setInputVal] = useState("");

  const channelsList = [
    { name: "general", count: 0 },
    { name: "dev-chat", count: 3 },
    { name: "sprint-planning", count: 0 },
    { name: "github-webhook", count: 12 },
    { name: "incident-room", count: 0 }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages([
      ...messages,
      { author: "saugatshahi", text: inputVal, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), initial: "SS", bg: "bg-blue-50 text-[#0061AA]" }
    ]);
    setInputVal("");
    onToast("Message sent to channel!");
  };

  return (
    <div className="h-[650px] bg-white rounded-2xl border border-gray-100 shadow-sm flex overflow-hidden animate-in fade-in duration-300">
      {/* Inner Sidebar */}
      <div className="w-64 border-r border-gray-100 flex flex-col shrink-0 bg-gray-50/25">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-[14px] font-black text-gray-900 tracking-tight">Team Channels</h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Sprint Discussions</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {channelsList.map((channel, i) => {
            const isActive = activeChannel === channel.name;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveChannel(channel.name);
                  onToast(`Switched to #${channel.name}`);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${isActive ? "bg-blue-50 text-[#0061AA] font-black" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold"}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Hash size={14} className={isActive ? "text-[#0061AA]" : "text-gray-400"} />
                  <span className="text-[13px] truncate">{channel.name}</span>
                </div>
                {channel.count > 0 && !isActive && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500 text-white leading-none shrink-0">
                    {channel.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-[#0061AA]" />
            <span className="text-[14px] font-black text-gray-900 tracking-tight">{activeChannel}</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1" />
            <span className="text-[11px] font-bold text-gray-400">4 members active</span>
          </div>
          <button 
            onClick={() => onToast("Starting dynamic team call...")}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[12px] font-bold flex items-center gap-2 border border-gray-100 transition-colors"
          >
            <Video size={13} /> Call Channel
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/10">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-4 animate-in slide-in-from-bottom-2 duration-100">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-[12px] shadow-sm ${msg.bg}`}>
                {msg.initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-black text-gray-900">@{msg.author}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{msg.time}</span>
                </div>
                <p className="text-[13px] text-gray-600 mt-1 font-medium leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-[13px] font-medium focus:outline-none focus:border-[#0061AA] transition-all bg-gray-50/50"
            />
            <button 
              type="submit"
              className="px-4 py-3 bg-[#0061AA] hover:bg-blue-700 text-white rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={12} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
