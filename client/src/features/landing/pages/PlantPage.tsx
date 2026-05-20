import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Plans } from '../components/Plans';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';

const faqs = [
  {
    q: "How does it <span class='text-[#247114]'>work</span>?",
    a: "You pay for our planting service, and we deliver healthy plants to your chosen spot."
  },
  {
    q: "Is this <span class='text-[#247114]'>social work</span>?",
    a: "No, unlike other groups, we operate as a service business focused on planting."
  },
  {
    q: "Can I celebrate birthdays <span class='text-[#247114]'>here</span>?",
    a: "Yes! We make your birthday special by planting a tree in your name during the celebration."
  },
  {
    q: "What <span class='text-[#247114]'>types</span> of plants?",
    a: "We offer a variety of native and seasonal plants suited to the local environment."
  },
  {
    q: "Do you <span class='text-[#247114]'>deliver</span> plants?",
    a: "Yes, we deliver and plant them at your preferred location within the forest."
  },
  {
    q: "How do I book a <span class='text-[#247114]'>planting service</span>?",
    a: "Simply contact us through our website or phone, and we'll schedule your planting and celebration."
  }
];

export const PlantPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32">
        {/* Main Plans Section */}
        <Plans />

        {/* FAQs Section */}
        <section className="py-24 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-[80px] font-bold tracking-tighter leading-none mb-20">
              FA<span className="text-[#247114]">Q</span>s
            </h2>

            <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <h3 
                    className="text-xl md:text-2xl font-bold tracking-tight"
                    dangerouslySetInnerHTML={{ __html: faq.q }}
                  />
                  <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
