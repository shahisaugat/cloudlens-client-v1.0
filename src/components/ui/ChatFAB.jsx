import { useState } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-20 right-0 w-[420px] h-[580px] bg-[#FAFCFF] dark:bg-[#080B10] rounded-2xl shadow-2xl border secondary-btn-border flex flex-col mb-4 overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#F3F6FA] dark:bg-[#111827] border-b secondary-btn-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white dark:bg-[#0B0F19] rounded-xl flex items-center justify-center text-[#0061AA] dark:text-blue-400 border secondary-btn-border">
                    <Bot size={22} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-[#111827] rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-[15px] tracking-tight">CloudLens Assistant</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium uppercase tracking-widest mt-0.5">Always Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto bg-[#FAFCFF] dark:bg-[#0B0F19] flex flex-col gap-4">
              <div className="text-center">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">Today, 10:24 AM</span>
              </div>
              
              {/* Bot Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0061AA]/10 dark:bg-[#0061AA]/20 rounded-xl flex items-center justify-center text-[#0061AA] dark:text-blue-400 flex-shrink-0 mt-1">
                  <Sparkles size={16} />
                </div>
                <div className="bg-white dark:bg-[#111827] border secondary-btn-border p-3.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                  <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    Hello! I'm your Mission Control assistant. How can I help you optimize your deployments today?
                  </p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start justify-end gap-3">
                <div className="bg-[#0061AA] text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]">
                  <p className="text-[13px] leading-relaxed">
                    Can you check why the staging pipeline is failing?
                  </p>
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0061AA]/10 dark:bg-[#0061AA]/20 rounded-xl flex items-center justify-center text-[#0061AA] dark:text-blue-400 flex-shrink-0 mt-1">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-[#111827] border secondary-btn-border p-3.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                  <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    I see an issue with the <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-[#0061AA] dark:text-blue-400 text-xs">npm ci</span> step in the Node.js build workflow. It looks like a dependency conflict. Would you like me to fetch the error logs?
                  </p>
                </div>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-[#F3F6FA] dark:bg-[#111827] border-t secondary-btn-border">
              <div className="flex items-center gap-2 bg-white dark:bg-[#0B0F19] border secondary-btn-border rounded-xl pr-2 focus-within:ring-2 focus-within:ring-[#0061AA]/20 focus-within:border-[#0061AA] transition-all">
                <button className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-[#0061AA] dark:hover:text-blue-400 transition-colors ml-1 cursor-pointer">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent py-3 text-[13px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none"
                />
                <button className="w-8 h-8 bg-[#0061AA] hover:bg-[#004d8a] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-[#0061AA] text-white rounded-2xl p-4 shadow-[0_8px_20px_rgba(0,97,170,0.3)] flex items-center justify-center transition-colors hover:bg-[#004d8a]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Unread badge dot */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
}
