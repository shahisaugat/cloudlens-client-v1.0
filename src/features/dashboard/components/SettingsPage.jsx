import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Key,
  Users,
  Database,
  Globe,
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export const SettingsPage = ({ onToast }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "team", label: "Team Members", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[25px] font-extrabold text-gray-900">Settings</h1>
        <p className="text-[15px] text-gray-500 mt-1">
          Manage your account preferences and application configuration
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white rounded-2xl border border-gray-100 p-2 shadow-sm shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all mb-1 ${activeTab === tab.id
                ? "bg-[#0061AA] text-white shadow-md shadow-blue-100"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {activeTab === "profile" && (
            <div className="p-8">
              <h2 className="text-[19px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                Personal Information
              </h2>

              <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-[#0061AA] flex items-center justify-center text-white text-[28px] font-black shadow-lg shadow-blue-100">
                  S
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900">
                    Saugat Karki
                  </h3>
                  <p className="text-[14px] text-gray-500 mb-3">
                    Administrator · San Francisco, CA
                  </p>
                  <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:border-gray-400 transition-all">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-gray-700 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Saugat Karki"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all text-[15px] font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-gray-700 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="saugat@cloudlens.io"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all text-[15px] font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-gray-700 ml-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Principal DevOps Engineer"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all text-[15px] font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-gray-700 ml-1">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA] transition-all text-[15px] font-medium bg-white">
                    <option>Pacific Time (PT) - UTC-8</option>
                    <option>Eastern Time (ET) - UTC-5</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() =>
                    onToast?.("Profile settings saved successfully")
                  }
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0061AA] text-white rounded-xl text-[14px] font-bold hover:bg-[#004d8a] transition-all shadow-md"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="p-8">
              <h2 className="text-[19px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                Security & Access
              </h2>

              <div className="space-y-6">
                {/* 2FA Section */}
                <div className="flex items-center justify-between p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-[14px] text-gray-500">
                        Protect your account with an extra layer of security.
                      </p>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-[13px] font-bold hover:bg-emerald-700 shadow-sm transition-all">
                    Enabled
                  </button>
                </div>

                {/* API Keys */}
                <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-gray-900">
                      API Keys
                    </h3>
                    <button className="text-[13px] font-bold text-[#0061AA] hover:underline flex items-center gap-1">
                      <Plus size={14} /> Generate New Key
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Key size={16} className="text-gray-400" />
                        <div>
                          <p className="text-[14px] font-bold text-gray-700">
                            Production CLI Key
                          </p>
                          <p className="text-[12px] text-gray-400">
                            Created March 12, 2026 · Last used 2h ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-200 px-2 py-1 rounded text-[12px] font-mono">
                          sk_live_••••••••4f2a
                        </code>
                        <button className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Reset */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4 max-w-sm">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14px]"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14px]"
                    />
                    <button className="px-5 py-2 bg-gray-900 text-white rounded-xl text-[13px] font-bold hover:bg-black transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-8">
              <h2 className="text-[19px] font-bold text-gray-900 mb-6 flex items-center gap-2">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Deployment Success",
                    desc: "Get notified when a production rollout completes.",
                    default: true,
                  },
                  {
                    title: "Incident Alerts",
                    desc: "Critical notifications when health-checks fail.",
                    default: true,
                  },
                  {
                    title: "Team Invites",
                    desc: "When someone adds you to a new workspace.",
                    default: false,
                  },
                  {
                    title: "Weekly Report",
                    desc: "Summary of pipeline performance and DORA metrics.",
                    default: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none"
                  >
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.default}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0061AA]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default states for others */}
          {["billing", "team"].includes(activeTab) && (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#0061AA] rounded-2xl flex items-center justify-center mb-4">
                <Database size={32} />
              </div>
              <h3 className="text-[18px] font-black text-gray-900 capitalize">
                {activeTab} Management
              </h3>
              <p className="text-[14px] text-gray-500 max-w-xs mt-2">
                This section is only available for Enterprise accounts. Upgrade
                your plan to manage {activeTab}.
              </p>
              <button className="mt-6 px-6 py-2 bg-[#0061AA] text-white rounded-xl text-[14px] font-bold flex items-center gap-2">
                View Pricing <ExternalLink size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
