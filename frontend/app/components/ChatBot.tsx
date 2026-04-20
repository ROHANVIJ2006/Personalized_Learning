import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  BookOpen, 
  Target, 
  Calendar, 
  Lightbulb,
  Sparkles,
  Bot,
  MessageSquare
} from 'lucide-react';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function ChatBot({ isOpen, onClose, onOpen }: ChatBotProps) {
  const [message, setMessage] = useState('');

  const quickActions = [
    { icon: BookOpen, label: 'Recommend courses' },
    { icon: Target, label: 'Skill gap analysis' },
    { icon: Calendar, label: 'Create schedule' },
    { icon: Lightbulb, label: 'Project ideas' },
  ];

  const suggestions = [
    "What should I learn next?",
    "Help me with Python",
    "Create a learning plan",
    "Find courses for React"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 z-50 group"
          >
            <div className="relative">
              {/* Animated pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-indigo-400"
              />
              
              {/* Main button */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-xl flex items-center justify-center border-4 border-white group-hover:shadow-2xl transition-shadow">
                <MessageSquare size={28} className="text-white" />
                
                {/* Online indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-full h-full bg-green-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[480px] h-[600px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">NOVA Assistant</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white/90 text-xs font-medium">Online & Ready</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50">
              {/* Welcome Message */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium mb-1">Hello! I'm NOVA, your AI learning assistant.</p>
                    <p className="text-xs text-gray-600">I can help you find courses, analyze your skills, create learning plans, and answer questions about your learning journey.</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Sparkles size={14} className="text-indigo-500" />
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={idx}
                        className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-indigo-50 rounded-lg transition-all hover:shadow-sm border border-gray-200 hover:border-indigo-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Icon size={18} className="text-indigo-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Try asking:</h4>
                <div className="space-y-2">
                  {suggestions.slice(0, 2).map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-3 py-2 bg-white hover:bg-indigo-50 rounded-lg text-xs text-gray-700 border border-gray-200 hover:border-indigo-200 transition-all"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <h4 className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1 uppercase tracking-wide">
                  <Sparkles size={12} className="text-indigo-600" />
                  I can help with:
                </h4>
                <ul className="space-y-1.5 text-xs text-indigo-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    Course recommendations based on your goals
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    Analyzing skill gaps and suggesting paths
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    Creating personalized learning schedules
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                    Project ideas to practice new skills
                  </li>
                </ul>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask NOVA anything about your learning..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      // Handle send
                      setMessage('');
                    }
                  }}
                />
                <button 
                  className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center text-white shadow-sm transition-all hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!message.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
