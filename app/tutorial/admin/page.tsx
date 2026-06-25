'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Layers, 
  Cpu, 
  Terminal, 
  Search, 
  Play, 
  FileText, 
  Eye, 
  Code, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  AlertTriangle,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Topic {
  id: string;
  stack: 'rtos' | 'stm32' | 'arduino' | 'raspberry-pi';
  name: string;
  content: string;
  youtubeUrl?: string;
  isBuiltIn?: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to signin if not loaded or not admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // States
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStackFilter, setSelectedStackFilter] = useState<string>('all');
  const [isFetchLoading, setIsFetchLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Editor modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null); // null means creating new
  const [editorName, setEditorName] = useState('');
  const [editorStack, setEditorStack] = useState<'rtos' | 'stm32' | 'arduino' | 'raspberry-pi'>('rtos');
  const [editorContent, setEditorContent] = useState('');
  const [editorYoutube, setEditorYoutube] = useState('');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [isSaving, setIsSaving] = useState(false);

  // Image Upload simulator states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Fetch topics
  const fetchTopics = async () => {
    setIsFetchLoading(true);
    try {
      const res = await fetch('/api/tutorials');
      const data = await res.json();
      if (data.success) {
        setTopics(data.topics);
      } else {
        setActionError(data.error || 'Failed to load topics.');
      }
    } catch (e) {
      setActionError('Error loading tutorials.');
    } finally {
      setIsFetchLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      const timer = setTimeout(() => {
        fetchTopics();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Auth access guard
  if (loading || isFetchLoading && topics.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand" />
          <p className="text-gray-400 font-mono text-sm">Authenticating Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl bg-panel border border-red-500/20 text-center shadow-2xl"
          id="access-denied-box"
        >
          <div className="w-16 h-16 bg-red-950/40 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6 text-sm">
            You do not have administrative permissions to view this dashboard. Please sign in with an Admin account.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/signin"
              className="px-6 py-3 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-colors text-center"
            >
              Sign In with Admin Account
            </Link>
            <Link
              href="/tutorial"
              className="px-6 py-3 bg-panel-border hover:bg-opacity-80 text-white font-medium rounded-xl border border-gray-600 transition-colors text-center"
            >
              Back to Tutorials
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Handle Edit click
  const handleOpenEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setEditorName(topic.name);
    setEditorStack(topic.stack);
    setEditorContent(topic.content);
    setEditorYoutube(topic.youtubeUrl || '');
    setEditorTab('write');
    setUploadMessage(null);
    setIsEditorOpen(true);
  };

  // Handle Create click
  const handleOpenCreate = () => {
    setEditingTopic(null);
    setEditorName('');
    setEditorStack('rtos');
    setEditorContent(`### Your New Topic Sub-Heading

Introduce your embedded tutorial topic here. Use headers, bullet points, and code blocks:

#### GPIO Register Setup
Write clean descriptive paragraphs explaining the hardware architecture.

\`\`\`c
// Write high-quality C/C++ code snippets
#include <avr/io.h>

void setup() {
    // Configure hardware
}
\`\`\`

#### Pin Configurations
1. Pin 1: VCC (3.3V)
2. Pin 2: GND
3. Pin 3: Data Line (GPIO 4)
`);
    setEditorYoutube('');
    setEditorTab('write');
    setUploadMessage(null);
    setIsEditorOpen(true);
  };

  // Handle Save (Create / Update)
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorName.trim() || !editorContent.trim()) {
      setActionError('Name and Content are requested.');
      return;
    }

    setIsSaving(true);
    setActionError(null);
    setActionSuccess(null);

    const payload = {
      name: editorName,
      stack: editorStack,
      content: editorContent,
      youtubeUrl: editorYoutube.trim() || undefined
    };

    try {
      const url = editingTopic 
        ? `/api/tutorials/${editingTopic.id}` 
        : '/api/tutorials';
      
      const method = editingTopic ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess(editingTopic ? 'Topic updated successfully!' : 'New topic created successfully!');
        setIsEditorOpen(false);
        fetchTopics();
      } else {
        setActionError(data.error || 'Failed to save topic.');
      }
    } catch (err) {
      setActionError('An error occurred while saving the topic.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteTopic = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the topic "${name}"?`)) return;

    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/tutorials/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'admin'
        }
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Topic deleted successfully.');
        fetchTopics();
      } else {
        setActionError(data.error || 'Failed to delete topic.');
      }
    } catch (err) {
      setActionError('An error occurred during deletion.');
    }
  };

  // Simulated Drag & Drop Image Upload -> converts to Markdown image tag or base64
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadMessage('Please upload an image file.');
      return;
    }

    setUploadMessage('Processing image...');
    
    // Convert to Base64 to simulate 100% real database dynamic image loading
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const imgMarkdown = `\n![Uploaded Hardware Image](${base64})\n`;
      setEditorContent((prev) => prev + imgMarkdown);
      setUploadMessage('Image uploaded successfully! Embedded in markdown.');
    };
    reader.onerror = () => {
      setUploadMessage('Failed to read image.');
    };
    reader.readAsDataURL(file);
  };

  // Quick helper to insert Markdown formatting in editor
  const insertMarkdown = (syntax: string) => {
    setEditorContent((prev) => prev + syntax);
  };

  // Filter & Search logic
  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStack = selectedStackFilter === 'all' || t.stack === selectedStackFilter;
    return matchesSearch && matchesStack;
  });

  const getStackBadge = (stack: string) => {
    switch(stack) {
      case 'rtos':
        return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-mono">RTOS</span>;
      case 'stm32':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono">STM32</span>;
      case 'arduino':
        return <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-mono">Arduino</span>;
      case 'raspberry-pi':
        return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-mono">Raspberry Pi</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-full text-xs font-mono">{stack}</span>;
    }
  };

  return (
    <div className="w-full bg-background min-h-screen text-white pb-20">
      
      {/* Admin Subheader Header */}
      <div className="border-b border-panel-border/30 bg-panel/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <ArrowLeft className="w-4 h-4" />
            <Link href="/tutorial" className="hover:text-brand transition-colors">Tutorials</Link>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-brand font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Admin CMS Panel
            </span>
          </div>
          <Link href="/tutorial" className="inline-flex items-center text-xs text-brand hover:text-brand-light font-semibold transition-all">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Exit Dashboard
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight flex items-center gap-3">
              CMS <span className="text-brand">Authoring Suite</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Create, update, and manage dynamically injected syllabus topics across the four learning tracks.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand hover:bg-brand-light text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-brand/20 text-sm cursor-pointer"
            id="btn-add-new-topic"
          >
            <Plus className="w-4 h-4" />
            Add Dynamic Sub-page
          </button>
        </div>

        {/* Notifications */}
        {actionError && (
          <div className="p-4 mb-6 text-sm bg-red-950/50 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}
        {actionSuccess && (
          <div className="p-4 mb-6 text-sm bg-green-950/50 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-panel border border-panel-border/60 p-4 rounded-2xl">
            <p className="text-xs text-gray-400">Total Topics</p>
            <p className="text-2xl font-black font-heading text-white mt-1">{topics.length}</p>
          </div>
          <div className="bg-panel border border-panel-border/60 p-4 rounded-2xl">
            <p className="text-xs text-blue-400 font-semibold">RTOS Track</p>
            <p className="text-2xl font-black font-heading text-white mt-1">
              {topics.filter((t) => t.stack === 'rtos').length}
            </p>
          </div>
          <div className="bg-panel border border-panel-border/60 p-4 rounded-2xl">
            <p className="text-xs text-emerald-400 font-semibold">STM32 Track</p>
            <p className="text-2xl font-black font-heading text-white mt-1">
              {topics.filter((t) => t.stack === 'stm32').length}
            </p>
          </div>
          <div className="bg-panel border border-panel-border/60 p-4 rounded-2xl">
            <p className="text-xs text-cyan-400 font-semibold">Arduino Track</p>
            <p className="text-2xl font-black font-heading text-white mt-1">
              {topics.filter((t) => t.stack === 'arduino').length}
            </p>
          </div>
          <div className="bg-panel border border-panel-border/60 p-4 rounded-2xl">
            <p className="text-xs text-rose-400 font-semibold">Raspberry Pi</p>
            <p className="text-2xl font-black font-heading text-white mt-1">
              {topics.filter((t) => t.stack === 'raspberry-pi').length}
            </p>
          </div>
        </div>

        {/* Filters Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-panel border border-panel-border/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
              placeholder="Search topics by title, registers, keywords or content..."
            />
          </div>

          {/* Stack Filter Selector */}
          <div className="flex bg-panel border border-panel-border/60 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Tracks' },
              { id: 'rtos', label: 'RTOS' },
              { id: 'stm32', label: 'STM32' },
              { id: 'arduino', label: 'Arduino' },
              { id: 'raspberry-pi', label: 'Pi / Pico' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedStackFilter(filter.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedStackFilter === filter.id
                    ? 'bg-brand text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Table List */}
        <div className="bg-panel border border-panel-border/60 rounded-2xl overflow-hidden shadow-2xl">
          {filteredTopics.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-mono text-sm">
              No tutorial topics found matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-panel-border/60 bg-panel-border/10 text-gray-400 text-xs font-bold uppercase font-mono">
                    <th className="p-5">Learning Track</th>
                    <th className="p-5">Sub-Page / Topic Name</th>
                    <th className="p-5">Type</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-panel-border/40">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-panel-border/10 transition-colors">
                      <td className="p-5 whitespace-nowrap">
                        {getStackBadge(topic.stack)}
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-white text-sm">{topic.name}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">/tutorial/{topic.stack}/{topic.id}</p>
                      </td>
                      <td className="p-5">
                        {topic.isBuiltIn ? (
                          <span className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-mono">
                            Built-In
                          </span>
                        ) : (
                          <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase font-mono">
                            Dynamic Injected
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Preview Link */}
                          <Link
                            href={topic.isBuiltIn ? `/tutorial/${topic.stack}` : `/tutorial/${topic.stack}?topic=${topic.id}`}
                            className="p-2 bg-background border border-panel-border/80 hover:border-gray-500 rounded-lg text-gray-400 hover:text-white transition-all"
                            title="Preview Topic"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit Action */}
                          <button
                            onClick={() => handleOpenEdit(topic)}
                            className="p-2 bg-background border border-panel-border/80 hover:border-brand/40 rounded-lg text-gray-400 hover:text-brand transition-all cursor-pointer"
                            title="Edit Content"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Action (only allow deleting custom topics to preserve seed architecture) */}
                          {!topic.isBuiltIn ? (
                            <button
                              onClick={() => handleDeleteTopic(topic.id, topic.name)}
                              className="p-2 bg-background border border-panel-border/80 hover:border-red-500/40 rounded-lg text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                              title="Delete Topic"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center text-gray-600 cursor-not-allowed" title="System Seed Topics Cannot Be Deleted">
                              <Trash2 className="w-4 h-4 opacity-30" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Editor Modal Dynamic Overlay */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-panel border border-panel-border rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-panel-border/60 flex items-center justify-between bg-panel-border/10">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {editingTopic ? `Edit Topic: "${editingTopic.name}"` : 'Spawn New Dynamic Syllabus Topic'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingTopic ? 'Updating live dynamic contents' : 'Instantly inject a new sub-page into the router'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="text-gray-400 hover:text-white font-bold text-sm bg-background border border-panel-border px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Close [ESC]
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveTopic} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Topic Title & Track Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Topic Name (Header)
                    </label>
                    <input
                      type="text"
                      value={editorName}
                      onChange={(e) => setEditorName(e.target.value)}
                      className="block w-full px-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                      placeholder="e.g., Direct Memory Access (DMA) deep-dive"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                      Tech Learning Track
                    </label>
                    <select
                      value={editorStack}
                      onChange={(e) => setEditorStack(e.target.value as any)}
                      className="block w-full px-4 py-3 bg-background border border-panel-border rounded-xl text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
                    >
                      <option value="rtos">RTOS (Real-Time Systems)</option>
                      <option value="stm32">STM32 (ARM Cortex-M)</option>
                      <option value="arduino">Arduino & ESP32</option>
                      <option value="raspberry-pi">Raspberry Pi & Pico</option>
                    </select>
                  </div>
                </div>

                {/* Optional Youtube Embed Link */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    YouTube Video Embed Link <span className="text-gray-500 normal-case font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={editorYoutube}
                    onChange={(e) => setEditorYoutube(e.target.value)}
                    className="block w-full px-4 py-3 bg-background border border-panel-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm font-mono text-xs"
                    placeholder="e.g., https://www.youtube.com/embed/5a8M__QpS7Y"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Note: For security, use the standard <strong>/embed/</strong> path format (e.g., https://www.youtube.com/embed/VIDEO_ID).
                  </p>
                </div>

                {/* Rich text / Markdown Section */}
                <div className="border border-panel-border/80 rounded-xl overflow-hidden flex flex-col min-h-[350px]">
                  {/* Editor Tabs */}
                  <div className="bg-panel-border/20 px-4 py-2 border-b border-panel-border/60 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditorTab('write')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                          editorTab === 'write'
                            ? 'bg-brand text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" /> Write Markdown Content
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab('preview')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                          editorTab === 'preview'
                            ? 'bg-brand text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Live Render Preview
                      </button>
                    </div>

                    {/* Quick Markdown Injection Helpers */}
                    <div className="hidden sm:flex items-center gap-2 text-gray-400">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('### Sub-Heading ')}
                        className="p-1 hover:text-white hover:bg-background rounded text-xs font-mono font-bold cursor-pointer"
                        title="Sub-Heading"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('**bold** ')}
                        className="p-1 hover:text-white hover:bg-background rounded text-xs font-bold cursor-pointer"
                        title="Bold text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('`code` ')}
                        className="p-1 hover:text-white hover:bg-background rounded text-xs font-mono cursor-pointer"
                        title="Inline Code"
                      >
                        &lt;/&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('\n```c\n// Your code here\n```\n')}
                        className="p-1 hover:text-white hover:bg-background rounded text-xs font-mono cursor-pointer"
                        title="Code Block"
                      >
                        Code Block
                      </button>
                    </div>
                  </div>

                  {/* Tab Body */}
                  <div className="flex-1 bg-background flex flex-col md:flex-row min-h-[250px]">
                    {editorTab === 'write' ? (
                      <div className="flex-1 flex flex-col md:flex-row">
                        {/* Markdown Text Area */}
                        <textarea
                          value={editorContent}
                          onChange={(e) => setEditorContent(e.target.value)}
                          className="flex-1 p-4 bg-background text-white placeholder-gray-600 focus:outline-none text-sm font-mono resize-none border-r border-panel-border/30"
                          placeholder="Write rich technical markdown with wiring plans, setup registers, and explanations..."
                          required
                        />

                        {/* Image Uploader Sidebar */}
                        <div className="w-full md:w-80 p-4 bg-panel-border/5 flex flex-col border-t md:border-t-0 border-panel-border/40">
                          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-brand" /> Seamless Asset Ingestion
                          </h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                            Drag & drop local hardware drawings, schema photos, pinouts or schematics to embed them directly into your markdown.
                          </p>

                          {/* Drag and drop zone */}
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleImageDrop}
                            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all min-h-[140px] ${
                              isDragOver 
                                ? 'border-brand bg-brand/5 text-brand' 
                                : 'border-panel-border/60 hover:border-gray-500 text-gray-400'
                            }`}
                            onClick={() => document.getElementById('image-select-input')?.click()}
                          >
                            <Upload className="w-6 h-6 mb-2" />
                            <span className="text-[11px] font-medium block">
                              Drag Image Here or <span className="text-brand hover:underline font-bold">Browse</span>
                            </span>
                            <span className="text-[9px] text-gray-500 mt-1 block">PNG, JPG, WebP supported</span>
                            <input
                              type="file"
                              id="image-select-input"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageSelect}
                            />
                          </div>

                          {uploadMessage && (
                            <div className="mt-3 text-[10px] text-brand bg-brand/10 border border-brand/20 p-2 rounded-lg font-medium text-center">
                              {uploadMessage}
                            </div>
                          )}

                          {/* URL Direct Injection */}
                          <div className="mt-4 pt-3 border-t border-panel-border/40">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Or Insert URL Directly:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const url = prompt('Enter Image URL:');
                                if (url) {
                                  insertMarkdown(`\n![Hardware Diagram](${url})\n`);
                                }
                              }}
                              className="w-full py-1.5 bg-background hover:bg-panel-border/30 border border-panel-border text-[10px] rounded font-semibold text-gray-300 transition-all cursor-pointer"
                            >
                              Add Image URL
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-6 overflow-y-auto max-h-[450px]">
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                          <ReactMarkdown>{editorContent}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save and Dismiss Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-panel-border/60">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 bg-background hover:bg-panel-border/20 text-gray-300 border border-panel-border rounded-xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-brand hover:bg-brand-light text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
