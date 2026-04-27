import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for solo developers",
      popular: false,
      features: [
        "1 repository",
        "7 days history",
        "Real-time feed",
        "Basic analytics",
      ],
      cta: "Get started free",
      ctaStyle: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    },
    {
      name: "Pro",
      price: "$12",
      description: "For growing engineering teams",
      popular: true,
      features: [
        "10 repositories",
        "90 days history",
        "Team insights",
        "Failure intelligence",
        "Slack alerts",
        "Priority support",
      ],
      cta: "Start free trial",
      ctaStyle: "text-white hover:brightness-90",
      ctaBg: "#0061AA",
    },
    {
      name: "Team",
      price: "$49",
      description: "For scaling organisations",
      popular: false,
      features: [
        "Unlimited repositories",
        "1 year history",
        "Everything in Pro",
        "Slack alerts",
        "API access",
        "SSO & audit logs",
      ],
      cta: "Get started",
      ctaStyle: "border border-gray-300 text-gray-900 hover:bg-gray-50",
    },
  ];

  const Check = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 shrink-0 text-teal-500"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <motion.section
      id="pricing"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-[#FAFCFF] px-6 md:px-10 py-8 md:py-12 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div className="mb-12 text-center" variants={cardVariants}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0061AA]">
            Pricing
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            Start free, scale when you're ready
          </h2>
          <p className="text-base leading-relaxed text-gray-600">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={containerVariants}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="relative rounded-2xl p-7 flex flex-col gap-6 bg-white"
              style={
                plan.popular
                  ? { border: "2px solid #0061AA" }
                  : { border: "1px solid #e5e7eb" }
              }
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                    style={{ background: "#e0f0ff", color: "#0061AA" }}
                  >
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <p className="mb-3 text-base font-bold text-gray-900">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-base text-gray-500">/ month</span>
                </div>
                <p className="text-base leading-relaxed text-gray-600">
                  {plan.description}
                </p>
              </div>

              <div className="border-t border-gray-100" />

              <ul className="flex flex-col gap-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                      <Check />
                    </div>
                    <span className="text-base font-medium text-gray-700">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-auto w-full rounded-xl py-3 text-base font-bold transition-all duration-200 ${plan.ctaStyle}`}
                style={plan.ctaBg ? { backgroundColor: plan.ctaBg } : {}}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
