import { motion } from "framer-motion";

const AVATARS = [
  { initials: "AK", bg: "#E6F1FB", color: "#185FA5" },
  { initials: "SR", bg: "#E1F5EE", color: "#0F6E56" },
  { initials: "MJ", bg: "#EEEDFE", color: "#534AB7" },
  { initials: "NP", bg: "#FAEEDA", color: "#854F0B" },
];

const btnClass =
  "rounded-lg border border-gray-300 bg-[#FAFCFF] px-8 py-3 text-base font-bold text-gray-900 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50";

const primaryBtnClass =
  "rounded-lg bg-[#0061AA] px-8 py-3 text-base font-bold text-white transition-all duration-200 hover:bg-[#004f8a] hover:shadow-md active:scale-[0.98]";

const BRAND = {
  primary: "#0061AA",
  cardBg: "#FAFCFF",
  headerBg: "#F3F6FA",
  border: "#D6E6F7",
};

const TITLE_MAP = {
  dashboard: "app.cloudlens.dev — Dashboard",
  settings: "app.cloudlens.dev — Settings",
  audit: "app.cloudlens.dev — Audit Logs",
};

const STATS = [
  {
    label: "Total runs today",
    value: "142",
    sub: "↑ 12% from yesterday",
    subColor: "text-green-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-5 h-5"
      >
        <path
          d="M13 10V3L4 14h7v7l9-11h-7z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-[#DCEBFA] text-[#0061AA]",
  },
  {
    label: "Success rate",
    value: "91.4%",
    sub: "↑ 3.2% this week",
    subColor: "text-green-600",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-5 h-5"
      >
        <path
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-[#DCEBFA] text-[#0061AA]",
  },
  {
    label: "Avg build time",
    value: "2m 34s",
    sub: "↑ 18s slower",
    subColor: "text-red-500",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" />
      </svg>
    ),
    iconBg: "bg-[#DCEBFA] text-[#0061AA]",
  },
  {
    label: "Last deploy",
    value: "14min ago",
    sub: "main → production",
    subColor: "text-gray-500",
    valueSize: "text-xl",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-5 h-5"
      >
        <path
          d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconBg: "bg-[#DCEBFA] text-[#0061AA]",
  },
];

const PIPELINES = [
  {
    name: "api-service",
    branch: "main",
    hash: "a3f92bc",
    time: "just now",
    status: "running",
    duration: "1m 12s",
    statusBg: "bg-yellow-50 text-yellow-700",
  },
  {
    name: "frontend",
    branch: "feat/auth",
    hash: "9d14ef1",
    time: "2min ago",
    status: "passed",
    duration: "3m 04s",
    statusBg: "bg-green-50 text-green-700",
  },
  {
    name: "worker-service",
    branch: "dev",
    hash: "c77a209",
    time: "8min ago",
    status: "failed",
    duration: "1m 22s",
    statusBg: "bg-red-50 text-red-700",
  },
  {
    name: "infra-deploy",
    branch: "main",
    hash: "f02bb31",
    time: "1hr ago",
    status: "passed",
    duration: "6m 48s",
    statusBg: "bg-green-50 text-green-700",
  },
];

const LAYERS = [
  { scale: 1.1, x: 0, y: 0, rotate: 0, z: 30 },
  { scale: 1.02, x: -20, y: -55, rotate: -7, z: 20 },
  { scale: 0.97, x: 25, y: -85, rotate: 2.5, z: 10 },
];

const STATUS_ICON_MAP = {
  running: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-3 h-3"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round"
      />
    </svg>
  ),
  passed: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="w-3 h-3"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  failed: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="w-3 h-3"
    >
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
};

const StatusIcon = ({ status }) => STATUS_ICON_MAP[status] ?? null;

const Card = ({ stats, pipelines, variant = "dashboard", desktop = false }) => (
  <div
    className="w-full max-w-sm sm:max-w-none sm:w-[calc(90vw+16px)] md:w-[90vw] lg:w-[64vw] rounded-2xl border shadow-lg overflow-hidden will-change-transform"
    style={{
      background: BRAND.cardBg,
      borderColor: BRAND.border,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: "translateZ(0)",
    }}
  >
    {/* Titlebar */}
    <div
      className={`flex items-center px-6 border-b ${desktop ? "h-13" : "h-12"}`}
      style={{ background: BRAND.headerBg, borderColor: BRAND.border }}
    >
      <div className="flex items-center gap-1.5">
        <div
          className={`rounded-full bg-red-500 ${desktop ? "w-3.5 h-3.5" : "w-3 h-3"}`}
        />
        <div
          className={`rounded-full bg-yellow-500 ${desktop ? "w-3.5 h-3.5" : "w-3 h-3"}`}
        />
        <div
          className={`rounded-full bg-green-600 ${desktop ? "w-3.5 h-3.5" : "w-3 h-3"}`}
        />
      </div>
      <span className="ml-auto text-sm font-semibold tracking-wide text-gray-600">
        {TITLE_MAP[variant]}
      </span>
    </div>

    <div className={desktop ? "p-7" : "p-6"}>
      {/* Stat cards */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 ${desktop ? "gap-5 mb-6" : "gap-4 mb-5"}`}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-lg bg-[#FAFCFF] border flex items-start ${desktop ? "p-5 gap-4" : "p-4 gap-3"}`}
            style={{ borderColor: BRAND.border }}
          >
            <div
              className={`rounded-md flex items-center justify-center shrink-0 ${s.iconBg} ${desktop ? "w-11 h-11" : "w-10 h-10"}`}
            >
              {s.icon}
            </div>
            <div>
              <div
                className={`font-medium text-gray-500 mb-1 ${desktop ? "text-sm" : "text-xs"}`}
              >
                {s.label}
              </div>
              <div
                className={`font-bold text-gray-900 mb-1 ${desktop ? (s.valueSize ?? "text-2xl") : (s.valueSize ?? "text-2xl")}`}
              >
                {s.value}
              </div>
              <div
                className={`${s.subColor} ${desktop ? "text-sm" : "text-xs"}`}
              >
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: BRAND.border }}
      >
        <div
          className={`font-semibold ${desktop ? "px-7 py-3.5 text-base" : "px-6 py-3 text-sm"}`}
          style={{
            background: BRAND.headerBg,
            color: BRAND.primary,
            borderBottom: `1px solid ${BRAND.border}`,
          }}
        >
          Live pipeline feed
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {[
                "Pipeline",
                "Branch",
                "Commit",
                "Duration",
                "When",
                "Status",
              ].map((col) => (
                <th
                  key={col}
                  className={`text-left font-medium text-gray-400 uppercase ${desktop ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs"}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pipelines.map((p) => (
              <tr key={p.name} className="hover:bg-gray-50">
                <td
                  className={`font-semibold ${desktop ? "px-6 py-4 text-base" : "px-4 py-3 text-sm"}`}
                >
                  {p.name}
                </td>
                <td
                  className={`${desktop ? "px-6 py-4 text-sm" : "px-4 py-3 text-xs"}`}
                >
                  {p.branch}
                </td>
                <td
                  className={`text-gray-400 ${desktop ? "px-6 py-4 text-sm" : "px-4 py-3 text-xs"}`}
                >
                  {p.hash}
                </td>
                <td
                  className={`${desktop ? "px-6 py-4 text-sm" : "px-4 py-3 text-sm"}`}
                >
                  {p.duration}
                </td>
                <td
                  className={`text-gray-400 ${desktop ? "px-6 py-4 text-sm" : "px-4 py-3 text-sm"}`}
                >
                  {p.time}
                </td>
                <td className={`${desktop ? "px-6 py-4" : "px-4 py-3"}`}>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full font-medium ${p.statusBg} ${desktop ? "text-sm px-3 py-1.5" : "text-xs px-2 py-1"}`}
                  >
                    <StatusIcon status={p.status} />
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default function HeroWithPreview() {
  const badgeVariants = {
    hidden: { opacity: 0, translateY: 28 },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: { duration: 0.55, delay: 0.05, ease: "easeOut" },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, translateY: 28 },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: { duration: 0.55, delay: 0.15, ease: "easeOut" },
    },
  };

  const descVariants = {
    hidden: { opacity: 0, translateY: 28 },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: { duration: 0.55, delay: 0.25, ease: "easeOut" },
    },
  };

  const buttonsVariants = {
    hidden: { opacity: 0, translateY: 28 },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: { duration: 0.55, delay: 0.35, ease: "easeOut" },
    },
  };

  const avatarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, delay: 0.5, ease: "easeOut" },
    },
  };

  // Card stack animations - cards come from corners with full opacity
  const cardVariants = (index) => ({
    hidden: {
      opacity: 0,
      x: index === 0 ? 0 : index === 1 ? -80 : 80,
      y: 120,
      rotate: index === 0 ? 0 : index === 1 ? -8 : 5,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: LAYERS[index].x,
      y: LAYERS[index].y,
      rotate: LAYERS[index].rotate,
      scale: LAYERS[index].scale,
      transition: {
        duration: 0.8,
        delay: 0.6 + index * 0.12,
        ease: "easeOut",
      },
    },
  });

  return (
    <div className="bg-[#FAFCFF]">
      {/* ── HERO TEXT — all breakpoints ── */}
      <section className="px-6 md:px-10 pt-24 md:pt-28 pb-10 md:pb-8 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={badgeVariants}
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{ background: "#e0f0ff", color: "#0061AA" }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[#0061AA]" />
            Now with multi-repo support
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="mb-3 text-4xl font-bold leading-tight tracking-normal text-gray-900 md:text-5xl lg:text-6xl"
          >
            Your CI/CD pipelines, finally under control
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={descVariants}
            className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg"
          >
            Real-time pipeline visibility, failure intelligence, and team
            analytics — without the complexity of enterprise tools.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={buttonsVariants}
            className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4"
          >
            <button type="button" className={`${btnClass} w-full sm:w-auto`}>
              Connect GitHub — it's free
            </button>
            <button
              type="button"
              className={`${primaryBtnClass} w-full sm:w-auto`}
            >
              See live demo
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={avatarVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5"
          >
            <div className="flex">
              {AVATARS.map((av, i) => (
                <div
                  key={av.initials}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold"
                  style={{
                    background: av.bg,
                    color: av.color,
                    marginLeft: i === 0 ? 0 : -10,
                  }}
                >
                  {av.initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              Trusted by 200+ engineering teams
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── TABLET PREVIEW (sm–lg) ── */}
      <div className="hidden sm:flex sm:justify-center sm:items-center lg:hidden py-12">
        <Card stats={STATS} pipelines={PIPELINES} variant="dashboard" />
      </div>

      {/* ── DESKTOP PREVIEW (lg+) — using DashboardPreview structure ── */}
      <div className="hidden lg:flex relative h-160 lg:pt-26 items-start justify-center">
        {LAYERS.map((l, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants(i)}
            className="absolute"
            style={{
              zIndex: l.z,
              backfaceVisibility: "hidden",
            }}
          >
            <Card
              stats={STATS}
              pipelines={PIPELINES}
              variant={i === 1 ? "settings" : i === 2 ? "audit" : "dashboard"}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
