import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NavigationProps } from '../types';

export const ExploreGifts: React.FC<NavigationProps> = (props) => {
  const navigate = useNavigate();

  const handlePartnerClick = () => {
    navigate('/about');
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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
              Eco-Friendly Brands <br /> <span className="text-[#247114]">Growing With FOREST</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed font-medium">
              Discover sustainable MSMEs, eco-friendly startups, and local businesses creating products and services that support nature and responsible living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => {
                  document.getElementById('brand-stories')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-black text-white rounded-full font-bold tracking-wide hover:bg-[#247114] transition-colors"
              >
                Explore Brands
              </button>
              <button 
                onClick={handlePartnerClick}
                className="px-8 py-4 bg-gray-100 text-black rounded-full font-bold tracking-wide hover:bg-gray-200 transition-colors"
              >
                Partner With FOREST
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
              src="/gifts/hero.png" 
              alt="Eco-Friendly Brands" 
              className="w-full h-auto object-cover relative z-10 mix-blend-multiply"
            />
          </motion.div>
        </section>

        {/* SECTION 2 - WHY FOREST SUPPORTS MSMEs */}
        <section className="py-20 bg-gray-50 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-black"
            >
              Why FOREST Works With MSMEs
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 text-lg md:text-xl text-gray-700 font-medium leading-relaxed"
            >
              <p>FOREST believes small businesses create real environmental impact.</p>
              <p>Unlike large corporations, MSMEs and local eco-friendly brands often focus on sustainability, ethical production, and community growth.</p>
              <p>By supporting these businesses, FOREST helps responsible companies reach more people and grow naturally.</p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3 - WHAT WE SUPPORT */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="/gifts/hero.png" 
                alt="Sustainable Products" 
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
                Sustainable Products & Services
              </motion.h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  "Eco-friendly gifting",
                  "Bamboo products",
                  "Sustainable packaging",
                  "Organic products",
                  "Reusable products",
                  "Green event services",
                  "Handmade products",
                  "Waste reduction solutions"
                ].map((point, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 text-lg font-semibold text-gray-800 leading-tight"
                  >
                    <span className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-[#247114]/10 text-[#247114] flex items-center justify-center font-bold text-sm">✓</span>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4 - BRAND STORIES */}
        <section id="brand-stories" className="py-24 bg-white text-black px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto space-y-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-center"
            >
              Brands Growing With FOREST
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-12 grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-2">GreenSip</h3>
                  <p className="text-gray-500 font-semibold tracking-widest uppercase text-sm">Pune</p>
                </div>
                <blockquote className="text-2xl font-medium text-gray-800 leading-snug border-l-4 border-[#247114] pl-6">
                  “FOREST helped us connect our eco-friendly products with people who truly care about sustainability.”
                </blockquote>
                <div className="flex flex-wrap gap-3">
                  {["Reusable bottles", "Sustainable gifting", "Eco-friendly accessories"].map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-2 mt-4">
                  <h4 className="font-bold text-gray-800">Why They Joined FOREST</h4>
                  <p className="text-gray-600 font-medium">“To become part of a movement focused on responsible celebrations and environmental awareness.”</p>
                </div>

                <div className="bg-white/60 p-6 rounded-2xl mt-8 border border-gray-100">
                  <p className="text-gray-700 italic font-medium">“FOREST gave our small business visibility and meaningful customers.”</p>
                  <p className="text-sm text-gray-500 mt-3 font-bold uppercase tracking-wider">— Testimonial</p>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] overflow-hidden flex items-center justify-center">
                <img 
                  src="/gifts/brand.png" 
                  alt="Brand Story" 
                  className="w-full h-full object-contain grayscale opacity-80 mix-blend-multiply"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5 - MSME GROWTH WITH FOREST */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto text-center space-y-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-black"
          >
            Helping Small Businesses Grow Sustainably
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed"
          >
            <p className="mb-8">FOREST supports MSMEs by:</p>
            <ul className="text-left max-w-2xl mx-auto grid sm:grid-cols-2 gap-4 mb-8 text-lg font-semibold text-gray-800">
               {[
                 "Giving digital visibility",
                 "Creating backlink support",
                 "Sharing brand stories",
                 "Connecting eco-conscious customers",
                 "Building trusted collaborations",
                 "Promoting sustainable business practices"
               ].map((item, i) => (
                 <li key={i} className="flex items-start gap-3">
                   <span className="text-[#247114] font-bold mt-1 text-xl leading-none">•</span> 
                   <span className="leading-snug">{item}</span>
                 </li>
               ))}
            </ul>
            <p className="text-[#247114] font-bold">Every collaboration helps small businesses grow responsibly.</p>
          </motion.div>
        </section>

        {/* SECTION 6 - IMPACT SECTION */}
        <section className="py-24 bg-[#f8faf8] px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-black"
              >
                Building a Sustainable Business Ecosystem
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <p className="text-xl text-gray-700 font-medium">When people support FOREST partners, they also support:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Local businesses",
                    "Women entrepreneurs",
                    "Sustainable innovation",
                    "Green employment",
                    "Responsible production"
                  ].map((item, i) => (
                    <div key={i} className="px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100 font-bold text-gray-800">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-2xl font-bold text-[#247114] pt-4">Small businesses together can create big environmental change.</p>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <img 
                src="/gifts/ecosystem.png" 
                alt="Sustainable Business Ecosystem" 
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
              Grow Your Eco-Friendly Brand <br /> With FOREST
            </h2>
            <div className="text-xl font-bold text-gray-600">
              <p>Join a platform focused on sustainability, responsible business, and meaningful impact.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <button 
                onClick={handlePartnerClick}
                className="px-10 py-5 bg-[#247114] text-white rounded-full font-bold text-lg hover:bg-[#1a520e] transition-colors shadow-xl shadow-[#247114]/20"
              >
                Become a FOREST Partner
              </button>
              <button 
                onClick={handlePartnerClick}
                className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl"
              >
                Share Your Brand Story
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
