'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles, AlertCircle, RefreshCw, ExternalLink, Globe, BookOpen, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Source {
  title: string;
  uri: string;
}

const loadingSteps = [
  "Searching local components database...",
  "Connecting to global intelligence network...",
  "Extracting schematics & pinout configurations...",
  "Validating technical specifications...",
  "Synthesizing authoritative engineering overview...",
  "Finalizing search verification logs..."
];

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Rotate loading steps while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Smooth scroll to results once loaded
  useEffect(() => {
    if (searchPerformed && !isLoading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchPerformed, isLoading]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setLoadingStep(0);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete search query.');
      }

      setSearchResult(data.text);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchPerformed(false);
    setSearchResult('');
    setSources([]);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Search Bar Input Panel */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-brand animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-11 pr-24 py-3 sm:py-4 bg-panel border-2 border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all shadow-lg text-sm sm:text-base"
          placeholder="Search components, circuits, STM32 registers, Arduino pinouts..."
          disabled={isLoading}
        />
        
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
          {searchPerformed && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-white px-2 py-1 text-xs sm:text-sm font-medium transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-brand hover:bg-brand-light text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-sm sm:text-base disabled:opacity-50 disabled:hover:bg-brand cursor-pointer flex items-center gap-1"
          >
            {isLoading ? "Searching" : "Search"}
          </button>
        </div>
      </form>

      {/* Search Engine Context Panel (Loading, Error, Results) */}
      <div className="w-full" ref={resultsRef}>
        <AnimatePresence mode="wait">
          {/* 1. Loading State */}
          {isLoading && (
            <motion.div
              key="loading-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center justify-center p-12 bg-panel/30 border border-panel-border/50 rounded-2xl mb-8 backdrop-blur-sm"
            >
              <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                {/* Pulsing ring */}
                <span className="absolute inset-0 bg-brand/10 rounded-full animate-ping" />
                <div className="p-4 bg-brand/10 border border-brand/20 rounded-full">
                  <Loader2 className="h-7 w-7 text-brand animate-spin" />
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <p className="text-white font-medium text-base sm:text-lg mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand animate-pulse" />
                    Deep Search Intelligence Active
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm font-mono max-w-md h-5">
                    {loadingSteps[loadingStep]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* 2. Error State */}
          {error && !isLoading && (
            <motion.div
              key="error-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full p-6 bg-red-950/20 border-2 border-red-900/30 rounded-2xl flex items-start gap-4 mb-8"
            >
              <div className="p-2 bg-red-950/40 rounded-lg text-red-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1">Search Engine Interrupted</h3>
                <p className="text-gray-300 text-sm mb-3">{error}</p>
                <button
                  onClick={() => handleSearch()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 border border-red-800/35 hover:border-red-600 rounded-lg text-xs font-medium text-red-300 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" /> Retry Query
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. Search Results Content */}
          {searchPerformed && !isLoading && !error && searchResult && (
            <motion.div
              key="results-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full bg-panel border-2 border-panel-border rounded-2xl shadow-2xl overflow-hidden mb-12"
            >
              {/* Results Title Bar */}
              <div className="px-6 py-4 bg-background border-b border-panel-border/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-brand/10 border border-brand/25 rounded-md">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono font-bold tracking-widest text-brand uppercase">Integrated Knowledge Base</h2>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">Validated query match found</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 font-mono">System ID: eg_search_engine_v3</p>
                </div>
              </div>

              {/* Main Text Content */}
              <div className="p-6 sm:p-8">
                <div className="markdown-body">
                  <Markdown
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-xl sm:text-2xl font-bold font-heading text-brand mt-6 mb-3 border-b border-panel-border pb-1.5 flex items-center gap-2">
                          <ChevronRight className="h-5 w-5 text-brand/70" />
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg sm:text-xl font-semibold font-heading text-white mt-5 mb-2.5">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm sm:text-base text-gray-300 mb-4.5 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-300 text-sm sm:text-base">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-4 space-y-1 text-gray-300 text-sm sm:text-base">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="pl-1 text-gray-300">
                          {children}
                        </li>
                      ),
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <pre className="bg-background border border-panel-border rounded-xl p-4 sm:p-5 my-5 overflow-x-auto text-xs sm:text-sm font-mono text-gray-200 shadow-inner">
                            <code>{children}</code>
                          </pre>
                        ) : (
                          <code className="bg-background/80 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-brand border border-panel-border/50 font-semibold">
                            {children}
                          </code>
                        );
                      },
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-5 rounded-xl border border-panel-border bg-background/40">
                          <table className="min-w-full divide-y divide-panel-border text-left text-xs sm:text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-background/80 font-semibold text-white text-xs uppercase tracking-wider">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-panel-border/40 text-gray-300">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-panel-border/20 transition-colors">
                          {children}
                        </tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-3 sm:px-5">{children}</th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 sm:px-5 font-mono text-gray-300">{children}</td>
                      ),
                    }}
                  >
                    {searchResult}
                  </Markdown>
                </div>

                {/* References Logs Section */}
                {sources.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-panel-border">
                    <h3 className="text-xs sm:text-sm font-mono font-bold tracking-wider text-gray-400 uppercase mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand/80" />
                      Index of Verified Platform Datasheets & References
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-background border border-panel-border hover:border-brand/40 hover:bg-panel-border/10 rounded-xl text-xs text-gray-400 hover:text-brand transition-all duration-300 group shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 truncate pr-3">
                            <div className="p-1 bg-panel border border-panel-border rounded group-hover:bg-brand/10 transition-colors shrink-0">
                              <Globe className="h-3.5 w-3.5 text-gray-400 group-hover:text-brand" />
                            </div>
                            <span className="font-mono text-xs truncate font-medium text-gray-300 group-hover:text-white transition-colors">
                              {src.title}
                            </span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-gray-500 shrink-0 group-hover:text-brand transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
