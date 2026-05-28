'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, Mail, Forward, CheckCircle, FileText, RefreshCw, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function AiGirlAnimation({ isThinking }: { isThinking: boolean }) {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      {/* Outer pulsing glow rings */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: isThinking ? [0.4, 0.8, 0.4] : [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: isThinking ? 1.5 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-brand/30 rounded-full blur-md"
      />
      
      {/* Tech Ring 1 (rotates clockwise) */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full text-brand/50"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 18 20 10" fill="transparent" />
      </motion.svg>

      {/* Tech Ring 2 (rotates counter-clockwise) */}
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute w-[82%] h-[82%] text-[#809A16]/60"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="25 15" fill="transparent" />
      </motion.svg>

      {/* Futuristic Stylized Hologram Female Avatar Component */}
      <motion.div
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-7 h-7 bg-slate-905 border border-brand/40 rounded-full flex items-center justify-center overflow-hidden shadow-inner"
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full text-brand"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cybernetic Female Hair/Silhouette */}
          <path
            d="M9 14C9 8 13 6 20 6C27 6 31 8 31 14C31 18 30 20 29 22C28 23 26 24 24 24C23 21 21 16 20 16C19 16 17 21 16 24C14 24 12 23 11 22C10 20 9 18 9 14Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
          {/* Neck */}
          <path d="M18 25L18 29.5M22 25L22 29.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          
          {/* Futuristic Face Outline */}
          <path d="M14.5 16C14.5 13 17 12 20 12C23 12 25.5 13 25.5 16C25.5 19 23.5 21 20 21C16.5 21 14.5 19 14.5 16Z" fill="#0b1329" stroke="currentColor" strokeWidth="1" />
          
          {/* Holographic Glowing Eyes (Blinking Animation) */}
          <motion.circle
            cx="17.5"
            cy="15.5"
            r="1"
            fill="#a3e635"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.circle
            cx="22.5"
            cy="15.5"
            r="1"
            fill="#a3e635"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          />
          
          {/* Mouth */}
          <path d="M18.8 18.5H21.2" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
        </svg>

        {/* Dynamic scanning laser line */}
        <motion.div 
          animate={{
            y: [-12, 16, -12]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-x-0 h-[1.5px] bg-brand/50 shadow-[0_0_4px_#809A16]"
        />
      </motion.div>

      {/* Running/Thinking indicator light */}
      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-slate-900 transition-colors duration-300 ${isThinking ? 'bg-amber-400 shadow-[0_0_4px_#fbbf24]' : 'bg-emerald-500 shadow-[0_0_4px_#10b981]'}`} />
    </div>
  );
}

export default function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'form'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Kiara, your AI Design & Inquiry Expert. 👩‍💻\n\nAsk me any technical questions or specify your project details. I will help draft and submit your engineering proposal smoothly with our team of specialists.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Electronics & IoT',
    details: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // References
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll down in chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isPending) return;

    const userMsg = inputValue.trim();
    const updatedMessages = [...messages, { role: 'user', content: userMsg } as Message];
    setMessages(updatedMessages);
    setInputValue('');

    startTransition(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages })
        });
        
        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

        // Intelligent Extraction: Let's see if we can guess some details to prepopulate form!
        // We look for name, email patterns in user messages
        const textToAnalyze = updatedMessages.map(m => m.content).join(' ');
        
        // Match standard email regex
        const emailMatch = textToAnalyze.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch && !formData.email) {
          setFormData(prev => ({ ...prev, email: emailMatch[0] }));
        }

        // Check if details are mentioned
        if (userMsg.length > 30 && !formData.details) {
          setFormData(prev => ({ ...prev, details: userMsg }));
        }
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an issue connecting to the engineering mind hub. Please try asking again!'
          }
        ]);
      }
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.details.trim()) return;

    try {
      // Simulate real-world database / forwarding save call
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setFormSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      // Fallback
      setFormSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      category: 'Electronics & IoT',
      details: ''
    });
    setFormSubmitted(false);
  };

  // Compile mailto link dynamically
  const getMailToLink = () => {
    const subject = encodeURIComponent(`Engineering Enquiry: ${formData.category} - ${formData.name || 'Anonymous'}`);
    const body = encodeURIComponent(
      `Hello Electronics Gyan Team,\n\n` +
      `Here is a new project inquiry assembled through your AI Assistant:\n\n` +
      `👤 Client Name: ${formData.name}\n` +
      `✉️ Contact Email: ${formData.email}\n` +
      `📂 Project Category: ${formData.category}\n\n` +
      `📝 Project Details:\n${formData.details}\n\n` +
      `Best regards,\n${formData.name}`
    );
    return `mailto:infoelectronics.gyan@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group p-1 bg-slate-900 border border-panel-border text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen ? 'rotate-90 bg-slate-700 hover:bg-slate-600 p-4' : ''
          }`}
          aria-label="Open AI Assistant Chat"
          id="ai-chatbot-toggle-button"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <AiGirlAnimation isThinking={isPending} />
              <span className="absolute right-14 bg-slate-900 border border-slate-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-medium">
                Ask Kiara & Enquiry ⚡
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Main Chat Interface Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] bg-panel border-2 border-panel-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-w-[calc(100vw-2rem)]"
            id="ai-chatbot-window"
          >
            {/* Window Header */}
            <div className="p-4 bg-background border-b border-panel-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AiGirlAnimation isThinking={isPending} />
                <div>
                  <h3 className="font-bold text-white leading-tight flex items-center gap-1.5 text-sm">
                    Kiara — AI Engineering Expert 👩‍💻
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium">Draft dynamic engineering proposals instantly</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selection Tabs */}
            <div className="grid grid-cols-2 bg-slate-900/60 p-1 border-b border-panel-border">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-panel text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                id="ai-chatbot-tab-chat"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                AI Assistant Chat
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-panel text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                id="ai-chatbot-tab-form"
              >
                <FileText className="h-3.5 w-3.5" />
                Quick Inquiry Form
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'chat' ? (
                <>
                  {/* Messages Bubble Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap select-text ${
                            msg.role === 'user'
                              ? 'bg-brand text-white rounded-br-none'
                              : 'bg-slate-900 border border-panel-border text-gray-200 rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isPending && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900 border border-panel-border text-gray-400 rounded-2xl rounded-bl-none p-3 text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-200"></span>
                          <span className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce delay-300"></span>
                          Thinking...
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-panel-border bg-slate-900/40 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-slate-900 border border-panel-border rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                      placeholder="Ask technical design questions..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isPending}
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-brand hover:bg-brand-light text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                      disabled={!inputValue.trim() || isPending}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between h-full">
                  {!formSubmitted ? (
                    <form onSubmit={handleFormSubmit} className="space-y-3.5 flex-1 select-text">
                      <p className="text-[11px] text-gray-400 leading-relaxed bg-[#809A16]/5 border border-[#809A16]/10 p-2.5 rounded-lg">
                        Fill in this form to quick-draft an official inquiry. Your project specifications will be routed securely directly to our engineering specialists.
                      </p>
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-900 border border-panel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-slate-900 border border-panel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"
                          placeholder="example@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Project Category</label>
                        <select
                          className="w-full bg-slate-900 border border-panel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand appearance-none"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="Electronics & IoT">Electronics & IoT</option>
                          <option value="Embedded Systems">Embedded Systems</option>
                          <option value="Software & Cloud">Software & Cloud</option>
                          <option value="Mechanical & CAD">Mechanical & CAD</option>
                          <option value="Custom Bespoke Hardware">Custom Bespoke Hardware</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Requirements & Details</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full bg-slate-900 border border-panel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand resize-none"
                          placeholder="Please detail your custom hardware, PCB shape, power envelope, programming needs, or overall target specs..."
                          value={formData.details}
                          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-brand hover:bg-brand-light text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                        Instantly Submit Inquiry
                      </button>
                    </form>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">Inquiry Form Assembled!</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                          Your proposal data has been systematically structured and logged. Now, dispatch it to our engineers with one click below:
                        </p>
                      </div>

                      <div className="w-full space-y-2">
                        {/* Direct mail client dispatcher */}
                        <a
                          href={getMailToLink()}
                          className="w-full py-3 bg-[#809A16] hover:bg-[#9ab91a] text-white rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Send Email via Mail Client
                        </a>

                        <button
                          onClick={resetForm}
                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Start New Form Draft
                        </button>
                      </div>

                      <span className="text-[10px] text-gray-500">Form draft securely processed by Kiara for our design experts.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
