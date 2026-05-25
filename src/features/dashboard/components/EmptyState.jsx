import React from "react";
import { Plus, Activity } from "lucide-react";

export const EmptyState = ({
  icon: Icon = Activity,
  title = "No data available",
  description = "We couldn't find any information to display here.",
  actionLabel,
  onAction,
  className = "py-20",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in-95 duration-500 ${className}`}>
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
        <Icon size={32} className="text-[#0061AA]" />
      </div>
      <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className={`text-[14px] text-gray-500 max-w-sm leading-relaxed ${actionLabel && onAction ? 'mb-8' : 'mb-0'}`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0061AA] text-white rounded-xl text-sm font-bold hover:bg-[#004d8a] transition-all"
        >
          {actionLabel.includes("Select") ? null : <Plus size={14} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
};
