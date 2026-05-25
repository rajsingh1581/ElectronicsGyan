import Link from 'next/link';
import { Lightbulb, Cpu, Code2, PenTool, Zap, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function IdeasPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="p-4 bg-brand/10 border border-brand/20 rounded-2xl mb-6 inline-flex">
          <Lightbulb className="h-12 w-12 text-brand" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-white mb-6">
          Latest Engineering <span className="text-brand">Project Ideas</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          Get a list of the latest engineering project ideas waiting to be implemented. Discover innovative final year engineering project ideas and new topics across electronics, software, mechanical, electrical, and android development.
        </p>
      </div>

      {/* Grid of Idea Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        
        <IdeaCategoryCard
          title="Electronics Project Ideas"
          icon={<Cpu className="h-8 w-8 text-brand" />}
          href="/ideas/electronics"
          ideas={[
            "Fingerprint Based Bank Locker System",
            "RFID Based Attendance System",
            "Arduino Based Home Automation",
            "Smart Dustbin With IoT Notifications",
            "Voice Controlled Robotic Vehicle"
          ]}
        />

        <IdeaCategoryCard
          title="Electrical Project Ideas"
          icon={<Zap className="h-8 w-8 text-brand" />}
          href="/ideas/electrical"
          ideas={[
            "Solar Power Charge Controller",
            "Wireless Power Transfer System",
            "Grid Synchronization of Renewable Sources",
            "Overvoltage and Undervoltage Protection",
            "Smart Energy Meter with Billing"
          ]}
        />

        <IdeaCategoryCard
          title="Software Engineering Ideas"
          icon={<Code2 className="h-8 w-8 text-brand" />}
          href="/ideas/software"
          ideas={[
            "AI Patient Emotion Recognition System",
            "Blockchain Based Voting System",
            "Fake News Detection using Machine Learning",
            "E-Commerce Product Rating based on Sentiment",
            "Online Toll Plaza Rating System"
          ]}
        />

        <IdeaCategoryCard
          title="Mechanical Engineering"
          icon={<PenTool className="h-8 w-8 text-brand" />}
          href="/ideas/mechanical"
          ideas={[
            "Pneumatic Sheet Metal Cutting Machine",
            "Motorized Four Wheel Steering Mechanism",
            "Dual Rotor Wind Turbine Design",
            "Automatic Solar Panel Cleaning System",
            "Robotic Arm for Sorting Objects"
          ]}
        />

        <IdeaCategoryCard
          title="Android Project Ideas"
          icon={<Smartphone className="h-8 w-8 text-brand" />}
          href="/ideas/android"
          ideas={[
            "Android Based Home Security App",
            "Smart Parking Slot Booking System",
            "Women Security App with GPS Tracking",
            "College Event Management App",
            "Voice Based E-Mail for Visually Impaired"
          ]}
        />

        <IdeaCategoryCard
          title="Electronics & Communication"
          icon={<Cpu className="h-8 w-8 text-brand" />}
          href="/ideas/communication"
          ideas={[
            "Underground Cable Fault Locator",
            "Li-Fi Based Data Communication System",
            "Vehicle Tracking System via GPS/GSM",
            "Bluetooth Based Notice Board",
            "LoRa Based Wide Area Agriculture Monitor"
          ]}
        />

      </div>

      {/* CTA Section */}
      <div className="bg-panel border border-panel-border rounded-3xl p-10 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-heading text-white mb-4">Have your own innovative idea?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Share your concepts with the Electronics Gyan community. Our authors and engineers can help you build the full bill of materials, circutry, and code constraints.
        </p>
        <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-light transition-colors">
          Submit an Idea <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}

function IdeaCategoryCard({ title, icon, href, ideas }: { title: string, icon: React.ReactNode, href: string, ideas: string[] }) {
  return (
    <div className="bg-panel border border-panel-border rounded-2xl p-8 hover:border-brand/50 transition-all group flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-background rounded-xl border border-panel-border">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white font-heading">{title}</h3>
      </div>
      
      <ul className="space-y-4 mb-8 flex-1">
        {ideas.map((idea, idx) => (
          <li key={idx} className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-brand mr-3 shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm leading-relaxed">{idea}</span>
          </li>
        ))}
      </ul>

      <Link href={href} className="inline-flex items-center text-brand font-medium hover:text-brand-light transition-colors w-fit group-hover:underline underline-offset-4">
        Explore All {title.split(' ')[0]} Ideas <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </div>
  );
}
