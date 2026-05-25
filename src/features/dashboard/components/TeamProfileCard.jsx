import React from "react";
import { Users, ArrowUpRight, X } from "lucide-react";

export const TeamProfileCard = ({ team, onToast, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative bg-white dark:bg-[#0B0F19] border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm transition-all overflow-hidden flex flex-col text-left hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 dark:focus:ring-blue-900/40"
  >
    {/* Cover Image */}
    <div className="h-24 w-full bg-gray-50 dark:bg-slate-900 relative overflow-hidden border-b border-gray-105 dark:border-gray-800">
      {team.coverImageUrl && (
        <img src={team.coverImageUrl} className="w-full h-full object-cover" alt="" />
      )}
      
      <div className="absolute top-3 right-3 px-2 py-1 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-sm">
         View Details
      </div>
    </div>

    {/* Content */}
    <div className="p-5 pt-0 relative flex-1 flex flex-col">
      {/* Avatar */}
      <div className="absolute -top-8 left-5">
        <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#0B0F19] p-1 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          {team.avatarUrl ? (
            <img src={team.avatarUrl} className="w-full h-full object-cover rounded-lg bg-gray-50 dark:bg-slate-900" alt="" />
          ) : (
            <div className="w-full h-full bg-[#0061AA] dark:bg-blue-600 flex items-center justify-center text-white font-bold text-xl rounded-lg">
              {team.name[0]}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 flex-1">
        <h3 className="text-[16px] font-bold text-gray-900 dark:text-white group-hover:text-[#0061AA] dark:group-hover:text-blue-400 transition-colors">
          {team.name}
        </h3>
        <p className="text-[13px] text-gray-505 dark:text-gray-400 mt-1 line-clamp-2">
          {team.description || "No description provided."}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Users size={14} />
          <span className="text-[12px] font-medium">{team.memberCount || 0} Members</span>
        </div>
        <div className="text-gray-400 dark:text-gray-600 group-hover:text-[#0061AA] dark:group-hover:text-blue-400 transition-colors">
          <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  </button>
);
