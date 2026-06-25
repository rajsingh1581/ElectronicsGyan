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
  Layers,
  Sparkles,
  ShieldCheck,
  BookOpenCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/AuthContext';
import ReactMarkdown from 'react-markdown';

interface Topic {
  id: string;
  name: string;
  content: string;
  youtubeUrl?: string;
  isBuiltIn?: boolean;
}

export default function RaspberryPiTutorialPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('headless');
  const [dynamicTopics, setDynamicTopics] = useState<Topic[]>([]);
  const [selectedCustomTopic, setSelectedCustomTopic] = useState<Topic | null>(null);

  useEffect(() => {
    fetch('/api/tutorials?stack=raspberry-pi')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const custom = data.topics.filter((t: any) => !t.isBuiltIn);
          setDynamicTopics(custom);
        }
      })
      .catch((err) => console.error('Error fetching dynamic topics:', err));
  }, []);

  const selectBuiltInTab = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedCustomTopic(null);
  };

  const selectCustomTopic = (topic: Topic) => {
    setActiveTab(topic.id);
    setSelectedCustomTopic(topic);
  };

  const staticTabs = [
    { id: 'headless', label: '1. Headless Setup & SSH', icon: Settings },
    { id: 'python', label: '2. Python GPIO Programming', icon: Zap },
    { id: 'pico', label: '3. Pi Pico C/C++ SDK', icon: BookOpen },
    { id: 'dualcore', label: '4. Pico Dual-Core Execution', icon: Layers }
  ];

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
            <span className="text-white font-medium">Raspberry</span>
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
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  SBC Syllabus
                </span>
                <span className="text-xs text-gray-400">• Level: Intermediate</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                Raspberry & <span className="text-brand">Pi Pico</span>
              </h1>
              <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
                Unlock full single-board computing power. Transition from headless Linux OS configurations and Python scripting to dual-core ARM Cortex bare-metal firmware using the Pi Pico C/C++ SDK.
              </p>
            </div>
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <Cpu className="h-8 w-8 text-rose-400" />
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Syllabus Outline</h3>
              <div className="space-y-1.5">
                {staticTabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => selectBuiltInTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left border cursor-pointer ${
                        isActive 
                          ? 'bg-brand/10 border-brand/40 text-brand' 
                          : 'bg-panel/40 border-panel-border/60 text-gray-300 hover:bg-panel/80 hover:text-white'
                      }`}
                    >
                      <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand' : 'text-gray-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Contributed Topics */}
            {dynamicTopics.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-brand uppercase tracking-wider px-3 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand" /> Dynamic Custom Lessons
                </h3>
                <div className="space-y-1.5">
                  {dynamicTopics.map((topic) => {
                    const isActive = activeTab === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => selectCustomTopic(topic)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left border cursor-pointer ${
                          isActive 
                            ? 'bg-brand/10 border-brand/40 text-brand' 
                            : 'bg-panel/40 border-panel-border/60 text-gray-300 hover:bg-panel/80 hover:text-white'
                        }`}
                      >
                        <BookOpenCheck className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand' : 'text-brand/50'}`} />
                        <span>{topic.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin Management Widget */}
            {user?.role === 'admin' && (
              <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 space-y-3 font-sans">
                <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> Admin Access Mode
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  You are logged in as Administrator. You have full edit access to modify syllabus chapters or inject topics.
                </p>
                <Link
                  href="/tutorial/admin"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand text-white font-bold text-xs rounded-xl hover:bg-brand-light transition-all cursor-pointer text-center"
                >
                  <Sparkles className="w-3 h-3" /> Launch CMS Studio
                </Link>
              </div>
            )}
          </div>

          {/* Main Module Content */}
          <div className="lg:col-span-3">
            <div className="bg-panel border border-panel-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
              
              {activeTab === 'headless' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Settings className="text-rose-400 h-7 w-7" />
                    Headless OS Configuration & SSH Secure Shell
                  </h2>
                  
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Deploying a Raspberry inside products or enclosures means you rarely connect a monitor, keyboard, or mouse. A **headless configuration** allows configuring Wi-Fi and Secure Shell (SSH) access directly on the microSD card.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Headless Command Prompt Checklist</h3>
                  <div className="bg-background/80 p-5 rounded-xl border border-panel-border/70 text-xs font-mono text-gray-300 space-y-3 select-text">
                    <p className="text-rose-400"># 1. Create a placeholder file named &quot;ssh&quot; (no extension) in the boot volume partition:</p>
                    <p className="bg-black/40 p-2 rounded text-emerald-400">$ touch /Volumes/bootfs/ssh</p>
                    
                    <p className="text-rose-400"># 2. To configure auto Wi-Fi connection, create &quot;wpa_supplicant.conf&quot; inside the boot volume:</p>
                    <pre className="bg-black/40 p-3 rounded text-emerald-400">
{`ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
    ssid="Your_WiFi_Name"
    psk="Your_WiFi_Password"
    key_mgmt=WPA-PSK
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'python' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Zap className="text-rose-400 h-7 w-7" />
                    Python Hardware Control (RPi.GPIO)
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Raspberry runs a full Debian-based Linux distribution (Raspberry OS). This enables scripting hardware interactions directly in Python using standard libraries.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Python Blinking GPIO Logic</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`import RPi.GPIO as GPIO
import time

# Use Broadcom SOC Channel pin numbering mapping scheme
GPIO.setmode(GPIO.BCM)

LED_PIN = 18
GPIO.setup(LED_PIN, GPIO.OUT)

try:
    print("Initiating software-driven hardware loop. Click Ctrl+C to terminate.")
    while True:
        # Turn pin output High (3.3V)
        GPIO.output(LED_PIN, GPIO.HIGH)
        time.sleep(1.0) # Yield for 1 second
        
        # Turn pin output Low (0V)
        GPIO.output(LED_PIN, GPIO.LOW)
        time.sleep(1.0)
except KeyboardInterrupt:
    print("Interrupt caught.")
finally:
    # Release GPIO definitions safely back to system registers
    GPIO.cleanup()`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pico' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <BookOpen className="text-rose-400 h-7 w-7" />
                    Raspberry Pico C/C++ SDK
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    The **Raspberry Pico** is a bare-metal microcontroller powered by the custom RP2040 chip. While it can run MicroPython, developing with the official C/C++ SDK provides maximum clock execution speeds and optimal low-level hardware control.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Pico C SDK Hello World</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include <stdio.h>
#include "pico/stdlib.h"

int main() {
    // 1. Initialize all standard I/O pipelines (UART, USB)
    stdio_init_all();
    
    // 2. Select the built-in LED Pin
    const uint LED_PIN = PICO_DEFAULT_LED_PIN;
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    while (true) {
        // Output text directly over USB COM Serial interface
        printf("Pico Hardware active!\\n");
        
        gpio_put(LED_PIN, 1);
        sleep_ms(500);
        
        gpio_put(LED_PIN, 0);
        sleep_ms(500);
    }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'dualcore' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Layers className="text-rose-400 h-7 w-7" />
                    Pico Multi-Core Hardware Execution
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    The RP2040 chip contains two ARM Cortex-M0+ processing cores. The C/C++ SDK lets you easily spin up concurrent algorithms running entirely on Core 1 in parallel to Core 0, with zero scheduling overhead!
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Multi-Core Task Launching</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include <stdio.h>
#include "pico/stdlib.h"
#include "pico/multicore.h"

// Task function to execute specifically on Core 1
void core1_execution_loop() {
    while (true) {
        // Calculate high-complexity mathematical algorithms on Core 1
        int result = 42 * 1337;
        
        // Return output safely to Core 0 using standard hardware FIFOs
        multicore_fifo_push_blocking(result);
        sleep_ms(1000);
    }
}

int main() {
    stdio_init_all();
    
    // Kickstart Core 1 execution!
    multicore_launch_core1(core1_execution_loop);
    
    while (true) {
        // Core 0 handles user interaction, reading sensors etc.
        printf("Main thread polling FIFO...\\n");
        
        // Wait until Core 1 pushes data into the FIFO pipeline
        uint32_t val = multicore_fifo_pop_blocking();
        printf("Result received from Core 1: %d\\n", val);
    }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* Dynamic / Custom Topic rendering */}
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
                      <Sparkles className="text-rose-400 h-7 w-7" />
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
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-panel-border/80 bg-black/40">
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
