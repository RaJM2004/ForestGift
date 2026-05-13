import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "1487", label: "Eco Concious individual planting their own forest." },
  { value: "15", label: "Educational institutions are nurturing future climate leaders" },
  { value: "9", label: "Countries citizens are ensuring earth over Borders" }
];

export const NumbersGrid: React.FC = () => {
  return (
    <section className="relative py-12 px-6 bg-white overflow-hidden min-h-[600px] flex items-center">
      {/* Background Illustration - Only for Desktop to prevent horizontal overflow on mobile */}
      <div className="absolute right-[5%] inset-y-0 z-0 select-none pointer-events-none hidden md:flex items-center justify-end w-[60%]">
        <motion.img 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          src="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/forest.-times-1-2clKT98XA9kyXQm1.svg" 
          alt="Forest Times reader" 
          className="h-[550px] w-auto object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-start gap-4 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-left md:w-[240px]"
            >
              <h3 className="text-[72px] md:text-[84px] font-bold text-[#247114] leading-none mb-4 flex items-start">
                {stat.value}
                <span className="text-[36px] mt-2 ml-1 text-black font-black">↑</span>
              </h3>
              <p className="text-[20px] md:text-[22px] font-bold leading-tight text-black">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
