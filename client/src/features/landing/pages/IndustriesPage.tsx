import React from 'react';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { Briefcase, Heart, BookOpen, Crown, LayoutDashboard, Megaphone, FileCheck, CheckCircle2, AlertCircle, TreePine, Recycle, BarChart3 } from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const modules = [
    { icon: <Heart className="w-8 h-8" />, title: 'Employee Birthday System', desc: 'Every employee birthday is mapped and tracked. A tree is planted on their behalf with a digital certificate and unique Tree ID.' },
    { icon: <BookOpen className="w-8 h-8" />, title: 'Sustainable Me Framework', desc: 'Structured sustainability guide and simple daily routines for employees to build practical eco-friendly habits.' },
    { icon: <Crown className="w-8 h-8" />, title: 'Leadership Legacy Forest', desc: 'Dedicated plantation cluster for leadership to create a long-term brand narrative and emotional authority.' },
    { icon: <LayoutDashboard className="w-8 h-8" />, title: 'Forest Dashboard', desc: 'Digital dashboard showing total trees planted, approximate CO₂ offset, and employee participation rates.' },
    { icon: <Megaphone className="w-8 h-8" />, title: 'Branding & Positioning', desc: 'Monthly storytelling content around your impact and "Green Company" positioning support.' },
    { icon: <FileCheck className="w-8 h-8" />, title: 'ESG Activity Support', desc: 'Structured activity data and documented impact summaries to support internal and external reporting readiness.' },
  ];

  const impacts = [
    { title: 'Cultural Impact', points: ['Stronger employee engagement', 'Higher emotional connection with organization', 'Visible and participative culture'] },
    { title: 'Operational Impact', points: ['Reduction in waste and resource usage', 'Adoption of sustainable daily practices', 'Improved internal discipline'] },
    { title: 'Strategic Impact', points: ['Measurable sustainability system', 'Strong brand positioning', 'Long-term legacy creation'] }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-20">
        
        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center text-left mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight uppercase">
              FOREST FOR <br className="hidden md:block" /> <span className="text-[#247114]">INDUSTRIES</span>
            </h1>
            <p className="text-2xl font-medium text-gray-800">
              Enterprise Sustainability System for Modern Companies
            </p>
            <div className="text-xl text-gray-600 italic bg-gray-50 p-8 rounded-3xl mt-8 shadow-sm">
              “We don’t plant trees. We build sustainable organizations.”
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <img 
              src="/industries/hero.png" 
              alt="Industry Sustainability" 
              className="w-full h-auto object-cover relative z-10 mix-blend-multiply"
            />
          </motion.div>
        </section>

        {/* Executive Summary & Problem */}
        <section className="bg-[#fafafa] py-32 mb-24 rounded-[60px] mx-4 md:mx-auto max-w-[1400px]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tighter">EXECUTIVE SUMMARY</h2>
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Forest is a structured, measurable sustainability operating system embedded into your organization through employee life events and leadership initiatives.
              </p>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                {['Consistent environmental action', 'Strong internal culture', 'Measurable sustainability outcomes'].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg text-gray-800 font-medium">
                    <CheckCircle2 className="text-[#247114] w-6 h-6 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xl font-bold text-[#247114] bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                This is not a one-time activity — it is a continuous system integrated into company operations.
              </p>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tighter">THE PROBLEM WE SOLVE</h2>
              <div className="space-y-6">
                <p className="text-xl text-gray-600 font-medium">Organizations today face critical challenges in cultural alignment:</p>
                {[
                  'Low employee emotional engagement',
                  'Fragmented or symbolic sustainability efforts',
                  'Lack of measurable environmental contribution',
                  'Weak alignment between values and daily behavior'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors">
                    <div className="mt-2.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">OUR SOLUTION: FOREST SYSTEM</h2>
            <p className="text-xl text-gray-600">Transforming corporate moments into measurable environmental legacy.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
            {[
              { from: 'Employee moments', to: 'Environmental action', icon: <TreePine className="w-8 h-8" /> },
              { from: 'Daily behavior', to: 'Sustainable habits', icon: <Recycle className="w-8 h-8" /> },
              { from: 'Company participation', to: 'Measurable impact', icon: <BarChart3 className="w-8 h-8" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center gap-6 relative z-10 hover:-translate-y-2 transition-transform">
                <span className="text-gray-500 font-medium text-center bg-gray-50 px-4 py-2 rounded-full">{item.from}</span>
                <div className="bg-[#247114] p-4 rounded-2xl text-white shadow-lg shadow-emerald-900/20">
                  {item.icon}
                </div>
                <span className="text-[#247114] font-bold text-xl text-center">{item.to}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Modules */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Core Modules</h2>
            <p className="text-xl text-gray-600">A comprehensive framework designed for continuous impact and seamless integration into your existing HR workflows.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                <div className="text-[#247114] mb-6 bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {mod.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{mod.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Business Impact */}
        <section className="bg-[#fafafa] py-32 mb-24 rounded-[60px] mx-4 md:mx-auto max-w-[1400px]">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-center mb-20">Business Impact</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {impacts.map((val, i) => (
                <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                  <h3 className="text-3xl font-bold mb-8 text-[#247114]">{val.title}</h3>
                  <ul className="space-y-6">
                    {val.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#247114]" />
                        <span className="leading-relaxed text-lg text-gray-700 font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-10 mb-20">
          <h2 className="text-5xl font-bold tracking-tighter">Positioning Statement</h2>
          <div className="p-8 bg-[#fafafa] rounded-[30px] border border-gray-100 shadow-sm">
            <p className="text-2xl text-gray-800 leading-relaxed font-bold">
              Forest is <span className="text-[#247114]">not</span> a plantation initiative.<br/>
              It is a structured sustainability system embedded into your organization.
            </p>
          </div>
          <div className="w-24 h-1 bg-[#247114] opacity-20 mx-auto my-16 rounded-full"></div>
          <h3 className="text-4xl font-bold tracking-tighter text-[#247114]">FORESTGIFT</h3>
          <p className="text-2xl text-gray-600 font-medium">Building measurable sustainability systems for forward-thinking organizations.</p>
        </section>

      </main>
      <Footer />
    </div>
  );
};
