export interface ArduinoTopic {
  id: string;
  name: string;
  category: string;
  summary: string;
  theory: string;
  visualType: 'board' | 'editor' | 'interactive_blink' | 'pot_graph' | 'servo' | 'sensor_panel' | 'tone_synth' | 'interrupt_sim' | 'table';
  visualDesc: string;
  code: string;
}

export const ARDUINO_CATEGORIES = [
  { id: 'basics', name: '1. Arduino Basics & Core Lang' },
  { id: 'libs', name: '2. Standard Function Libraries' },
  { id: 'advanced', name: '3. Advanced Hardware & Protocols' },
  { id: 'projects', name: '4. Hands-on Core Projects' },
  { id: 'sensors', name: '5. Sensors, Switches & Motors' },
  { id: 'sound_comm', name: '6. Audio, Wireless & Resources' }
];

export const ARDUINO_LESSONS: ArduinoTopic[] = [
  {
    id: 'overview',
    name: 'Arduino - Home & Overview',
    category: 'basics',
    summary: 'Introduction to the Arduino physical computing ecosystem, development philosophy, and open-source hardware.',
    theory: `### What is Arduino?
Arduino is an open-source electronics platform based on flexible, easy-to-use hardware and software. It's designed for hobbyists, artists, designers, and students to build interactive physical applications.

#### Key Aspects of the Platform:
1. **Open-Source Hardware**: Arduino designs are licensed under Creative Commons, meaning anyone can manufacture compatible clones (like the popular Arduino Uno R3).
2. **Simplified C/C++ Framework**: The software layer wraps around AVR-GCC, providing high-level commands (like \`digitalWrite\`) that replace direct AVR bit manipulation registers.
3. **Cross-Platform IDE**: Write code on Windows, macOS, or Linux, and flash it over USB with a single click.

#### Microcontroller vs. Single Board Computer:
- **Arduino (MCU)**: Executes a single, simple bare-metal loop. Highly reliable, consumes microamps, handles real-time hardware IO directly without boot latency.
- **Raspberry Pi (SBC)**: Runs a full multitasking Linux Operating System. Power-hungry, has high OS latency, handles heavy networking and databases but is not optimized for bare-metal high-precision timing.`,
    visualType: 'editor',
    visualDesc: 'Arduino Development Ecosystem Overview: IDE Editor & MCU interaction',
    code: `/*
 * Arduino - Platform Hello World
 * Prints a greeting message to the Serial Monitor at boot.
 */
void setup() {
  // Initialize USB Serial communication at 9600 baud rate
  Serial.begin(9600);
  
  // Print message once
  Serial.println("Hello World! Welcome to Electronics Gyan's Arduino Guide.");
}

void loop() {
  // Empty loop - nothing runs repeatedly
}`
  },
  {
    id: 'board_desc',
    name: 'Arduino - Board Description & Pinout',
    category: 'basics',
    summary: 'Detailed physical mapping of the ATmega328P Arduino Uno, power systems, clocks, and internal registers.',
    theory: `### Anatomy of the Arduino Uno (ATmega328P)
The Arduino Uno is the standard starter board. Understanding its layout is critical for physical wiring and preventing board damage.

#### Pinout & Power Architecture:
1. **Atmel ATmega328P**: The 8-bit RISC core operating at **16 MHz** with a crystal oscillator.
2. **Operating Voltage (5V)**: High-quality 5V power rail. Pins supply up to **20mA / 40mA absolute maximum** current.
3. **Power Input (VIN / Barrel Jack)**: On-board linear regulator drops external **7V-12V** DC power down to 5V.
4. **Digital I/O Pins (0-13)**: Can be configured as inputs or outputs.
   - **PWM Pins (~3, ~5, ~6, ~9, ~10, ~11)**: Supported pins marked with a tilde.
   - **UART Pins (0/RX, 1/TX)**: Serial pins used for programming and USB debugging.
5. **Analog Input Pins (A0-A5)**: Pins connected to an internal 10-bit Successive Approximation Analog-to-Digital Converter (ADC). Can resolve voltages between 0V and 5V to a digital integer (0 to 1023).`,
    visualType: 'board',
    visualDesc: 'Interactive ATmega328P Arduino Uno Board Map (Click pins to inspect function)',
    code: `/*
 * ATmega328P GPIO Configuration Template
 * Shows direct setup of standard digital and analog pin interfaces.
 */
const int STATUS_LED = 13;   // Digital Output Pin 13 (Built-in LED)
const int POTENTIOMETER = A0; // Analog Input Pin A0

void setup() {
  pinMode(STATUS_LED, OUTPUT); // Configure digital Pin 13 as Output
  Serial.begin(115200);        // Configure high-speed serial debug interface
}

void loop() {
  // Simple read of the potentiometer voltage
  int val = analogRead(POTENTIOMETER);
  Serial.print("ADC Input Level: ");
  Serial.println(val);
  delay(500);
}`
  },
  {
    id: 'installation',
    name: 'Arduino - Installation & Setup',
    category: 'basics',
    summary: 'Step-by-step setup guide for the official Arduino IDE, USB-Serial CH340/FTDI drivers, and flashing firmware.',
    theory: `### Getting Connected: IDE & Drivers
Before compiling your first sketch, you must install the core compiler chain and configure local hardware drivers.

#### Step 1: Install Arduino IDE 2.x
The official Arduino IDE is an advanced electron-based platform offering code auto-completion, real-time variable inspection, and dynamic graph plotting.

#### Step 2: Configure USB-Serial Drivers
Many budget-friendly Arduino compatible boards replace the premium ATmega16U2 USB chip with a cost-effective **CH340G** or **FT232** UART transceiver.
- **Windows**: Often requires the CH341 driver package to be manually installed to establish a virtual COM Port.
- **macOS / Linux**: Drivers are natively integrated, though users on Linux must authorize access to the dialout group (\`sudo usermod -a -G dialout $USER\`).

#### Step 3: Flash Your Board
1. Select **Tools -> Board -> Arduino Uno**.
2. Select the designated serial interface under **Tools -> Port** (e.g., \`COM3\` or \`/dev/ttyUSB0\`).
3. Click the **Upload** arrow to compile C++ code into machine hex instruction formats and upload via the AVR bootloader.`,
    visualType: 'editor',
    visualDesc: 'Visual Checklist: Hardware -> USB Cable -> Virtual COM Port -> Arduino IDE Uploader',
    code: `/*
 * Diagnostics: High-speed UART Connection Test
 * Upload this sketch and open the Serial Monitor (Ctrl+Shift+M / Cmd+Shift+M)
 * Ensure the baud rate dropdown matches 115200.
 */
void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for USB serial connection to initialize (critical for Leonardo/Due)
  }
  Serial.println("=== SYSTEM STARTUP DIAGNOSTIC ===");
  Serial.print("Processor: ATmega328P | Clock Speed: ");
  Serial.print(F_CPU / 1000000);
  Serial.println(" MHz");
  Serial.println("USB Interface: SUCCESS | Communication Link: ACTIVE");
}

void loop() {
  // Empty background loop
}`
  },
  {
    id: 'prog_struct',
    name: 'Arduino - Program Structure',
    category: 'basics',
    summary: 'The under-the-hood entry points of an Arduino compilation unit: Setup, Loop, and global execution paradigms.',
    theory: `### Behind the Curtain: The Standard C++ Main Boot
When writing an Arduino sketch, you might wonder where the mandatory \`int main()\` function went. Behind the scenes during compile time, the Arduino builder wraps your sketch in a hidden boilerplate file.

#### The Real Core Boilerplate Structure:
\`\`\`cpp
#include <Arduino.h>

int main(void) {
    init();          // Low-level hardware initialization (ADC, Timers)
    initVariant();

    setup();         // Execute user configuration code
    
    for (;;) {       // Infinite background loop
        loop();      // Repeatedly execute user program code
        if (serialEventRun) serialEventRun();
    }
    return 0;
}
\`\`\`

#### Rules of Variable Scope:
- **Global Variables**: Declared outside any function. They reside in static SRAM memory and persist throughout program execution.
- **Local Variables**: Declared inside a function block (like setup or loop). They are created on the stack frame when the function is entered and instantly destroyed when the function returns.`,
    visualType: 'interactive_blink',
    visualDesc: 'Core Loop Execution Flow Simulator: Watch sequential instruction flow',
    code: `/*
 * Structure Breakdown: Setup vs. Loop Execution Flow
 */
// 1. Global Space: Declared once on compile
unsigned long runCount = 0;

void setup() {
  // 2. Setup Block: Runs once when board boots or gets hardware-reset
  Serial.begin(9600);
  Serial.println("SYSTEM: setup() completed. Starting main operation loop...");
}

void loop() {
  // 3. Loop Block: Runs continuously, back-to-back, infinitely
  runCount++;
  Serial.print("Loop Cycle Count: ");
  Serial.println(runCount);
  
  delay(1000); // Wait 1 second (Caution: halts processor instructions)
}`
  },
  {
    id: 'core_lang',
    name: 'Arduino - Data Types, Variables & Constants',
    category: 'basics',
    summary: 'Memory footprint optimization using standard data types, floating-point math, and PROGMEM constants.',
    theory: `### RAM Optimization: 8-Bit Data Types
Because standard microcontrollers like the ATmega328P have only **2 KB of volatile SRAM**, choice of variable data types is critical to avoid stack overflows.

#### Core Data Footprints:
| Type | Bytes | Range | Ideal Usage |
| :--- | :--- | :--- | :--- |
| \`boolean\` | 1 | true or false (0 or 1) | Bit Flags, Switch positions |
| \`byte\` / \`uint8_t\` | 1 | 0 to 255 | PWM duty cycle, PIN numbers |
| \`char\` | 1 | -128 to 127 | Single ASCII letters |
| \`int\` | 2 | -32,768 to 32,767 | General counts, ADC steps |
| \`unsigned int\` | 2 | 0 to 65,535 | Loop cycles, fast timers |
| \`long\` | 4 | -2.1B to 2.1B | Math, distance, sensor offsets |
| \`unsigned long\` | 4 | 0 to 4,294,967,295 | millis() and micros() timestamps |
| \`float\` | 4 | -3.4E+38 to 3.4E+38 | High precision division, temperature values |

> **Pro Tip (The F() Macro)**: Use the \`F()\` macro when printing static text strings (e.g., \`Serial.println(F("Hello"))\`). This keeps strings inside program Flash memory, saving precious RAM!`,
    visualType: 'table',
    visualDesc: 'Memory layout of data types in an 8-bit AVR architecture',
    code: `/*
 * Data Types and RAM Footprint Analysis
 */
#include <Arduino.h>

void setup() {
  Serial.begin(9600);
  
  // Demonstrating proper data type optimization
  const byte ledPin = 13; // Uses exactly 1 byte, marked const to avoid runtime edit
  
  Serial.println(F("--- AVR Type Size Specifications ---"));
  Serial.print(F("sizeof(char): ")); Serial.print(sizeof(char)); Serial.println(F(" Byte"));
  Serial.print(F("sizeof(int): ")); Serial.print(sizeof(int)); Serial.println(F(" Bytes (16-bit on AVR)"));
  Serial.print(F("sizeof(long): ")); Serial.print(sizeof(long)); Serial.println(F(" Bytes (32-bit)"));
  Serial.print(F("sizeof(float): ")); Serial.print(sizeof(float)); Serial.println(F(" Bytes (Double is identical)"));
}

void loop() {
  // Empty loop
}`
  },
  {
    id: 'control_loops',
    name: 'Arduino - Operators, Control & Loops',
    category: 'basics',
    summary: 'Branching logic, boolean algebra, hardware state-machines, and structural iteration.',
    theory: `### Logical Decision Control Flow
Conditional branch execution and loops enable smart physical systems (e.g. 'if temperature exceeds limit, trip safety relay, then flash indicator LED').

#### Logical & Bitwise Operators:
- **AND (\`&&\`)**: Evaluates true only if both operands are true.
- **OR (\`||\`)**: Evaluates true if at least one operand is true.
- **NOT (\`!\`)**: Inverts state.
- **Bitwise Operators (\`&\`, \`|\`, \`^\`, \`<<\`, \`>>\`\`)**: Essential for direct port manipulation (speeding up digital operations by up to 20x compared to standard digitalWrite).

#### State Machines via Switch-Case:
Using a modular state machine structure is highly recommended over massive nested \`if-else\` constructs. It ensures robust firmware that is easily testable.`,
    visualType: 'interactive_blink',
    visualDesc: 'Interactive Loop Execution & Iteration visualizer',
    code: `/*
 * State-Machine Model utilizing Switch-Case branching logic
 */
enum SystemState {
  STATE_SAFE,
  STATE_WARNING,
  STATE_CRITICAL
};

SystemState currentCondition = STATE_SAFE;
const int tempPin = A0;

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
}

void loop() {
  int rawTemp = analogRead(tempPin);
  
  // Map raw analog voltage readings to logical state
  if (rawTemp < 400) {
    currentCondition = STATE_SAFE;
  } else if (rawTemp >= 400 && rawTemp < 800) {
    currentCondition = STATE_WARNING;
  } else {
    currentCondition = STATE_CRITICAL;
  }
  
  // Control system depending on state machine
  switch (currentCondition) {
    case STATE_SAFE:
      digitalWrite(13, LOW);
      digitalWrite(12, LOW);
      Serial.println("System Safe.");
      break;
      
    case STATE_WARNING:
      digitalWrite(13, HIGH); // Yellow LED warning
      digitalWrite(12, LOW);
      Serial.println("WARNING: Overheating detected!");
      break;
      
    case STATE_CRITICAL:
      digitalWrite(13, HIGH);
      digitalWrite(12, HIGH); // Trip sirens/emergency relays
      Serial.println("ALARM: Critical failure! Triggering safety shutdown.");
      break;
  }
  delay(1000);
}`
  },
  {
    id: 'funcs_strings',
    name: 'Arduino - Functions, Strings & Arrays',
    category: 'basics',
    summary: 'Writing re-usable code modules, dynamic String objects vs. raw C character arrays, and index buffer structures.',
    theory: `### Memory Safe Manipulation of Strings and Arrays
When coding on microcontrollers, understand how data is organized inside hardware buffers to avoid running out of RAM.

#### 1. Functions
Isolate operations into dedicated modules to enforce clean, reusable code structure. Passing arguments by reference (\`&\`) avoids making deep copies, conserving stack frame allocation memory.

#### 2. C-Style Strings (char arrays) vs. C++ String Objects:
- **C-Style (\`char string[] = "hello"\`)**: Lightweight, fully predictable memory layout. Does not cause heap fragmentation. Highly recommended.
- **String Object (\`String str = "hello"\`)**: Dynamic resize capabilities, but heavily fragments limited SRAM because it continuously deallocates and reallocates memory on the heap. Avoid inside complex, long-running loops.

#### 3. Arrays
Continuous memory segments. **Warning**: Arduino C++ does not perform boundary checks on arrays. Accessing index out-of-bounds (\`arr[size + 1]\`) can write data over critical processor registers, causing instant system crashes or unpredictable hardware glitches.`,
    visualType: 'table',
    visualDesc: 'C-Style String index structure mapped inside contiguous hardware memory bytes',
    code: `/*
 * Functions, Safe Arrays, and String Parsing Demonstration
 */
const int sampleCount = 5;
int readingHistory[sampleCount] = {10, 22, 15, 30, 25};

// Function declaring pointer parameter to save stack memory
float calculateAverage(const int* data, int size) {
  long total = 0;
  for (int i = 0; i < size; i++) {
    total += data[i]; // Safe iteration bounded by array limits
  }
  return (float)total / size;
}

void setup() {
  Serial.begin(9600);
  
  // Parse numeric values to output using a light buffer
  float average = calculateAverage(readingHistory, sampleCount);
  
  char outputBuffer[50];
  // sprintf format helper to print formatted details cleanly
  sprintf(outputBuffer, "Buffer average calculation: %d.%02d units", (int)average, (int)(average * 100) % 100);
  
  Serial.println(outputBuffer);
}

void loop() {
  // Empty background loop
}`
  },
  {
    id: 'io_functions',
    name: 'Arduino - Digital & Analog I/O Functions',
    category: 'libs',
    summary: 'Hardware pin operations using digitalWrite, digitalRead, analogRead, and analogWrite (PWM).',
    theory: `### Digital & Analog Input / Output Commands
These core instructions form the fundamental vocabulary for interfacing with physical electronics.

#### 1. digitalWrite(pin, value)
Applies a digital high (5V) or low (0V) potential to an output pin.
- Internally sets/clears bit states in the microcontroller's PORT registers.

#### 2. digitalRead(pin)
Queries the voltage of a pin configured as an INPUT.
- Returns \`HIGH\` (logic 1, >3V) or \`LOW\` (logic 0, <1.5V).
- **INPUT_PULLUP**: Activates an internal **20K-50K ohm** pull-up resistor to pull the pin HIGH by default. This avoids floating inputs when utilizing physical switch connections!

#### 3. analogRead(pin)
Uses the internal 10-bit Successive Approximation ADC to resolve an analog voltage into a digital scale from 0 to 1023.
- Resolves step sizes of approximately **4.88mV** per unit based on a 5V reference voltage.

#### 4. analogWrite(pin, dutyCycle)
Creates a simulated analog voltage using Pulse Width Modulation (PWM) on supported pins.
- **dutyCycle**: ranges from 0 (always LOW, 0% duty) to 255 (always HIGH, 100% duty).
- Toggles pin output state rapidly at ~490Hz or ~980Hz.`,
    visualType: 'interactive_blink',
    visualDesc: 'Interactive Digital Output Simulator: Toggle voltage levels',
    code: `/*
 * Standard Digital and Analog Interfacing
 * Operates an LED with threshold triggers and pull-up button checks.
 */
const int buttonPin = 2; // Button wired between pin 2 and ground
const int ledPin = 9;    // LED wired to PWM output pin 9
const int ldrPin = A0;   // Light Dependent Resistor divider to A0

void setup() {
  pinMode(buttonPin, INPUT_PULLUP); // Active-low button configuration
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Read digital status of button (LOW = pressed due to active-low pull-up)
  bool buttonState = !digitalRead(buttonPin);
  
  // Read Ambient light level (0-1023)
  int lightVal = analogRead(ldrPin);
  
  // Log telemetry measurements
  Serial.print("Light level: ");
  Serial.print(lightVal);
  Serial.print(" | Button Action: ");
  Serial.println(buttonState ? "PRESSED" : "RELEASED");
  
  if (buttonState) {
    // Override: manual LED full activation
    analogWrite(ledPin, 255);
  } else {
    // Smart auto-dimming LED: Brighter when environment darkens (inverse light)
    int brightness = map(lightVal, 0, 1023, 255, 0);
    analogWrite(ledPin, constrain(brightness, 0, 255));
  }
  
  delay(100);
}`
  },
  {
    id: 'advanced_io',
    name: 'Arduino - Advanced I/O Functions',
    category: 'libs',
    summary: 'Working with timing-critical IO commands including shiftOut for shift registers and pulseIn for sensor timing.',
    theory: `### Timing-Critical Advanced Input & Output
Some complex components (like ultrasonic rangefinders, RC receivers, and shift registers) require high-precision timing signals that standard digital read/write loops cannot achieve.

#### 1. shiftOut(dataPin, clockPin, bitOrder, value)
Acts as a software-emulated SPI bus interface. Shift out 8 bits of data serially, clocking each bit on a dedicated clock line.
- Essential for multiplying outputs with a **74HC595 shift register** (controls 8 LEDs with only 3 pin lines).

#### 2. pulseIn(pin, value, timeout)
Halts code execution to measure the duration of a HIGH or LOW pulse on an input pin.
- Returns pulse length in microseconds (\`us\`).
- Essential for computing distances from ultrasonic **HC-SR04** echo pulses!`,
    visualType: 'pot_graph',
    visualDesc: 'Waveform Analyzer: Pulse wave width in microseconds',
    code: `/*
 * Pulse Width Reader and Shift Register Control
 * Demonstrates measuring pulse width and outputting multiplexed digital signals.
 */
const int echoPin = 7;
const int dataPin = 11;
const int clockPin = 12;
const int latchPin = 8;

void setup() {
  pinMode(echoPin, INPUT);
  pinMode(dataPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(latchPin, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  // 1. Measure incoming pulse duration (e.g., from an RC receiver)
  unsigned long duration = pulseIn(echoPin, HIGH, 50000); // 50ms timeout
  Serial.print("Pulse duration read: ");
  Serial.print(duration);
  Serial.println(" us");

  // 2. Control an array of shift register LEDs
  digitalWrite(latchPin, LOW);
  // Shift out standard binary sequence
  shiftOut(dataPin, clockPin, MSBFIRST, 0b10101010); 
  digitalWrite(latchPin, HIGH);

  delay(1000);
}`
  },
  {
    id: 'math_trig',
    name: 'Arduino - Math, Trigonometry & Character Libs',
    category: 'libs',
    summary: 'Hardware limitations of floating-point math, core trigonometric execution, and character classification.',
    theory: `### Embedded Numerical Operations
Microcontrollers like the ATmega328P lack a hardware Floating Point Unit (FPU). Floating-point arithmetic (\`float\`, \`double\`) is simulated entirely in software, making it computationally heavy.

#### 1. Math Library
- \`map(val, in_min, in_max, out_min, out_max)\`: Re-scales an integer from one range to another. **Warning**: Uses integer division, truncating fractional values!
- \`constrain(val, min, max)\`: Clips a variable value within lower and upper bounds.
- \`abs(x)\`, \`min(x,y)\`, \`max(x,y)\`: Inline macros for standard math constraints.

#### 2. Trigonometry
Standard commands (\`sin(rad)\`, \`cos(rad)\`, \`tan(rad)\`) accept arguments in **radians** (not degrees). To convert degrees to radians, multiply by \`DEG_TO_RAD\` (\`3.14159 / 180.0\`).

#### 3. Character Utility Functions (ctype.h)
Essential helper functions for analyzing incoming keyboard or terminal packets:
- \`isDigit(c)\`: Returns true if character is a digit (0-9).
- \`isAlpha(c)\`: Returns true if character is a letter (A-Z, a-z).
- \`isSpace(c)\`: Returns true for carriage returns, tabs, and spaces.`,
    visualType: 'table',
    visualDesc: 'Execution Speed benchmarks: Floating point vs. Integer math calculations',
    code: `/*
 * High-performance Math calculations and parsing logs
 */
#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  
  // Benchmarking computation speed
  unsigned long start = micros();
  volatile float f_result = 0.0;
  for (int i = 0; i < 500; i++) {
    f_result += sin(i * DEG_TO_RAD) * cos(i * DEG_TO_RAD);
  }
  unsigned long duration = micros() - start;
  
  Serial.println(F("=== HARDWARE COMPUTATION SPEED ==="));
  Serial.print(F("Time for 500 Sine/Cosine calculations: "));
  Serial.print(duration);
  Serial.println(F(" microseconds"));
  
  // Character validation
  char inputChar = '7';
  if (isDigit(inputChar)) {
    Serial.println(F("Validated character: input is a valid Numeric Digit."));
  }
}

void loop() {
  // Empty loop
}`
  },
  {
    id: 'due_zero_pwm',
    name: 'Arduino - Due & Zero + PWM Architecture',
    category: 'advanced',
    summary: 'Unlocking 32-bit ARM Cortex-M0+ and Cortex-M8 cores, and direct high-frequency PWM generation.',
    theory: `### Transitioning to 32-Bit ARM Ecosystems
While the 8-bit Arduino Uno is excellent for basic interfacing, modern engineering projects require higher CPU speeds, real-time multitasking, and larger RAM workspaces.

#### Platform Comparison:
- **Arduino Zero (SAMD21)**: Featuring an ARM Cortex-M0+ 32-bit processor. Operates at 48 MHz with 32 KB RAM and **3.3V operating voltage**.
- **Arduino Due (SAM3X8E)**: Featuring a powerful 84 MHz ARM Cortex-M3 core with 96 KB RAM and dual true Digital-to-Analog Converters (DAC).

#### CRITICAL WARNING: 3.3V Logic Levels!
Unlike the 5V Arduino Uno, the Zero and Due run on 3.3V logic. Connecting a 5V sensor output directly to a digital pin on these 32-bit boards will **instantly fry the processor input gates**! Always use hardware level-shifters.

#### Understanding PWM Hardware:
Pulse Width Modulation works by toggling high-frequency timers. By overriding system registers, you can change the PWM frequency from the default 490Hz up to tens of kilohertz (ideal for silent, high-performance motor control).`,
    visualType: 'pot_graph',
    visualDesc: 'True DAC Output waveform vs. Duty cycle PWM waveforms',
    code: `/*
 * High Resolution True DAC and PWM Control (32-bit SAMD / SAM3X Only)
 * Writes an analog wave to true DAC Pin A0 and high-speed PWM output.
 */
#ifdef ARDUINO_ARCH_SAMD
  #define HAS_DAC
#elif defined(ARDUINO_ARCH_SAM)
  #define HAS_DAC
#endif

void setup() {
  Serial.begin(115200);
  
  #ifdef HAS_DAC
    // Configure true DAC to high resolution output (10-bit or 12-bit)
    analogWriteResolution(10); // Scale from 0 to 1023
    Serial.println("System initialized: Hardware True DAC supported on PA0/A0.");
  #else
    Serial.println("System initialized: True DAC not supported. Falling back to PWM.");
  #endif
}

void loop() {
  // Create a beautiful analog sine wave output on DAC (Pin A0)
  for (int deg = 0; deg < 360; deg += 5) {
    float rad = deg * DEG_TO_RAD;
    int amplitude = (sin(rad) * 511) + 512; // Center offset around 1.65V
    
    #ifdef HAS_DAC
      analogWrite(A0, amplitude); // Outputs clean, ripple-free analog voltage!
    #else
      analogWrite(9, amplitude / 4); // Standard 8-bit PWM fallback on pin 9
    #endif
    
    delay(2); // Frequency control
  }
}`
  },
  {
    id: 'rand_interrupts',
    name: 'Arduino - Random Numbers & Interrupts',
    category: 'advanced',
    summary: 'Generating pseudo-random seed values and implementing hardware-level edge triggers with Interrupt Service Routines.',
    theory: `### High-Speed Hardware Handling & True Random Seeds
Microcontrollers run deterministic instruction loops. Creating unpredictable behavior or catching high-speed external pulses requires configuring hardware triggers.

#### 1. Real Pseudo-Random Generators
- \`random(min, max)\`: Generates random numbers, but repeats the exact same sequence on reboot.
- **Solving the Boot Sequence Repeatability**: Use \`randomSeed(analogRead(Unconnected_Pin))\`. Reading thermal noise on an open, floating analog pin provides a random seed to initialize the generator!

#### 2. Hardware Interrupts
Instead of checking button states on every loop cycle (polling), which can miss fast events during a delay, use **Interrupt Service Routines (ISRs)**.
- Interrupts instantly halt program execution, jump to a dedicated function, and then return to where the code left off.

#### 3. Interrupt Safety Protocols:
- Declared global variables modified inside an ISR **must** use the \`volatile\` keyword.
- Never write \`delay()\` or call \`Serial.print()\` inside an ISR. They rely on global timer interrupts which are disabled during ISR execution, causing instant system lockups!`,
    visualType: 'interrupt_sim',
    visualDesc: 'Live Interactive Interrupt Simulator: Toggle edge transitions to execute ISR functions',
    code: `/*
 * Safe Interrupt and Random Seed Deployment
 */
const int interruptPin = 2; // Pin supporting interrupts on ATmega328P
volatile unsigned long lastPressTime = 0;
volatile int activePulses = 0;

void IRAM_ATTR handlePulseInput() {
  // Hardware Debounce Check: ensure at least 50ms elapsed
  unsigned long currentTime = millis();
  if (currentTime - lastPressTime > 50) {
    activePulses++;
    lastPressTime = currentTime;
  }
}

void setup() {
  Serial.begin(115200);
  
  // Seed random generator with atmospheric electromagnetic noise
  randomSeed(analogRead(A5));
  
  pinMode(interruptPin, INPUT_PULLUP);
  // Trigger on falling edge (button press connecting to GND)
  attachInterrupt(digitalPinToInterrupt(interruptPin), handlePulseInput, FALLING);
  
  Serial.println("System active. Awaiting edge-triggered hardware interrupt...");
}

void loop() {
  static int lastCount = 0;
  
  // Safely check and log interrupt activity outside the ISR
  if (activePulses != lastCount) {
    lastCount = activePulses;
    Serial.print("Registered Pulse Count: ");
    Serial.print(lastCount);
    Serial.print(" | Generated Random ID: ");
    Serial.println(random(1000, 9999));
  }
}`
  },
  {
    id: 'comms_protocols',
    name: 'Arduino - UART, I2C & SPI Protocols',
    category: 'advanced',
    summary: 'Hardware bus protocols compared: Serial UART, 2-wire I2C (SDA/SCL), and high-speed 4-wire SPI (MISO/MOSI/SCK).',
    theory: `### Master Bus Protocols Comparison
Connecting smart sensors, visual LCD screens, and memory chips requires standardized data buses.

#### 1. UART (Universal Asynchronous Receiver/Transmitter)
- **Pins**: TX, RX.
- **Topology**: Peer-to-peer (1 transmitter, 1 receiver).
- **Attributes**: Asynchronous (no clock wire), meaning both devices must agree on a set baud rate (e.g. 9600, 115200) beforehand.

#### 2. I2C (Inter-Integrated Circuit)
- **Pins**: **SDA** (Data Line), **SCL** (Clock Line).
- **Topology**: Master-Slave multi-device bus. Supports up to 127 devices connected to the same two wires, each identified by a unique hex address (e.g. \`0x27\`, \`0x68\`).
- **Speed**: Standard mode is **100 kHz**; fast mode is **400 kHz**.

#### 3. SPI (Serial Peripheral Interface)
- **Pins**: **MOSI** (Master Out), **MISO** (Master In), **SCK** (System Clock), **SS** (Slave Select).
- **Topology**: Synchronous, high-speed point-to-multipoint bus.
- **Attributes**: Supports massive data transfer rates (up to **10+ MHz**), ideal for driving color TFT screens or reading SD memory cards.`,
    visualType: 'table',
    visualDesc: 'Comparative chart: Number of wires, maximum speed, and complexity of UART vs I2C vs SPI',
    code: `/*
 * Multi-Protocol Communication Framework Setup
 * Uses the Wire (I2C) and SPI libraries.
 */
#include <Wire.h>
#include <SPI.h>

const int CHIP_SELECT_PIN = 10; // SPI SS Pin

void setup() {
  Serial.begin(115200);
  
  // Initialize I2C Bus as Master
  Wire.begin();
  
  // Initialize SPI Bus
  SPI.begin();
  pinMode(CHIP_SELECT_PIN, OUTPUT);
  digitalWrite(CHIP_SELECT_PIN, HIGH); // Disable SPI device by default
  
  Serial.println("=== HARDWARE PROTOCOL CHECKS ===");
  
  // Scan I2C network for connected devices
  Serial.println("Scanning I2C network...");
  for (byte address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    byte error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("Device found at address: 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
    }
  }
}

void loop() {
  // SPI Communication Example
  digitalWrite(CHIP_SELECT_PIN, LOW); // Select target device
  SPI.transfer(0x42);                 // Transfer command byte
  byte response = SPI.transfer(0x00); // Read incoming response byte
  digitalWrite(CHIP_SELECT_PIN, HIGH);// Release target device
  
  delay(1000);
}`
  },
  {
    id: 'led_fading',
    name: 'Arduino - Blinking & Fading LEDs',
    category: 'projects',
    summary: 'The physical building blocks of physical computing: building basic circuits and modulating LED brightness with PWM.',
    theory: `### Circuit Mechanics & LED Physics
Before connecting an LED directly to an I/O pin, you must understand current constraints and calculate safe resistor values.

#### Ohm's Law (\`V = I * R\`):
An I/O pin on the ATmega328P outputs **5V**. A standard red LED has a forward voltage drop (\`V_f\`) of approximately **2.0V** and operates safely at **15mA** (\`0.015A\`).
- Calculating the current-limiting resistor:
  $$\\text{Resistor} = \\frac{V_{pin} - V_f}{I_{target}} = \\frac{5.0\\text{V} - 2.0\\text{V}}{0.015\\text{A}} = 200\\Omega$$
- Standard practice: Use a **220 ohm** or **330 ohm** resistor to ensure safe current limits.
- **Never connect an LED directly to 5V or an I/O pin without a resistor!** Doing so will burn out the LED or permanently damage the microcontroller pin driver gates.`,
    visualType: 'interactive_blink',
    visualDesc: 'Interactive Circuit Simulator: Set delay and PWM parameters to watch physical LED respond',
    code: `/*
 * LED Fade Loop with PWM
 * Smoothly modulates the brightness of an LED using high-speed PWM.
 */
const int fadeLedPin = 9; // PWM pin 9

void setup() {
  pinMode(fadeLedPin, OUTPUT);
}

void loop() {
  // Fade IN: increase brightness from 0 to 255
  for (int level = 0; level <= 255; level++) {
    analogWrite(fadeLedPin, level);
    delay(5); // Adjust speed of fade
  }

  // Fade OUT: decrease brightness from 255 to 0
  for (int level = 255; level >= 0; level--) {
    analogWrite(fadeLedPin, level);
    delay(5);
  }
  
  delay(200); // Wait at the bottom of the cycle
}`
  },
  {
    id: 'voltage_graph',
    name: 'Arduino - Analog Read & LED Bar Graphs',
    category: 'projects',
    summary: 'Reading potentiometer voltage levels and displaying multi-stage values on LED bar graphs.',
    theory: `### Analog-to-Digital Conversion & Visualizers
Interfacing with continuous physical variables (like sound volume, dial positions, or distances) requires reading analog voltages.

#### Reading Voltages:
The ATmega328P ADC compares incoming pin voltage to its 5V reference.
- $0\\text{V} \\rightarrow 0$
- $2.5\\text{V} \\rightarrow 512$
- $5.0\\text{V} \\rightarrow 1023$

#### Multiplexed Bar Displays:
An LED bar graph is an array of individual LEDs. By scaling the ADC input down to the number of available LEDs using the \`map\` function, you can light up a progressive chain of LEDs to represent voltage levels!`,
    visualType: 'pot_graph',
    visualDesc: 'Interactive Potentiometer & Led Bar Graph simulator (Slide the knob to update the bar graph)',
    code: `/*
 * Analog Voltage Potentiometer and LED Bar Graph Visualizer
 * Reads voltage on A0 and represents scale on pins 2 through 7.
 */
const int analogPin = A0;
const int ledCount = 6;
int ledPins[] = {2, 3, 4, 5, 6, 7}; // LED Array outputs

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < ledCount; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {
  int sensorReading = analogRead(analogPin);
  
  // Calculate voltage representation (float helper)
  float voltage = sensorReading * (5.0 / 1023.0);
  Serial.print("Raw Input: ");
  Serial.print(sensorReading);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println(" V");

  // Map sensor input scale (0-1023) to LED count scale (0-6)
  int ledLevel = map(sensorReading, 0, 1023, 0, ledCount);

  // Loop through LEDs and turn them on up to the calculated index
  for (int i = 0; i < ledCount; i++) {
    if (i < ledLevel) {
      digitalWrite(ledPins[i], HIGH);
    } else {
      digitalWrite(ledPins[i], LOW);
    }
  }
  delay(50); // Fluid polling updates
}`
  },
  {
    id: 'hid_keyboard',
    name: 'Arduino - Keyboard & Mouse HID Controls',
    category: 'projects',
    summary: 'Emulating USB keyboards and mouse inputs on USB-native microcontrollers like the ATmega32U4.',
    theory: `### USB Human Interface Device (HID) Emulation
Some microcontrollers (specifically the **ATmega32U4** found on the Arduino Pro Micro and Leonardo, or the **SAMD21** on the Zero) feature native USB connectivity. 

#### Direct USB Emulation:
This allows the board to appear as a standard USB Keyboard or Mouse when plugged into a PC. You can send keystrokes, log out users, or trigger custom mouse trajectories directly from hardware inputs.

#### CRITICAL SAFETY NOTICE:
When emulating keyboard loops, **always add a physical hardware safety switch** in your code! Without a switch, a rogue loop typing keystrokes continuously can make it impossible to upload new code or use your PC!`,
    visualType: 'editor',
    visualDesc: 'Virtual USB keyboard routing packet architecture',
    code: `/*
 * USB HID Emulator with Hardware Safety Guard
 * Compiles ONLY on ATmega32U4 based boards (Leonardo, Pro Micro).
 * Connect button between pin 4 and GND.
 */
#if defined(ARDUINO_AVR_LEONARDO) || defined(ARDUINO_AVR_PROMICRO) || defined(ARDUINO_ARCH_SAMD)
  #include <Keyboard.h>
  #include <Mouse.h>
  #define HID_SUPPORTED
#endif

const int safetySwitchPin = 4; // Safety wire: Must connect to ground to execute!

void setup() {
  pinMode(safetySwitchPin, INPUT_PULLUP);
  
  #ifdef HID_SUPPORTED
    Keyboard.begin();
    Mouse.begin();
  #endif
}

void loop() {
  // Keystrokes will trigger ONLY if the physical safety switch is closed to GND
  if (digitalRead(safetySwitchPin) == LOW) {
    #ifdef HID_SUPPORTED
      // Example: Safely outputting custom automated engineering inputs
      Keyboard.println("Electronics Gyan Automated Test Terminal.");
      delay(500);
      
      // Move mouse in a square trajectory
      for (int i = 0; i < 4; i++) {
        Mouse.move(50, 0, 0);  // X, Y, Wheel
        delay(100);
        Mouse.move(0, 50, 0);
        delay(100);
        Mouse.move(-50, 0, 0);
        delay(100);
        Mouse.move(0, -50, 0);
        delay(500);
      }
    #endif
    
    // Halt to avoid repetitive flooding
    while (digitalRead(safetySwitchPin) == LOW) {
      delay(100); // Wait for user to disconnect safety pin
    }
  }
}`
  },
  {
    id: 'environmental',
    name: 'Arduino - Temperature, Humidity & PIR Sensors',
    category: 'sensors',
    summary: 'Parsing temperature data from DHT11/DHT22 sensors, and reading digital inputs from PIR motion sensors.',
    theory: `### Interfacing with Environmental Sensors
Environmental sensors allow microcontrollers to read physical changes in their surroundings.

#### 1. DHT11 / DHT22 Humidity & Temperature Sensors
These sensors use a custom single-wire digital protocol to transmit data packets.
- **DHT11**: Budget-friendly. Measures temperature from 0-50°C (±2°C) and humidity from 20-90% (±5%).
- **DHT22**: High-precision. Measures -40 to 80°C (±0.5°C) and humidity from 0-100% (±2%).

#### 2. PIR (Passive Infrared) Motion Sensor
PIR sensors measure infrared light radiating from objects in their field of view. When a human or animal passes by, it detects the temperature difference and outputs a simple **digital HIGH** signal on its output pin.`,
    visualType: 'sensor_panel',
    visualDesc: 'Interactive Sensor Hub: Adjust physical metrics and watch digital telemetry update',
    code: `/*
 * DHT Environmental Sensor and PIR Motion Trigger
 * Uses the DHT Sensor Library by Adafruit.
 */
#include <DHT.h>

const int dhtPin = 3;
const int pirPin = 4;
const int warningLed = 13;

#define DHTTYPE DHT22 // Specify sensor model (DHT11 or DHT22)
DHT dht(dhtPin, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(pirPin, INPUT);
  pinMode(warningLed, OUTPUT);
}

void loop() {
  // Read humidity and temperature values
  float humidity = dht.readHumidity();
  float tempC = dht.readTemperature();
  
  // Read digital PIR status (HIGH = motion detected)
  bool motionDetected = digitalRead(pirPin);

  // Validate sensor read success
  if (isnan(humidity) || isnan(tempC)) {
    Serial.println("DHT Sensor Failure!");
  } else {
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.print("% | Temperature: ");
    Serial.print(tempC);
    Serial.println(" C");
  }

  if (motionDetected) {
    digitalWrite(warningLed, HIGH);
    Serial.println("ALERT: Motion detected in restricted sector!");
  } else {
    digitalWrite(warningLed, LOW);
  }

  delay(2000); // DHT sensors require at least 2 seconds between reads
}`
  },
  {
    id: 'actuators',
    name: 'Arduino - DC, Servo & Stepper Motor Control',
    category: 'sensors',
    summary: 'Driving electromagnetic loads: H-bridge controllers, PWM servo angles, and high-precision bipolar stepper motors.',
    theory: `### Electromagnetic Load Interfacing
Microcontrollers are optimized for processing data, not delivering power. Connecting heavy inductive loads (like motors) directly to an I/O pin will **instantly destroy the microcontroller**. Always use dedicated motor drivers!

#### 1. DC Motors & H-Bridges (L298N / L9110S)
An H-bridge circuit controls DC motor direction by switching voltage polarity, and speed by modulating the PWM duty cycle.

#### 2. Servo Motors (SG90 / MG996R)
Servos are closed-loop geared motors that rotate to a specific angle (0 to 180 degrees) based on a **50 Hz PWM control signal**.
- High pulse width of **1.0ms** corresponds to 0 degrees, and **2.0ms** corresponds to 180 degrees.

#### 3. Stepper Motors (28BYJ-48 / NEMA 17)
Steppers rotate in precise steps by energizing internal electromagnetic coils in a specific sequence. This is ideal for precision systems like 3D printers and CNC machines!`,
    visualType: 'servo',
    visualDesc: 'Interactive Servo Motor Position visualizer (Rotate slider to command shaft angle)',
    code: `/*
 * Servo and DC Motor Driver Integration
 * Controls a standard servo sweep and uses an H-Bridge to drive a DC motor.
 */
#include <Servo.h>

const int servoPin = 9;
const int hBridgeSpeedPin = 5; // PWM pin for speed control
const int hBridgeDir1 = 3;     // Direction Control Pin 1
const int hBridgeDir2 = 4;     // Direction Control Pin 2

Servo myServo;

void setup() {
  myServo.attach(servoPin);
  
  pinMode(hBridgeSpeedPin, OUTPUT);
  pinMode(hBridgeDir1, OUTPUT);
  pinMode(hBridgeDir2, OUTPUT);
}

void loop() {
  // Sweep servo from 0 to 180 degrees
  for (int angle = 0; angle <= 180; angle += 15) {
    myServo.write(angle);
    
    // Command DC Motor forward at progressive speed
    digitalWrite(hBridgeDir1, HIGH);
    digitalWrite(hBridgeDir2, LOW);
    analogWrite(hBridgeSpeedPin, map(angle, 0, 180, 50, 255));
    
    delay(200);
  }
  
  // Cut DC Motor power
  digitalWrite(hBridgeDir1, LOW);
  digitalWrite(hBridgeDir2, LOW);
  delay(1000);
}`
  },
  {
    id: 'ultrasonic_switch',
    name: 'Arduino - Ultrasonic Sensor & Switch Circuits',
    category: 'sensors',
    summary: 'Calculating distance using sound speed timers and implementing hardware switch debounce procedures.',
    theory: `### Distance Metrics & Hardware Debouncing
Precision timing and signal filtering are essential for building reliable physical inputs.

#### 1. Ultrasonic Distance Computation (HC-SR04):
The HC-SR04 ultrasonic sensor transmits a high-frequency **40 kHz** sonic pulse. 
- The transmitter sends a pulse which bounces off target obstacles. The receiver detects the echo and outputs a HIGH pulse on the Echo pin.
- Calculating distance using the speed of sound ($343\\text{ m/s}$ or $0.0343\\text{ cm/us}$):
  $$\\text{Distance (cm)} = \\frac{\\text{Travel Time (us)} \\times 0.0343}{2}$$

#### 2. Switch Debouncing:
When a mechanical switch is pressed, the metal contacts bounce against each other rapidly for several milliseconds before making solid contact. This makes a single button press look like dozens of rapid clicks to the microcontroller!
- **Debounce Solution**: Implement a brief timing check using \`millis()\` to ensure button state changes are only registered after the signal stabilizes.`,
    visualType: 'sensor_panel',
    visualDesc: 'Interactive Ultrasonic Rangefinder: Slide obstacle closer to watch Echo pulse duration change',
    code: `/*
 * High-Precision HC-SR04 Distance Measurement & Button Debounce
 */
const int triggerPin = 11;
const int echoPin = 12;
const int buttonPin = 2;

volatile int rawPressCount = 0;
unsigned long lastDebounceTime = 0;
const int debounceDelay = 50; // Stable timing limit (ms)

void setup() {
  Serial.begin(115200);
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  // 1. Trigger the HC-SR04 sensor
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  
  // 2. Measure echo pulse duration
  long travelTime = pulseIn(echoPin, HIGH);
  
  // 3. Compute distance in centimeters
  float distance = travelTime * 0.0343 / 2.0;
  
  // 4. Implement software button debouncing
  bool currentButtonVal = (digitalRead(buttonPin) == LOW);
  static bool lastButtonState = false;
  
  if (currentButtonVal != lastButtonState) {
    if (millis() - lastDebounceTime > debounceDelay) {
      if (currentButtonVal) {
        rawPressCount++;
        Serial.print("Debounced Button Press Registered! Total count: ");
        Serial.println(rawPressCount);
      }
      lastDebounceTime = millis();
    }
    lastButtonState = currentButtonVal;
  }

  // Avoid spamming distance logs
  static unsigned long lastDistanceLog = 0;
  if (millis() - lastDistanceLog > 1000) {
    lastDistanceLog = millis();
    Serial.print("Distance to target: ");
    Serial.print(distance);
    Serial.println(" cm");
  }
}`
  },
  {
    id: 'sound_tone',
    name: 'Arduino - Tone Library & Sound Applications',
    category: 'sound_comm',
    summary: 'Generating square-wave frequencies with the tone library and wiring piezo buzzer audio circuits.',
    theory: `### Piezo Buzzer Acoustics & Frequency Modulation
Piezo buzzers produce sound using a piezoelectric ceramic disk that flexes physically when an electrical voltage is applied.

#### Tone Generation:
The built-in \`tone(pin, frequency, duration)\` function uses hardware timers to output a **50% duty cycle square wave** at a specified frequency.
- Generates precise audio notes (e.g. middle C = 262 Hz, A4 = 440 Hz).
- **Caution**: The standard tone library relies on **Timer 2**, meaning you cannot use PWM output on digital pins 3 and 11 while generating audio tones!
- **noTone(pin)**: Stops frequency generation on the designated pin.`,
    visualType: 'tone_synth',
    visualDesc: 'Interactive Synthesizer Keyboard: Click keys to play audio notes',
    code: `/*
 * Tone Melody Player
 * Plays a simple startup chime on a piezo buzzer connected to Pin 8.
 */
#include <Arduino.h>

// Musical Note Frequencies
#define NOTE_C4  262
#define NOTE_E4  330
#define NOTE_G4  392
#define NOTE_C5  523

const int buzzerPin = 8;

void setup() {
  Serial.begin(9600);
  Serial.println("Playing start chime melody...");
  
  int melody[] = { NOTE_C4, NOTE_E4, NOTE_G4, NOTE_C5 };
  int durations[] = { 150, 150, 150, 300 }; // Note durations in ms
  
  for (int i = 0; i < 4; i++) {
    // Play note on buzzer pin
    tone(buzzerPin, melody[i], durations[i]);
    
    // Brief delay between notes to distinguish them
    int pause = durations[i] * 1.30;
    delay(pause);
    
    noTone(buzzerPin); // Stop note
  }
}

void loop() {
  // Empty loop
}`
  },
  {
    id: 'wireless_network',
    name: 'Arduino - Wireless & Network Communication',
    category: 'sound_comm',
    summary: 'Wireless physical computing: interfacing with NRF24L01 radio transceivers, Bluetooth modules, and Ethernet shields.',
    theory: `### Connecting Microcontrollers Wirelessly
Building remote telemetry networks requires establishing robust wireless communication channels between devices.

#### 1. NRF24L01 2.4GHz Radio Transceivers
- **Interface**: SPI.
- **Attributes**: Ultra-low-power, point-to-multipoint communication. Operates on the 2.4GHz ISM band with ranges up to 100 meters (or 1000m with external antennas).
- Highly recommended for peer-to-peer sensor networks.

#### 2. HC-05 / HC-06 Classic Bluetooth Modules
- **Interface**: UART (Serial).
- **Attributes**: Easily bridges your microcontroller to smartphones or laptops, appearing as a standard virtual serial interface.

#### 3. W5500 Ethernet & Wi-Fi Shields
- Adds TCP/IP network connectivity to standard boards like the Arduino Uno, enabling direct REST requests and hosting local configuration web servers.`,
    visualType: 'table',
    visualDesc: 'Comparative chart: Range, bandwidth, and complexity of Bluetooth vs RF24 vs Wi-Fi',
    code: `/*
 * NRF24L01 Wireless Transmitter Setup
 * Uses the RF24 Library by TMRh20.
 */
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

RF24 radio(7, 8); // CE, CSN pins

const byte address[6] = "00001"; // Transmit address pipe

struct TelemetryData {
  int sensorId;
  float temperature;
  unsigned long timestamp;
};

void setup() {
  Serial.begin(115200);
  
  if (!radio.begin()) {
    Serial.println("RF24 hardware interface not responding!");
    while (1); // Halt
  }
  
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_MIN); // Adjust power consumption
  radio.stopListening();         // Set as transmitter
  
  Serial.println("NRF24L01 radio initialized. Broadcasting...");
}

void loop() {
  TelemetryData payload = {
    101,                  // Sensor ID
    24.5,                 // Simulated Temperature
    millis()              // Timestamp
  };
  
  // Transmit wireless packet
  bool success = radio.write(&payload, sizeof(payload));
  
  if (success) {
    Serial.println("Wireless payload broadcast: SUCCESS!");
  } else {
    Serial.println("Wireless payload broadcast: FAILED (No receiver response).");
  }
  
  delay(2000);
}`
  },
  {
    id: 'quick_resources',
    name: 'Arduino - Useful Resources & Quick Guide',
    category: 'sound_comm',
    summary: 'Comprehensive references, cheat sheets, debugging guides, and collaborative community forums.',
    theory: `### Professional Arduino Cheat Sheet & Resources
To help you build your physical electronics projects, here is a consolidated reference card of best practices and troubleshooting steps.

#### Debounce & Filter Checklists:
1. **Never float inputs**: Always use active pull-up or pull-down resistors on mechanical buttons.
2. **Handle inductive feedback**: When switching motors or relays, always connect a flyback diode (like the **1N4007**) in reverse-parallel to absorb high-voltage back-EMF spikes.
3. **Use separate power supplies**: Servo and DC motors draw high peak currents that can cause the microcontroller's power supply to sag, resetting the processor. Always use a separate power supply for motors, and **ensure you connect all ground (GND) lines together!**

#### Leading Technical Resources:
- **Official Documentation**: [https://www.arduino.cc/reference/en/](https://www.arduino.cc/reference/en/)
- **E_Gyan Knowledge Hub**: Access STM32 registers and FreeRTOS theory guides directly in our companion sections.`,
    visualType: 'table',
    visualDesc: 'Common Troubleshooting Matrix: Symptoms, Root Causes, and Solutions',
    code: `/*
 * Diagnostic Cheat Sheet: Run-Time Memory Inspection
 * Computes available RAM dynamically.
 */
int freeMemory() {
  extern int __heap_start, *__brkval;
  int v;
  return (int) &v - (__brkval == 0 ? (int) &__heap_start : (int) __brkval);
}

void setup() {
  Serial.begin(115200);
  Serial.println("=== DIAGNOSTIC TELEMETRY UNIT ===");
  Serial.print("SRAM Memory Available: ");
  Serial.print(freeMemory());
  Serial.println(" Bytes");
}

void loop() {
  // Empty loop
}`
  }
];
