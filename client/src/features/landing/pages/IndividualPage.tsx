import React from 'react';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { TreePine, Cake, ShieldCheck, Leaf, Home, Award, Users, CheckCircle2 } from 'lucide-react';

export const IndividualPage: React.FC = () => {
  const modules = [
    { icon: <TreePine className="w-8 h-8" />, title: 'Tree-Based Life System', desc: 'Plant trees linked to your life events. Structured yearly participation to build a growing personal forest over time.' },
    { icon: <Cake className="w-8 h-8" />, title: 'Birthday Experience', desc: 'Celebrate birthdays within your community with tree-linked recognition, cake, and public acknowledgment.' },
    { icon: <ShieldCheck className="w-8 h-8" />, title: 'Personal Forest Ownership', desc: 'Get a personal digital profile tracking the number, location, and growth of your trees over time.' },
    { icon: <Leaf className="w-8 h-8" />, title: '"Sustainable Me" System', desc: 'A practical sustainability guide with simple daily habits for waste segregation and plastic reduction.' },
    { icon: <Home className="w-8 h-8" />, title: 'Society Transformation', desc: 'Guide residential societies in waste management, composting, and creating a healthier living environment.' },
    { icon: <Award className="w-8 h-8" />, title: 'Certificate & Identity', desc: 'Personalized certificate linked to your trees and a "Sustainable Living Oath" reinforcing your commitment.' },
    { icon: <Users className="w-8 h-8" />, title: 'Community Building', desc: 'Society-level groups, plantation events, and recognition for active members to build a strong community.' },
  ];

  const values = [
    { title: 'For Individuals', points: ['Personal environmental contribution', 'Meaningful celebrations', 'Strong sense of purpose'] },
    { title: 'For Families', points: ['Shared sustainable lifestyle', 'Education for children', 'Long-term legacy building'] },
    { title: 'For Society', points: ['Cleaner environment', 'Stronger community', 'Collective transformation'] }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-20">
        
        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center text-left mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight uppercase">
              FOREST FOR <br className="hidden md:block" /> <span className="text-[#247114]">INDIVIDUALS</span>
            </h1>
            <p className="text-2xl font-medium text-gray-800">
              Build Your Personal Forest. Create a Sustainable Life.
            </p>
            <div className="text-xl text-gray-600 italic bg-gray-50 p-8 rounded-3xl mt-8 shadow-sm">
              “Turn every life milestone into a living forest and build a sustainable lifestyle for your family.”
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <img 
              src="/individuals/hero.png" 
              alt="Personal Sustainability" 
              className="w-full h-auto object-cover relative z-10 mix-blend-multiply"
            />
          </motion.div>
        </section>

        {/* About & Idea */}
        <section className="bg-[#fafafa] py-24 mb-24">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">ABOUT FOREST (INDIVIDUAL MODEL)</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Forest is a structured lifestyle system for individuals and families that transforms everyday moments into long-term environmental impact.
              </p>
              <p className="text-lg font-bold text-[#247114]">
                It is not a one-time plantation. It is a continuous personal journey of sustainability, ownership, and legacy.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">THE CORE IDEA</h2>
              <ul className="space-y-4">
                {[
                  'Every milestone becomes a tree',
                  'Every person builds their own forest',
                  'Every home becomes sustainable'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-gray-700">
                    <CheckCircle2 className="text-[#247114] w-6 h-6 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">What We Build For You</h2>
            <p className="text-xl text-gray-600">A journey of personal sustainability.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-[#247114] mb-6 bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {mod.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{mod.title}</h3>
                <p className="text-gray-600 leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Value Created */}
        <section className="bg-[#fafafa] py-24 mb-24 rounded-[60px] mx-4 md:mx-auto max-w-[1400px]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-16">Value Created</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {values.map((val, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-2xl font-bold mb-6 text-[#247114]">{val.title}</h3>
                  <ul className="space-y-4">
                    {val.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#247114]" />
                        <span className="leading-relaxed text-gray-700 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tighter">Positioning Statement</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-bold text-[#247114]">
            Forest is not a plantation service. It is a personal sustainability system for individuals and families.
          </p>
          <div className="w-24 h-1 bg-[#247114] mx-auto my-12 opacity-20 rounded-full"></div>
          <h3 className="text-3xl font-bold uppercase tracking-widest text-[#247114]">Forest</h3>
          <p className="text-2xl text-gray-800 font-medium">Building sustainable lives, families, and communities.</p>
          <p className="text-lg text-gray-500 italic mt-4">
            "Don’t just celebrate life moments. Grow them into a forest."
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
};
