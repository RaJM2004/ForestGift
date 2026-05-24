import React, { useState } from 'react';
import { NavigationProps } from '../types';

export const Navbar: React.FC<NavigationProps> = ({ 
  onLoginClick, 
  onAboutClick, 
  onStoriesClick, 
  onPlantClick, 
  onHomeClick, 
  onContactClick,
  isAuthenticated,
  onDashboardClick,
  onLogoutClick,
  onIndividualClick,
  onIndustriesClick,
  onInstitutesClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const linkClass = "relative py-2 group hover:text-[#247114] transition-colors cursor-pointer";
  const underlineClass = "absolute bottom-0 left-0 w-0 h-[2px] bg-[#247114] transition-all duration-300 group-hover:w-full";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-100 h-20 md:h-[133px] flex items-center transition-all duration-300">
      <div className="flex items-center w-full max-w-[1190px] mx-auto px-6">
        <div 
          className="flex items-center cursor-pointer shrink-0"
          onClick={onHomeClick}
        >
          <img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0r4EWz6LuN9z6g/title-IA5qPxoWCRTW532I.jpg" 
            alt="Forestgift" 
            style={{ width: '220px', height: '60px' }}
            className="object-contain md:w-[258px] md:h-[73px]"
          />
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center ml-10 space-x-12 text-[18px] font-normal text-gray-800">
          <div onClick={onAboutClick} className={linkClass}>
            About Us
            <div className={underlineClass}></div>
          </div>
          <div onClick={onStoriesClick} className={linkClass}>
            Stories
            <div className={underlineClass}></div>
          </div>
          <div onClick={onPlantClick} className={linkClass}>
            Plant
            <div className={underlineClass}></div>
          </div>

          <div className="relative group cursor-pointer py-2">
            <div className="flex items-center group-hover:text-[#247114] transition-colors">
              <span>Challenges</span>
              <svg className="w-3 h-3 ml-1 transformation group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className={underlineClass}></div>
            
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div onClick={onIndividualClick} className="block px-6 py-2.5 text-[14px] font-normal hover:bg-gray-50 hover:text-[#247114] cursor-pointer">Individual</div>
              <div onClick={onIndustriesClick} className="block px-6 py-2.5 text-[14px] font-normal hover:bg-gray-50 hover:text-[#247114] cursor-pointer">Industries</div>
              <div onClick={onInstitutesClick} className="block px-6 py-2.5 text-[14px] font-normal hover:bg-gray-50 hover:text-[#247114] cursor-pointer">Institutes</div>
            </div>
          </div>
        </div>

        {/* Hamburger/Login */}
        <div className="ml-auto flex items-center">
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-4">
              <button 
                onClick={onDashboardClick}
                className="px-8 py-3 bg-[#247114] text-white rounded-full text-sm font-bold tracking-widest hover:bg-emerald-700 transition-all active:scale-95 uppercase"
              >
                DASHBOARD
              </button>
              <button 
                onClick={onLogoutClick}
                className="px-8 py-3 bg-black text-white rounded-full text-sm font-bold tracking-widest hover:bg-rose-600 transition-all active:scale-95 uppercase"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="hidden lg:block px-10 py-3 bg-black text-white rounded-full text-sm font-bold tracking-widest hover:bg-[#247114] transition-all active:scale-95 uppercase"
            >
              MY FOREST
            </button>
          )}
          
          {/* Hamburger Icon for Mobile */}
          <button 
            className="lg:hidden p-2 text-black active:scale-95 transition-all z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Hamburger clicked, current state:', isMenuOpen);
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 top-20 bg-white z-[105] lg:hidden animate-in slide-in-from-top duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex flex-col p-8 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
            <div onClick={() => { onAboutClick(); setIsMenuOpen(false); }} className="text-[18px] font-medium text-gray-900 py-4 border-b border-gray-100">About Us</div>
            <div onClick={() => { onStoriesClick(); setIsMenuOpen(false); }} className="text-[18px] font-medium text-gray-900 py-4 border-b border-gray-100">Stories</div>
            <div onClick={() => { onPlantClick(); setIsMenuOpen(false); }} className="text-[18px] font-medium text-gray-900 py-4 border-b border-gray-100">Plant Today</div>

            
            <div className="py-4 border-b border-gray-100">
              <div className="text-[18px] font-medium text-gray-900 mb-4">Challenges</div>
              <div className="pl-4 space-y-4">
                <div onClick={() => { onIndividualClick?.(); setIsMenuOpen(false); }} className="block text-gray-600 font-normal cursor-pointer">Individual</div>
                <div onClick={() => { onIndustriesClick?.(); setIsMenuOpen(false); }} className="block text-gray-600 font-normal cursor-pointer">Industries</div>
                <div onClick={() => { onInstitutesClick?.(); setIsMenuOpen(false); }} className="block text-gray-600 font-normal cursor-pointer">Institutes</div>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-4 mt-8">
                <button 
                  onClick={() => { onDashboardClick?.(); setIsMenuOpen(false); }}
                  className="w-full py-4 bg-[#247114] text-white rounded-xl text-sm font-bold tracking-widest uppercase shadow-lg active:scale-95 transition-all"
                >
                  DASHBOARD
                </button>
                <button 
                  onClick={() => { onLogoutClick?.(); setIsMenuOpen(false); }}
                  className="w-full py-4 bg-black text-white rounded-xl text-sm font-bold tracking-widest uppercase shadow-lg active:scale-95 transition-all"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                className="w-full py-4 bg-black text-white rounded-xl text-sm font-bold tracking-widest uppercase mt-8 shadow-lg active:scale-95 transition-all"
              >
                MY FOREST
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
