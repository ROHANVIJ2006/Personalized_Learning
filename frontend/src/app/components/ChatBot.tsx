import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, MessageSquare, User } from 'lucide-react';
import { api } from '../../lib/api';
import { isAuthenticated } from '../../lib/api';

interface ChatBotProps { isOpen: boolean; onClose: () => void; onOpen: () => void; }

interface Message { role: 'user'|'assistant'; content: string; suggestions?: string[]; }

export function ChatBot({ isOpen, onClose, onOpen }: ChatBotProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hi! I\'m SkillNova\'s AI assistant, powered by the MT-KT Knowledge Tracing model. I can help with course recommendations, skill gap analysis, and learning plans. What would you like to know?',
    suggestions: ['What should I learn next?', 'Analyze my skill gaps', 'Create a study plan', 'Find free courses'],
  }]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const msg = text || message.trim();
    if (!msg || loading) return;
    if (!isAuthenticated()) {
      setMessages(prev => [...prev, { role:'user', content:msg }, { role:'assistant', content:'Please log in to use the AI assistant.' }]);
      setMessage('');
      return;
    }
    setMessage('');
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, { role:'user', content:msg }]);
    setLoading(true);
    try {
      const res = await api.chat(msg, history);
      setMessages(prev => [...prev, { role:'assistant', content:res.response, suggestions:res.suggestions }]);
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0, opacity:0 }}
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={onOpen}
            className="fixed bottom-6 right-6 z-50">
            <div className="relative">
              <motion.div animate={{ scale:[1,1.2,1], opacity:[0.5,0,0.5] }} transition={{ duration:2, repeat:Infinity }}
                className="absolute inset-0 rounded-full bg-indigo-400" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-xl flex items-center justify-center border-4 border-white">
                <MessageSquare size={26} className="text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity:0, y:20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20, scale:0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height:'520px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">SkillNova AI</p>
                  <p className="text-indigo-200 text-xs">MT-KT + DQN Powered</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={14} className="text-indigo-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2.5 text-sm`}>
                    {m.content}
                    {m.suggestions && m.role === 'assistant' && (
                      <div className="mt-2 space-y-1">
                        {m.suggestions.map((s, j) => (
                          <button key={j} onClick={() => send(s)}
                            className="block w-full text-left text-xs bg-white text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors font-medium">
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={13} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-indigo-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.div key={i} animate={{ y:[0,-4,0] }} transition={{ duration:0.6, repeat:Infinity, delay:i*0.15 }}
                        className="w-2 h-2 bg-indigo-400 rounded-full" />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex gap-2">
                <input value={message} onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={() => send()} disabled={!message.trim() || loading}
                  className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors flex-shrink-0">
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
