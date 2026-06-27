'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Code2, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  RotateCcw, 
  Cpu, 
  Info, 
  Sparkles, 
  ChevronRight, 
  Settings, 
  FileCode, 
  AlertTriangle,
  Zap,
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CodeTemplate {
  name: string;
  id: string;
  language: string;
  icon: any;
  description: string;
  code: string;
  defaultStdin?: string;
}

const TEMPLATES: CodeTemplate[] = [
  // C++ TEMPLATES
  {
    id: 'hello_world',
    name: 'C++ Hello World',
    language: 'cpp',
    icon: FileCode,
    description: 'Standard boilerplate welcoming program and standard check.',
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World! Welcome to Electronics Gyan C++ Sandbox." << std::endl;
    std::cout << "Compiler standard: C++20 (GCC 13.2)" << std::endl;
    std::cout << "System Architecture: x86_64 POSIX Platform" << std::endl;
    return 0;
}`,
    defaultStdin: ''
  },
  {
    id: 'bubble_sort',
    name: 'C++ Bubble Sort Algorithm',
    language: 'cpp',
    icon: Cpu,
    description: 'Reads data count and numbers from stdin to sort sequentially.',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::cout << "=== BUBBLE SORT ALGORITHM ===" << std::endl;
    
    int n;
    std::cout << "Enter number of elements to sort: ";
    if (!(std::cin >> n)) {
        n = 5;
        std::cout << n << " (default fallback)" << std::endl;
    } else {
        std::cout << n << std::endl;
    }
    
    std::vector<int> arr;
    std::cout << "Reading " << n << " values: ";
    for (int i = 0; i < n; i++) {
        int val;
        if (std::cin >> val) {
            arr.push_back(val);
            std::cout << val << " ";
        } else {
            int fallback_val = (i + 1) * 7 % 13 + 3;
            arr.push_back(fallback_val);
            std::cout << fallback_val << " ";
        }
    }
    std::cout << std::endl;
    
    // Bubble Sort computation
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                std::swap(arr[j], arr[j+1]);
            }
        }
    }
    
    std::cout << "\\nSorted elements: ";
    for (int val : arr) {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
    defaultStdin: "6\n45 12 89 7 34 22"
  },
  {
    id: 'fibonacci',
    name: 'C++ Recursive Fibonacci',
    language: 'cpp',
    icon: Sparkles,
    description: 'Computes deep mathematical sequences from stdin steps recursively.',
    code: `#include <iostream>

long long fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int steps;
    std::cout << "Enter Fibonacci steps limit: ";
    if (!(std::cin >> steps)) {
        steps = 10;
        std::cout << steps << " (default fallback)" << std::endl;
    } else {
        std::cout << steps << std::endl;
    }
    
    if (steps > 35) {
        std::cout << "Error: Steps limit capped at 35 to prevent stack overflow!" << std::endl;
        steps = 35;
    }
    
    std::cout << "\\nGenerating Fibonacci sequence up to " << steps << " steps:" << std::endl;
    for (int i = 0; i < steps; i++) {
        std::cout << "F(" << i << ") = " << fibonacci(i) << std::endl;
    }
    return 0;
}`,
    defaultStdin: "12"
  },
  {
    id: 'stm32_registers',
    name: 'STM32 Register Interfacing',
    language: 'cpp',
    icon: Terminal,
    description: 'Simulates memory-mapped RCC register operations for hardware.',
    code: `#include <iostream>
#include <cstdint>

// Simulate STM32 RCC & GPIO Peripheral Register addresses
#define RCC_AHB1ENR  (*(volatile uint32_t*)(0x40023830))
#define GPIOG_MODER  (*(volatile uint32_t*)(0x40021800))
#define GPIOG_ODR    (*(volatile uint32_t*)(0x40021814))

// Virtual Memory Map values
uint32_t virtual_RCC_AHB1ENR = 0;
uint32_t virtual_GPIOG_MODER = 0;
uint32_t virtual_GPIOG_ODR   = 0;

void simulate_hardware_write(uint32_t address, uint32_t value) {
    std::cout << "[STM32 HARDWARE BUS] Write registers to 0x" << std::hex << address 
              << " <- Bits: 0x" << value << std::dec << std::endl;
}

int main() {
    std::cout << "=== STM32 REGISTER LEVEL PERIPHERAL INITIALIZATION ===" << std::endl;
    
    // Enable GPIOG Peripheral clock (Bit 6 in RCC_AHB1ENR)
    std::cout << "\\nEnabling clock gate for GPIOG bus matrix..." << std::endl;
    virtual_RCC_AHB1ENR |= (1 << 6);
    simulate_hardware_write(0x40023830, virtual_RCC_AHB1ENR);
    
    // Set Pin 13 as General Purpose Output Mode (Bits 27:26 in GPIOG_MODER to 01)
    std::cout << "\\nConfiguring GPIOG Pin 13 Mode register to output (01)..." << std::endl;
    virtual_GPIOG_MODER &= ~(3 << 26); // Clear bits
    virtual_GPIOG_MODER |= (1 << 26);  // Set output
    simulate_hardware_write(0x40021800, virtual_GPIOG_MODER);
    
    // Toggle Pin 13 State (Bit 13 in GPIOG_ODR)
    std::cout << "\\nSetting Output Data Register Bit 13 to HIGH (LED Green ON)..." << std::endl;
    virtual_GPIOG_ODR |= (1 << 13);
    simulate_hardware_write(0x40021814, virtual_GPIOG_ODR);
    
    std::cout << "\\nVirtual registers configuration completed successfully." << std::endl;
    return 0;
}`,
    defaultStdin: ''
  },
  {
    id: 'analog_filter',
    name: 'Arduino Signal Low-Pass Filter',
    language: 'cpp',
    icon: FileCode,
    description: 'Filters noisy analog ADC voltage inputs using an Exponential Moving Average algorithm.',
    code: `#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

// Simulated Exponential Moving Average Filter
float ema_filter(float current_val, float prev_filtered, float alpha = 0.25f) {
    return (alpha * current_val) + ((1.0f - alpha) * prev_filtered);
}

int main() {
    std::cout << "=== ARDUINO ANALOG CONVERSION FILTER ===" << std::endl;
    std::cout << "Applies EMA DSP filter to suppress electrical noise." << std::endl;
    
    // Simulated noisy sensor voltages
    std::vector<float> raw_readings = {1.85f, 3.42f, 2.10f, 2.95f, 2.25f, 2.50f, 2.05f};
    float filtered_signal = raw_readings[0];
    
    std::cout << std::fixed << std::setprecision(3);
    std::cout << "\\n| Step | Raw Signal (V) | Filtered (V) | Attenuated Error |" << std::endl;
    std::cout << "|------|----------------|--------------|------------------|" << std::endl;
    
    for (size_t i = 0; i < raw_readings.size(); i++) {
        float raw = raw_readings[i];
        float prev = filtered_signal;
        filtered_signal = ema_filter(raw, prev);
        
        float variance = std::abs(raw - filtered_signal) / raw * 100.0f;
        std::cout << "|  t=" << i << " |     " << raw << " V    |    " 
                  << filtered_signal << " V   |      " << variance << "%       |" << std::endl;
    }
    return 0;
}`,
    defaultStdin: ''
  },

  // C TEMPLATES
  {
    id: 'hello_world_c',
    name: 'C Hello World',
    language: 'c',
    icon: FileCode,
    description: 'Standard boilerplate welcoming program and standard check.',
    code: `#include <stdio.h>

int main() {
    printf("Hello, World! Welcome to Electronics Gyan C Sandbox.\\n");
    printf("Compiler standard: C11 (GCC 13.2)\\n");
    printf("System Architecture: x86_64 POSIX Platform\\n");
    return 0;
}`,
    defaultStdin: ''
  },
  {
    id: 'bubble_sort_c',
    name: 'C Bubble Sort Algorithm',
    language: 'c',
    icon: Cpu,
    description: 'Reads data count and numbers from stdin to sort sequentially.',
    code: `#include <stdio.h>

void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}

int main() {
    printf("=== C BUBBLE SORT ALGORITHM ===\\n");
    int n = 5;
    int arr[] = {64, 34, 25, 12, 22};
    
    printf("Original array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    // Bubble sort
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(&arr[j], &arr[j+1]);
            }
        }
    }
    
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
    defaultStdin: ''
  },
  {
    id: 'fibonacci_c',
    name: 'C Recursive Fibonacci',
    language: 'c',
    icon: Sparkles,
    description: 'Computes Fibonacci sequence recursively inside stack layers.',
    code: `#include <stdio.h>

long long fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("=== C RECURSIVE FIBONACCI ===\\n");
    int steps = 10;
    
    printf("Generating Fibonacci sequence up to %d steps:\\n", steps);
    for (int i = 0; i < steps; i++) {
        printf("F(%d) = %lld\\n", i, fibonacci(i));
    }
    return 0;
}`,
    defaultStdin: ''
  },
  {
    id: 'pointers_c',
    name: 'C Pointers & Memory Address',
    language: 'c',
    icon: Terminal,
    description: 'Demonstrates physical address dereferencing and local memory layouts.',
    code: `#include <stdio.h>

int main() {
    printf("=== C POINTERS & MEMORY SIMULATOR ===\\n");
    int var = 42;
    int *ptr = &var;
    
    printf("Variable value: %d\\n", var);
    printf("Variable memory address (Stack): %p\\n", (void*)&var);
    printf("Pointer stored address: %p\\n", (void*)ptr);
    printf("Dereferenced value from pointer (*ptr): %d\\n", *ptr);
    
    // Modify via pointer
    *ptr = 100;
    printf("\\nAfter modification (*ptr = 100):\\n");
    printf("Variable new value: %d\\n", var);
    return 0;
}`,
    defaultStdin: ''
  },
  {
    id: 'struct_c',
    name: 'C Structure (ADC Config)',
    language: 'c',
    icon: FileCode,
    description: 'Simulates sensor alignments inside structured byte layouts.',
    code: `#include <stdio.h>
#include <stdint.h>

typedef struct {
    uint32_t Channel;
    uint32_t Resolution;
    uint32_t ScanConvMode;
    uint32_t ContinuousConvMode;
} ADC_Config_t;

int main() {
    printf("=== STRUCT REPRESENTATION IN C ===\\n");
    ADC_Config_t myAdc;
    myAdc.Channel = 5;
    myAdc.Resolution = 12; // 12-bit ADC
    myAdc.ScanConvMode = 1; // Enabled
    myAdc.ContinuousConvMode = 0; // Single Shot
    
    printf("ADC Config Channel: %u\\n", myAdc.Channel);
    printf("ADC Resolution: %u-bit (Max value %d)\\n", myAdc.Resolution, (1 << myAdc.Resolution) - 1);
    printf("ADC Scan Mode: %s\\n", myAdc.ScanConvMode ? "ENABLED" : "DISABLED");
    printf("ADC Size of Struct: %zu bytes\\n", sizeof(ADC_Config_t));
    return 0;
}`,
    defaultStdin: ''
  }
];

export default function CompilerPage() {
  const [language, setLanguage] = useState<'cpp' | 'c'>('cpp');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('hello_world');
  const [code, setCode] = useState<string>(TEMPLATES[0].code);
  const [stdin, setStdin] = useState<string>('');
  
  // Execution engine selection (turbo vs ai)
  const [engine, setEngine] = useState<'turbo' | 'ai'>('turbo'); // 'turbo' is instant like OnlineGDB!
  
  // Execution states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compiled, setCompiled] = useState<boolean | null>(null);
  const [compilerLogs, setCompilerLogs] = useState<string>('');
  const [programLogs, setProgramLogs] = useState<string>('Terminal ready. Choose options and click "Compile & Run Code" to execute.');
  const [execTime, setExecTime] = useState<number | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);

  // Layout preference states
  const [copied, setCopied] = useState<boolean>(false);

  // Compute line numbers on the fly
  const lineNumbers = Array.from({ length: code.split('\n').length }, (_, i) => i + 1);

  // Filter templates based on current language
  const filteredTemplates = TEMPLATES.filter(t => t.language === language);

  // Handle language switch
  const handleLanguageChange = (newLang: 'cpp' | 'c') => {
    setLanguage(newLang);
    // Select first template of the new language
    const defaultTemplate = TEMPLATES.find(t => t.language === newLang);
    if (defaultTemplate) {
      setSelectedTemplate(defaultTemplate.id);
      setCode(defaultTemplate.code);
      setStdin(defaultTemplate.defaultStdin || '');
      setCompiled(null);
      setCompilerLogs('');
      setProgramLogs(`Loaded ${defaultTemplate.name}. Compiler set to ${newLang === 'cpp' ? 'G++ 13.2' : 'GCC 13.2'}`);
      setExecTime(null);
      setMemoryUsage(null);
      setExitCode(null);
    }
  };

  // Load selected template
  const handleTemplateChange = (id: string) => {
    const template = TEMPLATES.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setCode(template.code);
      setStdin(template.defaultStdin || '');
      setCompiled(null);
      setCompilerLogs('');
      setProgramLogs('Terminal ready. Loaded ' + template.name);
      setExecTime(null);
      setMemoryUsage(null);
      setExitCode(null);
    }
  };

  // Perform C/C++ Code execution by communicating with server API
  const handleExecute = async (optimize: boolean = false) => {
    setIsLoading(true);
    setCompiled(null);
    
    const binaryName = language === 'cpp' ? 'g++' : 'gcc';
    const stdFlag = language === 'cpp' ? '-std=c++20' : '-std=c11';
    const fileExtension = language === 'cpp' ? 'cpp' : 'c';
    
    setCompilerLogs(`Initiating ${binaryName} build system...\n$ ${binaryName} ${optimize ? '-O3' : '-O0'} -Wall ${stdFlag} main.${fileExtension} -o main`);
    setProgramLogs('Assembling logic blocks & mounting dynamic stack frames...');
    setExecTime(null);
    setMemoryUsage(null);
    setExitCode(null);

    try {
      const response = await fetch('/api/compiler/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          stdin,
          language,
          optimize,
          engine
        })
      });

      const data = await response.json();

      if (data.success) {
        setCompiled(data.compiled);
        setCompilerLogs(data.compilerOutput || `${binaryName}: build successful. ELF static link established.`);
        setProgramLogs(data.programOutput || 'No stdout generated.');
        setExecTime(data.executionTimeMs ?? 1);
        setMemoryUsage(data.memoryUsageKb ?? (language === 'cpp' ? 128 : 64));
        setExitCode(data.exitCode ?? 0);
      } else {
        setCompiled(false);
        setCompilerLogs(`${binaryName} fatal error: build stream interrupted.\n` + (data.error || 'General execution fault.'));
        setProgramLogs('');
        setExitCode(1);
      }
    } catch (err: any) {
      setCompiled(false);
      setCompilerLogs(`Linker Exception: Build process timed out.\nError: ${err.message}`);
      setProgramLogs('');
      setExitCode(1);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode('');
    setCompiled(null);
    setCompilerLogs('');
    setProgramLogs('Workspace cleared.');
    setExecTime(null);
    setMemoryUsage(null);
    setExitCode(null);
  };

  return (
    <div className="w-full bg-background min-h-screen text-white pb-20">
      
      {/* Breadcrumbs Header */}
      <div className="border-b border-panel-border/30 bg-panel/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Online C/C++ Compiler</span>
          </div>
          <Link href="/tutorial" className="inline-flex items-center text-xs text-brand hover:text-brand-light font-semibold transition-all">
            <Code2 className="w-3.5 h-3.5 mr-1" /> View Tutorials
          </Link>
        </div>
      </div>

      {/* Hero Intro */}
      <section className="py-10 bg-gradient-to-b from-panel/20 to-background border-b border-panel-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Core Engineering Tools
                </span>
                <span className="text-xs text-gray-400">• High Speed Sandbox</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                Online <span className="text-brand">C/C++ Compiler</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-3xl leading-relaxed">
                Choose C or C++ compilers. Experience lightning-fast builds as fast as OnlineGDB using the dedicated Turbo Engine. Write, run, and inspect standard stream operations in milliseconds.
              </p>
            </div>
            
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4">
              <div className="p-3 bg-brand/10 rounded-xl">
                <Cpu className="h-8 w-8 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-400">GNU Compiler Suite</p>
                <p className="text-sm font-bold text-white font-mono">GCC/G++ 13.2</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main IDE Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: Code Editor, Templates, Stdin (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Compiler & Settings Configuration Bar */}
            <div className="bg-panel border border-panel-border rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Language Selection tabs */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Language:</span>
                <div className="bg-background p-1 rounded-xl border border-panel-border flex gap-1">
                  <button
                    onClick={() => handleLanguageChange('cpp')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${language === 'cpp' ? 'bg-brand text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    C++ (G++)
                  </button>
                  <button
                    onClick={() => handleLanguageChange('c')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${language === 'c' ? 'bg-brand text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    C (GCC)
                  </button>
                </div>
              </div>

              {/* Execution Engine Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-brand" /> Engine:
                </span>
                <div className="bg-background p-1 rounded-xl border border-panel-border flex gap-1">
                  <button
                    onClick={() => setEngine('turbo')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${engine === 'turbo' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-white border border-transparent'}`}
                    title="Instant sub-10ms execution, great for loops, sorting, and prints."
                  >
                    <Zap className="w-3 h-3 fill-current" /> Turbo Sim
                  </button>
                  <button
                    onClick={() => setEngine('ai')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${engine === 'ai' ? 'bg-brand/20 text-brand border border-brand/30' : 'text-gray-400 hover:text-white border border-transparent'}`}
                    title="Deep AI-powered compiler execution analysis."
                  >
                    <Sparkles className="w-3 h-3" /> AI Sandbox
                  </button>
                </div>
              </div>

            </div>

            {/* Template select dropdown toolbar */}
            <div className="bg-panel border border-panel-border/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Settings className="w-5 h-5 text-brand shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Templates:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="bg-background border border-panel-border px-3 py-1.5 rounded-xl text-xs text-white focus:outline-none focus:border-brand flex-1 sm:flex-none font-semibold cursor-pointer"
                >
                  {filteredTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={copyCodeToClipboard}
                  className="p-2 hover:bg-background border border-transparent hover:border-panel-border text-gray-400 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => handleTemplateChange(selectedTemplate)}
                  className="p-2 hover:bg-background border border-transparent hover:border-panel-border text-gray-400 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Reset Template"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Clear Code"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>

            {/* Code Editor Container */}
            <div className="bg-panel border border-panel-border rounded-3xl overflow-hidden shadow-xl flex flex-col">
              {/* Editor Header tab */}
              <div className="flex items-center justify-between px-5 py-3 bg-panel-border/30 border-b border-panel-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-gray-400 ml-2">main.{language === 'cpp' ? 'cpp' : 'c'}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">
                  {language === 'cpp' ? 'C++20 GCC Standard Library' : 'C11 GCC Libc'} enabled
                </span>
              </div>

              {/* Code TextArea with side line-numbers */}
              <div className="flex bg-slate-950 font-mono text-sm leading-relaxed p-4 h-[450px] relative overflow-hidden">
                {/* Line Numbers column */}
                <div className="text-gray-600 text-right pr-4 select-none border-r border-panel-border/20 w-10 flex flex-col shrink-0">
                  {lineNumbers.map((line) => (
                    <span key={line} className="block text-xs h-6">{line}</span>
                  ))}
                </div>

                {/* Editable Text Area */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent text-gray-100 outline-none resize-none pl-4 pr-2 text-xs md:text-sm font-mono leading-relaxed h-6 select-text overflow-y-auto"
                  style={{ lineHeight: '1.5rem', tabSize: 4 }}
                  placeholder={language === 'cpp' ? '// Enter C++ code here...' : '// Enter C code here...'}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Stdin Streams Panel */}
            <div className="bg-panel border border-panel-border rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-brand" /> Standard Input (stdin)
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">Stream values for inputs (scanf/cin)</span>
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                className="w-full bg-background border border-panel-border p-3.5 rounded-xl font-mono text-xs text-white outline-none focus:border-brand transition-all h-24 resize-none placeholder-gray-600"
                placeholder="Type inputs here (e.g. 5 or series '12 85 90' separated by space/newline)..."
              />
            </div>

            {/* Control Run Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleExecute(false)}
                disabled={isLoading}
                className="w-full py-4 bg-brand hover:bg-brand-light text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-brand/10 hover:shadow-brand/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:translate-y-0"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                Compile & Run Code
              </button>

              <button
                onClick={() => handleExecute(true)}
                disabled={isLoading}
                className="w-full py-4 bg-panel border-2 border-panel-border hover:border-brand/40 text-brand hover:text-brand-light font-bold text-sm rounded-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                Compile with O3 Optimization
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: Interactive Output, Metrics (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Bash Terminal Output window */}
            <div className="bg-slate-950 border border-panel-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              
              {/* Terminal Title Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-panel-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 font-semibold tracking-wide">Linux Bash Console Output</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">
                    {engine === 'turbo' ? 'turbo runner active' : 'ai simulator active'}
                  </span>
                </div>
              </div>

              {/* Console Body text */}
              <div className="p-5 font-mono text-xs text-slate-300 space-y-5 h-[340px] overflow-y-auto select-text scrollbar-thin">
                
                {/* 1. Compilation Steps Log */}
                {compilerLogs && (
                  <div className="space-y-1">
                    <p className="text-gray-500"># Compiler diagnostics</p>
                    <pre className="whitespace-pre-wrap text-teal-400/90 leading-relaxed font-semibold">
                      {compilerLogs}
                    </pre>
                  </div>
                )}

                {/* 2. Runtime execution stdout stream */}
                <div className="space-y-1">
                  <p className="text-gray-500">$ ./main</p>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-brand">
                      <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                      <span>Running compile sequences and parsing stdin...</span>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-white leading-relaxed text-sm select-text">
                      {programLogs}
                    </pre>
                  )}
                </div>

                {/* Blinking cursor at the end */}
                {!isLoading && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">$</span>
                    <span className="w-1.5 h-4 bg-brand animate-pulse" />
                  </div>
                )}
              </div>

              {/* Diagnostics Metrics Tray */}
              <div className="p-4 bg-slate-900 border-t border-panel-border/50 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                <div className="p-2.5 bg-panel-border/20 rounded-xl">
                  <p className="text-gray-400 mb-0.5">Exec Time</p>
                  <p className="font-bold text-white font-mono">
                    {execTime !== null ? `${execTime} ms` : '--'}
                  </p>
                </div>
                <div className="p-2.5 bg-panel-border/20 rounded-xl">
                  <p className="text-gray-400 mb-0.5">Heap RAM</p>
                  <p className="font-bold text-white font-mono">
                    {memoryUsage !== null ? `${memoryUsage} KB` : '--'}
                  </p>
                </div>
                <div className="p-2.5 bg-panel-border/20 rounded-xl">
                  <p className="text-gray-400 mb-0.5">Exit Signal</p>
                  <p className={`font-bold font-mono ${exitCode === 0 ? 'text-emerald-400' : exitCode !== null ? 'text-red-400' : 'text-white'}`}>
                    {exitCode !== null ? `code ${exitCode}` : '--'}
                  </p>
                </div>
              </div>

            </div>

            {/* Warning diagnostic card */}
            {compiled === false && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Compilation Failed</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    The source code contains C/C++ syntax errors or illegal structure layouts. Please check semicolons, closing brackets, matching parentheses, or verify includes.
                  </p>
                </div>
              </motion.div>
            )}

            {compiled === true && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3"
              >
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Compilation Successful</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Code built successfully with {language === 'cpp' ? 'g++ 13.2' : 'gcc 13.2'}. Stack allocation maps configured and execution metrics generated cleanly.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Educational Info Card */}
            <div className="bg-panel border border-panel-border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand" /> C vs C++ Compilation
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Both languages are built using GCC, but feature key technical differences:
              </p>
              
              <div className="space-y-2.5 text-[11px] font-mono text-gray-400">
                <div className="flex gap-2">
                  <span className="text-brand">C Standard (GCC)</span>
                  <span>- Procedural paradigm. No function overloading, classes, or standard namespaces. Emphasizes structures, pointers, and manual memory (`malloc`/`free`).</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-brand">C++ Standard (G++)</span>
                  <span>- Multi-paradigm. Adds Object-Oriented Programming (OOP), templates, namespaces, references, smart pointers, and a rich STL (`std::vector`, `std::map`).</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
