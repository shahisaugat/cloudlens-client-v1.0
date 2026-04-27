import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat bubble */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col mb-4"
        >
          <div className="bg-[#0061AA] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with us</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <p className="text-gray-600 text-sm">
              Welcome! How can we help you today?
            </p>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>
      )}

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0061AA] hover:brightness-90 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition duration-200"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
