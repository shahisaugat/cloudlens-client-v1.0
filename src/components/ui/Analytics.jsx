import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TrendingUp, Clock, AlertCircle } from "lucide-react";
import { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, translateY: 40 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function TiltCard({ item }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

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
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative flex items-start gap-4 rounded-2xl px-5 py-4 glass-card backdrop-blur-md border shadow-[0_4px_24px_rgba(0,97,170,0.07)] hover:shadow-xl transition-all will-change-transform"
    >
      {/* Shine layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 dark:from-white/5 to-transparent pointer-events-none"
      />

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${item.iconBg}`}
        style={{
          transform: "translateZ(30px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <item.Icon size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div
        className="flex flex-col gap-1.5"
        style={{ transform: "translateZ(20px)" }}
      >
        <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-white">
          {item.title}
        </h3>
        <p className="text-base leading-relaxed text-gray-550 dark:text-gray-300 font-medium">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Analytics() {
  const items = [
    {
      title: "Deployment frequency",
      description:
        "How often are you shipping? Track daily, weekly, and monthly deploy cadence.",
      Icon: TrendingUp,
      iconBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Mean time to recovery",
      description:
        "How fast do you recover from a failed build? One of the 4 DORA metrics, built in.",
      Icon: Clock,
      iconBg: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    },
    {
      title: "Change failure rate",
      description:
        "What percentage of your deployments cause a failure? Track it over time.",
      Icon: AlertCircle,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.2 }}
      className="analytics-section-bg px-6 md:px-10 py-8 md:py-12 lg:py-24 transition-colors duration-300"
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        <motion.div className="md:w-2/5 shrink-0" variants={cardVariants}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0061AA] dark:text-blue-400">
            Analytics
          </p>

          <h2 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            Understand your pipeline health at a glance
          </h2>

          <p className="text-base leading-relaxed text-gray-505 dark:text-gray-400">
            Go beyond pass/fail. Know your trends, your bottlenecks, and your
            team's delivery rhythm.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 md:w-3/5"
          variants={containerVariants}
        >
          {items.map((item, i) => (
            <TiltCard key={i} item={item} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
