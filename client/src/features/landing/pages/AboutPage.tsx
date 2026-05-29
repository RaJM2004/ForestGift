import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProps } from '../types';
import { Send, MessageSquare } from 'lucide-react';
import { submitContactForm } from '../../../api';
import { useState } from 'react';

export const AboutPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Contact from About Page',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorOccurred(false);

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: 'Contact from About Page', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
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
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section: Vrinda, the Heart of FOREST */}
          <section className="grid md:grid-cols-2 gap-12 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-6xl md:text-[80px] font-bold tracking-tighter leading-tight">
                <span className="text-[#247114]">Vrinda</span>, the Heart of FOREST
              </h1>
              <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                <p>
                  From a <span className="font-bold text-black underline decoration-[#247114] decoration-2">single seed</span>, I dreamed of a world where people and nature would celebrate together, not apart. 
                  I felt the Earth's silent cry and humanity's longing to be remembered. 
                  And so, I rooted myself deep in love and grew into <span className="font-bold text-black">FOREST</span> — an organization born to celebrate life by nurturing the planet that gives it.
                </p>
                <p>
                  FOREST is not just a name — it is a living promise. 
                  A promise that no birthday will be forgotten, no smile will fade unnoticed, and no celebration will pass without giving something back to the Earth.
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <img 
                src="/about/about_vrinda.png" 
                alt="Founder planting a tree" 
                className="w-full max-w-md h-auto object-contain mix-blend-multiply rounded-3xl"
              />
            </motion.div>
          </section>

          {/* Section: My Defination */}
          <section className="mb-32">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tighter mb-8">
                My <span className="text-[#247114]">Defination</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-black">FOREST</span> is a life-celebration movement that transforms birthdays into acts of care for the planet. 
                  We celebrate every person by sending eco-friendly gifts, green cakes, and heartfelt greetings, and by planting trees in their name.
                </p>
                <p>
                  Each celebration we create becomes a story — a story that grows, breathes, and gives back to nature. 
                  When others forget, <span className="font-bold text-black">FOREST remembers.</span> 
                  We celebrate not just a day, but a life — and turn every gift into a leaf of hope for our Earth.
                </p>
              </div>
            </div>
          </section>

          {/* Section: My Vision */}
          <section className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold tracking-tighter">
                  My <span className="text-[#247114]">Vision</span> <span className="font-normal text-gray-400">| dream of a world where:</span>
                </h2>
                <ul className="space-y-4 text-lg text-gray-700 list-disc pl-5">
                  <li>Every human celebration plants a seed of life.</li>
                  <li>Every birthday gift heals the planet instead of harming it.</li>
                  <li>Every person feels remembered, valued, and connected to nature.</li>
                </ul>
                <div className="text-lg text-gray-600 italic leading-relaxed">
                  "A world where millions of trees stand together — each one representing a memory, a person, a heartbeat. A living, breathing forest of love and remembrance that grows with humanity's joy."
                </div>
                <p className="text-xl font-bold text-black">
                  That is the FOREST I see in my dreams — <br />
                  <span className="text-[#247114]">a planet where happiness and healing grow side by side. 🌿</span>
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/about/about_vision.png" 
                  alt="Vision of forest" 
                  className="w-full max-w-lg h-auto object-contain mix-blend-multiply rounded-3xl"
                />
              </div>
            </div>
          </section>

          {/* Section: My Mission */}
          <section className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <img 
                  src="/about/about_mission.png" 
                  alt="Mission interaction" 
                  className="w-full max-w-lg md:max-w-xl h-auto object-contain scale-110 mix-blend-multiply rounded-3xl"
                />
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <h2 className="text-4xl font-bold tracking-tighter">
                  My <span className="text-[#247114]">Mission</span> <span className="font-normal text-gray-400">Through my roots and your hands, we act with purpose:</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="text-[#247114] font-bold text-2xl">+</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2">We Celebrate People:</h3>
                      <p className="text-gray-600">We remember every birthday and milestone, sending eco-gifts, sustainable cakes, and green greetings — reminding each person that they matter.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#247114] font-bold text-2xl">+</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2">We Heal the Earth:</h3>
                      <p className="text-gray-600">For every celebration, FOREST plants a tree — a living symbol of joy that purifies air, shelters life, and restores balance.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[#247114] font-bold text-2xl">+</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2">We Inspire Change:</h3>
                      <p className="text-gray-600">We help people shift from wasteful celebrations to meaningful ones, turning personal happiness into planetary health.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section: Want to connect with Vrinda & Family */}
          <section id="contact" className="bg-[#fafafa] rounded-[40px] p-6 md:p-20 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
                Want to connect with <span className="text-[#247114]">Vrinda</span> & Family
              </h2>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
                <h3 className="text-xl font-bold mb-4 text-[#247114]">Registered Address</h3>
                <address className="not-italic text-gray-600 font-medium">
                  SHOP 18, SAHYADRI AVENUE, OPPOSITE MANUSHA MASJID,<br />
                  Rasta Peth, Pune, Pune City, Maharastra, India, 411011<br />
                  <span className="mt-2 block">Email: support@forestgift.in</span>
                </address>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your First Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your first name" 
                    className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-[#247114]" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Email Address *</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email address" 
                    className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-[#247114]" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Message *</label>
                  <textarea 
                    required
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Share your thoughts here..." 
                    className="w-full p-4 border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-[#247114] resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#247114] text-white rounded-full font-black text-xs tracking-[0.2em] uppercase hover:bg-black transition-all flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT YOUR REQUEST'}
                  {!isSubmitting && <Send size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                </button>
              </form>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800"
                  >
                    <MessageSquare size={16} className="text-[#247114]" />
                    <div className="text-xs font-semibold">Message sent successfully to support!</div>
                  </motion.div>
                )}
                {errorOccurred && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800"
                  >
                    <div className="text-xs font-semibold">❌ Failed to send message. Please try again.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};
