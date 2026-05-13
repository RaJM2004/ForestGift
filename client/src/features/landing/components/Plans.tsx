import React from 'react';
import { motion } from 'framer-motion';

const PlanCard = ({ trees, label, image, delay, onClick }: { trees: string; label: string; image: string; delay: number; onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="flex flex-col items-center group h-full justify-between"
  >
    <div 
      className="h-64 md:h-80 w-full flex items-center justify-center mb-0 transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
      onClick={onClick}
    >
      <img src={image} alt={label} className="max-h-full max-w-full object-contain" />
    </div>
    <div className="text-center">
      <h3 className="text-xl md:text-2xl font-bold mb-4">
        <span className="text-[#247114]">{trees} Tree</span> Every Birthday
      </h3>
      <button 
        onClick={onClick}
        className="px-10 py-3.5 bg-black text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-[#247114] transition-all active:scale-95 shadow-xl shadow-black/5 group-hover:shadow-black/20"
      >
        {label}
      </button>
    </div>
  </motion.div>
);

export const Plans: React.FC<{ showHeader?: boolean; onPlantClick?: () => void }> = ({ showHeader = true, onPlantClick }) => {
  return (
    <section className="bg-white min-h-[600px] flex items-center px-6 py-12 md:py-24">
      <div className="max-w-7xl mx-auto text-center w-full">
        {showHeader && (
          <div className="mb-12 md:mb-20">
            <h2 className="text-5xl md:text-[72px] font-bold mb-4 tracking-tighter leading-none">
              Forest. <span className="text-[#247114]">Plans</span>
            </h2>
            <p className="text-gray-500 text-base md:text-xl font-medium">Start your journey by Taking an Oth.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          <PlanCard
            trees="1"
            label="CHILD"
            image="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/1-weL5oULaZlVRdkoW.svg"
            delay={0.1}
            onClick={onPlantClick}
          />
          <PlanCard
            trees="5"
            label="YOUTH"
            image="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/3-RfwxF2WHhFUi52Fp.svg"
            delay={0.2}
            onClick={onPlantClick}
          />
          <PlanCard
            trees="10"
            label="ELDER"
            image="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/2-1fLJvcLm6KVwVDqB.svg"
            delay={0.3}
            onClick={onPlantClick}
          />
        </div>
      </div>
    </section>
  );
};
