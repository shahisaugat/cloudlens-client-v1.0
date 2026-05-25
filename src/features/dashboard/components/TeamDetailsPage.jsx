import React from "react";
import { 
  ArrowLeft, 
  Users, 
  Trash2, 
  Calendar, 
  Shield, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Clock,
  MoreVertical
} from "lucide-react";
import { useGetTeamDetailsQuery, useDeleteTeamMutation } from "../../../store/api/githubApi";
import { useGetMeQuery } from "../../../store/api/authApi";
import ConfirmationModal from "./ConfirmationModal";

export const TeamDetailsPage = ({ teamId, onBack, onToast }) => {
  const { data: team, isLoading, isError } = useGetTeamDetailsQuery(teamId);
  const { data: currentUser } = useGetMeQuery();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-blue-50 border-t-[#0061AA] rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Analyzing Team Data...</p>
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-bold">Team not found or access denied.</p>
        <button onClick={onBack} className="mt-4 text-[#0061AA] font-bold flex items-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteTeam(teamId).unwrap();
      onToast("Team deleted successfully");
      onBack();
    } catch (err) {
      onToast(err.data?.message || "Failed to delete team");
    }
  };

  const isOwner = currentUser?.id?.toString() === team.createdById;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm"
        >
          <div className="p-2 rounded-xl group-hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Directory
        </button>

        {isOwner && (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-100 transition-all border border-rose-100"
          >
            <Trash2 size={16} />
            Delete Team
          </button>
        )}
      </div>

      {/* Team Profile Header */}
      <div className="relative mb-8">
        {/* Cover Image */}
        <div className="h-48 rounded-2xl bg-gradient-to-br from-[#0061AA] to-blue-400 overflow-hidden relative">
          {team.coverImageUrl && (
            <img src={team.coverImageUrl} alt="" className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute -bottom-6 left-10 flex items-end gap-6">
          <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-2xl border border-gray-100">
            <div className="w-full h-full rounded-[2.1rem] bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
              {team.avatarUrl ? (
                <img src={team.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users size={40} className="text-[#0061AA]" />
              )}
            </div>
          </div>
          <div className="mb-6 flex flex-col gap-1">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-white drop-shadow-sm tracking-tight">{team.name}</h1>
                <div className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                   Active Team
                </div>
             </div>
             <p className="text-white/80 font-bold text-sm">{team.description || "No description provided."}</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-[1fr_380px] gap-8 mt-16">
        {/* Members List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div>
              <h3 className="text-[18px] font-black text-gray-900 tracking-tight">Team Directory</h3>
              <p className="text-[13px] text-gray-400 font-medium mt-1">
                {team.members?.length || 0} active collaborators in this group
              </p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                  {team.members?.slice(0, 5).map((m, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-black text-[#0061AA] overflow-hidden">
                      {m.avatarUrl ? <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" /> : m.name[0]}
                    </div>
                  ))}
                  {team.members?.length > 5 && (
                    <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400">
                      +{team.members.length - 5}
                    </div>
                  )}
               </div>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {team.members?.map((member) => (
              <div key={member.id} className="group flex items-center justify-between p-6 hover:bg-gray-50/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden group-hover:scale-105 transition-transform">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-sm text-[#0061AA]">{member.name[0]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black text-gray-900 group-hover:text-[#0061AA] transition-colors tracking-tight">
                      {member.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-gray-300" />
                      <span className="text-[12px] text-gray-400 font-medium">{member.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0061AA] text-[10px] font-black uppercase tracking-wider border border-blue-100">
                      {member.role}
                    </span>
                    <span className="text-[11px] text-gray-300 font-medium mt-1">Team Member</span>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-gray-100 transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
            {(!team.members || team.members.length === 0) && (
              <div className="py-20 text-center">
                <Users size={40} className="text-gray-100 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No members assigned yet</p>
                <p className="text-gray-400 text-[11px] mt-1">Use the Directory tab to assign users to this team.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          {/* Ownership Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-widest mb-6">Management</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 text-[#0061AA] rounded-2xl">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-gray-900 tracking-tight">Team Owner</p>
                  <p className="text-[12px] text-gray-500 font-medium">{team.creatorName || "System Admin"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-gray-900 tracking-tight">Created On</p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    {team.createdAt ? new Date(team.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }) : "Recently"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
                  <ExternalLink size={20} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-gray-900 tracking-tight">External ID</p>
                  <p className="text-[11px] font-mono text-gray-400">TEAM_REF_{team.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#0061AA] rounded-2xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Activity Score</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter">98.2</span>
              <span className="text-[14px] font-bold opacity-80">Health</span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-[13px] font-bold">
                <span className="opacity-60">Avg. MTTR</span>
                <span>12m 40s</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Destroy Team Instance?"
        message={`This will permanently remove the "${team.name}" group and unassign all ${team.members?.length || 0} members. This action is irreversible and will be logged in the audit trail.`}
        confirmText={isDeleting ? "Destroying..." : "Confirm Destruction"}
        type="danger"
      />
    </div>
  );
};
