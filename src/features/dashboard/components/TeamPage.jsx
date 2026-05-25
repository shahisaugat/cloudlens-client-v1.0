import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  Clock,
  ChevronRight,
  UserCheck,
  Settings,
  ArrowUpRight,
  Plus,
  X,
} from "lucide-react";
import { useGetTeamQuery, useGetAllTeamsQuery } from "../../../store/api/githubApi";
import { EmptyState } from "./EmptyState";
import { TeamAssignmentModal } from "./TeamAssignmentModal";
import { CreateTeamModal } from "./CreateTeamModal";
import { StatCard } from "./StatCard";
import { DirectoryRow } from "./DirectoryRow";
import { TeamProfileCard } from "./TeamProfileCard";

const ROLE_STYLES = {
  Admin: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
  ADMIN: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
  Maintainer: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
  Developer: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40",
  Viewer: "bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800",
  User: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
  USER: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/40",
};

const STATUS_COLORS = {
  Active: "bg-emerald-500",
  Away: "bg-amber-500",
  Inactive: "bg-gray-300",
};

export const TeamPage = ({ onToast, onSelectTeam }) => {
  const [view, setView] = useState("DIRECTORY"); // DIRECTORY | TEAMS
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  
  const { data: team = [], isLoading: membersLoading } = useGetTeamQuery(null, {
    pollingInterval: 30000
  });

  const { data: allTeams = [], isLoading: teamsLoading } = useGetAllTeamsQuery();

  const filteredMembers = team.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "All" || 
      (activeTab === "Admins" && member.role === "Admin") ||
      (activeTab === "Devs" && member.role === "Developer");

    return matchesSearch && matchesTab;
  });

  if (membersLoading || teamsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0061AA]"></div>
      </div>
    );
  }

  const activeCount = team.filter(m => m.status === 'Active').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Workspace Hub <span className="text-gray-300 dark:text-gray-700 font-light">/</span> 
            <span className="text-gray-900 dark:text-white">{view === "DIRECTORY" ? "Member Directory" : "Functional Groups"}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {view === "DIRECTORY" 
              ? "Manage your global workspace members and access rights" 
              : "Organize members into specialized teams and departments"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {view === "DIRECTORY" ? (
            <button
              onClick={() => onToast?.("Inviting new member")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0061AA] text-white rounded-lg text-sm font-bold hover:bg-[#004d8a] transition-all"
            >
              <UserPlus size={16} /> Invite Member
            </button>
          ) : (
            <button
              onClick={() => setShowCreateTeam(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0061AA] text-white rounded-lg text-sm font-bold hover:bg-[#004d8a] transition-all"
            >
              <Plus size={16} /> New Team
            </button>
          )}
          <button
            onClick={() => onToast?.("Hub Configuration")}
            className="p-2 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Thoughtful Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-slate-900/60 w-fit rounded-xl border border-gray-200/60 dark:border-gray-800">
        <button
          onClick={() => setView("DIRECTORY")}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
            view === "DIRECTORY" 
              ? "bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white shadow-sm border border-gray-250 dark:border-gray-700" 
              : "text-gray-500 hover:text-gray-750 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800"
          }`}
        >
          Directory
        </button>
        <button
          onClick={() => setView("TEAMS")}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
            view === "TEAMS" 
              ? "bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white shadow-sm border border-gray-250 dark:border-gray-700" 
              : "text-gray-500 hover:text-gray-750 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800"
          }`}
        >
          Teams
        </button>
      </div>

      {view === "DIRECTORY" ? (
        <div className="flex flex-col gap-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        {[
          {
            label: "Total Personnel",
            value: team.length,
            sub: "Workspace capacity",
            icon: Users,
            color: "text-[#0061AA] dark:text-blue-400",
            bg: "bg-blue-50/50 dark:bg-blue-950/30",
          },
          {
            label: "Active Nodes",
            value: activeCount,
            sub: "Current heartbeat",
            icon: UserCheck,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50/50 dark:bg-emerald-950/30",
          },
          {
            label: "Security Clearance",
            value: team.filter(m => m.role === 'Admin').length,
            sub: "Admin privileges",
            icon: Shield,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50/50 dark:bg-purple-950/30",
          },
          {
            label: "Member Health",
            value: "100%",
            sub: "System integrity",
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50/50 dark:bg-amber-950/30",
          },
        ].map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            subtext={stat.sub}
            icon={stat.icon}
            iconColor={stat.color}
            iconBg={stat.bg}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden">
        {/* List Header/Filters */}
        <div className="p-8 border-b border-gray-100/60 dark:border-gray-850 flex items-center justify-between flex-wrap gap-6 bg-gray-50/20 dark:bg-gray-900/10">
          <div className="flex items-center gap-8">
            <div>
              <h2 className="text-[18px] font-black text-gray-900 dark:text-white tracking-tight">
                Personnel Directory
              </h2>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Global Workspace</p>
            </div>
            <div className="flex gap-1.5 p-1 bg-gray-100/50 dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-gray-800/60">
              {["All", "Admins", "Devs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${activeTab === tab ? "bg-white dark:bg-[#1A2333] text-[#0061AA] dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-750" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-650 group-focus-within:text-[#0061AA] dark:group-focus-within:text-blue-400 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search personnel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-5 py-3 bg-white dark:bg-[#111827] border border-gray-200/60 dark:border-gray-800 rounded-2xl text-[14px] w-72 focus:outline-none focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-950/30 focus:border-blue-100 dark:focus:border-blue-900 transition-all font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#111827] text-gray-650 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800 rounded-2xl text-[14px] font-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="px-8 py-4 bg-gray-50/50 dark:bg-[#111827]/40 border-b border-gray-100 dark:border-gray-850">
          <div className="grid grid-cols-12 gap-6 items-center">
            <div className="col-span-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Personnel Member
            </div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Security Role
            </div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Assigned Teams
            </div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
              Last Heartbeat
            </div>
            <div className="col-span-2 text-right text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pr-4">
               Operations
            </div>
          </div>
        </div>

        {/* Members Table */}
          <div className="flex flex-col">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <DirectoryRow
                  key={member.id}
                  member={member}
                  statusColors={STATUS_COLORS}
                  roleStyles={ROLE_STYLES}
                  onToast={onToast}
                  onEdit={setEditingUser}
                />
              ))
            ) : (
              <div className="py-20">
                <EmptyState 
                  icon={Users}
                  title="No members found"
                  description={searchQuery ? `No results for "${searchQuery}". Try a different search term.` : "Your team members will appear here once they join."}
                  actionLabel="Invite Member"
                  onAction={() => onToast?.("Inviting new member")}
                />
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="p-6 bg-gray-50/30 dark:bg-[#111827]/20 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between">
            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-bold">
              Showing {filteredMembers.length} <span className="text-gray-300 dark:text-gray-700 font-normal mx-1">of</span> {team.length} members
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-[13px] font-black text-gray-400 dark:text-gray-600 cursor-not-allowed">
                Previous
              </button>
              <button className="px-5 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-[13px] font-black text-[#0061AA] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="flex flex-col gap-8">
          {allTeams.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {allTeams.map((t) => (
                <TeamProfileCard 
                  key={t.id} 
                  team={t} 
                  onToast={onToast} 
                  onClick={() => onSelectTeam?.(t.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0B0F19] border border-gray-105 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <EmptyState 
                icon={Users}
                title="No Functional Teams Defined"
                description="Organize your workspace members into specialized groups for better coordination and reporting."
                actionLabel="Create Your First Team"
                onAction={() => setShowCreateTeam(true)}
              />
            </div>
          )}
        </div>
      )}

      {editingUser && (
        <TeamAssignmentModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onToast={onToast}
        />
      )}

      <CreateTeamModal
        isOpen={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        onToast={onToast}
      />
    </div>
  );
};
