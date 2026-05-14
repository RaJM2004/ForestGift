import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Branding */}
          <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tighter leading-none">
              Forest.
            </h3>
            <p className="text-xl tracking-tight text-white/90">
              Real Earth Legacy
            </p>
            <div className="pt-20 hidden md:block">
              <p className="text-white/60 text-sm tracking-wide">
                © 2025. All rights reserved.
              </p>
            </div>
          </div>

          {/* Middle Column: Sustainability */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">
              Sustainability
            </h4>
            <div className="space-y-3">
              <p className="text-xl font-medium">+91 7843012319</p>
              <p className="text-xl font-medium">Support@forestgift.in</p>
            </div>
          </div>

          {/* Right Column: Community & Subscribe */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">
              Community
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-base font-medium text-white/80">
                  Enter your email address
                </p>
                <div className="w-full max-w-sm bg-white rounded-xl p-1 shadow-2xl">
                  <input 
                    type="email" 
                    placeholder="Your email for updates" 
                    className="w-full px-4 py-3 text-black focus:outline-none bg-transparent text-lg placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>
              <button className="text-sm font-black tracking-[0.2em] hover:text-[#247114] transition-colors text-white uppercase">
                JOIN OUR GREEN INITIATIVE
              </button>
            </div>
          </div>

          {/* Mobile Copyright */}
          <div className="pt-12 md:hidden">
            <p className="text-white/60 text-sm tracking-wide">
              © 2025. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
