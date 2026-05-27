'use client';

import React from 'react';

interface LogoProps {
  layout?: 'horizontal' | 'vertical' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export default function Logo({
  layout = 'horizontal',
  size = 'md',
  className = '',
  onClick,
}: LogoProps) {
  // Determine dimensions based on size prop
  const iconClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 md:w-11 md:h-11',
    lg: 'w-16 h-16 md:w-20 md:h-20',
    xl: 'w-24 h-24 md:w-32 md:h-32',
  }[size];

  const textClasses = {
    sm: 'text-sm',
    md: 'text-normal',
    lg: 'text-xl',
    xl: 'text-2xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex select-none flex-shrink-0 items-center ${
        layout === 'vertical' ? 'flex-col text-center gap-3' : 'flex-row gap-3'
      } ${className}`}
    >
      {/* Hand-crafted high-resolution SVG Icon representing the logo */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconClasses} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      >
        <defs>
          {/* Main shield/house blue gradient */}
          <linearGradient id="shieldGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Golden glow circuit gradient */}
          <linearGradient id="goldCircuit" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Green accent gradient for growth arrow */}
          <linearGradient id="arrowGrad" x1="30" y1="70" x2="80" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#809A16" />
            <stop offset="50%" stopColor="#9ab91a" />
            <stop offset="100%" stopColor="#4d5c0d" />
          </linearGradient>
        </defs>

        {/* 1. LAYER 1: The Open Book at the bottom */}
        {/* Underlay shadow pages */}
        <path
          d="M 50 84 Q 32 72 12 76 Q 8 64 5 72 Q 28 58 50 71 Q 72 58 95 72 Q 92 64 88 76 Q 68 72 50 84 Z"
          fill="url(#shieldGrad)"
          opacity="0.35"
        />
        {/* Main outer pages */}
        <path
          d="M 50 88 C 28 72 14 62 5 75 C 10 52 28 44 50 57 R"
          stroke="url(#shieldGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 50 88 C 72 72 86 62 95 75 C 90 52 72 44 50 57"
          stroke="url(#shieldGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Layered book spine lines */}
        <path
          d="M 50 57 V 88"
          stroke="url(#shieldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* 2. LAYER 2: The Outer Hexagonal Tech / House Shield Outline */}
        <path
          d="M 50 12 L 82 34 L 82 66 L 50 58 L 18 66 L 18 34 Z"
          stroke="url(#shieldGrad)"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* 3. LAYER 3: Stylized Lightbulb Glow & Core Circuit Design */}
        {/* Lightbulb stem base */}
        <path
          d="M 44 51 Q 50 55 56 51 M 46 54 Q 50 57 54 54"
          stroke="url(#shieldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Core Chip (Microchip) in the center */}
        <rect
          x="41"
          y="30"
          width="18"
          height="18"
          rx="3"
          fill="#0f172a"
          stroke="url(#goldCircuit)"
          strokeWidth="2.5"
        />
        {/* Tiny CPU center core */}
        <rect x="46" y="35" width="8" height="8" rx="1.5" fill="url(#goldCircuit)" />
        
        {/* Chip Pin Connections/Traces */}
        {/* Left pins */}
        <path d="M 35 34 H 41 M 35 39 H 41 M 35 44 H 41" stroke="url(#shieldGrad)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Right pins */}
        <path d="M 59 34 H 65 M 59 39 H 65 M 59 44 H 65" stroke="url(#goldCircuit)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Top/Bottom trace extensions */}
        <path d="M 50 24 V 30 M 50 48 V 51" stroke="url(#shieldGrad)" strokeWidth="1.5" strokeLinecap="round" />

        {/* 4. LAYER 4: Circuit nodes branching outwards (Left Cyan, Right Orange) */}
        {/* Left branch */}
        <path
          d="M 35 39 C 27 39 25 31 16 35"
          stroke="url(#shieldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="35" r="3" fill="#38bdf8" />
        <path
          d="M 35 44 C 27 48 24 53 23 58"
          stroke="url(#shieldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="23" cy="58" r="3" fill="#38bdf8" />

        {/* Right branch */}
        <path
          d="M 65 39 C 73 39 75 31 84 35"
          stroke="url(#goldCircuit)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <circle cx="84" cy="35" r="3" fill="#fb923c" />
        <path
          d="M 65 44 C 73 48 76 53 77 58"
          stroke="url(#goldCircuit)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <circle cx="77" cy="58" r="3" fill="#fb923c" />

        {/* 5. LAYER 5: Rising Diagonal Success/Growth Arrow (Bright Accent) */}
        <path
          d="M 32 64 L 72 24"
          stroke="#809A16"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 58 24 H 72 V 38"
          stroke="#809A16"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Render text if layout is not 'icon' */}
      {layout !== 'icon' && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'}`}>
          <div className="flex flex-row items-center gap-1.5 font-heading leading-tight">
            <span className="font-bold tracking-tight text-white uppercase font-sans text-lg md:text-xl">
              Electronics
            </span>
            <span className="font-black tracking-tight text-brand uppercase font-sans text-lg md:text-xl">
              Gyan
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] tracking-[0.25em] text-gray-400 uppercase font-mono font-medium -mt-0.5">
            LEARN | BUILD | INNOVATE
          </span>
        </div>
      )}
    </div>
  );
}
