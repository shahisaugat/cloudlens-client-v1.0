import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export const ScheduleModal = ({ onClose, onSchedule }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [invitees, setInvitees] = useState("");

  const get24hTime = () => {
    let h = parseInt(hour, 10);
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${minute}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({
      meetingId: `meet-${Math.random().toString(36).substr(2, 9)}`,
      title,
      date,
      time: get24hTime(),
      attendees: invitees.split(",").map(i => i.trim()).filter(Boolean),
      roomId: `huddle-${Math.random().toString(36).substr(2, 6)}`
    });
  };

  return createPortal(
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Schedule Meeting</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-2">Meeting Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. Weekly Sync" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-2">Date</label>
            <input required value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-2">Time</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={hour}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  if (v === '' || (parseInt(v) >= 0 && parseInt(v) <= 12)) setHour(v);
                }}
                onBlur={() => {
                  let h = parseInt(hour, 10);
                  if (isNaN(h) || h < 1) h = 12;
                  if (h > 12) h = 12;
                  setHour(String(h).padStart(2, '0'));
                }}
                className="w-14 bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-[16px] font-bold text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all"
              />
              <span className="text-[18px] font-black text-gray-400">:</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={minute}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  if (v === '' || (parseInt(v) >= 0 && parseInt(v) <= 59)) setMinute(v);
                }}
                onBlur={() => {
                  let m = parseInt(minute, 10);
                  if (isNaN(m) || m < 0) m = 0;
                  if (m > 59) m = 59;
                  setMinute(String(m).padStart(2, '0'));
                }}
                className="w-14 bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-[16px] font-bold text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all"
              />
              <div className="flex rounded-xl border border-gray-200 overflow-hidden ml-1">
                <button
                  type="button"
                  onClick={() => setPeriod("AM")}
                  className={`px-4 py-3 text-[13px] font-bold transition-all ${
                    period === "AM"
                      ? "bg-[#0061AA] text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("PM")}
                  className={`px-4 py-3 text-[13px] font-bold transition-all ${
                    period === "PM"
                      ? "bg-[#0061AA] text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-500 mb-2">Invite Members (Emails)</label>
            <input value={invitees} onChange={(e) => setInvitees(e.target.value)} type="text" placeholder="team@company.com, sarah@company.com" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all" />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full py-3.5 bg-[#0061AA] text-white rounded-2xl text-[14px] font-bold hover:bg-[#004d8a] transition-all">
              Schedule & Generate Link
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
