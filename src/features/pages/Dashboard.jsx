import React, { useState } from "react";
import {
  LayoutDashboard,
  GitBranch,
  Rocket,
  AlertTriangle,
  BarChart2,
  ShieldCheck,
  Users,
  Plug,
  Settings,
  LogOut,
  Search,
  Bell,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  ChevronDown,
  Check,
  Plus,
  ExternalLink,
  Activity,
  ArrowRight,
  Terminal,
  Video,
  CheckSquare,
  TrendingUp,
  Briefcase,
  Code,
  Layers,
  GitPullRequest,
  BookOpen,
  Cpu,
  FileText,
  DollarSign,
  Home,
  Folder,
  MessageSquare,
  Sliders,
  Hash,
  Play,
  ArrowRightLeft,
  Sun,
  Moon,
} from "lucide-react";

import {
  useGetRepositoriesQuery,
  useGetPipelinesQuery,
  useGetRunnersQuery,
  useGetIntegrationsQuery,
  useGetAuditLogsQuery,
  useGetEnvironmentStatusQuery,
} from "../../store/api/githubApi";
import { useGetMeQuery } from "../../store/api/authApi";
import { useGetMeetingsQuery, useCreateOrUpdateMeetingMutation, useDeleteMeetingMutation } from "../../store/api/meetingApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import logo from "../../assets/svgs/logo.svg";

import { ProdStrip } from "../dashboard/components/ProdStrip";
import { StatCard } from "../dashboard/components/StatCard";
import { PipelineFeed } from "../dashboard/components/PipelineFeed";
import { RunnerPanel } from "../dashboard/components/RunnerPanel";
import { IncidentFeed } from "../dashboard/components/IncidentFeed";
import { AuditLog } from "../dashboard/components/AuditLog";
import { TeamVelocity } from "../dashboard/components/TeamVelocity";
import { WebhookStatus } from "../dashboard/components/WebhookStatus";
import { EmptyState } from "../dashboard/components/EmptyState";
import { DashboardChart } from "../dashboard/components/DashboardChart";
import { DeploymentsPage } from "../dashboard/components/DeploymentsPage";
import { IncidentsPage } from "../dashboard/components/IncidentsPage";
import { IntegrationsPage } from "../dashboard/components/IntegrationsPage";
import { SettingsPage } from "../dashboard/components/SettingsPage";
import { TeamPage } from "../dashboard/components/TeamPage";
import { TeamDetailsPage } from "../dashboard/components/TeamDetailsPage";
import { AnalyticsPage } from "../dashboard/components/AnalyticsPage";
import ConfirmationModal from "../dashboard/components/ConfirmationModal";
import { MeetingsPage } from "../dashboard/components/MeetingsPage";
import { VideoRoom } from "../collaboration/VideoRoom";

import { DeveloperHubPage } from "../dashboard/components/DeveloperHubPage";
import { RepositoriesPage } from "../dashboard/components/RepositoriesPage";
import { DiscussionsPage } from "../dashboard/components/DiscussionsPage";
import { ApiSandboxPage } from "../dashboard/components/ApiSandboxPage";
import { TasksPage } from "../dashboard/components/TasksPage";
import { BacklogPage } from "../dashboard/components/BacklogPage";
import { PullRequestsPage } from "../dashboard/components/PullRequestsPage";
import { WikiPage } from "../dashboard/components/WikiPage";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPLOYMENT_NAV = [
  {
    section: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "overview" },
    ],
  },
  {
    section: "Build & Run",
    items: [
      { icon: GitBranch, label: "Pipelines", id: "pipelines", badge: 0, badgeColor: "red" },
      { icon: Rocket, label: "Deployments", id: "deployments" },
      { icon: Cpu, label: "Environments", id: "environments" },
    ],
  },
  {
    section: "Reliability & Ops",
    items: [
      { icon: AlertTriangle, label: "Incidents", id: "incidents", badge: 0, badgeColor: "amber" },
      { icon: FileText, label: "Logs & APM", id: "logs", badge: 4, badgeColor: "red" },
      { icon: ShieldCheck, label: "Security", id: "security" },
    ],
  },
  {
    section: "Insights & Cost",
    items: [
      { icon: BarChart2, label: "Analytics", id: "analytics" },
      { icon: DollarSign, label: "Cost Control", id: "cost" },
    ],
  },
  {
    section: "System",
    items: [
      { icon: Plug, label: "Integrations", id: "integrations" },
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
];

const DEVELOPMENT_NAV = [
  {
    section: "Overview",
    items: [
      { icon: Home, label: "Dashboard", id: "dev-overview" },
    ],
  },
  {
    section: "Work & Code",
    items: [
      { icon: Folder, label: "Repositories", id: "repositories" },
      { icon: CheckSquare, label: "Tasks", id: "tasks", badge: 3, badgeColor: "blue" },
      { icon: Layers, label: "Backlog", id: "backlog" },
      { icon: GitPullRequest, label: "Pull Requests", id: "prs", badge: 2, badgeColor: "green" },
    ],
  },
  {
    section: "Collaboration",
    items: [
      { icon: MessageSquare, label: "Discussions", id: "channels" },
      { icon: Users, label: "Directory", id: "team" },
      { icon: Video, label: "Video Calls", id: "calls", badge: 1, badgeColor: "green" },
    ],
  },
  {
    section: "Resources",
    items: [
      { icon: BookOpen, label: "Wiki & Docs", id: "wiki" },
      { icon: Sliders, label: "API Sandbox", id: "sandbox" },
    ],
  },
  {
    section: "System",
    items: [
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
];

const ENV_DATA = {
  prod: {
    activeCount: 0,
    successRate: "0%",
    successDelta: "—",
    avgBuild: "—",
    buildDelta: "—",
    mttr: "—",
    mttrDelta: "—",
    commit: {
      sha: "—",
      msg: "No recent activity",
      author: "—",
      ago: "—",
      pr: "—",
    },
    deployedAt: "—",
    diffFiles: 0,
    queueDepth: 0,
  },
  staging: {
    activeCount: 0,
    successRate: "0%",
    successDelta: "—",
    avgBuild: "—",
    buildDelta: "—",
    mttr: "—",
    mttrDelta: "—",
    commit: {
      sha: "—",
      msg: "No recent activity",
      author: "—",
      ago: "—",
      pr: "—",
    },
    deployedAt: "—",
    diffFiles: 0,
    queueDepth: 0,
  },
  dev: {
    activeCount: 0,
    successRate: "0%",
    successDelta: "—",
    avgBuild: "—",
    buildDelta: "—",
    mttr: "—",
    mttrDelta: "—",
    commit: {
      sha: "—",
      msg: "No recent activity",
      author: "—",
      ago: "—",
      pr: "—",
    },
    deployedAt: "—",
    diffFiles: 0,
    queueDepth: 0,
  },
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 size={13} className="text-[#97C459]" />
      {message}
    </div>
  );
}

function timeAgo(date) {
  if (!date || date === "—") return "—";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: realRunners } = useGetRunnersQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: realIntegrations } = useGetIntegrationsQuery(undefined, {
    pollingInterval: 10000,
  });
  const { data: realAuditLogs } = useGetAuditLogsQuery(undefined, {
    pollingInterval: 15000,
  });
  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: userData } = useGetMeQuery();
  const user = React.useMemo(() => {
    if (userData && userData.id) {
      return { ...reduxUser, ...userData };
    }
    return reduxUser || { fullName: "Cloud User" };
  }, [reduxUser, userData]);

  React.useEffect(() => {
    if (userData) {
      console.info("LOG: User session active for:", userData.email);
    }
  }, [userData]);
  const [activeWorkspace, setActiveWorkspace] = useState("deployment");
  const [activeNav, setRawActiveNav] = useState("overview");
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const setActiveNav = (id) => {
    if (id === "team-details" || id === "team" || id === "tasks" || id === "calls" || id === "performance" || id === "backlog" || id === "prs" || id === "wiki" || id === "dev-overview" || id === "repositories" || id === "channels" || id === "sandbox") {
      setActiveWorkspace("development");
    } else if (id === "overview" || id === "pipelines" || id === "deployments" || id === "incidents" || id === "security" || id === "analytics" || id === "integrations" || id === "environments" || id === "logs" || id === "cost") {
      setActiveWorkspace("deployment");
    }
    setRawActiveNav(id);
  };

  const handleSwitchWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    if (workspace === "deployment") {
      setRawActiveNav("overview");
    } else {
      setRawActiveNav("tasks");
    }
  };
  const [activeEnv, setActiveEnv] = useState("prod");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [timeframe, setTimeframe] = useState("7d");
  const [selectedPipelineSha, setSelectedPipelineSha] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });
  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  const [isLiveAssessment, setIsLiveAssessment] = useState(false);
  const [showLiveConfirm, setShowLiveConfirm] = useState(false);
  const [securityScore, setSecurityScore] = useState(85);
  const [warRoomActive, setWarRoomActive] = useState(false);
  const [warRoomChannel, setWarRoomChannel] = useState("cloudlens-huddle");
  const { data: meetings = [], isSuccess: meetingsLoaded } = useGetMeetingsQuery(undefined, {
    pollingInterval: 3000,
  });
  const [createOrUpdateMeeting] = useCreateOrUpdateMeetingMutation();
  const [deleteMeeting] = useDeleteMeetingMutation();

  const handleDeleteMeeting = async (id) => {
    try {
      await deleteMeeting(id).unwrap();
      showToast("Meeting successfully cancelled!");
    } catch (err) {
      console.error("Failed to cancel meeting:", err);
      showToast("Failed to cancel meeting");
    }
  };

  const { toast, show: showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle URL deep-linking for War Room
  React.useEffect(() => {
    const roomFromUrl = searchParams.get("room");
    if (roomFromUrl) {
      setWarRoomChannel(roomFromUrl);
      setWarRoomActive(true);
    }
  }, [searchParams]);

  const [meetingVerified, setMeetingVerified] = useState(false);

  // Reset verification when room changes or we leave
  React.useEffect(() => {
    if (!warRoomActive) {
      setMeetingVerified(false);
    }
  }, [warRoomActive]);

  // Automatically close war room if the meeting is ended (deleted) by the host
  React.useEffect(() => {
    if (meetingsLoaded && warRoomActive) {
      const exists = meetings.some(m => m.roomId === warRoomChannel || String(m.id) === String(warRoomChannel));
      if (exists) {
        setMeetingVerified(true);
      } else if (meetingVerified) {
        setWarRoomActive(false);
        setMeetingVerified(false);
        const params = new URLSearchParams(window.location.search);
        params.delete("room");
        setSearchParams(params);
        showToast("The meeting has been ended by the host.");
      }
    }
  }, [meetings, meetingsLoaded, warRoomActive, warRoomChannel, meetingVerified, setSearchParams]);

  const handleStartWarRoom = async () => {
    const newRoomId = `huddle-${Math.random().toString(36).substring(2, 8)}`;
    try {
      await createOrUpdateMeeting({
        title: "Instant Huddle",
        roomId: newRoomId,
        hostEmail: user?.email,
        hostName: user?.fullName || user?.email?.split('@')[0] || "Host",
        isMutedAll: false,
        isCamDisabled: false,
        isLocked: false,
        isRecording: false
      }).unwrap();
      setWarRoomChannel(newRoomId);
      setWarRoomActive(true);
      setSearchParams({ room: newRoomId });
    } catch (err) {
      console.error("Failed to start instant huddle:", err);
      showToast("Failed to start instant huddle");
    }
  };

  const handleUpdateMeeting = async (updatedMeeting) => {
    try {
      console.log("🔄 Dispatching meeting update payload:", updatedMeeting);
      const res = await createOrUpdateMeeting(updatedMeeting).unwrap();
      console.log("✅ Meeting updated successfully on backend:", res);
    } catch (err) {
      console.error("❌ Failed to update meeting:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleToggleLiveAssessment = () => {
    if (!isLiveAssessment) {
      setShowLiveConfirm(true);
    } else {
      setIsLiveAssessment(false);
      showToast("Live assessment deactivated");
    }
  };

  const confirmLiveAssessment = () => {
    setIsLiveAssessment(true);
    showToast("Live vulnerability assessment active");
  };

  React.useEffect(() => {
    let interval;
    if (isLiveAssessment) {
      interval = setInterval(() => {
        setSecurityScore((prev) => {
          // Simulate "Events / Sec" (Defense Throughput)
          // Fluctuates around a baseline (e.g., 40-60) with occasional spikes
          const baseline = 50;
          const noise = Math.random() * 10 - 5; // +/- 5 noise
          const spikeChance = Math.random() > 0.95 ? Math.random() * 30 : 0; // 5% chance of a burst
          const next = baseline + noise + spikeChance;
          return Math.min(Math.max(next, 10), 120); // Scale 10 to 120 events/sec
        });
      }, 800); // Slower, more rhythmic heartbeat
    }
    return () => clearInterval(interval);
  }, [isLiveAssessment]);

  const { data: envStatus } = useGetEnvironmentStatusQuery(
    selectedRepo
      ? {
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          environment: activeEnv,
        }
      : skipToken,
    { pollingInterval: 30000 },
  );

  const { data: repos, isLoading: reposLoading } = useGetRepositoriesQuery();

  React.useEffect(() => {
    if (repos && repos.length > 0 && !selectedRepo) {
      console.info("LOG: Initializing default repository:", repos[0].name);
      setSelectedRepo({ owner: repos[0].owner.login, name: repos[0].name });
    }
  }, [repos, selectedRepo]);

  const { data: realPipelines, isLoading: pipelinesLoading } =
    useGetPipelinesQuery(
      selectedRepo
        ? { owner: selectedRepo.owner, repo: selectedRepo.name }
        : skipToken,
    );

  React.useEffect(() => {
    const handleNavigate = (e) => {
      if (e.detail) setActiveNav(e.detail);
    };
    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, []);

  const initial = user?.fullName?.charAt(0) ?? "U";
  const envData = ENV_DATA[activeEnv];

  // Derive stats
  const activePipelinesCount = realPipelines
    ? realPipelines.filter(
        (p) =>
          p.status === "running" ||
          p.status === "queued" ||
          p.status === "waiting",
      ).length
    : 0;
  const successRate =
    realPipelines && realPipelines.length > 0
      ? `${Math.round((realPipelines.filter((p) => p.status === "success").length / realPipelines.length) * 100)}%`
      : "0%";

  const calculateAvgBuildTime = () => {
    if (!realPipelines) return "—";
    const durations = realPipelines
      .filter((p) => p.status === "success" && p.duration && p.duration !== "—")
      .map((p) => {
        const parts = p.duration.split(" ");
        let totalSec = 0;
        parts.forEach((part) => {
          if (part.endsWith("h")) totalSec += parseInt(part) * 3600;
          if (part.endsWith("m")) totalSec += parseInt(part) * 60;
          if (part.endsWith("s")) totalSec += parseInt(part);
        });
        return totalSec;
      });
    if (durations.length === 0) return "—";
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    if (avg < 60) return Math.round(avg) + "s";
    if (avg < 3600)
      return Math.round(avg / 60) + "m " + Math.round(avg % 60) + "s";
    const h = Math.floor(avg / 3600);
    const m = Math.round((avg % 3600) / 60);
    return h + "h " + m + "m";
  };

  const calculateMTTR = () => {
    if (!realPipelines || realPipelines.length < 2) return "—";
    // Simplified MTTR: average time between a failure and the next success for same workflow
    // For now, just a simplified version across all pipelines
    return "12m"; // Still slightly mocked but will improve with more data points
  };

  const avgBuildTime = calculateAvgBuildTime();
  const mttr = calculateMTTR();

  const latestPipeline =
    realPipelines && realPipelines.length > 0 ? realPipelines[0] : null;
  const latestCommit = latestPipeline
    ? {
        sha: latestPipeline.sha,
        msg: latestPipeline.commitMsg,
        author: latestPipeline.owner || selectedRepo?.owner || "CloudLens",
        ago: timeAgo(latestPipeline.time),
        pr: latestPipeline.pr,
      }
    : envData.commit;

  const queueDepth = realPipelines
    ? realPipelines.filter(
        (p) =>
          p.status === "queued" ||
          p.status === "waiting" ||
          p.status === "running",
      ).length
    : 0;
  const deployedAt = latestPipeline ? timeAgo(latestPipeline.time) : "—";
  const diffFiles = latestPipeline
    ? (parseInt(latestPipeline.sha, 16) % 15) + 1
    : 0; // Mock derived from SHA

  const dynamicEnvData = {
    ...ENV_DATA,
    [activeEnv]: {
      ...envData,
      commit: envStatus
        ? {
            sha: envStatus.sha,
            msg: envStatus.msg,
            author: envStatus.author,
            ago: timeAgo(envStatus.deployedAt),
            pr: latestCommit.pr, // Keep PR from latest pipeline for now or derive from commit
          }
        : latestCommit,
      deployedAt: envStatus ? timeAgo(envStatus.deployedAt) : deployedAt,
      queueDepth: envStatus ? envStatus.queueDepth : queueDepth,
      diffFiles: envStatus ? envStatus.diffFiles : diffFiles,
      successRate: envStatus ? envStatus.successRate : successRate,
      avgBuild: envStatus ? envStatus.avgBuild : avgBuildTime,
      mttr: envStatus ? envStatus.mttr : mttr,
    },
  };

  const calculateChartData = () => {
    if (!realPipelines) return [];
    const chartData = [];
    const now = new Date();

    if (timeframe === "24h") {
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const label = time.toLocaleTimeString([], { hour: "numeric" });

        const hourStart = new Date(time);
        hourStart.setMinutes(0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hourEnd.getHours() + 1);

        const hourPipelines = realPipelines.filter((p) => {
          const pDate = new Date(p.time);
          return pDate >= hourStart && pDate < hourEnd;
        });

        chartData.push({
          name: time.toISOString(),
          label: label,
          passed: hourPipelines.filter((p) => p.status === "success").length,
          failed: hourPipelines.filter((p) => p.status === "failed").length,
        });
      }
    } else {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        // Set to UTC midnight of i days ago
        d.setUTCHours(0, 0, 0, 0);
        d.setUTCDate(d.getUTCDate() - i);

        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", { weekday: "short" });

        const dayPipelines = realPipelines.filter((p) => {
          if (!p.time) return false;
          return p.time.split("T")[0] === dateStr;
        });

        chartData.push({
          name: dateStr,
          label: label,
          passed: dayPipelines.filter((p) => p.status === "success").length,
          failed: dayPipelines.filter((p) => p.status === "failed").length,
        });
      }
    }
    return chartData;
  };

  const dynamicChartData = calculateChartData();
  const dynamicIncidents = realPipelines
    ? realPipelines
        .filter((p) => p.status === "failed")
        .map((p, idx) => ({
          id: `fail-${p.sha}-${idx}`,
          severity: "critical",
          title: `Pipeline failed — ${p.name}`,
          detail: `${p.branch} · ${p.sha} · ${p.commitMsg}`,
          pipeline: p.name,
          count: 1,
          owner: (p.owner || "U").substring(0, 2).toUpperCase(),
          ownerColor: "#A32D2D",
          avatar: p.actorAvatar,
          actionLabel: "View logs",
          acked: false,
          ago: p.time,
        }))
    : [];

  const navigateToPipelineLogs = (sha) => {
    setActiveNav("pipelines");
    setSelectedPipelineSha(sha);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    if (!reposLoading && repos?.length === 0) {
      return (
        <EmptyState
          icon={GitBranch}
          title="No repositories found"
          description="Connect your GitHub account to start monitoring your infrastructure and CI/CD pipelines."
          actionLabel="Create Repository"
          onAction={() => window.open("https://github.com/new", "_blank")}
        />
      );
    }

    if (activeNav === "overview") {
      if (!selectedRepo) {
        return (
          <div className="h-[600px] flex items-center justify-center">
            <EmptyState
              title="Select a Repository"
              description="Please select a repository from the header to view its Mission Control telemetry."
              actionLabel="Select Repo"
              onAction={() => setShowRepoDropdown(true)}
            />
          </div>
        );
      }

      if (realPipelines && realPipelines.length === 0) {
        return (
          <div className="flex flex-col gap-6">
            <ProdStrip
              env={activeEnv}
              envData={dynamicEnvData}
              repo={selectedRepo}
            />
            <EmptyState
              icon={Activity}
              title="No Pipelines Found"
              description={`We've established a secure connection to ${selectedRepo.name}. Waiting for your first GitHub Action telemetry.`}
              actionLabel="Configure Pipelines"
              onAction={() => setActiveNav("pipelines")}
            />
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
          <ProdStrip
            env={activeEnv}
            envData={dynamicEnvData}
            repo={selectedRepo}
          />
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              label="Active pipelines"
              value={activePipelinesCount}
              delta={activePipelinesCount > 0 ? "↑ Active" : "—"}
              deltaGood
              icon={GitBranch}
              iconBg="bg-blue-50"
              iconColor="text-[#0061AA]"
              subtext="Live from GitHub"
            />
            <StatCard
              label="Success rate (7d)"
              value={successRate}
              delta={successRate !== "0%" ? "↑ Stable" : "—"}
              deltaGood
              icon={CheckCircle2}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              subtext="Across all runs"
            />
            <StatCard
              label="Avg. build time"
              value={avgBuildTime}
              delta={avgBuildTime !== "—" ? "↓ Optimal" : "—"}
              deltaGood
              icon={Clock}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              subtext="System average"
            />
            <StatCard
              label="MTTR"
              value={mttr}
              delta={mttr !== "—" ? "↓ Fast" : "—"}
              deltaGood
              icon={Zap}
              iconBg="bg-blue-50"
              iconColor="text-[#0061AA]"
              subtext="Recovery speed"
            />
          </div>
          <div className="grid grid-cols-[1.6fr_1fr] gap-6">
            <div className="flex flex-col gap-6 h-full">
              <DashboardChart
                data={dynamicChartData || []}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              />
              <IncidentFeed
                incidents={dynamicIncidents}
                onToast={showToast}
                onViewLogs={(i) =>
                  navigateToPipelineLogs(i.detail.split(" · ")[1])
                }
              />
              <TeamVelocity team={[]} />
            </div>
            <div className="flex flex-col gap-6 h-full">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col h-full">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-[18px] font-black text-gray-900 tracking-tight">
                      Security Posture
                    </h3>
                    <p className="text-[14px] text-gray-400 mt-1 font-medium">
                      Live system integrity & audits
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-[#EAF3DE] flex items-center">
                    <span className="text-[10px] font-black text-[#3B6D11] uppercase tracking-widest">
                      Protected
                    </span>
                  </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="flex flex-col gap-6 flex-1">
                  {/* Performance Metric (The Gauge) */}
                  <div className="flex items-center gap-6 py-2">
                    <div className="relative w-40 h-24 shrink-0">
                      <svg
                        viewBox="0 0 100 60"
                        className="w-full h-full overflow-visible"
                      >
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          stroke="#F3F4F6"
                          strokeWidth="7"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          stroke="#639922"
                          strokeWidth="7"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${securityScore * 0.8}, 100`}
                          className="transition-all duration-1000 ease-in-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                        <span className="text-[28px] font-black text-gray-900 leading-none">
                          {Math.round(securityScore)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-gray-400 mb-1">
                        Defense Activity
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[18px] font-black text-gray-900 leading-none">
                          Real-time
                        </span>
                        <span className="text-[12px] font-bold text-gray-400 whitespace-nowrap">
                          events per second
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Matrix (Side-by-Side) */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "SSL Shield",
                        status: "Active",
                        icon: ShieldCheck,
                        color: "text-[#639922]",
                        bg: "bg-[#F7F9F2]",
                      },
                      {
                        label: "API Vault",
                        status: "Hardened",
                        icon: Zap,
                        color: "text-blue-500",
                        bg: "bg-blue-50",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-white shadow-sm"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg} ${item.color} shrink-0`}
                        >
                          <item.icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-gray-900 truncate tracking-tight">
                            {item.label}
                          </p>
                          <p className="text-[11px] font-medium text-gray-400 leading-none">
                            {item.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-auto pt-8 flex justify-center">
                  <button className="text-[14px] text-[#0061AA] font-black hover:underline flex items-center gap-2">
                    Security Audit History →
                  </button>
                </div>
              </div>

              <RunnerPanel runners={realRunners || []} />
              <WebhookStatus
                webhooks={realIntegrations || []}
                onToast={showToast}
              />
              <AuditLog auditLog={realAuditLogs || []} />
            </div>
          </div>
        </div>
      );
    }

    if (activeNav === "pipelines") {
      return (
        <div className="flex flex-col gap-6">
          <ProdStrip env={activeEnv} envData={dynamicEnvData} />
          {realPipelines && realPipelines.length > 0 ? (
            <PipelineFeed
              pipelines={realPipelines}
              onToast={showToast}
              selectedSha={selectedPipelineSha}
              onSelect={setSelectedPipelineSha}
            />
          ) : (
            <EmptyState
              title="No Pipelines"
              description="We couldn't find any GitHub Action runs for this repository."
              actionLabel="Setup Actions"
              onAction={() =>
                window.open(
                  `https://github.com/${selectedRepo?.owner}/${selectedRepo?.name}/actions/new`,
                  "_blank",
                )
              }
            />
          )}
        </div>
      );
    }

    if (activeNav === "deployments")
      return <DeploymentsPage onToast={showToast} />;
    if (activeNav === "incidents") return <IncidentsPage onToast={showToast} />;
    if (activeNav === "analytics")
      return (
        <AnalyticsPage
          repo={selectedRepo}
          pipelines={realPipelines || []}
          chartData={dynamicChartData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      );
    if (activeNav === "team")
      return (
        <TeamPage
          onToast={showToast}
          onSelectTeam={(id) => {
            setSelectedTeamId(id);
            setActiveNav("team-details");
          }}
        />
      );
    if (activeNav === "team-details")
      return (
        <TeamDetailsPage
          teamId={selectedTeamId}
          onBack={() => setActiveNav("team")}
          onToast={showToast}
        />
      );
    if (activeNav === "integrations")
      return (
        <IntegrationsPage
          githubConnected={!!repos}
          onToast={showToast}
          userId={user?.id}
        />
      );
    if (activeNav === "settings") return <SettingsPage onToast={showToast} />;

    if (activeNav === "tasks") return <TasksPage onToast={showToast} />;

    if (activeNav === "calls") {
      return (
        <MeetingsPage
          meetings={meetings}
          user={user}
          onUpdateMeeting={handleUpdateMeeting}
          onSchedule={async (meeting) => {
            try {
              await createOrUpdateMeeting({
                ...meeting,
                hostEmail: user?.email,
                hostName: user?.fullName,
                isMutedAll: false,
                isCamDisabled: false,
                isLocked: false,
                isRecording: false
              }).unwrap();
              showToast("Meeting scheduled and invite links generated!");
            } catch (err) {
              console.error("Failed to schedule meeting:", err);
              showToast("Failed to schedule meeting");
            }
          }}
          onJoin={(roomId) => {
            setWarRoomChannel(roomId);
            setWarRoomActive(true);
            setSearchParams({ room: roomId });
          }}
          onStartInstant={handleStartWarRoom}
          onDeleteMeeting={handleDeleteMeeting}
        />
      );
    }

    if (activeNav === "performance") {
      return (
        <div className="h-[600px] flex items-center justify-center">
          <EmptyState
            icon={TrendingUp}
            title="Developer Performance"
            description="Track productivity, review times, and deployment success metrics across the team."
            actionLabel="View Metrics"
            onAction={() => showToast("Feature in development")}
          />
        </div>
      );
    }

    if (activeNav === "environments") {
      return (
        <div className="h-[600px] flex items-center justify-center animate-in fade-in duration-300">
          <EmptyState
            icon={Cpu}
            title="Environments & Infrastructure"
            description="Manage your Kubernetes clusters, serverless pools, and environments live."
            actionLabel="Provision Cluster"
            onAction={() => showToast("Feature in development")}
          />
        </div>
      );
    }

    if (activeNav === "logs") {
      return (
        <div className="h-[600px] flex items-center justify-center animate-in fade-in duration-300">
          <EmptyState
            icon={FileText}
            title="Logs & APM Observability"
            description="Query high-cardinality distributed logs, tracing spans, and system metrics in real-time."
            actionLabel="Open Query Console"
            onAction={() => showToast("Feature in development")}
          />
        </div>
      );
    }

    if (activeNav === "cost") {
      return (
        <div className="h-[600px] flex items-center justify-center animate-in fade-in duration-300">
          <EmptyState
            icon={DollarSign}
            title="FinOps Cloud Cost Control"
            description="Monitor daily AWS/GCP/Azure spending, trace cost anomalies, and review savings suggestions."
            actionLabel="Configure Budget Alert"
            onAction={() => showToast("Feature in development")}
          />
        </div>
      );
    }

    if (activeNav === "backlog") return <BacklogPage onToast={showToast} />;
    if (activeNav === "prs") return <PullRequestsPage onToast={showToast} />;
    if (activeNav === "wiki") return <WikiPage onToast={showToast} />;
    if (activeNav === "dev-overview") return <DeveloperHubPage user={user} onNavigate={setActiveNav} />;
    if (activeNav === "repositories") return <RepositoriesPage onToast={showToast} />;
    if (activeNav === "channels") return <DiscussionsPage onToast={showToast} />;
    if (activeNav === "sandbox") return <ApiSandboxPage onToast={showToast} />;

    return null;
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/20 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/20 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
        <div className="h-24 px-6 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain animate-in fade-in zoom-in duration-300" />
            <span className="text-[20px] font-black tracking-tighter text-gray-900 leading-none">
              Cloud<span className="text-[#0061AA]">Lens</span>
            </span>
          </div>

          {/* Workspace Toggle Icon Button */}
          <button
            onClick={() => handleSwitchWorkspace(activeWorkspace === "deployment" ? "development" : "deployment")}
            title={`Switch to ${activeWorkspace === "deployment" ? "Development" : "Deployment"} Workspace`}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group/toggle relative ${
              activeWorkspace === "deployment" 
                ? "bg-blue-50 text-[#0061AA] dark:text-blue-400 hover:bg-blue-100/80" 
                : "bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#EAF3DE]/80"
            }`}
          >
            {/* Active Workspace Icon (Hidden on hover, no rotation) */}
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover/toggle:opacity-0">
              {activeWorkspace === "deployment" ? (
                <Rocket size={18} strokeWidth={2.2} />
              ) : (
                <Code size={18} strokeWidth={2.2} />
              )}
            </div>

            {/* Switching Icon (Shown on hover, no rotation) */}
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover/toggle:opacity-100">
              <ArrowRightLeft size={16} strokeWidth={2.5} />
            </div>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-8 space-y-7">

          {(activeWorkspace === "deployment" ? DEPLOYMENT_NAV : DEVELOPMENT_NAV).map((section) => (
            <div key={section.section}>
              <h3 className="px-5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 relative group/nav ${isActive ? "bg-blue-50 text-[#0061AA]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1.5 h-6 rounded-r-full bg-[#0061AA]" />
                      )}
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={
                            isActive
                              ? "text-[#0061AA]"
                              : "text-gray-400 group-hover/nav:text-gray-600"
                          }
                        />
                        <span
                          className={`text-[15px] ${isActive ? "font-black" : "font-bold"}`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {item.badge > 0 && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg border ${item.badgeColor === "red" ? "bg-rose-50 text-rose-600 border-rose-100" : item.badgeColor === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" : item.badgeColor === "green" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : item.badgeColor === "amber" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-amber-50 text-amber-600 border-amber-100"} ${isActive ? "!bg-[#0061AA] !text-white !border-[#0061AA]" : ""}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 ml-80 flex flex-col min-h-screen relative z-10 pt-24">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 left-80 right-0 z-30 flex items-center justify-between px-8">
          <div className="relative group">
            <button
              onClick={() => setShowRepoDropdown(!showRepoDropdown)}
              className="flex items-center gap-3 bg-transparent px-4 py-2.5 rounded-2xl font-bold text-gray-900 hover:bg-gray-50 transition-all"
            >
              <GitBranch size={18} className="text-blue-500 shrink-0" />
              <span className="text-[16px] font-black truncate max-w-[180px] text-left">
                {selectedRepo ? selectedRepo.name : "Select Repository"}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 dark:text-gray-500 transition-transform ${showRepoDropdown ? "rotate-180" : ""}`}
              />
            </button>
            {showRepoDropdown && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white/90 backdrop-blur-2xl border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                    <Search size={14} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter projects..."
                      className="bg-transparent border-none outline-none text-[14px] text-gray-900 placeholder-gray-400 w-full font-bold"
                    />
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto py-2">
                  {repos?.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => {
                        setSelectedRepo({
                          owner: repo.owner.login,
                          name: repo.name,
                        });
                        setShowRepoDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div
                          className={`w-2 h-2 shrink-0 rounded-full ${selectedRepo?.name === repo.name ? "bg-blue-500" : "bg-gray-200"}`}
                        />
                        <span
                          className={`text-[14px] truncate ${selectedRepo?.name === repo.name ? "font-black text-gray-900" : "font-bold text-gray-500"}`}
                        >
                          {repo.name}
                        </span>
                      </div>
                      {selectedRepo?.name === repo.name && (
                        <Check size={16} className="text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl border border-gray-200">
                {["prod", "staging", "dev"].map((e) => (
                  <button
                    key={e}
                    onClick={() => setActiveEnv(e)}
                    className={`px-4 py-1.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${activeEnv === e ? "bg-white text-gray-900 shadow-sm scale-105" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-700"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-8 w-[1.5px] bg-gray-100" />
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-2xl border border-gray-200/60 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
              </button>
              <button className="w-10 h-10 rounded-2xl border border-gray-200/60 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>
            <div className="h-8 w-[1.5px] bg-gray-100" />
            <div className="flex items-center gap-4 pl-2 cursor-pointer group relative">
              <div
                className="flex items-center gap-4 group"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="flex flex-col items-end">
                  <p className="text-[14px] font-black text-gray-900 leading-tight tracking-tight group-hover:text-[#0061AA] transition-colors">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-tight">
                    Platform Admin
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0061AA] text-[14px] font-black shadow-inner border border-white group-hover:scale-105 transition-transform overflow-hidden">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Signed in as
                    </p>
                    <p className="text-[13px] font-black text-gray-900 truncate">
                      {user?.email || "user@cloudlens.dev"}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveNav("settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-[#0061AA] rounded-xl transition-all text-[14px] font-bold"
                    >
                      <Settings size={16} /> Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-[14px] font-black"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
      <Toast message={toast} />
      <ConfirmationModal
        isOpen={showLiveConfirm}
        onClose={() => setShowLiveConfirm(false)}
        onConfirm={confirmLiveAssessment}
        title="Enable Live Assessment?"
        message="Live Vulnerability Assessment requires real-time telemetry streaming and continuous dependency scanning. Enabling this may impact application performance and network latency on your local machine."
        confirmText="Enable Live Streaming"
        cancelText="Keep Offline"
        type="warning"
      />
      {warRoomActive && (() => {
        const activeMeeting = meetings.find(m => m.roomId === warRoomChannel || m.id === warRoomChannel);
        return (
          <VideoRoom 
            channelName={warRoomChannel} 
            title={activeMeeting ? activeMeeting.title : "Instant Huddle"}
            hostEmail={activeMeeting?.hostEmail}
            isMutedAll={activeMeeting?.isMutedAll || false}
            isCamDisabled={activeMeeting?.isCamDisabled || false}
            isLocked={activeMeeting?.isLocked || false}
            isRecording={activeMeeting?.isRecording || false}
            activeParticipants={activeMeeting?.activeParticipants || []}
            attendees={activeMeeting?.attendees || []}
            joinRequests={activeMeeting?.joinRequests || []}
            user={user}
            onToggleControl={(field) => {
              if (!activeMeeting) return;
              const baseField = field.startsWith('is') ? field.slice(2).charAt(0).toLowerCase() + field.slice(3) : field;
              const isField = field.startsWith('is') ? field : 'is' + field.charAt(0).toUpperCase() + field.slice(1);
              const currentValue = activeMeeting[isField] || activeMeeting[baseField] || false;
              const updatedValue = !currentValue;
              const updated = {
                ...activeMeeting,
                [isField]: updatedValue,
                [baseField]: updatedValue
              };
              handleUpdateMeeting(updated);
            }}
            onLeave={() => {
              setWarRoomActive(false);
              searchParams.delete("room");
              setSearchParams(searchParams);
            }} 
            onEndMeeting={async () => {
              if (activeMeeting) {
                try {
                  await deleteMeeting(activeMeeting.id).unwrap();
                  setWarRoomActive(false);
                  searchParams.delete("room");
                  setSearchParams(searchParams);
                  showToast("Meeting ended for everyone.");
                } catch (err) {
                  console.error("Failed to end meeting:", err);
                }
              }
            }}
          />
        );
      })()}
    </div>
  );
}
