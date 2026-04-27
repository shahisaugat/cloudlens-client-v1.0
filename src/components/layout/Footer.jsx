import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../../assets/svgs/logo.svg";

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const navLinks = [
    {
      label: "Product",
      links: ["Features", "Pricing", "Changelog", "Roadmap"],
    },
    {
      label: "Developers",
      links: [
        "Documentation",
        "API reference",
        "Webhooks",
        "GitHub app",
        "Open source",
      ],
    },
    {
      label: "Company",
      links: ["About", "Blog", "Careers", "Security", "Contact"],
    },
  ];

  const socialLinks = [
    { icon: <FaGithub size={15} />, label: "GitHub" },
    { icon: <FaTwitter size={15} />, label: "Twitter" },
    { icon: <FaLinkedin size={15} />, label: "LinkedIn" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-[#FAFCFF] border-t border-gray-200 px-6 md:px-10 pt-14 pb-9"
    >
      <div className="mx-auto max-w-5xl">
        {/* Top grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12"
        >
          {/* Brand column */}
          <motion.div variants={itemVariants}>
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Cloud Lens logo"
                className="h-8 w-8 object-contain shrink-0"
              />
              <span className="text-lg font-black leading-tight">
                <span className="font-black">Cloud</span>{" "}
                <span className="font-black text-[#0061AA]">Lens</span>
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 mb-5 text-base leading-relaxed text-gray-600 max-w-52">
              Real-time CI/CD observability for engineering teams who ship fast
              and fix faster.
            </p>

            {/* Social buttons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Nav link columns */}
          {navLinks.map((col) => (
            <motion.div key={col.label} variants={itemVariants}>
              <p className="mb-4 text-md font-[1000] tracking-wide text-gray-900">
                {col.label}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-base font-medium leading-relaxed text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-6" />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Mini logo + copyright */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Cloud Lens logo"
              className="h-4 w-4 object-contain shrink-0"
            />
            <span className="text-sm font-medium text-gray-600">
              © 2025 Cloud Lens. All rights reserved.
            </span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookie settings"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
