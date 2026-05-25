'use client';

import { useState } from 'react';
import { Handshake, TrendingUp, Cpu, Headset, BookOpen, ShieldCheck } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Partnership Application: ${formData.name}`);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}

Business Profile / Experience:
${formData.experience}
    `);
    
    window.location.href = `mailto:infoelectronics.gyan@gmail.com?subject=${subject}&body=${body}`;
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
         
         <div className="bg-panel border border-panel-border p-8 md:p-12 rounded-3xl w-full">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">Full Name</label>
                 <input type="text" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">Email Address</label>
                 <input type="email" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand" placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">Phone Number</label>
                 <input type="tel" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">City / Location</label>
                 <input type="text" className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand" placeholder="New York, USA" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
               </div>
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-medium text-gray-300">Current Business Profile / Experience</label>
                 <textarea rows={4} className="w-full bg-background border border-panel-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand resize-none" placeholder="Tell us briefly about your current setup or background..." value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required></textarea>
               </div>
               
               <div className="md:col-span-2 pt-4">
                 <button type="submit" className="w-full bg-brand hover:bg-brand-light text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-brand/20">
                   Submit Application
                 </button>
               </div>
            </form>
         </div>
      </section>
    </main>
  );
}
