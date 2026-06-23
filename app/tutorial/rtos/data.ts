export interface ApiTopic {
  id: string;
  name: string;
  module: 'tasks' | 'queues' | 'semaphores' | 'timers' | 'events' | 'buffers';
  prototype: string;
  summary: string;
  parameters: Array<{ name: string; desc: string }>;
  returnValues: string;
  notes: string;
  example: string;
  diagramType: 'task_lifecycle' | 'task_static' | 'task_delay' | 'queue_send_recv' | 'queue_create' | 'mutex_lock' | 'semaphore_counting' | 'timer_running' | 'event_bits' | 'buffer_stream';
}

export const API_TOPICS: ApiTopic[] = [
  {
    id: 'xTaskCreate',
    name: 'xTaskCreate()',
    module: 'tasks',
    prototype: 'BaseType_t xTaskCreate(\n  TaskFunction_t pvTaskCode,\n  const char * const pcName,\n  unsigned short usStackDepth,\n  void *pvParameters,\n  UBaseType_t uxPriority,\n  TaskHandle_t *pxCreatedTask\n);',
    summary: 'Creates a new task instance. Each task requires RAM that is used to hold the task state (the task control block, or TCB) and used by the task as its stack. Memory is automatically allocated from the FreeRTOS heap.',
    parameters: [
      { name: 'pvTaskCode', desc: 'Pointer to the task entry function. Tasks must run in an infinite loop and must never attempt to exit or return.' },
      { name: 'pcName', desc: 'A descriptive name for the task, mainly used to facilitate debugging. Truncated if longer than configMAX_TASK_NAME_LEN.' },
      { name: 'usStackDepth', desc: 'The size of the task stack specified in words, not bytes. On 32-bit architectures, a stack depth of 100 equates to 400 bytes.' },
      { name: 'pvParameters', desc: 'Pointer to parameters that will be passed into the created task function.' },
      { name: 'uxPriority', desc: 'The priority level at which the task will execute. Ranges from 0 (lowest priority) up to (configMAX_PRIORITIES - 1).' },
      { name: 'pxCreatedTask', desc: 'Used to pass out a handle to the created task, which can then be referenced in other API calls (such as changing priority or deleting).' }
    ],
    returnValues: 'pdPASS: Indicates that the task has been created successfully.\nerrCOULD_NOT_ALLOCATE_REQUIRED_MEMORY: Indicates that there was insufficient heap memory available for FreeRTOS to allocate the task data structures and stack.',
    notes: 'configSUPPORT_DYNAMIC_ALLOCATION must be set to 1 in FreeRTOSConfig.h (or left undefined) for this function to be available.',
    example: `// Example task function
void vSampleTask(void *pvParameters) {
    int *piValue = (int *) pvParameters;
    for(;;) {
        // Task processing logic here
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}

void vCreateSampleTask(void) {
    TaskHandle_t xHandle = NULL;
    int iArg = 42;
    
    if (xTaskCreate(
        vSampleTask,     // Task function
        "SampleTask",    // Debug name
        128,             // Stack depth in words
        &iArg,           // Parameter
        2,               // Priority
        &xHandle         // Handle out
    ) != pdPASS) {
        // Handle memory allocation failure
    }
}`,
    diagramType: 'task_lifecycle'
  },
  {
    id: 'xTaskCreateStatic',
    name: 'xTaskCreateStatic()',
    module: 'tasks',
    prototype: 'TaskHandle_t xTaskCreateStatic(\n  TaskFunction_t pvTaskCode,\n  const char * const pcName,\n  uint32_t ulStackDepth,\n  void *pvParameters,\n  UBaseType_t uxPriority,\n  StackType_t * const puxStackBuffer,\n  StaticTask_t * const pxTaskBuffer\n);',
    summary: 'Creates a new task instance, but allows the stack RAM and Task Control Block RAM to be statically defined at compile time by the application writer rather than dynamically allocated from the FreeRTOS heap.',
    parameters: [
      { name: 'pvTaskCode', desc: 'Pointer to the task entry function.' },
      { name: 'pcName', desc: 'Descriptive text name for task debugging.' },
      { name: 'ulStackDepth', desc: 'The size of the task stack specified in words, matching the dimension of the puxStackBuffer array.' },
      { name: 'pvParameters', desc: 'Pointer to parameters passed into the created task.' },
      { name: 'uxPriority', desc: 'Priority level at which the task executes (0 to configMAX_PRIORITIES - 1).' },
      { name: 'puxStackBuffer', desc: 'Must point to an array of StackType_t variables that has at least ulStackDepth indexes. This array is used as the task\'s stack and must be persistent.' },
      { name: 'pxTaskBuffer', desc: 'Must point to a variable of type StaticTask_t. This variable is used to hold the created task\'s TCB structure and must be persistent.' }
    ],
    returnValues: 'NULL: The task could not be created because puxStackBuffer or pxTaskBuffer was NULL.\nAny other value: The handle of the created task (successfully initialized).',
    notes: 'configSUPPORT_STATIC_ALLOCATION must be set to 1 in FreeRTOSConfig.h for this function to be available.',
    example: `#define STACK_SIZE 200

// Persistent static buffers for stack and TCB
static StaticTask_t xTaskBuffer;
static StackType_t xStack[ STACK_SIZE ];

void vSampleTask(void *pvParameters) {
    for(;;) {
        // Loop code
    }
}

void vCreateStaticTask(void) {
    TaskHandle_t xHandle = NULL;
    
    xHandle = xTaskCreateStatic(
        vSampleTask,   // Task function
        "StaticTask",  // Debug name
        STACK_SIZE,    // Stack size
        NULL,          // Parameters
        1,             // Priority
        xStack,        // Stack Buffer
        &xTaskBuffer   // TCB Buffer
    );
}`,
    diagramType: 'task_static'
  },
  {
    id: 'vTaskDelay',
    name: 'vTaskDelay()',
    module: 'tasks',
    prototype: 'void vTaskDelay( const TickType_t xTicksToDelay );',
    summary: 'Places the calling task into the Blocked state for a fixed number of tick interrupts. The task does not consume any CPU processing cycles while blocked.',
    parameters: [
      { name: 'xTicksToDelay', desc: 'The number of tick interrupts that the calling task will remain in the Blocked state. Can be converted from milliseconds using the pdMS_TO_TICKS() macro.' }
    ],
    returnValues: 'None.',
    notes: 'INCLUDE_vTaskDelay must be set to 1 in FreeRTOSConfig.h for this function to be available.',
    example: `void vDelayExample(void *pvParameters) {
    const TickType_t xDelayTime = pdMS_TO_TICKS( 500 ); // 500ms delay
    for(;;) {
        // Toggle GPIO pins or query sensors
        toggleLED();
        
        // Put task into Blocked state
        vTaskDelay( xDelayTime );
    }
}`,
    diagramType: 'task_delay'
  },
  {
    id: 'vTaskDelayUntil',
    name: 'vTaskDelayUntil()',
    module: 'tasks',
    prototype: 'void vTaskDelayUntil(\n  TickType_t *pxPreviousWakeTime,\n  const TickType_t xTimeIncrement\n);',
    summary: 'Places the calling task into the Blocked state until an absolute time is reached. This is used by periodic tasks to achieve a constant execution frequency, compensating for jitter and execution drift.',
    parameters: [
      { name: 'pxPreviousWakeTime', desc: 'Pointer to a variable that holds the timestamp of when the task last left the Blocked state. Updated automatically inside the function.' },
      { name: 'xTimeIncrement', desc: 'The cycle period (frequency) specified in ticks. Usually defined using pdMS_TO_TICKS().' }
    ],
    returnValues: 'None.',
    notes: 'INCLUDE_vTaskDelayUntil must be set to 1 in FreeRTOSConfig.h for this function to be available.',
    example: `void vPeriodicTask(void *pvParameters) {
    TickType_t xLastWakeTime;
    const TickType_t xFrequency = pdMS_TO_TICKS( 50 ); // Execute exactly every 50ms
    
    // Initialize xLastWakeTime with current tick count
    xLastWakeTime = xTaskGetTickCount();
    
    for(;;) {
        // Block until exactly 50ms has elapsed since the last wake time
        vTaskDelayUntil( &xLastWakeTime, xFrequency );
        
        // Perform periodic control algorithm or high-precision sampling
        performControlLoop();
    }
}`,
    diagramType: 'task_delay'
  },
  {
    id: 'vTaskDelete',
    name: 'vTaskDelete()',
    module: 'tasks',
    prototype: 'void vTaskDelete( TaskHandle_t pxTask );',
    summary: 'Deletes an instance of a task. Deleted tasks no longer exist and cannot enter the Running state. If pxTask is NULL, the calling task deletes itself.',
    parameters: [
      { name: 'pxTask', desc: 'The handle of the task being deleted. Pass NULL to delete the active calling task.' }
    ],
    returnValues: 'None.',
    notes: 'The idle task is responsible for freeing memory allocated by the kernel (TCB and stack) for deleted tasks. Ensure the idle task is allocated CPU time if deleting tasks.',
    example: `void vSelfDeletingTask(void *pvParameters) {
    // Perform transient configuration or firmware update steps
    initializeConfig();
    
    // Complete task execution and cleanly delete itself
    vTaskDelete( NULL );
}

void vMasterTask(void *pvParameters) {
    TaskHandle_t xWorkerHandle = NULL;
    
    xTaskCreate(vWorker, "Worker", 128, NULL, 1, &xWorkerHandle);
    
    // Later, terminate the worker
    if (xWorkerHandle != NULL) {
        vTaskDelete(xWorkerHandle);
    }
}`,
    diagramType: 'task_lifecycle'
  },
  {
    id: 'xQueueCreate',
    name: 'xQueueCreate()',
    module: 'queues',
    prototype: 'QueueHandle_t xQueueCreate(\n  UBaseType_t uxQueueLength,\n  UBaseType_t uxItemSize\n);',
    summary: 'Creates a new thread-safe Queue and returns a handle. Queues are used to pass data payloads safely between tasks, and between tasks and hardware interrupts.',
    parameters: [
      { name: 'uxQueueLength', desc: 'The maximum number of items that the queue being created can hold at any one time.' },
      { name: 'uxItemSize', desc: 'The size, in bytes, of each data item that can be stored in the queue (e.g., sizeof(int), sizeof(Message_t)).' }
    ],
    returnValues: 'NULL: Queue could not be created because of insufficient heap memory.\nAny other value: Handle to the created queue instance.',
    notes: 'configSUPPORT_DYNAMIC_ALLOCATION must be set to 1 in FreeRTOSConfig.h.',
    example: `typedef struct {
    uint8_t ucSensorID;
    float fValue;
} SensorData_t;

QueueHandle_t xSensorQueue = NULL;

void vAppInit(void) {
    // Create a queue capable of holding 10 SensorData_t structs
    xSensorQueue = xQueueCreate( 10, sizeof( SensorData_t ) );
    if (xSensorQueue == NULL) {
        // Allocation failure handling
    }
}`,
    diagramType: 'queue_create'
  },
  {
    id: 'xQueueSend',
    name: 'xQueueSend()',
    module: 'queues',
    prototype: 'BaseType_t xQueueSend(\n  QueueHandle_t xQueue,\n  const void * pvItemToQueue,\n  TickType_t xTicksToWait\n);',
    summary: 'Sends (writes) an item to the back of a queue. This function must not be called from an Interrupt Service Routine (ISR) — use xQueueSendFromISR() instead.',
    parameters: [
      { name: 'xQueue', desc: 'The handle of the queue to which the data is being sent.' },
      { name: 'pvItemToQueue', desc: 'A pointer to the item to be copied into the queue. The size of the item copied is the item size defined when the queue was created.' },
      { name: 'xTicksToWait', desc: 'The maximum time the task should remain in the Blocked state to wait for space to become available on the queue if it is already full. Pass portMAX_DELAY to wait indefinitely.' }
    ],
    returnValues: 'pdPASS: Data was successfully sent to the queue.\nerrQUEUE_FULL: The queue was full and the timeout period expired before space became available.',
    notes: 'FreeRTOS copy-by-value queue implementation: data is copied into the queue storage area, meaning local variables can be safely modified or go out of scope after being sent.',
    example: `void vTelemetryTask(void *pvParameters) {
    SensorData_t xReading = { .ucSensorID = 1, .fValue = 23.42f };
    
    for(;;) {
        // Post reading to queue, blocking for max 10 ticks if full
        if (xQueueSend( xSensorQueue, &xReading, 10 ) != pdPASS) {
            // Log queue full error
        }
        vTaskDelay(pdMS_TO_TICKS(100));
    }
}`,
    diagramType: 'queue_send_recv'
  },
  {
    id: 'xQueueReceive',
    name: 'xQueueReceive()',
    module: 'queues',
    prototype: 'BaseType_t xQueueReceive(\n  QueueHandle_t xQueue,\n  void *pvBuffer,\n  TickType_t xTicksToWait\n);',
    summary: 'Receives (reads) an item from a queue. The received item is removed from the queue.',
    parameters: [
      { name: 'xQueue', desc: 'The handle of the queue from which the data is being received.' },
      { name: 'pvBuffer', desc: 'Pointer to the buffer into which the received item is copied.' },
      { name: 'xTicksToWait', desc: 'The maximum time the task should block to wait for an item if the queue is empty. Pass portMAX_DELAY to block indefinitely.' }
    ],
    returnValues: 'pdPASS: Item successfully received and copied to pvBuffer.\nerrQUEUE_EMPTY: The queue remained empty throughout the block period.',
    notes: 'Never call from an ISR — use xQueueReceiveFromISR() instead.',
    example: `void vProcessTask(void *pvParameters) {
    SensorData_t xRxBuffer;
    
    for(;;) {
        // Block indefinitely until telemetry arrives
        if (xQueueReceive( xSensorQueue, &xRxBuffer, portMAX_DELAY ) == pdPASS) {
            // Process reading
            if (xRxBuffer.fValue > 50.0f) {
                triggerOverheatAlert();
            }
        }
    }
}`,
    diagramType: 'queue_send_recv'
  },
  {
    id: 'xSemaphoreCreateBinary',
    name: 'xSemaphoreCreateBinary()',
    module: 'semaphores',
    prototype: 'SemaphoreHandle_t xSemaphoreCreateBinary( void );',
    summary: 'Creates a binary semaphore and returns a handle. Binary semaphores are used for task synchronization or mutual exclusion.',
    parameters: [],
    returnValues: 'NULL: Semaphore could not be created because of insufficient heap.\nAny other value: Handle to the created binary semaphore.',
    notes: 'A binary semaphore created with this function starts in the "empty" state, meaning it must first be "given" using xSemaphoreGive() before it can be successfully "taken" using xSemaphoreTake().',
    example: `SemaphoreHandle_t xBinarySemaphore = NULL;

void vAppStart(void) {
    xBinarySemaphore = xSemaphoreCreateBinary();
    if (xBinarySemaphore != NULL) {
        // Successfully created semaphore, starts un-given!
    }
}`,
    diagramType: 'mutex_lock'
  },
  {
    id: 'xSemaphoreCreateMutex',
    name: 'xSemaphoreCreateMutex()',
    module: 'semaphores',
    prototype: 'SemaphoreHandle_t xSemaphoreCreateMutex( void );',
    summary: 'Creates a mutex-type semaphore and returns a handle. Mutexes are used for mutual exclusion, guarding shared hardware resources, and incorporate a priority inheritance mechanism to prevent priority inversion.',
    parameters: [],
    returnValues: 'NULL: Mutex could not be created because of insufficient heap memory.\nAny other value: Handle to the created mutex.',
    notes: 'Mutexes created with this function start in the "given" (available) state, so the first task to call xSemaphoreTake() will successfully obtain ownership immediately.',
    example: `SemaphoreHandle_t xUartMutex = NULL;

void vUartWrite(const char *pcString) {
    if (xSemaphoreTake( xUartMutex, portMAX_DELAY ) == pdTRUE) {
        // Thread-safe access to UART peripheral
        printf("%s\\n", pcString);
        
        // Relinquish mutex ownership
        xSemaphoreGive( xUartMutex );
    }
}

void vInitApp(void) {
    xUartMutex = xSemaphoreCreateMutex();
}`,
    diagramType: 'mutex_lock'
  },
  {
    id: 'xSemaphoreTake',
    name: 'xSemaphoreTake()',
    module: 'semaphores',
    prototype: 'BaseType_t xSemaphoreTake(\n  SemaphoreHandle_t xSemaphore,\n  TickType_t xTicksToWait\n);',
    summary: 'Takes (claims/obtains) a semaphore or mutex. The calling task must successfully claim the semaphore before accessing a shared resource or synchronized routine.',
    parameters: [
      { name: 'xSemaphore', desc: 'The handle of the semaphore or mutex being taken.' },
      { name: 'xTicksToWait', desc: 'The maximum time the task should remain in Blocked state to wait for the semaphore to become available. Use portMAX_DELAY to wait indefinitely.' }
    ],
    returnValues: 'pdPASS / pdTRUE: Successfully obtained the semaphore.\npdFAIL / pdFALSE: The timeout expired before the semaphore became available.',
    notes: 'Must not be called from an ISR.',
    example: `void vHardwareHandler(void *pvParameters) {
    for(;;) {
        // Block indefinitely waiting for high-speed hardware ready interrupt signal
        if (xSemaphoreTake( xBinarySemaphore, portMAX_DELAY ) == pdTRUE) {
            // Interrupt occurred! Read hardware FIFO registers
            readHardwareBuffer();
        }
    }
}`,
    diagramType: 'mutex_lock'
  },
  {
    id: 'xSemaphoreGive',
    name: 'xSemaphoreGive()',
    module: 'semaphores',
    prototype: 'BaseType_t xSemaphoreGive( SemaphoreHandle_t xSemaphore );',
    summary: 'Gives (releases/posts) a semaphore or mutex, signaling waiting tasks or unlocking a critical resource.',
    parameters: [
      { name: 'xSemaphore', desc: 'The handle of the semaphore or mutex being given.' }
    ],
    returnValues: 'pdPASS / pdTRUE: Successfully gave the semaphore back.\npdFAIL / pdFALSE: The giving task does not currently hold the mutex, or the binary semaphore is already available.',
    notes: 'Do not use inside ISR handlers — use xSemaphoreGiveFromISR() instead.',
    example: `// Example ISR handler releasing a binary semaphore to unblock a task
void IRAM_ATTR handleEmergencyStopISR(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    // Give the semaphore to unblock the safety task
    xSemaphoreGiveFromISR( xSafetySemaphore, &xHigherPriorityTaskWoken );
    
    // Force a context switch if a higher priority safety task was unblocked
    portYIELD_FROM_ISR( xHigherPriorityTaskWoken );
}`,
    diagramType: 'mutex_lock'
  },
  {
    id: 'xTimerCreate',
    name: 'xTimerCreate()',
    module: 'timers',
    prototype: 'TimerHandle_t xTimerCreate(\n  const char *pcTimerName,\n  const TickType_t xTimerPeriod,\n  const UBaseType_t uxAutoReload,\n  void * const pvTimerID,\n  TimerCallbackFunction_t pxCallbackFunction\n);',
    summary: 'Creates a new software timer instance. Creating a timer does not automatically start it running.',
    parameters: [
      { name: 'pcTimerName', desc: 'A descriptive text name for debugging.' },
      { name: 'xTimerPeriod', desc: 'The period of the timer specified in ticks (e.g. pdMS_TO_TICKS(1000) for a 1-second timer).' },
      { name: 'uxAutoReload', desc: 'Set to pdTRUE to create a recurring timer. Set to pdFALSE to create a one-shot timer.' },
      { name: 'pvTimerID', desc: 'A unique identifier assigned to the timer. Can be updated dynamically or used to identify the timer in a shared callback.' },
      { name: 'pxCallbackFunction', desc: 'The function pointer called when the timer expires. Callback functions must execute within the Daemon task context.' }
    ],
    returnValues: 'NULL: Software timer could not be created because of insufficient heap.\nAny other value: Handle of the successfully created software timer.',
    notes: 'configUSE_TIMERS must be set to 1 in FreeRTOSConfig.h for software timers to be available.',
    example: `TimerHandle_t xSafetyTimer = NULL;

// Callback function executed when the timer expires
void vSafetyCallback(TimerHandle_t xTimer) {
    // Timer expired! Trigger offline failsafe routine
    triggerSafetyFailsafe();
}

void vStartMonitor(void) {
    // Create a 2-second one-shot watchdog software timer
    xSafetyTimer = xTimerCreate(
        "Watchdog",
        pdMS_TO_TICKS(2000),
        pdFALSE, // One-shot
        (void *) 0,
        vSafetyCallback
    );
    
    if (xSafetyTimer != NULL) {
        // Start running the timer
        xTimerStart(xSafetyTimer, 0);
    }
}`,
    diagramType: 'timer_running'
  },
  {
    id: 'xTimerStart',
    name: 'xTimerStart()',
    module: 'timers',
    prototype: 'BaseType_t xTimerStart(\n  TimerHandle_t xTimer,\n  TickType_t xTicksToWait\n);',
    summary: 'Starts running a software timer. If the timer is already active, starting it will recalculate its expiry time relative to the call timestamp.',
    parameters: [
      { name: 'xTimer', desc: 'The handle of the software timer to start.' },
      { name: 'xTicksToWait', desc: 'Maximum block time if the timer command queue is full. Usually 0.' }
    ],
    returnValues: 'pdPASS: Command sent successfully to the timer daemon task.\npdFAIL: Command failed because the timer command queue was full.',
    notes: 'Commands are processed asynchronously by the Daemon task. Priority is set via configTIMER_TASK_PRIORITY.',
    example: `void vControlActivity(void) {
    // Refresh watchdog timer to prevent safety callback execution
    if (xTimerStart( xSafetyTimer, 0 ) == pdPASS) {
        // Watchdog feed successfully dispatched
    }
}`,
    diagramType: 'timer_running'
  },
  {
    id: 'xEventGroupCreate',
    name: 'xEventGroupCreate()',
    module: 'events',
    prototype: 'EventGroupHandle_t xEventGroupCreate( void );',
    summary: 'Creates a new event group instance. Event groups let tasks block to wait for logical combinations of single-bit event flags (such as bitwise AND/OR operations).',
    parameters: [],
    returnValues: 'NULL: Event group could not be created because of insufficient heap.\nAny other value: Handle of the created event group.',
    notes: 'The number of bits available in an event group is 8 if configUSE_16_BIT_TICKS is set to 1, or 24 if set to 0.',
    example: `EventGroupHandle_t xSystemEventGroup = NULL;

void vSystemInit(void) {
    xSystemEventGroup = xEventGroupCreate();
    if (xSystemEventGroup == NULL) {
        // Out of memory handler
    }
}`,
    diagramType: 'event_bits'
  },
  {
    id: 'xEventGroupSetBits',
    name: 'xEventGroupSetBits()',
    module: 'events',
    prototype: 'EventBits_t xEventGroupSetBits(\n  EventGroupHandle_t xEventGroup,\n  const EventBits_t uxBitsToSet\n);',
    summary: 'Sets bits (flags) within an event group. Unblocks any tasks waiting for the specified bit pattern combinations.',
    parameters: [
      { name: 'xEventGroup', desc: 'The handle of the event group being updated.' },
      { name: 'uxBitsToSet', desc: 'A bitwise value indicating which flags to set. E.g., setting flags 1 and 3 (0x01 | 0x08 = 0x09).' }
    ],
    returnValues: 'The value of the event group flags at the time the call returned.',
    notes: 'Never call from an ISR — use xEventGroupSetBitsFromISR() instead.',
    example: `#define BIT_WIFI_CONNECTED  ( 1 << 0 )
#define BIT_MQTT_READY      ( 1 << 1 )

void vNetworkTask(void *pvParameters) {
    for(;;) {
        establishWiFi();
        // Signal WiFi connection succeeded by setting the bit
        xEventGroupSetBits( xSystemEventGroup, BIT_WIFI_CONNECTED );
        
        establishMQTT();
        // Signal MQTT connection ready
        xEventGroupSetBits( xSystemEventGroup, BIT_MQTT_READY );
        
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}`,
    diagramType: 'event_bits'
  },
  {
    id: 'xEventGroupWaitBits',
    name: 'xEventGroupWaitBits()',
    module: 'events',
    prototype: 'EventBits_t xEventGroupWaitBits(\n  EventGroupHandle_t xEventGroup,\n  const EventBits_t uxBitsToWaitFor,\n  const BaseType_t xClearOnExit,\n  const BaseType_t xWaitForAllBits,\n  TickType_t xTicksToWait\n);',
    summary: 'Suspends the calling task in the Blocked state to wait for a specific logical combination of flags within an event group.',
    parameters: [
      { name: 'xEventGroup', desc: 'The handle of the event group.' },
      { name: 'uxBitsToWaitFor', desc: 'A bitwise mask of flags to test.' },
      { name: 'xClearOnExit', desc: 'Set to pdTRUE to automatically clear the tested flags back to 0 before exiting. Set to pdFALSE to leave flags unchanged.' },
      { name: 'xWaitForAllBits', desc: 'Set to pdTRUE for a logical AND test (all flags must be set). Set to pdFALSE for a logical OR test (any flag set).' },
      { name: 'xTicksToWait', desc: 'The maximum duration to wait in the Blocked state. Pass portMAX_DELAY to block indefinitely.' }
    ],
    returnValues: 'The value of the event group flags at the time the task successfully left Blocked state or the timeout expired.',
    notes: 'Allows synchronizing multiple tasks concurrently without the memory overhead of multiple binary semaphores.',
    example: `void vProcessTask(void *pvParameters) {
    EventBits_t uxBits;
    for(;;) {
        // Block indefinitely until WIFI AND MQTT are both established and active
        uxBits = xEventGroupWaitBits(
            xSystemEventGroup,
            BIT_WIFI_CONNECTED | BIT_MQTT_READY,
            pdTRUE,  // Clear on exit
            pdTRUE,  // Wait for ALL bits
            portMAX_DELAY
        );
        
        if ((uxBits & (BIT_WIFI_CONNECTED | BIT_MQTT_READY)) == (BIT_WIFI_CONNECTED | BIT_MQTT_READY)) {
            // Both ready! Safe to stream cloud telemetry
            streamTelemetry();
        }
    }
}`,
    diagramType: 'event_bits'
  }
];
