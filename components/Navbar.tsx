'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Cpu, Lightbulb, Mail, Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/Logo';

// Navigation Data
const navItems = [
  {
    label: 'Projects',
    href: '/projects',
    icon: Cpu,
    highlight: true,
    subItems: [
      { label: 'Electronics', href: '/projects#electronics' },
      { label: 'Mechanical', href: '/projects#mechanical' },
      { label: 'Instrumentation', href: '/projects#instrumentation' },
      { label: 'Software', href: '/projects#software' },
    ],
  },
  {
    label: 'Ideas',
    href: '/ideas',
    icon: Lightbulb,
    subItems: [
      { label: 'Electronics', href: '/ideas/electronics' },
      { label: 'Electrical', href: '/ideas/electrical' },
      { label: 'Software', href: '/ideas/software' },
      { label: 'Mechanical', href: '/ideas/mechanical' },
      { label: 'Android', href: '/ideas/android' },
      { label: 'Communication', href: '/ideas/communication' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: Mail,
  },
  {
    label: 'Partner with us',
    href: '/partner',
    icon: Handshake,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-panel-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <Logo layout="horizontal" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex space-x-1 items-center">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.highlight
                      ? 'bg-brand/10 text-brand hover:bg-brand hover:text-white'
                      : 'text-gray-300 hover:text-white hover:bg-panel'
                  }`}
                >
                  {item.label}
                  {item.subItems && (
                    <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                  )}
                </Link>

                {/* Dropdown Menu (Mega Menu style for subItems) */}
                {item.subItems && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-panel ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                      >
                        <div className="py-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-background hover:text-brand transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Quick Actions & Mobile menu button */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-medium text-white bg-panel hover:bg-panel-border border border-panel-border px-4 py-2 rounded-md transition-colors">
              Sign In
            </button>
            <div className="xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-panel focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-panel border-b border-panel-border overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => !item.subItems && setIsOpen(false)}
                      className={`flex-1 flex items-center px-3 py-3 rounded-md text-base font-medium ${
                        item.highlight
                          ? 'text-brand bg-brand/5'
                          : 'text-gray-300 hover:text-white hover:bg-background'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5 opacity-70" />
                      {item.label}
                    </Link>
                    {item.subItems && (
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="p-3 text-gray-400 hover:text-white"
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  <AnimatePresence>
                    {item.subItems && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-11 pr-3 py-2 space-y-1"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-brand hover:bg-background"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <div className="mt-4 px-3 pt-4 border-t border-panel-border sm:hidden">
                <button className="w-full text-sm font-medium text-white bg-panel-border hover:bg-gray-600 px-4 py-3 rounded-md transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
