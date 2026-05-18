import React, { useState } from 'react';
import { subscribeNewsletter } from '../../../api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await subscribeNewsletter(email);
      if (res.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

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
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <p className="text-base font-medium text-white/80">
                  Enter your email address
                </p>
                <div className="w-full max-w-sm bg-white rounded-xl p-1 shadow-2xl">
                  <input 
                    type="email" 
                    required
                    placeholder="Your email for updates" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 text-black focus:outline-none bg-transparent text-lg placeholder:text-gray-400 font-medium disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-fit text-sm font-black tracking-[0.2em] hover:text-[#247114] disabled:text-gray-400 transition-colors text-white uppercase cursor-pointer"
                >
                  {status === 'loading' ? 'SUBMITTING...' : status === 'success' ? 'THANK YOU!' : 'JOIN OUR GREEN INITIATIVE'}
                </button>
                {status === 'success' && (
                  <p className="text-xs font-bold text-emerald-400 animate-in fade-in duration-200">
                    🌿 Successfully joined the initiative! Support copy received.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-xs font-bold text-rose-400 animate-in fade-in duration-200">
                    ❌ Failed to subscribe. Please try again.
                  </p>
                )}
              </div>
            </form>
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
