export interface CatalogTopic {
  id: string;
  name: string;
  desc: string;
}

export interface CatalogChapter {
  id: string;
  number: number;
  name: string;
  summary: string;
  topics: CatalogTopic[];
}

// Master metadata list of chapters for all tracks
export const TRACK_CHAPTERS_METADATA: Record<string, Array<{ id: string; num: number; name: string; sum: string }>> = {
  python: [
    { id: 'env_setup', num: 1, name: 'Python Basics & Environment Setup', sum: 'Installations, interpreters, CPython, system variables, REPL, bytecode, and virtual environment managers.' },
    { id: 'vars_memory', num: 2, name: 'Variables, Datatypes & Memory Model', sum: 'Dynamic typing, reference counting, object mutability, small integer caching, arena allocators, and Mypy static typing.' },
    { id: 'math_nums', num: 3, name: 'Numerical Operations & Math Modules', sum: 'Arithmetic precisions, logical operators, math/decimal/fractions modules, pseudo-randomness, and float limits.' },
    { id: 'string_processing', num: 4, name: 'String Manipulation & Parsing Engines', sum: 'Slice stride notations, regular expressions (re module), unicode representations, formatting, and string interning.' },
    { id: 'logic_flow', num: 5, name: 'Logical Conditionals & Pattern Matching', sum: 'Short-circuit evaluations, nested conditions, ternary expressions, and Next-Gen Match-Case structural pattern matching.' },
    { id: 'loops_iterators', num: 6, name: 'Iterators, Loops & Control Flow', sum: 'For-in loops, while condition states, loop else blocks, enumeration, zip generators, and custom iteration protocols.' },
    { id: 'lists_mutability', num: 7, name: 'List Sequence & Mutability Mechanics', sum: 'List comprehensions, append/extend overheads, sort keys, copy vs deepcopy, and queue/stack implementations.' },
    { id: 'tuples_const', num: 8, name: 'Tuples & Constant Data Arrays', sum: 'Namedtuples, immutability guarantees, sequence unpacking, performance optimizations, and hashing structures.' },
    { id: 'dicts_hash', num: 9, name: 'Dictionary Collections & Hash Tables', sum: 'Hash collisions, OrderedDict, defaultdict, key hashing criteria, compact layout internals, and collections.ChainMap.' },
    { id: 'sets_groups', num: 10, name: 'Set Operations & Mathematical Groups', sum: 'Set theory operations, frozenset structures, hash-set complexity, duplicates purging, and membership tests.' },
    { id: 'functions_modular', num: 11, name: 'Modular Functions & Parameter Unpacking', sum: 'Positional/keyword parameters, default evaluation traps, *args/**kwargs unpacking, and lambda constructs.' },
    { id: 'scopes_closures', num: 12, name: 'Scope Resolution & Closure Functions', sum: 'LEGB rules, global/nonlocal namespaces, closures, state preservation, and factory methods.' },
    { id: 'functional_itertools', num: 13, name: 'Functional Programming & Itertools', sum: 'Map/Filter/Reduce paradigms, infinite generators, cycle/accumulate/groupby, and combinatorics.' },
    { id: 'decorators_intercept', num: 14, name: 'Decorators & Method Interceptors', sum: 'Higher-order wrapper decorators, wraps decorator, class decorators, memoization, and API routers.' },
    { id: 'file_io_serialization', num: 15, name: 'File I/O & Serialization Formats', sum: 'Context managers, file chunks, pickle security, JSON/YAML parsers, and memory-mapped files (mmap).' },
    { id: 'oop_encapsulation', num: 16, name: 'OOP Fundamentals & Encapsulation', sum: 'Constructors, self keywords, name mangling, private variables, and custom descriptors.' },
    { id: 'oop_inheritance', num: 17, name: 'OOP Inheritance & MRO Linearization', sum: 'Multiple inheritance, C3 linearization, super() bindings, the diamond problem, and mixin architecture.' },
    { id: 'oop_polymorphism', num: 18, name: 'OOP Polymorphism & Abstract Classes', sum: 'Duck typing, abstract base classes (abc), interface enforcement, and runtime type checking.' },
    { id: 'metaclasses_dunder', num: 19, name: 'Metaclasses & Descriptor Mechanics', sum: 'Metaclass code generation, __new__ vs __init__ interfaces, __slots__ optimizations, and attribute controls.' },
    { id: 'modules_packaging', num: 20, name: 'Modules, Packages & PyPI Registries', sum: 'Cycle imports resolution, namespace packages, pyproject.toml standards, and twine distributions.' },
    { id: 'exceptions_debug', num: 21, name: 'Exception Frameworks & Debugging Tools', sum: 'Try-except-finally blocks, custom error hierarchies, logging setups, and pdb visual inspections.' },
    { id: 'multithreading_gil', num: 22, name: 'Multithreading, GIL & Concurrency', sum: 'The Global Interpreter Lock (GIL), thread safe Locks, queues, and ThreadPoolExecutors.' },
    { id: 'multiprocessing_ipc', num: 23, name: 'Multiprocessing & Shared Memory Models', sum: 'IPC Pipes, Shared arrays, process pooling, billiard routines, and multiprocessing queues.' },
    { id: 'asyncio_engines', num: 24, name: 'Asynchronous Loop & Asyncio Engines', sum: 'Event loops, coroutines, Task execution, async/await bindings, and non-blocking sockets.' },
    { id: 'science_numpy', num: 25, name: 'Science Stack: NumPy & Matplotlib Analytics', sum: 'Vectorized arrays, broadcasting rules, linear algebra, subplots grid, and dynamic canvas rendering.' }
  ],
  rtos: [
    { id: 'rtos_intro', num: 1, name: 'Real-Time Concepts & RTOS Architecture', sum: 'Deterministic scheduling, soft vs hard real-time, kernels, superloops, interrupts response latency, and idle tasks.' },
    { id: 'task_mgt', num: 2, name: 'Task Management & Execution States', sum: 'Task creation, states transitions, task parameters, static tasks, task handles, and deleting active tasks.' },
    { id: 'scheduler_preemption', num: 3, name: 'Scheduler Configurations & Preemption', sum: 'Round-robin scheduling, cooperative execution, tick rates configTICK_RATE_HZ, time-slicing, and context switches.' },
    { id: 'priorities_delays', num: 4, name: 'Task Priorities & Blocking Delays', sum: 'Task priorities configuration, starvations, vTaskDelay() vs busy polling, and vTaskDelayUntil() periodic ticks.' },
    { id: 'sem_binary', num: 5, name: 'Binary Semaphores & Signaling', sum: 'Unlocking tasks, interrupt-to-task signaling, deferred interrupt processing, and semaphore handles.' },
    { id: 'sem_counting', num: 6, name: 'Counting Semaphores & Resource Tracking', sum: 'Resource counting, producer-consumer limits, bounds tracking, and counting initialization options.' },
    { id: 'mutex_priority', num: 7, name: 'Mutexes & Priority Inversion Solvers', sum: 'Exclusive lockouts, priority inversions, priority inheritance protocols, and recursive mutex bounds.' },
    { id: 'queue_comm', num: 8, name: 'Thread-Safe Queue Management', sum: 'Inter-task messaging, sending/receiving items, queue blockage durations, structured payloads, and ISR-safe pipelines.' },
    { id: 'event_groups', num: 9, name: 'Event Groups & Bit Flags Signaling', sum: 'Multiple event synchronizations, wait bits, setting flags from tasks/ISRs, and event-driven architectures.' },
    { id: 'software_timers', num: 10, name: 'Software Timers & Callback Frameworks', sum: 'One-shot vs auto-reload timers, timer service tasks, callback restrictions, and starting/stopping timers.' },
    { id: 'heap_memory', num: 11, name: 'Heap Architectures (heap_1 to heap_5)', sum: 'Static allocations, allocation/deallocation overheads, fragmentation, and coalescing algorithms.' },
    { id: 'isrs_interrupts', num: 12, name: 'Interrupt Handlers (ISRs) & Safe APIs', sum: 'Interrupt nested prioritization, xQueueSendFromISR, yielding from ISRs, and deferred work patterns.' },
    { id: 'critical_sections', num: 13, name: 'Critical Sections & Task Suspend', sum: 'Disabling interrupts, suspending task scheduler, shared resource guards, and mutex lock comparisons.' },
    { id: 'queue_sets', num: 14, name: 'Queue Sets & Complex Interfacing', sum: 'Grouping queues and semaphores, waiting on multiple handles, and multiplexed data processing.' },
    { id: 'stream_buffers', num: 15, name: 'Stream & Message Buffers', sum: 'Single-producer single-consumer circular buffers, optimized telemetry streams, and message packetizers.' },
    { id: 'priority_inversion', num: 16, name: 'Priority Inversion Diagnostic Scenarios', sum: 'Traces of unbounded priority inversion, priority inheritance verification, and design fixes.' },
    { id: 'deadlocks_prevent', num: 17, name: 'Deadlock Auditing & Resource Ordering', sum: 'Circular waits, mutex request patterns, lock timeouts, and thread safety validation.' },
    { id: 'stack_overflow', num: 18, name: 'Stack Overflow Protections & Debug', sum: 'Stack high-water marks, runtime hook detections, configCHECK_FOR_STACK_OVERFLOW, and debugging setups.' },
    { id: 'trace_diagnostics', num: 19, name: 'Trace Utilities & Run-time Analysis', sum: 'SystemViewer tracking, trace recorder hooks, task CPU load statistics, and timing diagnostics.' },
    { id: 'rtos_hooks', num: 20, name: 'Idle Hook Functions & Low-Power modes', sum: 'Tickless idle configurations, sleep entries, battery savings, and background diagnostic loops.' },
    { id: 'co_routines', num: 21, name: 'Co-routines vs Tasks Trade-offs', sum: 'Memory-constrained task structures, cooperative co-routine priorities, and syntax limits.' },
    { id: 'multicore_amp_smp', num: 22, name: 'Multicore RTOS (AMP vs SMP Systems)', sum: 'Task bindings, asymmetric processing, symmetric scheduling, and dual-core thread safety.' },
    { id: 'custom_scheduler', num: 23, name: 'Customizing Scheduler Behaviors', sum: 'Tick-hook functions, modify time slice ticks, user-defined scheduler priorities, and task yields.' },
    { id: 'rtos_testing', num: 24, name: 'Unit Testing RTOS Firmware Assets', sum: 'Mocking system ticks, testing task states, boundary constraints, and integration testing frameworks.' },
    { id: 'enterprise_ports', num: 25, name: 'Industrial RTOS Certification & Ports', sum: 'Safety-critical standards, hardware ports, assembly files, and vector table interfaces.' }
  ],
  stm32: [
    { id: 'stm32_basics', num: 1, name: 'ARM Cortex-M Architecture Foundations', sum: 'Processor registers, CPU pipeline, thumb-2 instruction, stack pointers (MSP/PSP), and bus maps.' },
    { id: 'gpio_driver', num: 2, name: 'GPIO Configuration & Register Models', sum: 'Pin modes (input, output, analog, alternate), pull-up/down resistors, speed levels, and port registers.' },
    { id: 'exti_interrupts', num: 3, name: 'EXTI Controllers & NVIC Priorities', sum: 'External interrupts, edge triggers, NVIC interrupt nested priorities, and ISR vector assignments.' },
    { id: 'rcc_clocks', num: 4, name: 'Reset & Clock Control (RCC) Engine', sum: 'Internal HSI, external HSE, PLL setup, AHB/APB system bus prescalers, and peripheral clocks.' },
    { id: 'timers_counters', num: 5, name: 'General-Purpose Timers & Counters', sum: 'Timer prescalers, auto-reload registers, counter directions, and basic delay generation.' },
    { id: 'pwm_generation', num: 6, name: 'PWM Waveforms & Frequency control', sum: 'Compare registers, PWM edge/center modes, duty cycle control, and H-bridge motor drivers.' },
    { id: 'adc_conversion', num: 7, name: 'Analog-to-Digital Converter (ADC) basics', sum: 'Sampling rates, resolution configurations, multiplexing channels, and reference voltages.' },
    { id: 'adc_dma', num: 8, name: 'Advanced ADC Conversions with DMA', sum: 'DMA controller channels, circular buffer arrays, block transfers, and zero-overhead conversions.' },
    { id: 'uart_comm', num: 9, name: 'UART/USART Serial Communication', sum: 'Baud rates, parity, framing, poll modes, interrupt transfers, and DMA configurations.' },
    { id: 'i2c_protocol', num: 10, name: 'I2C Bus Protocol & Sensor Interfaces', sum: 'Start/stop, addressing, master/slave states, clock stretching, pullups, and reading sensors.' },
    { id: 'spi_protocol', num: 11, name: 'SPI High-Speed Bus Communication', sum: 'Clock phase/polarity, master/slave select lines, full duplex speeds, and flash memory integrations.' },
    { id: 'dac_audio', num: 12, name: 'Digital-to-Analog Converter (DAC) Output', sum: 'Waveform synthesizers, output buffers, sine wave generation, and DMA audio pipelines.' },
    { id: 'watchdogs_wdg', num: 13, name: 'Watchdog Timers (IWDG & WWDG)', sum: 'Independent watchdog clocks, windowed watchdog bounds, and system lockup prevention.' },
    { id: 'low_power', num: 14, name: 'Low Power Modes (Sleep, Stop, Standby)', sum: 'Power control registers, wakeup events, RAM retention, and RTC backup domains.' },
    { id: 'rtc_backup', num: 15, name: 'Real-Time Clock (RTC) & Calendar', sum: 'Sub-seconds calibration, external LSE crystals, backup registers, and alarm trigger events.' },
    { id: 'flash_eeprom', num: 16, name: 'Flash Memory Sectors & Emulated EEPROM', sum: 'Sectors write protections, erase steps, flash programming delays, and persistent parameter stores.' },
    { id: 'can_bus', num: 17, name: 'CAN/CAN-FD Automotive Bus Protocol', sum: 'Message mailboxes, filters, baud rate segments, transceiver physical layers, and bus safety.' },
    { id: 'usb_periph', num: 18, name: 'USB Device & Host Stack Integrations', sum: 'USB FS/HS transceivers, descriptors, CDC virtual com ports, and MSC disk drivers.' },
    { id: 'crc_engine', num: 19, name: 'Hardware CRC Engine & Data Integrity', sum: 'Polynomial registers, checksum calculations, secure packet inspections, and DMA CRC.' },
    { id: 'rng_generator', num: 20, name: 'True Random Number Generator (RNG)', sum: 'Analog entropy sources, random number seed pools, and security key generation.' },
    { id: 'stm32_cubemx', num: 21, name: 'CubeMX Configuration & Code Generation', sum: 'Pinout maps, clock trees, HAL project generation, and toolchain configurations.' },
    { id: 'bare_metal_reg', num: 22, name: 'Bare-Metal Register Programming', sum: 'Replacing HAL with direct register writes, pointer offsets, and optimization speed gains.' },
    { id: 'bootloader_mgt', num: 23, name: 'Custom Bootloader & OTA Upgrades', sum: 'Vector table remapping, application launching, binary verification, and flash memory bounds.' },
    { id: 'debug_swd_itm', num: 24, name: 'SWD Debugging & ITM Console Prints', sum: 'Serial Wire Debug, instrumentation trace macros, breakpoints, and live registers tracking.' },
    { id: 'firmware_testing', num: 25, name: 'Production Firmware Validation & Benchmarks', sum: 'Static analysis, hardware-in-the-loop (HIL) testing, and execution profiling.' }
  ],
  arduino: [
    { id: 'arduino_basics', num: 1, name: 'Arduino Platform & AVR Core Architecture', sum: 'AVR 8-bit registers, Harvard memory layout, Atmega328p MCU, and compile pipelines.' },
    { id: 'digital_io', num: 2, name: 'Digital Pins Direction & State controls', sum: 'pinMode(), digitalWrite(), digitalRead(), internal pull-up resistors, and debounce filters.' },
    { id: 'analog_in', num: 3, name: 'Analog Inputs & 10-bit ADC conversion', sum: 'analogRead(), analogReference(), voltage conversions, and reading linear potentiometers.' },
    { id: 'analog_out_pwm', num: 4, name: 'Analog Write & Hardware PWM outputs', sum: 'analogWrite(), high-speed duty cycle, RC filters, and analog voltage approximation.' },
    { id: 'timing_millis', num: 5, name: 'Timing mechanics & Non-blocking code', sum: 'delay() locking penalties, millis() timers, micros(), and multi-rate scheduler routines.' },
    { id: 'ext_interrupts', num: 6, name: 'External Hardware Interrupt Pins', sum: 'attachInterrupt(), ISR execution bounds, volatile variable qualifiers, and switch debounces.' },
    { id: 'serial_comm', num: 7, name: 'Serial UART Communication Bus', sum: 'Serial.begin(), read/write buffers, parsing string commands, and logic level shifts.' },
    { id: 'i2c_wire', num: 8, name: 'I2C Bus Interfacing with Wire Library', sum: 'Wire.begin(), master-slave address maps, reading barometrics, and address scanners.' },
    { id: 'spi_bus', num: 9, name: 'SPI Bus Protocol with SPI Library', sum: 'SPI.transfer(), CS pins control, LCD displays, and SD card data logging.' },
    { id: 'eeprom_data', num: 10, name: 'Non-volatile EEPROM Data Persistence', sum: 'EEPROM.read(), EEPROM.write(), EEPROM wear limits, and structure storage strategies.' },
    { id: 'servo_motors', num: 11, name: 'Servo Motor Control using PWM library', sum: 'Servo.attach(), angles matching, current draw limits, and external supply wiring.' },
    { id: 'stepper_drivers', num: 12, name: 'Stepper Motor Driver Interfacing', sum: 'H-bridge wiring, Stepper library, step directions, and precise angular steps.' },
    { id: 'esp32_basics', num: 13, name: 'ESP32 Dual-Core C++ Programming', sum: 'Dual core pin allocations, freeRTOS tasks integration, and ESP32 clock controls.' },
    { id: 'esp32_wifi', num: 14, name: 'ESP32 Wi-Fi Station & AP modes', sum: 'Connecting to routers, Wi-Fi event handles, custom static IPs, and signal rssi.' },
    { id: 'esp32_web', num: 15, name: 'ESP32 Web Server & REST API hosting', sum: 'Serving HTML/CSS, processing API parameters, JSON parsing, and remote pin toggles.' },
    { id: 'esp32_ble', num: 16, name: 'Bluetooth Low Energy (BLE) Client/Server', sum: 'BLE advertising packets, services, characteristics, and custom smartphone apps.' },
    { id: 'low_power_modes', num: 17, name: 'Arduino Power Management & Sleep', sum: 'Power reduction registers, AVR deep sleep, ESP32 RTC wake sources, and battery systems.' },
    { id: 'custom_libraries', num: 18, name: 'Writing Reusable Arduino Libraries', sum: 'C++ classes structure, header files (.h), source files (.cpp), and keywords.txt.' },
    { id: 'multitasking_proto', num: 19, name: 'Protothreads & Lightweight multitaskers', sum: 'Cooperative lightweight execution, macro-based context switches, and memory usage.' },
    { id: 'sensor_calibration', num: 20, name: 'Calibrating Sensors & Noise Filters', sum: 'Linear map(), exponential moving averages, Kalman filters, and offset calibration.' },
    { id: 'seven_segment', num: 21, name: 'Driving Displays & LED Multiplexers', sum: '7-Segment displays, shift registers (74HC595), multiplexing pins, and character tables.' },
    { id: 'tone_sound', num: 22, name: 'Tone Sound Generation & Buzzers', sum: 'Square wave generation, tone(), custom melodies, and frequency mapping.' },
    { id: 'watchdog_avr', num: 23, name: 'Enabling Watchdogs on AVR Microcontrollers', sum: 'avr/wdt.h, resetting cycles, lockup recoveries, and boot loop protections.' },
    { id: 'arduino_cli', num: 24, name: 'Arduino CLI & Command Line Builds', sum: 'Compiling from terminals, package managers, custom boards, and makefiles.' },
    { id: 'production_pcbs', num: 25, name: 'Moving from Arduino Board to Standalone PCB', sum: 'Minimal ATMega328p circuits, crystal oscillators, 5V regulator designs, and ISP programming.' }
  ],
  'raspberry-pi': [
    { id: 'rpi_setup', num: 1, name: 'Raspberry Pi System Configuration', sum: 'Headless boot setup, flash images, ssh logins, terminal fundamentals, and updates.' },
    { id: 'rpi_gpiod', num: 2, name: 'Linux GPIO Access & gpiod library', sum: 'Interfacing pins from bash, python-gpiod, system events, and voltage level shifters.' },
    { id: 'rpi_python_gpio', num: 3, name: 'GPIO Zero & RPi.GPIO Libraries', sum: 'LED toggles, reading digital switches, PWM duty ratios, and event callback hooks.' },
    { id: 'rpi_i2c_bus', num: 4, name: 'Linux I2C Bus & smbus2 python API', sum: 'Configuring I2C channels, smbus2 read/write, master commands, and dynamic address grids.' },
    { id: 'rpi_spi_bus', num: 5, name: 'Linux SPI Bus & spidev python API', sum: 'Configuring spidev speeds, duplex byte transfers, reading ADCs, and SPI display blocks.' },
    { id: 'pico_intro', num: 6, name: 'Raspberry Pi Pico RP2040 Intro', sum: 'RP2040 chip layouts, boot pins, flash memories, and dual core layouts.' },
    { id: 'pico_sdk_setup', num: 7, name: 'Pico C/C++ SDK Toolchain Config', sum: 'CMake environments, arm-none-eabi tools, visual studio configurations, and debugging.' },
    { id: 'pico_digital_io', num: 8, name: 'Pico GPIO Controls & Interrups', sum: 'Pico GPIO SDK, directions setup, ISR pin triggers, and volatile qualifiers.' },
    { id: 'pico_adc_temp', num: 9, name: 'Pico ADC & Onboard Temp sensor', sum: 'ADC channel mappings, voltage parsing, readings scaling, and averaging arrays.' },
    { id: 'pico_multicore', num: 10, name: 'Pico Dual-Core SMP Programming', sum: 'Launching Core 1, inter-core FIFO communications, spinlocks, and thread safety.' },
    { id: 'pico_pio_engine', num: 11, name: 'Pico Programmable I/O (PIO) Engine', sum: 'PIO assembly basics, state machine loops, FIFO data buffers, and microsecond protocols.' },
    { id: 'pico_dma_controller', num: 12, name: 'Pico DMA Controllers & Zero-CPU Transfer', sum: 'DMA channels setup, memory-to-peripheral, ping-pong buffers, and zero latency IO.' },
    { id: 'pico_i2c_spi', num: 13, name: 'Pico SDK Hardware I2C & SPI buses', sum: 'Bypass bitbang with hardware controllers, I2C/SPI master setup, and bus scans.' },
    { id: 'pico_usb_tinyusb', num: 14, name: 'TinyUSB Stack on Pico (Keyboard/Mouse)', sum: 'USB hid configurations, sending keystrokes, mouse coordinates, and serial ports.' },
    { id: 'pico_rtos_port', num: 15, name: 'FreeRTOS Ports on RP2040 dual-core', sum: 'Configuring multi-core scheduler, tasks prioritization, mutexes, and queues.' },
    { id: 'rpi_systemd_services', num: 16, name: 'Auto-launching Scripts via systemd', sum: 'Writing systemd service unit files, enable/start triggers, logs tracking.' },
    { id: 'rpi_flask_control', num: 17, name: 'Flask-based GPIO Remote Dashboard', sum: 'Python web sockets, remote control pins, state updates, and streaming logs.' },
    { id: 'rpi_camera_v4l2', num: 18, name: 'Camera Modules & OpenCV basics', sum: 'V4L2 device files, capturing raw pictures, image processing, and opencv matrices.' },
    { id: 'pico_flash_save', num: 19, name: 'Saving Parameter Constants to Flash', sum: 'Sector erasing routines, flash writing boundaries, offset tables, and flash offsets.' },
    { id: 'pico_sleep_wake', num: 20, name: 'Pico Ultra-Low Power Deep Sleeps', sum: 'RTC clock wake alarms, dormant states config, and battery longevity metrics.' },
    { id: 'rpi_node_red', num: 21, name: 'Node-RED for IoT flow dashboards', sum: 'Visual flow setup, connecting GPIOs, websocket inputs, and browser panels.' },
    { id: 'rpi_mqtt_mosquitto', num: 22, name: 'MQTT Messaging Client & Broker Stack', sum: 'Mosquitto setups, publish/subscribe protocols, payload parsing, and sensor broadcasts.' },
    { id: 'rpi_industrial_guards', num: 23, name: 'Hardware Watchdog & Kernel safety', sum: 'Enabling Raspberry Pi watchdog, system monitor loops, and crash reboots.' },
    { id: 'pico_micropython', num: 24, name: 'MicroPython vs Pico C/C++ SDK', sum: 'Comparing memory consumption, loop speeds, libraries, and rapid development.' },
    { id: 'enterprise_pico_pcb', num: 25, name: 'Deploying Custom RP2040 PCBs', sum: 'Schematics mapping, flash memory wiring, crystal load caps, and custom USB ports.' }
  ],
  c: [
    { id: 'c_basics', num: 1, name: 'C Syntax & Program Structures', sum: 'Hello world compile steps, gcc, preprocess directives, main function returns, and variables.' },
    { id: 'c_datatypes', num: 2, name: 'Variables, Types & Integer limits', sum: 'Signed/unsigned types, float precisions, limits.h, sizes of types, and format specifiers.' },
    { id: 'c_operators', num: 3, name: 'Logical Operators & Bitwise Masks', sum: 'Bitwise AND, OR, XOR, shifts, registers masking, and precedence rules.' },
    { id: 'c_conditionals', num: 4, name: 'Logical Branches & Switch Blocks', sum: 'If-else checks, ternary operations, switch blocks logic, and compiler jump tables.' },
    { id: 'c_loops', num: 5, name: 'Control Loops & Iteration Mechanics', sum: 'For, while, and do-while loops, breaks, continues, and compiler unrolling.' },
    { id: 'c_arrays', num: 6, name: 'Single & Multi-Dimensional Arrays', sum: 'Continuous memory layouts, array indices, bounds checks, and matrix operations.' },
    { id: 'c_pointers_basics', num: 7, name: 'Pointers & Address Dereferencing', sum: 'Physical RAM addresses, pointer types, value swaps, and pointer references.' },
    { id: 'c_pointer_arith', num: 8, name: 'Pointer Arithmetic & Array Offsets', sum: 'Offset strides, void pointers casting, array pointer decays, and dereferencing offsets.' },
    { id: 'c_functions', num: 9, name: 'Functions & Stack Frame Executions', sum: 'Stack pointers, activation records, call-by-value, and pass-by-reference pointers.' },
    { id: 'c_recursion', num: 10, name: 'Recursion & Stack Overflow bounds', sum: 'Base conditions, call tree evaluation, and stack overflow traps.' },
    { id: 'c_strings', num: 11, name: 'C-Strings & Buffer Manipulation', sum: 'Null-terminated characters, string.h utilities, string copying risks, and buffer overruns.' },
    { id: 'c_memory_heap', num: 12, name: 'Manual Memory Allocation (Malloc/Free)', sum: 'malloc(), calloc(), realloc(), free(), heap arenas, and memory leak tracking.' },
    { id: 'c_structures', num: 13, name: 'Structs & Compiler Byte Padding', sum: 'Custom structs, byte alignment rules, size optimizations, and arrow operators.' },
    { id: 'c_unions', num: 14, name: 'Unions & Shared Memory Layouts', sum: 'Shared memory cells, union alignments, register overlays, and type punning.' },
    { id: 'c_enums', num: 15, name: 'Standard Enums & Typedef Shorthand', sum: 'Named integer constants, typedef scope aliases, and type safety constraints.' },
    { id: 'c_file_io', num: 16, name: 'File Streams & Binary I/O Operations', sum: 'fopen(), fread(), fwrite(), fclose(), buffering streams, and record storage.' },
    { id: 'c_preprocessor', num: 17, name: 'Macros & Preprocessor Directives', sum: '#define constants, conditional compilations, header guards, and macros bugs.' },
    { id: 'c_libraries', num: 18, name: 'Static vs Dynamic Library Links', sum: 'Creating archive files (.a), shared objects (.so), dll links, and header exports.' },
    { id: 'c_scopes_linkage', num: 19, name: 'Scope, Linkage & Storage Classes', sum: 'Auto, static, extern, register keywords, file scopes, and symbol linkage.' },
    { id: 'c_const_volatile', num: 20, name: 'Qualifiers: const, volatile & restrict', sum: 'Read-only constraints, register volatile reads, and restrict optimization pointers.' },
    { id: 'c_function_ptr', num: 21, name: 'Function Pointers & Callback Design', sum: 'Function address mapping, array of function pointers, and event-driven interfaces.' },
    { id: 'c_mem_leaks', num: 22, name: 'Auditing Memory Leaks & Valgrind', sum: 'Use-after-free diagnostics, double-free faults, dangling pointers, and memory maps.' },
    { id: 'c_string_safe', num: 23, name: 'Safe String Handling & snprintf()', sum: 'Replacing unsafe strcpy/strcat, bounds validations, and security audit rules.' },
    { id: 'c_assembly_inline', num: 24, name: 'Inline Assembly & CPU instruction map', sum: '__asm__ blocks, register binds, direct processor calls, and optimizing math.' },
    { id: 'c_advanced_debug', num: 25, name: 'Standard GDB Debugging & Core Dumps', sum: 'Symbol tables, stack backtrace, inspect variable states, and segmentation fault debugs.' }
  ],
  cpp: [
    { id: 'cpp_intro', num: 1, name: 'C++ Modern Paradigms & Compilation', sum: 'C++ standard versions, g++ compiling, iostream library, and namespacing.' },
    { id: 'cpp_references', num: 2, name: 'References vs Pointer bindings', sum: 'Reference variables, pass-by-reference bounds, const references, and pointer contrasts.' },
    { id: 'cpp_classes', num: 3, name: 'Classes, Objects & Encapsulations', sum: 'Access specifiers (public, private, protected), inline declarations, and member states.' },
    { id: 'cpp_constructors', num: 4, name: 'Constructors, Destructors & Lifetimes', sum: 'Default, parameterized, and copy constructors, initializer lists, and object tear-down.' },
    { id: 'cpp_raii', num: 5, name: 'RAII & Resource Management scopes', sum: 'Binding resources to stack scopes, automatic deletions, and mutex scope locks.' },
    { id: 'cpp_operator_over', num: 6, name: 'Operator Overloading Fundamentals', sum: 'Overloading arithmetic and stream extraction/insertion operators, and operator rules.' },
    { id: 'cpp_inheritance', num: 7, name: 'Inheritance & Subclass Interfaces', sum: 'Single, multiple, and hierarchical inheritances, and scope overrides.' },
    { id: 'cpp_polymorphism', num: 8, name: 'Polymorphism & Virtual Functions', sum: 'Late binding, virtual methods, pure virtual functions, and abstract base classes.' },
    { id: 'cpp_vtable', num: 9, name: 'Under the Hood: VTables & Binding', sum: 'Virtual table pointer lookups, memory layouts of polymorphic objects, and offsets.' },
    { id: 'cpp_smart_ptr', num: 10, name: 'Smart Pointers (Unique, Shared, Weak)', sum: 'std::unique_ptr, std::shared_ptr reference counts, weak_ptr observers, and cyclic memory locks.' },
    { id: 'cpp_templates', num: 11, name: 'Generic Programming with Templates', sum: 'Template functions, class templates, template specializations, and compiler instantiations.' },
    { id: 'cpp_stl_vectors', num: 12, name: 'STL Vectors & Sequential Containers', sum: 'std::vector dynamic arrays, pushing elements, capacity overheads, and iterators.' },
    { id: 'cpp_stl_associative', num: 13, name: 'STL Map, Set & Hash Containers', sum: 'std::map red-black trees, std::unordered_map hash tables, and performance rules.' },
    { id: 'cpp_exceptions', num: 14, name: 'Exception Handling & Try-Catch blocks', sum: 'Throwing objects, stack unwinding, standard exception hierarchies, and noexcept specifier.' },
    { id: 'cpp_move_semantics', num: 15, name: 'Rvalue References & Move Semantics', sum: 'Lvalues vs Rvalues, rvalue reference (&&), std::move, and copy-free vector insertion.' },
    { id: 'cpp_lambda', num: 16, name: 'Lambda Expressions & Capture Scopes', sum: 'Inline functions, capture list parameters, mutable lambdas, and std::function wraps.' },
    { id: 'cpp_namespaces', num: 17, name: 'Namespaces & Large-scale Code Design', sum: 'Nested namespaces, using directives, anonymous namespaces, and symbol resolution.' },
    { id: 'cpp_io_streams', num: 18, name: 'Advanced I/O Streams & File Access', sum: 'fstream, read/write serialization, manipulators, and in-memory stringstreams.' },
    { id: 'cpp_threads', num: 19, name: 'Concurrency with std::thread & Mutex', sum: 'Creating threads, data races, std::mutex, lock_guards, and futures/promises.' },
    { id: 'cpp_casting', num: 20, name: 'Type Casts: Static, Dynamic, Reinterpret', sum: 'Compile-time casts, RTTI dynamic checks, bare memory pointer reinterpreting, and const casts.' },
    { id: 'cpp_rule_of_five', num: 21, name: 'The Rule of Three, Five, and Zero', sum: 'Copy constructor/assignment, move constructor/assignment, and destructor guidelines.' },
    { id: 'cpp_memory_pools', num: 22, name: 'Custom Allocators & Memory Pools', sum: 'Overloading operator new/delete, pre-allocated contiguous memory blocks, and speed setups.' },
    { id: 'cpp_metaprogramming', num: 23, name: 'Template Metaprogramming & Constexpr', sum: 'Compile-time calculations, constexpr evaluations, and static_assert validations.' },
    { id: 'cpp_pimpl', num: 24, name: 'Pimpl Idiom & Compiler Firewalls', sum: 'Hiding class implementations, opaque pointers, and reducing compiler header file dependencies.' },
    { id: 'cpp_modern_20_23', num: 25, name: 'Modern C++20/C++23 Concepts & Ranges', sum: 'Concepts constraints, standard ranges algorithms, coroutines, and modular structures.' }
  ]
};

/**
 * Dynamic, programmatic catalog generator
 * produces exactly 1025 topics (25 chapters * 41 topics) for any track
 */
export function getTrackTopicsCatalog(track: string): CatalogChapter[] {
  const cleanTrack = track.toLowerCase() === 'raspberry-pi' ? 'raspberry-pi' : track.toLowerCase();
  const chapters = TRACK_CHAPTERS_METADATA[cleanTrack] || TRACK_CHAPTERS_METADATA['python'];

  const subTopicsTemplates = [
    { prefix: "Memory Architecture of", suffix: "Objects" },
    { prefix: "Time & Space Complexity of", suffix: "Operations" },
    { prefix: "Real-world Enterprise Design of", suffix: "Frameworks" },
    { prefix: "Edge Cases & Runtime Pitfalls in", suffix: "Applications" },
    { prefix: "Secure Coding Standards for", suffix: "Environments" },
    { prefix: "Unit Testing & Assertions of", suffix: "Modules" },
    { prefix: "Garbage Collection Behaviors of", suffix: "Data Structures" },
    { prefix: "Thread-Safety and Synchronizations in", suffix: "Pipelines" },
    { prefix: "Distributed Scaling Architectures for", suffix: "Configurations" },
    { prefix: "Performance Tuning and Profiling of", suffix: "Scripts" },
    { prefix: "Debugging & Post-Mortem Inspections of", suffix: "Fails" },
    { prefix: "Introspection & Metadata Reflection for", suffix: "Types" },
    { prefix: "Type Casting and Runtime Type Checking in", suffix: "Variables" },
    { prefix: "API Layouts & Clean Code Design Patterns for", suffix: "Classes" },
    { prefix: "Backward Compatibility and Legacy deprecation of", suffix: "APIs" },
    { prefix: "Hardware Controls and OS System Mappings for", suffix: "Logic" },
    { prefix: "Interactive Documentation and Sphinx Setup for", suffix: "Codebases" },
    { prefix: "Memory Footprint Optimization Techniques of", suffix: "Allocations" },
    { prefix: "High-Performance IO Processing with", suffix: "Streams" },
    { prefix: "Cryptographic Defenses and Sandboxed Runs of", suffix: "Libraries" },
    { prefix: "Dynamic Introspection & Symbol Lookups in", suffix: "Scopes" },
    { prefix: "C-Bindings and Cython Extensions for", suffix: "Functions" },
    { prefix: "Compiling Native Bindings and Direct Memory", suffix: "Integrations" },
    { prefix: "Best Practices, Design Guidelines, and PEP Standards for", suffix: "Projects" },
    { prefix: "Advanced Structural Layouts and Packaging of", suffix: "Modules" },
    { prefix: "Scalability Constraints and Clustering Models of", suffix: "Hosts" },
    { prefix: "System Signal Handling and Interrupt Traps in", suffix: "Processes" },
    { prefix: "State Preservation, Checkpointing, and Restores in", suffix: "Engines" },
    { prefix: "Database Indexing & Persistence Mappings of", suffix: "Schemas" },
    { prefix: "Concurrency Primitives and Non-blocking Loops for", suffix: "Services" },
    { prefix: "Final Assessment & Comprehensive Coding Drill for", suffix: "Concepts" }
  ];

  return chapters.map((chap) => {
    const topics: CatalogTopic[] = [];

    // Base name generator for special topics
    for (let i = 0; i < 10; i++) {
      const topicName = `${chap.name} Drill Part ${i + 1}`;
      topics.push({
        id: `${cleanTrack}_${chap.id}_t${i + 1}`,
        name: topicName,
        desc: `Master the engineering details, registers, and optimizations of ${topicName.toLowerCase()} in production environments.`
      });
    }

    // Dynamic systematic templates
    for (let k = 0; k < 31; k++) {
      const idx = k + 11;
      const t = subTopicsTemplates[k];
      const keywords = chap.name.split(" & ").join(" and ").split(" ");
      const kw = keywords[keywords.length - 1]; // Use last word for relevance
      const topicName = `${t.prefix} ${kw} ${t.suffix}`;

      topics.push({
        id: `${cleanTrack}_${chap.id}_t${idx}`,
        name: topicName,
        desc: `A rigorous analysis focused on ${topicName.toLowerCase()}, checking hardware registers and code performance.`
      });
    }

    return {
      id: chap.id,
      number: chap.num,
      name: chap.name,
      summary: chap.sum,
      topics: topics
    };
  });
}
