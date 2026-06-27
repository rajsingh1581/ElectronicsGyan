'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  BookOpen, 
  Code2, 
  ArrowLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  Zap, 
  Play, 
  Cpu, 
  RotateCcw,
  SlidersHorizontal,
  Eye,
  Settings,
  Flame,
  Binary,
  Search,
  Award,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
  HelpCircle,
  Loader2,
  Bookmark,
  Layers,
  Activity,
  CpuIcon,
  ToggleLeft,
  LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getTrackTopicsCatalog, CatalogChapter, CatalogTopic } from '@/lib/catalogGenerators';
import { generateDynamicLesson } from '@/lib/lessonGenerator';

interface CourseTrackViewerProps {
  track: 'python' | 'rtos' | 'stm32' | 'arduino' | 'raspberry-pi' | 'c' | 'cpp';
  title: string;
  badge: string;
  colorName: 'amber' | 'blue' | 'emerald' | 'cyan' | 'rose' | 'indigo' | 'violet';
}

export default function CourseTrackViewer({ track, title, badge, colorName }: CourseTrackViewerProps) {
  const catalog = useMemo(() => getTrackTopicsCatalog(track), [track]);

  // Selected states
  const [selectedChapter, setSelectedChapter] = useState<CatalogChapter>(catalog[0]);
  const [selectedTopic, setSelectedTopic] = useState<CatalogTopic>(catalog[0].topics[0]);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({ [catalog[0].id]: true });

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'code' | 'quiz' | 'chat'>('theory');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Course Progress tracking (persists to localStorage)
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      const saved = localStorage.getItem(`${track}_course_progress`);
      if (saved) {
        try {
          setCompletedTopics(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCompletedTopics({});
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [track]);

  const toggleTopicCompletion = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...completedTopics,
      [topicId]: !completedTopics[topicId]
    };
    setCompletedTopics(updated);
    localStorage.setItem(`${track}_course_progress`, JSON.stringify(updated));
  };

  // Lesson caches & auto-generator fallback
  const activeLesson = useMemo(() => {
    return generateDynamicLesson(
      track,
      selectedChapter.number,
      selectedChapter.name,
      selectedTopic.id,
      selectedTopic.name,
      selectedTopic.desc
    );
  }, [track, selectedTopic, selectedChapter]);

  // Dynamic Simulator Trace controls - declared here to avoid use-before-define error
  const [activeTraceStep, setActiveTraceStep] = useState<number>(0);

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Clear states when topic changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuizAnswers({});
      setQuizSubmitted(false);
      setActiveTraceStep(0);
    }, 0);
    return () => clearTimeout(timeout);
  }, [selectedTopic]);

  // Chat/AI Tutor side-panel state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Initialize welcome message for each track
  useEffect(() => {
    const timeout = setTimeout(() => {
      setChatMessages([
        { sender: 'ai', text: `Hi! I am your AI ${title} Tutor. Ask me any advanced engineering questions, register maps questions, compilation tips, or design best practices about **${selectedTopic.name}**!` }
      ]);
    }, 0);
    return () => clearTimeout(timeout);
  }, [selectedTopic, title]);

  // Interaction feedback states
  const [copied, setCopied] = useState<boolean>(false);

  // Chat bottom ref
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync scroll for chatbot
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Ask AI Chatbot query
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track,
          topicName: selectedTopic.name,
          chapterName: selectedChapter.name,
          messages: [
            ...chatMessages.map(m => ({ sender: m.sender, text: m.text })),
            { sender: 'user', text: userMsg }
          ]
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an issue compiling a response. Please verify your internet connection.' }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to the AI Tutor server.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Copy code utility
  const copyCodeToClipboard = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper calculation for total progress
  const totalTopicsCount = catalog.reduce((acc, chap) => acc + chap.topics.length, 0);
  const completedTopicsCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  // Search Filtered Catalog
  const filteredCatalog = catalog.map(chap => {
    const matchingTopics = chap.topics.filter(topic => 
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...chap,
      topics: matchingTopics,
      hasMatches: matchingTopics.length > 0 || chap.name.toLowerCase().includes(searchQuery.toLowerCase())
    };
  }).filter(chap => chap.hasMatches);

  // --- Track-Specific Interactive States & Controls ---
  // New Theory Interactive States
  const [rtosTaskAPriority, setRtosTaskAPriority] = useState<number>(3);
  const [rtosTaskBPriority, setRtosTaskBPriority] = useState<number>(2);
  const [rtosTaskCPriority, setRtosTaskCPriority] = useState<number>(1);
  const [rtosInheritanceActive, setRtosInheritanceActive] = useState<boolean>(false);

  const [pythonRefCount, setPythonRefCount] = useState<number>(1);
  const [pythonRefAliases, setPythonRefAliases] = useState<string[]>(['data_structure']);

  const [stm32RegisterBits, setStm32RegisterBits] = useState<number[]>([0,0,1,0, 0,1,0,0, 1,0,0,0, 0,0,0,1]); // 16 bits ODR register

  const [arduinoPwmFreq, setArduinoPwmFreq] = useState<number>(50); // Hz
  const [arduinoPwmDuty, setArduinoPwmDuty] = useState<number>(40); // %

  const [piMailboxValue, setPiMailboxValue] = useState<number>(5);
  const [piMailboxHistory, setPiMailboxHistory] = useState<string[]>(['System Boot completed. Cores initialized.']);
  const [piMailboxTransmitting, setPiMailboxTransmitting] = useState<boolean>(false);

  // Python States
  const [indentSpaces, setIndentSpaces] = useState<number>(4);
  const [typedInput, setTypedInput] = useState<string>('3.14');
  const [castType, setCastType] = useState<'str' | 'int' | 'float' | 'bool'>('float');
  const [virtualList, setVirtualList] = useState<string[]>(['DHT22', 'MQ135', 'BMP280']);
  const [inputListItem, setInputListItem] = useState<string>('');

  const appendToList = () => {
    const trimmed = inputListItem.trim();
    if (trimmed && virtualList.length < 5) {
      setVirtualList(prev => [...prev, trimmed]);
      setInputListItem('');
    }
  };

  // RTOS States
  const [rtosTasks, setRtosTasks] = useState<Array<{ id: string, name: string, state: 'Running' | 'Ready' | 'Blocked', priority: number }>>([
    { id: '1', name: 'TelemetryTask', state: 'Running', priority: 3 },
    { id: '2', name: 'SensorPolling', state: 'Ready', priority: 2 },
    { id: '3', name: 'LoggingDaemon', state: 'Blocked', priority: 1 },
  ]);
  const [rtosQueue, setRtosQueue] = useState<string[]>(['ADC_DATA', 'WIFI_STATE']);
  const [queueInput, setQueueInput] = useState<string>('');

  const pushToRtosQueue = () => {
    if (queueInput.trim() && rtosQueue.length < 5) {
      setRtosQueue(prev => [...prev, queueInput.trim()]);
      setQueueInput('');
    }
  };

  // STM32 States
  const [gpioState, setGpioState] = useState<boolean[]>([false, true, false, false, true, false, false, false]);
  const [adcValue, setAdcValue] = useState<number>(2048);
  const [clockPrescaler, setClockPrescaler] = useState<number>(16);

  // Arduino States
  const [ledOn, setLedOn] = useState<boolean>(false);
  const [potVoltage, setPotVoltage] = useState<number>(3.3);

  // Color mappings
  const colorMap = {
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      accent: 'bg-amber-400',
      hover: 'hover:bg-amber-300',
      badge: 'border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-yellow-500/5',
      selection: 'selection:bg-amber-400 selection:text-neutral-900',
      tabActive: 'bg-amber-400 text-neutral-950',
    },
    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      accent: 'bg-blue-400',
      hover: 'hover:bg-blue-300',
      badge: 'border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-indigo-500/5',
      selection: 'selection:bg-blue-400 selection:text-neutral-900',
      tabActive: 'bg-blue-400 text-neutral-950',
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      accent: 'bg-emerald-400',
      hover: 'hover:bg-emerald-300',
      badge: 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-teal-500/5',
      selection: 'selection:bg-emerald-400 selection:text-neutral-900',
      tabActive: 'bg-emerald-400 text-neutral-950',
    },
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      accent: 'bg-cyan-400',
      hover: 'hover:bg-cyan-300',
      badge: 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/5',
      selection: 'selection:bg-cyan-400 selection:text-neutral-900',
      tabActive: 'bg-cyan-400 text-neutral-950',
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      accent: 'bg-rose-400',
      hover: 'hover:bg-rose-300',
      badge: 'border-rose-500/30 bg-gradient-to-r from-rose-500/20 to-red-500/5',
      selection: 'selection:bg-rose-400 selection:text-neutral-900',
      tabActive: 'bg-rose-400 text-neutral-950',
    },
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      accent: 'bg-indigo-400',
      hover: 'hover:bg-indigo-300',
      badge: 'border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/5',
      selection: 'selection:bg-indigo-400 selection:text-neutral-900',
      tabActive: 'bg-indigo-400 text-neutral-950',
    },
    violet: {
      text: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      accent: 'bg-violet-400',
      hover: 'hover:bg-violet-300',
      badge: 'border-violet-500/30 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/5',
      selection: 'selection:bg-violet-400 selection:text-neutral-900',
      tabActive: 'bg-violet-400 text-neutral-950',
    },
  };

  const cls = colorMap[colorName] || colorMap.amber;

  return (
    <div id={`track-${track}-viewer`} className={`w-full bg-background min-h-screen text-white pb-20 ${cls.selection}`}>
      {/* Breadcrumbs Header */}
      <div id="breadcrumbs-bar" className="border-b border-panel-border/30 bg-panel/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className={`hover:${cls.text} transition-colors`}>Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tutorial" className={`hover:${cls.text} transition-colors`}>Tutorials</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{title} Complete Syllabus</span>
          </div>
          <Link href="/tutorial" className={`inline-flex items-center text-xs ${cls.text} hover:opacity-90 font-semibold transition-all`}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Tracks
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <section id="hero-section" className="py-12 bg-gradient-to-b from-panel/20 to-background border-b border-panel-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 ${cls.bg} ${cls.text} border ${cls.border} rounded-full text-xs font-semibold uppercase tracking-wider`}>
                  {badge}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Over 1,000 Topics Ready
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                {title} <span className={cls.text}>Full Masterclass Syllabus</span>
              </h1>
              <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
                Study our exhaustive dynamic curriculum of 1,025 modules. View diagnostic execution traces, complete knowledge validation quizzes, consult with your AI Tutor, and track study milestones on-the-fly!
              </p>
            </div>
            
            {/* Progress Panel */}
            <div className="p-5 bg-panel border border-panel-border rounded-2xl shrink-0 flex flex-col justify-between w-full md:w-64 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Course Progress</p>
                <span className={`text-xs font-mono font-bold ${cls.text} ${cls.bg} px-2 py-0.5 rounded-full`}>{progressPercent}%</span>
              </div>
              <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-panel-border/50 mb-3">
                <div style={{ width: `${progressPercent}%` }} className={`${cls.accent} h-full transition-all duration-500`} />
              </div>
              <p className="text-[10px] text-gray-500 font-mono leading-normal">
                Completed {completedTopicsCount} of {totalTopicsCount} topics across all chapters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Application Workspace Grid */}
      <section id="workspace-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Syllabus Navigator */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Search Input */}
            <div className="bg-panel border border-panel-border p-4 rounded-2xl shadow-md space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={`Search 1,000+ ${title} topics...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-panel-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Curriculum Chapters Accordion */}
            <div className="bg-panel border border-panel-border rounded-2xl overflow-hidden max-h-[600px] overflow-y-auto shadow-md">
              <div className="p-4 bg-background/50 border-b border-panel-border/40 flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <BookOpen className={`w-4 h-4 ${cls.text}`} /> Curriculum Directory
                </h3>
                <span className="text-[10px] bg-panel border border-panel-border text-gray-400 px-2 py-0.5 rounded font-mono">25 Chapters</span>
              </div>

              <div className="divide-y divide-panel-border/30">
                {filteredCatalog.map((chap) => {
                  const isExpanded = !!expandedChapters[chap.id];
                  return (
                    <div key={chap.id} className="transition-colors">
                      <button
                        onClick={() => setExpandedChapters(prev => ({ ...prev, [chap.id]: !prev[chap.id] }))}
                        className="w-full p-4 flex items-center justify-between hover:bg-background/20 text-left transition-all"
                      >
                        <div className="pr-3">
                          <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${cls.text}`}>Chapter {chap.number}</span>
                          <h4 className="text-xs font-bold text-white leading-snug">{chap.name}</h4>
                          <p className="text-[10px] text-gray-500 leading-normal line-clamp-1 mt-0.5">{chap.summary}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                      </button>

                      {isExpanded && (
                        <div className="bg-background/30 px-2 py-2 divide-y divide-panel-border/10">
                          {chap.topics.map((topic) => {
                            const isSelected = selectedTopic.id === topic.id;
                            const isCompleted = !!completedTopics[topic.id];
                            return (
                              <div
                                key={topic.id}
                                onClick={() => {
                                  setSelectedChapter(chap);
                                  setSelectedTopic(topic);
                                }}
                                className={`group p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${isSelected ? 'bg-panel border border-panel-border/60 shadow-inner' : 'hover:bg-panel/40 border border-transparent'}`}
                              >
                                <button
                                  onClick={(e) => toggleTopicCompletion(topic.id, e)}
                                  className="mt-0.5 text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer"
                                  title="Mark as completed"
                                >
                                  <CheckCircle2 className={`w-4.5 h-4.5 ${isCompleted ? 'text-emerald-400 fill-emerald-400/10' : 'text-gray-600'}`} />
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] font-mono font-semibold text-gray-500">Topic {chap.number}.{topic.id.split('_t')[1]}</span>
                                    {isCompleted && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold uppercase">✓ Done</span>}
                                  </div>
                                  <h5 className={`text-[11px] font-bold mt-0.5 transition-colors ${isSelected ? cls.text : 'text-gray-300 group-hover:text-white'}`}>{topic.name}</h5>
                                  <p className="text-[10px] text-gray-500 mt-0.5 leading-normal line-clamp-2">{topic.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredCatalog.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-xs">
                    No chapters or topics match your search queries.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar quick sandbox link */}
            <div className={`p-5 rounded-2xl border relative overflow-hidden ${cls.badge}`}>
              <h4 className="text-sm font-bold text-white mb-1.5">Executable Sandboxed Compiler</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                Test and execute raw scripts, input custom arguments via standard input, and experience rapid platform compiles with our compilers!
              </p>
              <Link 
                href="/compiler"
                className={`inline-flex w-full items-center justify-center py-2.5 bg-background hover:${cls.text} text-gray-300 font-bold text-xs rounded-xl border border-panel-border transition-all cursor-pointer`}
              >
                Open Sandbox Compiler <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* RIGHT PANELS: Topic Workspaces */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active module information card */}
            <div className="bg-panel border border-panel-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${cls.text}`}>
                  Chapter {selectedChapter.number} • Topic {selectedTopic.id.split('_t')[1]}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">{selectedTopic.name}</h2>
                <p className="text-xs text-gray-400 mt-1">{selectedTopic.desc}</p>
              </div>

              {/* Action tabs selectors */}
              <div className="bg-background p-1.5 border border-panel-border rounded-xl flex self-start sm:self-center shrink-0">
                {(['theory', 'simulation', 'code', 'quiz', 'chat'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${activeTab === tab ? cls.tabActive : 'text-gray-400 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace Accordion bodies */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedTopic.id}-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="bg-panel border border-panel-border rounded-2xl overflow-hidden min-h-[480px] flex flex-col justify-between shadow-lg"
              >
                {/* TAB CONTENT 1: THEORY TEXT - WORDPRESS METHOD INTERACTIVE DESIGN */}
                {activeTab === 'theory' && (
                  <div className="flex-1 flex flex-col justify-between overflow-y-auto max-h-[600px] select-text">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
                      {/* Left: Beautifully formatted Wordpress-style content (7 cols) */}
                      <div className="lg:col-span-7 space-y-6 prose prose-invert prose-sm leading-relaxed">
                        <div className="bg-background/20 border border-panel-border/30 rounded-xl p-4 flex items-start gap-3">
                          <Sparkles className={`w-5 h-5 shrink-0 ${cls.text} mt-0.5 animate-pulse`} />
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Interactive Syllabus Guide</span>
                            <p className="text-[11px] text-gray-300 leading-normal mt-0.5 font-sans">
                              Study the theory below. Adjust parameters on the **Interactive Visualization Panel** to the right to see the core concepts behave in real-time.
                            </p>
                          </div>
                        </div>
                        
                        <div className="wordpress-body">
                          <ReactMarkdown>{activeLesson.theory}</ReactMarkdown>
                        </div>
                      </div>

                      {/* Right: Interactive Sidebar Board (5 cols) */}
                      <div className="lg:col-span-5 space-y-6">
                        
                        {/* Interactive Widget Box */}
                        <div className="bg-background/50 border border-panel-border rounded-xl p-5 shadow-inner space-y-4">
                          <div className="flex items-center justify-between border-b border-panel-border/20 pb-2.5">
                            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                              <Sliders className={`w-4 h-4 ${cls.text}`} /> Live Concept Simulator
                            </h4>
                            <span className="text-[9px] bg-panel border border-panel-border text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest">Active</span>
                          </div>

                          {/* Track-Specific Interactive Theory Widget Panels */}
                          {track === 'rtos' && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-gray-400 leading-normal">
                                Adjust priority levels below and toggle **Priority Inheritance** to see how the Scheduler allocates CPU cycles dynamically.
                              </p>
                              
                              <div className="space-y-3 bg-panel/30 p-3.5 border border-panel-border/40 rounded-lg">
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-bold text-rose-400">Task A (High Priority)</span>
                                    <span className="font-mono text-gray-400">Priority: {rtosTaskAPriority}</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="5" step="1" value={rtosTaskAPriority} 
                                    onChange={(e) => setRtosTaskAPriority(parseInt(e.target.value, 10))}
                                    className="w-full accent-rose-400"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-bold text-amber-400">Task B (Medium Priority)</span>
                                    <span className="font-mono text-gray-400">Priority: {rtosTaskBPriority}</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="5" step="1" value={rtosTaskBPriority} 
                                    onChange={(e) => setRtosTaskBPriority(parseInt(e.target.value, 10))}
                                    className="w-full accent-amber-400"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-bold text-blue-400">Task C (Low Priority)</span>
                                    <span className="font-mono text-gray-400">Priority: {rtosTaskCPriority}</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="5" step="1" value={rtosTaskCPriority} 
                                    onChange={(e) => setRtosTaskCPriority(parseInt(e.target.value, 10))}
                                    className="w-full accent-blue-400"
                                  />
                                </div>

                                <div className="border-t border-panel-border/10 pt-2 flex items-center justify-between">
                                  <span className="text-[10px] text-gray-300 font-bold">Priority Inheritance</span>
                                  <button 
                                    onClick={() => setRtosInheritanceActive(!rtosInheritanceActive)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${rtosInheritanceActive ? 'bg-emerald-400 text-neutral-900 shadow' : 'bg-background text-gray-400 border border-panel-border'}`}
                                  >
                                    {rtosInheritanceActive ? 'ENABLED' : 'DISABLED'}
                                  </button>
                                </div>
                              </div>

                              {/* Simulated Preemption Bar chart */}
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase block">Estimated CPU Timeline schedule</span>
                                <div className="h-6 w-full rounded bg-panel/60 border border-panel-border/50 overflow-hidden flex font-mono text-[9px] font-bold">
                                  {rtosTaskAPriority > rtosTaskBPriority && rtosTaskAPriority > rtosTaskCPriority ? (
                                    <>
                                      <div className="bg-rose-500 text-white h-full flex items-center justify-center transition-all duration-300" style={{ width: '60%' }}>Task A (High)</div>
                                      <div className="bg-amber-500 text-neutral-900 h-full flex items-center justify-center transition-all duration-300" style={{ width: '25%' }}>Task B</div>
                                      <div className="bg-blue-500 text-white h-full flex items-center justify-center transition-all duration-300" style={{ width: '15%' }}>Task C</div>
                                    </>
                                  ) : rtosTaskBPriority > rtosTaskCPriority ? (
                                    <>
                                      <div className="bg-amber-500 text-neutral-900 h-full flex items-center justify-center transition-all duration-300" style={{ width: '50%' }}>Task B (High)</div>
                                      <div className="bg-rose-500 text-white h-full flex items-center justify-center transition-all duration-300" style={{ width: '35%' }}>Task A</div>
                                      <div className="bg-blue-500 text-white h-full flex items-center justify-center transition-all duration-300" style={{ width: '15%' }}>Task C</div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="bg-blue-500 text-white h-full flex items-center justify-center transition-all duration-300" style={{ width: '50%' }}>Task C (High)</div>
                                      <div className="bg-rose-500 text-white h-full flex items-center justify-center transition-all duration-300" style={{ width: '25%' }}>Task A</div>
                                      <div className="bg-amber-500 text-neutral-900 h-full flex items-center justify-center transition-all duration-300" style={{ width: '25%' }}>Task B</div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {track === 'python' && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-gray-400 leading-normal">
                                Manage pointer variables and simulate active reference counts dynamically.
                              </p>

                              <div className="bg-panel/30 border border-panel-border/40 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-gray-300 font-bold">Binding List Array Object:</span>
                                  <span className="text-xs font-mono font-bold text-amber-400">PyObject_HEAD</span>
                                </div>

                                <div className="flex items-center justify-between bg-background p-2.5 rounded border border-panel-border/50">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-gray-500 uppercase block font-mono">Reference Count</span>
                                    <span className="text-base font-mono font-bold text-emerald-400">{pythonRefCount}</span>
                                  </div>
                                  <div className="space-y-0.5 text-right">
                                    <span className="text-[9px] text-gray-500 uppercase block font-mono">Active Aliases</span>
                                    <span className="text-[10px] font-mono text-gray-300">{pythonRefAliases.join(', ')}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      if (pythonRefCount < 5) {
                                        setPythonRefCount(prev => prev + 1);
                                        setPythonRefAliases(prev => [...prev, `alias_${prev.length}`]);
                                      }
                                    }}
                                    disabled={pythonRefCount >= 5}
                                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[10px] py-1.5 rounded transition-all cursor-pointer disabled:opacity-30"
                                  >
                                    + Add Alias Bind
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (pythonRefCount > 1) {
                                        setPythonRefCount(prev => prev - 1);
                                        setPythonRefAliases(prev => prev.slice(0, -1));
                                      }
                                    }}
                                    disabled={pythonRefCount <= 1}
                                    className="flex-1 bg-background border border-panel-border hover:text-white text-gray-400 font-bold text-[10px] py-1.5 rounded transition-all cursor-pointer"
                                  >
                                    - Delete Bind
                                  </button>
                                </div>
                              </div>

                              {/* Pointer reference visualization chart */}
                              <div className="p-3 bg-panel/10 border border-panel-border/30 rounded-lg flex items-center justify-between font-mono text-[9px] text-gray-400">
                                <div className="space-y-1">
                                  {pythonRefAliases.map((al) => (
                                    <div key={al} className="flex items-center gap-1">
                                      <span className="text-amber-400 font-bold">{al}</span> ──▶ [0x7FFEEF5C]
                                    </div>
                                  ))}
                                </div>
                                <div className="border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5 rounded text-center">
                                  <span className="text-emerald-400 font-bold uppercase block text-[8px]">Heap Object</span>
                                  <span className="text-white font-bold font-sans">List Structure</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {track === 'stm32' && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-gray-400 leading-normal">
                                Click register bits to write logical flags inside the **GPIOB_ODR Output Data Register** and see Pin 13 LED output.
                              </p>

                              <div className="space-y-2">
                                <div className="grid grid-cols-8 gap-1.5 font-mono text-[9px] font-bold text-center">
                                  {stm32RegisterBits.map((b, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setStm32RegisterBits(prev => prev.map((val, i) => i === idx ? (val === 1 ? 0 : 1) : val));
                                      }}
                                      className={`p-1.5 border rounded cursor-pointer transition-all ${b === 1 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-background border-panel-border text-gray-600'}`}
                                    >
                                      {b}
                                      <span className="text-[7px] text-gray-500 block font-normal mt-0.5">b{15-idx}</span>
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between p-3 bg-panel/30 border border-panel-border/40 rounded-lg">
                                  <span className="text-[10px] text-gray-300 font-bold">Pin PB13 Target (LED):</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`w-3.5 h-3.5 rounded-full border transition-all ${stm32RegisterBits[2] === 1 ? 'bg-emerald-400 border-emerald-300 shadow-md shadow-emerald-400/50' : 'bg-neutral-800 border-neutral-700'}`} />
                                    <span className={`text-[10px] font-bold uppercase ${stm32RegisterBits[2] === 1 ? 'text-emerald-400' : 'text-gray-500'}`}>
                                      {stm32RegisterBits[2] === 1 ? 'PIN HIGH (ON)' : 'PIN LOW (OFF)'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {track === 'arduino' && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-gray-400 leading-normal">
                                Adjust high-frequency **PWM Timer Prescaler** and **Duty Cycle** parameters to see the simulated pulse wave on our virtual oscilloscope.
                              </p>

                              <div className="bg-panel/30 border border-panel-border/40 p-4 rounded-lg space-y-4">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-bold text-cyan-400">Timer Frequency (Hz):</span>
                                    <span className="font-mono text-gray-400">{arduinoPwmFreq} Hz</span>
                                  </div>
                                  <input 
                                    type="range" min="10" max="200" step="10" value={arduinoPwmFreq} 
                                    onChange={(e) => setArduinoPwmFreq(parseInt(e.target.value, 10))}
                                    className="w-full accent-cyan-400"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-bold text-cyan-400">PWM Duty Cycle (%):</span>
                                    <span className="font-mono text-gray-400">{arduinoPwmDuty}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="100" step="5" value={arduinoPwmDuty} 
                                    onChange={(e) => setArduinoPwmDuty(parseInt(e.target.value, 10))}
                                    className="w-full accent-cyan-400"
                                  />
                                </div>
                              </div>

                              {/* Live SVG Oscilloscope */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase block">Virtual Oscilloscope screen</span>
                                <div className="h-24 w-full rounded border border-panel-border/60 bg-black/60 relative overflow-hidden flex items-center justify-center">
                                  <svg className="absolute inset-0 w-full h-full text-cyan-500/20" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                      <pattern id="grid-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
                                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                      </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                                  </svg>
                                  
                                  {/* Waveform line */}
                                  <svg className="w-full h-full relative z-10 animate-pulse" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <path 
                                      d={`M 0,30 L ${100 - arduinoPwmDuty},30 L ${100 - arduinoPwmDuty},10 L 100,10`}
                                      fill="none" 
                                      stroke="#22d3ee" 
                                      strokeWidth="2"
                                      vectorEffect="non-scaling-stroke"
                                      className="transition-all duration-300"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}

                          {track === 'raspberry-pi' && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-gray-400 leading-normal">
                                Send integers over the **RP2040 Inter-Core Mailbox Queue** and watch secondary Core 1 process it instantly.
                              </p>

                              <div className="bg-panel/30 border border-panel-border/40 p-3.5 rounded-lg space-y-3.5">
                                <div className="flex gap-2">
                                  <input 
                                    type="number" value={piMailboxValue} onChange={(e) => setPiMailboxValue(parseInt(e.target.value, 10) || 1)}
                                    className="w-20 bg-background border border-panel-border text-xs px-2.5 py-1.5 rounded-lg text-white font-bold"
                                  />
                                  <button
                                    onClick={() => {
                                      if (piMailboxTransmitting) return;
                                      setPiMailboxTransmitting(true);
                                      setPiMailboxHistory(prev => [...prev, `[Core 0] Sending integer: ${piMailboxValue} to Mailbox FIFO...`]);
                                      
                                      setTimeout(() => {
                                        setPiMailboxHistory(prev => [
                                          ...prev, 
                                          `[Core 1] Popped value from FIFO. Running calculations...`,
                                          `[Core 1] Result: ${piMailboxValue} * 2 = ${piMailboxValue * 2}! Sending response back...`,
                                          `[Core 0] Mailbox response received successfully.`
                                        ]);
                                        setPiMailboxTransmitting(false);
                                      }, 1200);
                                    }}
                                    disabled={piMailboxTransmitting}
                                    className="flex-1 bg-violet-400 hover:bg-violet-300 text-neutral-950 font-extrabold text-xs py-1.5 rounded-lg cursor-pointer transition-all"
                                  >
                                    {piMailboxTransmitting ? 'Transmitting...' : 'Write FIFO'}
                                  </button>
                                </div>

                                <div className="h-28 rounded bg-background/80 border border-panel-border/60 p-2.5 font-mono text-[9px] text-gray-400 overflow-y-auto space-y-1">
                                  {piMailboxHistory.map((h, i) => (
                                    <div key={i} className={h.includes('[Core 1]') ? 'text-emerald-400' : h.includes('[Core 0]') ? 'text-violet-400' : 'text-gray-500'}>
                                      {h}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {['c', 'cpp'].includes(track) && (
                            <div className="space-y-4">
                              <p className="text-[11px] text-gray-400 leading-normal">
                                Dynamic stack pointer offset index tracking compilation variables.
                              </p>

                              <div className="font-mono text-[10px] space-y-1 bg-background/60 p-3.5 rounded-lg border border-panel-border/60">
                                <div className="text-gray-500"># Heap Arena Pointer Blocks</div>
                                <div className="flex justify-between"><span>[0x200003E0] STACK_BASE:</span><span className={`${cls.text} font-bold`}>0x00000000</span></div>
                                <div className="flex justify-between"><span>[0x30001D44] ACTIVE_HEAP_PTR:</span><span className="text-emerald-400 font-bold">0x45FC91AB</span></div>
                                <div className="flex justify-between"><span>[0x08000400] CPU_FLASH_BOOT:</span><span className="text-purple-400 font-bold">0x080000F1</span></div>
                              </div>
                              <p className="text-[10px] text-gray-500 leading-normal">
                                Addresses dynamically mapped to the physical CPU SRAM registers during system instruction cycles.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Beautiful Google/Unsplash Illustrative Image */}
                        <div className="bg-background/40 border border-panel-border rounded-xl p-4 shadow-md space-y-3">
                          <div className="relative h-40 w-full rounded-lg overflow-hidden border border-panel-border/50">
                            {track === 'python' && (
                              <img 
                                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" 
                                alt="Python programming logic grid" 
                                className="w-full h-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {track === 'rtos' && (
                              <img 
                                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" 
                                alt="Embedded processor scheduler board" 
                                className="w-full h-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {track === 'stm32' && (
                              <img 
                                src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=600&q=80" 
                                alt="Silicon chip microchip wafer" 
                                className="w-full h-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {track === 'arduino' && (
                              <img 
                                src="https://images.unsplash.com/photo-1553406830-ef251367749c?auto=format&fit=crop&w=600&q=80" 
                                alt="Arduino board wiring wires" 
                                className="w-full h-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {track === 'raspberry-pi' && (
                              <img 
                                src="https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80" 
                                alt="Raspberry Pi SBC macro" 
                                className="w-full h-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            {['c', 'cpp'].includes(track) && (
                              <img 
                                src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80" 
                                alt="Coding code programming editor screen" 
                                className="w-full h-full object-cover animate-fade-in"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-400 font-bold uppercase tracking-wider">{track.toUpperCase()} Reference Diagram</span>
                            <span className="text-gray-500 italic">Source: Unsplash API</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 2: SIMULATIONS / HARDWARE TRACE */}
                {activeTab === 'simulation' && (
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="border-b border-panel-border/30 pb-3 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Eye className={`w-4 h-4 ${cls.text} animate-pulse`} />
                          <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Interactive Hardware Trace Visualizer</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">Status: Live Simulation</span>
                      </div>

                      {/* Render customized hardware visual panels depending on the track */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        
                        {/* LEFT COLUMN: Track Specific Live Dashboards */}
                        <div className="bg-background/40 border border-panel-border/60 p-5 rounded-xl space-y-4">
                          {track === 'python' && (
                            <div className="space-y-4">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5"><SlidersHorizontal className={`w-4 h-4 ${cls.text}`} /> Python Variable Casting</span>
                              <div>
                                <label className="text-[10px] text-gray-400 block mb-1">Input Literal:</label>
                                <input 
                                  type="text" value={typedInput} onChange={(e) => setTypedInput(e.target.value)}
                                  className="w-full bg-background border border-panel-border px-3 py-1.5 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                                />
                              </div>
                              <div className="grid grid-cols-4 gap-1.5 bg-background p-1 border border-panel-border rounded-lg">
                                {(['str', 'int', 'float', 'bool'] as const).map((type) => (
                                  <button
                                    key={type} onClick={() => setCastType(type)}
                                    className={`py-1 rounded-md text-[10px] font-bold font-mono transition-all capitalize cursor-pointer ${castType === type ? 'bg-amber-400 text-neutral-950' : 'text-gray-400 hover:text-white'}`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                              <div className="p-3 bg-panel border border-panel-border/40 rounded-lg flex items-center justify-between">
                                <span className="text-[11px] text-gray-400 font-mono">Evaluated:</span>
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  {castType === 'int' ? parseInt(typedInput, 10) || 'ValueError' : castType === 'float' ? parseFloat(typedInput) || 'ValueError' : typedInput}
                                </span>
                              </div>
                            </div>
                          )}

                          {track === 'rtos' && (
                            <div className="space-y-4">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5"><Activity className={`w-4 h-4 ${cls.text}`} /> RTOS Task List Scheduler</span>
                              <div className="space-y-2">
                                {rtosTasks.map((t) => (
                                  <div key={t.id} className="p-2.5 bg-background/50 border border-panel-border rounded-lg flex items-center justify-between text-xs">
                                    <span className="font-bold text-gray-200">{t.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${t.state === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : t.state === 'Ready' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                      {t.state}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text" placeholder="Queue payload..." value={queueInput} onChange={(e) => setQueueInput(e.target.value)}
                                  className="bg-background border border-panel-border text-xs px-3 py-1.5 rounded-lg flex-1 text-white focus:outline-none"
                                />
                                <button onClick={pushToRtosQueue} className={`px-3 py-1.5 ${cls.accent} ${cls.hover} text-neutral-950 text-xs font-bold rounded-lg cursor-pointer`}>Send Queue</button>
                              </div>
                            </div>
                          )}

                          {track === 'stm32' && (
                            <div className="space-y-4">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5"><CpuIcon className={`w-4 h-4 ${cls.text}`} /> GPIO Port B Output Registers</span>
                              <div className="grid grid-cols-4 gap-2">
                                {gpioState.map((state, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setGpioState(prev => prev.map((s, i) => i === idx ? !s : s))}
                                    className={`p-2.5 border rounded-lg font-mono text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-all ${state ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10' : 'bg-background/60 border-panel-border text-gray-500'}`}
                                  >
                                    <span className="text-[8px] text-gray-500 mb-0.5">PB{idx}</span>
                                    {state ? '1' : '0'}
                                  </button>
                                ))}
                              </div>
                              <div className="space-y-1.5 pt-2">
                                <label className="text-[10px] text-gray-400 block">DMA ADC Buffer: {adcValue} count</label>
                                <input 
                                  type="range" min="0" max="4095" step="1" value={adcValue} onChange={(e) => setAdcValue(parseInt(e.target.value, 10))}
                                  className={`w-full accent-emerald-400`}
                                />
                              </div>
                            </div>
                          )}

                          {track === 'arduino' && (
                            <div className="space-y-4">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5"><ToggleLeft className={`w-4 h-4 ${cls.text}`} /> Virtual Arduino Board Interfacing</span>
                              <div className="flex items-center justify-between p-4 bg-background/50 border border-panel-border rounded-xl">
                                <span className="text-xs font-mono font-bold text-gray-300">Digital Pin 13 (LED)</span>
                                <button
                                  onClick={() => setLedOn(prev => !prev)}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${ledOn ? 'bg-cyan-400 text-neutral-950 font-extrabold shadow-lg shadow-cyan-400/25' : 'bg-background border border-panel-border text-gray-400'}`}
                                >
                                  {ledOn ? '✓ PIN HIGH' : 'PIN LOW'}
                                </button>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-400 block">A0 Analog Potentiometer: {potVoltage.toFixed(2)} V</label>
                                <input 
                                  type="range" min="0" max="5" step="0.1" value={potVoltage} onChange={(e) => setPotVoltage(parseFloat(e.target.value))}
                                  className="w-full accent-cyan-400"
                                />
                              </div>
                            </div>
                          )}

                          {['raspberry-pi', 'c', 'cpp'].includes(track) && (
                            <div className="space-y-4">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5"><Terminal className={`w-4 h-4 ${cls.text}`} /> Virtual Memory Trace Map</span>
                              <div className="font-mono text-[10px] space-y-1 bg-background p-3 rounded-lg border border-panel-border/60">
                                <div className="text-gray-500"># Stack Heap pointers inspection</div>
                                <div className="flex justify-between"><span>[0x200003E0] STACK_BASE:</span><span className="text-brand font-bold">0x00000000</span></div>
                                <div className="flex justify-between"><span>[0x30001D44] HEAP_PTR:</span><span className="text-emerald-400 font-bold">0x45FC9A1B</span></div>
                                <div className="flex justify-between"><span>[0x08000400] FLASH_BOOT:</span><span className="text-purple-400 font-bold">Vector Table</span></div>
                              </div>
                              <p className="text-[10px] text-gray-500 leading-normal">
                                Dynamic addresses mapped directly to compile registers. Change track trace steps below to see registers cycle.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: Sequential Trace Step Details */}
                        <div className="p-5 bg-background/20 border border-panel-border/80 rounded-xl space-y-4 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase mb-1">CPU Execution Sequence</span>
                            <h4 className="text-xs font-bold text-white mb-2">{activeLesson.simulationSpec[activeTraceStep]?.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{activeLesson.simulationSpec[activeTraceStep]?.description}</p>
                          </div>

                          <div className="p-3.5 bg-background/60 border border-panel-border rounded-lg space-y-2 mt-4 font-mono text-[10px]">
                            <div className="flex justify-between"><span className="text-gray-500">Source:</span><span className={cls.text}>{activeLesson.simulationSpec[activeTraceStep]?.highlightCode}</span></div>
                            <div className="border-t border-panel-border/20 pt-1.5 flex justify-between"><span className="text-gray-500">Status:</span><span className="text-gray-300">{activeLesson.simulationSpec[activeTraceStep]?.stateSummary}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step Incrementation Controller Footer */}
                    <div className="mt-6 pt-4 border-t border-panel-border/30 flex justify-between items-center">
                      <button
                        onClick={() => setActiveTraceStep(0)}
                        disabled={activeTraceStep === 0}
                        className="px-3.5 py-2 bg-panel border border-panel-border text-xs text-gray-300 hover:text-white disabled:opacity-30 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-bold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restart Trace
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveTraceStep(prev => Math.max(0, prev - 1))}
                          disabled={activeTraceStep === 0}
                          className="px-4 py-2 bg-panel border border-panel-border text-xs text-white disabled:opacity-30 rounded-xl transition-all cursor-pointer font-bold"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setActiveTraceStep(prev => Math.min(activeLesson.simulationSpec.length - 1, prev + 1))}
                          disabled={activeTraceStep === activeLesson.simulationSpec.length - 1}
                          className={`px-4 py-2 ${cls.accent} ${cls.hover} disabled:opacity-30 text-neutral-950 font-bold rounded-xl text-xs transition-all cursor-pointer`}
                        >
                          Next Trace Step
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 3: CODE WORKBENCH */}
                {activeTab === 'code' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="p-4 bg-background/60 border-b border-panel-border/40 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-300 font-mono">Source Script File</span>
                      <button
                        onClick={() => copyCodeToClipboard(activeLesson.code)}
                        className="px-3 py-1.5 bg-panel border border-panel-border text-xs text-gray-300 hover:text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy Code'}
                      </button>
                    </div>

                    <pre className="p-6 sm:p-8 font-mono text-xs text-amber-100 overflow-x-auto bg-background/20 select-text leading-relaxed max-h-[380px]">
                      <code>{activeLesson.code}</code>
                    </pre>

                    <div className="p-4 bg-panel border-t border-panel-border/30 flex items-center justify-between">
                      <p className="text-[11px] text-gray-400 leading-relaxed max-w-md font-normal">
                        Load this script into the online interactive sandbox compiler to execute code dynamically with diagnostic checks.
                      </p>
                      <Link
                        href="/compiler"
                        onClick={() => copyCodeToClipboard(activeLesson.code)}
                        className={`px-4 py-2 ${cls.accent} ${cls.hover} text-neutral-950 font-extrabold text-xs rounded-lg transition-all flex items-center gap-1.5 shrink-0`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Load in Sandbox
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 4: PRACTICE QUIZZES */}
                {activeTab === 'quiz' && (
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-6 max-h-[440px] overflow-y-auto">
                      <div className="border-b border-panel-border/30 pb-3 flex items-center gap-2">
                        <HelpCircle className={`w-4 h-4 ${cls.text} animate-pulse`} />
                        <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">Knowledge Verification Quiz</span>
                      </div>

                      {activeLesson.quiz && activeLesson.quiz.map((q, qIdx) => (
                        <div key={qIdx} className="bg-background/40 border border-panel-border/50 p-5 rounded-xl space-y-4">
                          <h4 className="text-xs font-bold text-gray-200">{qIdx + 1}. {q.question}</h4>
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[qIdx] === optIdx;
                              const isCorrect = q.correctIndex === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                                    quizSubmitted 
                                      ? isCorrect 
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                        : isSelected 
                                          ? 'bg-red-500/10 border-red-500 text-red-400' 
                                          : 'bg-background/20 border-transparent text-gray-500'
                                      : isSelected 
                                        ? `${cls.bg} ${cls.border} ${cls.text}` 
                                        : 'bg-background/40 border-panel-border hover:border-gray-500 text-gray-300'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && <div className={`w-2 h-2 rounded-full ${cls.accent}`} />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Quiz explanation blocks */}
                          {quizSubmitted && (
                            <div className={`p-3.5 bg-panel border-l-2 ${cls.border} rounded-lg text-[10px] text-gray-400 leading-normal`}>
                              <span className={`font-bold ${cls.text} uppercase tracking-wide block mb-1`}>Explanation:</span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quiz Submission controller footer */}
                    {activeLesson.quiz && (
                      <div className="mt-8 pt-4 border-t border-panel-border/30 flex justify-between items-center">
                        <p className="text-[10px] text-gray-400">Configure all selections above before submitting your answers.</p>
                        <button
                          onClick={() => setQuizSubmitted(true)}
                          disabled={quizSubmitted || Object.keys(quizAnswers).length < activeLesson.quiz.length}
                          className={`px-5 py-2.5 ${cls.accent} ${cls.hover} disabled:opacity-20 text-neutral-950 font-bold rounded-xl text-xs transition-all cursor-pointer`}
                        >
                          Submit Answers
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT 5: LIVE AI TUTOR CHAT PANEL */}
                {activeTab === 'chat' && (
                  <div className="flex-1 flex flex-col justify-between min-h-[460px]">
                    {/* Chat messages viewport */}
                    <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto flex-1 select-text">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed border ${
                            msg.sender === 'user' 
                              ? `${cls.bg} ${cls.border} ${cls.text} rounded-br-none` 
                              : 'bg-background/60 border-panel-border text-gray-300 rounded-bl-none'
                          }`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-background/60 border border-panel-border rounded-2xl p-4 text-xs text-gray-400 flex items-center gap-2">
                            <Loader2 className={`w-4.5 h-4.5 animate-spin ${cls.text}`} />
                            <span>AI Tutor is drafting response...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat interactive message input */}
                    <div className="p-4 bg-background/50 border-t border-panel-border/30 flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask AI Tutor details, register offsets, or compile flags..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        className="flex-1 bg-background border border-panel-border px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-gray-400 text-white"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        disabled={chatLoading || !chatInput.trim()}
                        className={`px-4 py-2 ${cls.accent} ${cls.hover} disabled:opacity-35 text-neutral-950 font-bold rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Mark as Completed status bar footer */}
                <div className="p-4 bg-panel border-t border-panel-border/30 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Bookmark className={`w-3.5 h-3.5 ${cls.text}`} /> Save your study tracking.
                  </span>
                  <button
                    onClick={(e) => toggleTopicCompletion(selectedTopic.id, e)}
                    className={`px-4 py-1.5 border text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      completedTopics[selectedTopic.id]
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-background hover:bg-panel border-panel-border text-gray-300'
                    }`}
                  >
                    {completedTopics[selectedTopic.id] ? '✓ Marked Completed' : 'Mark Topic Completed'}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Structured syllabus curriculum details tracker summary */}
      <section id="syllabus-summary-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-panel-border/30">
        <h3 className="text-lg font-bold font-heading text-white mb-6">Complete Course Structure (25 Chapters)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-panel border border-panel-border rounded-2xl shadow-sm">
            <span className={`text-xs font-bold ${cls.text} font-mono`}>Chapters 1 - 8</span>
            <h4 className="text-sm font-bold text-white mt-1 mb-2">Foundational Core & Basics</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Explore syntax layouts, registers, thread properties, structures, scopes, variables declarations, non-volatile sectors, and execution flow rules.
            </p>
          </div>
          <div className="p-6 bg-panel border border-panel-border rounded-2xl shadow-sm">
            <span className={`text-xs font-bold ${cls.text} font-mono`}>Chapters 9 - 17</span>
            <h4 className="text-sm font-bold text-white mt-1 mb-2">Advanced Modules & Buses</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Analyze task prioritization, DMA circular arrays, mutex priority inversion fixes, high-speed SPI/I2C wire buses, and dynamic object bindings.
            </p>
          </div>
          <div className="p-6 bg-panel border border-panel-border rounded-2xl shadow-sm">
            <span className={`text-xs font-bold ${cls.text} font-mono`}>Chapters 18 - 25</span>
            <h4 className="text-sm font-bold text-white mt-1 mb-2">Enterprise Scaling & Debugging</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Implement stack overflows checking, true random seed entropy pools, thread-safe memory caches, low power sleep configurations, and HIL validation tests.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
