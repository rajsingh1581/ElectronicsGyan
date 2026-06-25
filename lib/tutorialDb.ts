import fs from 'fs';
import path from 'path';

export interface Topic {
  id: string; // unique slug
  stack: 'rtos' | 'stm32' | 'arduino' | 'raspberry-pi';
  name: string;
  content: string; // Markdown
  youtubeUrl?: string; // Optional embedded youtube video
  isBuiltIn?: boolean;
  order: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'tutorials.json');

// Ensure directory and file exist with seed data
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const seedData: Topic[] = [
      // === RTOS ===
      {
        id: 'task-creation',
        stack: 'rtos',
        name: 'Task Creation & Prioritization',
        content: `### Real-Time Task Management in RTOS

In a Real-Time Operating System (RTOS), the fundamental unit of execution is a **Task** (often called a thread). Unlike standard operating systems where threads share CPU time in a fair-share round-robin manner, an RTOS scheduler is **strictly priority-based**.

#### The Task Control Block (TCB)
Every task in FreeRTOS possesses a **Task Control Block (TCB)** which stores:
- **Stack Pointer:** Points to the task's private RAM stack.
- **Task State:** Ready, Running, Blocked, or Suspended.
- **Priority:** Numeric value from \`0\` (lowest) to \`configMAX_PRIORITIES - 1\` (highest).

#### FreeRTOS Task Creation API
Here is how you dynamically spawn a task in FreeRTOS:

\`\`\`c
#include "FreeRTOS.h"
#include "task.h"

// Task function prototype
void vTelemetryTask(void *pvParameters);

void app_main(void) {
    BaseType_t status;
    
    // Spawn task
    status = xTaskCreate(
        vTelemetryTask,       // Function that implements the task
        "TelemetryTask",      // Textual name for debugging
        2048,                 // Stack depth in words (not bytes!)
        NULL,                 // Parameter passed into the task
        tskIDLE_PRIORITY + 2, // Task priority
        NULL                  // Task handle (optional)
    );
    
    if (status == pdPASS) {
        // Scheduler starts tasks automatically in ESP-IDF
    }
}

// Task implementation
void vTelemetryTask(void *pvParameters) {
    for (;;) {
        // Core telemetry logic
        printf("Sending spacecraft telemetry packet...\\n");
        
        // Delay task for 500ms (non-blocking)
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}
\`\`\`

#### Rules of Task Prioritization
1. **Starvation:** High-priority tasks that never block (e.g. forgot \`vTaskDelay\`) will starve lower-priority tasks.
2. **Idle Task:** FreeRTOS automatically creates an \`Idle Task\` at priority \`0\` to keep the CPU running when no other tasks are ready.
3. **Preemption:** If a high-priority task becomes ready, the scheduler immediately preempts the currently running lower-priority task.`,
        youtubeUrl: 'https://www.youtube.com/embed/F3210gM5YBg',
        isBuiltIn: true,
        order: 1
      },
      {
        id: 'semaphores',
        stack: 'rtos',
        name: 'Binary & Counting Semaphores',
        content: `### Semaphores: Synchronization and Signaling

Semaphores are kernel-managed objects used to synchronize tasks or signal events between Interrupt Service Routines (ISRs) and tasks.

#### Binary Semaphores vs. Counting Semaphores
- **Binary Semaphores:** Have a maximum count of \`1\`. They behave like a flag. Perfect for task synchronization (e.g., waiting for an hardware interrupt to finish).
- **Counting Semaphores:** Have a maximum count of \`N\`. They are used to manage a pool of resources or count events.

#### Signaling with Binary Semaphores

\`\`\`c
SemaphoreHandle_t xSensorSemaphore = NULL;

void vSensorISR(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    // Unblock the task from within the Interrupt
    xSemaphoreGiveFromISR(xSensorSemaphore, &xHigherPriorityTaskWoken);
    
    // Force a context switch if the woken task has higher priority
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

void vSensorHandlerTask(void *pvParameters) {
    xSensorSemaphore = xSemaphoreCreateBinary();
    
    for (;;) {
        // Wait indefinitely for the ISR to signal
        if (xSemaphoreTake(xSensorSemaphore, portMAX_DELAY) == pdTRUE) {
            // Process high-speed sensor data safely outside the ISR
            ProcessSensorData();
        }
    }
}
\`\`\`

#### Best Practices
- Never block in an ISR! Use the \`FromISR\` API variants.
- For mutual exclusion (guarding variables), prefer **Mutexes** over Binary Semaphores because Mutexes implement **Priority Inheritance** to prevent priority inversion.`,
        youtubeUrl: 'https://www.youtube.com/embed/5a8M__QpS7Y',
        isBuiltIn: true,
        order: 2
      },
      {
        id: 'queues',
        stack: 'rtos',
        name: 'Queue Management & ISRs',
        content: `### Queue Management & Thread-Safe Communication

In embedded systems, tasks must frequently exchange data. **Queues** are the primary thread-safe mechanism to pass data by-copy between tasks or from Interrupts.

#### Core Design Elements
- **Thread Safety:** Queues automatically handle locking and context switching.
- **FIFO Order:** First-In, First-Out queueing ensures message chronology.
- **Block Time:** Tasks can block on a full write or an empty read until space/data becomes available.

#### FreeRTOS Queue Implementation

\`\`\`c
typedef struct {
    uint32_t uValue;
    char cSourceID[10];
} Message_t;

QueueHandle_t xMsgQueue = NULL;

void vProducerTask(void *pvParameters) {
    Message_t msg = { .uValue = 100, .cSourceID = "TEMP_SENS" };
    
    for (;;) {
        msg.uValue = ReadAdcSensor();
        
        // Post item to queue; block up to 10ms if full
        if (xQueueSend(xMsgQueue, (void *)&msg, pdMS_TO_TICKS(10)) != pdPASS) {
            printf("Queue full! Packet dropped.\\n");
        }
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void vConsumerTask(void *pvParameters) {
    Message_t receivedMsg;
    xMsgQueue = xQueueCreate(10, sizeof(Message_t)); // 10 items maximum
    
    for (;;) {
        // Block indefinitely until an item arrives
        if (xQueueReceive(xMsgQueue, &receivedMsg, portMAX_DELAY) == pdTRUE) {
            printf("Processing %s: Value = %d\\n", receivedMsg.cSourceID, receivedMsg.uValue);
        }
    }
}
\`\`\`

#### Designing for Performance
Since queues copy data, passing large structures can be slow. For big data chunks (e.g., camera frames), queue **pointers to structures** instead of the actual data structures!`,
        youtubeUrl: 'https://www.youtube.com/embed/8vB_YfGqAeo',
        isBuiltIn: true,
        order: 3
      },
      {
        id: 'mutex-inversion',
        stack: 'rtos',
        name: 'Mutexes & Priority Inversion',
        content: `### Mutexes & Priority Inversion

A **Mutex** (Mutual Exclusion) is a binary flag used to guard shared resources (e.g., an SPI bus or global buffer) from concurrent modifications.

#### The Priority Inversion Disaster
Priority Inversion occurs when a high-priority task is blocked waiting for a resource held by a low-priority task, while a medium-priority task preempts the low-priority task, indirectly starving the high-priority task!

This famously caused the **Mars Pathfinder** spacecraft to crash and reset repeatedly in 1997.

#### Solution: Priority Inheritance
When a high-priority task blocks on a mutex held by a low-priority task, the RTOS temporarily elevates the low-priority task's priority to match the high-priority task. This prevents medium-priority tasks from interrupting, allowing the lock to be released quickly.

#### Guarding an I2C Resource with a Mutex

\`\`\`c
SemaphoreHandle_t xI2cMutex = NULL;

void vI2cSensorRead(void) {
    // Create mutex once
    if (xI2cMutex == NULL) {
        xI2cMutex = xSemaphoreCreateMutex();
    }
    
    // Take Mutex (block indefinitely until free)
    if (xSemaphoreTake(xI2cMutex, portMAX_DELAY) == pdTRUE) {
        // Safe zone: read/write shared I2C peripheral
        I2C_WriteRegister(0x48, 0x01);
        I2C_ReadRegister(0x48, 0x00);
        
        // Release Mutex immediately
        xSemaphoreGive(xI2cMutex);
    }
}
\`\`\`

#### Guidelines
- Keep critical sections as short as possible.
- Never use a standard semaphore for mutual exclusion; always use a Mutex with priority inheritance enabled.`,
        youtubeUrl: 'https://www.youtube.com/embed/5a8M__QpS7Y',
        isBuiltIn: true,
        order: 4
      },

      // === STM32 ===
      {
        id: 'gpio-exti',
        stack: 'stm32',
        name: 'GPIO & External Interrupts (EXTI)',
        content: `### High-Speed GPIO and EXTI Handling on STM32

STM32 microcontrollers are built on the ARM Cortex-M architecture, providing advanced General Purpose Input/Output (GPIO) capabilities and a dedicated **External Interrupt/Event Controller (EXTI)**.

#### Registers Involved
To toggle or read a pin on a bare-metal level, STM32 uses:
- **MODER:** Configures Pin as Input, Output, Alternate Function, or Analog.
- **ODR / IDR:** Output Data Register and Input Data Register.
- **BSRR:** Bit Set/Reset Register (allows atomic, thread-safe bit toggling).

#### GPIO Toggling via STM32 HAL
Here is the official way to read a push button and toggle an LED:

\`\`\`c
#include "stm32f4xx_hal.h"

int main(void) {
    HAL_Init();
    __HAL_RCC_GPIOA_CLK_ENABLE(); // Enable GPIOA Peripheral Clock
    __HAL_RCC_GPIOC_CLK_ENABLE(); // Enable GPIOC Peripheral Clock

    GPIO_InitTypeDef GPIO_InitStruct = {0};

    // Configure PA5 as Output (LED)
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    // Configure PC13 as Input with Interrupt (Pushbutton EXTI)
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING; // Trigger on falling edge
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

    // Enable EXTI Line 15-10 Interrupt in NVIC
    HAL_NVIC_SetPriority(EXTI15_10_IRQn, 2, 0);
    HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);

    while (1) {
        // Main Loop
    }
}

// ISR Callback Handler
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_13) {
        // Toggle PA5 LED atomically
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    }
}
\`\`\`

#### Debugging EXTI Bounce
Mechanical switches spark electrical noise when pressed. Always implement software debouncing inside the callback or use a 100nF hardware debouncing capacitor parallel to the switch!`,
        youtubeUrl: 'https://www.youtube.com/embed/m949V6f_Isk',
        isBuiltIn: true,
        order: 1
      },
      {
        id: 'timers-pwm',
        stack: 'stm32',
        name: 'Timers, Counters & PWM Generation',
        content: `### High-Precision Timers & PWM Generation

STM32 Hardware Timers are extremely powerful and can operate entirely without CPU overhead to count signals, capture pulses, and generate Pulse Width Modulated (PWM) outputs.

#### PWM Calculations
To configure a specific PWM frequency on STM32, use:
$$f_{PWM} = \\frac{f_{Clock}}{(Prescaler + 1) \\times (Period + 1)}$$

For example, on an 84 MHz clock:
- **Prescaler (PSC):** 83 -> Timer clock = 1 MHz
- **Counter Period (ARR):** 999 -> PWM Frequency = 1 kHz

#### PWM Generation Code with HAL

\`\`\`c
TIM_HandleTypeDef htim2;
TIM_OC_InitTypeDef sConfigOC = {0};

void MX_TIM2_Init(void) {
    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 83;
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 999; // ARR
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_PWM_Init(&htim2);

    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 500; // 50% Duty Cycle (500/1000)
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_1);
    
    // Start PWM on Timer 2, Channel 1
    HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);
}

// Dynamically change duty cycle
void SetLED_Brightness(uint32_t brightness) {
    __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, brightness);
}
\`\`\`

#### Applications
- Brushless DC Motor Speed Controllers.
- LED Dimming (using high frequency to prevent human eye flicker).
- Precision analog voltage level simulation using RC filters.`,
        youtubeUrl: 'https://www.youtube.com/embed/yYnQYv8f-84',
        isBuiltIn: true,
        order: 2
      },
      {
        id: 'adc-dma',
        stack: 'stm32',
        name: 'ADC Conversion & DMA Channels',
        content: `### ADC & Direct Memory Access (DMA)

Analog-to-Digital Converters (ADCs) transform real-world voltages into binary values. Reading a high-speed ADC directly in code wastes CPU clock cycles. **Direct Memory Access (DMA)** solves this by writing ADC samples directly to RAM without CPU intervention!

#### Memory-To-Peripheral Direct Routing
With DMA enabled:
1. ADC finishes a conversion.
2. ADC triggers a DMA request.
3. DMA controller transfers the data byte/word directly to a designated array in RAM.
4. An interrupt is optionally triggered only when the buffer is completely full.

#### STM32 ADC + DMA Code

\`\`\`c
#define ADC_BUF_LEN 100
uint32_t adc_buffer[ADC_BUF_LEN];
ADC_HandleTypeDef hadc1;

void StartContinuousAdc(void) {
    // Configure ADC & DMA via STM32CubeMX, then call:
    HAL_ADC_Start_DMA(&hadc1, adc_buffer, ADC_BUF_LEN);
}

// Triggers automatically when half the buffer is filled
void HAL_ADC_ConvHalfCpltCallback(ADC_HandleTypeDef* hadc) {
    // Process first half of buffer (indexes 0 to 49)
}

// Triggers automatically when full buffer is filled
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
    // Process second half of buffer (indexes 50 to 99)
}
\`\`\`

#### Benefits
- **Zero Jitter:** Samplings are clocked exactly by hardware timers.
- **Ultra Low Power:** The CPU can enter Sleep Mode while DMA collects sensor arrays in the background.`,
        youtubeUrl: 'https://www.youtube.com/embed/6u2XgD6-7-8',
        isBuiltIn: true,
        order: 3
      },
      {
        id: 'protocols',
        stack: 'stm32',
        name: 'I2C, SPI & UART Protocols',
        content: `### Industrial Serial Communication Protocols

A firmware engineer must master the three fundamental serial protocols: **UART, SPI, and I2C**.

| Protocol | Type | Speed | Wires | Mode | Max Devices |
|---|---|---|---|---|---|
| **UART** | Asynchronous | Low (115kbps) | 2 (RX/TX) | Full-Duplex | 1 to 1 |
| **I2C** | Synchronous | Medium (400kbps) | 2 (SDA/SCL) | Half-Duplex | 127 devices |
| **SPI** | Synchronous | High (10+ Mbps) | 4 (MISO/MOSI/SCK/CS) | Full-Duplex | Multiple (requires Chip Select) |

#### Transmitting via SPI in STM32

\`\`\`c
SPI_HandleTypeDef hspi1;

void WriteRegisterSPI(uint8_t regAddr, uint8_t value) {
    uint8_t data[2] = { regAddr, value };
    
    // Select peripheral (Pull Chip Select LOW)
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
    
    // Transmit 2 bytes over SPI; block up to 100ms
    HAL_SPI_Transmit(&hspi1, data, 2, 100);
    
    // Deselect peripheral (Pull Chip Select HIGH)
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);
}
\`\`\`

#### Transmitting via UART (printf redirection)

To redirect standard C \`printf()\` output to the STM32 serial console (ST-Link Virtual COM port):

\`\`\`c
UART_HandleTypeDef huart2;

int __io_putchar(int ch) {
    HAL_UART_Transmit(&huart2, (uint8_t *)&ch, 1, HAL_MAX_DELAY);
    return ch;
}
\`\`\``,
        youtubeUrl: 'https://www.youtube.com/embed/Wb8vOqC0W_0',
        isBuiltIn: true,
        order: 4
      },

      // === Arduino ===
      {
        id: 'anatomy-sketch',
        stack: 'arduino',
        name: 'Anatomy of an Arduino Sketch',
        content: `### Anatomy of an Arduino Sketch

Arduino shields the developer from raw registers by providing a simplified C++ framework with two entry points: \`setup()\` and \`loop()\`.

#### Underlying Execution
The compiler secretly inserts a standard \`main()\` function behind the scenes:

\`\`\`cpp
int main(void) {
    init(); // Initialize timers, ADCs, and hardware interrupts
    setup(); // Run user initialization once
    
    for (;;) {
        loop(); // Run core execution loop continuously
        if (serialEventRun) serialEventRun();
    }
    return 0;
}
\`\`\`

#### Writing a Standard Non-Blocking Digital Output

\`\`\`cpp
const int LED_PIN = 13;

void setup() {
    // Configure pin mode as digital output
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    // Toggle pin output level
    digitalWrite(LED_PIN, HIGH);
    delay(1000); // Blocks execution!
    digitalWrite(LED_PIN, LOW);
    delay(1000);
}
\`\`\`

#### When NOT to use delay()
\`delay()\` halts the microcontroller. During a delay, the microcontroller cannot read buttons, parse serial inputs, or respond to sensors. Avoid \`delay()\` in commercial projects.`,
        youtubeUrl: 'https://www.youtube.com/embed/YpS8999eG98',
        isBuiltIn: true,
        order: 1
      },
      {
        id: 'millis-timing',
        stack: 'arduino',
        name: 'Non-blocking Code with millis()',
        content: `### Cooperative Multi-tasking with millis()

To perform multiple activities simultaneously (e.g. blinking an LED while listening to serial commands), we must replace blocking delays with a timer-comparison approach using the \`millis()\` function.

#### The Stopwatch Analogy
Think of \`millis()\` as a stopwatch that starts at boot and counts milliseconds up to ~49 days. We store the "previous time" and periodically compare it against the current time.

#### Multi-tasking Example code

\`\`\`cpp
const int LED_1 = 5;
const int LED_2 = 6;

unsigned long prevTimeLED1 = 0;
unsigned long prevTimeLED2 = 0;

const unsigned long intervalLED1 = 200; // blink every 200ms
const unsigned long intervalLED2 = 1000; // blink every 1000ms

void setup() {
    pinMode(LED_1, OUTPUT);
    pinMode(LED_2, OUTPUT);
}

void loop() {
    unsigned long currentTime = millis();
    
    // Toggle LED 1 independently
    if (currentTime - prevTimeLED1 >= intervalLED1) {
        digitalWrite(LED_1, !digitalRead(LED_1));
        prevTimeLED1 = currentTime;
    }
    
    // Toggle LED 2 independently
    if (currentTime - prevTimeLED2 >= intervalLED2) {
        digitalWrite(LED_2, !digitalRead(LED_2));
        prevTimeLED2 = currentTime;
    }
}
\`\`\`

#### Preventing Variable Overflow
Always use \`unsigned long\` for timing variables to ensure subtraction calculations work perfectly even when the \`millis()\` count rolls over back to \`0\`.`,
        youtubeUrl: 'https://www.youtube.com/embed/5K_YIas1z60',
        isBuiltIn: true,
        order: 2
      },
      {
        id: 'arduino-interrupts',
        stack: 'arduino',
        name: 'Digital/Analog I/O & Interrupts',
        content: `### High-Speed Hardware Interrupts on Arduino

An **Interrupt** halts standard code execution immediately to process a critical hardware trigger, then resumes the loop as if nothing happened.

#### Rules for Writing an ISR
1. **Keep it Short:** ISRs should run in microseconds.
2. **Never call delay():** \`delay()\` relies on internal timer interrupts, which are disabled inside an ISR.
3. **Use volatile variables:** Variables shared between the loop and the ISR must be declared \`volatile\` to prevent the compiler's cache optimizer from ignoring hardware changes.

#### Interrupt Setup Code

\`\`\`cpp
const byte INTERRUPT_PIN = 2;
const byte LED_PIN = 13;
volatile bool motionDetected = false;

void setup() {
    pinMode(LED_PIN, OUTPUT);
    pinMode(INTERRUPT_PIN, INPUT_PULLUP);
    
    // Bind pin to Interrupt
    attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), motionISR, FALLING);
}

void loop() {
    if (motionDetected) {
        digitalWrite(LED_PIN, HIGH);
        delay(5000); // Turn LED on for 5s
        digitalWrite(LED_PIN, LOW);
        motionDetected = false; // Reset state
    }
}

// Interrupt Service Routine (ISR)
void motionISR() {
    motionDetected = true; // Set flag and exit immediately
}
\`\`\``,
        youtubeUrl: 'https://www.youtube.com/embed/Qt_S6SjZ-bE',
        isBuiltIn: true,
        order: 3
      },
      {
        id: 'esp32-wifi',
        stack: 'arduino',
        name: 'ESP32 Wi-Fi Web Servers',
        content: `### Deploying Wi-Fi Web Servers on ESP32

The ESP32 is a dual-core modern chip with integrated 2.4 GHz Wi-Fi and Bluetooth, fully supported in the Arduino IDE.

#### Serving HTML Pages
By starting a local web server, the ESP32 can serve high-quality HTML pages to laptops or smartphones on the same network to control GPIO pins.

#### Complete Access Point Server Code

\`\`\`cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "ESP32_AccessPoint";
const char* password = "engineering101";

WebServer server(80);
const int LED_PIN = 2; // Onboard LED

void handleRoot() {
    String html = "<h1>ESP32 IoT Controller</h1>";
    html += "<p><a href='/on'><button style='padding:15px; font-size:18px;'>LED ON</button></a></p>";
    html += "<p><a href='/off'><button style='padding:15px; font-size:18px;'>LED OFF</button></a></p>";
    server.send(200, "text/html", html);
}

void handleLedOn() {
    digitalWrite(LED_PIN, HIGH);
    server.sendHeader("Location", "/");
    server.send(303); // Redirect back to root page
}

void handleLedOff() {
    digitalWrite(LED_PIN, LOW);
    server.sendHeader("Location", "/");
    server.send(303);
}

void setup() {
    pinMode(LED_PIN, OUTPUT);
    Serial.begin(115200);
    
    // Set up ESP32 as an Access Point (SSID broadcasting)
    WiFi.softAP(ssid, password);
    Serial.print("AP IP Address: ");
    Serial.println(WiFi.softAPIP());
    
    // Bind paths to handlers
    server.on("/", handleRoot);
    server.on("/on", handleLedOn);
    server.on("/off", handleLedOff);
    
    server.begin();
}

void loop() {
    server.handleClient(); // Process client connection requests
}
\`\`\``,
        youtubeUrl: 'https://www.youtube.com/embed/5a8M__QpS7Y',
        isBuiltIn: true,
        order: 4
      },

      // === Raspberry Pi ===
      {
        id: 'headless-setup',
        stack: 'raspberry-pi',
        name: 'Headless OS Configuration',
        content: `### Setting up a Headless Raspberry Pi

"Headless" means setting up a Raspberry Pi Single Board Computer (SBC) completely without a monitor, keyboard, or mouse, accessing it remotely via SSH.

#### Pre-Configuring the OS
Using the **Raspberry Pi Imager** tool, you can click the settings cogwheel to pre-define:
- **SSID & Password:** Auto-connects to your local Wi-Fi.
- **SSH Enable:** Allows secure remote terminal access.
- **Username & Password:** Sets secure administrative credentials.

#### Connecting over SSH
Once booted on the network, find the Pi's IP address and run:

\`\`\`bash
# Log in using standard secure shell terminal
ssh user@raspberrypi.local
# Or if hostname resolution fails, use the local IP:
ssh user@192.168.1.45
\`\`\`

#### Updating the OS packages
Always update packages immediately upon a fresh headless login:

\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\``,
        youtubeUrl: 'https://www.youtube.com/embed/a8Y39PZ9p0w',
        isBuiltIn: true,
        order: 1
      },
      {
        id: 'python-gpio',
        stack: 'raspberry-pi',
        name: 'Python GPIO & PWM Interfacing',
        content: `### High-Level Hardware Interfacing with Python

Unlike microcontrollers, the Raspberry Pi runs a full Linux OS. We use Python libraries (like \`gpiozero\`) to interface with physical hardware.

#### Safe GPIO Interfacing
The Pi's GPIO pins operate strictly on **3.3V**. Connecting a 5V sensor output directly to a Pi pin can destroy the Broadcom SoC! Always use a **level shifter** or voltage divider.

#### Controlling a PWM Buzzer in Python

\`\`\`python
from gpiozero import PWMOutputDevice
from time import sleep

# Connect piezo buzzer to GPIO 18
buzzer = PWMOutputDevice(18)

try:
    print("Starting sweeping frequency pitch...")
    while True:
        # Pulse buzzer at 50% duty cycle with varying speed
        buzzer.blink(on_time=0.1, off_time=0.1, n=5)
        sleep(2)
        buzzer.value = 0.8 # high duty cycle tone
        sleep(0.5)
        buzzer.value = 0 # turn off
        sleep(1)
        
except KeyboardInterrupt:
    print("Safe cleanup done.")
    buzzer.close()
\`\`\`

#### System Limitations
Because Linux is not a real-time OS (RTOS), high-speed precision tasks (like microsecond-level motor pulse captures) can experience jitter due to OS process scheduling. Use a coprocessor (like an Arduino or Pico) for high-speed loops!`,
        youtubeUrl: 'https://www.youtube.com/embed/4SszYI2mY2U',
        isBuiltIn: true,
        order: 2
      },
      {
        id: 'pico-sdk-setup',
        stack: 'raspberry-pi',
        name: 'Pi Pico C/C++ SDK Setup',
        content: `### Bare-metal RP2040 Microcontroller Programming

The **Raspberry Pi Pico** is a $4 bare-metal dual-core ARM Cortex-M0+ board, powered by the custom RP2040 chip.

#### Direct Hardware Performance
Unlike its full SBC counterpart, the Pico runs directly on bare metal (no OS). For maximum performance, we utilize the official Pi Pico C/C++ SDK.

#### CMake Configuration (\`CMakeLists.txt\`)
Pico programs use CMake to build project modules.

\`\`\`cmake
cmake_minimum_required(VERSION 3.13)
include(pico_sdk_import.cmake)
project(pico_blink C CXX ASM)
pico_sdk_init()

add_executable(pico_blink
    main.c
)

target_link_libraries(pico_blink pico_stdlib)
pico_enable_stdio_usb(pico_blink 1) # Enable print via USB serial console
pico_enable_stdio_uart(pico_blink 0)
pico_add_extra_outputs(pico_blink)
\`\`\`

#### Main Implementation Code (\`main.c\`)

\`\`\`c
#include <stdio.h>
#include "pico/stdlib.h"

int main() {
    stdio_init_all(); // Initialize USB serial debug
    
    const uint LED_PIN = PICO_DEFAULT_LED_PIN;
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    while (true) {
        printf("Toggling Board Green LED!\\n");
        gpio_put(LED_PIN, 1);
        sleep_ms(500);
        gpio_put(LED_PIN, 0);
        sleep_ms(500);
    }
}
\`\`\``,
        youtubeUrl: 'https://www.youtube.com/embed/gLgQ1XNnC38',
        isBuiltIn: true,
        order: 3
      },
      {
        id: 'dual-core',
        stack: 'raspberry-pi',
        name: 'Dual-Core Programming',
        content: `### Harnessing the RP2040 Dual-Core Processor

The Raspberry Pi Pico RP2040 chip features **two identical ARM Cortex-M0+ cores** running at 133 MHz. We can run separate loops on each core simultaneously!

#### Core Synchronization
- **FIFO Queues:** The hardware provides thread-safe mailbox channels to send 32-bit values between Core 0 and Core 1.
- **Mutexes:** High-level locks to prevent both cores from accessing a resource (like a display) at the exact same moment.

#### Running Code on both Cores in C/C++

\`\`\`c
#include "pico/stdlib.h"
#include "pico/multicore.h"

// Core 1 core processing loop
void core1_entry() {
    while (true) {
        // Read command from Core 0 mailbox
        uint32_t cmd = multicore_fifo_pop_blocking();
        
        // Execute heavy computation on Core 1
        uint32_t result = cmd * 1581;
        
        // Return result to Core 0
        multicore_fifo_push_blocking(result);
    }
}

int main() {
    stdio_init_all();
    
    // Launch core1_entry function on Core 1
    multicore_launch_core1(core1_entry);
    
    while (true) {
        // Core 0 tasks
        uint32_t raw_val = 12;
        multicore_fifo_push_blocking(raw_val); // send to Core 1
        
        // Do other tasks...
        
        uint32_t res = multicore_fifo_pop_blocking(); // wait for computation
        printf("Result from Core 1: %d\\n", res);
        sleep_ms(1000);
    }
}
\`\`\``,
        youtubeUrl: 'https://www.youtube.com/embed/gLgQ1XNnC38',
        isBuiltIn: true,
        order: 4
      }
    ];

    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
  }
}

export function getTopics(stack?: string): Topic[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const topics: Topic[] = JSON.parse(raw);
    if (stack) {
      return topics
        .filter((t) => t.stack === stack)
        .sort((a, b) => a.order - b.order);
    }
    return topics.sort((a, b) => a.order - b.order);
  } catch (e) {
    console.error('Error reading tutorials database:', e);
    return [];
  }
}

export function getTopic(stack: string, id: string): Topic | undefined {
  const topics = getTopics(stack);
  return topics.find((t) => t.id === id);
}

export function createTopic(topic: Omit<Topic, 'id'>): Topic {
  ensureDataFile();
  const topics = getTopics();
  
  // Clean slug generation
  const baseId = topic.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  let finalId = baseId;
  let counter = 1;
  while (topics.some((t) => t.id === finalId)) {
    finalId = `${baseId}-${counter}`;
    counter++;
  }

  const newTopic: Topic = {
    ...topic,
    id: finalId,
    order: topics.filter((t) => t.stack === topic.stack).length + 1
  };

  topics.push(newTopic);
  fs.writeFileSync(DATA_FILE, JSON.stringify(topics, null, 2), 'utf-8');
  return newTopic;
}

export function updateTopic(id: string, update: Partial<Topic>): Topic | undefined {
  ensureDataFile();
  const topics = getTopics();
  const idx = topics.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;

  const updated = {
    ...topics[idx],
    ...update,
    // prevent updating ID directly to ensure route stability
    id
  };

  topics[idx] = updated;
  fs.writeFileSync(DATA_FILE, JSON.stringify(topics, null, 2), 'utf-8');
  return updated;
}

export function deleteTopic(id: string): boolean {
  ensureDataFile();
  const topics = getTopics();
  const filtered = topics.filter((t) => t.id !== id);
  if (filtered.length === topics.length) return false;

  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
