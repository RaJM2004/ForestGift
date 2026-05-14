import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';

const stories = [
  {
    title: "Celebrate Nature: Join Forest in Planting Trees and Giving Back to Earth",
    description: "Welcome to Forest, where we celebrate life through nature. Discover how you can plant trees, gift personal forests, and support environmental projects. Join our community passionate about sustainability and explore eco-friendly products while tracking your tree plantations. Together, let's create a greener future—one tree at a time.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    date: "5/8/2024",
    readTime: "1 min read"
  },
  {
    title: "Celebrating Nature: Join Us in Planting Trees and Empowering Sustainability",
    description: "At Forest, we celebrate life through nature by planting trees and gifting forests. Explore our eco-friendly products, track your tree plantations, and become part of a passionate community. Join us in creating a greener future, one tree at a time. Together, we can make a difference for generations to come.",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800",
    date: "5/8/2024",
    readTime: "1 min read"
  }
];

export const StoriesPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Heading Section */}
          <section className="text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[90px] font-bold tracking-tighter leading-none mb-6"
            >
              Let's hear <span className="text-[#247114]">Stories</span>
            </motion.h1>
            <p className="text-gray-900 text-xl md:text-2xl font-medium">
              Stories from around the world.
            </p>
          </section>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-32">
            {stories.map((story, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-sm mb-8">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight leading-snug group-hover:text-[#247114] transition-colors">
                    {story.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-[16px]">
                    {story.description}
                  </p>
                  <p className="text-sm font-medium text-gray-400">
                    {story.date} · {story.readTime}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
