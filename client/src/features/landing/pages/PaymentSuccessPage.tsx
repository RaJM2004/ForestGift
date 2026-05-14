import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Share2, Download } from 'lucide-react';

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <div className="max-w-3xl w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-[#247114]/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-[#247114]" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter"
        >
          Thank You for <span className="text-[#247114]">Gifting a Life.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Your payment was successful. We have received your request to plant a tree. 
          A confirmation email has been sent to your registered address.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto"
        >
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-[#247114] transition-all group"
          >
            Go to My Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-black rounded-full font-bold hover:bg-gray-200 transition-all"
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
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-8">What happens next?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-[#247114]">01</span>
              </div>
              <h3 className="font-bold mb-2">Allocation</h3>
              <p className="text-sm text-gray-500">We assign your tree to a verified NGO partner.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-[#247114]">02</span>
              </div>
              <h3 className="font-bold mb-2">Plantation</h3>
              <p className="text-sm text-gray-500">Your tree is planted during the next planting cycle.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-[#247114]">03</span>
              </div>
              <h3 className="font-bold mb-2">Verification</h3>
              <p className="text-sm text-gray-500">You receive a digital certificate and GPS coordinates.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
