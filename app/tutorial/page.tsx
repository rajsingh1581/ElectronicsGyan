'use client';

import Link from 'next/link';
import { BookOpen, Cpu, Terminal, ArrowRight, Layers, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const tutorialTracks = [
  {
    id: 'rtos',
    title: 'RTOS (Real-Time Operating Systems)',
    description: 'Master multi-tasking, task scheduling, mutexes, semaphores, and queue management in low-latency embedded systems.',
    icon: Layers,
    href: '/tutorial/rtos',
    color: 'from-blue-500/20 to-indigo-500/5',
    borderColor: 'group-hover:border-blue-500/50',
    iconColor: 'text-blue-400',
    stats: '4 Comprehensive Modules • Advanced',
    topics: ['Task Creation & Prioritization', 'Binary & Counting Semaphores', 'Queue Management & ISRs', 'Mutexes & Priority Inversion']
  },
  {
    id: 'stm32',
    title: 'STM32 (ARM Cortex-M)',
    description: 'Build robust professional firmware utilizing STM32 CubeHAL, registers, DMA, ADCs, and bare-metal registers.',
    icon: Cpu,
    href: '/tutorial/stm32',
    color: 'from-emerald-500/20 to-teal-500/5',
    borderColor: 'group-hover:border-emerald-500/50',
    iconColor: 'text-emerald-400',
    stats: '5 Technical Modules • Intermediate',
    topics: ['GPIO & External Interrupts (EXTI)', 'Timers, Counters & PWM Generation', 'ADC Conversion & DMA Channels', 'I2C, SPI & UART Protocols']
  },
  {
    id: 'arduino',
    title: 'Arduino (AVR & ESP32)',
    description: 'Learn fast prototyping, physical computing, custom libraries, sensor interfaces, and modern ESP32 Wi-Fi integrations.',
    icon: Terminal,
    href: '/tutorial/arduino',
    color: 'from-cyan-500/20 to-blue-500/5',
    borderColor: 'group-hover:border-cyan-500/50',
    iconColor: 'text-cyan-400',
    stats: '4 Practical Modules • Beginner',
    topics: ['Digital/Analog I/O & Interrupts', 'I2C/SPI Sensor Communication', 'Non-blocking Code with millis()', 'ESP32 Wi-Fi Web Servers']
  },
  {
    id: 'raspberry-pi',
    title: 'Raspberry & Pico',
    description: 'Explore full Linux SBC hardware control with Python GPIOs and bare-metal RP2040 Pico C/C++ SDK development.',
    icon: Terminal,
    href: '/tutorial/raspberry-pi',
    color: 'from-rose-500/20 to-red-500/5',
    borderColor: 'group-hover:border-rose-500/50',
    iconColor: 'text-rose-400',
    stats: '4 Hands-on Modules • All Levels',
    topics: ['Headless OS Configuration', 'Python GPIO & PWM Interfacing', 'Pi Pico C/C++ SDK Setup', 'Dual-Core Programming']
  }
];

export default function TutorialPage() {
  return (
    <div className="w-full bg-background min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 border-b border-panel-border/40 bg-gradient-to-b from-panel/30 to-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-brand-light blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-3.5 bg-brand/10 border border-brand/20 rounded-2xl mb-6 flex items-center justify-center"
              id="tutorial-icon-box"
            >
              <BookOpen className="h-10 w-10 text-brand" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight mb-6"
              id="tutorial-main-title"
            >
              Deep-Dive <span className="text-brand">Engineering Tutorials</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 max-w-3xl leading-relaxed"
            >
              Accelerate your learning curve with complete hardware setup guides, fully annotated code blocks, schematics, and industry-standard embedded software architectures.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Tutorial Tracks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">Select a Learning Track</h2>
            <p className="text-gray-400 text-sm mt-1">Structured syllabus designed to take you from fundamentals to system verification.</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-panel border border-panel-border px-3.5 py-1.5 rounded-full text-gray-400 w-fit">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
            <span>Updated Weekly with Live Code Snippets</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tutorialTracks.map((track, idx) => {
            const IconComponent = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-panel border border-panel-border hover:border-brand/30 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl"
                id={`track-${track.id}`}
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${track.color}`} />

                <div className="p-8 sm:p-10 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 bg-background/50 rounded-2xl border border-panel-border/60">
                      <IconComponent className={`h-8 w-8 ${track.iconColor}`} />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-background/80 px-3.5 py-1.5 rounded-full border border-panel-border/40">
                      {track.stats}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold font-heading text-white group-hover:text-brand transition-colors mb-3">
                    {track.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                    {track.description}
                  </p>

                  <div className="border-t border-panel-border/60 pt-6 mb-8">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4">Core Modules Included:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {track.topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-center text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-brand mr-2.5 shrink-0" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={track.href}
                    className="inline-flex items-center justify-center w-full px-5 py-3.5 bg-background border border-panel-border group-hover:border-brand/40 group-hover:bg-brand group-hover:text-white text-gray-300 font-semibold rounded-xl transition-all shadow-md group-hover:shadow-brand/10 text-sm"
                  >
                    Start Learning Track <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Embedded FAQ or Resources Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-16">
        <div className="bg-panel border border-panel-border/60 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-2xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div>
              <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl mb-4 inline-flex">
                <FileText className="h-6 w-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-heading">Production Ready</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every code repository snippet is compiled and fully verified to ensure error-free embedded environment setup.
              </p>
            </div>
            <div>
              <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl mb-4 inline-flex">
                <Terminal className="h-6 w-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-heading">Complete Schematics</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                We provide clear GPIO connection lists, pull-up/pull-down resistor recommendations, and terminal wirings.
              </p>
            </div>
            <div>
              <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl mb-4 inline-flex">
                <HelpCircle className="h-6 w-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-heading">Need Assistance?</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Connect directly with our engineering authors via the Contact Form to ask questions or verify complex firmware setups.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
