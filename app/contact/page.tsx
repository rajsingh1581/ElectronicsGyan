'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Contact Inquiry [${formData.subject.toUpperCase()}]: ${formData.firstName} ${formData.lastName}`);
    const body = encodeURIComponent(`
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Engineering Stream: ${formData.stream}
Project: ${formData.project}
Subject Focus: ${formData.subject}

Message:
${formData.message}
    `);
    
    window.location.href = `mailto:infoelectronics.gyan@gmail.com?subject=${subject}&body=${body}`;
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
                18/25, shree colony jogiyon ki dhani, super market jaisingh pura khor jaipur - 302027 (India)
              </p>
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-panel-border mb-3">
                <iframe 
                  src="https://maps.google.com/maps?q=18/25,+shree+colony+jogiyon+ki+dhani,+super+market+jaisingh+pura+khor+jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
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
                href="https://maps.app.goo.gl/woenAefqsbFuWVsX7" 
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
              <Phone className="h-6 w-6 text-brand" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
              <p className="text-gray-400">+91-9799582552</p>
              <p className="text-sm text-gray-500 mt-1">Available Mon-Sat, 9am - 6pm IST</p>
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
          <h2 className="text-2xl font-bold text-white font-heading mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6" id="contact-form-element">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-300">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName"
                  className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-300">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName"
                  className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="project" className="text-sm font-medium text-gray-300">Project</label>
                <input 
                  type="text" 
                  id="project" 
                  name="project"
                  className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  placeholder="e.g. Smart IoT Weather System"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stream" className="text-sm font-medium text-gray-300">Engineering Stream</label>
                <select 
                  id="stream" 
                  name="stream"
                  className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none"
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
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
                className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                className="w-full bg-background border border-panel-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-y"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full flex items-center justify-center bg-brand text-white font-medium py-4 rounded-lg hover:bg-brand-light transition-colors cursor-pointer"
              id="contact-form-submit-btn"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Inquiry
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
