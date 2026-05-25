import React from "react";
import { MoreVertical, ChevronRight, Clock, Pencil, Shield } from "lucide-react";

export const DirectoryRow = ({ member, statusColors, roleStyles, onToast, onEdit }) => (
  <div className="group border-b border-gray-100/50 dark:border-gray-850 last:border-0 hover:bg-gray-50/50 dark:hover:bg-[#111827]/30 transition-all duration-300">
    <div className="grid grid-cols-12 gap-6 p-6 items-center">
      {/* Member Info */}
      <div className="col-span-4 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-900 flex items-center justify-center border border-gray-200 dark:border-gray-800 overflow-hidden group-hover:scale-105 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-900/5">
            {member.avatarUrl ? (
              <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center font-black text-sm ${member.avatarBg || "bg-[#0061AA]/10 text-[#0061AA] dark:bg-blue-950/40 dark:text-blue-400"}`}>
                {member.avatar || member.name[0]}
              </div>
            )}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white dark:border-[#0B0F19] rounded-full ${statusColors[member.status] || statusColors.Inactive}`}
          />
        </div>
        <div className="min-w-0 flex flex-col">
          <span className="text-[16px] font-black text-gray-900 dark:text-white group-hover:text-[#0061AA] dark:group-hover:text-blue-400 transition-colors truncate tracking-tight">
            {member.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-400 dark:text-gray-500 font-bold truncate">
              {member.email}
            </span>
          </div>
        </div>
      </div>

      {/* Role */}
      <div className="col-span-2">
        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2 ${roleStyles[member.role] || roleStyles.Viewer}`}>
          <Shield size={10} />
          {member.role}
        </div>
      </div>

      {/* Teams */}
      <div className="col-span-2">
        <button
          onClick={() => onEdit(member)}
          className="group/teams relative flex items-center gap-2 text-left transition-all py-1"
        >
          <div className="flex flex-wrap gap-1.5">
            {member.teams?.map((team, idx) => (
              <span
                key={idx}
                className="text-[11px] font-black text-gray-400 dark:text-gray-500 group-hover/teams:text-[#0061AA] dark:group-hover/teams:text-blue-400 transition-colors uppercase tracking-tight"
              >
                {team}{idx < member.teams.length - 1 ? "," : ""}
              </span>
            ))}
            {(!member.teams || member.teams.length === 0) && (
              <span className="text-[11px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest opacity-40">Unassigned</span>
            )}
          </div>
          
          <div className="opacity-0 group-hover/teams:opacity-100 transition-all text-[#0061AA] dark:text-blue-400 hover:scale-110">
             <Pencil size={12} strokeWidth={3} />
          </div>
        </button>
      </div>

      {/* Last Active */}
      <div className="col-span-2">
        <div className="flex flex-col items-center gap-1 text-gray-900 dark:text-white">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-gray-355 dark:text-gray-600" />
            <span className="text-[13px] font-black text-gray-900 dark:text-white">
              {member.lastActive}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-550 font-bold uppercase tracking-widest">Heartbeat</span>
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-2 pr-2">
        <button
          onClick={() => onToast?.(`Options for ${member.name}`)}
          className="p-3 text-gray-450 dark:text-gray-500 hover:bg-white dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-sm"
        >
          <MoreVertical size={18} />
        </button>
        <button
          onClick={() => onToast?.(`Viewing profile: ${member.name}`)}
          className="p-3 text-[#0061AA] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-2xl transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-sm group/btn"
        >
          <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);
