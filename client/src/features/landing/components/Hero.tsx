import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onPlantClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlantClick }) => {
  return (
    <section className="relative min-h-[750px] md:h-screen md:max-h-[900px] overflow-hidden bg-white">
      {/* Background Image - Restored for both Mobile & Desktop */}
      {/* Background Image - Zoomed in for immersive detail */}
      <div className="absolute inset-x-0 bottom-0 z-0 select-none pointer-events-none flex items-end justify-center">
        <img 
          src="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/untitled-design-mvAyLyvlrkGlzy4H.svg" 
          alt="Forest background" 
          className="w-full h-full md:h-auto object-cover md:object-contain object-bottom scale-[1.8] md:scale-100 origin-bottom"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col pt-[140px] md:pt-[145px] h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <h1 className="text-[44px] md:text-[80px] font-bold leading-[1.1] tracking-[-0.02em] mb-8 text-black px-4 md:px-0">
            Create your own <span className="text-[#247114]">forest.</span>
          </h1>
          
          <div className="max-w-2xl mx-auto space-y-1 mb-10 px-4 md:px-0">
            <p className="text-gray-800 text-base md:text-[18px] font-normal leading-tight">
              We celebrate the birthdays of individuals who plant trees and commit to the Earth.
            </p>
            <p className="text-gray-800 text-base md:text-[18px] font-normal leading-tight">
              Each tree is recorded as a living legacy.
            </p>
            <p className="text-gray-800 text-base md:text-[18px] font-normal leading-tight">
              We stand united for the planet — driven by responsibility.
            </p>
          </div>

          <button 
            onClick={onPlantClick}
            className="px-14 py-4 bg-black text-white rounded-full text-sm font-black tracking-widest hover:bg-[#247114] transition-all active:scale-95 shadow-xl shadow-black/20 uppercase"
          >
            PLANT TODAY
          </button>
        </motion.div>
      </div>
    </section>
  );
};

