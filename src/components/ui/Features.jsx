import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  BarChart3,
  FlaskConical,
  GitBranch,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useRef } from "react";

/* -------------------- ANIMATIONS -------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      mass: 0.8,
    },
  },
};

/* -------------------- TILT CARD -------------------- */

function TiltCard({ feature }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const springConfig = { stiffness: 180, damping: 20 };
  const rX = useSpring(rotateX, springConfig);
  const rY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative rounded-2xl p-6 flex flex-col gap-4 glass-card backdrop-blur-md border shadow-[0_4px_24px_rgba(0,97,170,0.07)] hover:shadow-xl transition-all will-change-transform"
    >
      {/* Shine layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 dark:from-white/5 to-transparent pointer-events-none"
      />

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${feature.iconBg}`}
        style={{
          transform: "translateZ(40px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <feature.Icon size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div
        className="flex flex-col gap-1.5"
        style={{ transform: "translateZ(30px)" }}
      >
        <h3 className="text-base font-bold text-gray-900 dark:text-white">{feature.title}</h3>
        <p className="text-base leading-relaxed text-gray-550 dark:text-gray-300 font-medium">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

/* -------------------- MAIN -------------------- */

export default function Features() {
  const features = [
    {
      title: "Real-time pipeline feed",
      description:
        "Live status updates via WebSockets. See builds start and finish without refreshing the page.",
      Icon: Activity,
      iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
    },
    {
      title: "Build time analytics",
      description:
        "Track average build duration per repo and workflow. Spot regressions before they slow your team down.",
      Icon: BarChart3,
      iconBg: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-450",
    },
    {
      title: "Flaky test detector",
      description:
        "Automatically identifies tests that fail intermittently across runs.",
      Icon: FlaskConical,
      iconBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450",
    },
    {
      title: "Multi-repo view",
      description: "See all pipelines across your organisation in one place.",
      Icon: GitBranch,
      iconBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-450",
    },
    {
      title: "Team insights",
      description: "Deploy frequency and failure rate broken down by team.",
      Icon: Users,
      iconBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-450",
    },
    {
      title: "Failure intelligence",
      description: "Groups similar failures and pinpoints broken commits.",
      Icon: AlertTriangle,
      iconBg: "bg-red-50 dark:bg-rose-950/40 text-red-600 dark:text-rose-450",
    },
  ];

  return (
    <motion.section
      id="features"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.25 }}
      className="px-6 md:px-10 pt-4 pb-8 md:pt-8 md:pb-12 lg:pt-32 lg:pb-24 bg-[#FAFCFF] dark:bg-[#080B10] transition-colors duration-300"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div variants={cardVariants}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0061AA] dark:text-blue-400">
            Features
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            Everything your team needs to ship faster
          </h2>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-650 dark:text-gray-400">
            Built for engineering teams who care about speed and reliability.
          </p>
        </motion.div>

        {/* GRID */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {features.map((f, i) => (
            <TiltCard key={i} feature={f} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
