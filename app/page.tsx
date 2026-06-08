import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowRight, Microchip, Cpu, Code2, PenTool } from 'lucide-react';
import Logo from '@/components/Logo';
import AiChatBot from '@/components/AiChatBot';
import ProjectSlideshow from '@/components/ProjectSlideshow';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      
      {/* Slideshow Top Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12">
        <ProjectSlideshow />
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-center flex flex-col items-center">
        <Logo layout="vertical" size="xl" className="mb-6 lg:mb-8" />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight mb-6 text-white max-w-5xl mx-auto leading-tight">
          Welcome to <br className="hidden md:block"/> 
          <span className="text-brand">Electronics Gyan</span>
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-400 mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
          Your ultimate destination to learn, build, and innovate. We share comprehensive engineering projects, complete with Bill of Materials (BOMs), circuit schematics, source code, and step-by-step tutorials to help you turn ideas into reality.
        </p>

        {/* Global Search Bar */}
        <div className="w-full max-w-2xl mx-auto relative group mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 sm:py-4 bg-panel border-2 border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all shadow-lg text-sm sm:text-base"
            placeholder="Search electronics projects, tutorials, or components..."
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button className="bg-brand hover:bg-brand-light text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="w-full bg-panel py-20 border-t border-b border-panel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-4">What We Do</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              At Electronics Gyan, we are passionate about bridging the gap between theoretical knowledge and practical engineering. We provide open-source resources, project ideas, and detailed guides for creators and makers around the world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <CategoryCard 
              title="Electronics & IoT"
              description="Microcontrollers, sensor interfacing, and end-to-end IoT devices."
              icon={<Cpu className="h-8 w-8 text-brand" />}
              href="/projects#electronics"
            />
            
            <CategoryCard 
              title="Embedded Systems"
              description="Deep dive into RTOS, ARM Cortex, and bare-metal programming."
              icon={<Microchip className="h-8 w-8 text-brand" />}
              href="/projects#electronics"
            />
            
            <CategoryCard 
              title="Software & Cloud"
              description="Backend frameworks, scalable cloud deployment, and API design."
              icon={<Code2 className="h-8 w-8 text-brand" />}
              href="/projects#software"
            />

            <CategoryCard 
              title="Mechanical & CAD"
              description="3D modeling, structural analysis, and robotics design."
              icon={<PenTool className="h-8 w-8 text-brand" />}
              href="/projects#mechanical"
            />

          </div>
        </div>
      </section>

      {/* Recent Projects Preview */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold font-heading text-white">Latest Projects</h2>
          <Link href="/projects" className="flex items-center gap-2 text-brand hover:text-brand-light font-medium transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mock Project Cards */}
          <ProjectCard 
            title="Smart Home Environmental Monitor"
            category="IoT & Embedded"
            date="Oct 12, 2026"
            image="https://picsum.photos/seed/pcb1/600/400"
          />
          <ProjectCard 
            title="Brushless Motor Driver Design"
            category="Analog Circuits"
            date="Oct 08, 2026"
            image="https://picsum.photos/seed/pcb2/600/400"
          />
          <ProjectCard 
            title="Automated Robotic Arm with OpenCV"
            category="Robotics"
            date="Oct 01, 2026"
            image="https://picsum.photos/seed/robotics/600/400"
          />
        </div>
      </section>
      <AiChatBot />
    </div>
  );
}

function CategoryCard({ title, description, icon, href }: { title: string, description: string, icon: React.ReactNode, href: string }) {
  return (
    <Link href={href} className="flex flex-col p-6 bg-background rounded-2xl border border-panel-border hover:border-brand/50 hover:shadow-lg hover:-translate-y-1 transition-all group">
      <div className="p-3 bg-panel border border-panel-border rounded-xl w-fit mb-4 group-hover:bg-brand/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}

function ProjectCard({ title, category, date, image }: { title: string, category: string, date: string, image: string }) {
  return (
    <div className="flex flex-col bg-panel border border-panel-border rounded-2xl overflow-hidden hover:border-gray-600 transition-colors cursor-pointer group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-xs font-medium text-white rounded-full border border-white/10">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-3">{date}</p>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand transition-colors line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-400">View complete BOM, circuit schematics, and source code for this project.</p>
      </div>
    </div>
  );
}
