'use client';

import { useState } from 'react';
import { Handshake, TrendingUp, Cpu, Headset, BookOpen, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';

const benefits = [
  {
    title: 'Zero Royalty, High Returns',
    description: 'Keep 100% of your profits. We don\'t charge any ongoing royalty fees on your sales or services.',
    icon: TrendingUp,
  },
  {
    title: 'Vast Project Catalog',
    description: 'Get exclusive access to hundreds of high-quality electronics, IoT, and embedded project kits and blueprints.',
    icon: Cpu,
  },
  {
    title: 'Marketing & Sales Support',
    description: 'We provide you with digital marketing materials, brochures, and lead generation guidance to grow quickly.',
    icon: BookOpen,
  },
  {
    title: 'Comprehensive Training',
    description: 'Receive dedicated technical training from our engineers so you can confidently deliver and explain solutions.',
    icon: Headset,
  },
  {
    title: 'Trusted Brand Name',
    description: 'Leverage the Electronics Gyan brand reputation to easily build trust with educational institutions and students.',
    icon: ShieldCheck,
  },
  {
    title: 'Ready-to-Deploy Kits',
    description: 'We supply fully tested hardware kits, source codes, and documentation for you to sell locally.',
    icon: Handshake,
  },
];

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: ''
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
      const response = await fetch('/api/partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit application.');
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
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: ''
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-panel border-b border-panel-border py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 justify-center items-center flex flex-col text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/20 text-brand rounded-full text-sm font-medium mb-6">
            <Handshake className="h-4 w-4" />
            <span>Authorized Partner Program</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-6 text-white max-w-4xl mx-auto">
            Build a Profitable Business with <br className="hidden md:block"/> 
            <span className="text-brand">Electronics Gyan</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join our fast-growing network of technology partners. Deal in hundreds of innovative electronic kits, robotics, and software projects without the overhead of R&D. Start your educational technology franchise today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
             <a href="#apply" className="px-8 py-4 bg-brand hover:bg-brand-light text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-brand/25 active:scale-95 text-center">
               Apply for Partnership
             </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Why Partner With Us?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide an end-to-end business ecosystem. From manufacturing to technical support, we handle the complex backend so you can focus on sales and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="bg-panel border border-panel-border p-8 rounded-2xl hover:border-gray-600 transition-colors group">
                <div className="w-14 h-14 bg-background rounded-xl border border-panel-border flex items-center justify-center mb-6 group-hover:bg-brand/10 group-hover:border-brand/30 transition-colors">
                  <Icon className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-panel border-y border-panel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A streamlined process to get your technology business up and running in days, not months.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-brand text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="text-white font-bold text-lg mb-2">Apply</h3>
                <p className="text-gray-400 text-sm">Fill out the partnership inquiry form below with your business details.</p>
             </div>
             <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-brand text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="text-white font-bold text-lg mb-2">Discuss</h3>
                <p className="text-gray-400 text-sm">Our team will contact you to discuss regional availability and terms.</p>
             </div>
             <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-brand text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="text-white font-bold text-lg mb-2">Onboarding</h3>
                <p className="text-gray-400 text-sm">Complete the agreement and receive targeted technical and sales training.</p>
             </div>
             <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-brand text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">4</div>
                <h3 className="text-white font-bold text-lg mb-2">Launch</h3>
                <p className="text-gray-400 text-sm">Start selling ready-made technology solutions and growing your revenue.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 max-w-4xl mx-auto px-4 flex flex-col items-center">
         <div className="text-center mb-12 w-full">
            <h2 className="text-3xl font-bold font-heading text-white mb-4">Become a Partner Today</h2>
            <p className="text-gray-400">
              Submit your details to receive our partner proposal and catalog.
            </p>
         </div>
         
         {submitted ? (
            <div className="bg-panel border border-panel-border p-8 md:p-12 rounded-3xl w-full text-center flex flex-col items-center justify-center py-16 shadow-xl" id="partner-success-element">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white font-heading mb-4">Application Submitted!</h2>
              <p className="text-gray-300 max-w-md leading-relaxed mb-8">
                Thank you for your interest! Your partnership application has been processed and transmitted directly to our business development committee via secure transmission.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-brand/10 border border-brand/20 hover:bg-brand/20 text-brand rounded-xl font-medium transition-all cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
         ) : (
            <div className="bg-panel border border-panel-border p-8 md:p-12 rounded-3xl w-full">
               <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  {smtpIssue && (
                    <div className="md:col-span-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-left text-sm text-amber-300 shadow-xl" id="partner-smtp-alert-box">
                      <div className="flex items-center gap-2 mb-3 text-amber-400">
                        <span className="font-semibold text-base">⚠️ SMTP Delivery Error:</span>
                      </div>
                      <p className="text-gray-300 mb-3 leading-relaxed">
                        The partnership application transmission failed because Google&apos;s mail server refused connection with the current credentials.
                      </p>
                      <code className="block bg-black/40 p-3 rounded-lg text-xs font-mono text-red-400 select-all mb-4 overflow-x-auto whitespace-pre-wrap border border-red-500/10">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                    <input type="text" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand disabled:opacity-50" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required disabled={isPending} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input type="email" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand disabled:opacity-50" placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required disabled={isPending} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Phone Number</label>
                    <input type="tel" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand disabled:opacity-50" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required disabled={isPending} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">City / Location</label>
                    <input type="text" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand disabled:opacity-50" placeholder="New York, USA" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required disabled={isPending} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Current Business Profile / Experience</label>
                    <textarea rows={4} className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand resize-none disabled:opacity-50" placeholder="Tell us briefly about your current setup or background..." value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required disabled={isPending}></textarea>
                  </div>
                  
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={isPending} className="w-full bg-brand hover:bg-brand-light text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-50 hover:cursor-pointer flex items-center justify-center">
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
               </form>
            </div>
         )}
      </section>
    </main>
  );
}
