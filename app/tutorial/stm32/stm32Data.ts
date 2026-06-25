export interface Stm32Topic {
  id: string;
  name: string;
  category: string;
  summary: string;
  theory: string;
  visualType: 'register' | 'flowchart' | 'waveform' | 'circuit' | 'pinout' | 'table';
  visualDesc: string; // Brief description of what the visual diagram represents
  code: string;
}

export const STM32_CATEGORIES = [
  { id: 'basics', name: '1. Basics & Toolchain' },
  { id: 'gpio', name: '2. GPIO & Debugging' },
  { id: 'interrupts_timers', name: '3. Interrupts & Timers' },
  { id: 'pwm', name: '4. PWM & Motor Control' },
  { id: 'timing', name: '5. Microsecond Delays & DMA' },
  { id: 'advanced', name: '6. Advanced Sensors & Low Power' }
];

export const STM32_LESSONS: Stm32Topic[] = [
  {
    id: 'core_intro',
    name: 'Core STM32 Tutorials',
    category: 'basics',
    summary: 'Master the architectural foundations of STM32 ARM Cortex-M4 microcontrollers.',
    theory: `### Introduction to STM32 & ARM Cortex-M4
The **Nucleo-STM32L476RG** board features the ultra-low-power **STM32L476RGT6** microcontroller, operating on an **ARM Cortex-M4** core with a Floating Point Unit (FPU) at speeds up to 80 MHz. 

#### Key Architectural Components:
1. **Cortex-M4 Core**: 32-bit RISC processor with Harvard Architecture (separate instruction and data buses).
2. **Flash Memory (1 MB)**: Stores the compiled binary application.
3. **SRAM (128 KB)**: Volatile workspace for global variables, heap, and call stack.
4. **AHB/APB Buses**: Advanced High-performance Bus (AHB) and Advanced Peripheral Bus (APB) connect the CPU core to internal peripherals (GPIO, Timers, ADC, DMA).
5. **Clock Trees**: Highly customizable clock multiplexers configured via the RCC register block to balance performance and power efficiency.`,
    visualType: 'register',
    visualDesc: 'Cortex-M4 Master Bus Matrix (AHB1/AHB2 vs APB1/APB2 Peripherals)',
    code: `/* 
 * STM32L476RG Hardware Architecture Mapping
 * Core: ARM Cortex-M4 with FPU @ 80 MHz
 * Flash: 1024 KB
 * SRAM: 128 KB (SRAM1: 96KB, SRAM2: 32KB)
 */
#include "stm32l4xx_hal.h"

void SystemClock_Config(void);

int main(void) {
    // Initialize standard HAL library and Flash Prefetch
    HAL_Init();
    
    // Configure System Clock to maximum 80 MHz using MSI / PLL
    SystemClock_Config();
    
    while (1) {
        // Core execution loop
    }
}`
  },
  {
    id: 'toolchain',
    name: 'Setting Up STM32 Toolchain',
    category: 'basics',
    summary: 'Configure a professional compiler and IDE workspace for firmware engineering.',
    theory: `### The STM32 Developer Toolchain
Developing professional-grade firmware on the **Nucleo-L476RG** requires robust compilation, code generation, and hardware flash-debugging tools.

#### Key Software Ecosystem:
1. **STM32CubeIDE**: An all-in-one development environment based on Eclipse, integrating the GNU C/C++ ARM Compiler (GCC) and GDB debugger.
2. **STM32CubeMX**: An integrated graphic configuration tool that allows you to configure MCU pins, peripheral modes, and generate initialization C code.
3. **ST-Link Utility / STM32CubeProgrammer**: Standalone utilities used to write compiled \`.bin\` or \`.hex\` files directly to Flash memory.
4. **HAL (Hardware Abstraction Layer)**: High-level peripheral drivers provided by STMicroelectronics to simplify peripheral initialization.`,
    visualType: 'flowchart',
    visualDesc: 'Firmware Build Cycle: source.c -> GCC Compiler -> linker.ld -> binary.elf/hex -> ST-Link v2 -> STM32 Flash',
    code: `/*
 * STM32 Standard Main Workspace Template
 * Created automatically by STM32CubeMX toolchain generator
 */
#include "main.h"

// Hardware handles defined globally
UART_HandleTypeDef huart2;

int main(void) {
    // 1. Reset of all peripherals, Initializes the Flash interface and the Systick.
    HAL_Init();
    
    // 2. Configure the system clock
    SystemClock_Config();
    
    // 3. Initialize all configured peripherals
    MX_GPIO_Init();
    MX_USART2_UART_Init();
    
    while (1) {
        // App background loop
    }
}`
  },
  {
    id: 'get_started',
    name: 'Getting Started With STM32',
    category: 'basics',
    summary: 'Write your first C program, understand MCU boot processes, and flash a Nucleo board.',
    theory: `### Getting Started & Boot Process
When the Nucleo-L476RG boots up, the CPU loads the **Stack Pointer (SP)** address from \`0x08000000\` and the **Reset Vector** (instruction pointer address) from \`0x08000004\`. 

#### Boot sequence:
1. **Reset Handler**: Executed immediately on power-on. Copies initialized variables from Flash to SRAM and zeroes out the BSS memory block.
2. **SystemInit()**: Configures low-level clock sources and disables any active interrupts.
3. **main()**: The primary entry point for user applications.

For the **Nucleo-L476RG**, the user LED LD2 is connected to **PA5**, and the user push button B1 is connected to **PC13** (active LOW).`,
    visualType: 'pinout',
    visualDesc: 'Nucleo-L476RG Core Pinout: Pin PA5 (User LED LD2) & Pin PC13 (User Button B1)',
    code: `/*
 * Getting Started: Direct HAL LED Blink
 * Target Board: Nucleo-STM32L476RG
 * Green LED LD2 is wired to Port A, Pin 5 (Active HIGH)
 */
#include "stm32l4xx_hal.h"

void GPIO_Init_PA5(void) {
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    // Enable peripheral clock for Port A
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // Configure PA5 as digital output push-pull
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}

int main(void) {
    HAL_Init();
    GPIO_Init_PA5();
    
    while (1) {
        // Toggle the PA5 state every 250ms
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        HAL_Delay(250);
    }
}`
  },
  {
    id: 'hal_lib',
    name: 'STM32 HAL Library',
    category: 'basics',
    summary: 'Understand the architecture of STMicroelectronics HAL vs LL (Low-Layer) libraries.',
    theory: `### HAL vs LL vs Bare-Metal Register Programming
The software layers of STM32 allow varying levels of control and optimization:

| Layer | Code Portability | Code Footprint | Execution Speed | Development Time |
| :--- | :--- | :--- | :--- | :--- |
| **HAL** (Hardware Abstraction Layer) | **High** (easy to port across STM32 families) | Large (high overhead) | Standard | Very Fast |
| **LL** (Low-Layer Drivers) | **Medium** (requires hardware understanding) | Small | Fast | Medium |
| **Bare-Metal Registers** | **Low** (MCU-specific registers) | Extremely Small | Maximum | Slow |

#### HAL Structure conventions:
- **Initialization functions**: \`HAL_Peripheral_Init(Handle)\`
- **Control functions**: \`HAL_Peripheral_Start()\` / \`HAL_Peripheral_Stop()\`
- **State check functions**: \`HAL_Peripheral_GetState()\`
- **Interrupt callbacks**: Prefixed with weak declarations, e.g., \`HAL_GPIO_EXTI_Callback()\`.`,
    visualType: 'table',
    visualDesc: 'Firmware Abstraction Hierarchy: App -> CubeHAL -> Low-Layer (LL) -> Bare-Metal Registers -> Hardware Silicon',
    code: `/*
 * Demonstration of mixing HAL and low-level macro instructions
 * to control PA5 (LED) for speed and convenience on Nucleo-L476RG.
 */
#include "stm32l4xx_hal.h"

int main(void) {
    HAL_Init();
    
    // High-Level HAL Clock Enable
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    
    while (1) {
        // Instead of HAL_GPIO_TogglePin, we can use fast direct register manipulation:
        // Set Pin PA5 (BS5 - Bit Set register)
        GPIOA->BSRR = GPIO_PIN_5;
        HAL_Delay(100);
        
        // Reset Pin PA5 (BR5 - Bit Reset register)
        GPIOA->BRR = GPIO_PIN_5;
        HAL_Delay(100);
    }
}`
  },
  {
    id: 'gpio_tutor',
    name: 'GPIO Configuration & Pin Multiplexing',
    category: 'gpio',
    summary: 'Master low-level register-level GPIO configuration, Alternate Function multiplexing, and hardware speed tuning per RM0394.',
    theory: `## GPIO Configuration & Pin Multiplexing & Architectural Foundation

The General-Purpose Input/Output (GPIO) peripheral block of the STM32L4Ax microcontroller family is a high-speed, flexible interface engineered to handle digital signaling, analog interfacing, and high-speed alternate function routing. Each GPIO pin can be independently configured by software to act as a digital input, digital output, alternate peripheral function (e.g., USART, SPI, I2C, CAN, Timer I/O), or high-precision analog port.

#### Bus Matrix & Clock Domain Architecture
In the STM32L4Ax architecture (governed by the RM0394 Reference Manual), all GPIO ports (GPIOA, GPIOB, GPIOC, GPIOD, GPIOE, GPIOF, GPIOG, GPIOH, and GPIOI) are situated on the high-performance **AHB2 (Advanced High-performance Bus 2)** matrix. The AHB2 bus is clocked by the Core/System Clock (HCLK), running at speeds up to 80 MHz. 

Connecting the GPIOs to the AHB2 bus offers substantial electrical and computational advantages:
- **Single-Cycle I/O Access:** The CPU can perform read or write operations to the GPIO registers in a single clock cycle, enabling ultra-low-latency pin state toggling and signal sampling.
- **Direct Memory Access (DMA) Compatibility:** DMA controllers can access GPIO data registers (IDR/ODR) directly over the AHB matrix to move bulk data without CPU intervention.
- **Independent Clock Gating:** Each GPIO port has its own clock enable bit in the Reset and Clock Control (RCC) AHB2 peripheral clock enable register (\`RCC_AHB2ENR\`). This enables granular power management, allowing unused ports to remain powered down.

#### Core Hardware Execution Logic
At the physical silicon layer, each GPIO pin is backed by a complementary bidirectional circuit containing ESD protection diodes, input/output control circuitry, and configurable pull-up/pull-down resistors:
1. **Input Stage:** Signals from the external pin enter through a Schmitt trigger (which converts analog voltage levels into clean high/low digital states) before being latched into the Input Data Register (\`IDR\`). The Schmitt trigger can be disabled when the pin is in analog mode to save power.
2. **Output Stage:** The Output Data Register (\`ODR\`) or Alternate Function output routes signals to the control logic. The output driver operates via two complementary MOSFETs:
   - **P-MOSFET:** Active when driving a High level (pulling the pin to V_DD).
   - **N-MOSFET:** Active when driving a Low level (pulling the pin to V_SS).
3. **Alternate Function Multiplexer:** A 16-channel multiplexer routes pins to internal peripheral signals (AF0 through AF15), separating standard GPIO control from dedicated peripheral blocks.

### Internal Block Diagram & Signal Routing

The signal routing of an STM32L4Ax GPIO pin is characterized by multiple parallel paths configured via high-density digital switches. The internal block diagram represents how signals transition between the CPU core (AHB2 Bus Interface), internal peripherals, and the physical pin.

[Diagram: STM32L4_GPIO_Internal_Signal_Routing_Matrix]

#### Signal Path Mechanics:
- **Digital Input Path:** External Pin ──► ESD Protection ──► Schmitt Trigger ──► Input Data Register (IDR) ──► AHB2 Bus.
- **Digital Output Path:** AHB2 Bus ──► Output Data Register (ODR) / Bit Set-Reset Register (BSRR) ──► Output Control Logic ──► Complementary P-MOS/N-MOS Drivers ──► Pin.
- **Alternate Function Path:** Peripheral Output (e.g., USART_TX) ──► AF Multiplexer (AFRL/AFRH) ──► Output Logic ──► Pin. Or Pin ──► AF Multiplexer ──► Peripheral Input (e.g., USART_RX).
- **Analog Path:** External Pin ──► Analog Switch Control (ASCR) ──► ADC / DAC / Comparator (bypassing the digital Schmitt trigger and pull-up/down resistors).

### Register-Level Deep Dive

GPIO configuration on the STM32L4Ax is achieved by manipulating 10 memory-mapped registers per port. Each register has a base address offset from the port's primary boundary (e.g., GPIOA Base: \`0x48000000\`).

| Register Name | Address Offset | Type | Description |
| :--- | :--- | :--- | :--- |
| \`GPIOx_MODER\` | \`0x00\` | R/W | GPIO Port Mode Register. Configures pins as Input (00), General Purpose Output (01), Alternate Function (10), or Analog (11). |
| \`GPIOx_OTYPER\` | \`0x04\` | R/W | GPIO Port Output Type Register. Configures pins as Output Push-Pull (0) or Output Open-Drain (1). |
| \`GPIOx_OSPEEDR\` | \`0x08\` | R/W | GPIO Port Output Speed Register. Sets the output slew rate to Low Speed (00), Medium Speed (01), High Speed (10), or Very High Speed (11). |
| \`GPIOx_PUPDR\` | \`0x0C\` | R/W | GPIO Port Pull-Up/Pull-Down Register. Enables No Pull (00), Pull-Up (01), Pull-Down (10), or Reserved (11). |
| \`GPIOx_IDR\` | \`0x10\` | Read-only | GPIO Port Input Data Register. Holds the digital values read from the physical pins. |
| \`GPIOx_ODR\` | \`0x14\` | R/W | GPIO Port Output Data Register. Stores the digital value to be output on the pins. |
| \`GPIOx_BSRR\` | \`0x18\` | Write-only | GPIO Port Bit Set/Reset Register. Allows atomic bitwise setting (bits 0-15) and resetting (bits 16-31) without read-modify-write races. |
| \`GPIOx_LCKR\` | \`0x1C\` | R/W | GPIO Port Configuration Lock Register. Locks the configuration of the pin until the next system reset. |
| \`GPIOx_AFRL\` | \`0x20\` | R/W | GPIO Alternate Function Low Register. Configures alternate function mapping for pins 0-7 (4 bits per pin). |
| \`GPIOx_AFRH\` | \`0x24\` | R/W | GPIO Alternate Function High Register. Configures alternate function mapping for pins 8-15 (4 bits per pin). |
| \`GPIOx_ASCR\` | \`0x2C\` | R/W | GPIO Analog Switch Control Register. Connects pins to ADC input channels. |

#### Critical Bitfield Configurations & Hardware Behavior:

##### 1. Mode Control (\`MODER[2y+1:2y]\`)
For pin y, the two-bit field determines the functional mode:
- **\`00\` (Input Mode):** The output driver is high-impedance (tri-stated). The input Schmitt trigger is enabled, and the register \`IDR\` is updated on every AHB2 clock cycle.
- **\`01\` (Output Mode):** The output driver is active. High or low values written to \`ODR\` or \`BSRR\` are driven onto the pin. The read path to \`IDR\` remains active, allowing self-loopback sensing.
- **\`10\` (Alternate Function Mode):** The pin is disconnected from the standard \`ODR\`/\`IDR\` registers and is directly routed to the specific internal peripheral configured in the \`AFRL\`/\`AFRH\` registers.
- **\`11\` (Analog Mode):** The output buffer is disabled, the input Schmitt trigger is powered down, and internal pull-up/pull-down resistors are disconnected. This is crucial to prevent leakage current when high-impedance analog voltages are applied to ADC/DAC pins.

##### 2. Alternate Function Mapping (\`AFR[4y+3:4y]\`)
To map a pin y to a peripheral alternate function, you must write a 4-bit selector value to the appropriate alternate function register (\`AFRL\` for pins 0-7, \`AFRH\` for pins 8-15):
- \`0000\` (AF0): System (e.g., SWD, JTAG, MCO)
- \`0001\` (AF1): LPTIM1, TIM1/2
- \`0010\` (AF2): TIM3/4/5
- \`0011\` (AF3): TIM8, QuadSPI
- \`0100\` (AF4): I2C1/2/3/4
- \`0101\` (AF5): SPI1/2
- \`0110\` (AF6): SPI3, DFSDM1
- \`0111\` (AF7): USART1/2/3
- \`1000\` (AF8): UART4/5, LPUART1
- \`1001\` (AF9): CAN1, TSC, TIM15/16/17
- \`1010\` (AF10): OTG_FS, QuadSPI, SAI1
- \`1011\` (AF11): LCD, SWPMI1
- \`1100\` (AF12): SDMMC1, FMC
- \`1101\` (AF13): SAI2
- \`1110\` (AF14): TIM2/15/16/LPTIM2
- \`1111\` (AF15): EVENTOUT

### Sequential Hardware Initialization Flow

To configure and enable a GPIO peripheral block on the STM32L4Ax silicon securely, developers must adhere to a strict sequence to prevent race conditions or power state violations:

1. **Enable Peripheral Clock (Clock Gating):**
   Enable the clock for the target GPIO port by writing to the \`RCC_AHB2ENR\` register.
2. **Implement Clock Stabilization Delay (Hardware-forced):**
   Read the enable register or execute a dummy operation to allow the clock to stabilize before accessing the peripheral's register map.
3. **Configure Alternate Function Routing (If applicable):**
   If the pin operates in Alternate Function mode, configure the routing bits in \`GPIOx_AFRL\` or \`GPIOx_AFRH\` before changing the mode. This prevents temporary glitch transitions on the output pin.
4. **Configure Output Physical Speed / Slew Rate:**
   Write to \`GPIOx_OSPEEDR\` to select the slew rate matching the signal frequency.
5. **Configure Output Type:**
   Write to \`GPIOx_OTYPER\` to select between Push-Pull (default for high-speed digital) and Open-Drain (required for shared lines like I2C).
6. **Configure Pull-Up / Pull-Down Resistors:**
   Write to \`GPIOx_PUPDR\` to engage internal weak pull-up (~40 kΩ) or pull-down (~40 kΩ) resistors to avoid floating input states.
7. **Configure Pin Mode:**
   Write to \`GPIOx_MODER\` to set the pin to its final active state (Input, Output, Alternate Function, or Analog).

### Production Pitfalls, Timing Gotchas, and Debugging

When implementing register-level firmware or custom hardware designs using the STM32L4Ax GPIO matrix, embedded systems developers frequently encounter critical silicon constraints.

#### Gotcha 1: RCC Peripheral Clock Enabling Delay
- **The Problem:** Writing to a GPIO configuration register immediately after enabling its peripheral clock in the \`RCC_AHB2ENR\` register causes a hard fault or is completely ignored.
- **The Cause:** The peripheral clock takes up to two clock cycles to stabilize and propagate through the bus synchronizers. The CPU, running at maximum speed, attempts to write to the register before the clock is active.
- **The Solution:** Always insert a short delay or read the enabled clock register back immediately after setting the clock bit. Reading the register back acts as a hardware fence because the CPU must wait for the read bus transaction to complete before executing subsequent writes:
  \`\`\`c
  RCC->AHB2ENR |= RCC_AHB2ENR_GPIOAEN;
  __volatile uint32_t delay = RCC->AHB2ENR; // Read back stabilizes the peripheral bus
  \`\`\`

#### Gotcha 2: High Slew Rate Speed and High-Frequency Noise (EMI)
- **The Problem:** Setting the GPIO output speed register (\`OSPEEDR\`) to "Very High Speed" (\`11\`) on basic signals (like an LED blink or low-frequency SPI) causes severe electromagnetic interference (EMI) and signal reflections/overshoot on PCB traces.
- **The Cause:** High-speed mode decreases the output transistor's transition time (slew rate), which increases high-frequency switching noise. The rapid voltage change (dV/dt) generates transient currents through stray inductances and capacitances.
- **The Solution:** Match the output speed configuration to the signal's physical requirements. Use Low Speed (\`00\`) for standard indicator LEDs and buttons, Medium Speed (\`01\`) for signals under 10 MHz, and High or Very High Speed (\`10\` or \`11\`) only for high-speed protocols (e.g., SDIO, fast SPI, or USB) where fast edge transitions are electrically necessary.`,
    visualType: 'circuit',
    visualDesc: 'Internal Pin Schematic: Open-Drain vs. Push-Pull Output Transistor Configuration',
    code: `/**
 * ******************************************************************************
 * @file    main.c
 * @author  Embedded Systems Architect
 * @brief   Bare-Metal GPIO Configuration & Slew-Rate Tuning for STM32L476RG
 *          Target Hardware: Nucleo-STM32L476RG
 *          Reference Manual: RM0394 (STM32L4Ax)
 * ******************************************************************************
 */

#include "stm32l4xx.h"  // Include core CMSIS register map definitions

/**
 * @brief  Initializes GPIO Port A Pin 5 and Port C Pin 13 using bare-metal registers.
 * @retval None
 */
void GPIO_Init_BareMetal(void) {
    /* 1. ENABLE PERIPHERAL CLOCKS (Power & Clock Gating) */
    // Enable clocks for GPIOA and GPIOC in the AHB2 peripheral clock enable register
    RCC->AHB2ENR |= (RCC_AHB2ENR_GPIOAEN | RCC_AHB2ENR_GPIOCEN);

    /* 2. CLOCK SYNCHRONIZATION DELAY */
    // Reading back the clock register guarantees the clock is enabled and the bus
    // is stable before we write to GPIO registers (requires at least 1 HCLK cycle delay)
    __volatile uint32_t temp = RCC->AHB2ENR;
    (void)temp; // Prevent compiler unused-variable warnings

    /* =======================================================================
     * CONFIGURATION: PORT A, PIN 5 (User LED LD2)
     * Target Profile: General Purpose Output, Push-Pull, Low Speed, No-Pull
     * ======================================================================= */

    /* 3. CONFIGURE MODE */
    // Clear mode bits for pin 5 (Bits 11:10)
    GPIOA->MODER &= ~GPIO_MODER_MODE5_Msk;
    // Set pin 5 to General Purpose Output mode (01)
    GPIOA->MODER |= (0x01UL << GPIO_MODER_MODE5_Pos);

    /* 4. CONFIGURE OUTPUT TYPE */
    // Set PA5 to Push-Pull mode (Write 0 to Bit 5)
    GPIOA->OTYPER &= ~GPIO_OTYPER_OT5_Msk;

    /* 5. CONFIGURE OUTPUT SLEW RATE SPEED */
    // Clear speed bits for pin 5 (Bits 11:10)
    GPIOA->OSPEEDR &= ~GPIO_OSPEEDR_OSPEED5_Msk;
    // Set to Low Speed (00) to minimize Electromagnetic Interference (EMI)
    GPIOA->OSPEEDR |= (0x00UL << GPIO_OSPEEDR_OSPEED5_Pos);

    /* 6. CONFIGURE PULL-UP/PULL-DOWN STATE */
    // Clear pull configuration bits for pin 5 (Bits 11:10)
    GPIOA->PUPDR &= ~GPIO_PUPDR_PUPD5_Msk;
    // Set to No Pull-up/Pull-down (00) as the LED is driven actively by push-pull stage
    GPIOA->PUPDR |= (0x00UL << GPIO_PUPDR_PUPD5_Pos);


    /* =======================================================================
     * CONFIGURATION: PORT C, PIN 13 (User Push Button)
     * Target Profile: Input Mode, Pull-up resistor enabled
     * Note: The Nucleo board has an external pull-up, but enabling internal
     *       pull-up provides redundant noise immunity.
     * ======================================================================= */

    /* 7. CONFIGURE MODE */
    // Clear mode bits for pin 13 (Bits 27:26)
    GPIOC->MODER &= ~GPIO_MODER_MODE13_Msk;
    // Set pin 13 to Digital Input mode (00)
    GPIOC->MODER |= (0x00UL << GPIO_MODER_MODE13_Pos);

    /* 8. CONFIGURE PULL-UP/PULL-DOWN STATE */
    // Clear pull configuration bits for pin 13 (Bits 27:26)
    GPIOC->PUPDR &= ~GPIO_PUPDR_PUPD13_Msk;
    // Set PC13 to Pull-up mode (01) to keep the pin at solid VDD when button is released
    GPIOC->PUPDR |= (0x01UL << GPIO_PUPDR_PUPD13_Pos);
}

int main(void) {
    // Invoke low-level hardware configuration
    GPIO_Init_BareMetal();

    while (1) {
        /*
         * READ INPUT STATE (PC13)
         * The Input Data Register (IDR) holds the electrical state of Port C pins.
         * The blue user button is active-LOW (reads 0 when pressed, 1 when released).
         */
        if ((GPIOC->IDR & GPIO_IDR_ID13_Msk) == 0) {
            // Button is pressed (GND level detected)
            // Atomically SET PA5 to 1 (Turns LED ON) using the Bit Set-Reset Register (BSRR)
            GPIOA->BSRR = GPIO_BSRR_BS5;
        } else {
            // Button is released (VDD level detected)
            // Atomically RESET PA5 to 0 (Turns LED OFF) using the Bit Reset Register (BRR)
            GPIOA->BRR = GPIO_BRR_BR5;
        }
    }
}`
  },
  {
    id: 'dig_out',
    name: 'Digital Output & Delays',
    category: 'gpio',
    summary: 'Drive LEDs, transistors, and external loads using push-pull modes and timing delays.',
    theory: `### Digital Outputs & System Delays
To drive basic components like LEDs or optocouplers, configure pins in **Push-Pull Output** mode.

#### Understanding HAL_Delay():
The \`HAL_Delay()\` function provides millisecond-level precision using the internal **SysTick** timer. SysTick triggers a hardware interrupt once every 1 millisecond. Within this interrupt handler (\`SysTick_Handler()\`), a global tick variable \`uwTick\` is incremented.

\`HAL_Delay()\` blocks execution by polling this variable in a tight \`while\` loop until the specified number of milliseconds has elapsed.

> **Warning**: Never call \`HAL_Delay()\` inside an ISR (Interrupt Service Routine). Since ISRs block higher-priority or equal-priority tasks, calling a blocking delay inside them can freeze your entire operating system.`,
    visualType: 'waveform',
    visualDesc: 'SysTick Timing Waveform: 1kHz Hardware Interrupt increments SysTick Count (uwTick)',
    code: `/*
 * Driving Dual Outputs with SysTick Millisecond Delays
 * PA5 = Nucleo Green LED (LD2)
 * PA6 = Auxiliary output pin
 */
#include "stm32l4xx_hal.h"

void MX_GPIO_Init(void) {
    __HAL_RCC_GPIOA_CLK_ENABLE();
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    GPIO_InitStruct.Pin = GPIO_PIN_5 | GPIO_PIN_6;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}

int main(void) {
    HAL_Init(); // Initializes SysTick Timer at 1ms resolution
    MX_GPIO_Init();
    
    while (1) {
        // High State
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_6, GPIO_PIN_RESET);
        HAL_Delay(100); // 100 milliseconds blocking delay
        
        // Low State
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_6, GPIO_PIN_SET);
        HAL_Delay(900); // 900 milliseconds blocking delay
    }
}`
  },
  {
    id: 'dig_in',
    name: 'Digital Input Reading',
    category: 'gpio',
    summary: 'Read tactile buttons and sensor switch states with internal pull-ups and software debouncing.',
    theory: `### Digital Input Reading & Electrical Debouncing
When reading external switches or tactile buttons, mechanical contacts do not close cleanly; they bounce back and forth rapidly for several milliseconds.

#### Key Input Strategies:
1. **Pull-Up Configuration**: Ensures the input pin floats to a solid VDD (High) state when the button is open. When pressed, the button pulls the pin directly to GND (Low).
2. **Pull-Down Configuration**: Pulls the input pin to GND (Low) when open. Pressing the button connects it to VDD (High).
3. **Software Debouncing**: Wait for a change in pin state, wait 15–30 ms to bypass the mechanical noise, and read the pin again to confirm the state is stable.`,
    visualType: 'waveform',
    visualDesc: 'Mechanical Switch Bouncing: Raw High/Low oscillations vs. Clean Debounced Signal',
    code: `/*
 * Digital Input with Software Debouncing
 * Target: PC13 (User Button, active-LOW) on Nucleo-L476RG
 * Output: PA5 (User LED, active-HIGH)
 */
#include "stm32l4xx_hal.h"

void MX_GPIO_Init(void) {
    __HAL_RCC_GPIOA_CLK_ENABLE();
    __HAL_RCC_GPIOC_CLK_ENABLE();
    
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    // Configure PA5 as output (LD2 LED)
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    
    // Configure PC13 as input with internal Pull-up (Nucleo button has external pulling, but safe)
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}

int main(void) {
    HAL_Init();
    MX_GPIO_Init();
    
    uint8_t last_stable_state = 1;
    
    while (1) {
        uint8_t current_reading = HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13);
        
        // If state changed from last known state, trigger debounce wait
        if (current_reading != last_stable_state) {
            HAL_Delay(25); // Debounce delay
            // Re-read pin to verify state is stable
            if (HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13) == current_reading) {
                last_stable_state = current_reading;
                
                // If button is pressed (PC13 pulls LOW)
                if (last_stable_state == GPIO_PIN_RESET) {
                    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET); // Turn on LED
                } else {
                    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET); // Turn off LED
                }
            }
        }
    }
}`
  },
  {
    id: 'rcc_clock',
    name: 'STM32 RCC (Reset & Clock Control)',
    category: 'gpio',
    summary: 'Master the clock tree architecture, configure PLL, and optimize the system for 80 MHz.',
    theory: `### Reset and Clock Control (RCC) Configuration
To optimize the **STM32L476RG** for performance or battery life, you must master the **Clock Tree**.

#### Clock Sources:
1. **MSI (Multi-Speed Internal)**: Default low-power RC oscillator. Configurable from 100 kHz up to 48 MHz.
2. **HSI16 (High-Speed Internal)**: Stable 16 MHz factory-trimmed internal RC oscillator.
3. **HSE (High-Speed External)**: Highly accurate external crystal oscillator (usually 8 MHz on Nucleo, supplied by ST-Link).
4. **LSE / LSI**: Low-speed oscillators (32.768 kHz) used for the Real-Time Clock (RTC).
5. **PLL (Phase-Locked Loop)**: Multiplies internal or external clock sources up to high speeds (e.g., 80 MHz for L4 series).`,
    visualType: 'register',
    visualDesc: 'STM32L4 Clock Tree Configuration: HSE/HSI -> PLL Multiplexers -> AHB System Clock (80MHz)',
    code: `/*
 * System Clock Configuration for STM32L476RG
 * Configures the system clock to 80 MHz using MSI and PLL
 */
#include "stm32l4xx_hal.h"

void SystemClock_Config(void) {
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

    // Configure the main internal regulator output voltage
    if (HAL_PWREx_ControlVoltageScaling(PWR_REGULATOR_VOLTAGE_SCALE1) != HAL_OK) {
        // Error handling
    }

    // Enable MSI and configure PLL
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_MSI;
    RCC_OscInitStruct.MSIState = RCC_MSI_ON;
    RCC_OscInitStruct.MSICalibrationValue = 0;
    RCC_OscInitStruct.MSIClockRange = RCC_MSIRANGE_6; // 4 MHz default
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_MSI;
    RCC_OscInitStruct.PLL.PLLM = 1;      // Prescaler
    RCC_OscInitStruct.PLL.PLLN = 40;     // Multiplier (4MHz * 40 = 160MHz)
    RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV7;
    RCC_OscInitStruct.PLL.PLLQ = RCC_PLLQ_DIV2;
    RCC_OscInitStruct.PLL.PLLR = RCC_PLLR_DIV2; // Divide VCO clock by 2 (160MHz / 2 = 80MHz System Clock)
    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK) {
        // Error handling
    }

    // Initialize CPU, AHB and APB bus clocks
    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_SYSCLK
                                | RCC_CLOCKTYPE_PCLK1 | RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK; // Select PLL as system clock source
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;        // HCLK = 80 MHz
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;         // APB1 = 80 MHz
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;         // APB2 = 80 MHz

    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_4) != HAL_OK) {
        // Error handling
    }
}

int main(void) {
    HAL_Init();
    SystemClock_Config();
    while (1) {
        // Core operates at 80 MHz
    }
}`
  },
  {
    id: 'debugging',
    name: 'Debugging With ST-Link v2 SWD',
    category: 'gpio',
    summary: 'Utilize Serial Wire Debug (SWD) pins, hardware breakpoints, and real-time variable watch.',
    theory: `### Hardware Debugging via SWD (Serial Wire Debug)
The standard Nucleo-L476RG includes an integrated **ST-Link/V2-1** debugger. It uses the ARM CoreSight **Serial Wire Debug (SWD)** protocol to interface directly with the CPU core.

#### SWD Physical Interface:
- **SWCLK**: Clock line (PA14).
- **SWDIO**: Bidirectional Data line (PA13).
- **NRST**: Hardware system reset line.

#### Advanced Debugging Features:
1. **Breakpoints**: Halts CPU execution at specific code instructions.
2. **Watch Expressions**: Inspects and monitors SRAM variables in real-time.
3. **Live Expressions**: Inspects register states and variables while the CPU is actively running without halting execution.
4. **Call Stack**: Traces the nested chain of function calls leading to a crash or breakpoint.`,
    visualType: 'circuit',
    visualDesc: 'SWD Hardware Interface Pin Mapping: ST-Link Debugger to MCU SWDIO/SWCLK',
    code: `/*
 * Debugging Helper: Dummy registers used to demonstrate watchpoints
 * and compiler optimization guards during real-time SWD debugging.
 */
#include "stm32l4xx_hal.h"

// "volatile" prevents the compiler from optimizing out unused loop counters!
volatile uint32_t debug_counter = 0;
volatile float test_analog_calc = 0.0f;

int main(void) {
    HAL_Init();
    
    while (1) {
        debug_counter++;
        test_analog_calc = (float)debug_counter * 0.123f;
        
        // Place a hardware Breakpoint on the delay line below
        // inside your IDE (double-click the gutter in STM32CubeIDE)
        HAL_Delay(10);
    }
}`
  },
  {
    id: 'serial_print',
    name: 'STM32 Serial Print Debugging',
    category: 'gpio',
    summary: 'Configure UART to redirect standard printf to USB Virtual COM Port.',
    theory: `### Serial Redirection & printf() Overriding
To output text-based telemetry from the **Nucleo-L476RG** to a PC serial monitor (e.g., PuTTY, Tera Term), you must configure **USART2** (connected to the ST-Link Virtual COM Port at pins **PA2 - TX** and **PA3 - RX**) and redirect standard C output stream functions.

#### Redirection mechanism:
Standard C \`printf()\` calls the low-level \`_write()\` function defined in the system library. By overriding \`_write()\`, we redirect all standard output characters to our hardware UART peripheral.`,
    visualType: 'flowchart',
    visualDesc: 'printf() Pipeline: printf() -> standard stdout -> _write() override -> USART2 Transmit register',
    code: `/*
 * Serial Debugging: printf() Overriding
 * UART configuration: 115200 Baud, 8 Data bits, 1 Stop bit, No Parity
 */
#include "stm32l4xx_hal.h"
#include <stdio.h>

UART_HandleTypeDef huart2;

// Override low-level system call _write
int _write(int file, char *ptr, int len) {
    // Send standard out character buffer via USART2 (10ms timeout per byte)
    HAL_UART_Transmit(&huart2, (uint8_t*)ptr, len, HAL_MAX_DELAY);
    return len;
}

void MX_USART2_UART_Init(void) {
    __HAL_RCC_USART2_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    // Configure PA2 as USART2_TX, PA3 as USART2_RX
    GPIO_InitStruct.Pin = GPIO_PIN_2 | GPIO_PIN_3;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF7_USART2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    
    huart2.Instance = USART2;
    huart2.Init.BaudRate = 115200;
    huart2.Init.WordLength = UART_WORDLENGTH_8B;
    huart2.Init.StopBits = UART_STOPBITS_1;
    huart2.Init.Parity = UART_PARITY_NONE;
    huart2.Init.Mode = UART_MODE_TX_RX;
    huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
    HAL_UART_Init(&huart2);
}

int main(void) {
    HAL_Init();
    MX_USART2_UART_Init();
    
    float sensor_val = 24.5f;
    uint32_t iteration = 0;
    
    while (1) {
        // Now you can use standard printf() for easy debugging!
        printf("[MCU LOG] Iteration: %lu | Sensor Temp: %.1f C\\r\\n", iteration++, sensor_val);
        HAL_Delay(1000);
    }
}`
  },
  {
    id: 'interrupts',
    name: 'STM32 Interrupts Tutorial',
    category: 'interrupts_timers',
    summary: 'Master the Nested Vectored Interrupt Controller (NVIC), interrupt priorities, and preemption.',
    theory: `### NVIC and Interrupt Architecture
Interrupts allow real-time hardware events to halt the execution of the main loop and instantly run a dedicated routine called an **Interrupt Service Routine (ISR)**.

#### Nested Vectored Interrupt Controller (NVIC) Features:
1. **Interrupt Vector Table**: Located in Flash memory at address \`0x08000000\`. Contains pointers to the entry address of each peripheral's ISR.
2. **Preemption Priority**: Determines if an interrupt can interrupt (preempt) another active, lower-priority ISR.
3. **Subpriority**: Determines which pending interrupt executes first if multiple interrupts trigger at the exact same time.

> **Rule of Thumb**: Keep ISRs extremely short and efficient. Perform complex math or delays in the background loop by setting flags inside the ISR.`,
    visualType: 'register',
    visualDesc: 'NVIC Grouping Register: High Bits (Preemption Priority) vs. Low Bits (Subpriority)',
    code: `/*
 * Interrupt Controller (NVIC) Setup Pattern
 * Configures Priority Grouping & Peripheral ISR Priorities
 */
#include "stm32l4xx_hal.h"

void Configure_NVIC(void) {
    // Set priority grouping to 4 bits for preemption (0-15), 0 bits for subpriority
    HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_4);
    
    // Set Priority of EXTI15_10 Interrupt (Pins 10-15) to Priority 5, Subpriority 0
    HAL_NVIC_SetPriority(EXTI15_10_IRQn, 5, 0);
    
    // Enable the Interrupt vector line in NVIC
    HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
}

int main(void) {
    HAL_Init();
    Configure_NVIC();
    while(1) {
        // App Core runs
    }
}`
  },
  {
    id: 'exti_pins',
    name: 'External Interrupt Pins',
    category: 'interrupts_timers',
    summary: 'Configure External Interrupt (EXTI) lines to trigger ISRs on rising/falling edge changes.',
    theory: `### External Interrupts (EXTI)
The **EXTI** controller manages external pin interrupts. STM32 multiplexes 16 main EXTI lines across all available GPIO ports:

- **EXTI0** is shared between PA0, PB0, PC0, etc.
- **EXTI13** is shared between PA13, PB13, PC13, etc.

Because these lines are multiplexed, **you cannot configure PA0 and PB0 as separate external interrupts simultaneously**, as they share the same EXTI0 line.

For the **Nucleo-L476RG**, the blue user button is on **PC13**. This button is connected to EXTI line 13.`,
    visualType: 'flowchart',
    visualDesc: 'EXTI Multiplexer Matrix: Port Pins (PA13 - PH13) -> MUX -> EXTI Line 13 -> NVIC',
    code: `/*
 * External Interrupt on Button PC13
 * Targets Nucleo-L476RG Blue User Button (Active-LOW)
 */
#include "stm32l4xx_hal.h"

volatile uint8_t button_pressed_flag = 0;

void MX_GPIO_Init(void) {
    __HAL_RCC_GPIOA_CLK_ENABLE();
    __HAL_RCC_GPIOC_CLK_ENABLE();
    
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    // Configure PA5 as Output (LED)
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    
    // Configure PC13 as EXTI Input with Falling Edge Trigger (active low button release/press)
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
    GPIO_InitStruct.Pull = GPIO_NOPULL; // External pullup present on Nucleo-L476RG
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
    
    // Configure NVIC for EXTI line 13
    HAL_NVIC_SetPriority(EXTI15_10_IRQn, 2, 0); // High priority
    HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
}

// 1. Hardware Entry Point for EXTI Pins 10 to 15 (Triggered by hardware vector)
void EXTI15_10_IRQHandler(void) {
    HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_13); // Clears pending register bits
}

// 2. HAL EXTI Callback - executes user-defined code
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_13) {
        button_pressed_flag = 1; // Set flag to notify main loop
    }
}

int main(void) {
    HAL_Init();
    MX_GPIO_Init();
    
    while (1) {
        if (button_pressed_flag) {
            button_pressed_flag = 0; // Clear flag
            HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5); // Toggle LED
        }
    }
}`
  },
  {
    id: 'timers_tutor',
    name: 'STM32 Timers Tutorial',
    category: 'interrupts_timers',
    summary: 'Analyze the clock sources and internal prescalers of Basic, General Purpose, and Advanced timers.',
    theory: `### Classifying STM32 Hardware Timers
STM32 microcontrollers feature a highly scalable timer architecture categorized into three main tiers:

1. **Basic Timers (TIM6, TIM7)**: 16-bit auto-reload counters with no input/output channels. Primarily used to trigger DAC conversions or basic timebases.
2. **General Purpose Timers (TIM2-TIM5, TIM15-TIM17)**: 16-bit or 32-bit counters with up to 4 independent capture/compare channels. Used for PWM, input capture, and encoder decoding.
3. **Advanced Control Timers (TIM1, TIM8)**: Full-featured timers that support complementary outputs, programmable dead-time insertion, and hardware brake inputs. Ideal for synchronous 3-phase motor control.`,
    visualType: 'table',
    visualDesc: 'Syllabus Comparison: Basic vs. General Purpose vs. Advanced Control Timers',
    code: `/*
 * STM32 Timer Base Handle Definitions
 * Demonstrates the structural differences in timer architectures.
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2; // General Purpose (32-bit)
TIM_HandleTypeDef htim6; // Basic (16-bit)

void Dummy_Timer_Clocks_Enable(void) {
    // Clocks must be enabled from the proper APB bus!
    __HAL_RCC_TIM2_CLK_ENABLE(); // APB1 Bus
    __HAL_RCC_TIM6_CLK_ENABLE(); // APB1 Bus
}`
  },
  {
    id: 'timer_mode_it',
    name: 'Timers: Timer Mode + Interrupt',
    category: 'interrupts_timers',
    summary: 'Configure a timer overflow interrupt to generate highly accurate periodic events.',
    theory: `### Periodic Interrupt Timebases
To execute code at a highly precise periodic interval (e.g., sample an analog sensor at exactly 1 kHz), use a timer in **Timebase mode with Update Interrupts enabled**.

#### Clock Calculations (at 80 MHz System Clock):
$$\\text{Update Frequency} = \\frac{\\text{TIM\\_CLK}}{(\\text{Prescaler} + 1) \\times (\\text{Period} + 1)}$$

To achieve a 1 kHz (1 ms) periodic interrupt when the system clock is 80 MHz:
- **TIM_CLK** = 80,000,000 Hz.
- **Prescaler** = 79 (Divides clock down to 1 MHz: $80,000,000 / 80 = 1,000,000$ Hz).
- **Period (ARR)** = 999 (Counts 1000 ticks: $1,000,000 / 1000 = 1,000$ Hz).`,
    visualType: 'waveform',
    visualDesc: 'Counter Auto-Reload (ARR): Upcounter rolls over at 999, generating an Update Interrupt (UIF)',
    code: `/*
 * 1 kHz Timer Periodic Interrupt (TIM2)
 * Target: Nucleo-L476RG with 80MHz clock config
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;

void MX_TIM2_Init(void) {
    __HAL_RCC_TIM2_CLK_ENABLE();

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 79;                    // 80MHz / (79+1) = 1MHz count clock
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 999;                      // 1MHz / (999+1) = 1000Hz (1ms)
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    htim2.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
    HAL_TIM_Base_Init(&htim2);

    // Configure NVIC to enable TIM2 interrupts
    HAL_NVIC_SetPriority(TIM2_IRQn, 3, 0);
    HAL_NVIC_EnableIRQ(TIM2_IRQn);
}

// Timer 2 Interrupt Handler Vector
void TIM2_IRQHandler(void) {
    HAL_TIM_IRQHandler(&htim2); // Handles and clears pending interrupt flags
}

// HAL Period Elapsed Callback
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim) {
    if (htim->Instance == TIM2) {
        // Toggle PA5 every 1 ms (1kHz frequency / yield a 500Hz square wave)
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    }
}

int main(void) {
    HAL_Init();
    // System clock MUST be configured to 80MHz first for accurate timing
    MX_TIM2_Init();
    
    // Start Timer 2 in Interrupt Mode
    HAL_TIM_Base_Start_IT(&htim2);
    
    while (1) {
        // CPU is free for background tasks!
    }
}`
  },
  {
    id: 'timer_counter',
    name: 'Timers: Counter Mode',
    category: 'interrupts_timers',
    summary: 'Configure an external pin to serve as an asynchronous event counter using TIM ETR input.',
    theory: `### Hardware Counter Mode
STM32 timers can be configured to count external pulses instead of internal clock ticks. In **External Clock Mode 2**, the timer counts rising or falling edges on its **External Trigger Input (ETR)** pin directly.

This is highly efficient because it operates entirely in hardware:
- **No CPU overhead**: No interrupts are triggered for each pulse.
- **High-speed input**: The counter can register signals with frequencies up to 25–40 MHz, depending on the APB bus clock.`,
    visualType: 'flowchart',
    visualDesc: 'External Pulse Counter: External Signal Pin -> ETR Filter -> Timer Prescaler -> Counter Register (CNT)',
    code: `/*
 * Timer External Counter Mode
 * Counts pulses on the TIM2_ETR pin (PA15 on Nucleo-L476RG)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;

void MX_TIM2_Counter_Init(void) {
    __HAL_RCC_TIM2_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // Configure PA15 as TIM2_ETR alternate function input
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_15;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_ClockConfigTypeDef sClockSourceConfig = {0};
    
    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 0;                     // Count every incoming pulse
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 0xFFFFFFFF;               // Maximum ARR value (32-bit counter)
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_Base_Init(&htim2);

    // Configure Timer clock source to External Clock Mode 2 (ETR Pin)
    sClockSourceConfig.ClockSource = TIM_CLOCKSOURCE_ETRMODE2;
    sClockSourceConfig.ClockPolarity = TIM_CLOCKPOLARITY_NONINVERTED; // Count rising edges
    sClockSourceConfig.ClockPrescaler = TIM_CLOCKPRESCALER_DIV1;
    sClockSourceConfig.ClockFilter = 4; // Add simple noise filter
    HAL_TIM_ConfigClockSource(&htim2, &sClockSourceConfig);
}

int main(void) {
    HAL_Init();
    MX_TIM2_Counter_Init();
    
    // Start hardware counter
    HAL_TIM_Base_Start(&htim2);
    
    uint32_t pulse_count = 0;
    
    while (1) {
        // Read current pulse count directly from the counter register
        pulse_count = __HAL_TIM_GET_COUNTER(&htim2);
        HAL_Delay(100);
    }
}`
  },
  {
    id: 'timer_icu',
    name: 'Timers: Input Capture ICU Mode',
    category: 'interrupts_timers',
    summary: 'Measure external signal frequency and pulse width using the Input Capture peripheral.',
    theory: `### Input Capture Unit (ICU)
Input Capture Mode allows you to measure the exact arrival time of an external signal edge on a timer input pin:

1. When the configured edge (rising or falling) occurs on the input pin, the hardware instantly copies the current **Counter register (CNT)** value into the **Capture/Compare register (CCR)**.
2. This action triggers a **Capture Interrupt**, allowing software to read the saved CCR value.
3. By subtracting two consecutive capture values, you can calculate the exact period and frequency of the signal with high precision.

$$\\text{Signal Period (s)} = \\frac{\\Delta \\text{CCR}}{\\text{Timer Clock Frequency (Hz)}}$$`,
    visualType: 'waveform',
    visualDesc: 'Input Capture Event: Input Edge transitions capture CCR1 value, measuring elapsed time ticks',
    code: `/*
 * Input Capture Mode: Frequency Measurement
 * TIM2 Channel 1 connected to PA0 (Alternate Function AF1)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;
volatile uint32_t first_capture = 0;
volatile uint32_t second_capture = 0;
volatile uint8_t is_first_captured = 0;
volatile uint32_t raw_period = 0;

void MX_TIM2_IC_Init(void) {
    __HAL_RCC_TIM2_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_0;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_IC_InitTypeDef sConfigIC = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 79;                    // 1MHz timer clock (80MHz / 80)
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 0xFFFFFFFF;               // Maximum ARR
    HAL_TIM_IC_Init(&htim2);

    // Configure Input Capture Channel 1
    sConfigIC.ICPolarity = TIM_INPUTCHANNELPOLARITY_RISING; // Capture on rising edge
    sConfigIC.ICSelection = TIM_ICSELECTION_DIRECTTI;       // Connect directly to TI1
    sConfigIC.ICPrescaler = TIM_ICPSC_DIV1;
    sConfigIC.ICFilter = 8;                                 // Simple input filter
    HAL_TIM_IC_ConfigChannel(&htim2, &sConfigIC, TIM_CHANNEL_1);

    // Enable NVIC interrupts for TIM2
    HAL_NVIC_SetPriority(TIM2_IRQn, 2, 0);
    HAL_NVIC_EnableIRQ(TIM2_IRQn);
}

void TIM2_IRQHandler(void) {
    HAL_TIM_IRQHandler(&htim2);
}

// Input Capture Complete Callback
void HAL_TIM_IC_CaptureCallback(TIM_HandleTypeDef *htim) {
    if (htim->Instance == TIM2 && htim->Channel == HAL_TIM_ACTIVE_CHANNEL_1) {
        if (!is_first_captured) {
            first_capture = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);
            is_first_captured = 1;
        } else {
            second_capture = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);
            
            // Handle timer roll-over (overflow)
            if (second_capture >= first_capture) {
                raw_period = second_capture - first_capture;
            } else {
                raw_period = (0xFFFFFFFF - first_capture) + second_capture;
            }
            
            is_first_captured = 0; // Reset state for next calculation
        }
    }
}

int main(void) {
    HAL_Init();
    MX_TIM2_IC_Init();
    
    // Start input capture in interrupt mode
    HAL_TIM_IC_Start_IT(&htim2, TIM_CHANNEL_1);
    
    while (1) {
        if (raw_period > 0) {
            // Signal period in microseconds (Timer runs at 1 MHz clock)
            uint32_t signal_period_us = raw_period;
            uint32_t signal_freq_hz = 1000000 / signal_period_us;
            (void)signal_freq_hz; // Used during real-time watch debug
        }
    }
}`
  },
  {
    id: 'timer_encoder',
    name: 'Timers: Encoder Mode',
    category: 'interrupts_timers',
    summary: 'Decode optical or magnetic rotary encoders in hardware using Phase A & B signals.',
    theory: `### Hardware Quadrature Encoder Decoding
Rotary encoders output two square waves shifted by 90°: **Phase A (TI1)** and **Phase B (TI2)**.

By monitoring the relative phase of these signals, we determine the direction of rotation:
- If Phase A leads Phase B, the encoder is turning clockwise.
- If Phase B leads Phase A, the encoder is turning counterclockwise.

STM32 general-purpose timers include dedicated hardware **Quadrature Encoder Interface (QEI)** decoders. The hardware reads the rising and falling edges of both signals (4x resolution mode) and increments or decrements the counter register (CNT) automatically, without any CPU intervention.`,
    visualType: 'waveform',
    visualDesc: 'Quadrature Phase States: Phase A leading Phase B (CW) vs Phase B leading Phase A (CCW)',
    code: `/*
 * Hardware Encoder Decoder Mode Setup
 * Inputs: PA0 (TIM2_CH1) and PA1 (TIM2_CH2) - Nucleo-L476RG AF1
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;

void MX_TIM2_Encoder_Init(void) {
    __HAL_RCC_TIM2_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // Configure PA0 and PA1 as TIM2 alternative inputs (AF1)
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_1;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_PULLUP; // Encoders require defined pullups
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_Encoder_InitTypeDef sEncoderConfig = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 0;
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 65535; // 16-bit rollover range
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;

    // Decode on both Channel 1 and Channel 2 edges (4x resolution mode)
    sEncoderConfig.EncoderMode = TIM_ENCODERMODE_TI12;
    sEncoderConfig.IC1Polarity = TIM_ICPOLARITY_RISING;
    sEncoderConfig.IC1Selection = TIM_ICSELECTION_DIRECTTI;
    sEncoderConfig.IC1Prescaler = TIM_ICPSC_DIV1;
    sEncoderConfig.IC1Filter = 10; // Digital noise filter
    
    sEncoderConfig.IC2Polarity = TIM_ICPOLARITY_RISING;
    sEncoderConfig.IC2Selection = TIM_ICSELECTION_DIRECTTI;
    sEncoderConfig.IC2Prescaler = TIM_ICPSC_DIV1;
    sEncoderConfig.IC2Filter = 10;
    
    HAL_TIM_Encoder_Init(&htim2, &sEncoderConfig);
}

int main(void) {
    HAL_Init();
    MX_TIM2_Encoder_Init();
    
    // Start encoder decoding
    HAL_TIM_Encoder_Start(&htim2, TIM_CHANNEL_ALL);
    
    int16_t encoder_pulses = 0;
    
    while (1) {
        // Read 16-bit signed counter value representing position
        encoder_pulses = (int16_t)__HAL_TIM_GET_COUNTER(&htim2);
        HAL_Delay(50);
    }
}`
  },
  {
    id: 'pwm_output',
    name: 'STM32 PWM Output Tutorial',
    category: 'pwm',
    summary: 'Configure PWM output pins to control LEDs, buzzers, and motor driver modules.',
    theory: `### Pulse Width Modulation (PWM) Output
**Pulse Width Modulation (PWM)** is a technique used to generate analog-like voltages from a digital pin by varying the ratio of "ON" time to "OFF" time.

#### Key Parameters:
1. **Duty Cycle**: The percentage of a period during which the signal remains active (High).
2. **Pulse Value (CCR)**: The register value compared against the timer counter (CNT) to trigger state transitions on the output pin.
3. **PWM Mode 1**: The channel output is active (High) as long as the counter value (CNT) is less than the compare register value (CCR). It becomes inactive (Low) once CNT exceeds CCR.

$$\\text{Duty Cycle (\\%)} = \\frac{\\text{CCR}}{\\text{ARR}} \\times 100$$`,
    visualType: 'waveform',
    visualDesc: 'PWM Duty Waveform: Comparative CNT vs CCR matches determine High/Low durations',
    code: `/*
 * PWM Signal Generation
 * Output: PA0 (TIM2 Channel 1, AF1) - Nucleo-L476RG
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;

void MX_TIM2_PWM_Init(void) {
    __HAL_RCC_TIM2_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // Configure PA0 as alternate function output (AF1)
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_0;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_OC_InitTypeDef sConfigOC = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 79;                    // 1MHz counts clock (80MHz / 80)
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 999;                      // ARR = 999 yields a 1 kHz PWM signal
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_PWM_Init(&htim2);

    // Configure PWM Channel 1 Parameter Config
    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 499;                        // CCR = 499 (50% Duty Cycle)
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
    HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_1);
}

int main(void) {
    HAL_Init();
    MX_TIM2_PWM_Init();
    
    // Start PWM output on Channel 1
    HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);
    
    while (1) {
        // Smoothly fade LED / output from 10% to 90% duty cycle
        for (uint16_t duty = 100; duty < 900; duty += 10) {
            __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, duty);
            HAL_Delay(10);
        }
        for (uint16_t duty = 900; duty > 100; duty -= 10) {
            __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, duty);
            HAL_Delay(10);
        }
    }
}`
  },
  {
    id: 'pwm_freq_res',
    name: 'PWM Frequency & Resolution',
    category: 'pwm',
    summary: 'Balance carrier frequencies and step resolution for high-performance drivers.',
    theory: `### The PWM Tradeoff: Frequency vs. Resolution
To achieve smooth motor control or high-efficiency LED dimming, you must design proper **PWM Carrier Frequencies** and **Step Resolutions**.

#### Resolution Formula (in bits):
$$\\text{Resolution (bits)} = \\log_2(\\text{ARR} + 1)$$

#### High-Frequency Constraints:
- To generate a high-frequency carrier (e.g., $100\\text{ kHz}$ to drive a miniature motor), the counter's **Auto-Reload Register (ARR)** must be relatively small.
- If ARR is small, there are fewer steps between 0% and 100% duty cycle, which **reduces the control resolution**.
- Conversely, a lower-frequency carrier (e.g., $50\\text{ Hz}$ to drive a standard servo) allows for a larger ARR value, which **increases the control resolution (up to 16 bits)**.`,
    visualType: 'table',
    visualDesc: 'Resolution vs. Frequency Matrix (at 80 MHz APB Timer Bus)',
    code: `/*
 * High Resolution vs High Frequency setups
 * Board: Nucleo-L476RG (80MHz system clock)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;

// CASE A: High Resolution (50Hz PWM for Servo, Timer clock @ 1MHz, ARR = 20000, ~14.3 bits resolution)
void Setup_PWM_High_Resolution(void) {
    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 79;                    // 1MHz count clock
    htim2.Init.Period = 19999;                    // 50Hz PWM frequency
    HAL_TIM_PWM_Init(&htim2);
}

// CASE B: High Frequency (200kHz PWM for SMPS, Timer clock @ 80MHz, ARR = 400, ~8.6 bits resolution)
void Setup_PWM_High_Frequency(void) {
    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 0;                     // 80MHz count clock
    htim2.Init.Period = 399;                      // 200kHz PWM frequency
    HAL_TIM_PWM_Init(&htim2);
}

int main(void) {
    HAL_Init();
    // System Initialization code...
    while (1) {}
}`
  },
  {
    id: 'pwm_input',
    name: 'STM32 PWM Input Mode',
    category: 'pwm',
    summary: 'Configure dual timer input capture channels to measure period and duty cycle in hardware.',
    theory: `### PWM Input Mode (Hardware Duty-Cycle Capture)
The **PWM Input Mode** is a specialized configuration of Input Capture that uses **two capture channels mapped to a single input pin**:

1. **Primary Channel (e.g., TI1)**: Captures on rising edges to measure the total **Period** of the signal.
2. **Secondary Channel (e.g., TI2)**: Captures on falling edges to measure the **Active Pulse Width** (high time).
3. **Hardware Reset**: The timer's counter register (CNT) is reset to zero automatically on each rising edge. This allows you to read both the period and the active pulse width directly from the capture registers on the next cycle, without any CPU overhead.

$$\\text{Duty Cycle (\\%)} = \\frac{\\text{CCR2}}{\\text{CCR1}} \\times 100$$`,
    visualType: 'waveform',
    visualDesc: 'PWM Input Capture Timing: Rising edge captures Period (CCR1) & resets CNT, Falling edge captures Pulse (CCR2)',
    code: `/*
 * PWM Input Capture Mode Configuration
 * Input: PA0 (TIM2 Channel 1 input, AF1)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim2;
volatile uint32_t last_period = 0;
volatile uint32_t last_pulse = 0;

void MX_TIM2_PWM_Input_Init(void) {
    __HAL_RCC_TIM2_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    // Configure PA0 as alternate function input
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_0;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM2;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_SlaveConfigTypeDef sSlaveConfig = {0};
    TIM_IC_InitTypeDef sConfigIC = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 79;                    // 1MHz count clock (80MHz / 80)
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 0xFFFF;                   // 16-bit range
    HAL_TIM_IC_Init(&htim2);

    // 1. Configure Channel 1 to capture Rising edges (measures Period)
    sConfigIC.ICPolarity = TIM_INPUTCHANNELPOLARITY_RISING;
    sConfigIC.ICSelection = TIM_ICSELECTION_DIRECTTI;
    sConfigIC.ICPrescaler = TIM_ICPSC_DIV1;
    sConfigIC.ICFilter = 4;
    HAL_TIM_IC_ConfigChannel(&htim2, &sConfigIC, TIM_CHANNEL_1);

    // 2. Configure Channel 2 to capture Falling edges (measures active Pulse Width)
    sConfigIC.ICPolarity = TIM_INPUTCHANNELPOLARITY_FALLING;
    sConfigIC.ICSelection = TIM_ICSELECTION_INDIRECTTI; // Route channel to TI1 pin
    HAL_TIM_IC_ConfigChannel(&htim2, &sConfigIC, TIM_CHANNEL_2);

    // 3. Configure Slave Mode to reset counter automatically on TI1 rising edges
    sSlaveConfig.SlaveMode = TIM_SLAVEMODE_RESET;
    sSlaveConfig.InputTrigger = TIM_TS_TI1FP1;
    sSlaveConfig.TriggerPolarity = TIM_TRIGGERPOLARITY_NONINVERTED;
    sSlaveConfig.TriggerFilter = 4;
    HAL_TIM_SlaveConfigSynchro(&htim2, &sSlaveConfig);

    // Enable NVIC interrupts for TIM2
    HAL_NVIC_SetPriority(TIM2_IRQn, 2, 0);
    HAL_NVIC_EnableIRQ(TIM2_IRQn);
}

void TIM2_IRQHandler(void) {
    HAL_TIM_IRQHandler(&htim2);
}

void HAL_TIM_IC_CaptureCallback(TIM_HandleTypeDef *htim) {
    if (htim->Instance == TIM2 && htim->Channel == HAL_TIM_ACTIVE_CHANNEL_1) {
        // Read Period from Channel 1 and Pulse Width from Channel 2
        last_period = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);
        last_pulse = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_2);
    }
}

int main(void) {
    HAL_Init();
    MX_TIM2_PWM_Input_Init();
    
    // Start input capture on both channels
    HAL_TIM_IC_Start_IT(&htim2, TIM_CHANNEL_1);
    HAL_TIM_IC_Start(&htim2, TIM_CHANNEL_2);
    
    while (1) {
        if (last_period > 0) {
            uint32_t duty_cycle_pct = (last_pulse * 100) / last_period;
            uint32_t frequency_hz = 1000000 / last_period;
            (void)duty_cycle_pct; // Inspect during SWD Debugging
            (void)frequency_hz;
        }
    }
}`
  },
  {
    id: 'pwm_deadtime',
    name: 'Complementary PWM & Dead-Time',
    category: 'pwm',
    summary: 'Learn to drive H-Bridge switching circuits safely using hardware dead-time insertion.',
    theory: `### Direct Complementary PWM with Dead-Time Insertion
When driving an **H-Bridge** or synchronous half-bridge converter, you must use two complementary PWM signals to switch a high-side and low-side transistor alternately:

- **TIM1_CH1**: Primary channel.
- **TIM1_CH1N**: Complementary output channel.

#### The Hazard: Shoot-Through
Mechanical and electrical switching delays mean that transistors take several nanoseconds to turn off completely. If the high-side transistor turns on before the low-side has finished turning off, it creates a direct short-circuit between the supply rail and ground. This is called **shoot-through**, and it can destroy the transistors.

#### The Solution: Dead-Time
To prevent shoot-through, advanced timers (like **TIM1**) include dedicated hardware **Dead-Time Generators**. This hardware delays the turn-on edge of both signals, ensuring that there is a brief period when both transistors are completely off.`,
    visualType: 'waveform',
    visualDesc: 'Dead-Time Insertion Waveform: Active-high delays prevent overlapping on-states',
    code: `/*
 * Complementary PWM with Hardware Dead-time
 * Timer: TIM1 (Advanced Timer)
 * Outputs: PA8 (TIM1_CH1) & PA7 (TIM1_CH1N) - Nucleo-L476RG AF1
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim1;

void MX_TIM1_Complementary_Init(void) {
    __HAL_RCC_TIM1_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();
    
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    // Configure PA8 (CH1) and PA7 (CH1N) as TIM1 alternate outputs
    GPIO_InitStruct.Pin = GPIO_PIN_8 | GPIO_PIN_7;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM1;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_OC_InitTypeDef sConfigOC = {0};
    TIM_BreakDeadTimeConfigTypeDef sBreakDeadTimeConfig = {0};

    htim1.Instance = TIM1;
    htim1.Init.Prescaler = 0;                     // Runs at max APB2 clock (80MHz)
    htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim1.Init.Period = 799;                      // 80MHz / (799+1) = 100 kHz carrier
    htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    htim1.Init.RepetitionCounter = 0;
    HAL_TIM_PWM_Init(&htim1);

    // Channel 1 PWM parameters
    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 399;                        // 50% initial duty cycle
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    sConfigOC.OCNPolarity = TIM_OCNPOLARITY_HIGH;
    sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
    sConfigOC.OCIdleState = TIM_OCIDLESTATE_RESET;
    sConfigOC.OCNIdleState = TIM_OCNIDLESTATE_RESET;
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_1);

    // Dead-Time Generator configuration
    sBreakDeadTimeConfig.OffStateRunMode = TIM_OSSR_DISABLE;
    sBreakDeadTimeConfig.OffStateIDLEMode = TIM_OSSI_DISABLE;
    sBreakDeadTimeConfig.LockLevel = TIM_LOCKLEVEL_OFF;
    // Dead-Time value in clock cycles:
    // DTG[7:0] = 80 yields a ~1 microsecond delay at 80 MHz
    sBreakDeadTimeConfig.DeadTime = 80;           
    sBreakDeadTimeConfig.BreakState = TIM_BREAK_DISABLE;
    sBreakDeadTimeConfig.AutomaticOutput = TIM_AUTOMATICOUTPUT_DISABLE;
    HAL_TIMEx_ConfigBreakDeadTime(&htim1, &sBreakDeadTimeConfig);
}

int main(void) {
    HAL_Init();
    MX_TIM1_Complementary_Init();
    
    // Start complementary PWM outputs
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
    HAL_TIMEx_P_N_Start(&htim1, TIM_CHANNEL_1); // Start complementary output
    
    while (1) {}
}`
  },
  {
    id: 'pwm_3phase_center',
    name: '3-Phase PWM (Center-Aligned)',
    category: 'pwm',
    summary: 'Generate center-aligned PWM signals for ultra-smooth Brushless DC (BLDC) motor control.',
    theory: `### Center-Aligned PWM for Motor Control
In **Center-Aligned Mode**, the timer's counter counts alternately up and down, rather than rolling over to zero. This changes how the PWM signals are generated:

- The counter counts from 0 up to the **Auto-Reload (ARR)** limit, then counts back down to 0.
- Compare matches (CCR) occur twice per carrier period: once during the upcount phase and once during the downcount phase.
- This configuration generates a symmetric PWM output, which significantly **reduces harmonic distortion and high-frequency noise** when driving brushless DC (BLDC) or permanent magnet synchronous (PMSM) motors.`,
    visualType: 'waveform',
    visualDesc: 'Center-Aligned Up/Down Counting: Output transitions are symmetric around the peak',
    code: `/*
 * 3-Phase Center-Aligned PWM Generation
 * Timer: TIM1 (Advanced Timer)
 * Outputs: CH1 (PA8), CH2 (PA9), CH3 (PA10)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim1;

void MX_TIM1_3Phase_Center_Init(void) {
    __HAL_RCC_TIM1_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();

    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_8 | GPIO_PIN_9 | GPIO_PIN_10;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM1;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_OC_InitTypeDef sConfigOC = {0};

    htim1.Instance = TIM1;
    htim1.Init.Prescaler = 0;
    // Set Center-Aligned Mode 1 (Compare matches occur on downcounts only)
    htim1.Init.CounterMode = TIM_COUNTERMODE_CENTERALIGNED1;
    htim1.Init.Period = 1999;                     // 80MHz / (2 * 2000) = 20 kHz carrier frequency
    htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_PWM_Init(&htim1);

    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 1000;                       // 50% default duty cycle
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    sConfigOC.OCNPolarity = TIM_OCNPOLARITY_HIGH;
    sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;

    // Configure Channels 1, 2, and 3
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_1);
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_2);
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_3);
}

int main(void) {
    HAL_Init();
    MX_TIM1_3Phase_Center_Init();
    
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_2);
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_3);
    
    while (1) {
        // Dynamically adjust phase duty cycles to drive a 3-phase motor
        __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, 500);  // Phase A
        __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_2, 1000); // Phase B
        __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_3, 1500); // Phase C
        HAL_Delay(10);
    }
}`
  },
  {
    id: 'pwm_3phase_edge',
    name: '3-Phase PWM (Edge-Aligned)',
    category: 'pwm',
    summary: 'Configure high-efficiency edge-aligned PWM signals for low-cost switching converters.',
    theory: `### Edge-Aligned PWM
In **Edge-Aligned Mode**, the timer's counter counts from 0 up to the **Auto-Reload (ARR)** limit, then resets to 0 instantly:

- Output compare matches occur only once per carrier period.
- Output signals transition at the compare match (CCR) during the upcount, and reset to their default state when the counter overflows.
- While center-aligned PWM is preferred for complex motor control, **edge-aligned PWM is simpler to configure and more efficient** for driving low-cost switching converters, solenoids, or simple DC motors.`,
    visualType: 'waveform',
    visualDesc: 'Edge-Aligned Up Counting: Output transitions are aligned to the start of the period',
    code: `/*
 * 3-Phase Edge-Aligned PWM Generation
 * Timer: TIM1 (Advanced Timer)
 * Outputs: CH1 (PA8), CH2 (PA9), CH3 (PA10)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim1;

void MX_TIM1_3Phase_Edge_Init(void) {
    __HAL_RCC_TIM1_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();

    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_8 | GPIO_PIN_9 | GPIO_PIN_10;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM1;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    TIM_OC_InitTypeDef sConfigOC = {0};

    htim1.Instance = TIM1;
    htim1.Init.Prescaler = 0;
    // Set standard Edge-Aligned Upcounting Mode
    htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim1.Init.Period = 3999;                     // 80MHz / (3999 + 1) = 20 kHz carrier frequency
    htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_PWM_Init(&htim1);

    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 2000;                       // 50% default duty cycle
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;

    // Configure Channels 1, 2, and 3
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_1);
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_2);
    HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_3);
}

int main(void) {
    HAL_Init();
    MX_TIM1_3Phase_Edge_Init();
    
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_2);
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_3);
    
    while (1) {}
}`
  },
  {
    id: 'pwm_sync',
    name: 'PWM Phase Shift (Timer Sync)',
    category: 'pwm',
    summary: 'Synchronize multiple timers to create precise phase-shifted PWM outputs.',
    theory: `### Master/Slave Timer Synchronization
To drive complex switching circuits like interleaved buck-boost converters or multi-phase motors, you must generate PWM signals with a specific **Phase Shift**.

This requires synchronizing a **Master Timer** and a **Slave Timer**:
1. Configure the master timer to output a **Trigger Output (TRGO)** signal when it resets or overflows.
2. Configure the slave timer to run in **Trigger Mode**, using the master's TRGO signal as its clock input or reset sync.
3. By setting a default offset in the slave timer's counter register (CNT) on startup, we can shift its PWM output relative to the master timer's output by a precise phase angle (e.g., $90^\\circ$ or $180^\\circ$).`,
    visualType: 'flowchart',
    visualDesc: 'Timer Synchronization Layout: TIM1 (Master TRGO) -> Trigger Line -> TIM2 (Slave Trigger Input)',
    code: `/*
 * PWM Phase-Shift Synchronization
 * TIM1: Master Timer, TIM2: Slave Timer (180-degree Phase Shift)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim1; // Master
TIM_HandleTypeDef htim2; // Slave

void MX_Timer_Sync_Init(void) {
    __HAL_RCC_TIM1_CLK_ENABLE();
    __HAL_RCC_TIM2_CLK_ENABLE();

    TIM_MasterConfigTypeDef sMasterConfig = {0};
    TIM_SlaveConfigTypeDef sSlaveConfig = {0};

    // 1. Initialize TIM1 as Master
    htim1.Instance = TIM1;
    htim1.Init.Prescaler = 79;                    // 1MHz counts clock
    htim1.Init.Period = 999;                      // 1 kHz carrier frequency
    HAL_TIM_PWM_Init(&htim1);

    // Configure TIM1 to trigger output on Update events
    sMasterConfig.MasterOutputTrigger = TIM_TRGO_UPDATE;
    sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_ENABLE;
    HAL_TIMEx_ConfigOBUser(&htim1, &sMasterConfig);

    // 2. Initialize TIM2 as Slave
    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 79;                    // 1MHz counts clock
    htim2.Init.Period = 999;                      // 1 kHz carrier frequency
    HAL_TIM_PWM_Init(&htim2);

    // Configure TIM2 to trigger and reset its counter on TIM1's TRGO trigger
    sSlaveConfig.SlaveMode = TIM_SLAVEMODE_TRIGGER;
    sSlaveConfig.InputTrigger = TIM_TS_ITR0;      // Internal Trigger 0 maps TIM1 to TIM2
    HAL_TIM_SlaveConfigSynchro(&htim2, &sSlaveConfig);
    
    // Set an initial offset of 500 counts to shift the phase by exactly 180 degrees
    __HAL_TIM_SET_COUNTER(&htim2, 500);
}

int main(void) {
    HAL_Init();
    MX_Timer_Sync_Init();
    
    // Start master and slave timers in PWM mode
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
    HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);
    
    while (1) {}
}`
  },
  {
    id: 'pwm_break',
    name: 'PWM Break Input (Shutdown)',
    category: 'pwm',
    summary: 'Configure the hardware Break Input pin to shut down PWM signals instantly in an overcurrent event.',
    theory: `### Hardware Emergency Shutdown (Break Input)
When driving powerful motor drivers, a firmware lockup or delayed overcurrent response can destroy the drive electronics.

To protect the system, advanced timers (like **TIM1**) include a dedicated hardware **Break Input (TIM1_BKIN)** pin:
- The overcurrent comparator or emergency stop button is wired directly to the BKIN pin.
- When an active signal is detected on the BKIN pin, the timer's hardware **instantly forces all PWM output channels to a safe, predefined state (e.g., completely Off)**.
- This shutdown occurs **entirely in hardware**, completely bypassing the CPU and any active firmware instructions. This ensures a response time of just a few nanoseconds, protecting the system even during a total firmware crash.`,
    visualType: 'circuit',
    visualDesc: 'Emergency Shutdown Circuitry: BKIN hardware override forces safe PWM output states instantly',
    code: `/*
 * Emergency PWM Break Input Configuration
 * Timer: TIM1 (Advanced Timer)
 * Outputs: PA8 (TIM1_CH1)
 * Break Input: PB12 (TIM1_BKIN, Alternate Function AF1)
 */
#include "stm32l4xx_hal.h"

TIM_HandleTypeDef htim1;

void MX_TIM1_Break_Init(void) {
    __HAL_RCC_TIM1_CLK_ENABLE();
    __HAL_RCC_GPIOB_CLK_ENABLE();

    // Configure PB12 as BKIN Pin (AF1)
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_12;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_PULLDOWN;         // Active high emergency stop signal
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF1_TIM1;
    HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

    TIM_BreakDeadTimeConfigTypeDef sBreakDeadTimeConfig = {0};

    htim1.Instance = TIM1;
    htim1.Init.Prescaler = 79;
    htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim1.Init.Period = 999;
    HAL_TIM_PWM_Init(&htim1);

    // Configure Brake parameters
    sBreakDeadTimeConfig.BreakState = TIM_BREAK_ENABLE;               // Enable break input
    sBreakDeadTimeConfig.BreakPolarity = TIM_BREAKPOLARITY_HIGH;      // Trigger on rising edge
    sBreakDeadTimeConfig.BreakFilter = 5;                             // Ignore brief noise spikes
    sBreakDeadTimeConfig.AutomaticOutput = TIM_AUTOMATICOUTPUT_DISABLE; // Require manual software reset
    
    HAL_TIMEx_ConfigBreakDeadTime(&htim1, &sBreakDeadTimeConfig);
}

int main(void) {
    HAL_Init();
    MX_TIM1_Break_Init();
    HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
    
    while (1) {
        // If the emergency button is pressed, the PA8 output is instantly disabled by hardware
    }
}`
  },
  {
    id: 'delay_dwt',
    name: 'STM32 delay_us (DWT + Timer)',
    category: 'timing',
    summary: 'Implement highly accurate microsecond delays using the Cortex-M Data Watchpoint and Trace (DWT) peripheral.',
    theory: `### Microsecond Delays using the DWT Peripheral
The standard \`HAL_Delay()\` function only provides millisecond-level precision. To implement microsecond-level delays (e.g., to drive precise single-wire sensors like the DHT22), we need a higher-resolution timebase.

The **Data Watchpoint and Trace (DWT)** unit is an internal diagnostic peripheral inside the ARM Cortex-M4 core:
- The DWT includes a 32-bit cycle counter (**CYCCNT**) that increments on every single CPU clock cycle.
- At an 80 MHz system clock, the counter increments once every 12.5 nanoseconds, providing incredibly high resolution.
- Because it is built directly into the CPU core, reading the counter takes just a single clock cycle, making it ideal for implementing highly accurate, non-blocking microsecond delays.`,
    visualType: 'register',
    visualDesc: 'Cortex-M4 DWT Register Setup: Core Clock -> DWT Core Cycle Counter (CYCCNT)',
    code: `/*
 * High-Precision Microsecond Delay using DWT Cycle Counter
 * Target: STM32L476RG @ 80 MHz Core Clock
 */
#include "stm32l4xx_hal.h"

// Initialize the DWT Cycle Counter
void DWT_Delay_Init(void) {
    // 1. Enable the Trace/Debug block (DEMCR register)
    CoreDebug->DEMCR |= CoreDebug_DEMCR_TRCENA_Msk;
    
    // 2. Unlock access to the DWT registers (LAR register)
    DWT->LAR = 0xC5ACCE55; 
    
    // 3. Reset and clear the cycle counter
    DWT->CYCCNT = 0;
    
    // 4. Start the cycle counter (CONTROL register)
    DWT->CTRL |= DWT_CTRL_CYCCNTENA_Msk;
}

// Microsecond delay function
void delay_us(uint32_t microseconds) {
    // Calculate the number of CPU cycles needed for the delay
    uint32_t start_cycles = DWT->CYCCNT;
    uint32_t delay_cycles = microseconds * (SystemCoreClock / 1000000);

    // Wait until the cycle counter has advanced by the required cycles
    while ((DWT->CYCCNT - start_cycles) < delay_cycles);
}

int main(void) {
    HAL_Init();
    DWT_Delay_Init();
    
    __HAL_RCC_GPIOA_CLK_ENABLE();
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    while (1) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        delay_us(10); // Toggle pin state every 10 microseconds
    }
}`
  },
  {
    id: 'delay_systick',
    name: 'STM32 delay_us (SysTick Timer)',
    category: 'timing',
    summary: 'Generate microsecond delays by down-sampling the standard ARM SysTick counter.',
    theory: `### Microsecond Delays using the SysTick Timer
If the DWT peripheral is already being used for debugging or is disabled to save power, you can implement microsecond delays using the **ARM SysTick** hardware timer:

- By default, SysTick is configured to decrement from its reload value down to zero once every millisecond.
- However, we can read the current value of the **VAL (Current Value)** register directly at any time.
- By calculating how many ticks the SysTick counter decrements per microsecond, we can implement accurate microsecond-level delays.

$$\\text{Ticks per microsecond} = \\frac{\\text{SystemCoreClock}}{1\\text{ MHz}}$$

For an 80 MHz system clock, SysTick decrements 80 times per microsecond.`,
    visualType: 'waveform',
    visualDesc: 'SysTick Decrementing Valley: VAL register drops from LOAD to 0 at 80 ticks/us resolution',
    code: `/*
 * High-Precision Microsecond Delay using SysTick VAL register
 * Target: STM32L476RG @ 80 MHz Clock configuration
 */
#include "stm32l4xx_hal.h"

void delay_us_systick(uint32_t microseconds) {
    // Calculate the number of ticks needed for the delay
    uint32_t ticks = microseconds * (SystemCoreClock / 1000000);
    uint32_t start_val = SysTick->VAL;
    uint32_t elapsed_ticks = 0;
    uint32_t last_val = start_val;

    while (elapsed_ticks < ticks) {
        uint32_t current_val = SysTick->VAL;
        
        // Handle wrap-around (SysTick counts downwards from LOAD to 0)
        if (current_val < last_val) {
            elapsed_ticks += (last_val - current_val);
        } else {
            elapsed_ticks += (last_val + (SysTick->LOAD - current_val));
        }
        last_val = current_val;
    }
}

int main(void) {
    HAL_Init();
    
    __HAL_RCC_GPIOA_CLK_ENABLE();
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    while (1) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        delay_us_systick(100); // Toggle pin state every 100 microseconds
    }
}`
  },
  {
    id: 'ecual_drivers',
    name: 'ECUAL Drivers Integration',
    category: 'timing',
    summary: 'Structure modular software drivers separating MCAL hardware from ECUAL board-level layers.',
    theory: `### Modular Driver Architecture (MCAL vs. ECUAL)
To build professional, maintainable firmware, you should separate your code into distinct hardware abstraction layers:

1. **MCAL (Microcontroller Abstraction Layer)**: Contains direct, MCU-specific drivers for internal peripherals (e.g., GPIO, I2C, SPI). This layer uses HAL or bare-metal registers and is highly dependent on the specific chip.
2. **ECUAL (Electronic Control Unit Abstraction Layer)**: Contains board-level drivers for external components (e.g., LCD displays, sensors, EEPROMs) that use the MCAL drivers to communicate. This layer contains no register-level code, making it easily portable to entirely different microcontroller families.`,
    visualType: 'flowchart',
    visualDesc: 'Syllabus Driver Stack: Application -> ECUAL Driver (HD4478O) -> MCAL Driver (I2C HAL) -> Hardware',
    code: `/*
 * Modular ECUAL Driver Example
 * separation of generic display drivers from MCAL I2C hardware drivers.
 */
#include "stm32l4xx_hal.h"

// MCAL LAYER: Set up standard I2C communication (defined in i2c.c)
extern I2C_HandleTypeDef hi2c1;

// ECUAL LAYER: A modular driver for an external SSD1306 OLED display (defined in ssd1306.c)
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint16_t dev_address;
} SSD1306_Device;

HAL_StatusTypeDef ECUAL_SSD1306_WriteCommand(SSD1306_Device *device, uint8_t cmd) {
    uint8_t data[2] = {0x00, cmd}; // 0x00 indicates a control command
    // Call the MCAL I2C driver to transmit data
    return HAL_I2C_Transmit(device->hi2c, device->dev_address, data, 2, 100);
}

int main(void) {
    HAL_Init();
    // System Initialization...
    
    SSD1306_Device display = {
        .hi2c = &hi2c1,
        .dev_address = 0x3C << 1 // SSD1306 default I2C address
    };
    
    // Send standard initialization command to OLED display
    ECUAL_SSD1306_WriteCommand(&display, 0xAF); // 0xAF turns the display On
    
    while (1) {}
}`
  },
  {
    id: 'dma_tutor',
    name: 'STM32 DMA Tutorial',
    category: 'timing',
    summary: 'Configure Direct Memory Access streams to transfer peripheral data directly to SRAM.',
    theory: `### Direct Memory Access (DMA) Architecture
The **DMA Controller** is an independent hardware coprocessor that automates data transfers, allowing you to move data between peripherals and memory without any CPU involvement.

#### Key Configurations:
1. **Source/Destination Addresses**: Define the starting memory locations (e.g., an ADC data register or an SRAM array).
2. **Direction**: 
   - **Peripheral-to-Memory** (e.g., reading an ADC).
   - **Memory-to-Peripheral** (e.g., transmitting data via UART).
   - **Memory-to-Memory** (e.g., copying buffer arrays).
3. **Circular Mode**: Automatically wraps the write pointer back to the beginning of the buffer when it is filled. This is ideal for continuous, high-speed sampling.`,
    visualType: 'flowchart',
    visualDesc: 'DMA Hardware Flow: ADC Register -> Peripheral Request -> DMA Controller -> SRAM Buffer Array',
    code: `/*
 * DMA Memory-to-Memory Transfer Example
 * Transfers a data buffer entirely in hardware.
 * Board: Nucleo-L476RG
 */
#include "stm32l4xx_hal.h"

DMA_HandleTypeDef hdma_memtomem_dma1_channel1;
#define BUFFER_SIZE 32

const uint32_t SourceBuffer[BUFFER_SIZE] = {
    0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
    // ...
};
uint32_t DestinationBuffer[BUFFER_SIZE];
volatile uint8_t transfer_complete = 0;

void MX_DMA_Init(void) {
    __HAL_RCC_DMA1_CLK_ENABLE();

    hdma_memtomem_dma1_channel1.Instance = DMA1_Channel1;
    hdma_memtomem_dma1_channel1.Init.Request = DMA_REQUEST_MEMTOMEM; // Memory-to-memory
    hdma_memtomem_dma1_channel1.Init.Direction = DMA_MEMORY_TO_MEMORY;
    hdma_memtomem_dma1_channel1.Init.PeriphInc = DMA_PINC_ENABLE;     // Increment source pointer
    hdma_memtomem_dma1_channel1.Init.MemInc = DMA_MINC_ENABLE;       // Increment destination pointer
    hdma_memtomem_dma1_channel1.Init.PeriphDataAlignment = DMA_PDATAALIGN_WORD;
    hdma_memtomem_dma1_channel1.Init.MemDataAlignment = DMA_MDATAALIGN_WORD;
    hdma_memtomem_dma1_channel1.Init.Mode = DMA_NORMAL;
    hdma_memtomem_dma1_channel1.Init.Priority = DMA_PRIORITY_HIGH;
    HAL_DMA_Init(&hdma_memtomem_dma1_channel1);

    // Register callback for transfer complete interrupt
    HAL_DMA_RegisterCallback(&hdma_memtomem_dma1_channel1, HAL_DMA_XFER_CPLT_CB_ID, NULL);
}

int main(void) {
    HAL_Init();
    MX_DMA_Init();

    // Start DMA transfer entirely in hardware
    HAL_DMA_Start(&hdma_memtomem_dma1_channel1, (uint32_t)&SourceBuffer, (uint32_t)&DestinationBuffer, BUFFER_SIZE);

    // Wait until transfer completes
    while (DestinationBuffer[BUFFER_SIZE - 1] != SourceBuffer[BUFFER_SIZE - 1]) {
        // CPU is free to run other code during the transfer!
    }
    
    while (1) {}
}`
  },
  {
    id: 'math_functions',
    name: 'MATH Functions',
    category: 'advanced',
    summary: 'Activate hardware float accelerators (FPU) to execute complex trigonometric and control equations.',
    theory: `### Hardware Floating-Point Unit (FPU) & CMSIS-DSP
The **Cortex-M4** core inside the STM32L476RG includes a dedicated hardware **Single-Precision Floating-Point Unit (FPU)**:

- By enabling the FPU, the CPU can execute complex floating-point calculations in just a single clock cycle, rather than emulating them in software.
- The **CMSIS-DSP (Digital Signal Processing)** library provides a rich collection of optimized math functions (including sine, cosine, vector multiplication, and PID control loops) designed to take full advantage of the FPU.
- This is essential for building fast, high-performance control systems, like motor controllers or digital audio filters.`,
    visualType: 'register',
    visualDesc: 'FPU Coprocessor Control Register (CPACR): Enable full CP10 and CP11 coprocessor registers',
    code: `/*
 * FPU Activation and Trigonometric Calculations
 * Targets Cortex-M4 Floating Point Unit (FPU)
 */
#include "stm32l4xx_hal.h"
#include <math.h> // Standard C library math functions

// Enable the FPU in early system initialization
void System_FPU_Enable(void) {
    // Enable CP10 and CP11 coprocessors in the CPACR register
    SCB->CPACR |= ((3UL << 20U)|(3UL << 22U)); 
}

volatile float target_angle = 45.0f;
volatile float result_sine = 0.0f;

int main(void) {
    System_FPU_Enable();
    HAL_Init();
    
    while (1) {
        // Convert degrees to radians
        float rad = target_angle * (3.14159f / 180.0f);
        
        // Executed in hardware using the single-precision FPU
        result_sine = sinf(rad); 
        
        HAL_Delay(100);
    }
}`
  },
  {
    id: 'eeprom_fee',
    name: 'STM32 EEPROM (FEE)',
    category: 'advanced',
    summary: 'Implement durable data storage using Flash EEPROM Emulation (FEE).',
    theory: `### EEPROM Emulation (FEE) using Flash Memory
The **STM32L476RG** does not include a dedicated hardware EEPROM. To store durable data (like calibration parameters or user settings) that survives power cycles, we use **Flash EEPROM Emulation (FEE)**:

- Microcontrollers store instructions in internal **Flash memory**, which is divided into large sectors called **Pages**.
- In the STM32L476RG, each page is **2 KB** in size.
- While you can read single bytes from Flash memory at any time, you can only write data in larger chunks (usually double-words, 64 bits), and you can only erase memory an entire page at a time.
- EEPROM Emulation software manages these page-erase cycles automatically, allowing you to write small variables to Flash memory safely and efficiently.`,
    visualType: 'register',
    visualDesc: 'Flash Controller Registers (FLASH_CR): Lock/Unlock keys grant secure Flash page write authorization',
    code: `/*
 * EEPROM Emulation: Writing Data to Flash memory
 * Targets STM32L476RG Flash Page 255 (Address: 0x0807F800)
 */
#include "stm32l4xx_hal.h"

#define FLASH_USER_START_ADDR   0x0807F800 // Safe address near the end of Flash
#define CONFIG_KEY              0xABCD1234

HAL_StatusTypeDef Save_System_Config(uint32_t val) {
    HAL_StatusTypeDef status;
    FLASH_EraseInitTypeDef EraseInitStruct = {0};
    uint32_t PageError = 0;

    // 1. Unlock Flash access
    HAL_FLASH_Unlock();

    // 2. Erase the target page before writing
    EraseInitStruct.TypeErase = FLASH_TYPEERASE_PAGES;
    EraseInitStruct.Banks = FLASH_BANK_1;
    EraseInitStruct.Page = 255;                   // Flash page number (255)
    EraseInitStruct.NbPages = 1;

    status = HAL_FLASHEx_Erase(&EraseInitStruct, &PageError);
    if (status != HAL_OK) {
        HAL_FLASH_Lock();
        return status;
    }

    // 3. Write data to Flash (64-bit double-word write)
    uint64_t data_to_write = ((uint64_t)val << 32) | CONFIG_KEY;
    status = HAL_FLASH_Program(FLASH_TYPEPROGRAM_DOUBLEWORD, FLASH_USER_START_ADDR, data_to_write);

    // 4. Re-lock Flash access to prevent accidental writes
    HAL_FLASH_Lock();
    return status;
}

int main(void) {
    HAL_Init();
    
    // Read saved configuration directly from memory address
    uint64_t saved_data = *(__IO uint64_t*)FLASH_USER_START_ADDR;
    uint32_t magic_key = (uint32_t)(saved_data & 0xFFFFFFFF);
    uint32_t config_val = (uint32_t)(saved_data >> 32);

    if (magic_key != CONFIG_KEY) {
        // If no config is saved, write a default value
        Save_System_Config(42);
    }
    
    while (1) {}
}`
  },
  {
    id: 'tsc_touch',
    name: 'STM32 TSC (Touch Sensing Controller)',
    category: 'advanced',
    summary: 'Configure capacitive touch keys and sliders without requiring external IC controllers.',
    theory: `### Integrated Touch Sensing Controller (TSC)
The **Touch Sensing Controller (TSC)** is a specialized hardware peripheral that simplifies the implementation of capacitive touch keys and sliders:

- Capacitive touch pads work by measuring change in capacitance. When a user touches a pad, their body capacitance increases the overall capacitance of the pad.
- To measure this change, the TSC uses a high-precision **Charge Transfer** technique: It charges the touch pad, then transfers that charge to an external reference capacitor (the **Sampling Capacitor**).
- By measuring the number of charge-transfer cycles required to charge the reference capacitor, the hardware can detect tiny changes in touch pad capacitance with high sensitivity and noise immunity.`,
    visualType: 'circuit',
    visualDesc: 'Capacitive Charge Transfer Circuit: Touch Pad (Cx) transfers charge to reference Sampling Capacitor (Cs)',
    code: `/*
 * Touch Sensing Controller (TSC) Basic Init
 * Pin Configuration: PA0 (TSC_G1_IO1), PA1 (TSC_G1_IO2 as Sampling Capacitor)
 */
#include "stm32l4xx_hal.h"

TSC_HandleTypeDef htsc;

void MX_TSC_Init(void) {
    __HAL_RCC_TSC_CLK_ENABLE();
    __HAL_RCC_GPIOA_CLK_ENABLE();

    GPIO_InitTypeDef GPIO_InitStruct = {0};

    // 1. Configure Sampling Capacitor pin as Open-Drain alternate function (AF9)
    GPIO_InitStruct.Pin = GPIO_PIN_1;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_OD;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Alternate = GPIO_AF9_TSC;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    // 2. Configure Touch Key pin as Push-Pull alternate function (AF9)
    GPIO_InitStruct.Pin = GPIO_PIN_0;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    // 3. Initialize Touch Sensing peripheral
    htsc.Instance = TSC;
    htsc.Init.AcquisitionMode = TSC_ACQ_MODE_NORMAL;
    htsc.Init.CTPulseHighLength = TSC_DE_TIME_4_CYCLES;
    htsc.Init.CTPulseLowLength = TSC_DE_TIME_4_CYCLES;
    htsc.Init.SpreadSpectrum = TSC_SS_DISABLE;
    htsc.Init.PulseGeneratorPrescaler = TSC_PG_PRESC_DIV4;
    htsc.Init.MaxCountValue = TSC_MCV_8192;           // Rollover limit
    htsc.Init.ChannelIOs = TSC_GROUP1_IO1;            // Channel IO
    htsc.Init.SamplingIOs = TSC_GROUP1_IO2;           // Sampling reference IO
    HAL_TSC_Init(&htsc);
}

int main(void) {
    HAL_Init();
    MX_TSC_Init();
    
    uint32_t touch_val = 0;
    
    while (1) {
        // Start charge transfer acquisition
        HAL_TSC_Start(&htsc);
        
        // Wait for acquisition to complete
        while (HAL_TSC_GetState(&htsc) == HAL_TSC_STATE_BUSY);
        
        // Read digitized count representation (lower count indicates a touch event!)
        touch_val = HAL_TSC_GroupGetValue(&htsc, TSC_GROUP1_IDX);
        HAL_Delay(100);
    }
}`
  },
  {
    id: 'pot_reading',
    name: 'Potentiometers Reading',
    category: 'advanced',
    summary: 'Read analog inputs from rotary potentiometers using single-shot and continuous ADC modes.',
    theory: `### Potentiometers & Successive Approximation ADC
The **STM32L476RG** includes multiple high-speed **Analog-to-Digital Converters (ADC)** with up to 12 bits of resolution ($2^{12} = 4096$ steps):

- When a rotary potentiometer is connected to an analog pin, it creates a variable voltage divider between 0V and 3.3V.
- The ADC samples this analog voltage and converts it into a digital value from 0 (representing 0V) to 4095 (representing 3.3V).
- To read these values stably, we configure a conversion clock, define a sampling time, and calculate the equivalent voltage in software:

$$\\text{Voltage} = \\frac{\\text{ADC Value}}{4095} \\times 3.3\\text{ V}$$`,
    visualType: 'circuit',
    visualDesc: 'Analog Input Divider Circuit: Potentiometer wiper wired directly to Pin PC0 (ADC1_IN1)',
    code: `/*
 * Analog Input Reading from PC0 (ADC1 Channel 1)
 * Target MCU: STM32L476RG (12-bit SAR ADC)
 */
#include "stm32l4xx_hal.h"

ADC_HandleTypeDef hadc1;

void MX_ADC1_Init(void) {
    __HAL_RCC_ADC_CLK_ENABLE();
    __HAL_RCC_GPIOC_CLK_ENABLE();

    // Configure PC0 as analog input pin
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    GPIO_InitStruct.Pin = GPIO_PIN_0;
    GPIO_InitStruct.Mode = GPIO_MODE_ANALOG;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

    ADC_ChannelConfTypeDef sConfig = {0};

    hadc1.Instance = ADC1;
    hadc1.Init.ClockPrescaler = ADC_CLOCK_ASYNC_DIV1;
    hadc1.Init.Resolution = ADC_RESOLUTION_12B;      // 12-bit (0-4095 range)
    hadc1.Init.ScanConvMode = ADC_SCAN_DISABLE;
    hadc1.Init.ContinuousConvMode = DISABLE;          // Single-shot poll mode
    hadc1.Init.DiscontinuousConvMode = DISABLE;
    hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
    HAL_ADC_Init(&hadc1);

    // Configure ADC Channel 1 on PC0
    sConfig.Channel = ADC_CHANNEL_1;
    sConfig.Rank = ADC_REGULAR_RANK_1;
    sConfig.SamplingTime = ADC_SAMPLETIME_47CYCLES_5; // Let analog voltage settle stably
    HAL_ADC_ConfigChannel(&hadc1, &sConfig);
}

int main(void) {
    HAL_Init();
    MX_ADC1_Init();
    
    uint32_t adc_raw = 0;
    float calculated_volts = 0.0f;
    
    while (1) {
        HAL_ADC_Start(&hadc1);
        if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK) {
            adc_raw = HAL_ADC_GetValue(&hadc1);
            calculated_volts = ((float)adc_raw / 4095.0f) * 3.3f;
        }
        HAL_ADC_Stop(&hadc1);
        HAL_Delay(200);
    }
}`
  },
  {
    id: 'low_power',
    name: 'STM32 Low Power Modes',
    category: 'advanced',
    summary: 'Master the three main ultra-low-power sleep modes to extend battery runtimes.',
    theory: `### Ultra-Low-Power Management (Sleep, Stop, Standby)
The **STM32L4** family is designed for energy-efficient, battery-powered applications. It features three primary power-saving modes:

1. **Sleep Mode**: The CPU core is halted, but all internal peripherals (Timers, ADC, UART) continue running. This mode consumes ~3.5 mA at 80 MHz, and can be exited instantly via any interrupt.
2. **Stop Mode**: Both the CPU core and all peripheral clocks are disabled. Memory contents are preserved, and internal regulators are placed in low-power mode. This mode reduces power consumption to just **~1.1 microamps**, and can be exited via external pin interrupts (EXTI).
3. **Standby Mode**: The internal regulator is completely turned off. SRAM and register contents are lost (except for the Backup registers and the RTC). This mode reduces power consumption to a tiny **~280 nanoamps**, and can only be exited via a dedicated Wakeup pin (WKUP), RTC alarms, or a hardware Reset.`,
    visualType: 'table',
    visualDesc: 'Syllabus Power Analysis: Sleep vs. Stop vs. Standby current consumption profiles',
    code: `/*
 * Sleep and Stop Low-Power Mode Configurations
 * Target MCU: STM32L476RG (Ultra Low-Power Core)
 */
#include "stm32l4xx_hal.h"

// Enter standard Sleep Mode
void Enter_Sleep_Mode(void) {
    // Suspend the SysTick interrupt to prevent it from waking the CPU immediately
    HAL_SuspendTick();
    
    // Enter Sleep mode; wait for an external or peripheral interrupt to wake up
    HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);
    
    // Resume SysTick once the CPU is awake
    HAL_ResumeTick();
}

// Enter ultra-low-power Stop 2 Mode
void Enter_Stop2_Mode(void) {
    // 1. Enable power controller clock
    __HAL_RCC_PWR_CLK_ENABLE();
    
    // 2. Suspend SysTick
    HAL_SuspendTick();
    
    // 3. Enter Stop 2 mode; only EXTI interrupts can wake the CPU
    HAL_PWREx_EnterSTOP2Mode(PWR_STOPENTRY_WFI);
    
    // 4. Once awake, the system defaults to the MSI clock (4 MHz)
    // We must re-configure our high-speed system clock (80 MHz PLL)
    SystemClock_Config();
    HAL_ResumeTick();
}

int main(void) {
    HAL_Init();
    // Configure System Clock, GPIOs, and EXTI Interrupt Button PC13
    
    while (1) {
        // Run core task...
        HAL_Delay(1000);
        
        // Put the MCU into energy-efficient Stop 2 mode.
        // Pressing the blue user button PC13 will trigger an EXTI interrupt and wake the system!
        Enter_Stop2_Mode();
    }
}`
  }
];
