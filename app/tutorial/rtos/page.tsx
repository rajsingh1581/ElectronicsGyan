'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Cpu, 
  ChevronRight, 
  BookOpen, 
  Clock, 
  Code2, 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  Copy, 
  Check, 
  Lock, 
  HelpCircle, 
  Activity, 
  ExternalLink,
  Eye,
  Sliders,
  Settings,
  Layers,
  Database,
  Radio,
  FileText,
  Terminal,
  Zap,
  TrendingUp,
  Table,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  ListTodo,
  Sparkles,
  ShieldCheck,
  BookOpenCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/AuthContext';
import ReactMarkdown from 'react-markdown';
import { API_TOPICS, ApiTopic } from './data';
import { THEORY_SECTIONS, TheorySection } from './theoryData';

// Helper component for copying text to clipboard
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 bg-background/60 hover:bg-background border border-panel-border/40 rounded-lg text-gray-400 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer z-10"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// Custom interactive diagrams representing API mechanisms
function ApiDiagram({ type }: { type: string }) {
  const [semCount, setSemCount] = useState(2);
  const [isLocked, setIsLocked] = useState(false);
  const [priorityInherited, setPriorityInherited] = useState(false);
  const [eventBits, setEventBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [queueItems, setQueueData] = useState<string[]>(['Telemetry', 'Control', 'Log']);

  return (
    <div className="w-full bg-background/50 border border-panel-border/50 rounded-2xl p-5 my-6">
      <div className="flex items-center justify-between mb-4 border-b border-panel-border/30 pb-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-brand" /> Interactive Kernel Simulation
        </span>
        <span className="text-[10px] font-mono text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
          Live Interactive
        </span>
      </div>

      {type === 'task_lifecycle' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Hover over task states to see transition routes and scheduler dispatch triggers:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-2">
            {[
              { id: 'Ready', desc: 'Active in Ready List. Selected based on priorities.', color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300' },
              { id: 'Running', desc: 'Currently executing instructions on CPU. Core owns TCB.', color: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30' },
              { id: 'Blocked', desc: 'Asleep waiting for Delay Timer, Semaphore, or Queue resource.', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
              { id: 'Suspended', desc: 'Completely idle. Excluded from scheduling algorithms.', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' }
            ].map((state) => (
              <div 
                key={state.id}
                className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all duration-300 hover:scale-[1.03] group relative cursor-help ${state.color}`}
              >
                {state.id}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-panel border border-panel-border rounded-xl text-[10px] text-gray-300 font-normal leading-relaxed shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {state.desc}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-around items-center text-[10px] text-gray-400 font-mono border-t border-panel-border/20 pt-3">
            <span>xTaskCreate() → READY</span>
            <span>vTaskDelay() → BLOCKED</span>
            <span>vTaskSuspend() → SUSPENDED</span>
          </div>
        </div>
      )}

      {type === 'task_static' && (
        <div className="space-y-3 font-mono text-xs">
          <p className="text-xs text-gray-400 font-sans">Static RAM allocation maps compile-time buffers, avoiding the heap entirely:</p>
          <div className="border border-panel-border/40 rounded-xl overflow-hidden text-center">
            <div className="bg-panel-border/20 p-2 text-[10px] text-gray-400 border-b border-panel-border/40 font-bold uppercase">
              Microcontroller SRAM layout
            </div>
            <div className="grid grid-cols-3 divide-x divide-panel-border/40 bg-background/30 text-[10px] sm:text-xs">
              <div className="p-3">
                <span className="block text-brand font-bold text-xs">StackType_t xStack[]</span>
                <span className="text-[10px] text-gray-400">Fixed Stack Size Buffer</span>
                <div className="w-full bg-brand/10 border border-brand/20 h-3 rounded mt-2 animate-pulse" />
              </div>
              <div className="p-3 bg-panel/30">
                <span className="block text-emerald-400 font-bold text-xs">StaticTask_t xTaskBuffer</span>
                <span className="text-[10px] text-gray-400">Task Control Block (TCB)</span>
                <div className="w-full bg-emerald-500/10 border border-emerald-500/20 h-3 rounded mt-2" />
              </div>
              <div className="p-3 text-gray-500 flex items-center justify-center italic text-[10px]">
                Safe from Dynamic Allocation Fragmentation
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'task_delay' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Blocked tasks yield CPU cores instantly, letting ready tasks of equal/lower priority run:</p>
          <div className="relative border border-panel-border/40 rounded-xl p-3 bg-background/40">
            <div className="flex h-16 items-center gap-1 font-mono text-[9px] text-center">
              <div className="w-1/4 h-full bg-emerald-500/20 border border-emerald-500/40 rounded flex flex-col justify-center">
                <span className="text-emerald-400 font-bold">TASK A</span>
                <span>Active</span>
              </div>
              <div className="w-1/2 h-full bg-blue-500/10 border border-blue-500/25 border-dashed rounded flex flex-col justify-center relative">
                <span className="text-blue-300 font-bold">TASK A BLOCKED</span>
                <span className="text-gray-400">vTaskDelay( 500ms )</span>
                <div className="absolute inset-x-0 bottom-1 flex justify-center text-brand font-bold animate-pulse text-[11px] gap-1">
                  <Clock className="w-3.5 h-3.5" /> Blocked Yielding...
                </div>
              </div>
              <div className="w-1/4 h-full bg-purple-500/20 border border-purple-500/40 rounded flex flex-col justify-center">
                <span className="text-purple-300 font-bold">TASK B</span>
                <span>Runs now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'queue_send_recv' || type === 'queue_create' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Live thread-safe FIFO data pipeline (Length: 5 slots):</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setQueueData([...queueItems, `Msg ${Math.floor(Math.random() * 100)}`].slice(0, 5))}
                disabled={queueItems.length >= 5}
                className="px-2.5 py-1 bg-brand hover:bg-brand-light text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer disabled:opacity-30"
              >
                + Push Item
              </button>
              <button 
                onClick={() => setQueueData(queueItems.slice(1))}
                disabled={queueItems.length === 0}
                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold rounded-lg transition-all border border-red-500/30 cursor-pointer disabled:opacity-30"
              >
                - Pop Item
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-3 mt-2">
            {[0, 1, 2, 3, 4].map((idx) => {
              const hasVal = queueItems[idx];
              return (
                <div 
                  key={idx}
                  className={`h-16 rounded-xl border flex flex-col items-center justify-center text-[10px] font-mono transition-all duration-300 ${
                    hasVal 
                      ? 'border-brand/60 bg-brand/10 text-brand shadow-lg scale-[1.03]' 
                      : 'border-panel-border/40 bg-panel/20 text-gray-600'
                  }`}
                >
                  <span className="text-[8px] text-gray-500 mb-1">Slot {idx}</span>
                  <span className="font-bold">{hasVal || 'EMPTY'}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
            <span>Tail (Enqueue)</span>
            <span className="text-brand font-bold">Queue Size: {queueItems.length} / 5</span>
            <span>Head (Dequeue)</span>
          </div>
        </div>
      ) : null}

      {type === 'mutex_lock' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-sans">Simulating Mutual Exclusion resource exclusivity & priority inheritance:</p>
            <button 
              onClick={() => {
                setIsLocked(!isLocked);
                if (!isLocked) {
                  setPriorityInherited(true);
                } else {
                  setPriorityInherited(false);
                }
              }}
              className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg border transition-all cursor-pointer ${
                isLocked 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isLocked ? 'Release Mutex' : 'Acquire Mutex'}
            </button>
          </div>

          <div className="border border-panel-border/40 rounded-xl p-4 flex flex-col md:flex-row items-center justify-around gap-6 bg-background/20 font-mono text-xs">
            <div className="text-center">
              <span className="block text-[10px] text-gray-500">TASK A (High Priority)</span>
              <div className={`p-2.5 rounded-lg border text-[11px] font-bold mt-1 ${isLocked ? 'border-red-500/40 text-red-400 animate-pulse' : 'border-emerald-500/40 text-emerald-400'}`}>
                {isLocked ? 'Blocked on Mutex' : 'Executing Normally'}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 mb-1">UART Hardware Peripheral</span>
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-300 ${
                isLocked ? 'border-red-500/60 bg-red-500/20 text-red-400 scale-[1.05]' : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400'
              }`}>
                <Lock className={`w-6 h-6 ${isLocked ? 'animate-bounce' : ''}`} />
              </div>
              <span className="text-[9px] text-gray-500 mt-1 font-bold">{isLocked ? 'LOCKED' : 'AVAILABLE'}</span>
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-gray-500">TASK B (Low Priority)</span>
              <div className={`p-2.5 rounded-lg border text-[11px] font-bold mt-1 ${
                isLocked 
                  ? priorityInherited 
                    ? 'border-brand/60 bg-brand/20 text-brand ring-2 ring-brand/30' 
                    : 'border-yellow-500/40 text-yellow-400'
                  : 'border-gray-600 text-gray-400'
              }`}>
                {isLocked ? (priorityInherited ? 'Holds Mutex (Inherited Priority)' : 'Holds Mutex') : 'Idle'}
              </div>
            </div>
          </div>
          {isLocked && (
            <p className="text-[10px] text-brand leading-relaxed font-sans text-center">
              ✦ **Priority Inheritance Active**: Task B priority is raised to match Task A priority, preventing medium priority tasks from preempting Task B and locking out Task A.
            </p>
          )}
        </div>
      )}

      {type === 'semaphore_counting' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-sans">Simulating a Counting Semaphore with 4 shared resources:</p>
            <div className="flex gap-2 font-mono">
              <button 
                onClick={() => setSemCount(Math.max(0, semCount - 1))}
                disabled={semCount === 0}
                className="px-2.5 py-1 bg-brand hover:bg-brand-light text-white text-[10px] font-bold rounded-lg cursor-pointer disabled:opacity-30"
              >
                Take Semaphore
              </button>
              <button 
                onClick={() => setSemCount(Math.min(4, semCount + 1))}
                disabled={semCount === 4}
                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30 cursor-pointer disabled:opacity-30"
              >
                Give Semaphore
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {[1, 2, 3, 4].map((slot) => {
              const active = slot <= semCount;
              return (
                <div 
                  key={slot}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    active 
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold scale-[1.03]' 
                      : 'border-panel-border/30 bg-panel/10 text-gray-600'
                  }`}
                >
                  <span className="text-[8px] text-gray-500">Resource {slot}</span>
                  <div className={`w-3 h-3 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-700'}`} />
                  <span className="text-[9px] font-mono">{active ? 'FREE' : 'IN USE'}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 font-mono text-center">
            Current Semaphore Token Balance: <span className="text-brand font-bold">{semCount} / 4</span> available slots.
          </p>
        </div>
      )}

      {type === 'timer_running' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Software timers operate asynchronously outside hardware interrupt timers:</p>
          <div className="border border-panel-border/40 rounded-xl p-4 bg-background/30 flex flex-col items-center justify-center font-mono">
            <div className="w-full max-w-xs bg-panel-border/20 h-4 rounded-full overflow-hidden relative border border-panel-border/30">
              <div className="bg-brand h-full w-3/4 rounded-full animate-pulse" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                Countdown: 1500ms / 2000ms
              </span>
            </div>
            <div className="flex gap-12 mt-4 text-center text-[10px]">
              <div>
                <span className="text-gray-500 block">Timer Period</span>
                <span className="text-white font-bold text-xs">2000 ms</span>
              </div>
              <div>
                <span className="text-gray-500 block">Daemon Task Context</span>
                <span className="text-brand font-bold text-xs">TIMER DAEMON</span>
              </div>
              <div>
                <span className="text-gray-500 block">Auto-Reload</span>
                <span className="text-emerald-400 font-bold text-xs">pdFALSE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'event_bits' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Event Flags logical AND/OR synchronization checker (Interactive):</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[
              { idx: 0, label: '0x01: WiFi Connected' },
              { idx: 1, label: '0x02: MQTT Ready' },
              { idx: 2, label: '0x04: Sensor Sync' },
              { idx: 3, label: '0x08: Config Loaded' }
            ].map((bit) => (
              <button 
                key={bit.idx}
                onClick={() => {
                  const copy = [...eventBits];
                  copy[bit.idx] = !copy[bit.idx];
                  setEventBits(copy);
                }}
                className={`p-2.5 rounded-xl border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  eventBits[bit.idx] 
                    ? 'border-brand/60 bg-brand/15 text-brand shadow' 
                    : 'border-panel-border/30 bg-panel/10 text-gray-400 hover:bg-panel/20'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${eventBits[bit.idx] ? 'bg-brand' : 'bg-gray-700'}`} />
                {bit.label}
              </button>
            ))}
          </div>

          <div className="bg-panel/40 border border-panel-border/40 p-3 rounded-xl font-mono text-[11px] flex justify-between items-center mt-3">
            <div>
              <span className="text-gray-500">WaitBits Requirement:</span>
              <span className="text-white block font-bold">WiFi (0x01) AND MQTT (0x02)</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              {eventBits[0] && eventBits[1] ? (
                <span className="text-emerald-400 block font-brand font-bold uppercase animate-pulse">✦ UNBLOCKED!</span>
              ) : (
                <span className="text-yellow-500 block font-bold">● BLOCKED (Waiting)</span>
              )}
            </div>
          </div>
        </div>
      )}

      {type === 'buffer_stream' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">Stream Buffer pipeline optimized for raw DMA byte transmission:</p>
          <div className="border border-panel-border/40 rounded-xl p-4 bg-background/30 text-center font-mono text-xs">
            <div className="flex justify-center gap-1.5 items-center mb-3">
              <span className="text-gray-500">DMA stream write</span>
              <ChevronRight className="w-4 h-4 text-gray-500 animate-ping" />
              <div className="bg-brand/10 border border-brand/30 px-3 py-1 rounded text-brand font-bold text-xs font-mono">
                [ 0x3F, 0x42, 0x9A, 0x00, 0xF1 ]
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">Task read</span>
            </div>
            <p className="text-[10px] text-gray-400">Allows zero-copy raw byte transfers bypassing task context structures.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component containing 6 deep interactive theoretical simulations
function TheoryVisualizer({ type }: { type: string }) {
  // 1. Determinism states
  const [detMode, setDetMode] = useState<'rtos' | 'gpos'>('rtos');
  const [detTick, setDetTick] = useState(0);
  const [detJitterHistory, setDetJitterHistory] = useState<number[]>([]);

  // 2. Deadline states
  const [deadlineType, setDeadlineType] = useState<'hard' | 'soft' | 'firm'>('hard');
  const [deadlineProgress, setDeadlineProgress] = useState(0);
  const [deadlineState, setDeadlineState] = useState<'idle' | 'running' | 'done'>('idle');

  // 3. Scheduling state
  const [schedRunning, setSchedRunning] = useState(false);
  const [schedActiveTask, setSchedActiveTask] = useState<string>('Idle Task');
  const [schedQueue, setSchedQueue] = useState<string[]>([]);
  const [schedLogs, setSchedLogs] = useState<string[]>(['Scheduler online. Waiting to execute...']);

  // 4. Context switch flow stepper state
  const [flowStep, setFlowStep] = useState(0);

  // 5. Priority Inversion simulation states
  const [inversionStep, setInversionStep] = useState(0);
  const [priorityInheritance, setPriorityInheritance] = useState(false);

  // 6. ISR Latency states
  const [isrType, setIsrType] = useState<'direct' | 'deferred'>('direct');
  const [isrTimeline, setIsrTimeline] = useState<Array<{ type: 'ok' | 'fail' | 'empty', label: string }>>([
    { type: 'empty', label: 'Idle' },
    { type: 'empty', label: 'Idle' },
    { type: 'empty', label: 'Idle' },
    { type: 'empty', label: 'Idle' }
  ]);

  // Clock effect for determinism ticker
  useEffect(() => {
    let timer: any;
    if (type === 'determinism') {
      timer = setInterval(() => {
        setDetTick((prev) => {
          const next = (prev + 1) % 100;
          if (next % 25 === 0) {
            // Generate deterministic or jittery response
            if (detMode === 'rtos') {
              setDetJitterHistory((h) => [...h.slice(-10), 2.5]); // very constant
            } else {
              const jitter = Math.random() * 120 + 20; // wild fluctuations
              setDetJitterHistory((h) => [...h.slice(-10), jitter]);
            }
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [type, detMode]);

  // Handler for Deadline execution playhead
  useEffect(() => {
    let timer: any;
    if (deadlineState === 'running') {
      timer = setInterval(() => {
        setDeadlineProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setDeadlineState('done');
            return 100;
          }
          return prev + 5;
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [deadlineState]);

  // Handler for Priority Inversion simulator step updates
  const inversionLogs = useMemo(() => {
    const logs: string[] = ['System boot. Initial task state ready.'];
    if (inversionStep >= 1) {
      logs.push('➜ Low Task (L) starts running. Claims critical SPI Bus Mutex.');
    }
    if (inversionStep >= 2) {
      logs.push('➜ High Task (H) awakens! Attempts to lock SPI Mutex. Blocked, goes to sleep.');
    }
    if (inversionStep >= 3) {
      logs.push('➜ Medium Task (M) awakens. M priority (2) > L priority (1). M preempts L.');
    }
    if (inversionStep >= 4) {
      if (priorityInheritance) {
        logs.push('★ PRIORITY INHERITANCE TRIGGERED!');
        logs.push('➜ Kernel elevates L priority temporarily to 3 (matching High Task H).');
        logs.push('➜ Medium Task (M) is blocked from preempting L. L runs, completes, releases Mutex.');
        logs.push('➜ High Task (H) unblocks instantly, locks SPI Mutex, and executes on time!');
      } else {
        logs.push('⚠️ PRIORITY INVERSION FAILURE ACTIVE!');
        logs.push('➜ Medium Task (M) executes long computations, stalling L forever.');
        logs.push('➜ Low Task L cannot release SPI Mutex. High Task H remains blocked.');
        logs.push('🛑 High-priority watchdog timer expires! Spacecraft resets.');
      }
    }
    return logs;
  }, [inversionStep, priorityInheritance]);

  // Handler for scheduler simulation events
  const runPreemptionEvent = (targetPriority: number) => {
    if (targetPriority === 4) {
      setSchedActiveTask('Motor Control (P4)');
      setSchedLogs((l) => [
        `[${new Date().toLocaleTimeString()}] ★ PREEMPTION: High Priority Motor task unblocked! Kicked out running thread instantly.`,
        ...l.slice(0, 4)
      ]);
    } else {
      setSchedActiveTask('Telemetry (P2)');
      setSchedLogs((l) => [
        `[${new Date().toLocaleTimeString()}] Scheduler selected Telemetry (P2) to run.`,
        ...l.slice(0, 4)
      ]);
    }
  };

  const handleRunDeadlineSim = () => {
    setDeadlineProgress(0);
    setDeadlineState('running');
  };

  const handleResetDeadlineSim = () => {
    setDeadlineProgress(0);
    setDeadlineState('idle');
  };

  return (
    <div className="w-full bg-background/40 border border-panel-border/50 rounded-2xl p-5 my-6">
      <div className="flex items-center justify-between mb-4 border-b border-panel-border/30 pb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-brand" /> Interactive Theory Visualizer
        </span>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded uppercase">
          Dynamic Academy Demo
        </span>
      </div>

      {/* 1. DETERMINISM SCHEDULER PANEL */}
      {type === 'determinism' && (
        <div className="space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-panel/30 p-2.5 rounded-xl border border-panel-border/20">
            <span className="text-xs text-gray-300">Choose operating system core strategy:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setDetMode('rtos'); setDetJitterHistory([]); }}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  detMode === 'rtos' 
                    ? 'bg-brand/20 border-brand/40 text-white' 
                    : 'bg-background/40 border-panel-border/20 text-gray-400 hover:text-white'
                }`}
              >
                RTOS (Deterministic)
              </button>
              <button
                onClick={() => { setDetMode('gpos'); setDetJitterHistory([]); }}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  detMode === 'gpos' 
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' 
                    : 'bg-background/40 border-panel-border/20 text-gray-400 hover:text-white'
                }`}
              >
                GPOS (Jittery / Fair-Share)
              </button>
            </div>
          </div>

          <div className="relative border border-panel-border/30 rounded-xl p-4 bg-background/50 overflow-hidden font-mono text-xs">
            {/* Timeline ticks */}
            <div className="absolute inset-y-0 left-0 right-0 grid grid-cols-4 divide-x divide-panel-border/20 border-dashed pointer-events-none" />
            
            <div className="flex h-14 items-center justify-between relative z-10">
              <span className="text-gray-400 font-bold w-16">CPU Clock</span>
              <div className="flex-1 h-3 bg-panel-border/20 rounded-full overflow-hidden relative mx-4">
                <div 
                  className="h-full bg-brand rounded-full transition-all duration-75"
                  style={{ width: `${detTick}%` }}
                />
                {[25, 50, 75].map((t) => (
                  <div key={t} className="absolute top-0 bottom-0 w-0.5 bg-background/70 border-dashed" style={{ left: `${t}%` }} />
                ))}
              </div>
              <span className="text-gray-400 font-bold w-12 text-right">{detTick}ms</span>
            </div>

            <div className="border-t border-panel-border/20 pt-3 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide block mb-1">Latency Graph (Jitter response)</span>
                <div className="h-20 bg-background/80 border border-panel-border/40 rounded-lg flex items-end justify-around p-1">
                  {detJitterHistory.length > 0 ? (
                    detJitterHistory.map((val, idx) => {
                      const max = 150;
                      const heightPercent = Math.min(100, (val / max) * 100);
                      return (
                        <div 
                          key={idx} 
                          className={`w-4 rounded-t transition-all ${detMode === 'rtos' ? 'bg-brand' : 'bg-yellow-500 animate-pulse'}`}
                          style={{ height: `${heightPercent}%` }}
                          title={`Jitter: ${val.toFixed(1)}μs`}
                        />
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-gray-600 self-center">Scanning scheduler ticks...</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduler Precision:</span>
                  <span className={detMode === 'rtos' ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>
                    {detMode === 'rtos' ? '✦ Extreme (< 1μs Variance)' : '● Dynamic Aging (Variable)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Task Response Guarantee:</span>
                  <span className="text-white font-bold">
                    {detMode === 'rtos' ? 'Absolute Worst-Case Bounded' : 'Average-case Fair-share'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed pt-1.5 font-sans">
                  {detMode === 'rtos' 
                    ? '✓ Deterministic Mode schedules tasks at fixed hardware tick boundaries. Jitter stays completely flat.' 
                    : '✗ GPOS swaps threads depending on file system, cache swaps, and mouse UI drags. Late execution spikes!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REAL-TIME DECAY & FAILURE SIMULATOR */}
      {type === 'realtime_comparison' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center bg-panel/30 p-2.5 rounded-xl border border-panel-border/20">
            {[
              { id: 'hard', label: 'Hard Real-Time' },
              { id: 'firm', label: 'Firm Real-Time' },
              { id: 'soft', label: 'Soft Real-Time' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setDeadlineType(t.id as any); handleResetDeadlineSim(); }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  deadlineType === t.id 
                    ? 'bg-brand/20 border-brand/40 text-white font-bold' 
                    : 'bg-background/40 border-panel-border/20 text-gray-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="border border-panel-border/30 rounded-xl p-5 bg-background/50 text-center font-mono relative overflow-hidden">
            <span className="absolute top-2 left-2 text-[8px] text-gray-500">TIMELINE SCANNER</span>

            <div className="relative h-20 bg-background border border-panel-border/40 rounded-xl flex items-center justify-start overflow-hidden px-10">
              {/* Deadline line */}
              <div className="absolute left-2/3 top-0 bottom-0 w-0.5 border-r-2 border-dashed border-red-500 z-10">
                <span className="absolute bottom-1 right-2 text-[9px] bg-red-900/50 border border-red-500/30 px-1 rounded text-red-300">DEADLINE (t=0)</span>
              </div>

              {/* Running core task dot */}
              {deadlineProgress > 0 && (
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all absolute font-bold text-[9px] ${
                    deadlineProgress > 66 ? 'bg-red-500 text-white animate-pulse' : 'bg-brand text-white'
                  }`}
                  style={{ left: `${Math.min(90, deadlineProgress)}%` }}
                >
                  ⚙
                </div>
              )}

              {deadlineProgress === 0 && (
                <div className="text-gray-600 text-xs text-center w-full">Click Run to trigger task computation...</div>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleRunDeadlineSim}
                disabled={deadlineState === 'running'}
                className="px-4 py-1.5 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-30"
              >
                Run Simulation
              </button>
              <button
                onClick={handleResetDeadlineSim}
                className="px-4 py-1.5 bg-panel-border/40 hover:bg-panel-border/70 text-gray-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Condition results mapping */}
            <div className="mt-4 border-t border-panel-border/20 pt-4 text-xs font-sans text-left">
              {deadlineState === 'running' && (
                <p className="text-brand text-center font-semibold animate-pulse font-mono">Task is computing... running past deadlines...</p>
              )}
              {deadlineState === 'done' && (
                <div className="p-3.5 rounded-xl border">
                  {deadlineType === 'hard' && (
                    <div className="text-red-400 bg-red-500/5 border border-red-500/20 space-y-1">
                      <h4 className="font-bold flex items-center gap-1.5 text-red-300"><ShieldAlert className="w-4 h-4" /> DEADLINE VIOLATED - SYSTEM FAILURE</h4>
                      <p className="text-xs text-gray-400">In Hard Real-Time, any timing violation results in fatal failure. Watchdog triggered system-shutdown to prevent hardware damage.</p>
                    </div>
                  )}
                  {deadlineType === 'firm' && (
                    <div className="text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 space-y-1">
                      <h4 className="font-bold flex items-center gap-1.5 text-yellow-300">🗑️ VALUE DROPPED TO 0% (DISCARDED)</h4>
                      <p className="text-xs text-gray-400">In Firm Real-Time, the late computation output is immediately dumped. No system crash occurs, but the frame is dropped.</p>
                    </div>
                  )}
                  {deadlineType === 'soft' && (
                    <div className="text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                      <h4 className="font-bold flex items-center gap-1.5 text-emerald-300">📉 QUALITY DECAYED SLIGHTLY (USED)</h4>
                      <p className="text-xs text-gray-400">In Soft Real-Time, late data is still useful. Screen UI registers minor frame glitch, but functions normally.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SCHEDULER PRIORITY PREEMPTION BLOCK */}
      {type === 'gpos_comparison' && (
        <div className="space-y-4 font-sans">
          <p className="text-xs text-gray-400">Click triggers below to see how the Scheduler reacts to priority states:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Control station */}
            <div className="bg-panel/20 p-4 rounded-xl border border-panel-border/30 space-y-3 font-mono">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Interrupt Event Generators</span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => runPreemptionEvent(2)}
                  className="p-2 bg-background/50 border border-panel-border/40 hover:bg-background rounded-lg text-left text-gray-300 flex items-center justify-between cursor-pointer"
                >
                  <span>Trigger Sensor Sync (P2)</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase font-bold">Medium</span>
                </button>
                <button
                  onClick={() => runPreemptionEvent(4)}
                  className="p-2 bg-background/50 border border-panel-border/40 hover:bg-brand/10 hover:border-brand/40 rounded-lg text-left text-brand flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold text-white flex items-center gap-1">★ Trigger Motor Cutoff (P4)</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold animate-pulse">Critical</span>
                </button>
              </div>
            </div>

            {/* Active CPU Core State */}
            <div className="bg-panel/20 p-4 rounded-xl border border-panel-border/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono mb-2">Active CPU execution core</span>
                <div className="h-16 bg-background rounded-xl border border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                  <span className="text-[10px] text-gray-500 font-mono">Executing Core 0 TCB</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm uppercase">{schedActiveTask}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background/80 border border-panel-border/40 p-3.5 rounded-xl font-mono text-[11px] space-y-1 max-h-32 overflow-y-auto">
            <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Scheduler Kernel Trace Logs</span>
            {schedLogs.map((log, idx) => (
              <div key={idx} className="text-gray-300 truncate">{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CONTEXT SWITCH ASSEMBLY STEPPER */}
      {type === 'scheduling_flow' && (
        <div className="space-y-4">
          {/* Stepper buttons */}
          <div className="flex items-center justify-between border-b border-panel-border/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">STEP {flowStep + 1} OF 6:</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {[
                  'A executing',
                  'Register Push',
                  'SP written',
                  'SP Loaded',
                  'Register Pop',
                  'B executing'
                ][flowStep]}
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                disabled={flowStep === 0}
                onClick={() => setFlowStep((s) => s - 1)}
                className="p-1 bg-panel hover:bg-panel-border/40 text-gray-300 rounded-lg cursor-pointer disabled:opacity-20 font-bold text-xs"
              >
                ◀ BACK
              </button>
              <button
                disabled={flowStep === 5}
                onClick={() => setFlowStep((s) => s + 1)}
                className="p-1 px-2 bg-brand text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-20"
              >
                NEXT STEP ▶
              </button>
            </div>
          </div>

          {/* Core Visual */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono text-[10px]">
            {/* Task A stack */}
            <div className={`p-2.5 rounded-xl border ${flowStep === 1 || flowStep === 2 ? 'border-brand bg-brand/5 scale-[1.02]' : 'border-panel-border/30 bg-panel/10'}`}>
              <span className="block text-gray-500 font-bold">TASK A Stack</span>
              <div className="space-y-1.5 mt-2">
                <div className="p-1 bg-background rounded text-[9px] border border-panel-border/20">Saved PC</div>
                <div className="p-1 bg-background rounded text-[9px] border border-panel-border/20">Saved LR</div>
                <div className="p-1 bg-background rounded text-[9px] border border-panel-border/20">Saved R0-R12</div>
              </div>
            </div>

            {/* CPU block */}
            <div className={`p-2.5 rounded-xl border ${flowStep === 1 || flowStep === 4 ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-panel-border/30 bg-panel/10'}`}>
              <span className="block text-yellow-400 font-bold">Physical Registers</span>
              <div className="space-y-1.5 mt-2">
                <div className="p-1 bg-background rounded border border-panel-border/20">SP: {flowStep >= 3 ? '0x200008F0' : '0x20000418'}</div>
                <div className="p-1 bg-background rounded border border-panel-border/20">PC: {flowStep >= 5 ? 'TaskB_Run' : 'TaskA_Run'}</div>
                <div className="p-1 bg-background rounded border border-panel-border/20">R4-R11 registers</div>
              </div>
            </div>

            {/* Task B stack */}
            <div className={`p-2.5 rounded-xl border ${flowStep === 3 || flowStep === 4 ? 'border-emerald-500 bg-emerald-500/5 scale-[1.02]' : 'border-panel-border/30 bg-panel/10'}`}>
              <span className="block text-emerald-400 font-bold">TASK B Stack</span>
              <div className="space-y-1.5 mt-2">
                <div className="p-1 bg-background rounded text-[9px] border border-panel-border/20">Saved PC</div>
                <div className="p-1 bg-background rounded text-[9px] border border-panel-border/20">Saved LR</div>
                <div className="p-1 bg-background rounded text-[9px] border border-panel-border/20">Saved R0-R12</div>
              </div>
            </div>
          </div>

          <p className="p-2.5 bg-panel-border/20 border border-panel-border/30 rounded-xl text-xs leading-relaxed text-gray-300">
            {
              [
                '1. Currently, Task A has absolute control of the CPU core registers. CPU Program Counter points directly inside Task A instructions.',
                '2. Trigger occurs. Assembly code pushes CPU registers (PC, LR, R12, etc.) onto Task A\'s unique RAM stack. This freezes its calculation state completely.',
                '3. Task A Stack Pointer is logged. The newly updated CPU Stack pointer is written directly to Task A TCB structure in RAM.',
                '4. Scheduler swaps TCB pointer and loads CPU Stack Pointer (SP) register with Task B\'s stack pointer from Task B TCB.',
                '5. Assembly core pops registers off Task B Stack directly into the physical registers of CPU, replacing Task A configurations.',
                '6. Assembly jumps to Task B Program Counter. Task B starts executing smoothly on CPU. Context Switch Complete!'
              ][flowStep]
            }
          </p>
        </div>
      )}

      {/* 5. PRIORITY INVERSION & MARS PATHFINDER */}
      {type === 'priority_inversion' && (
        <div className="space-y-4 font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-panel/30 p-2.5 rounded-xl border border-panel-border/20">
            <span className="text-xs text-gray-300">Option: Solution Flag configuration</span>
            <div className="flex items-center gap-2">
              <input
                id="inheritance_checkbox"
                type="checkbox"
                checked={priorityInheritance}
                onChange={(e) => {
                  setPriorityInheritance(e.target.checked);
                  setInversionStep(0);
                }}
                className="w-4 h-4 rounded text-brand border-panel-border/40 bg-background accent-brand cursor-pointer"
              />
              <label htmlFor="inheritance_checkbox" className="text-xs font-bold text-brand font-mono cursor-pointer uppercase">
                Enable Priority Inheritance
              </label>
            </div>
          </div>

          {/* Flow elements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
            {[
              { id: 'High', priority: 3, label: 'High (H): Telemetry', color: 'border-red-500/40 text-red-300 bg-red-500/5', active: inversionStep >= 2 },
              { id: 'Med', priority: 2, label: 'Medium (M): Sensor', color: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/5', active: inversionStep >= 3 },
              { id: 'Low', priority: 1, label: 'Low (L): Flash', color: 'border-blue-500/40 text-blue-300 bg-blue-500/5', active: inversionStep >= 1 }
            ].map((task) => {
              const showElevated = task.id === 'Low' && priorityInheritance && inversionStep >= 4;
              return (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-xl border transition-all ${task.active ? 'scale-[1.02] ring-1 ring-brand/50' : 'opacity-40'} ${task.color}`}
                >
                  <span className="font-bold block">{task.label}</span>
                  <span className="text-[10px] text-gray-500">
                    Priority: {showElevated ? '3 (Elevated!)' : task.priority}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Shared Mutex Key */}
          <div className="p-3 bg-background border border-panel-border/40 rounded-xl flex items-center justify-between font-mono text-xs">
            <span className="text-gray-400">Shared SPI Bus Lock:</span>
            <div className="flex items-center gap-2">
              <Lock className={`w-4 h-4 ${inversionStep >= 1 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`} />
              <span className={`font-bold ${inversionStep >= 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                {inversionStep >= 1 ? 'CLAIMED BY LOW TASK' : 'RELEASED / UNBOUND'}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setInversionStep((s) => Math.min(4, s + 1))}
              disabled={inversionStep === 4}
              className="px-4 py-1.5 bg-brand hover:bg-brand-light text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-20"
            >
              Next Step Event ➜
            </button>
            <button
              onClick={() => setInversionStep(0)}
              className="px-4 py-1.5 bg-panel-border/40 hover:bg-panel-border/70 text-gray-300 text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset Simulation
            </button>
          </div>

          <div className="bg-background/80 border border-panel-border/40 p-3 rounded-xl font-mono text-[11px] space-y-1 h-28 overflow-y-auto">
            {inversionLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('⚠️') ? 'text-red-400 font-bold' : log.startsWith('★') || log.startsWith('➜ Kernel') ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ISR DIRECT VS DEFERRED DETAILED PLOTS */}
      {type === 'isr_latency' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-panel/30 p-2.5 rounded-xl border border-panel-border/20">
            <span className="text-xs text-gray-300 font-sans">Toggle Interrupt Architecture pattern:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsrType('direct')}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  isrType === 'direct' 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-background/40 border-panel-border/20 text-gray-400 hover:text-white'
                }`}
              >
                Direct Heavy ISR (Anti-pattern)
              </button>
              <button
                onClick={() => setIsrType('deferred')}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  isrType === 'deferred' 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                    : 'bg-background/40 border-panel-border/20 text-gray-400 hover:text-white'
                }`}
              >
                Deferred Processing (RTOS Best Practice)
              </button>
            </div>
          </div>

          <div className="border border-panel-border/30 rounded-xl p-4 bg-background/50 font-mono text-xs space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {[
                { time: 't = 1ms', event: 'Interrupt 1 triggers' },
                { time: 't = 2ms', event: isrType === 'direct' ? 'ISR running complex loops' : 'ISR yields, wakes task' },
                { time: 't = 3ms', event: 'Interrupt 2 triggers' },
                { time: 't = 4ms', event: isrType === 'direct' ? '💥 MISSED EVENT!' : 'Task completes math' }
              ].map((slot, index) => {
                const isFail = isrType === 'direct' && index === 3;
                return (
                  <div key={index} className={`p-2 rounded-lg border text-center ${
                    isFail 
                      ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse' 
                      : 'border-panel-border/30 bg-panel/10'
                  }`}>
                    <span className="block text-[8px] text-gray-500">{slot.time}</span>
                    <span className="font-bold text-[10px] leading-tight block mt-1">{slot.event}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed p-2.5 bg-panel-border/10 border border-panel-border/20 rounded-xl">
              {isrType === 'direct' ? (
                <span className="text-red-400">
                  ⚠️ **Severe Jitter Detected**: Executing massive computations or logs directly inside ISR blocks other interrupts completely. Interrupt 2 is completely missed by the CPU core!
                </span>
              ) : (
                <span className="text-emerald-400">
                  ✦ **Deferred processing active**: ISR is execution-bounded (~3μs), releases the binary semaphore instantly and exits. Interrupt 2 is successfully parsed by the hardware registers!
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface CustomTopic {
  id: string;
  name: string;
  content: string;
  youtubeUrl?: string;
  isBuiltIn?: boolean;
}

// Inner component requiring useSearchParams inside Suspense
function RtosExplorerInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search, filter, and selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [dynamicTopics, setDynamicTopics] = useState<CustomTopic[]>([]);
  const [selectedCustomTopic, setSelectedCustomTopic] = useState<CustomTopic | null>(null);

  useEffect(() => {
    fetch('/api/tutorials?stack=rtos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const custom = data.topics.filter((t: any) => !t.isBuiltIn);
          setDynamicTopics(custom);
        }
      })
      .catch((err) => console.error('Error fetching dynamic topics:', err));
  }, []);
  
  // Set default selected values from URL search parameter keys
  const activeTab = searchParams.get('tab') === 'api' ? 'api' : searchParams.get('tab') === 'custom' ? 'custom' : 'theory';
  const selectedTheoryId = searchParams.get('theory') || 'about_rtos';
  const selectedApiId = searchParams.get('api') || 'xTaskCreate';

  // State synchronization updates
  const handleSelectTab = (tab: 'theory' | 'api') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('id');
    if (tab === 'theory') {
      params.delete('api');
      if (!params.get('theory')) params.set('theory', 'about_rtos');
    } else {
      params.delete('theory');
      if (!params.get('api')) params.set('api', 'xTaskCreate');
    }
    router.push(`/tutorial/rtos?${params.toString()}`, { scroll: false });
  };

  const handleSelectTheory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'theory');
    params.set('theory', id);
    params.delete('id');
    router.push(`/tutorial/rtos?${params.toString()}`, { scroll: false });
    setSelectedCustomTopic(null);
  };

  const handleSelectApi = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'api');
    params.set('api', id);
    params.delete('id');
    router.push(`/tutorial/rtos?${params.toString()}`, { scroll: false });
    setSelectedCustomTopic(null);
  };

  const handleSelectCustom = (topic: CustomTopic) => {
    const params = new URLSearchParams();
    params.set('tab', 'custom');
    params.set('id', topic.id);
    router.push(`/tutorial/rtos?${params.toString()}`, { scroll: false });
    setSelectedCustomTopic(topic);
  };

  // 1. FILTERING FOR THEORY TAB
  const filteredTheories = useMemo(() => {
    return THEORY_SECTIONS.filter((t) => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedModule === 'all' || t.category.toLowerCase() === selectedModule.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedModule]);

  // 2. FILTERING FOR API TAB
  const filteredApis = useMemo(() => {
    return API_TOPICS.filter((topic) => {
      const matchesSearch = 
        topic.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModule = selectedModule === 'all' || topic.module === selectedModule;
      return matchesSearch && matchesModule;
    });
  }, [searchQuery, selectedModule]);

  // Active items calculations
  const activeTheory = useMemo(() => {
    return THEORY_SECTIONS.find((t) => t.id === selectedTheoryId) || THEORY_SECTIONS[0];
  }, [selectedTheoryId]);

  const activeApi = useMemo(() => {
    return API_TOPICS.find((t) => t.id === selectedApiId) || API_TOPICS[0];
  }, [selectedApiId]);

  const activeCustomTopic = useMemo(() => {
    const customId = searchParams.get('id');
    return dynamicTopics.find((t) => t.id === customId) || selectedCustomTopic || dynamicTopics[0] || null;
  }, [searchParams, dynamicTopics, selectedCustomTopic]);

  return (
    <div className="space-y-6">
      
      {/* Tab select slider */}
      <div className="flex border-b border-panel-border/40 p-1 bg-panel/20 rounded-xl max-w-lg mx-auto mb-8 font-sans">
        <button
          onClick={() => { handleSelectTab('theory'); setSearchQuery(''); setSelectedModule('all'); }}
          className={`flex-1 py-3 text-center rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'theory' 
              ? 'bg-brand/10 border border-brand/40 text-brand font-extrabold shadow' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Core Theory Academy</span>
        </button>
        <button
          onClick={() => { handleSelectTab('api'); setSearchQuery(''); setSelectedModule('all'); }}
          className={`flex-1 py-3 text-center rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'api' 
              ? 'bg-brand/10 border border-brand/40 text-brand font-extrabold shadow' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>FreeRTOS API Reference</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Navigator list (Search and side lists depending on tab) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Universal Search Bar */}
          <div className="relative font-sans">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={activeTab === 'theory' ? "Search theoretical topic..." : "Search API function..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-panel-border/60 hover:border-panel-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand font-medium transition-all"
            />
          </div>

          {/* Theory Category filters */}
          {activeTab === 'theory' && (
            <div className="space-y-1 font-sans">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block px-1 mb-2">Theory Category</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Lectures', icon: Sliders },
                  { id: 'fundamentals', label: 'Basics', icon: Cpu },
                  { id: 'architecture', label: 'Architecture', icon: Layers },
                  { id: 'comparison', label: 'Comparisons', icon: Table },
                  { id: 'scheduler', label: 'Schedulers', icon: Clock },
                  { id: 'synchronization', label: 'Locks & Mutex', icon: Lock },
                  { id: 'interrupts', label: 'Interrupts', icon: Radio }
                ].map((mod) => {
                  const Icon = mod.icon;
                  const isActive = selectedModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModule(mod.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-brand/10 border-brand/40 text-brand font-bold' 
                          : 'bg-panel/20 border-panel-border/30 text-gray-400 hover:bg-panel/40 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* API Category filters */}
          {activeTab === 'api' && (
            <div className="space-y-1 font-sans">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block px-1 mb-2">API Filter</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All API', icon: Sliders },
                  { id: 'tasks', label: 'Tasks', icon: Cpu },
                  { id: 'queues', label: 'Queues', icon: Database },
                  { id: 'semaphores', label: 'Mutex & Sem', icon: Lock },
                  { id: 'timers', label: 'Timers', icon: Clock },
                  { id: 'events', label: 'Events', icon: Radio }
                ].map((mod) => {
                  const Icon = mod.icon;
                  const isActive = selectedModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModule(mod.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-brand/10 border-brand/40 text-brand font-bold' 
                          : 'bg-panel/20 border-panel-border/30 text-gray-400 hover:bg-panel/40 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigator list depending on active tab */}
          <div className="bg-panel/40 border border-panel-border/40 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2 px-1">
              {activeTab === 'theory' ? 'Academic Course syllabus' : 'API Reference Functions'}
            </span>
            
            <div className="max-h-[500px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {activeTab === 'theory' ? (
                filteredTheories.length > 0 ? (
                  filteredTheories.map((theory) => {
                    const isActive = theory.id === activeTheory.id;
                    return (
                      <button
                        key={theory.id}
                        onClick={() => handleSelectTheory(theory.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-brand/10 border-brand/40 text-brand' 
                            : 'bg-panel/40 border-panel-border/30 text-gray-300 hover:bg-panel/80 hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 max-w-[80%]">
                          <span className="text-xs font-bold leading-tight truncate font-sans">{theory.title}</span>
                          <span className="text-[9px] text-gray-500 font-mono capitalize">{theory.category}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1' : 'opacity-35'}`} />
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500 text-xs font-sans">
                    No matching lecture found.
                  </div>
                )
              ) : (
                filteredApis.length > 0 ? (
                  filteredApis.map((topic) => {
                    const isActive = topic.id === activeApi.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectApi(topic.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-brand/10 border-brand/40 text-brand' 
                            : 'bg-panel/40 border-panel-border/30 text-gray-300 hover:bg-panel/80 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold leading-none">{topic.name}</span>
                        <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${
                          topic.module === 'tasks' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          topic.module === 'queues' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          topic.module === 'semaphores' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                          topic.module === 'timers' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {topic.module}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500 text-xs font-mono">
                    No matching API found.
                  </div>
                )
              )}
            </div>
          </div>

          {/* Dynamic Contributed Topics */}
          {dynamicTopics.length > 0 && (
            <div className="bg-panel/40 border border-panel-border/40 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider block mb-2 px-1 flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-brand" /> Dynamic Custom Lessons
              </span>
              <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {dynamicTopics.map((topic) => {
                  const isActive = activeTab === 'custom' && activeCustomTopic?.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectCustom(topic)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-brand/10 border-brand/40 text-brand' 
                          : 'bg-panel/40 border-panel-border/30 text-gray-300 hover:bg-panel/80 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold leading-tight truncate font-sans">{topic.name}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1' : 'opacity-35'}`} />
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

          {/* Quick Help Card */}
          <div className="p-4 bg-panel border border-panel-border rounded-2xl space-y-2.5 font-sans">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <HelpCircle className="w-3.5 h-3.5 text-brand" /> Developer Fact
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {activeTab === 'theory' ? (
                'RTOS tasks must never contain infinite loops without some form of blocking call (e.g. vTaskDelay). If a high-priority task loops infinitely without yielding, lower priority tasks are completely starved of CPU time.'
              ) : (
                'FreeRTOS uses the "FromISR" function suffix rule. Any API call executed inside an Interrupt Service Routine (ISR) must use the interrupt-safe variant to prevent race conditions and maintain nested interrupt determinism.'
              )}
            </p>
          </div>

        </div>

        {/* Right Column: Detailed content spec pages */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* RENDER CUSTOM TOPIC CONTENT */}
            {activeTab === 'custom' && activeCustomTopic ? (
              <motion.div
                key={activeCustomTopic.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-panel border border-panel-border/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 font-sans"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-panel-border pb-3 mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider font-mono bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                      Custom Lesson • RTOS Academy
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-heading">
                      {activeCustomTopic.name}
                    </h2>
                  </div>
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
                {activeCustomTopic.youtubeUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-panel-border/80 bg-black/40 mb-6 font-sans">
                    <iframe
                      src={activeCustomTopic.youtubeUrl}
                      title={activeCustomTopic.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Rich Text Markdown Render block */}
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm sm:text-base">
                  <ReactMarkdown>{activeCustomTopic.content}</ReactMarkdown>
                </div>
              </motion.div>
            ) : activeTab === 'theory' ? (
              <motion.div
                key={activeTheory.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-panel border border-panel-border/80 rounded-3xl overflow-hidden shadow-2xl font-sans"
              >
                {/* Course section header */}
                <div className="border-b border-panel-border/40 bg-panel/30 px-6 sm:px-10 py-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider font-mono bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                      Theory Academy • {activeTheory.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-heading">
                      {activeTheory.title}
                    </h2>
                  </div>
                  <span className="hidden sm:inline-flex items-center text-xs font-bold font-mono px-3 py-1 rounded-full border border-panel-border/40 text-gray-300 uppercase">
                    Lecture Module
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-10 space-y-8 select-text">
                  
                  {/* Summary / Lead */}
                  <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl space-y-2">
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      &quot;{activeTheory.summary}&quot;
                    </p>
                  </div>

                  {/* Introduction */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-brand" /> Core Narrative Overview
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {activeTheory.intro}
                    </p>
                  </div>

                  {/* Interactive Embedded Demonstration Visual */}
                  <TheoryVisualizer type={activeTheory.visualType} />

                  {/* Concept Breakdowns */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                      Deep Theoretical Breakdown
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {activeTheory.coreConcepts.map((concept, index) => (
                        <div key={index} className="bg-background/25 border border-panel-border/30 rounded-xl p-5 space-y-3">
                          <h4 className="text-sm font-bold text-brand flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/15 text-xs text-brand font-mono font-bold">
                              {index + 1}
                            </span>
                            {concept.heading}
                          </h4>
                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {concept.body}
                          </p>

                          {concept.codeSnippet && (
                            <div className="relative mt-3">
                              <pre className="bg-background/80 p-4 rounded-xl border border-panel-border/70 overflow-x-auto text-[11px] font-mono text-cyan-300 leading-relaxed font-bold">
                                {concept.codeSnippet}
                              </pre>
                              <CopyButton text={concept.codeSnippet} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparative tables if provided */}
                  {activeTheory.comparisonTable && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-brand" /> Side-by-Side Comparison Matrix
                      </h3>
                      <div className="border border-panel-border/40 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-panel/60 border-b border-panel-border/40 text-gray-400 font-bold uppercase tracking-wider">
                              {activeTheory.comparisonTable.headers.map((header, idx) => (
                                <th key={idx} className="p-3">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-panel-border/30">
                            {activeTheory.comparisonTable.rows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-panel/20 transition-colors">
                                {row.map((cell, cellIdx) => (
                                  <td 
                                    key={cellIdx} 
                                    className={`p-3 text-gray-300 leading-relaxed ${
                                      cellIdx === 0 ? 'font-bold font-mono text-brand border-r border-panel-border/20' : ''
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Summary key takeaways list */}
                  <div className="space-y-3 bg-panel/30 border border-panel-border/20 p-5 rounded-2xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Module Takeaways & Key Concepts
                    </h3>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                      {activeTheory.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4.5 h-4.5 text-brand shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            ) : (
              
              /* RENDER API TAB DETAILED PORTAL CONTENT */
              <motion.div
                key={activeApi.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-panel border border-panel-border/80 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* API Module Header */}
                <div className="border-b border-panel-border/40 bg-panel/30 px-6 sm:px-10 py-5 flex items-center justify-between font-sans">
                  <div>
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider font-mono bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-full">
                      FreeRTOS Reference Portal • {activeApi.module}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 font-mono">
                      {activeApi.name}
                    </h2>
                  </div>
                  <span className={`hidden sm:inline-flex items-center text-xs font-bold font-mono px-3 py-1 rounded-full border uppercase ${
                    activeApi.module === 'tasks' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    activeApi.module === 'queues' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    activeApi.module === 'semaphores' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                    activeApi.module === 'timers' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {activeApi.module} Module
                  </span>
                </div>

                {/* API Detailed Content Area */}
                <div className="p-6 sm:p-10 space-y-8 select-text">
                  
                  {/* Summary */}
                  <div className="space-y-2 font-sans">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-brand" /> Summary Description
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {activeApi.summary}
                    </p>
                  </div>

                  {/* Dynamic Interactive Diagram */}
                  <ApiDiagram type={activeApi.diagramType} />

                  {/* Prototype Box */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                      <Code2 className="w-4 h-4 text-brand" /> Function Prototype
                    </h3>
                    <div className="relative">
                      <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed font-bold">
                        {activeApi.prototype}
                      </pre>
                      <CopyButton text={activeApi.prototype} />
                    </div>
                  </div>

                  {/* Detailed Parameter Table */}
                  <div className="space-y-3 font-sans">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                      Parameters List
                    </h3>
                    <div className="border border-panel-border/40 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-panel/40 border-b border-panel-border/40 text-gray-400 font-bold uppercase tracking-wider">
                            <th className="p-3 w-1/4">Parameter</th>
                            <th className="p-3 w-3/4">Detailed Technical Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-panel-border/30">
                          {activeApi.parameters.map((param, index) => (
                            <tr key={index} className="hover:bg-panel/20 transition-colors">
                              <td className="p-3 font-mono font-bold text-brand">{param.name}</td>
                              <td className="p-3 text-gray-300 leading-relaxed">{param.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Return Values Section */}
                  <div className="space-y-2.5 font-sans">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                      Return Values
                    </h3>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-xs space-y-2 leading-relaxed">
                      {activeApi.returnValues.split('\n').map((val, idx) => (
                        <div key={idx} className="text-gray-300 font-mono">
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Configuration Settings */}
                  {activeApi.notes && (
                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3.5 font-sans">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-wide mb-0.5">Reference Configuration Note</h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-mono">
                          {activeApi.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Implementation Code Listing */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                      <Terminal className="w-4 h-4 text-brand" /> C/C++ Example Code Implementation
                    </h3>
                    <div className="relative">
                      <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
                        {activeApi.example}
                      </pre>
                      <CopyButton text={activeApi.example} />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// Loading fallback for dynamic route query param hook
function RtosLoadingFallback() {
  return (
    <div className="w-full flex items-center justify-center py-20 text-gray-400 font-sans">
      <div className="text-center space-y-3">
        <Activity className="w-8 h-8 animate-spin text-brand mx-auto" />
        <p className="text-sm font-semibold">Loading FreeRTOS Theory & API Academy...</p>
      </div>
    </div>
  );
}

export default function RtosTutorialPage() {
  return (
    <div className="w-full bg-background min-h-screen text-white pb-20 select-text">
      
      {/* Breadcrumb Header */}
      <div className="border-b border-panel-border/30 bg-panel/10 py-4 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tutorial" className="hover:text-brand transition-colors">Tutorials</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">FreeRTOS Reference Portal</span>
          </div>
          <Link href="/tutorial" className="inline-flex items-center text-xs text-brand hover:text-brand-light font-semibold transition-all">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Tracks
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-12 bg-gradient-to-b from-panel/20 to-background border-b border-panel-border/30 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand/10 text-brand border border-brand/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Academic Reference Manual
                </span>
                <span className="text-xs text-gray-400">• Version 10.4.0</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                The FreeRTOS™ <span className="text-brand">Theory & API Portal</span>
              </h1>
              <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
                Unlock certified core RTOS knowledge and fully certified kernel control. Explore detailed preemption mechanics, Hard vs Soft Real-Time constraints, Priority Inversion safety parameters, and live interactive simulations for scheduling and FreeRTOS services.
              </p>
            </div>
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4">
              <div className="p-3 bg-brand/10 rounded-xl animate-pulse">
                <Cpu className="h-8 w-8 text-brand" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Educational Content</p>
                <p className="text-sm font-bold text-white font-mono">6 Concepts • 15 APIs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<RtosLoadingFallback />}>
          <RtosExplorerInner />
        </Suspense>
      </section>
    </div>
  );
}
