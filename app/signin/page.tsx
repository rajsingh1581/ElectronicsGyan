'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Mail, Phone, User, Lock, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signin, signup, user } = useAuth();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign In inputs
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'admin' | 'readonly'>('readonly');

  // Error & loading handling
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect or display a nice welcome box
  if (user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl bg-panel border border-panel-border text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white mb-2">Already Logged In!</h2>
          <p className="text-gray-400 mb-6">
            You are currently logged in as <span className="text-brand font-semibold">{user.username}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-colors text-center"
            >
              Go to Homepage
            </Link>
            <Link
              href="/projects"
              className="px-6 py-3 bg-panel-border hover:bg-opacity-80 text-white font-medium rounded-xl border border-gray-600 transition-colors text-center"
            >
              Explore Engineering Projects
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signInIdentifier || !signInPassword) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signin(signInIdentifier, signInPassword);
      if (res.success) {
        setSuccessMsg('Successfully signed in! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setError(res.error || 'Failed to authenticate.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signUpName || !signUpUsername || !signUpEmail || !signUpPhone || !signUpPassword) {
      setError('All fields are requested for signup.');
      return;
    }

    // A simple validation pattern
    if (signUpName.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }
    if (signUpUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (!signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (signUpPhone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup(signUpName, signUpUsername, signUpEmail, signUpPhone, signUpPassword, signUpRole);
      if (res.success) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        
        {/* Toggle Nav */}
        <div className="flex bg-panel border border-panel-border p-1 rounded-xl mb-6">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-brand text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-brand text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Input Card Container */}
        <div className="bg-panel border border-panel-border rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand via-pink-600 to-blue-500"></div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold font-heading text-white">
              {mode === 'signin' ? 'Access Engineering Portal' : 'Create Engineering Account'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {mode === 'signin' 
                ? 'Sign in to access source codes, request projects, and start learning.' 
                : 'Join Electronics Gyan to share ideas, build projects, and get mentored.'
              }
            </p>
          </div>

          {/* Feedback States */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 text-sm bg-red-950/50 border border-red-500/30 text-red-400 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 text-sm bg-green-950/50 border border-green-500/30 text-green-400 rounded-lg"
            >
              {successMsg}
            </motion.div>
          )}

          {/* Forms */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Username or Email ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="e.g. rajsingh1581"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3.5 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="Raj Singh"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="rajsingh1581"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Email ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="rajsingh1581@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Phone No
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Select User Role / Permission Mode
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('readonly')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      signUpRole === 'readonly'
                        ? 'bg-brand/10 border-brand text-brand'
                        : 'bg-background border-panel-border text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Read-Only User
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">Can only browse & read</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpRole('admin')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      signUpRole === 'admin'
                        ? 'bg-brand/10 border-brand text-brand'
                        : 'bg-background border-panel-border text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Admin / Contributor
                    <span className="block text-[10px] font-normal text-gray-500 mt-0.5">Full edit and CRUD tools</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3.5 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Preloads */}
          <div className="mt-8 pt-6 border-t border-panel-border text-center">
            <span className="text-xs text-gray-500 block mb-2">
              Want a quick test session? Click below to autofill the requested Admin credentials:
            </span>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setSignInIdentifier('rajsingh1581');
                setSignInPassword('GopalJ!108');
                // Seed the exclusive admin in localStorage if not exists so it functions immediately
                const existing = localStorage.getItem('eg_users') || '[]';
                const list = JSON.parse(existing);
                if (!list.some((u: any) => u.username === 'rajsingh1581')) {
                  list.push({
                    name: 'RAJ SINGH',
                    username: 'rajsingh1581',
                    email: 'rajsingh1581@gmail.com',
                    phone: '9876543210',
                    pass: 'GopalJ!108',
                    role: 'admin'
                  });
                  localStorage.setItem('eg_users', JSON.stringify(list));
                }
              }}
              className="px-3 py-1.5 rounded bg-background border border-panel-border hover:border-gray-600 text-[11px] font-mono text-gray-400 hover:text-white transition-all inline-block cursor-pointer"
            >
              Click to Autofill Admin Credentials
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
