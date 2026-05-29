import React from 'react';
import { motion } from 'framer-motion';

const giftCards = [
  { 
    title: "Gifts", 
    label: "EXPLORE GIFTS", 
    link: "/gifts", 
    video: "/gift box animation.mp4",
    description: "When someone chooses to plant a tree with us on their birthday, they are not just celebrating themselves; they're nurturing life. They're helping the planet breathe better, creating homes for birds, balancing the ecosystem, and spreading hope."
  },
  { 
    title: "Cakes", 
    label: "EXPLORE CAKES", 
    link: "/cakes", 
    video: "/cake animation.mp4",
    description: "we remember your birthday — always. Even if you forget to plant a tree, we'll still celebrate you with a green surprise, a heartfelt message, and a little piece of nature's love. Because your existence itself is worth celebrating and the Earth is grateful for you."
  },
  { 
    title: "Tours", 
    label: "EXPLORE TOURS", 
    link: "/tours", 
    video: "/bus animation.mp4",
    description: "At Forest, we believe every birthday should make the world a little greener. We celebrate people by planting trees, sending eco-friendly gifts, cakes, and greetings — turning every birthday into a celebration of life and the planet."
  }
];

export const Gifts: React.FC<{ onExploreClick?: (type: 'gifts' | 'cakes' | 'tours') => void }> = ({ onExploreClick }) => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-[80px] font-bold tracking-tighter leading-none mb-4">
            Forest<span className="text-[#247114]">gifts</span>
          </h2>
          <p className="text-gray-900 text-lg md:text-xl font-medium tracking-wide">
            Thoughtful Gifts from Forest, that Grow with You
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {giftCards.map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative flex flex-col items-center md:items-start group overflow-hidden"
            >
              {/* Main Illustration */}
              <div className="h-96 w-full mb-2 flex items-center justify-center relative z-10">
                <video 
                  src={card.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="h-full w-auto object-contain" 
                />
              </div>

              {/* Black Pill Button */}
              <button 
                onClick={() => onExploreClick?.(card.title.toLowerCase() as any)}
                className="mb-10 px-10 py-3 bg-black text-white rounded-full text-[13px] font-black tracking-widest uppercase hover:bg-[#247114] transition-all self-center relative z-10"
              >
                {card.label}
              </button>

              {/* Narrative Content */}
              <div className="space-y-4 text-left relative z-10">
                <p className="text-[15px] md:text-[16px] leading-relaxed text-gray-800 font-medium">
                  {i === 0 && (
                    <>When someone chooses to <strong>plant a tree</strong> with us on their birthday, they are not just celebrating themselves; they're nurturing life. They're helping the planet breathe better, creating homes for birds, balancing the ecosystem, and spreading hope.</>
                  )}
                  {i === 1 && (
                    <>we remember your birthday — always. Even if you forget to plant a tree, <strong>we'll still celebrate you</strong> with a green surprise, a heartfelt message, and a little piece of nature's love. Because your existence itself is worth celebrating and the Earth is grateful for you.</>
                  )}
                  {i === 2 && (
                    <>At <strong>Forest</strong>, we believe every birthday should make the world a little greener. We celebrate people by <strong>planting trees, sending eco-friendly gifts, cakes, and greetings</strong> — turning every birthday into a celebration of life and the planet.</>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
