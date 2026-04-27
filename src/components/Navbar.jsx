import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.svg";

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.04,
    },
  },
};

const linkVariants = {
  initial: { opacity: 0, y: -4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const mobileLinkVariants = {
  initial: { opacity: 0, x: -6 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = ["Features", "Pricing", "Docs", "Blog"];

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
        px-4 sm:px-6 md:px-10 py-3 md:py-4
        backdrop-blur-md bg-[#FAFCFF]/70 border-b border-gray-300/60"
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={logo}
            alt="Cloud Lens logo"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          />
          <span className="text-lg sm:text-xl font-black leading-tight">
            <span>Cloud</span> <span className="text-[#0061AA]">Lens</span>
          </span>
        </Link>
      </div>

      {/* Desktop Links */}
      <motion.div
        className="hidden md:flex items-center gap-6 lg:gap-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {navLinks.map((item) => (
          <motion.a
            key={item}
            href="#"
            className="text-sm lg:text-base font-bold text-gray-600 hover:text-gray-900 transition"
            variants={linkVariants}
            whileHover={{ y: -1 }}
          >
            {item}
          </motion.a>
        ))}
      </motion.div>

      {/* Desktop Buttons */}
      <motion.div
        className="hidden md:flex items-center gap-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={linkVariants}>
          <Link to="/login">
            <motion.button
              className="rounded-lg border border-gray-300 px-4 lg:px-6 py-2 text-sm lg:text-base font-bold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              Sign in
            </motion.button>
          </Link>
        </motion.div>

        <motion.div variants={linkVariants}>
          <Link to="/signup">
            <motion.button
              className="rounded-lg px-4 lg:px-6 py-2 text-sm lg:text-base font-bold text-white bg-[#0061AA]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              Start free
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Hamburger */}
      <motion.button
        className="md:hidden flex flex-col justify-center items-center gap-1 w-10 h-10"
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          className="h-0.5 w-6 bg-gray-800 block origin-center"
          animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="h-0.5 w-6 bg-gray-800 block"
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="h-0.5 w-6 bg-gray-800 block origin-center"
          animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-[#FAFCFF]/95 backdrop-blur-md border-b border-gray-200 md:hidden overflow-hidden"
          >
            <motion.div
              className="flex flex-col px-6 py-4 gap-4"
              variants={{
                animate: { transition: { staggerChildren: 0.04 } },
              }}
              initial="initial"
              animate="animate"
            >
              {navLinks.map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-base font-bold text-gray-700 hover:text-gray-900"
                  variants={mobileLinkVariants}
                >
                  {item}
                </motion.a>
              ))}

              <motion.div
                className="flex gap-3 pt-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2 },
                }}
              >
                <Link to="/login" className="flex-1">
                  <motion.button
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base font-bold text-gray-900 hover:bg-gray-50 transition"
                    whileTap={{ scale: 0.96 }}
                  >
                    Sign in
                  </motion.button>
                </Link>

                <Link to="/signup" className="flex-1">
                  <motion.button
                    className="w-full rounded-lg px-4 py-2 text-base font-bold text-white bg-[#0061AA]"
                    whileTap={{ scale: 0.96 }}
                  >
                    Start free
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
