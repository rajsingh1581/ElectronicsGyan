'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  ChevronRight, 
  BookOpen, 
  Settings, 
  Zap, 
  ArrowLeft, 
  RefreshCw, 
  Layers, 
  Clock,
  Sparkles,
  ShieldCheck,
  BookOpenCheck,
  Search,
  Copy,
  Check,
  Sliders,
  Terminal,
  Activity,
  Award,
  BatteryCharging,
  Eye,
  CircuitBoard,
  BookOpenCheck as BookIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/AuthContext';
import ReactMarkdown from 'react-markdown';
import { STM32_CATEGORIES, STM32_LESSONS, Stm32Topic } from './stm32Data';

interface CustomTopic {
  id: string;
  name: string;
  content: string;
  youtubeUrl?: string;
  isBuiltIn?: boolean;
}

export default function Stm32TutorialPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('core_intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Dynamic custom database topics
  const [dynamicTopics, setDynamicTopics] = useState<CustomTopic[]>([]);
  const [selectedCustomTopic, setSelectedCustomTopic] = useState<CustomTopic | null>(null);

  useEffect(() => {
    fetch('/api/tutorials?stack=stm32')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const custom = data.topics.filter((t: any) => !t.isBuiltIn);
          setDynamicTopics(custom);
        }
      })
      .catch((err) => console.error('Error fetching dynamic topics:', err));
  }, []);

  const selectLesson = (lessonId: string) => {
    setActiveTab(lessonId);
    setSelectedCustomTopic(null);
  };

  const selectCustomTopic = (topic: CustomTopic) => {
    setActiveTab(topic.id);
    setSelectedCustomTopic(topic);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter lessons based on search query
  const filteredLessons = STM32_LESSONS.filter(lesson => 
    lesson.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Retrieve current active static lesson
  const currentLesson = STM32_LESSONS.find(lesson => lesson.id === activeTab);

  return (
    <div className="w-full bg-background min-h-screen text-white pb-20">
      {/* Breadcrumb Header */}
      <div className="border-b border-panel-border/30 bg-panel/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tutorial" className="hover:text-brand transition-colors">Tutorials</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">STM32 ARM</span>
          </div>
          <Link href="/tutorial" className="inline-flex items-center text-xs text-brand hover:text-brand-light font-semibold transition-all">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Tracks
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-12 bg-gradient-to-b from-panel/20 to-background border-b border-panel-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Syllabus Masterclass
                </span>
                <span className="text-xs text-gray-400">• Core Platform: Nucleo STM32L476RG</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                STM32 ARM Cortex-M <span className="text-brand">Microcontrollers</span>
              </h1>
              <p className="text-gray-400 text-base max-w-4xl leading-relaxed">
                Step-by-step firmware engineering with STM32CubeIDE & HAL. Master low-level peripherals, interrupt service routines, hardware DMA channels, and professional system clock configurations on the ultra-low-power Nucleo STM32L476RG.
              </p>
            </div>
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4 shadow-xl">
              <div className="p-3 bg-brand/10 rounded-xl">
                <Cpu className="h-8 w-8 text-brand animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Course Topics</p>
                <p className="text-sm font-bold text-white font-mono">34 Core Chapters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Topic Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search STM32 topics..."
                className="w-full pl-9 pr-4 py-2.5 bg-panel border border-panel-border/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            {/* Categorized Syllabus Outline */}
            <div className="space-y-6">
              {STM32_CATEGORIES.map((category) => {
                // Filter lessons inside this category
                const categoryLessons = filteredLessons.filter(lesson => lesson.category === category.id);
                if (categoryLessons.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 border-l-2 border-brand/40">
                      {category.name}
                    </h4>
                    <div className="space-y-1">
                      {categoryLessons.map((lesson) => {
                        const isActive = activeTab === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(lesson.id)}
                            className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border cursor-pointer ${
                              isActive 
                                ? 'bg-brand/15 border-brand/50 text-brand' 
                                : 'bg-panel/20 border-panel-border/30 text-gray-300 hover:bg-panel/40 hover:text-white'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isActive ? (
                                <Zap className="w-3.5 h-3.5 text-brand" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mx-1 my-1" />
                              )}
                            </div>
                            <span className="leading-tight">{lesson.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Contributed CMS Topics */}
              {dynamicTopics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand uppercase tracking-wider px-2 border-l-2 border-brand flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand" /> Dynamic Lessons
                  </h4>
                  <div className="space-y-1">
                    {dynamicTopics.map((topic) => {
                      const isActive = activeTab === topic.id;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => selectCustomTopic(topic)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border cursor-pointer ${
                            isActive 
                              ? 'bg-brand/15 border-brand/50 text-brand' 
                              : 'bg-panel/20 border-panel-border/30 text-gray-300 hover:bg-panel/40 hover:text-white'
                          }`}
                        >
                          <BookOpenCheck className="w-3.5 h-3.5 shrink-0 text-brand/80" />
                          <span className="leading-tight">{topic.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin CMS Tool Launcher */}
            {user?.role === 'admin' && (
              <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 space-y-3 font-sans">
                <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> CMS Administrator Mode
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  You are logged in as standard Administrator. Click below to edit custom lesson content, add YouTube telemetry embeds, or update syllabus elements.
                </p>
                <Link
                  href="/tutorial/admin"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand text-white font-bold text-xs rounded-xl hover:bg-brand-light transition-all cursor-pointer text-center"
                >
                  <Sparkles className="w-3 h-3" /> Open CMS Content Studio
                </Link>
              </div>
            )}
          </div>

          {/* Main Module Content */}
          <div className="lg:col-span-3">
            <div className="bg-panel border border-panel-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
              
              {/* Static Topic Display */}
              {currentLesson && (
                <motion.div 
                  key={currentLesson.id}
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3 }} 
                  className="space-y-6"
                >
                  {/* Title & Metadata */}
                  <div className="border-b border-panel-border/40 pb-5">
                    <span className="text-xs font-semibold text-brand tracking-widest uppercase block mb-1">
                      {STM32_CATEGORIES.find(c => c.id === currentLesson.category)?.name || 'STM32 Peripheral'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-3">
                      {currentLesson.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {currentLesson.summary}
                    </p>
                  </div>

                  {/* Theory Description (ReactMarkdown) */}
                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm sm:text-base">
                    <ReactMarkdown>{currentLesson.theory}</ReactMarkdown>
                  </div>

                  {/* Interactive Visual Theory Diagnostic Section */}
                  <div className="my-8">
                    <h3 className="text-base font-bold font-heading text-white mb-3 flex items-center gap-2">
                      <CircuitBoard className="w-5 h-5 text-brand" /> 
                      Hardware Block & Timing Diagnostics
                    </h3>
                    
                    <div className="p-6 rounded-2xl bg-background/60 border border-panel-border/80 shadow-inner">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-panel-border/20 pb-3">
                        <span className="text-[11px] font-bold text-brand font-mono uppercase bg-brand/10 px-2 py-0.5 rounded">
                          Diagnostic: {currentLesson.visualType.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-300 font-sans font-medium">{currentLesson.visualDesc}</span>
                      </div>

                      {/* Diagnostic Visualization Rendering */}
                      {currentLesson.visualType === 'register' && (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-1 justify-center bg-black/40 p-4 rounded-xl border border-panel-border/30 max-w-full overflow-x-auto">
                            {Array.from({ length: 32 }, (_, i) => 31 - i).map((bit) => (
                              <div key={bit} className="flex flex-col items-center">
                                <span className="text-[9px] text-gray-500 mb-0.5">{bit}</span>
                                <div className="w-6 h-7 bg-brand/10 border border-brand/40 flex items-center justify-center rounded text-brand text-[10px] font-mono font-bold shadow-sm">
                                  {bit % 8 === 0 || bit === 13 || bit === 5 ? '1' : '0'}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono text-center">
                            32-Bit Peripheral Register Control Mapping. Active status bits are high-lighted with active state &apos;1&apos;.
                          </p>
                        </div>
                      )}

                      {currentLesson.visualType === 'flowchart' && (
                        <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-[11px] font-mono">
                          <div className="px-3 py-1.5 bg-brand/10 border border-brand/30 rounded-lg text-brand font-bold text-center min-w-[80px]">
                            Source C
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-bold text-center min-w-[80px]">
                            GCC ARM
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                          <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-bold text-center min-w-[80px]">
                            ELF Binary
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                          <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 font-bold text-center min-w-[80px]">
                            ST-Link v2
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                          <div className="px-3 py-1.5 bg-zinc-800 border border-panel-border rounded-lg text-white font-bold text-center min-w-[80px]">
                            MCU Flash
                          </div>
                        </div>
                      )}

                      {currentLesson.visualType === 'waveform' && (
                        <div className="space-y-4">
                          <div className="w-full h-24 bg-black/60 rounded-xl relative overflow-hidden border border-panel-border/30 flex items-center justify-center p-2">
                            <svg className="w-full h-16 stroke-brand stroke-2 fill-none" viewBox="0 0 400 60">
                              <path d="M 10,45 L 60,45 L 60,15 L 140,15 L 140,45 L 220,45 L 220,15 L 300,15 L 300,45 L 390,45" />
                              {/* Dotted threshold line */}
                              <line x1="10" y1="30" x2="390" y2="30" stroke="#4B5563" strokeDasharray="4 4" />
                            </svg>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-400 font-mono px-1">
                            <span>High State (3.3V VDD)</span>
                            <span>Low State (0V GND)</span>
                          </div>
                        </div>
                      )}

                      {currentLesson.visualType === 'circuit' && (
                        <div className="p-4 bg-black/50 rounded-xl border border-panel-border/20 overflow-x-auto font-mono text-[11px] text-gray-300 leading-relaxed">
{`                  [+3.3V Rail] ──► (Internal Pullup: 40kΩ)
                                           │
                                           ├───► Input Buffer (EXTI Pin / ADC Channel)
                                           │
                  [PC13 User Button] ──────┴───► Press Button switches to GND (LOW)`}
                        </div>
                      )}

                      {currentLesson.visualType === 'pinout' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="p-3 bg-black/40 rounded-xl border border-panel-border/20">
                            <h4 className="text-brand font-bold mb-1">PA5 Output Pin</h4>
                            <p className="text-gray-400 text-[11px]">Wired directly to the onboard Green LD2 LED. High (1) triggers state ON.</p>
                          </div>
                          <div className="p-3 bg-black/40 rounded-xl border border-panel-border/20">
                            <h4 className="text-emerald-400 font-bold mb-1">PC13 Input Pin</h4>
                            <p className="text-gray-400 text-[11px]">Wired to the blue tactile button. Reads HIGH by default, LOW on press.</p>
                          </div>
                        </div>
                      )}

                      {currentLesson.visualType === 'table' && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs font-mono text-left">
                            <thead>
                              <tr className="border-b border-panel-border/30 text-gray-400">
                                <th className="pb-2 font-bold uppercase">Parameter Profile</th>
                                <th className="pb-2 font-bold uppercase">Sleep Mode</th>
                                <th className="pb-2 font-bold uppercase">Stop Mode</th>
                                <th className="pb-2 font-bold uppercase">Standby Mode</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-panel-border/20 text-gray-300">
                              <tr>
                                <td className="py-2 text-white font-bold">Power Draw</td>
                                <td className="py-2">~3.5 mA</td>
                                <td className="py-2 text-emerald-400 font-bold">~1.1 µA</td>
                                <td className="py-2 text-brand font-bold">~280 nA</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-white font-bold">Clock State</td>
                                <td className="py-2">Halted CPU</td>
                                <td className="py-2">All clocks OFF</td>
                                <td className="py-2">Volt-regulator OFF</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-white font-bold">Wake Source</td>
                                <td className="py-2">Any active ISR</td>
                                <td className="py-2">EXTI Pin / RTC</td>
                                <td className="py-2">WKUP Pin / Reset</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Nucleo STM32L476RG Hardware C Code Block */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                        <Terminal className="text-emerald-400 w-5 h-5" />
                        Nucleo STM32L476RG C Code (CubeHAL)
                      </h3>
                      <button
                        onClick={() => handleCopyCode(currentLesson.code, currentLesson.id)}
                        className="px-3.5 py-1.5 bg-background/80 hover:bg-brand/10 border border-panel-border rounded-xl text-xs font-mono font-medium text-gray-300 hover:text-brand flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedId === currentLesson.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative group">
                      <pre className="bg-background/90 p-5 rounded-2xl border border-panel-border/80 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed shadow-lg select-text max-h-[500px]">
                        <code>{currentLesson.code}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Dynamic Contributed Content Selector */}
              {selectedCustomTopic && (
                <motion.div 
                  key={selectedCustomTopic.id}
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.3 }} 
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-panel-border pb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white flex items-center gap-3">
                      <Sparkles className="text-emerald-400 h-7 w-7" />
                      {selectedCustomTopic.name}
                    </h2>
                    {user?.role === 'admin' && (
                      <Link
                        href="/tutorial/admin"
                        className="px-4 py-1.5 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Edit Topic
                      </Link>
                    )}
                  </div>

                  {/* YouTube Embed Video */}
                  {selectedCustomTopic.youtubeUrl && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-panel-border/80 bg-black/40 shadow-inner">
                      <iframe
                        src={selectedCustomTopic.youtubeUrl}
                        title={selectedCustomTopic.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Rich Text Markdown Render block */}
                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm sm:text-base">
                    <ReactMarkdown>{selectedCustomTopic.content}</ReactMarkdown>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
