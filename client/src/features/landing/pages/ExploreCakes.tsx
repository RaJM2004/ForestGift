import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NavigationProps } from '../types';

export const ExploreCakes: React.FC<NavigationProps> = (props) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-['Inter',_sans-serif]">
      <Navbar {...props} />

      <main className="pt-24 md:pt-32 pb-24">
        {/* SECTION 1 - HERO */}
        <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-black">
              Handmade Cakes <br /> <span className="text-[#247114]">by Mothers</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed font-medium">
              Fresh, hygienic, and handmade cakes prepared by women entrepreneurs instead of mass-production bakeries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => {
                  document.getElementById('mothers-stories')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-black text-white rounded-full font-bold tracking-wide hover:bg-[#247114] transition-colors"
              >
                Explore Mothers
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <img 
              src="/cakes/hero.png" 
              alt="Handmade Cake by Mother" 
              className="w-full h-auto object-cover relative z-10 mix-blend-multiply"
            />
          </motion.div>
        </section>

        {/* SECTION 2 - WHY FOREST WORKS WITH MOTHERS */}
        <section className="py-20 bg-gray-50 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-black"
            >
              Why Mothers Instead of Big Bakeries?
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 text-lg md:text-xl text-gray-700 font-medium leading-relaxed"
            >
              <p>FOREST believes birthdays should feel personal and meaningful.</p>
              <p>Mothers create cakes with care, freshness, hygiene, and emotional connection — not factory-style production.</p>
              <p>Every order supports women entrepreneurs, local families, and sustainable celebrations.</p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3 - WHY HANDMADE CAKES */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="/cakes/hero.png" 
                alt="Baking fresh cake" 
                className="w-full aspect-square object-contain grayscale hover:grayscale-0 transition-all duration-700 mix-blend-multiply"
              />
            </motion.div>
            <div className="space-y-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-black"
              >
                Handmade Feels Different
              </motion.h2>
              <ul className="space-y-4">
                {[
                  "Freshly prepared",
                  "Better personal hygiene",
                  "Safer ingredients",
                  "Handmade with care",
                  "Supports women-led businesses",
                  "More meaningful celebrations"
                ].map((point, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 text-lg md:text-xl font-semibold text-gray-800"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#247114]/10 text-[#247114] flex items-center justify-center font-bold">✓</span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4 - MOTHERS STORIES */}
        <section id="mothers-stories" className="py-24 bg-white text-black px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto space-y-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-center"
            >
              Meet the Mothers Behind the Cakes
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-12 grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Anita Sharma</h3>
                  <p className="text-gray-500 font-semibold tracking-widest uppercase text-sm">Pune, Maharashtra</p>
                </div>
                <blockquote className="text-2xl font-medium text-gray-800 leading-snug border-l-4 border-[#247114] pl-6">
                  “Baking helped me support my family while working from home.”
                </blockquote>
                <div className="flex flex-wrap gap-3">
                  {["Eggless Cakes", "Kids Theme Cakes", "Fresh Homemade Cakes"].map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="bg-white/60 p-6 rounded-2xl mt-8 border border-gray-100">
                  <p className="text-gray-700 italic font-medium">"The cake felt fresh, safe, and emotionally special."</p>
                  <p className="text-sm text-gray-500 mt-3 font-bold uppercase tracking-wider">— Customer Testimonial</p>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center">
                <img 
                  src="/cakes/mother_baking.png" 
                  alt="Mother baking" 
                  className="w-full h-full object-contain grayscale opacity-80 mix-blend-multiply"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5 - WOMEN ENTREPRENEURSHIP */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black"
          >
            Supporting Women Entrepreneurs
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed"
          >
            <p className="mb-6">FOREST helps talented mothers grow independent home businesses through sustainable birthday celebrations.</p>
            <p className="text-[#247114] font-bold">Every cake order supports a real family.</p>
          </motion.div>
        </section>

        {/* SECTION 6 - SUSTAINABLE CELEBRATIONS */}
        <section className="py-24 bg-[#f8faf8] px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-black"
              >
                Cakes + Trees + Eco-Friendly Celebrations
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <p className="text-xl text-gray-700 font-medium">FOREST combines:</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Handmade cakes",
                    "Tree plantation",
                    "Eco-friendly cutlery",
                    "Sustainable gifting"
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-center font-bold text-gray-800">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-2xl font-bold text-[#247114] pt-4">For birthdays that create real impact.</p>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <img 
                src="/cakes/sustainable.png" 
                alt="Sustainable Celebration" 
                className="w-full h-auto object-cover mix-blend-multiply"
              />
            </motion.div>
          </div>
        </section>

        {/* SECTION 7 - CTA */}
        <section className="py-24 px-6 md:px-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-10"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black">
              Celebrate Birthdays <br /> That Matter
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xl font-bold text-gray-600">
              <span>Support mothers.</span>
              <span className="hidden sm:block">•</span>
              <span>Plant trees.</span>
              <span className="hidden sm:block">•</span>
              <span>Celebrate responsibly.</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <button className="px-10 py-5 bg-[#247114] text-white rounded-full font-bold text-lg hover:bg-[#1a520e] transition-colors shadow-xl shadow-[#247114]/20">
                Explore Cakes
              </button>
              <button onClick={props.onPlantClick} className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl">
                Plan Celebration
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
