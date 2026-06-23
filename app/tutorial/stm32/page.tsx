'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cpu, ChevronRight, BookOpen, Settings, Zap, ArrowLeft, RefreshCw, Layers, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Stm32TutorialPage() {
  const [activeTab, setActiveTab] = useState<'gpio' | 'timers' | 'adc' | 'dma'>('gpio');

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
            <span className="text-white font-medium">STM32 ARM</span>
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
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Hardware Syllabus
                </span>
                <span className="text-xs text-gray-400">• Level: Intermediate</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                STM32 ARM Cortex-M <span className="text-brand">Microcontrollers</span>
              </h1>
              <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
                Step-by-step firmware engineering with STM32CubeIDE & HAL. Master low-level peripherals, interrupt service routines, hardware DMA channels, and professional system clock configurations.
              </p>
            </div>
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Cpu className="h-8 w-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Track Estimated Time</p>
                <p className="text-sm font-bold text-white font-mono">~5 Hours Study</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Syllabus Outline</h3>
            {[
              { id: 'gpio', label: '1. GPIO & EXTI Interrupts', icon: Zap },
              { id: 'timers', label: '2. Timers & PWM Channels', icon: Clock },
              { id: 'adc', label: '3. Multi-Channel ADC', icon: RefreshCw },
              { id: 'dma', label: '4. Direct Memory Access (DMA)', icon: Layers }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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

          {/* Main Module Content */}
          <div className="lg:col-span-3">
            <div className="bg-panel border border-panel-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
              
              {activeTab === 'gpio' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Zap className="text-emerald-400 h-7 w-7" />
                    GPIO Pin Configuration & EXTI Interrupts
                  </h2>
                  
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Every microcontroller interaction starts with **General Purpose Input Output (GPIO)**. In modern STM32 boards, GPIO pins are highly multiplexed, meaning they can serve as digital inputs, digital outputs, analog signals, or alternative peripheral pins (such as USART, SPI, or I2C).
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">STM32 GPIO Output Configuration and Toggle (CubeHAL)</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include "stm32f4xx_hal.h"

// Hardware function to initialize GPIO Pin C13 (built-in LED)
void MX_GPIO_Init(void) {
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    // 1. Enable the GPIOC clock in the Peripheral Clock Controller
    __HAL_RCC_GPIOC_CLK_ENABLE();

    // 2. Configure the output parameters
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;       // Push-Pull Mode
    GPIO_InitStruct.Pull = GPIO_NOPULL;               // No internal pull-up/pull-down
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;      // Slew-rate speed
    
    // 3. Commit configuration into standard peripheral registers
    HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}

int main(void) {
    // Reset of all peripherals, Initializes the Flash interface and the Systick
    HAL_Init();
    
    // Initialize GPIO Pin
    MX_GPIO_Init();
    
    while (1) {
        // Toggle the built-in LED state
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
        
        // Blocking delay of 500 milliseconds (based on internal Systick timer)
        HAL_Delay(500);
    }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'timers' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Clock className="text-emerald-400 h-7 w-7" />
                    Hardware Timers & PWM Generation
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Timers are independent hardware counters that increment or decrement synchronized to the system bus clock. You can use timers to trigger precise interrupts at exact intervals or output a **Pulse Width Modulation (PWM)** signal to control motor speeds or LED brightness.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Formula to calculate Timer Update Frequency</h3>
                  <div className="p-5 bg-background/50 border border-panel-border/50 rounded-2xl font-mono text-sm text-center">
                    Frequency = Timer_Clock / ((Prescaler + 1) * (Period_ARR + 1))
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Timer Configuration and PWM Duty-Cycle Writing</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include "stm32f4xx_hal.h"

TIM_HandleTypeDef htim2; // Timer handle

void MX_TIM2_Init(void) {
    TIM_OC_InitTypeDef sConfigOC = {0};

    // Enable TIMER2 peripheral clock
    __HAL_RCC_TIM2_CLK_ENABLE();

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 83;                    // Divide 84MHz APB1 clock down to 1MHz
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;  // Count upwards
    htim2.Init.Period = 19999;                    // Set period to 20,000 counts (yields 50Hz PWM)
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    HAL_TIM_PWM_Init(&htim2);

    // Configure PWM Channel 1 Parameters
    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 1500;                       // Set initial duty pulse width (1.5ms)
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
    HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_1);
}

void SetServoAngle(int angle) {
    // Map angle (0 to 180 degrees) to PWM pulse length (1000 to 2000 counts)
    uint32_t pulse = 1000 + ((angle * 1000) / 180);
    
    // Update the Compare register on Channel 1 directly to alter duty cycle
    __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, pulse);
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'adc' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <RefreshCw className="text-emerald-400 h-7 w-7" />
                    Multi-Channel Analog-to-Digital Conversion (ADC)
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    To read continuous analog levels (from thermistors, potentiometers, or voltage sensors), the STM32 uses a high-speed Successive Approximation (SAR) **ADC**. You can configure multiple channels to poll sequentially.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Polled ADC Reading Code Pattern</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include "stm32f4xx_hal.h"

ADC_HandleTypeDef hadc1;

uint32_t Read_Analog_Sensor(void) {
    uint32_t adcVal = 0;
    
    // 1. Trigger the ADC peripheral conversion sequence
    HAL_ADC_Start(&hadc1);
    
    // 2. Wait for conversion to complete (polling with 10ms timeout)
    if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK) {
        // 3. Extract the digitized representation (usually 12-bit, 0-4095 range)
        adcVal = HAL_ADC_GetValue(&hadc1);
    }
    
    // Stop conversion to save power
    HAL_ADC_Stop(&hadc1);
    return adcVal;
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'dma' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Layers className="text-emerald-400 h-7 w-7" />
                    Direct Memory Access (DMA)
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Reading high-speed inputs (like an ADC conversion chain or SPI telemetry stream) using the CPU results in massive software overhead. **Direct Memory Access (DMA)** is an independent hardware module that transfers data directly between peripherals and SRAM without any CPU involvement, boosting overall system speed.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Circular Buffer DMA Transfer Sequence</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include "stm32f4xx_hal.h"

#define BUFFER_SIZE 64
uint32_t adcBuffer[BUFFER_SIZE]; // Destination buffer in SRAM

extern ADC_HandleTypeDef hadc1;

void Start_Continuous_DMA_Acquisition(void) {
    // Kickstart ADC in DMA Circular Mode
    // The hardware will fill adcBuffer automatically in the background!
    HAL_ADC_Start_DMA(&hadc1, (uint32_t*)adcBuffer, BUFFER_SIZE);
}

// Complete transfer ISR callback (Triggers when the buffer is completely filled)
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
    if(hadc->Instance == ADC1) {
        // Safe to read or calculate mathematical mean across adcBuffer
        uint32_t sum = 0;
        for(int i = 0; i < BUFFER_SIZE; i++) {
            sum += adcBuffer[i];
        }
        uint32_t averageVal = sum / BUFFER_SIZE;
        
        // Log average without slowing down continuous ADC operations
    }
}`}
                    </pre>
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
