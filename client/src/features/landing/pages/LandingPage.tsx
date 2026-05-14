import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Plans } from '../components/Plans';
import { Footer } from '../components/Footer';
import { NumbersGrid } from '../components/NumbersGrid';
import { Gifts } from '../components/Gifts';
import { Memories } from '../components/Memories';
import { How } from '../components/How';
import { Why } from '../components/Why';

import { NavigationProps } from '../types';

interface LandingPageProps extends NavigationProps {
  onExploreClick?: (type: 'gifts' | 'cakes' | 'tours') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick, onExploreClick }) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main>
        <Hero onPlantClick={onPlantClick} />
        <Plans showHeader={true} onPlantClick={onPlantClick} />
        <NumbersGrid />
        
        <How />

        <Why />

        <Gifts onExploreClick={onExploreClick} />
        <Memories />
      </main>
      <Footer />
      
    </div>
  );
};
