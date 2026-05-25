import React from "react";

export const StatCard = ({
  label,
  value,
  delta,
  deltaGood,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all duration-300">
      <div>
        <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className={`${String(value).length > 8 ? "text-[22px]" : "text-[28px]"} font-black text-gray-900 leading-none tracking-tight`}>
          {value}
        </p>
        <p className="text-[12px] text-gray-400 font-medium mt-3">
          {subtext}
        </p>
      </div>
      <div className={`p-4 rounded-2xl ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>
    </div>
  );
};
