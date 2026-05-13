import React from 'react';
import { motion } from 'framer-motion';

export const Memories: React.FC = () => {
  return (
    <section className="py-12 px-6 bg-white overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Heading moved upwards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-0 relative z-10"
        >
          <h2 className="text-5xl md:text-[80px] font-bold tracking-tighter leading-none mb-4">
            Forest. <span className="text-[#247114]">Memories</span>
          </h2>
          <p className="text-gray-900 text-lg md:text-xl font-medium tracking-tight">
            Every Birthday Becomes a Living Story
          </p>
        </motion.div>

        {/* Image moved towards the bottom with a very tight gap */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-[1400px] mt-0 -translate-y-8"
        >
          <img 
            src="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/my-forest-1-9Egv7m68ZDAxUS77.svg" 
            alt="Global stories" 
            className="w-full h-auto object-contain" 
          />
        </motion.div>

        {/* Call to action at the very bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="-mt-20 relative z-20"
        >
          <button className="px-14 py-4 bg-black text-white rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-2xl hover:bg-[#247114] transition-all">
            EXPLORE GLOBAL STORIES
          </button>
        </motion.div>
      </div>
    </section>
  );
};
