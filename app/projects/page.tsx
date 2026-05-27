import Link from 'next/link';
import { Cpu, PenTool, Activity, Terminal, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { electronicsProjectsList } from '@/lib/electronicsProjects';
import { mechanicalProjectsList } from '@/lib/mechanicalProjects';
import { softwareProjectsList } from '@/lib/softwareProjects';
import { instrumentationProjectsList } from '@/lib/instrumentationProjects';

const projectCategories = [
  {
    title: 'Electronics Projects',
    description: 'Embedded systems, IoT, robotics, and analog circuits. Complete with schematics and BOM.',
    icon: <Cpu className="h-8 w-8 text-brand" />,
    href: '/electronics',
    projects: [
      { name: 'Smart Home Environmental Monitor', date: 'Oct 12, 2026', image: 'https://picsum.photos/seed/pcb1/600/400' },
      { name: 'Brushless Motor Driver Design', date: 'Oct 08, 2026', image: 'https://picsum.photos/seed/pcb2/600/400' },
      { name: 'Automated Robotic Arm with OpenCV', date: 'Oct 01, 2026', image: 'https://picsum.photos/seed/robotics/600/400' },
    ]
  },
  {
    title: 'Mechanical Projects',
    description: 'CAD designs, automation, robotic kinematics, and structural analysis models.',
    icon: <PenTool className="h-8 w-8 text-brand" />,
    href: '/mechanical',
    projects: [
      { name: 'Dual Rotor Wind Turbine Design', date: 'Sep 28, 2026', image: 'https://picsum.photos/seed/mech1/600/400' },
      { name: 'Pneumatic Sheet Metal Cutter', date: 'Sep 15, 2026', image: 'https://picsum.photos/seed/mech2/600/400' },
      { name: 'Motorized Four Wheel Steering', date: 'Sep 02, 2026', image: 'https://picsum.photos/seed/mech3/600/400' },
    ]
  },
  {
    title: 'Instrumentation Projects',
    description: 'Industrial automation, sensor interfacing, and PLC communication networks.',
    icon: <Activity className="h-8 w-8 text-brand" />,
    href: '/instrumentation',
    projects: []
  },
  {
    title: 'Software Projects',
    description: 'Distributed systems, full-stack web platforms, and AI integrations.',
    icon: <Terminal className="h-8 w-8 text-brand" />,
    href: '/software',
    projects: []
  }
];

export default function ProjectsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-white mb-6">
          Engineering <span className="text-brand">Projects</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          Explore complete project hubs including Bill of Materials (BOMs), source code, schematics, and design specifications across multiple engineering disciplines.
        </p>
      </div>

      {projectCategories.map((category, idx) => (
        <section key={idx} id={category.title.split(' ')[0].toLowerCase()} className="mb-20 scroll-mt-24">
          <div className="flex justify-between items-end mb-8 border-b border-panel-border pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-panel rounded-xl border border-panel-border">
                {category.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold font-heading text-white">{category.title}</h2>
                <p className="text-gray-400 mt-1">{category.description}</p>
              </div>
            </div>
          </div>

          {category.title === 'Electronics Projects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {electronicsProjectsList.map((projectName, pIdx) => (
                <div key={pIdx} className="p-4 bg-panel border border-panel-border rounded-xl hover:border-gray-600 transition-colors cursor-pointer group flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand shrink-0"></div>
                  <span className="font-bold text-white group-hover:text-brand transition-colors">{projectName}</span>
                </div>
              ))}
            </div>
          ) : category.title === 'Mechanical Projects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mechanicalProjectsList.map((projectName, pIdx) => (
                <div key={pIdx} className="p-4 bg-panel border border-panel-border rounded-xl hover:border-gray-600 transition-colors cursor-pointer group flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand shrink-0"></div>
                  <span className="font-bold text-white group-hover:text-brand transition-colors">{projectName}</span>
                </div>
              ))}
            </div>
          ) : category.title === 'Instrumentation Projects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instrumentationProjectsList.map((projectName, pIdx) => (
                <div key={pIdx} className="p-4 bg-panel border border-panel-border rounded-xl hover:border-gray-600 transition-colors cursor-pointer group flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand shrink-0"></div>
                  <span className="font-bold text-white group-hover:text-brand transition-colors">{projectName}</span>
                </div>
              ))}
            </div>
          ) : category.title === 'Software Projects' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {softwareProjectsList.map((projectName, pIdx) => (
                <div key={pIdx} className="p-4 bg-panel border border-panel-border rounded-xl hover:border-gray-600 transition-colors cursor-pointer group flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand shrink-0"></div>
                  <span className="font-bold text-white group-hover:text-brand transition-colors">{projectName}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.projects.map((project, pIdx) => (
                <div key={pIdx} className="flex flex-col bg-panel border border-panel-border rounded-2xl overflow-hidden hover:border-gray-600 transition-colors cursor-pointer group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image src={project.image} alt={project.name} fill className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-xs font-medium text-white rounded-full border border-white/10">
                        {category.title.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-500 mb-2">{project.date}</p>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors line-clamp-2">{project.name}</h3>
                    <p className="text-sm text-gray-400">View complete BOM, circuit schematics, and source code for this project.</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white font-bold tracking-wide rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer text-center"
              id={`submit-requirements-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              Submit Requirements
            </Link>
          </div>
        </section>
      ))}

      {/* Floating Submit Requirements Button that moves/sticks with scroll */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <Link
          href="/contact"
          className="flex items-center gap-2.5 px-6 py-4 bg-pink-700 hover:bg-pink-800 active:bg-pink-900 text-white font-bold tracking-wide rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer max-w-xs text-center border border-white/20"
          id="floating-submit-requirements"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          Submit Requirements
        </Link>
      </div>

    </div>
  );
}
