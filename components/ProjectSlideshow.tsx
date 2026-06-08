'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    title: 'Advanced Circuit Board Design',
    category: 'Hardware',
  },
  {
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1600&q=80',
    title: 'Precision Soldering & Assembly',
    category: 'Prototyping',
  },
  {
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1600&q=80',
    title: 'Microcontroller Programming',
    category: 'Embedded Systems',
  },
  {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
    title: 'IoT System Integration',
    category: 'Electronics & IoT',
  },
  {
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80',
    title: 'Robotics & Automation',
    category: 'Mechanical & CAD',
  },
  {
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80',
    title: 'Custom PCB Fabrication',
    category: 'Hardware',
  },
  {
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    title: 'Server & Cloud Integration',
    category: 'Software & Cloud',
  },
];

export default function ProjectSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group shadow-2xl border border-panel-border">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          
          {/* Logo on the right side */}
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20">
            <div className="bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <Logo layout="horizontal" size="sm" className="hidden sm:flex" />
              <Logo layout="icon" size="sm" className="flex sm:hidden" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col items-start">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="px-3 py-1 bg-brand text-white text-xs font-bold uppercase tracking-wider rounded-full mb-3"
            >
              {slides[currentIndex].category}
            </motion.span>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white"
            >
              {slides[currentIndex].title}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-brand text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-brand text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentIndex ? 'bg-brand scale-125' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
