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
        // Glass effect
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: "1px solid rgba(255, 255, 255, 0.75)",
        boxShadow:
          "0 4px 24px 0 rgba(0, 97, 170, 0.07), 0 1.5px 0 0 rgba(255,255,255,0.9) inset",
      }}
      className="rounded-2xl p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow will-change-transform"
    >
      {/* Shine layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%)",
          pointerEvents: "none",
        }}
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
        <h3 className="text-base font-bold text-gray-900">{feature.title}</h3>
        <p className="text-base leading-relaxed text-gray-500">
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
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      title: "Build time analytics",
      description:
        "Track average build duration per repo and workflow. Spot regressions before they slow your team down.",
      Icon: BarChart3,
      iconBg: "bg-teal-50 text-teal-600",
    },
    {
      title: "Flaky test detector",
      description:
        "Automatically identifies tests that fail intermittently across runs.",
      Icon: FlaskConical,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Multi-repo view",
      description: "See all pipelines across your organisation in one place.",
      Icon: GitBranch,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "Team insights",
      description: "Deploy frequency and failure rate broken down by team.",
      Icon: Users,
      iconBg: "bg-orange-50 text-orange-600",
    },
    {
      title: "Failure intelligence",
      description: "Groups similar failures and pinpoints broken commits.",
      Icon: AlertTriangle,
      iconBg: "bg-red-50 text-red-600",
    },
  ];

  return (
    <motion.section
      id="features"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.25 }}
      className="px-6 md:px-10 pt-4 pb-8 md:pt-8 md:pb-12 lg:pt-32 lg:pb-24 bg-[#FAFCFF]"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div variants={cardVariants}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0061AA]">
            Features
          </p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            Everything your team needs to ship faster
          </h2>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-600">
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
