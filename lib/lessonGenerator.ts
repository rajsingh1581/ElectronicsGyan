export interface SimulationStep {
  title: string;
  description: string;
  highlightCode: string;
  stateSummary: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedLesson {
  theory: string;
  code: string;
  visualType: string;
  simulationSpec: SimulationStep[];
  quiz: QuizQuestion[];
}

/**
 * Dynamically constructs C code specifically tailored to the selected RTOS topic.
 */
function generateRtosCode(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');
  const funcName = cleanName.toLowerCase().split(/\s+/).join('_');

  if (topicName.toLowerCase().includes('task') || topicName.toLowerCase().includes('creation') || topicName.toLowerCase().includes('priorit')) {
    return `// FreeRTOS Topic Study: ${topicName}
// Description: ${topicDesc}
#include "FreeRTOS.h"
#include "task.h"

// Task handle for thread monitoring
TaskHandle_t x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Handle = NULL;

void v${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Task(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFrequency = pdMS_TO_TICKS(100); // 100ms cycle

    for (;;) {
        // Execute task routine: ${topicName}
        // System telemetry action...
        
        // Block task cleanly without CPU lockout
        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

int main(void) {
    // Spawn preemptive real-time task with priority 2
    xTaskCreate(
        v${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Task,
        "${cleanName.slice(0, 15)}",
        256, // Stack depth in words
        NULL, // Parameter
        tskIDLE_PRIORITY + 2, // Priority level
        &x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Handle
    );

    // Start FreeRTOS Scheduler
    vTaskStartScheduler();
    for (;;);
}
`;
  }

  if (topicName.toLowerCase().includes('semaphore') || topicName.toLowerCase().includes('signaling') || topicName.toLowerCase().includes('sync')) {
    return `// FreeRTOS Topic Study: ${topicName}
// Description: ${topicDesc}
#include "FreeRTOS.h"
#include "semphr.h"
#include "task.h"

SemaphoreHandle_t x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Sem = NULL;

void vHandlerTask(void *pvParameters) {
    for (;;) {
        // Wait indefinitely for hardware interrupt signaling
        if (xSemaphoreTake(x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Sem, portMAX_DELAY) == pdTRUE) {
            // Unlocked! Handle physical register status for ${topicName}
        }
    }
}

// Simulated Interrupt Service Routine
void USART1_IRQHandler(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    // Give binary semaphore from ISR context
    xSemaphoreGiveFromISR(x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Sem, &xHigherPriorityTaskWoken);
    
    // Force context switch if necessary
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}
`;
  }

  if (topicName.toLowerCase().includes('mutex') || topicName.toLowerCase().includes('inversion') || topicName.toLowerCase().includes('lock')) {
    return `// FreeRTOS Topic Study: ${topicName}
// Description: ${topicDesc}
#include "FreeRTOS.h"
#include "semphr.h"
#include "task.h"

SemaphoreHandle_t x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Mutex = NULL;

void vSharedBusAccessTask(void *pvParameters) {
    for (;;) {
        // Take Mutex to guard shared resource (I2C/SPI)
        if (xSemaphoreTake(x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Mutex, pdMS_TO_TICKS(50)) == pdTRUE) {
            // SAFE ZONE: Perform writing routine for: ${topicName}
            
            // Return resource immediately
            xSemaphoreGive(x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Mutex);
        }
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}
`;
  }

  if (topicName.toLowerCase().includes('queue') || topicName.toLowerCase().includes('comm') || topicName.toLowerCase().includes('message')) {
    return `// FreeRTOS Topic Study: ${topicName}
// Description: ${topicDesc}
#include "FreeRTOS.h"
#include "queue.h"
#include "task.h"

QueueHandle_t x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Queue = NULL;

typedef struct {
    uint32_t ulValue;
    char cHeaderCode;
} Packet_t;

void vProducer(void *pvParameters) {
    Packet_t data = { .ulValue = 2048, .cHeaderCode = 'A' };
    for (;;) {
        // Send data structure to back of the queue
        xQueueSend(x${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Queue, &data, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}
`;
  }

  // Fallback generic RTOS code
  return `// FreeRTOS Dynamic Study: ${topicName}
// Spec: ${topicDesc}
#include "FreeRTOS.h"
#include "task.h"

void vSyllabusDrillTask(void *pvParameters) {
    for (;;) {
        // Execute dynamic syllabus drill: ${topicName}
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}

void init_rtos_syllabus_drill(void) {
    xTaskCreate(vSyllabusDrillTask, "SyllabusTask", 128, NULL, 1, NULL);
}
`;
}

/**
 * Dynamically constructs C code specifically tailored to the selected STM32 topic.
 */
function generateStm32Code(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');

  if (topicName.toLowerCase().includes('gpio') || topicName.toLowerCase().includes('pin') || topicName.toLowerCase().includes('interrupt') || topicName.toLowerCase().includes('exti')) {
    return `// STM32 HAL Study: ${topicName}
// Description: ${topicDesc}
#include "stm32f4xx_hal.h"

void MX_GPIO_Pin_Init(void) {
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    
    // Enable GPIO clocks for Port A and C
    __HAL_RCC_GPIOA_CLK_ENABLE();
    __HAL_RCC_GPIOC_CLK_ENABLE();
    
    // Configure PA5 as High-Speed Output (User LED)
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
    
    // Configure PC13 as Input Interrupt with Falling Edge trigger (User Button)
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
    
    // Enable EXTI Line 15-10 Interrupt in NVIC
    HAL_NVIC_SetPriority(EXTI15_10_IRQn, 2, 0);
    HAL_NVIC_EnableIRQ(EXTI15_10_IRQn);
}

// Override HAL EXTI Callback Handler
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_13) {
        // Toggle output state atomically: ${topicName}
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    }
}
`;
  }

  if (topicName.toLowerCase().includes('timer') || topicName.toLowerCase().includes('pwm') || topicName.toLowerCase().includes('frequency') || topicName.toLowerCase().includes('counter')) {
    return `// STM32 HAL Study: ${topicName}
// Description: ${topicDesc}
#include "stm32f4xx_hal.h"

TIM_HandleTypeDef htim2;

void MX_Timer_PWM_Setup(void) {
    TIM_OC_InitTypeDef sConfigOC = {0};
    
    __HAL_RCC_TIM2_CLK_ENABLE();
    
    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 83; // 84MHz / 84 = 1MHz Counting Ticks
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 999;  // ARR: 1MHz / 1000 = 1kHz PWM Waveform
    HAL_TIM_PWM_Init(&htim2);
    
    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 350; // Duty Cycle: 35% (350 / 1000)
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_1);
    
    // Start High-Speed PWM Generation on Channel 1
    HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);
}

// Adjust duty cycle dynamically matching topic specifications
void Set${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}_Duty(uint32_t pulse) {
    __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, pulse);
}
`;
  }

  if (topicName.toLowerCase().includes('adc') || topicName.toLowerCase().includes('dma') || topicName.toLowerCase().includes('conversion') || topicName.toLowerCase().includes('analog')) {
    return `// STM32 HAL Study: ${topicName}
// Description: ${topicDesc}
#include "stm32f4xx_hal.h"

#define ADC_BUFFER_SIZE  4
uint32_t adcDualCoreBuffer[ADC_BUFFER_SIZE];
ADC_HandleTypeDef hadc1;

void Start_DMA_ADC_Conversions(void) {
    // Configure ADC1 to write continuous samples directly to RAM using DMA1 Controller
    HAL_ADC_Start_DMA(&hadc1, adcDualCoreBuffer, ADC_BUFFER_SIZE);
}

// Callback invoked when DMA finished complete buffer transfer
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
    if (hadc->Instance == ADC1) {
        // Read ADC buffer registers for ${topicName}
        uint32_t channel0 = adcDualCoreBuffer[0];
        uint32_t channel1 = adcDualCoreBuffer[1];
        // Process analog metrics safely...
    }
}
`;
  }

  if (topicName.toLowerCase().includes('serial') || topicName.toLowerCase().includes('uart') || topicName.toLowerCase().includes('usart') || topicName.toLowerCase().includes('i2c') || topicName.toLowerCase().includes('spi') || topicName.toLowerCase().includes('protocol')) {
    return `// STM32 HAL Study: ${topicName}
// Description: ${topicDesc}
#include "stm32f4xx_hal.h"

UART_HandleTypeDef huart2;

void Send_Serial_Logs(char *payload, uint16_t length) {
    // Transmit message over UART2 with 100ms timeout safety
    HAL_UART_Transmit(&huart2, (uint8_t*)payload, length, 100);
}

void Listen_UART_Interrupts(uint8_t *rxBuffer, uint16_t size) {
    // Enable non-blocking serial receive in background interrupt
    HAL_UART_Receive_IT(&huart2, rxBuffer, size);
}
`;
  }

  // Fallback generic STM32 code
  return `// STM32 HAL Study: ${topicName}
// Spec: ${topicDesc}
#include "stm32f4xx_hal.h"

void MX_Peripheral_Drill_Init(void) {
    // Dynamic config setup for: ${topicName}
    HAL_Init();
    
    // Enable specific clocks...
}
`;
}

/**
 * Dynamically constructs C++ code specifically tailored to the selected Arduino topic.
 */
function generateArduinoCode(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');

  if (topicName.toLowerCase().includes('digital') || topicName.toLowerCase().includes('pin') || topicName.toLowerCase().includes('led') || topicName.toLowerCase().includes('write') || topicName.toLowerCase().includes('read')) {
    return `// Arduino Sketch: ${topicName}
// Description: ${topicDesc}

const int LED_PIN = 13;
const int BUTTON_PIN = 2;

void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN, OUTPUT);
    // Enable AVR internal pull-up resistor on physical push button
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    Serial.println(F("GPIO Pins configured for: ${cleanName}"));
}

void loop() {
    // Read active state (LOW indicates button is pressed)
    int state = digitalRead(BUTTON_PIN);
    if (state == LOW) {
        digitalWrite(LED_PIN, HIGH);
        Serial.println(F("Button State: Closed -> LED ON"));
    } else {
        digitalWrite(LED_PIN, LOW);
    }
    delay(50); // Small debounce delay
}
`;
  }

  if (topicName.toLowerCase().includes('analog') || topicName.toLowerCase().includes('pot') || topicName.toLowerCase().includes('voltage') || topicName.toLowerCase().includes('adc')) {
    return `// Arduino Sketch: ${topicName}
// Description: ${topicDesc}

const int POT_PIN = A0;

void setup() {
    Serial.begin(115200);
    // Set reference to standard 5V supply
    analogReference(DEFAULT);
    Serial.println(F("10-bit ADC quantizer initialized."));
}

void loop() {
    // Read analog voltage (returns 0 to 1023)
    int rawVal = analogRead(POT_PIN);
    float voltage = rawVal * (5.0 / 1023.0);
    
    Serial.print(F("Raw Count: "));
    Serial.print(rawVal);
    Serial.print(F(" | Quantized Voltage: "));
    Serial.println(voltage);
    
    delay(500); // Poll every 500ms
}
`;
  }

  if (topicName.toLowerCase().includes('millis') || topicName.toLowerCase().includes('timing') || topicName.toLowerCase().includes('non-blocking') || topicName.toLowerCase().includes('delay')) {
    return `// Arduino Sketch: ${topicName}
// Description: ${topicDesc}

unsigned long previousSensorMillis = 0;
const long sensorInterval = 250; // Read sensors every 250ms

void setup() {
    Serial.begin(115200);
    Serial.println(F("Non-blocking scheduler running."));
}

void loop() {
    unsigned long currentMillis = millis();
    
    // Check elapsed duration without locking CPU loop
    if (currentMillis - previousSensorMillis >= sensorInterval) {
        previousSensorMillis = currentMillis;
        
        // Execute timed non-blocking task: ${topicName}
        Serial.println(F("[SCHEDULER] Reading sensors and transmitting telemetry data."));
    }
    
    // Other lightweight background routines can run here with 100% responsiveness!
}
`;
  }

  if (topicName.toLowerCase().includes('wifi') || topicName.toLowerCase().includes('esp32') || topicName.toLowerCase().includes('web') || topicName.toLowerCase().includes('server')) {
    return `// ESP32 Arduino Sketch: ${topicName}
// Description: ${topicDesc}
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "ESP32_WiFi_Syllabus";
const char* password = "password123";

WebServer server(80);

void handleRoot() {
    String page = "<h1>ESP32 Topic Server</h1><p>Topic: ${topicName}</p>";
    server.send(200, "text/html", page);
}

void setup() {
    Serial.begin(115200);
    WiFi.softAP(ssid, password);
    
    // Connect route handlers
    server.on("/", handleRoot);
    server.begin();
    
    Serial.print("Local AP IP Address: ");
    Serial.println(WiFi.softAPIP());
}

void loop() {
    server.handleClient(); // Process background socket events
}
`;
  }

  // Fallback generic Arduino code
  return `// Arduino Dynamic Sketch: ${topicName}
// Spec: ${topicDesc}

void setup() {
    Serial.begin(115200);
    Serial.println(F("Initializing Syllabus sketch: ${cleanName}"));
}

void loop() {
    // Implement topic guidelines
    Serial.println(F("Executing loop for: ${cleanName}"));
    delay(1000);
}
`;
}

/**
 * Dynamically constructs code specifically tailored to the selected Raspberry Pi / Pico topic.
 */
function generateRaspberryPiCode(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');

  if (topicName.toLowerCase().includes('pico') || topicName.toLowerCase().includes('rp2040') || topicName.toLowerCase().includes('sdk') || topicName.toLowerCase().includes('multicore') || topicName.toLowerCase().includes('pio')) {
    return `// Raspberry Pi Pico C/C++ SDK: ${topicName}
// Description: ${topicDesc}
#include <stdio.h>
#include "pico/stdlib.h"
#include "pico/multicore.h"

// Core 1 entry worker routine
void core1_worker_thread() {
    while (true) {
        // Pop commands sent from Core 0 via hardware mailbox
        uint32_t cmd = multicore_fifo_pop_blocking();
        uint32_t res = cmd * 2; // Process calculations
        
        // Push processed data back
        multicore_fifo_push_blocking(res);
    }
}

int main() {
    stdio_init_all();
    
    // Launch worker thread on physical secondary core 1
    multicore_launch_core1(core1_worker_thread);
    
    const uint ONBOARD_LED_PIN = 25;
    gpio_init(ONBOARD_LED_PIN);
    gpio_set_dir(ONBOARD_LED_PIN, GPIO_OUT);
    
    while (true) {
        gpio_put(ONBOARD_LED_PIN, 1);
        sleep_ms(200);
        gpio_put(ONBOARD_LED_PIN, 0);
        sleep_ms(800);
    }
}
`;
  }

  return `# Raspberry Pi Linux Python: ${topicName}
# Description: ${topicDesc}
import time
import os

try:
    from gpiozero import LED, Button
    status_led = LED(17)
    trigger_btn = Button(2)
except ImportError:
    print("Pre-requisite warning: Run on Raspberry Pi hardware to access GPIO ports.")
    status_led = None
    trigger_btn = None

def run_linux_embedded_loop():
    print("--- Booting Raspberry Pi OS Daemon ---")
    print("Topic Focus: ${topicName}")
    print("OS Release Details:", os.uname().release)
    
    if status_led and trigger_btn:
        print("GPIO lines bound. Listen for button events...")
        trigger_btn.when_pressed = status_led.toggle
        while True:
            time.sleep(1)
    else:
        # Simulated console outputs
        for i in range(5):
            print(f"[DAEMON] Running background diagnostics iteration {i+1}...")
            time.sleep(0.5)

if __name__ == "__main__":
    run_linux_embedded_loop()
`;
}

/**
 * Dynamically constructs Python code specifically tailored to the selected Python topic.
 */
function generatePythonCode(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');
  const funcName = cleanName.toLowerCase().split(/\s+/).join('_');

  let imports = `import sys\nimport time\n`;
  let body = '';

  if (topicName.toLowerCase().includes('memory') || topicName.toLowerCase().includes('ref') || topicName.toLowerCase().includes('cache') || topicName.toLowerCase().includes('type')) {
    body = `def ${funcName}():\n    # Dynamic memory reference check for: ${topicName}\n    print("--- Executing: ${topicName} Memory Scan ---")\n    payload = {"data": "${topicName}", "desc": "${topicDesc.replace(/"/g, '\\"')}"}\n    \n    # Check pointer locations\n    addr = id(payload)\n    ref_count = sys.getrefcount(payload)\n    print(f"Object RAM Address: {hex(addr)}")\n    print(f"CPython reference count of object: {ref_count}")\n    \n    # Reference alias bind\n    alias = payload\n    print(f"Reference count after alias bind: {sys.getrefcount(payload)}")\n`;
  } else if (topicName.toLowerCase().includes('list') || topicName.toLowerCase().includes('array') || topicName.toLowerCase().includes('comprehension') || topicName.toLowerCase().includes('mutability')) {
    body = `def ${funcName}():\n    # Sequence manipulation matching: ${topicName}\n    print("--- Running: ${topicName} List Processor ---")\n    sensors_db = ["ADC_1", "ADC_2", "I2C_TEMP", "SPI_FLASH", "GPIO_STATUS"]\n    \n    # Modern list comprehension extraction\n    active_channels = [ch for ch in sensors_db if "ADC" in ch or "TEMP" in ch]\n    print(f"Configured buses: {sensors_db}")\n    print(f"Active telemetry channels filtered: {active_channels}")\n    \n    # Append elements dynamically\n    sensors_db.append("UART_DEBUG")\n    print(f"Updated sensor array mapping: {sensors_db}")\n`;
  } else if (topicName.toLowerCase().includes('dict') || topicName.toLowerCase().includes('hash') || topicName.toLowerCase().includes('key') || topicName.toLowerCase().includes('set')) {
    body = `def ${funcName}():\n    # Key-value hash map analysis matching: ${topicName}\n    print("--- Analysing: ${topicName} Hash Tables ---")\n    register_map = {\n        "GPIOA_MODER": 0x40020000,\n        "GPIOA_ODR": 0x40020014,\n        "GPIOB_MODER": 0x40020400,\n        "GPIOB_ODR": 0x40020414\n    }\n    \n    print("Physical registers mapping hash keys:")\n    for key, value in register_map.items():\n        k_hash = hash(key)\n        print(f"Register: {key:12} | RAM Hex: {hex(value)} | System Hash: {k_hash}")\n`;
  } else if (topicName.toLowerCase().includes('class') || topicName.toLowerCase().includes('oop') || topicName.toLowerCase().includes('object') || topicName.toLowerCase().includes('inheritance') || topicName.toLowerCase().includes('polymorphism')) {
    body = `class ${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}:\n    """\n    OOP Representation of: ${topicName}\n    Description: ${topicDesc}\n    """\n    def __init__(self, node_id, baud_rate):\n        self.node_id = node_id\n        self.baud_rate = baud_rate\n        self._is_active = True\n        \n    def get_status_report(self):\n        return f"[NODE {self.node_id}] Baud: {self.baud_rate} bps | State: {'ACTIVE' if self._is_active else 'STANDBY'}"\n\ndef run_oop_diagnostics():\n    print("--- Initializing: ${topicName} ---")\n    controller = ${cleanName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}("CORE_M0", 115200)\n    print(controller.get_status_report())\n`;
  } else if (topicName.toLowerCase().includes('thread') || topicName.toLowerCase().includes('concurrency') || topicName.toLowerCase().includes('lock') || topicName.toLowerCase().includes('gil')) {
    imports = `import threading\nimport time\n`;
    body = `def ${funcName}():\n    # Multi-threaded execution trace matching: ${topicName}\n    print("--- Spawning Threads for: ${topicName} ---")\n    shared_resource_lock = threading.Lock()\n    counter = 0\n    \n    def safe_increment(thread_id):\n        nonlocal counter\n        with shared_resource_lock:\n            print(f"[Thread {thread_id}] Acquired mutual exclusion lock.")\n            time.sleep(0.01)\n            counter += 1\n            print(f"[Thread {thread_id}] Incremented count to {counter}. Releasing lock.")\n            \n    threads = [threading.Thread(target=safe_increment, args=(i,)) for i in range(3)]\n    for t in threads: t.start()\n    for t in threads: t.join()\n    print(f"Thread execution complete. Final value: {counter}")\n`;
  } else if (topicName.toLowerCase().includes('file') || topicName.toLowerCase().includes('io') || topicName.toLowerCase().includes('serialization') || topicName.toLowerCase().includes('json')) {
    imports = `import json\n`;
    body = `def ${funcName}():\n    # File streaming and JSON serialization matching: ${topicName}\n    print("--- Running: ${topicName} Streamer ---")\n    payload = {\n        "topic_name": "${topicName}",\n        "description": "${topicDesc.replace(/"/g, '\\"')}",\n        "baud_spec": 115200,\n        "active_ports": ["USART1", "I2C1"]\n    }\n    \n    # Serialize payload\n    json_output = json.dumps(payload, indent=4)\n    print("Serialized JSON stream data:")\n    print(json_output)\n    \n    # Decode payload\n    reparsed = json.loads(json_output)\n    print(f"Decoded Topic Verification: {reparsed['topic_name']}")\n`;
  } else {
    body = `def ${funcName}():\n    # Standard routine designed for: ${topicName}\n    print("--- Executing Routine: ${topicName} ---")\n    print("Specs: ${topicDesc}")\n    print("Dynamic status parameters check: COMPLETE")\n`;
  }

  const execFuncName = topicName.toLowerCase().includes('class') ? 'run_oop_diagnostics' : funcName;
  return `${imports}\n${body}\nif __name__ == "__main__":\n    ${execFuncName}()\n`;
}

/**
 * Dynamically constructs standard C code specifically tailored to the selected C topic.
 */
function generateCCode(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');
  const funcName = cleanName.toLowerCase().split(/\s+/).join('_');

  if (topicName.toLowerCase().includes('pointer') || topicName.toLowerCase().includes('address') || topicName.toLowerCase().includes('dereference') || topicName.toLowerCase().includes('arithmetic')) {
    return `// Standard C study: ${topicName}
// Description: ${topicDesc}
#include <stdio.h>

void pointers_swapper(int *a_ptr, int *b_ptr) {
    // Dereference pointer address targets to read and write variables values
    int temp = *a_ptr;
    *a_ptr = *b_ptr;
    *b_ptr = temp;
}

int main(void) {
    int active_reading = 100;
    int target_reading = 200;
    
    printf("--- Executing Pointer Trace for: ${topicName} ---\\n");
    printf("Initial parameters: A=%d, B=%d\\n", active_reading, target_reading);
    
    // Pass references
    pointers_swapper(&active_reading, &target_reading);
    printf("Post swapper variables values: A=%d, B=%d\\n", active_reading, target_reading);
    
    return 0;
}
`;
  }

  if (topicName.toLowerCase().includes('memory') || topicName.toLowerCase().includes('heap') || topicName.toLowerCase().includes('malloc') || topicName.toLowerCase().includes('free')) {
    return `// Standard C study: ${topicName}
// Description: ${topicDesc}
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("--- Dynamic Memory Validation: ${topicName} ---\\n");
    
    // Allocate contiguous heap block of memory safely
    int *samples_buffer = (int *) malloc(5 * sizeof(int));
    if (samples_buffer == NULL) {
        fprintf(stderr, "Fatal Heap Allocation Error: Memory Full!\\n");
        return 1;
    }
    
    // Assign buffer indices
    for (int i = 0; i < 5; i++) {
        samples_buffer[i] = i * 1024;
    }
    
    printf("Heap Allocation Checked: OK | Dynamic buffer filled successfully.\\n");
    
    // Release resources immediately to prevent memory leak
    free(samples_buffer);
    samples_buffer = NULL;
    
    return 0;
}
`;
  }

  // Fallback C standard template
  return `// Standard C Syllabus: ${topicName}
// Spec: ${topicDesc}
#include <stdio.h>

int main(void) {
    printf("--- System C Drill: ${topicName} ---\\n");
    printf("Executing standard C structures compiled under GCC.\\n");
    return 0;
}
`;
}

/**
 * Dynamically constructs C++ code specifically tailored to the selected C++ topic.
 */
function generateCppCode(topicName: string, topicDesc: string): string {
  const cleanName = topicName.replace(/[^a-zA-Z0-9\s]+/g, '');

  if (topicName.toLowerCase().includes('raii') || topicName.toLowerCase().includes('destructor') || topicName.toLowerCase().includes('lock') || topicName.toLowerCase().includes('resource')) {
    return `// Modern C++ Study: ${topicName}
// Description: ${topicDesc}
#include <iostream>
#include <string>

class ResourceGuard {
private:
    std::string _resName;
public:
    // Acquire resource on constructor bind
    ResourceGuard(std::string name) : _resName(name) {
        std::cout << "[RAII] ACQUIRING hardware resource lock: " << _resName << std::endl;
    }
    
    // Release resource on destructor trigger
    ~ResourceGuard() {
        std::cout << "[RAII] RELEASE-DESTRUCTOR trigger: releasing resource: " << _resName << std::endl;
    }
};

void run_critical_scope() {
    ResourceGuard guard("SPI_BUS_CONTROLLER");
    std::cout << "Inside active code scope... processing register routines." << std::endl;
}

int main() {
    std::cout << "--- Initializing ${topicName} ---" << std::endl;
    run_critical_scope();
    std::cout << "Completed." << std::endl;
    return 0;
}
`;
  }

  if (topicName.toLowerCase().includes('smart') || topicName.toLowerCase().includes('ptr') || topicName.toLowerCase().includes('unique') || topicName.toLowerCase().includes('shared')) {
    return `// Modern C++ Study: ${topicName}
// Description: ${topicDesc}
#include <iostream>
#include <memory>
#include <string>

class TelemetryNode {
public:
    TelemetryNode() { std::cout << "Telemetry Node Allocated in Heap SRAM." << std::endl; }
    ~TelemetryNode() { std::cout << "Telemetry Node Safely Destructed." << std::endl; }
    void ping() { std::cout << "Node ping verified." << std::endl; }
};

int main() {
    std::cout << "--- Executing: ${topicName} smart pointers ---" << std::endl;
    {
        // unique_ptr enforces exclusive ownership and automatic scoping deletes
        std::unique_ptr<TelemetryNode> node = std::make_unique<TelemetryNode>();
        node->ping();
    } // destructor invoked automatically here
    
    std::cout << "Scope closed." << std::endl;
    return 0;
}
`;
  }

  // Fallback C++ standard template
  return `// Modern C++ Syllabus: ${topicName}
// Spec: ${topicDesc}
#include <iostream>

int main() {
    std::cout << "--- Dynamic C++ Core: ${topicName} ---" << std::endl;
    std::cout << "Executable C++17 compilation frame ready." << std::endl;
    return 0;
}
`;
}

/**
 * Highly customized, programmatic lesson, theory, and simulator generator
 * that produces fully tailored educational assets dynamically.
 */
export function generateDynamicLesson(
  track: string,
  chapterNum: number,
  chapterName: string,
  topicId: string,
  topicName: string,
  topicDesc: string
): GeneratedLesson {
  const cleanTrack = track.toLowerCase();
  
  // Extract topic index
  const idMatch = topicId.match(/^([^_]+)_(.+)_t(\d+)$/);
  const topicIdx = idMatch ? parseInt(idMatch[3], 10) : 1;

  // Choose appropriate visualType
  let visualType = 'basics_animation';
  if (topicName.toLowerCase().includes('list') || topicName.toLowerCase().includes('array') || topicName.toLowerCase().includes('queue') || topicName.toLowerCase().includes('stack')) {
    visualType = 'collections_animation';
  } else if (topicName.toLowerCase().includes('loop') || topicName.toLowerCase().includes('while') || topicName.toLowerCase().includes('thread') || topicName.toLowerCase().includes('task')) {
    visualType = 'loops_animation';
  }

  // Generate dynamic matching code
  let code = '';
  switch (cleanTrack) {
    case 'python':
      code = generatePythonCode(topicName, topicDesc);
      break;
    case 'rtos':
      code = generateRtosCode(topicName, topicDesc);
      break;
    case 'stm32':
      code = generateStm32Code(topicName, topicDesc);
      break;
    case 'arduino':
      code = generateArduinoCode(topicName, topicDesc);
      break;
    case 'raspberry-pi':
      code = generateRaspberryPiCode(topicName, topicDesc);
      break;
    case 'c':
      code = generateCCode(topicName, topicDesc);
      break;
    case 'cpp':
      code = generateCppCode(topicName, topicDesc);
      break;
    default:
      code = `// Study: ${topicName}\n`;
  }

  // WordPress-style highly rich dynamic theory markdown builder
  let theory = `## Chapter ${chapterNum}: ${chapterName}\n`;
  theory += `### Deep-Dive Masterclass: ${topicName}\n\n`;
  
  theory += `> **Executive Syllabus Brief:**\n`;
  theory += `> ${topicDesc}\n\n`;

  theory += `#### 1. Core Mechanics & Technical Architecture\n`;
  
  if (cleanTrack === 'python') {
    theory += `In the Python environment, objects undergo reference management in the underlying **CPython Interpreter virtual evaluation stack**. Every variable acts as an active binding handle pointing directly to a \`PyObject\` struct allocation in Heap SRAM.\n\n`;
    theory += `* **Reference Tracking mechanics**: Allocations automatically scale reference pointers. When an active scope terminates or variables are deleted, the system decrements the reference counter. When it drops to zero, garbage collection is executed instantly.\n`;
    theory += `* **The CPython Hash Table compact layout**: Dictionary and Set lookups utilize highly optimized hash indices. The collision resolution handles index hashing offsets to preserve O(1) performance.\n\n`;
    
    theory += `| CPython Layer | Memory Speed | System Allocation Model |\n`;
    theory += `| :--- | :--- | :--- |\n`;
    theory += `| **Variable Binding** | O(1) Local lookup | Pointer bindings stored on active execution stack |\n`;
    theory += `| **Garbage Collector** | O(N) Generations scan | Doubly-linked generational traversal blocks (Gen 0/1/2) |\n`;
    theory += `| **Compact Hash Table** | O(1) Amortized | Contiguous indices array mapped directly to memory pools |\n\n`;
  } else if (cleanTrack === 'rtos') {
    theory += `In a Real-Time Operating System, predictability and deterministic task transitions are prioritized over raw core processing speeds.\n\n`;
    theory += `* **Task Control Block (TCB)**: Maintains execution contexts, stack pointers, task priorities, and current scheduler execution states (Running, Ready, Blocked, Suspended).\n`;
    theory += `* **Preemptive scheduling timeline limits**: The highest-priority task in a Ready state is immediately context-switched to the active CPU core, preempting lower-priority threads instantly.\n\n`;

    theory += `| Scheduling State | CPU Context Placement | RAM Footprint Allocation |\n`;
    theory += `| :--- | :--- | :--- |\n`;
    theory += `| **Running** | Active CPU Registers | Entire Task Stack Frame allocated in SRAM |\n`;
    theory += `| **Ready** | Queued on Scheduler list | Task TCB stored in memory awaiting context switch |\n`;
    theory += `| **Blocked** | Yielded awaiting timer/event | Suspended; awakened by peripheral interrupt signaling |\n\n`;
  } else if (cleanTrack === 'stm32') {
    theory += `The STM32 microcontroller, based on the high-performance ARM Cortex-M processor architecture, operates through direct hardware register manipulations over high-speed AMBA buses (AHB/APB).\n\n`;
    theory += `* **Memory-Mapped Registers**: Peripheral configuration occurs by writing binary values to specific physical memory offsets (e.g. GPIO Port A, High-Speed Timers, and ADC registers).\n`;
    theory += `* **Reset & Clock Control (RCC) gating**: Before writing to any hardware peripheral block, its clock bus must be explicitly enabled via RCC registers to activate hardware gates.\n\n`;

    theory += `| MCU Bus Line | Maximum Speed | Typical Connected Peripherals |\n`;
    theory += `| :--- | :--- | :--- |\n`;
    theory += `| **AHB1 / AHB2** | Up to 180 MHz | DMA Engine, Flash controllers, GPIO ports registers |\n`;
    theory += `| **APB2 (High-Speed)** | Up to 90 MHz | High-Resolution Timers (TIM1), ADC, SPI1 registers |\n`;
    theory += `| **APB1 (Low-Speed)** | Up to 45 MHz | Low-Speed Timers (TIM2), I2C, SPI2, USART2 registers |\n\n`;
  } else if (cleanTrack === 'arduino') {
    theory += `The Arduino ecosystem abstracts complex bare-metal microchip register maps into clean, object-oriented C++ classes (e.g., the Wiring core library).\n\n`;
    theory += `* **Super-Loop Architecture**: Programs execute a single-run \`setup()\` function to configure clocks and pins, followed by a non-blocking execution loop \`loop()\` repeating indefinitely.\n`;
    theory += `* **Non-blocking timing routines**: Comparing timestamps with \`millis()\` avoids CPU lockout, keeping background routines completely responsive.\n\n`;

    theory += `| Wiring Core API | Bare-metal Equivalent | CPU Processing Overhead |\n`;
    theory += `| :--- | :--- | :--- |\n`;
    theory += `| \`digitalWrite()\` | PORTx / DDRx registers | Microseconds (adds wrapper safety) |\n`;
    theory += `| \`analogRead()\` | ADMUX / ADCSRA registers | ~100 microseconds (polls ADC conversion) |\n`;
    theory += `| \`delay()\` | Nested software loops | **100% CPU lock** (blocks active threads) |\n\n`;
  } else if (cleanTrack === 'raspberry-pi') {
    theory += `Raspberry Pi embedded applications interface through single-board computers running full Linux operating systems, or bare-metal microcontrollers like the RP2040.\n\n`;
    theory += `* **The RP2040 Dual-Core SMP processor**: Runs two independent ARM Cortex-M0+ cores, communicating through thread-safe hardware FIFO mailboxes.\n`;
    theory += `* **Linux gpiod Kernel interface**: Accessing physical GPIO lines on SBC hosts uses kernel-managed file descriptors for event listening.\n\n`;

    theory += `| Hardware Platform | Speed Clock | RAM Memory Size | Core Execution Model |\n`;
    theory += `| :--- | :--- | :--- | :--- |\n`;
    theory += `| **Raspberry Pi OS** | 1.5 GHz+ | 1GB - 8GB DDR | Multi-user protected virtual page maps |\n`;
    theory += `| **RP2040 (Pico SDK)** | 133 MHz | 264KB SRAM | Bare-metal direct physical register access |\n\n`;
  } else {
    theory += `Standard compilation of high-efficiency native programs requires manual memory boundaries control and register performance tuning.\n\n`;
    theory += `* **Stack allocation**: Lightweight frame structures, local references, and routine parameters are stored and deleted automatically on the compiler's stack pointer limits.\n`;
    theory += `* **Heap allocation**: Requesting dynamic memory blocks (via \`malloc()\` or \`std::make_unique\`) writes values directly to heap arenas, demanding manual disposal to avoid memory leak hazards.\n\n`;
  }

  theory += `#### 2. Advanced Diagnostic Steps & Best Practices\n`;
  theory += `To ensure production safety and maximize processor performance under the **${topicName}** model, developers must follow these engineering guidelines:\n\n`;
  theory += `1. **Isolate Resource Scopes**: Localize parameters inside thread scopes to avoid concurrent access conflicts and cache invalidations.\n`;
  theory += `2. **Prevent Priority Inversions**: Always implement priority inheritance protocols or mutex timeouts when guarding shared hardware peripherals.\n`;
  theory += `3. **Profile Clock Cycles**: Keep Interrupt Service Routines (ISRs) minimal. Always defer bulk calculations to worker tasks.\n\n`;
  
  theory += `#### 3. Interactive Topic Sandbox Drill\n`;
  theory += `Consult the **Simulation** and **Code** tabs to observe the step-by-step visual trace of variables, registers, and memory pointers during dynamic runs. Adjust the simulation inputs on the left panel to test execution bounds interactively!`;

  // Dynamic simulation tracing steps
  const simulationSpec: SimulationStep[] = [
    {
      title: '1. Prepare Register Context',
      description: `Bootstrapping CPU environment for [${track.toUpperCase()}]. Setting up active thread stack frames, clearing general registers, and mapping address boundaries for ${topicName}.`,
      highlightCode: cleanTrack === 'python' ? `sys.getrefcount()` : `HAL_Init()`,
      stateSummary: `SRAM: OK | CPU Core: IDLE | Registers: R0=0x00000000 | Ticks: 0`
    },
    {
      title: '2. Allocate Object Stack Space',
      description: `Allocating local variables and compiling symbols. Binding pointer references in the memory pool specifically for "${topicName}".`,
      highlightCode: cleanTrack === 'python' ? `data_structure = {...}` : `MX_GPIO_Init()`,
      stateSummary: `Stack Pointer: 0x200003E0 | Active Node variables loaded | Register R1 maps data address`
    },
    {
      title: '3. Execute ALU Core Calculations',
      description: `Running arithmetic and logical operations. Interfacing physical registers, checking interrupt flags, and processing ${topicName} algorithms.`,
      highlightCode: cleanTrack === 'python' ? `sys.getrefcount(data_structure)` : `HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5)`,
      stateSummary: `ALU: Active | Processing state variables... | Port registers toggled successfully`
    },
    {
      title: '4. Teardown Frame & Return',
      description: `Reclaiming stack spaces, restoring saved CPU registers, disposing unused buffers, and completing the ${topicName} diagnostic run.`,
      highlightCode: cleanTrack === 'python' ? `print("Verification complete.")` : `return 0`,
      stateSummary: `CPU: Power Saving Mode | Heap: Cleared | Execution result: SUCCESS`
    }
  ];

  // Dynamic quiz tailored to the topic
  const quiz: QuizQuestion[] = [
    {
      question: `What is the primary architectural goal of ${topicName}?`,
      options: [
        'To optimize execution predictability, memory footprints, and resource safety parameters.',
        'To bypass all compiler rules and write arbitrary pointers directly into system memories.',
        'To slow down execution speeds and maximize thread-switching latencies.',
        'To replace local compilation with high-overhead remote virtual servers.'
      ],
      correctIndex: 0,
      explanation: `The core objective of ${topicName} is to improve runtime predictability, memory efficiency, and deterministic execution profiles.`
    },
    {
      question: `Which of the following describes a key engineering risk associated with ${topicName}?`,
      options: [
        'Unbounded priority inversions, heap leak fragmentations, or garbage collection lockouts.',
        'Adding too many comments in source code, which slows down binary execution speeds.',
        'Using standard non-blocking loops instead of complete CPU-locking delay cycles.',
        'Failing to declare visual styling constraints inside global variables.'
      ],
      correctIndex: 0,
      explanation: `Primary failure modes include memory leakage, priority inversions under multi-threaded schedulers, or unexpected execution pauses during garbage collection cycles.`
    },
    {
      question: `How should a developer best configure parameters for ${topicName}?`,
      options: [
        'Maintain local scopes, utilize non-blocking API patterns, check pointer bounds, and release resources immediately.',
        'Store all parameters in global caches and never call deallocation routines.',
        'Always implement busy-wait polling loops to ensure the CPU is running at 100% workloads.',
        'Add infinite nested loops inside interrupt routines to maximize sensor conversions.'
      ],
      correctIndex: 0,
      explanation: `Best practices dictate localizing parameters to thread contexts, checking bounds, using non-blocking cooperations, and ensuring complete heap resources cleanup.`
    }
  ];

  return {
    theory,
    code,
    visualType,
    simulationSpec,
    quiz
  };
}
