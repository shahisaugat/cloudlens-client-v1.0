import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, Layout, Image as ImageIcon, Type, AlignLeft, Plus, Sparkles, CheckCircle2, Users } from "lucide-react";
import { useCreateTeamMutation } from "../../../store/api/githubApi";

const AVATAR_GALLERY = [
  "https://api.dicebear.com/7.x/shapes/svg?seed=infrastructure",
  "https://api.dicebear.com/7.x/shapes/svg?seed=security",
  "https://api.dicebear.com/7.x/shapes/svg?seed=data",
  "https://api.dicebear.com/7.x/shapes/svg?seed=engineering",
  "https://api.dicebear.com/7.x/shapes/svg?seed=cloud",
  "https://api.dicebear.com/7.x/shapes/svg?seed=design",
];

const COVER_GALLERY = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
];

export const CreateTeamModal = ({ isOpen, onClose, onToast }) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatarUrl: AVATAR_GALLERY[0],
    coverImageUrl: COVER_GALLERY[0]
  });

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      onToast?.("Team name is required");
      return;
    }

    try {
      await createTeam(formData).unwrap();
      onToast?.(`Team "${formData.name}" created successfully!`);
      // Reset state for next time
      setFormData({
        name: "",
        description: "",
        avatarUrl: AVATAR_GALLERY[0],
        coverImageUrl: COVER_GALLERY[0]
      });
      onClose();
    } catch (err) {
      const errorMessage = err?.data?.message || err?.error || "Failed to create team. It might already exist.";
      onToast?.(errorMessage);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Integrated Cover & Avatar Header */}
        <div className="relative w-full h-32 bg-gray-100 group/cover border-b border-gray-200">
          <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
          
          <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer">
            <ImageIcon size={18} className="mb-1" />
            <span className="text-xs font-bold tracking-wide">Change Cover Image</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'coverImageUrl')} />
          </label>

          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-lg transition-all z-10">
            <X size={18} />
          </button>

          {/* Avatar floating on the edge */}
          <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-4 border-white bg-gray-50 overflow-hidden shadow-sm group/avatar z-10">
            <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
              <ImageIcon size={14} className="mb-0.5" />
              <span className="text-[10px] font-bold">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatarUrl')} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-12 flex flex-col gap-5">
          <div className="pb-2 border-b border-gray-100">
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">Create New Team</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">Configure your functional group workspace</p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Team Name</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="e.g. Infrastructure Ops"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Mission Statement</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea
                placeholder="Define the primary objectives..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all resize-none"
              />
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-white text-gray-700 rounded-lg text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-2.5 px-4 bg-[#0061AA] text-white rounded-lg text-sm font-bold hover:bg-[#004d8a] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} strokeWidth={2.5} />
                  Create Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
