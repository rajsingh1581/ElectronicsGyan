'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  ChevronRight, 
  BookOpen, 
  Code2, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sliders, 
  Volume2, 
  Zap, 
  Play, 
  Cpu, 
  RotateCcw,
  BookOpenCheck,
  Signal,
  SlidersHorizontal,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/AuthContext';
import ReactMarkdown from 'react-markdown';
import { ARDUINO_CATEGORIES, ARDUINO_LESSONS, ArduinoTopic } from './arduinoData';

export default function ArduinoTutorialPage() {
  const { user } = useAuth();
  
  // Navigation states
  const [activeCategory, setActiveCategory] = useState<string>('basics');
  const [selectedLesson, setSelectedLesson] = useState<ArduinoTopic>(ARDUINO_LESSONS[0]);
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'code'>('theory');

  // Dynamic CMS lessons from API
  const [dynamicTopics, setDynamicTopics] = useState<any[]>([]);
  const [selectedCustomTopic, setSelectedCustomTopic] = useState<any | null>(null);

  // Interaction feedback states
  const [copied, setCopied] = useState<boolean>(false);

  // --- Virtual Simulator State Variables ---
  const [simBlinkDelay, setSimBlinkDelay] = useState<number>(500);
  const [simLedOn, setSimLedOn] = useState<boolean>(false);
  const [simPotValue, setSimPotValue] = useState<number>(512);
  const [simServoAngle, setSimServoAngle] = useState<number>(90);
  const [simTemp, setSimTemp] = useState<number>(24);
  const [simHumid, setSimHumid] = useState<number>(45);
  const [simMotion, setSimMotion] = useState<boolean>(false);
  const [simDistance, setSimDistance] = useState<number>(30);
  const [lastBuzzerFreq, setLastBuzzerFreq] = useState<number>(0);
  const [interruptLog, setInterruptLog] = useState<string[]>(["[System Boot] Interrupt ISR listening on Pin 2"]);

  // Fetch dynamic custom database lessons
  useEffect(() => {
    fetch('/api/tutorials?stack=arduino')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const custom = data.topics.filter((t: any) => !t.isBuiltIn);
          setDynamicTopics(custom);
        }
      })
      .catch((err) => console.error('Error fetching dynamic topics:', err));
  }, []);

  // Simulator interval loop for blinking LED
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedLesson.visualType === 'interactive_blink') {
      timer = setInterval(() => {
        setSimLedOn((prev) => !prev);
      }, simBlinkDelay);
    }
    return () => clearInterval(timer);
  }, [selectedLesson.visualType, simBlinkDelay]);

  const selectLessonHandler = (lesson: ArduinoTopic) => {
    setSelectedLesson(lesson);
    setSelectedCustomTopic(null);
    // Reset active workspace tab to theory by default
    setActiveTab('theory');
  };

  const selectCustomTopicHandler = (topic: any) => {
    setSelectedCustomTopic(topic);
    // When custom topic loaded, we show markdown directly
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger a virtual audio synthesizer chime on clicking keys
  const playVirtualTone = (freq: number, note: string) => {
    setLastBuzzerFreq(freq);
    // Simulate interactive flash
    setTimeout(() => setLastBuzzerFreq(0), 400);
  };

  // Add trigger pulse log for interrupt simulations
  const triggerVirtualInterrupt = (edge: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setInterruptLog((prev) => [
      `[${timestamp}] ⚡ Edge: ${edge} -> Triggered ISR() -> pressCount++`,
      ...prev.slice(0, 5)
    ]);
  };

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
            <span className="text-white font-medium">Arduino Curriculum</span>
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
                  Syllabus Track
                </span>
                <span className="text-xs text-gray-400">• Complete Interactive Guide</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                Arduino <span className="text-brand">Physical Computing</span>
              </h1>
              <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
                Explore theory, simulation, and working code for every topic in the Arduino syllabus. Adjust parameters in real-time, inspect custom hardware mockups, and copy clean code.
              </p>
            </div>
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4">
              <div className="p-3 bg-brand/10 rounded-xl">
                <Terminal className="h-8 w-8 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Track Estimated Time</p>
                <p className="text-sm font-bold text-white font-mono">~6 Hours Study</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Categories & Lessons List (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Category Pill Selector */}
            <div className="bg-panel border border-panel-border rounded-2xl p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Curriculum Track</h3>
              <div className="space-y-1">
                {ARDUINO_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      // Default select first lesson in selected category
                      const firstInCat = ARDUINO_LESSONS.find(l => l.category === cat.id);
                      if (firstInCat) selectLessonHandler(firstInCat);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left border cursor-pointer ${
                      activeCategory === cat.id 
                        ? 'bg-brand/10 border-brand/30 text-brand' 
                        : 'bg-background/40 border-transparent text-gray-400 hover:bg-panel-border/10 hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Lessons under active category */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Lessons In Category</h3>
              <div className="space-y-1.5">
                {ARDUINO_LESSONS.filter(l => l.category === activeCategory).map((lesson) => {
                  const isSelected = selectedLesson.id === lesson.id && !selectedCustomTopic;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => selectLessonHandler(lesson)}
                      className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold transition-all text-left border cursor-pointer ${
                        isSelected 
                          ? 'bg-brand border-brand shadow-lg text-white' 
                          : 'bg-panel/40 border-panel-border/50 text-gray-300 hover:bg-panel/70 hover:text-white'
                      }`}
                    >
                      <Cpu className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-semibold line-clamp-1">{lesson.name}</p>
                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          {lesson.summary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Community Contributors / CMS Lessons */}
            {dynamicTopics.length > 0 && (
              <div className="border-t border-panel-border/40 pt-4">
                <h3 className="text-xs font-bold text-brand uppercase tracking-wider px-2 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Additional Custom Topics
                </h3>
                <div className="space-y-1.5">
                  {dynamicTopics.map((topic) => {
                    const isSelected = selectedCustomTopic?.id === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => selectCustomTopicHandler(topic)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left border cursor-pointer ${
                          isSelected 
                            ? 'bg-brand/10 border-brand/40 text-brand' 
                            : 'bg-panel/40 border-panel-border/60 text-gray-300 hover:bg-panel/80 hover:text-white'
                        }`}
                      >
                        <BookOpenCheck className="w-4 h-4 text-brand shrink-0" />
                        <span className="line-clamp-1">{topic.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Block */}
            {user?.role === 'admin' && (
              <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 space-y-3">
                <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> Admin Access Mode
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  You are logged in as Administrator. You can add additional chapters or tutorials in the CMS.
                </p>
                <Link
                  href="/tutorial/admin"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand text-white font-bold text-xs rounded-xl hover:bg-brand-light transition-all cursor-pointer text-center"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch CMS Studio
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Active Document Workspace (lg:col-span-8) */}
          <div className="lg:col-span-8">
            <div className="bg-panel border border-panel-border/80 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Dynamic CMS Page Render */}
              {selectedCustomTopic ? (
                <div className="p-6 sm:p-10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-panel-border pb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white flex items-center gap-3">
                      <Sparkles className="text-brand h-7 w-7" />
                      {selectedCustomTopic.name}
                    </h2>
                    {user?.role === 'admin' && (
                      <Link
                        href="/tutorial/admin"
                        className="px-4 py-1.5 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Edit Topic
                      </Link>
                    )}
                  </div>

                  {selectedCustomTopic.youtubeUrl && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-panel-border bg-black/40">
                      <iframe
                        src={selectedCustomTopic.youtubeUrl}
                        title={selectedCustomTopic.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed markdown-body">
                    <ReactMarkdown>{selectedCustomTopic.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                /* Static Detailed Curriculum Workspace */
                <div>
                  
                  {/* Header Title & Summary */}
                  <div className="p-6 sm:p-8 bg-background border-b border-panel-border/50">
                    <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white mb-2">
                      {selectedLesson.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {selectedLesson.summary}
                    </p>
                  </div>

                  {/* Syllabus Stage Action Bar Tabs */}
                  <div className="flex border-b border-panel-border bg-background/50">
                    <button
                      onClick={() => setActiveTab('theory')}
                      className={`flex-1 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                        activeTab === 'theory' 
                          ? 'border-brand text-brand bg-brand/5' 
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      1. Theory & Specs
                    </button>
                    <button
                      onClick={() => setActiveTab('simulation')}
                      className={`flex-1 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                        activeTab === 'simulation' 
                          ? 'border-brand text-brand bg-brand/5' 
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                      2. Interactive Lab
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`flex-1 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                        activeTab === 'code' 
                          ? 'border-brand text-brand bg-brand/5' 
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                      3. Arduino Code
                    </button>
                  </div>

                  {/* Active Tab Panel Wrapper */}
                  <div className="p-6 sm:p-8">
                    
                    {/* Tab 1: Detailed Curriculum Theory Block */}
                    {activeTab === 'theory' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed markdown-body">
                          <ReactMarkdown>{selectedLesson.theory}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab 2: Custom Live Interactive Circuit / Signal Simulation */}
                    {activeTab === 'simulation' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between border-b border-panel-border pb-3 mb-4">
                          <div>
                            <h4 className="text-xs font-mono font-bold tracking-widest text-brand uppercase">Integrated Hardware Simulation</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{selectedLesson.visualDesc}</p>
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live Virtual MCU Active
                          </span>
                        </div>

                        {/* --- RENDERING DESIGNATED VISUAL WIDGETS DEPENDING ON LESSON --- */}
                        
                        {/* A. Arduino Uno Vector Interactive Map */}
                        {selectedLesson.visualType === 'board' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 flex flex-col items-center">
                            <p className="text-xs text-gray-400 text-center mb-6">
                              Click or hover over the critical headers of the ATmega328P Arduino Uno to inspect electrical signals and internal registers.
                            </p>
                            
                            <div className="relative w-full max-w-md aspect-[1.3/1] bg-teal-950/20 border-2 border-teal-500/20 rounded-2xl flex flex-col justify-between p-6 shadow-2xl relative overflow-hidden">
                              {/* Decals */}
                              <div className="absolute top-4 left-4 text-[10px] font-mono text-teal-500/40">ELECTRONICS GYAN v1.0</div>
                              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-teal-500/40">UNO R3 ATMEGA328P</div>
                              
                              {/* Power, USB Jacks */}
                              <div className="flex justify-between items-start">
                                <div className="w-16 h-10 bg-slate-800 border border-slate-700 rounded shadow-md flex items-center justify-center text-[10px] font-mono text-gray-400">
                                  USB PORT
                                </div>
                                
                                {/* Pin Header 1 */}
                                <div className="flex gap-1.5 bg-slate-900 border border-panel-border p-1 rounded-lg">
                                  {['AREF', 'GND', 'D13', 'D12', 'D11', 'D10', 'D9'].map((pin, idx) => (
                                    <button 
                                      key={idx}
                                      onClick={() => alert(`Pin ${pin}: Digital I/O line supporting ${pin.includes('D9') || pin.includes('D10') || pin.includes('D11') ? 'PWM output up to 8-bit' : 'standard digital reads/writes'}`)}
                                      className="w-7 py-1.5 bg-background border border-panel-border rounded text-[9px] font-mono hover:bg-brand/20 hover:text-brand hover:border-brand/40 text-gray-400 transition-all font-semibold"
                                    >
                                      {pin}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Center Microchip Core */}
                              <div className="w-40 h-12 bg-slate-900 border-2 border-slate-800 rounded-lg mx-auto flex items-center justify-center font-mono text-xs text-gray-300 font-bold relative shadow-inner">
                                <span className="absolute top-1 left-1.5 text-[8px] text-gray-600 font-normal">ATMEL</span>
                                ATMEGA328P-PU
                                <div className="absolute inset-y-0 right-3 w-1.5 bg-slate-950 rounded-sm" />
                              </div>

                              {/* Bottom Headers */}
                              <div className="flex justify-between items-end">
                                <div className="flex gap-1 bg-slate-900 border border-panel-border p-1 rounded-lg">
                                  {['5V', 'GND', 'VIN'].map((pin, idx) => (
                                    <button 
                                      key={idx}
                                      onClick={() => alert(`Pin ${pin}: ${pin === 'GND' ? 'System Common Ground Potential (0V)' : pin === '5V' ? 'Onboard Regulated 5.0V output (max 150mA load)' : 'DC Voltage Input rail (7V-12V safe input limit)'}`)}
                                      className="w-7 py-1.5 bg-background border border-panel-border rounded text-[9px] font-mono hover:bg-brand/20 hover:text-brand hover:border-brand/40 text-gray-400 transition-all font-semibold"
                                    >
                                      {pin}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex gap-1 bg-slate-900 border border-panel-border p-1 rounded-lg">
                                  {['A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((pin, idx) => (
                                    <button 
                                      key={idx}
                                      onClick={() => alert(`Pin ${pin}: 10-bit Successive Approximation ADC channel. Maps voltages between 0V-5V to steps 0-1023.`)}
                                      className="w-7 py-1.5 bg-background border border-panel-border rounded text-[9px] font-mono hover:bg-brand/20 hover:text-brand hover:border-brand/40 text-gray-400 transition-all font-semibold"
                                    >
                                      {pin}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* B. LED Blinker Simulator */}
                        {selectedLesson.visualType === 'interactive_blink' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 space-y-4">
                              <h5 className="text-sm font-semibold text-white flex items-center gap-1.5">
                                <SlidersHorizontal className="h-4 w-4 text-brand" />
                                Adjust Blink Cycle Frequency
                              </h5>
                              <p className="text-xs text-gray-400">
                                Drag the slider to alter the virtual MCU code execution delay. Fast delays speed up the LED toggle rates.
                              </p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-gray-400">
                                  <span>Delay Period: {simBlinkDelay}ms</span>
                                  <span>Frequency: {(1000 / simBlinkDelay).toFixed(1)}Hz</span>
                                </div>
                                <input
                                  type="range"
                                  min="100"
                                  max="2000"
                                  step="50"
                                  value={simBlinkDelay}
                                  onChange={(e) => setSimBlinkDelay(Number(e.target.value))}
                                  className="w-full accent-brand bg-panel border-0"
                                />
                              </div>
                            </div>

                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-panel border border-panel-border rounded-xl">
                              <p className="text-xs font-mono text-gray-400 mb-4 uppercase">Output State</p>
                              <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Pulsing Ring for Visual LED glowing */}
                                {simLedOn && (
                                  <span className="absolute inset-0 bg-brand/35 rounded-full animate-ping" />
                                )}
                                <div className={`w-12 h-12 rounded-full border-2 transition-all duration-100 flex items-center justify-center ${
                                  simLedOn 
                                    ? 'bg-brand border-brand shadow-[0_0_20px_rgba(235,94,40,0.8)]' 
                                    : 'bg-background border-panel-border text-gray-600'
                                }`}>
                                  <Zap className={`h-5 w-5 ${simLedOn ? 'text-white' : 'text-gray-600'}`} />
                                </div>
                              </div>
                              <p className="text-xs font-mono mt-4 font-bold tracking-widest uppercase">
                                PIN 13: {simLedOn ? <span className="text-brand">HIGH (5V)</span> : <span className="text-gray-500">LOW (0V)</span>}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* C. Potentiometer & Led Bar Graph */}
                        {selectedLesson.visualType === 'pot_graph' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 space-y-6">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                              <div className="flex-1 space-y-4">
                                <h5 className="text-sm font-semibold text-white">Adjust Analog Input Potentiometer</h5>
                                <p className="text-xs text-gray-400">
                                  Slide the dial representing the physical rotary potentiometer. Watch the 10-bit analogRead step resolve and map to the virtual LED graph outputs.
                                </p>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs font-mono text-gray-400">
                                    <span>Potentiometer Voltage: {((simPotValue / 1023) * 5).toFixed(2)}V</span>
                                    <span>ADC Step: {simPotValue} / 1023</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1023"
                                    step="1"
                                    value={simPotValue}
                                    onChange={(e) => setSimPotValue(Number(e.target.value))}
                                    className="w-full accent-brand bg-panel border-0"
                                  />
                                </div>
                              </div>

                              <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-panel border border-panel-border rounded-xl">
                                <p className="text-xs font-mono text-gray-400 mb-4 uppercase">Mapped Volts Graph</p>
                                
                                {/* LED Bar Graph Blocks */}
                                <div className="w-full space-y-1.5">
                                  {[1, 2, 3, 4, 5, 6].map((idx) => {
                                    const threshold = (idx / 6) * 1023;
                                    const isActive = simPotValue >= threshold;
                                    return (
                                      <div key={idx} className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-gray-500 w-12">Pin {idx + 1}</span>
                                        <div className={`flex-1 h-5 rounded border transition-all duration-200 ${
                                          isActive 
                                            ? 'bg-brand/80 border-brand shadow-[0_0_8px_rgba(235,94,40,0.5)]' 
                                            : 'bg-background border-panel-border'
                                        }`} />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* D. Servo Motor Rotation */}
                        {selectedLesson.visualType === 'servo' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 space-y-6">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                              <div className="flex-1 space-y-4">
                                <h5 className="text-sm font-semibold text-white">Command Servo Angle Degrees</h5>
                                <p className="text-xs text-gray-400">
                                  Command a standard SG90 servo motor. The servo library maps degree inputs to 50Hz PWM duty cycle timing (1.0ms - 2.0ms high pulses).
                                </p>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs font-mono text-gray-400">
                                    <span>Angle Position: {simServoAngle}°</span>
                                    <span>PWM Duty Pulse: {(1 + (simServoAngle / 180)).toFixed(2)}ms</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="180"
                                    step="1"
                                    value={simServoAngle}
                                    onChange={(e) => setSimServoAngle(Number(e.target.value))}
                                    className="w-full accent-brand bg-panel border-0"
                                  />
                                </div>
                              </div>

                              <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-panel border border-panel-border rounded-xl">
                                <p className="text-xs font-mono text-gray-400 mb-6 uppercase">Physical Arm Sweep</p>
                                
                                {/* Rotate Servo Gear based on Angle */}
                                <div className="relative w-24 h-24 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center">
                                  <div 
                                    style={{ transform: `rotate(${simServoAngle}deg)` }}
                                    className="absolute w-20 h-4 bg-brand border border-white rounded-full transition-transform duration-300 ease-out flex items-center justify-end px-1"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  </div>
                                  <div className="w-5 h-5 rounded-full bg-white border border-panel-border z-10" />
                                </div>
                                <p className="text-xs font-mono text-gray-400 mt-4">{simServoAngle} DEGREES</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* E. Sensor Panel Hub */}
                        {selectedLesson.visualType === 'sensor_panel' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Sliders */}
                              <div className="space-y-4">
                                <h5 className="text-sm font-semibold text-white">Simulate Environmental Conditions</h5>
                                
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                                      <span>Temperature (DHT22)</span>
                                      <span className="text-brand">{simTemp}°C</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="-20"
                                      max="80"
                                      value={simTemp}
                                      onChange={(e) => setSimTemp(Number(e.target.value))}
                                      className="w-full accent-brand bg-panel border-0"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                                      <span>Humidity (DHT22)</span>
                                      <span className="text-brand">{simHumid}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={simHumid}
                                      onChange={(e) => setSimHumid(Number(e.target.value))}
                                      className="w-full accent-brand bg-panel border-0"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                                      <span>Target Obstacle Distance</span>
                                      <span className="text-brand">{simDistance} cm</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="2"
                                      max="400"
                                      value={simDistance}
                                      onChange={(e) => setSimDistance(Number(e.target.value))}
                                      className="w-full accent-brand bg-panel border-0"
                                    />
                                  </div>
                                </div>

                                <div className="pt-2">
                                  <button
                                    onClick={() => setSimMotion(prev => !prev)}
                                    className={`w-full py-2 border rounded-xl text-xs font-bold font-mono transition-all ${
                                      simMotion 
                                        ? 'bg-red-500/10 border-red-500 text-red-400' 
                                        : 'bg-background border-panel-border text-gray-400 hover:border-brand/40 hover:text-white'
                                    }`}
                                  >
                                    {simMotion ? "🛑 Simulate Continuous PIR Motion" : "🏃 Simulate PIR Trigger Pulse"}
                                  </button>
                                </div>
                              </div>

                              {/* Virtual Serial Terminal output */}
                              <div className="bg-slate-950 rounded-xl p-4 border border-panel-border/70 flex flex-col h-56 justify-between shadow-inner">
                                <div className="flex items-center justify-between border-b border-panel-border/40 pb-2 mb-2 text-xs font-mono text-gray-500">
                                  <span>Serial Output @ 115200 Baud</span>
                                  <button 
                                    onClick={() => setInterruptLog(["[Terminal Clear] Waiting for sensor ticks..."])}
                                    className="hover:text-white text-[10px] uppercase font-bold"
                                  >
                                    Reset
                                  </button>
                                </div>
                                <div className="flex-1 font-mono text-xs text-emerald-400 space-y-1 overflow-y-auto select-text scrollbar-thin">
                                  <p className="opacity-80">[System Diagnostics Connected]</p>
                                  <p>{`Temp: ${simTemp}.0°C | Humid: ${simHumid}.0%`}</p>
                                  <p>{`HC-SR04 Echo Wave duration: ${(simDistance * 2 / 0.0343).toFixed(0)} us`}</p>
                                  <p className="text-brand">{`Distance computed: ${simDistance} cm`}</p>
                                  {simMotion && (
                                    <p className="text-red-400 font-bold animate-pulse">ALARM: Motion detected on Pin 4!</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* F. Audio Synthesizer Tone Block */}
                        {selectedLesson.visualType === 'tone_synth' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 space-y-6">
                            <p className="text-xs text-gray-400">
                              Click the virtual synthesizer piano keys to command tone waves on hardware buzzer pin 8. The square waves change physical acoustic frequencies instantly.
                            </p>
                            
                            <div className="flex justify-center gap-2 max-w-md mx-auto p-4 bg-panel border border-panel-border rounded-xl">
                              {[
                                { note: 'C4', freq: 262, color: 'bg-white text-slate-800' },
                                { note: 'D4', freq: 294, color: 'bg-white text-slate-800' },
                                { note: 'E4', freq: 330, color: 'bg-white text-slate-800' },
                                { note: 'F4', freq: 349, color: 'bg-white text-slate-800' },
                                { note: 'G4', freq: 392, color: 'bg-white text-slate-800' },
                                { note: 'A4', freq: 440, color: 'bg-white text-slate-800' },
                                { note: 'B4', freq: 494, color: 'bg-white text-slate-800' },
                                { note: 'C5', freq: 523, color: 'bg-brand text-white' }
                              ].map((key, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => playVirtualTone(key.freq, key.note)}
                                  className={`flex-1 h-32 flex flex-col justify-end items-center pb-3 rounded-lg font-mono text-xs font-bold transition-all shadow-md active:scale-95 border-b-4 border-slate-900 cursor-pointer ${key.color}`}
                                >
                                  {key.note}
                                  <span className="text-[9px] opacity-75 block mt-1">{key.freq}Hz</span>
                                </button>
                              ))}
                            </div>

                            {lastBuzzerFreq > 0 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-3 bg-brand/10 border border-brand/20 rounded-xl text-center"
                              >
                                <p className="text-xs font-mono text-brand font-bold flex items-center justify-center gap-2">
                                  <Volume2 className="h-4 w-4 animate-bounce" />
                                  Broadcasting Tone: {lastBuzzerFreq} Hz frequency on Digital Pin 8
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )}

                        {/* G. Interrupt Logic Trigger Waveform */}
                        {selectedLesson.visualType === 'interrupt_sim' && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h5 className="text-sm font-semibold text-white">Trigger Edge Triggers</h5>
                                <p className="text-xs text-gray-400">
                                  Simulate immediate edge level transitions on pin 2. Notice how they bypass standard loop cycles instantly.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    onClick={() => triggerVirtualInterrupt('FALLING (High to Low)')}
                                    className="py-3 bg-brand text-white border border-brand/20 rounded-xl text-xs font-bold font-mono transition-all hover:bg-brand-light flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Zap className="h-3.5 w-3.5" /> FALLING Edge
                                  </button>
                                  <button
                                    onClick={() => triggerVirtualInterrupt('RISING (Low to High)')}
                                    className="py-3 bg-teal-600 text-white border border-teal-500/20 rounded-xl text-xs font-bold font-mono transition-all hover:bg-teal-500 flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Zap className="h-3.5 w-3.5" /> RISING Edge
                                  </button>
                                </div>
                              </div>

                              {/* Virtual logs */}
                              <div className="bg-slate-950 rounded-xl p-4 border border-panel-border/70 flex flex-col h-56 justify-between shadow-inner">
                                <div className="flex items-center justify-between border-b border-panel-border/40 pb-2 mb-2 text-xs font-mono text-gray-500">
                                  <span>ISR Activity Logger</span>
                                  <button 
                                    onClick={() => setInterruptLog(["[System Reset] ISR triggers listening..."])}
                                    className="hover:text-white text-[10px] uppercase font-bold"
                                  >
                                    Reset
                                  </button>
                                </div>
                                <div className="flex-1 font-mono text-[11px] text-teal-400 space-y-1.5 overflow-y-auto select-text scrollbar-thin">
                                  {interruptLog.map((log, idx) => (
                                    <p key={idx} className={idx === 0 ? 'text-white' : 'text-teal-400/80'}>{log}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* H. Editor / Core block Diagrams */}
                        {(selectedLesson.visualType === 'editor' || selectedLesson.visualType === 'table') && (
                          <div className="bg-background border border-panel-border rounded-2xl p-6">
                            <h5 className="text-sm font-semibold text-white mb-4">Functional Block Diagram</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-panel border border-panel-border rounded-xl text-center">
                                <div className="p-2.5 bg-brand/10 border border-brand/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                                  <BookOpen className="h-5 w-5 text-brand" />
                                </div>
                                <h6 className="text-xs font-bold text-white uppercase mb-1">C++ Source Code</h6>
                                <p className="text-[10px] text-gray-400">High-level readable functions compiled via AVR-GCC toolchain.</p>
                              </div>
                              <div className="p-4 bg-panel border border-panel-border rounded-xl text-center">
                                <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                                  <Zap className="h-5 w-5 text-teal-400" />
                                </div>
                                <h6 className="text-xs font-bold text-white uppercase mb-1">AVR hex instructions</h6>
                                <p className="text-[10px] text-gray-400">Compiled machine binaries written directly to 32KB internal FLASH.</p>
                              </div>
                              <div className="p-4 bg-panel border border-panel-border rounded-xl text-center">
                                <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                                  <Signal className="h-5 w-5 text-cyan-400" />
                                </div>
                                <h6 className="text-xs font-bold text-white uppercase mb-1">Physical Signal I/O</h6>
                                <p className="text-[10px] text-gray-400">Toggles physical voltage levels up to 5V on pins 0-13.</p>
                              </div>
                            </div>
                          </div>
                        )}

                      </motion.div>
                    )}

                    {/* Tab 3: Copy-Paste Clean Arduino C++ code Block */}
                    {activeTab === 'code' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-panel-border pb-3">
                          <div>
                            <h4 className="text-xs font-mono font-bold tracking-widest text-brand uppercase">Source C++ Implementation</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Copy directly into your local Arduino IDE workspace.</p>
                          </div>
                          <button
                            onClick={() => copyCodeToClipboard(selectedLesson.code)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy Code
                              </>
                            )}
                          </button>
                        </div>

                        {/* Syntax Highlighted C++ Code container */}
                        <div className="relative">
                          <pre className="bg-background border border-panel-border/80 p-5 sm:p-6 rounded-2xl overflow-x-auto text-xs sm:text-sm font-mono text-emerald-400 leading-relaxed select-text shadow-inner">
                            <code>{selectedLesson.code}</code>
                          </pre>
                        </div>
                      </motion.div>
                    )}

                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
