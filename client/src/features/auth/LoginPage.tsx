import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { login } from '../../api';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'ngo' | 'cake' | 'user', userData: any) => void;
  onBack?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email);
      onLogin(data.role, data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid email address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex selection:bg-[#247114] selection:text-white font-['Inter',_sans-serif]">
      {/* Mobile-only Foliage Background */}
      <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://img.freepik.com/free-vector/green-foliage-background_53876-112907.jpg" 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      {/* Left Side: Immersive Image */}
      <div className="hidden lg:block w-[60%] h-full sticky top-0 overflow-hidden z-10">
        <img 
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200" 
          alt="Lush Forest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-12 left-12 text-white">
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-80 mb-2">Sustainable Gifting</p>
          <h2 className="text-4xl font-bold tracking-tighter">Every seed tells a story.</h2>
        </div>
      </div>

      {/* Right Side: Login Session */}
      <div className="relative z-10 w-full lg:w-[40%] flex items-center justify-center p-8 md:p-16 h-full overflow-hidden">
        {/* Right Side Foliage Background (Desktop) */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          <img 
            src="https://img.freepik.com/free-vector/green-foliage-background_53876-112907.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.4]"
          />
          <div className="absolute inset-0 bg-white/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo Section - Same as Navbar */}
          <div className="mb-20 text-center lg:text-left">
            <div onClick={onBack} className="inline-flex items-center space-x-2 cursor-pointer group">
              <span className="text-[32px] md:text-[38px] font-black text-black tracking-tighter leading-none group-hover:scale-105 transition-transform">
                Forest<span className="text-[#247114]">gift</span>
              </span>
            </div>
          </div>

          {/* Login Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tighter text-gray-900">Welcome Back</h3>
              <p className="text-gray-500 font-medium">Please enter your authorized email to access the portal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@forestgift.com"
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#247114] focus:bg-white transition-all font-medium text-lg shadow-sm"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 text-red-500 px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-100"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[70px] bg-[#247114] hover:bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#247114]/10 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    ENTER PORTAL
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {onBack && (
              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={onBack}
                  className="text-gray-400 hover:text-[#247114] font-bold text-[11px] uppercase tracking-widest transition-colors flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Return to Landing
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
