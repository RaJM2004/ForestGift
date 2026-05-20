import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Footer } from '../components/Footer';

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white font-['Inter',_sans-serif]">
      <main className="pt-32 md:pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-[#fafafa] border border-gray-100 rounded-[48px] p-8 md:p-16 shadow-xl shadow-black/[0.003] text-center relative overflow-hidden">
            {/* Soft decorative green ambient glow underlays to feel premium */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#247114]/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-100/30 blur-[80px] rounded-full pointer-events-none"></div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-[#247114]/10 rounded-full flex items-center justify-center mx-auto mb-8 relative"
            >
              {/* Pulsing ring overlay */}
              <div className="absolute inset-0 rounded-full bg-[#247114]/20 animate-ping opacity-60"></div>
              <CheckCircle className="w-12 h-12 text-[#247114] relative z-10" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter leading-tight"
            >
              Thank You for <span className="text-[#247114] block sm:inline">Gifting a Life.</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Your payment has been successfully processed. A green space of hope is now growing in your name. 
              We have sent a comprehensive receipt and plantation details to your registered email address.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto"
            >
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-[#247114] transition-all duration-300 group shadow-lg active:scale-95 cursor-pointer uppercase text-xs tracking-wider"
              >
                Go to My Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-black rounded-full font-bold hover:bg-gray-50 transition-all duration-300 shadow-md active:scale-95 cursor-pointer uppercase text-xs tracking-wider"
              >
                Plant More Trees
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-16 pt-16 border-t border-gray-100"
            >
              <p className="text-xs text-gray-400 uppercase tracking-widest font-black mb-10">What happens next?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-lg hover:shadow-black/[0.008] transition-all duration-300">
                  <div className="w-12 h-12 bg-[#247114]/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#247114]/10">
                    <span className="font-bold text-[#247114] text-sm">01</span>
                  </div>
                  <h3 className="font-bold mb-2 text-gray-900">Allocation</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Your contribution is matched with a verified NGO partner in real-time.</p>
                </div>
                
                <div className="text-center p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-lg hover:shadow-black/[0.008] transition-all duration-300">
                  <div className="w-12 h-12 bg-[#247114]/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#247114]/10">
                    <span className="font-bold text-[#247114] text-sm">02</span>
                  </div>
                  <h3 className="font-bold mb-2 text-gray-900">Plantation</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Native saplings are planted and geotagged during active cycles.</p>
                </div>
                
                <div className="text-center p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-lg hover:shadow-black/[0.008] transition-all duration-300">
                  <div className="w-12 h-12 bg-[#247114]/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#247114]/10">
                    <span className="font-bold text-[#247114] text-sm">03</span>
                  </div>
                  <h3 className="font-bold mb-2 text-gray-900">Verification</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">You receive a digitally signed certificate and live coordinates.</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
