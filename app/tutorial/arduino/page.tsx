'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Terminal, ChevronRight, BookOpen, Clock, Code2, Rss, ArrowLeft, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export default function ArduinoTutorialPage() {
  const [activeTab, setActiveTab] = useState<'basics' | 'millis' | 'interrupts' | 'esp32'>('basics');

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
            <span className="text-white font-medium">Arduino & ESP32</span>
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
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Prototyping Syllabus
                </span>
                <span className="text-xs text-gray-400">• Level: Beginner</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight mb-4">
                Arduino & ESP32 <span className="text-brand">Prototyping</span>
              </h1>
              <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
                Build fast, robust IoT prototypes with C++ and standard physical electronics. Learn professional non-blocking techniques, high-speed ISR handlers, and deploy wireless web servers on ESP32.
              </p>
            </div>
            <div className="p-4 bg-panel border border-panel-border rounded-2xl shrink-0 flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Terminal className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Track Estimated Time</p>
                <p className="text-sm font-bold text-white font-mono">~4 Hours Study</p>
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
              { id: 'basics', label: '1. Anatomy & Core Structure', icon: BookOpen },
              { id: 'millis', label: '2. Non-blocking with millis()', icon: Clock },
              { id: 'interrupts', label: '3. Hardware Interrupts (ISR)', icon: Code2 },
              { id: 'esp32', label: '4. ESP32 Wi-Fi & Web Servers', icon: Rss }
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
              
              {activeTab === 'basics' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <BookOpen className="text-cyan-400 h-7 w-7" />
                    Anatomy of Arduino Sketch
                  </h2>
                  
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Arduino sketches are based on C/C++ but hide standard boilerplate functions like <code className="text-brand font-mono">main()</code>. Behind the scenes, the toolchain compiles your code into the standard setup and execution loops.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">The Classic Framework Layout</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`// 1. Global Declarations
const int SENSOR_PIN = A0; // Declared globally
int rawVal = 0;

void setup() {
    // Triggers EXACTLY once when power is applied or reset button clicked
    Serial.begin(115200);           // Configure Serial baudrate
    pinMode(SENSOR_PIN, INPUT);      // Define ADC input pin
}

void loop() {
    // Triggers continuously in an infinite background loop
    rawVal = analogRead(SENSOR_PIN); 
    Serial.print("Sensor Telemetry: ");
    Serial.println(rawVal);
    
    delay(1000); // HALTS execution for 1000 milliseconds
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'millis' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Clock className="text-cyan-400 h-7 w-7" />
                    Non-blocking Code with millis()
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Using <code className="text-brand font-mono bg-background px-1 rounded">delay()</code> stops the entire CPU instruction flow. While in a delay, the MCU cannot poll sensors, handle serial traffic, or detect button clicks. The correct pattern is to track elapsed time with <code className="text-brand font-mono bg-background px-1 rounded">millis()</code>.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">The Blink Without Delay Paradigm</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`const int LED_PIN = 13;
int ledState = LOW;

unsigned long previousMillis = 0;   // Track last time the LED state was updated
const long interval = 500;          // Blink interval (milliseconds)

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    // Fetch current runtime duration since startup
    unsigned long currentMillis = millis();

    // Check if the difference matches the required interval
    if (currentMillis - previousMillis >= interval) {
        // Save the timestamp of this action
        previousMillis = currentMillis;

        // Invert the state of the LED
        ledState = (ledState == LOW) ? HIGH : LOW;
        digitalWrite(LED_PIN, ledState);
    }
    
    // We can run millions of other processes here completely unimpeded!
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'interrupts' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Code2 className="text-cyan-400 h-7 w-7" />
                    Hardware Interrupts (ISRs)
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    When detecting high-speed external inputs (such as encoder pulses or emergency stop signals), polling in the loop might miss the event. **Interrupt Service Routines (ISRs)** instantly halt normal program code to execute a handler block when a pin voltage state shifts.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Interrupt Service Rules</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>1. Keep the ISR function as short as humanly possible. No delays or Serial logging allowed inside!</li>
                    <li>2. Any global variable modified inside an ISR must be declared with the <code className="text-brand font-mono text-xs bg-background p-0.5 rounded">volatile</code> prefix to prevent compilation register optimization.</li>
                  </ul>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Interrupt Service Routine Code Structure</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`const int BUTTON_PIN = 2; // Pin supporting hardware interrupts
volatile int pressCount = 0; // Must be volatile

// The Interrupt Service Function
void IRAM_ATTR handleButtonPress() {
    pressCount++; // Simple increment operation
}

void setup() {
    Serial.begin(115200);
    pinMode(BUTTON_PIN, INPUT_PULLUP); // Active-Low button configurations
    
    // Attach interrupt to falling edge (High to Low transition)
    attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), handleButtonPress, FALLING);
}

void loop() {
    static int lastLoggedCount = 0;
    
    if (pressCount != lastLoggedCount) {
        lastLoggedCount = pressCount;
        Serial.print("Registered Presses: ");
        Serial.println(lastLoggedCount);
    }
}`}
                    </pre>
                  </div>
                </motion.div>
              )}

              {activeTab === 'esp32' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white border-b border-panel-border pb-3 flex items-center gap-3">
                    <Rss className="text-cyan-400 h-7 w-7" />
                    ESP32 Wi-Fi & Web Servers
                  </h2>

                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    The ESP32 is a powerful dual-core SoC with on-board Wi-Fi and Bluetooth. It runs standard Arduino libraries but enables building connected applications like direct REST interfaces and web telemetry dashboards.
                  </p>

                  <h3 className="text-lg font-bold font-heading text-white mt-8 mb-3">Local Wi-Fi Server Hosting Code</h3>
                  <div className="relative">
                    <pre className="bg-background/80 p-5 rounded-xl border border-panel-border/70 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed select-text">
{`#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "Your_WiFi_Network";
const char* password = "Your_WiFi_Password";

WebServer server(80); // Host on standard port 80

void handleRoot() {
    // Output html to client
    String html = "<html><body><h1>ESP32 Active Telemetry</h1>";
    html += "<p>Hall Effect Sensor Reading: " + String(hallRead()) + "</p>";
    html += "</body></html>";
    server.send(200, "text/html", html);
}

void setup() {
    Serial.begin(115200);
    
    // Begin Wi-Fi connection
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.print("\\nConnected! IP Address: ");
    Serial.println(WiFi.localIP());

    // Setup HTTP Route endpoints
    server.on("/", handleRoot);
    server.begin();
}

void loop() {
    // Handle incoming client HTTP requests
    server.handleClient();
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
