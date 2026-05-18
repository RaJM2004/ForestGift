import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProps } from '../types';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { submitContactForm } from '../../../api';

export const ContactPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick, onContactClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorOccurred(false);
    setSubmittedName(formData.name);

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        setErrorOccurred(true);
        setTimeout(() => setErrorOccurred(false), 4000);
      }
    } catch (err) {
      console.error(err);
      setErrorOccurred(true);
      setTimeout(() => setErrorOccurred(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Main Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
            
            {/* Left Column: Visual Illustration and Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-6xl md:text-[80px] font-bold tracking-tighter leading-tight">
                  Get in <span className="text-[#247114]">Touch</span>
                </h1>
                <p className="text-gray-500 text-base md:text-xl font-medium max-w-xl">
                  Have a question, feedback, or want to collaborate? Connect with our family and let's nurture the planet together.
                </p>
              </div>

              {/* Breathing Image Container */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex justify-center max-w-lg mx-auto"
              >
                <img 
                  src="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/untitled-design-mvAyLyvlrkGlzy4H.svg" 
                  alt="Contact Us illustration" 
                  className="w-full h-auto object-contain filter drop-shadow-md"
                />
              </motion.div>

              {/* Direct Info details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Us</h4>
                    <a href="mailto:info@forestgift.in" className="text-sm font-semibold text-gray-800 hover:text-[#247114] transition-colors">
                      info@forestgift.in
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Call Support</h4>
                    <a href="tel:+919876543210" className="text-sm font-semibold text-gray-800 hover:text-[#247114] transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                    <span className="text-sm font-semibold text-gray-800">
                      Madhya Pradesh, India
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column: Premium Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="lg:col-span-6"
            >
              <div className="bg-[#fafafa] border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-xl shadow-black/[0.005]">
                <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
                <p className="text-gray-500 text-sm font-semibold mb-8">We'll get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your full name" 
                      className="w-full p-4 border border-gray-100 rounded-2xl bg-white text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#247114] focus:ring-1 focus:ring-[#247114] transition-all placeholder:text-gray-400"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Enter your email address" 
                      className="w-full p-4 border border-gray-100 rounded-2xl bg-white text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#247114] focus:ring-1 focus:ring-[#247114] transition-all placeholder:text-gray-400"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Subject</label>
                    <input 
                      required
                      type="text" 
                      placeholder="What is this regarding?" 
                      className="w-full p-4 border border-gray-100 rounded-2xl bg-white text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#247114] focus:ring-1 focus:ring-[#247114] transition-all placeholder:text-gray-400"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Message</label>
                    <textarea 
                      required
                      rows={4} 
                      placeholder="Share your thoughts or questions here..." 
                      className="w-full p-4 border border-gray-100 rounded-2xl bg-white text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#247114] focus:ring-1 focus:ring-[#247114] transition-all placeholder:text-gray-400 resize-none"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-black hover:bg-[#247114] disabled:bg-gray-400 text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-black/10 hover:shadow-[#247114]/25 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                      {!isSubmitting && <Send size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-white/80" />}
                    </button>
                  </div>
                </form>

                {/* Animated submission toasts */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800"
                    >
                      <MessageSquare size={16} className="text-[#247114]" />
                      <div className="text-xs font-semibold">
                        Thank you, {submittedName}! Message sent successfully. 🌿
                      </div>
                    </motion.div>
                  )}

                  {errorOccurred && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800"
                    >
                      <div className="text-xs font-semibold">
                        ❌ Failed to send message. Please check your connection and try again.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
