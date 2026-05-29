import React, { useState } from 'react';
import { motion } from 'framer-motion';

const comparisonData = [
  {
    dimension: "Core Purpose",
    forest: "Habit-building through life events",
    ngos: "Plantation numbers & campaigns",
    software: "Data recording & reporting"
  },
  {
    dimension: "Primary Focus",
    forest: "Human behavior change",
    ngos: "Environmental activity",
    software: "Digital tracking"
  },
  {
    dimension: "Planting Trigger",
    forest: "Only personal birthdays",
    ngos: "Any day, events, CSR, festivals",
    software: "User input / bulk upload"
  },
  {
    dimension: "Trees per Person Rule",
    forest: "Minimum 1 – Maximum 10 trees/year",
    ngos: "Unlimited planting allowed",
    software: "No planting limits"
  },
  {
    dimension: "CSR / Donations",
    forest: "Not allowed",
    ngos: "Major revenue source",
    software: "Usually CSR-dependent"
  },
  {
    dimension: "Emotional Anchor",
    forest: "Birthday + living tree + celebration",
    ngos: "Plantation drive photos",
    software: "None"
  },
  {
    dimension: "Celebration Element",
    forest: "Cake + Certificate + Story",
    ngos: "Rare or absent",
    software: "None"
  },
  {
    dimension: "Relationship with User",
    forest: "Long-term (year-on-year)",
    ngos: "One-time participation",
    software: "Transactional"
  },
  {
    dimension: "User Identity",
    forest: "Individual human being",
    ngos: "Donor / volunteer",
    software: "Data entry user"
  },
  {
    dimension: "Land Ownership Model",
    forest: "Curated partner lands only",
    ngos: "Mixed / unclear",
    software: "Not applicable"
  },
  {
    dimension: "NGO Role",
    forest: "Execution partner (not brand owner)",
    ngos: "Central authority",
    software: "Data provider"
  },
  {
    dimension: "Tree Ownership Philosophy",
    forest: "Emotional ownership (not legal)",
    ngos: "Symbolic ownership",
    software: "Digital ownership"
  },
  {
    dimension: "Certificate Value",
    forest: "Proof of habit & life memory",
    ngos: "Proof of plantation",
    software: "Proof of data"
  },
  {
    dimension: "Survival Responsibility",
    forest: "Forest ecosystem responsibility",
    ngos: "Often unclear post-plantation",
    software: "Not tracked"
  },
  {
    dimension: "Gamification",
    forest: "Discipline via limits (1–10 rule)",
    ngos: "Quantity-driven",
    software: "Leaderboards"
  },
  {
    dimension: "Scalability Logic",
    forest: "Slow, deep, lifelong",
    ngos: "Fast, campaign-driven",
    software: "Fast, tech-driven"
  },
  {
    dimension: "Revenue Model",
    forest: "Direct service payment",
    ngos: "Donations, CSR",
    software: "SaaS / subscriptions"
  },
  {
    dimension: "Trust Model",
    forest: "Relationship + repeat years",
    ngos: "Brand & audit claims",
    software: "System logs"
  },
  {
    dimension: "Technology Role",
    forest: "Supporting layer",
    ngos: "Central layer",
    software: "Core Product"
  },
  {
    dimension: "User Motivation",
    forest: "Legacy & meaning",
    ngos: "Charity",
    software: "Compliance"
  },
  {
    dimension: "Abuse Prevention",
    forest: "Hard rules + caps",
    ngos: "Low",
    software: "None"
  },
  {
    dimension: "Cultural Depth",
    forest: "High",
    ngos: "Medium",
    software: "None"
  },
  {
    dimension: "Global Replicability",
    forest: "High (birthdays are universal)",
    ngos: "Medium",
    software: "High"
  },
  {
    dimension: "Long-Term Impact",
    forest: "Forests + mindset shift",
    ngos: "Trees planted",
    software: "Data stored"
  }
];

export const Why: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayData = isExpanded ? comparisonData : comparisonData.slice(0, 5);

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-[80px] font-bold tracking-tighter leading-none mb-6">
            <span className="text-[#247114]">Why</span> Forest.?
          </h2>
          <p className="text-gray-700 text-lg md:text-xl font-medium tracking-wide">
            Others plant trees. We plants a habit that grows trees every year."
          </p>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="min-w-[800px] md:min-w-0 grid grid-cols-4 gap-x-8 gap-y-4 text-[14px] md:text-[15px]">
            {/* Header Row */}
            <div className="font-bold text-[#247114] underline decoration-2 underline-offset-8 mb-6">Dimension</div>
            <div className="font-bold text-[#247114] underline decoration-2 underline-offset-8 mb-6 text-center uppercase">Forest.</div>
            <div className="font-bold text-[#247114] underline decoration-2 underline-offset-8 mb-6 text-center">Plantation NGOs / Platforms</div>
            <div className="font-bold text-[#247114] underline decoration-2 underline-offset-8 mb-6 text-center">Plantation Software / Dashboards</div>

            {/* Data Rows */}
            {displayData.map((row, i) => (
              <React.Fragment key={i}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.02 }}
                  className="font-bold text-[#247114] py-2 border-b border-gray-50 flex items-center"
                >
                  {row.dimension}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.02 }}
                  className="text-center py-2 text-gray-900 font-bold bg-green-50/30 border-b border-gray-50 flex items-center justify-center"
                >
                  {row.forest}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.02 }}
                  className="text-center py-2 text-gray-500 font-medium border-b border-gray-50 flex items-center justify-center"
                >
                  {row.ngos}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 5) * 0.02 }}
                  className="text-center py-2 text-gray-500 font-medium border-b border-gray-50 flex items-center justify-center"
                >
                  {row.software}
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-10 py-3 bg-black text-white rounded-full text-[13px] font-black tracking-widest uppercase hover:bg-[#247114] transition-all"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </section>
  );
};
