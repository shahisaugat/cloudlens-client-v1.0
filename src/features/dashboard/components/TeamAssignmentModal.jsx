import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, Check, Users } from "lucide-react";
import { useGetAllTeamsQuery, useAssignTeamsMutation } from "../../../store/api/githubApi";

export const TeamAssignmentModal = ({ user, onClose, onToast }) => {
  const { data: allTeams = [], isLoading: loadingTeams } = useGetAllTeamsQuery();
  const [assignTeams, { isLoading: isAssigning }] = useAssignTeamsMutation();
  
  // Initialize with current user teams (matching by name)
  const [selectedTeamIds, setSelectedTeamIds] = useState(() => {
    const userTeamNames = user.teams || [];
    return allTeams
      .filter(t => userTeamNames.includes(t.name))
      .map(t => t.id);
  });

  // Sync state if allTeams loads after initial render
  React.useEffect(() => {
    if (allTeams.length > 0 && selectedTeamIds.length === 0) {
      const userTeamNames = user.teams || [];
      const ids = allTeams
        .filter(t => userTeamNames.includes(t.name))
        .map(t => t.id);
      setSelectedTeamIds(ids);
    }
  }, [allTeams, user.teams]);

  const toggleTeam = (id) => {
    setSelectedTeamIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await assignTeams({
        userId: user.id,
        teamIds: selectedTeamIds
      }).unwrap();
      onToast?.(`Teams updated for ${user.name}`);
      onClose();
    } catch (err) {
      onToast?.("Failed to update teams");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 text-[#0061AA] rounded-xl border border-blue-100 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">Assign Teams</h3>
              <p className="text-[12px] text-gray-500 font-medium mt-0.5">Personnel: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[450px] overflow-y-auto">
          {loadingTeams ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-50 border-t-[#0061AA]"></div>
              <p className="text-[12px] text-gray-500 font-bold">Loading Teams...</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {allTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    selectedTeamIds.includes(team.id)
                      ? "border-[#0061AA] bg-blue-50/30 ring-1 ring-[#0061AA]"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-[14px] font-bold ${selectedTeamIds.includes(team.id) ? "text-[#0061AA]" : "text-gray-900"}`}>
                      {team.name}
                    </span>
                    {team.description && (
                      <span className="text-[12px] text-gray-500 mt-1 line-clamp-1">{team.description}</span>
                    )}
                  </div>
                  {selectedTeamIds.includes(team.id) ? (
                    <div className="w-6 h-6 bg-[#0061AA] rounded-full flex items-center justify-center text-white shadow-sm animate-in zoom-in duration-200">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center text-transparent group-hover:border-[#0061AA] group-hover:text-[#0061AA]/30 transition-colors">
                      <Plus size={14} strokeWidth={2} className="text-gray-400 group-hover:text-[#0061AA]" />
                    </div>
                  )}
                </button>
              ))}
              {allTeams.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Users size={24} className="text-gray-300" />
                  </div>
                  <p className="text-[14px] text-gray-600 font-bold">No Teams Found</p>
                  <p className="text-[12px] text-gray-400 mt-1">Create teams to assign users.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isAssigning}
            className="px-5 py-2 bg-[#0061AA] text-white rounded-lg text-sm font-bold hover:bg-[#004d8a] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center min-w-[120px]"
          >
            {isAssigning ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
