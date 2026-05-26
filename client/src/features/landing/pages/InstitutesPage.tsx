import React from 'react';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { BookOpen, TreePine, Leaf, Trophy, LayoutDashboard, Calendar, Award, Rocket, CheckCircle2 } from 'lucide-react';

export const InstitutesPage: React.FC = () => {
  const modules = [
    { icon: <TreePine className="w-8 h-8" />, title: 'Student Tree Discipline', desc: 'Every student is assigned a tree annually, tagged to their identity, creating personal ownership of environmental impact.' },
    { icon: <Leaf className="w-8 h-8" />, title: 'Campus Transformation', desc: 'Convert unused/barren land into green cover every year with structured land utilization planning and student involvement.' },
    { icon: <BookOpen className="w-8 h-8" />, title: 'Sustainable Me System', desc: 'Student-focused sustainability guide and practical checklist for daily eco habits, waste reduction, and energy-saving.' },
    { icon: <Trophy className="w-8 h-8" />, title: 'Culture & Recognition', desc: 'Celebrate selected student milestones and link recognition with tree plantation for organic social visibility.' },
    { icon: <LayoutDashboard className="w-8 h-8" />, title: 'Forest Dashboard', desc: 'A structured dashboard showing total trees planted, participation percentage, and sustainability indicators.' },
    { icon: <Calendar className="w-8 h-8" />, title: 'Plantation Events', desc: 'Annual or bi-annual plantation drives at scale for hands-on student involvement and institutional branding.' },
    { icon: <Award className="w-8 h-8" />, title: 'Certification System', desc: 'Tree-linked certificates for students and "Forest Participating Campus" recognition for the institution.' },
    { icon: <Rocket className="w-8 h-8" />, title: 'Entrepreneurship Pipeline', desc: 'Identify students with sustainability-driven ideas, provide guidance, and encourage green innovation.' },
  ];

  const values = [
    { title: 'For Institution', points: ['Strong campus culture', 'Higher student engagement', 'Structured sustainability system', 'Support for NAAC / ESG narrative', 'Increased visibility and reputation'] },
    { title: 'For Students', points: ['Real-world sustainability experience', 'Personal responsibility and identity', 'Behavioral transformation', 'Participation in meaningful impact'] },
    { title: 'For Campus Ecosystem', points: ['Physical green transformation', 'Reduced waste and resource usage', 'Long-term environmental contribution'] }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-20">
        
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight uppercase">
              FOREST FOR <span className="text-[#247114]">INSTITUTIONS</span>
            </h1>
            <p className="text-2xl font-medium text-gray-800">
              Building Sustainability-Driven Campuses & Future-Ready Students
            </p>
            <div className="text-xl text-gray-600 italic bg-gray-50 p-8 rounded-3xl mt-8 shadow-sm">
              “We convert students into sustainability-driven individuals while transforming campuses into living ecosystems.”
            </div>
          </motion.div>
        </section>

        {/* About & Vision */}
        <section className="bg-[#fafafa] py-24 mb-24">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">ABOUT FOREST (INSTITUTION MODEL)</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Forest is a structured sustainability system designed for educational institutions. It integrates student participation, behavioral change, and environmental action into a single continuous program.
              </p>
              <p className="text-lg font-bold text-[#247114]">
                This is not a one-time activity. It is a campus-wide transformation model.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">THE CORE VISION</h2>
              <ul className="space-y-4">
                {[
                  'Every student becomes environmentally responsible',
                  'Every campus becomes a living, growing ecosystem',
                  'Sustainability becomes part of daily student life'
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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">What We Build Inside Your Institution</h2>
            <p className="text-xl text-gray-600">A comprehensive framework for continuous impact.</p>
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
          <h2 className="text-4xl font-bold tracking-tighter">System Discipline</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            One student = one tree. Real participation (no symbolic activity). Continuous annual engagement. Structured execution.
          </p>
          <div className="w-24 h-1 bg-[#247114] mx-auto my-12 opacity-20 rounded-full"></div>
          <h3 className="text-3xl font-bold uppercase tracking-widest text-[#247114]">Forest</h3>
          <p className="text-2xl text-gray-800 font-medium">Building sustainability-driven campuses for the next generation.</p>
          <p className="text-lg text-gray-500 italic mt-4">
            "Transform your campus into a living forest and your students into responsible future leaders."
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
};
