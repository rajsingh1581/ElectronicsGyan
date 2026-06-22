'use client';

import { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'general',
    project: '',
    stream: 'electronics',
    message: ''
  });

  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smtpIssue, setSmtpIssue] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSmtpIssue(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit message.');
        if (data.meta && data.meta.smtpError) {
          setSmtpIssue(data.meta.smtpError);
        } else {
          setSmtpIssue(data.error || 'SMTP delivery failed.');
        }
        return;
      }

      setSmtpIssue(null);
      setSubmitted(true);
      // Reset form fields
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'general',
        project: '',
        stream: 'electronics',
        message: ''
      });
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setError(err.message || 'An error occurred while transmitting your query.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="p-4 bg-brand/10 border border-brand/20 rounded-2xl mb-6 inline-flex">
          <Mail className="h-12 w-12 text-brand" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-white mb-6">
          Get in <span className="text-brand">Touch for Project Idea</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          Whether you have a question about our engineering components, need support with a project, or want to discuss a partnership, we&apos;re here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading mb-6">Contact Information</h2>
            <p className="text-gray-400 mb-8">
              Fill out the form to reach our engineering and support team directly, or visit us at our headquarters.
            </p>
          </div>

          <div className="flex items-start">
            <div className="p-3 bg-panel border border-panel-border rounded-xl mr-4 shrink-0">
              <MapPin className="h-6 w-6 text-brand" />
            </div>
            <div className="w-full">
              <h3 className="text-lg font-bold text-white mb-1">Our Location</h3>
              <p className="text-gray-400 leading-relaxed mb-3">
                Krishna Bhavan, 18/25, shree colony jogiyon ki dhani, super market jaisingh pura khor jaipur - 302027 (India)
              </p>
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-panel-border mb-3">
                <iframe 
                  src="https://maps.google.com/maps?q=Krishna+Bhavan,+18/25,+shree+colony+jogiyon+ki+dhani,+super+market+jaisingh+pura+khor+jaipur+-+302027+(India)&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Electronics Gyan Location"
                ></iframe>
              </div>
              <a 
                href="https://maps.app.goo.gl/JoZMKiT2UCPHVCFG9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-light font-medium text-sm inline-flex items-center transition-colors"
                id="view-on-google-maps"
              >
                View on Google Maps &rarr;
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-3 bg-panel border border-panel-border rounded-xl mr-4 shrink-0">
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
              <p className="text-gray-400">
                <a 
                  href="https://wa.me/919799582552" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand transition-colors font-medium decoration-brand inline-flex items-center"
                >
                  Chat with us &rarr;
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-1">Chat with our engineering team instantly</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-3 bg-panel border border-panel-border rounded-xl mr-4 shrink-0">
              <Mail className="h-6 w-6 text-brand" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Email</h3>
              <p className="text-gray-400">infoelectronics.gyan@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-panel border border-panel-border rounded-3xl p-8" id="contact-form-container">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-12 px-4 animate-fade-in" id="contact-success-state">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white font-heading mb-4">Message Sent!</h2>
              <p className="text-gray-300 max-w-md leading-relaxed mb-6">
                Thank you for reaching out. Your general inquiry has been composed and sent directly to <span className="text-brand font-semibold font-mono">infoelectronics.gyan@gmail.com</span> via secure transmission.
              </p>

              {smtpIssue && (
                <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-left max-w-lg text-sm text-amber-300 shadow-xl" id="smtp-alert-box">
                  <div className="flex items-center gap-2 mb-3 text-amber-400">
                    <span className="font-semibold text-base">⚠️ SMTP Delivery Warning:</span>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Direct forwarding to <span className="font-semibold text-white">infoelectronics.gyan@gmail.com</span> failed due to a Gmail authentication error:
                  </p>
                  <code className="block bg-black/40 p-3 rounded-lg text-xs font-mono text-red-400 select-all mb-4 overflow-x-auto whitespace-pre-wrap border border-red-500/10">
                    {smtpIssue}
                  </code>
                  <p className="font-semibold text-white mb-2">How to fix this in your system environment:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 text-xs leading-relaxed">
                    <li>Log in to your Google Account and navigate to <span className="font-semibold text-amber-200">Security</span>.</li>
                    <li>Ensure <span className="font-semibold text-amber-200">2-Step Verification</span> is enabled.</li>
                    <li>Search for or go to <span className="font-semibold text-amber-200">App Passwords</span>.</li>
                    <li>Create a password for your app (name it <span className="italic">Electronics Gyan</span>).</li>
                    <li>Copy the resulting <span className="font-semibold text-amber-200">16-character passkey</span> (no spaces).</li>
                    <li>Go to your AI Studio project <span className="font-semibold text-emerald-400">Settings</span> menu and add or update your <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono">GMAIL_PASS</code> secret with this passkey.</li>
                  </ol>
                </div>
              )}

              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-brand/10 border border-brand/20 hover:bg-brand/20 text-brand rounded-xl font-medium transition-all cursor-pointer"
                id="contact-reset-btn"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white font-heading mb-6">Send us a Message</h2>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
              {smtpIssue && (
                <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-left text-sm text-amber-300 shadow-xl" id="form-smtp-alert-box">
                  <div className="flex items-center gap-2 mb-3 text-amber-400">
                    <span className="font-semibold text-base">⚠️ SMTP Delivery Error:</span>
                  </div>
                  <p className="text-gray-300 mb-3 leading-relaxed">
                    The contact form transmission failed because Google&apos;s mail server refused connection with the current credentials.
                  </p>
                  <code className="block bg-black/40 p-3 rounded-lg text-xs font-mono text-red-450 select-all mb-4 overflow-x-auto whitespace-pre-wrap border border-red-500/25">
                    {smtpIssue}
                  </code>
                  <p className="font-semibold text-white mb-2 font-heading">How to authorize with Google Mail:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 text-xs leading-relaxed">
                    <li>Go to your Google Account &raquo; <span className="font-semibold text-amber-200">Security</span>.</li>
                    <li>Ensure <span className="font-semibold text-amber-200">2-Step Verification</span> is enabled.</li>
                    <li>Search or navigate to <span className="font-semibold text-amber-200">App Passwords</span>.</li>
                    <li>Generate a password for your app (name it <span className="italic">Electronics Gyan</span>).</li>
                    <li>Copy the resulting <span className="font-semibold text-amber-200">16-character passkey</span> (no spaces).</li>
                    <li>Open your AI Studio project <span className="font-semibold text-emerald-400">Settings</span> panel, find the secrets manager, and set <code className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono">GMAIL_PASS</code> with this 16-digit passkey.</li>
                  </ol>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6" id="contact-form-element">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-300">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-300">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="project" className="text-sm font-medium text-gray-300">Project</label>
                    <input 
                      type="text" 
                      id="project" 
                      name="project"
                      className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
                      placeholder="e.g. Smart IoT Weather System"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stream" className="text-sm font-medium text-gray-300">Engineering Stream</label>
                    <select 
                      id="stream" 
                      name="stream"
                      className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none disabled:opacity-50"
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      disabled={isPending}
                    >
                      <option value="electronics">Electronics</option>
                      <option value="mechanical">Mechanical</option>
                      <option value="software">Software</option>
                      <option value="instrumentation">Instrumentation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                  <select 
                    id="subject" 
                    name="subject"
                    className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none disabled:opacity-50"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={isPending}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="project">Project Support</option>
                    <option value="partnership">Partnership / Advertising</option>
                    <option value="component">Component Availability</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows={5}
                    className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-y disabled:opacity-50"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    disabled={isPending}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full flex items-center justify-center bg-brand text-white font-medium py-4 rounded-lg hover:bg-brand-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  id="contact-form-submit-btn"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Saving & Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
