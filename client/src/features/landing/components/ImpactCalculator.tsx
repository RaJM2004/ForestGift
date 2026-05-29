import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Sparkles, Droplet, ChevronRight, Trees, Leaf } from 'lucide-react';

interface ImpactCalculatorProps {
  onPlantClick?: () => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = ({ onPlantClick }) => {
  const [treeCount, setTreeCount] = useState<number>(10);

  // Ecological impact calculations
  const co2Absorbed = treeCount * 22;      // 22kg CO2 per tree per year
  const oxygenPeople = treeCount * 2;       // Oxygen for 2 people per tree
  const waterRetained = treeCount * 250;    // 250 liters of water retained
  const mileageEquivalent = treeCount * 80;  // 80 miles worth of emission offset per tree

  // Float positions for leaf particles
  const leafPositions = [
    { left: '8%', delay: 0, duration: 14, size: 20 },
    { left: '22%', delay: 3, duration: 16, size: 16 },
    { left: '76%', delay: 1, duration: 15, size: 18 },
    { left: '92%', delay: 5, duration: 18, size: 14 },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-[#fafdfb] to-white py-16 md:py-24 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic drifting leaf particles in background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {leafPositions.map((leaf, index) => (
          <motion.div
            key={index}
            initial={{ y: -50, x: 0, opacity: 0, rotate: 0 }}
            whileInView={{ 
              y: '100vh', 
              x: [0, 30, -30, 0],
              opacity: [0, 0.6, 0.6, 0],
              rotate: 360
            }}
            viewport={{ once: false }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "linear"
            }}
            className="absolute text-emerald-800/10"
            style={{ left: leaf.left }}
          >
            <Leaf size={leaf.size} className="fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-50/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-50/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-[80px] font-bold mb-4 tracking-tighter leading-none text-gray-950 font-['League_Spartan']"
          >
            Forest. <span className="text-[#247114]">Impact</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-500 text-base md:text-xl font-medium"
          >
            Calculate the real-world ecological legacy of your trees.
          </motion.p>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 max-w-6xl mx-auto items-center">
          
          {/* Left Column: Selector controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white border border-emerald-100/50 rounded-[32px] p-6 md:p-8 shadow-xl shadow-emerald-950/[0.01]"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Tree Count</span>
              <div className="text-2xl font-bold text-gray-950 flex items-baseline gap-1">
                <span className="text-[#247114]">{treeCount}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trees</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-6 mb-8">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={treeCount} 
                onChange={(e) => setTreeCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-emerald-50 rounded-lg appearance-none cursor-pointer accent-[#247114] outline-none border-none focus:ring-0"
              />
              
              {/* Presets Row */}
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTreeCount(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      treeCount === num 
                        ? 'bg-[#247114] border-[#247114] text-white shadow-md shadow-[#247114]/25 scale-105' 
                        : 'bg-emerald-50/50 border-emerald-100/20 text-[#247114] hover:bg-emerald-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Short helper note */}
            <div className="border-t border-gray-100 pt-6 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] flex-shrink-0 mt-0.5">
                ✓
              </span>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Every birthday tree you dedicate is registered, mapped on GPS, and fully nurtured to maturity.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Visual impact outputs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Impact Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* CO2 Box */}
              <div className="bg-white border border-emerald-100/40 rounded-3xl p-6 shadow-xl shadow-emerald-950/[0.005] hover:border-emerald-200/50 hover:shadow-emerald-950/[0.02] transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] mb-4">
                  <Wind size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CO₂ Absorbed</span>
                <span className="text-lg font-bold text-gray-950">{co2Absorbed} kg <span className="text-[9px] font-semibold text-gray-400">/ Year</span></span>
              </div>

              {/* Oxygen Box */}
              <div className="bg-white border border-emerald-100/40 rounded-3xl p-6 shadow-xl shadow-emerald-950/[0.005] hover:border-emerald-200/50 hover:shadow-emerald-950/[0.02] transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] mb-4">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Oxygen For</span>
                <span className="text-lg font-bold text-gray-950">{oxygenPeople} People <span className="text-[9px] font-semibold text-gray-400">/ Daily</span></span>
              </div>

              {/* Water Box */}
              <div className="bg-white border border-emerald-100/40 rounded-3xl p-6 shadow-xl shadow-emerald-950/[0.005] hover:border-emerald-200/50 hover:shadow-emerald-950/[0.02] transition-all duration-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#247114] mb-4">
                  <Droplet size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Water Retained</span>
                <span className="text-lg font-bold text-gray-950">{waterRetained} Liters <span className="text-[9px] font-semibold text-gray-400">/ Year</span></span>
              </div>

            </div>

            {/* Live comparison note box */}
            <div className="bg-emerald-50/50 border border-emerald-100/30 rounded-3xl p-5 md:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-emerald-100/40 flex items-center justify-center text-[#247114] flex-shrink-0">
                <Trees size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-950 mb-1">Environmental Equivalency</h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                  Your micro-forest of <span className="text-[#247114] font-bold">{treeCount} trees</span> will offset the CO₂ emission equivalent of driving a standard vehicle <span className="text-[#247114] font-bold">{mileageEquivalent} miles</span> less every single year!
                </p>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="flex justify-center md:justify-start pt-2">
              <button 
                onClick={onPlantClick}
                className="px-12 py-3.5 bg-black hover:bg-[#247114] text-white rounded-full font-bold text-xs tracking-widest uppercase transition-all active:scale-95 shadow-xl shadow-black/10 hover:shadow-[#247114]/20 flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>PLANT TODAY</span>
                <ChevronRight size={12} className="transform group-hover:translate-x-0.5 transition-transform text-white/80" />
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
