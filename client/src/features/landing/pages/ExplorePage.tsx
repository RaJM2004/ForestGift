import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';
import { ExploreCakes } from './ExploreCakes';
import { ExploreGifts } from './ExploreGifts';
import { ExploreTours } from './ExploreTours';

interface ExplorePageProps extends NavigationProps {
  type: 'gifts' | 'cakes' | 'tours';
}

export const ExplorePage: React.FC<ExplorePageProps> = (props) => {
  const { type } = props;
  
  if (type === 'cakes') {
    return <ExploreCakes {...props} />;
  }

  if (type === 'gifts') {
    return <ExploreGifts {...props} />;
  }

  if (type === 'tours') {
    return <ExploreTours {...props} />;
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-['Inter',_sans-serif]">
      {/* Fixed Full-Page Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://img.freepik.com/free-vector/green-foliage-background_53876-112907.jpg" 
          alt="Foliage Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40"></div>
      </div>

      <div className="relative z-10">
        <main className="pt-32">
          {/* Title Section */}
          <section className="h-[40vh] flex items-center justify-center px-6">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[64px] md:text-[88px] font-bold text-[#247114] tracking-tighter"
            >
              {pageData.title}
            </motion.h1>
          </section>

          {/* Staggered Sections */}
          <div className="max-w-[1400px] mx-auto px-10 md:px-20 py-20 space-y-[20vh]">
            {/* Section 1: Left Aligned */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2"
            >
              <div className="max-w-md space-y-6">
                <h2 className="text-[28px] md:text-[30px] font-medium mb-4 text-gray-900 leading-tight">Sunshine Bay Residence</h2>
                <p className="text-[17px] md:text-[18px] text-gray-700 leading-relaxed font-medium">
                  Equipped with full air conditioning, a private pool, 3 on-suite bedrooms, and a spacious open living room kitchen area. Sunshine Bay Residences is an excellent choice for anyone dreaming of their own safe haven.
                </p>
              </div>
              <div className="hidden md:block"></div>
            </motion.div>

            {/* Section 2: Right Aligned */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2"
            >
              <div className="hidden md:block"></div>
              <div className="max-w-xl space-y-6">
                <h2 className="text-[28px] md:text-[30px] font-medium mb-4 text-gray-900 leading-tight">Bridgewater Joy Residence</h2>
                <p className="text-[17px] md:text-[18px] text-gray-700 leading-relaxed font-medium">
                  Co-designed by the world-renowned architect James Smith, our Bridgewater Joy residences offer top views of the nearby lake Michigan. Perfect for a small family, a professional couple, or anyone looking to set up a home office.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="h-[20vh]"></div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
