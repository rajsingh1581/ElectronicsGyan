export interface TheorySection {
  id: string;
  title: string;
  category: string;
  summary: string;
  intro: string;
  coreConcepts: Array<{
    heading: string;
    body: string;
    codeSnippet?: string;
  }>;
  keyTakeaways: string[];
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  visualType: 'determinism' | 'realtime_comparison' | 'gpos_comparison' | 'scheduling_flow' | 'priority_inversion' | 'isr_latency';
}

export const THEORY_SECTIONS: TheorySection[] = [
  {
    id: 'about_rtos',
    title: 'What is a Real-Time Operating System?',
    category: 'Fundamentals',
    summary: 'An introduction to RTOS kernel architectures, execution determinism, and why multi-threaded general-purpose OS kernels fail in critical timing bounds.',
    intro: 'A Real-Time Operating System (RTOS) is a specialized operating system designed to run embedded software with precise, deterministic timing constraints. Unlike desktop operating systems (General-Purpose OS or GPOS) like Windows or macOS, which prioritize user experience and high average throughput, an RTOS guarantees that critical tasks execute within strict, predictable timing windows.',
    coreConcepts: [
      {
        heading: 'Determinism: The Core Pillar',
        body: 'Determinism is the guarantee that a system will consistently respond to an event within a predictable, maximum timing limit (worst-case execution time). In an RTOS, "correctness" is a function of both the logical correctness of the calculations and the physical time at which the output is delivered. A perfectly calculated output is considered a system failure if it arrives 1 millisecond too late.'
      },
      {
        heading: 'Multitasking via Time Slicing & Preemption',
        body: 'An RTOS kernel creates the illusion of simultaneous task execution on single-core microcontrollers by dividing processing time. The Scheduler decides which task owns the CPU core at any given tick. High-priority tasks are immediately assigned processing time, preempting (interrupting) active lower-priority tasks on the fly.'
      },
      {
        heading: 'The Kernel Tick & Jitter',
        body: 'The kernel manages time using a periodic hardware timer interrupt called the Kernel Tick (typically configured between 100Hz and 1000Hz). Jitter is the variance in time between when an event is scheduled to execute and when it actually executes on the hardware. Minimizing jitter is the central challenge in RTOS application design.',
        codeSnippet: `// FreeRTOSConfig.h configuration for kernel timing
#define configTICK_RATE_HZ              ((TickType_t)1000) // 1ms tick rate
#define configCPU_CLOCK_HZ               (120000000)        // 120MHz CPU core clock`
      }
    ],
    keyTakeaways: [
      'Timing determinism is prioritized over raw computation throughput.',
      'Scheduler ensures high-priority tasks execute immediately when triggered.',
      'Correctness depends on both logical integrity and meeting strict clock deadlines.'
    ],
    visualType: 'determinism'
  },
  {
    id: 'hard_vs_soft',
    title: 'Hard Real-Time vs. Soft Real-Time',
    category: 'Architecture',
    summary: 'Distinguishing the critical tiers of real-time guarantees: from absolute deadline violations causing catastrophic failure to quality of service decay.',
    intro: 'Real-time embedded systems are categorized based on the severity of a missed task deadline. Understanding whether a system is Hard, Firm, or Soft Real-Time dictates the choice of scheduling algorithms, buffer sizes, and hardware configurations.',
    coreConcepts: [
      {
        heading: 'Hard Real-Time (Failure is Catastrophic)',
        body: 'In a Hard Real-Time system, missing a single deadline results in absolute, catastrophic system failure or immediate danger to human life. There is no tolerance for timing jitter. Examples include automotive braking controllers (ABS), cardiac pacemakers, missile guidance fins, and aviation flight stability avionics.'
      },
      {
        heading: 'Soft Real-Time (Tolerance for Graceful Decay)',
        body: 'In Soft Real-Time systems, deadlines are target metrics. Missing a deadline does not compromise system integrity, but gracefully degrades the quality of service (QoS). The utility of a calculation drops gradually after the deadline passes. Examples include audio streaming buffers, video player rendering, and UI touchscreen response curves.'
      },
      {
        heading: 'Firm Real-Time (Useless Data, No Catastrophe)',
        body: 'Firm Real-Time systems sit between Hard and Soft. If a deadline is missed, the result has zero utility and must be discarded entirely, but it does not cause a critical failure. Examples include network packet routing and video compression frame decoders (where dropped frames are ignored but do not crash the decoder).'
      }
    ],
    keyTakeaways: [
      'Hard Real-Time requires worst-case execution time analysis and priority scheduling.',
      'Soft Real-Time is managed via average-case latency optimizations and fair-share buffers.',
      ' Avionic flight systems, medical pacemakers, and automotive brakes are strictly Hard Real-Time.'
    ],
    comparisonTable: {
      headers: ['Metric', 'Hard Real-Time', 'Soft Real-Time', 'Firm Real-Time'],
      rows: [
        ['Missed Deadline', 'Total System Failure / Danger', 'Degraded Quality of Service', 'Data Discarded / Ignored'],
        ['Jitter Tolerance', 'Zero Tolerance (Nanoseconds)', 'High Tolerance (Milliseconds)', 'Moderate Tolerance'],
        ['Primary Goal', 'Predictability & Failsafes', 'High Average Throughput', 'Minimize Late Data Dropping'],
        ['Typical Platform', 'Bare-metal / FreeRTOS', 'Linux / RT-Patch / Android', 'Digital Signal Processors']
      ]
    },
    visualType: 'realtime_comparison'
  },
  {
    id: 'rtos_vs_gpos',
    title: 'RTOS vs. General-Purpose OS (GPOS)',
    category: 'Comparison',
    summary: 'A side-by-side architectural breakdown of a Real-Time OS vs. General-Purpose platforms like standard Linux and Windows.',
    intro: 'Developers often wonder why they cannot use a standard Linux or Windows kernel for real-time robotic controls or automotive systems. The answer lies in their fundamentally opposed kernel philosophies: GPOS maximizes fairness and average user throughput; RTOS maximizes predictability and deadline guarantees.',
    coreConcepts: [
      {
        heading: 'Priority Preemption vs. Fair-Share Scheduling',
        body: 'A GPOS scheduler (like Linux CFS) uses fair-share algorithms to ensure no thread starves, dynamically modifying task priorities to keep the UI smooth. An RTOS uses strict Priority-Based Preemptive Scheduling: the highest priority runnable task always owns the CPU, regardless of other threads starving. RTOS priorities are strictly absolute and static unless explicitly modified.'
      },
      {
        heading: 'Interrupt Latency and Nesting',
        body: 'In a GPOS, high-priority tasks can be blocked for variable durations by complex kernel paging operations, driver locking mechanisms, or virtual memory swapping. In an RTOS, interrupt response time is strictly bounded. The kernel disables interrupts for minimal, predictable periods, and supports nested hardware interrupts based on absolute vector registers.'
      },
      {
        heading: 'Memory Virtualization vs. Absolute Physical Addressing',
        body: 'GPOS uses Virtual Memory with Pages and Swapping, which introduces unpredictable timing delays (Page Faults). An RTOS operates directly on physical memory addresses (or simple Memory Protection Unit [MPU] boundary alignments), guaranteeing instant access speeds.'
      }
    ],
    keyTakeaways: [
      'GPOS schedulers continuously adjust priority for fairness; RTOS priorities are absolute.',
      'RTOS disables interrupts for microseconds; GPOS can block interrupts for milliseconds.',
      'RTOS uses deterministic static physical allocations; GPOS uses unpredictable page swaps.'
    ],
    comparisonTable: {
      headers: ['Feature', 'Real-Time OS (RTOS)', 'General-Purpose OS (GPOS)'],
      rows: [
        ['Scheduler Design', 'Strictly Preemptive, Priority-Based', 'Fair-share, Time-sliced, Dynamic Adjustment'],
        ['Target Objective', 'Precise timing & deadline predictability', 'Maximize average throughput & UI fairness'],
        ['Kernel Memory Footprint', 'Extremely small (Kilobytes)', 'Very large (Gigabytes)'],
        ['Virtual Memory', 'No (Physical RAM only or simple MPU)', 'Yes (Paging, virtual tables, swap partition)'],
        ['Interrupt Latency', 'Strictly bounded & predictable', 'Variable, unpredictable under heavy disk/UI load'],
        ['Task Overheads', 'Minimal context swap registers', 'Heavier thread control blocks & state trees']
      ]
    },
    visualType: 'gpos_comparison'
  },
  {
    id: 'scheduling_mechanisms',
    title: 'Task Scheduling & Context Switching',
    category: 'Scheduler',
    summary: 'Deep dive into the mechanical steps of how the scheduler pushes and pops CPU register state blocks during task preemption.',
    intro: 'At the heart of any RTOS is the scheduling mechanism. Understanding how the kernel handles Task Control Blocks (TCB), registers, and execution contexts is essential for writing efficient, timing-safe multi-threaded firmware.',
    coreConcepts: [
      {
        heading: 'The Task Control Block (TCB)',
        body: 'Every task has an associated Task Control Block (TCB) stored in RAM. The TCB is a C struct that tracks the task\'s current Stack Pointer, current priority, task state (Ready, Blocked, etc.), and debugging identifier name.'
      },
      {
        heading: 'The Mechanics of a Context Switch',
        body: 'When the scheduler decides to switch execution from Task A to Task B (either due to a task delay or a higher-priority task unblocking), it triggers a Context Switch. This involves: \n\n1. Suspending Task A and saving its current state (program counter, stack frame, CPU registers) onto Task A\'s stack.\n2. Writing Task A\'s stack pointer back to its TCB.\n3. Reading Task B\'s stack pointer from Task B\'s TCB.\n4. Popping Task B\'s saved context from Task B\'s stack back into the physical CPU core registers.\n5. Jumping to Task B\'s saved Program Counter to resume execution.',
        codeSnippet: `// Concept of a standard assembly Context Switch (ARM Cortex-M)
// 1. Save general registers on Task A stack
push {r4-r11, lr}
// 2. Save current Stack Pointer to Task A TCB
str sp, [rCurrentTCB]
// 3. Load new Stack Pointer from Task B TCB
ldr sp, [rNewTCB]
// 4. Pop saved registers from Task B stack
pop {r4-r11, pc}`
      },
      {
        heading: 'Preemptive vs. Co-operative Schedulers',
        body: 'In Preemptive scheduling, the scheduler instantly interrupts tasks at any time (e.g. during tick interrupts) if a higher-priority task unblocks. In Co-operative scheduling, tasks must explicitly yield the CPU (using taskYIELD() or blocking calls) to let other tasks execute, making it simpler but prone to task starvation if one task loops indefinitely.'
      }
    ],
    keyTakeaways: [
      'A Context Switch is an assembly-level swap of CPU registers via task stack frames.',
      'The Stack Pointer is the primary link between the CPU core and a Task TCB.',
      'Preemptive scheduling guarantees fast response but introduces concurrency race conditions.'
    ],
    visualType: 'scheduling_flow'
  },
  {
    id: 'priority_inversion',
    title: 'Priority Inversion & Inheritance',
    category: 'Synchronization',
    summary: 'Exploring the classic priority inversion bug that stalled the Mars Pathfinder spacecraft, and how Priority Inheritance prevents it.',
    intro: 'Priority Inversion is a dangerous runtime concurrency bug that occurs in preemptive priority-based schedulers when a high-priority task is blocked indefinitely by a lower-priority task, often mediated by a shared resource lock.',
    coreConcepts: [
      {
        heading: 'How Priority Inversion Occurs',
        body: 'Imagine three tasks: Task High (H), Task Medium (M), and Task Low (L).\n\n1. Task L acquires a Mutex to access a shared flash memory card.\n2. Task H unblocks and attempts to take the same Mutex. It is blocked because L holds the key.\n3. Task M (which does not use the flash card) unblocks and has a higher priority than L. It preempts L and begins a long calculation.\n4. Result: Task L is preempted by M, which prevents L from releasing the Mutex. Thus, the High-priority Task H is kept blocked by Task M! This is an inversion of task priorities.'
      },
      {
        heading: 'The Famous NASA Mars Pathfinder Bug (1997)',
        body: 'In 1997, NASA\'s Mars Pathfinder spacecraft began experiencing reset loops on Mars. The cause was priority inversion on an RxWorks real-time operating system. A high-priority information-bus manager task was locked out by a low-priority meteorological data gathering task because a medium-priority communications task was preempting the meteorological task.'
      },
      {
        heading: 'The Solution: Priority Inheritance',
        body: 'To prevent priority inversion, RTOS kernels use Mutexes with Priority Inheritance. When a High-priority Task (H) blocks waiting for a Mutex held by a Low-priority Task (L), the kernel temporarily elevates L\'s priority to match H\'s priority. This prevents Medium-priority Task (M) from preempting L, allowing L to finish and release the Mutex promptly. Once released, L\'s priority returns to its original base level.',
        codeSnippet: `// Example showing mutex with Priority Inheritance vs standard binary semaphore
SemaphoreHandle_t xMyMutex;

void vInitSystem(void) {
    // Mutexes automatically support priority inheritance
    xMyMutex = xSemaphoreCreateMutex(); 
}`
      }
    ],
    keyTakeaways: [
      'Priority Inversion occurs when medium tasks block a low task holding a critical mutex.',
      'Priority Inheritance elevates a low-priority task\'s priority while holding a claimed lock.',
      'Binary Semaphores DO NOT support priority inheritance; Mutexes DO.'
    ],
    visualType: 'priority_inversion'
  },
  {
    id: 'isr_handling',
    title: 'ISRs and Deferred Interrupt Processing',
    category: 'Interrupts',
    summary: 'How to manage high-speed physical interrupts cleanly: reducing hardware lock times and deferring tasks via semaphores.',
    intro: 'Physical devices generate signals that trigger CPU Hardware Interrupts. An Interrupt Service Routine (ISR) halts the CPU scheduler instantly to handle the event. Writing clean, predictable ISRs is crucial for keeping an RTOS stable.',
    coreConcepts: [
      {
        heading: 'The Golden Rule of RTOS ISRs',
        body: 'ISRs must be kept as short as humanly possible. Never call standard blocking API functions (like vTaskDelay), never perform console logs, and never run long nested loops inside an interrupt context. Failing to do so causes missed interrupts and completely breaks scheduler timing.'
      },
      {
        heading: 'Deferred Interrupt Processing Pattern',
        body: 'To handle complex events cleanly, developers use Deferred Processing. The hardware interrupt does only the bare minimum (e.g. reading a raw sensor register), then immediately unblocks a high-priority "Handler Task" via a binary semaphore or direct-to-task notification and exits. The handler task then does the complex calculations at task priority levels.',
        codeSnippet: `// Deferred processing inside an ISR
void IRAM_ATTR vHardwareInterruptHandler(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    // Quick hardware register read
    g_rawSensorByte = readSensorRegister();
    
    // Unblock the handler task instantly
    vTaskNotifyGiveFromISR( xHandlerTaskHandle, &xHigherPriorityTaskWoken );
    
    // Force context switch if the handler task has higher priority
    portYIELD_FROM_ISR( xHigherPriorityTaskWoken );
}`
      },
      {
        heading: 'The FromISR Suffix Guard',
        body: 'Standard RTOS API functions can cause context switches or block tasks. Since an ISR is not a task, calling standard APIs will crash the CPU. You must always use the dedicated ISR-safe equivalents, which end with "FromISR".'
      }
    ],
    keyTakeaways: [
      'ISRs must never block, perform heavy calculations, or call standard blocking API calls.',
      'Deferred processing shifts work from interrupt context to high-priority task context.',
      'Always use the xHigherPriorityTaskWoken mechanism to return directly to unblocked tasks.'
    ],
    visualType: 'isr_latency'
  }
];
