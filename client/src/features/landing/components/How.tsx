import React from 'react';
import { motion } from 'framer-motion';

const Step = ({ 
  label,
  title, 
  subtitle, 
  content, 
  footer, 
  image, 
  isRight = false 
}: { 
  label: string;
  title: string; 
  subtitle: string; 
  content: React.ReactNode; 
  footer: string | React.ReactNode; 
  image: string; 
  isRight?: boolean;
}) => (
  <div className={`flex flex-col md:flex-row items-start gap-0 w-full ${isRight ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
    {/* Image Container */}
    <div className="flex flex-col items-center flex-shrink-0 w-[200px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[200px] h-[200px] flex items-center justify-center mb-0"
      >
        <img src={image} alt={label} className="w-full h-auto object-contain mix-blend-multiply rounded-3xl" />
      </motion.div>
    </div>

    {/* Content Area */}
    <div className="flex-1 pt-4 space-y-2 px-2">
      <motion.div
        initial={{ opacity: 0, x: isRight ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-[#247114] text-[24px] md:text-[26px] font-bold leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base font-medium">
          {subtitle}
        </p>
        <div className="mt-4 text-gray-800 text-[15px] md:text-[16px] leading-tight space-y-1 font-medium">
          {content}
        </div>
        <div className="mt-4 text-[#247114] font-bold text-[16px] md:text-[17px]">
          {footer}
        </div>
      </motion.div>
    </div>
  </div>
);

export const How: React.FC = () => {
  return (
    <section className="py-6 px-6 bg-white overflow-hidden min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-[64px] font-bold tracking-tighter leading-none">
            Forest. <span className="text-[#247114]">How?</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium tracking-tight mt-1">
            How Can i Create my own forest.?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-8">
          {/* Step 1: Plant */}
          <Step 
            label="Plant."
            title="Planting a tree is not an event."
            subtitle="It is the beginning of a relationship."
            image="/how/how_plant.png"
            content={
              <>
                <p>At Forest, every journey starts with <strong>one tree</strong> — planted on your birthday.</p>
                <p>Not in bulk. Not for numbers.</p>
                <p>Just one living promise placed in the earth, in your name.</p>
              </>
            }
            footer="Because meaningful change always starts small."
          />

          {/* Step 2: Pledge */}
          <Step 
            isRight
            label="Pledge."
            title="Planting is easy."
            subtitle="Protection is responsibility."
            image="/how/how_pledge.png"
            content={
              <>
                <p>When you plant a tree with Forest, you take a <strong>pledge</strong> — to respect nature, to protect life, and to return every year.</p>
                <p>This pledge is not legal. It is personal.</p>
              </>
            }
            footer="A promise to grow with the tree you planted."
          />

          {/* Step 3: Create */}
          <Step 
            label="Create."
            title="Forests are not created in a day."
            subtitle="They are created by people who return every year."
            image="/how/how_create.png"
            content={
              <>
                <p>At Forest, you don't plant unlimited trees.</p>
                <p>You plant a <strong>few trees every year</strong> slowly, honestly, and consciously.</p>
                <p>Over time, those few trees become <strong>your forest.</strong></p>
              </>
            }
            footer={
              <div className="space-y-0">
                <p>Not owned. Not sold. But lived with.</p>
              </div>
            }
          />

          {/* Step 4: Celebrate */}
          <Step 
            isRight
            label="Celebrate."
            title="Birthdays mark life."
            subtitle="So should the way we celebrate them."
            image="/how/how_celebrate.png"
            content={
              <>
                <p>Instead of cutting another cake alone, you celebrate by <strong>creating life.</strong></p>
                <p>Your birthday becomes a reminder that you are not just growing older, you are helping something else grow too.</p>
              </>
            }
            footer={
              <div className="space-y-0">
                <p>A tree. A forest. A future.</p>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
};
