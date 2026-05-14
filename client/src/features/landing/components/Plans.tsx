import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Calendar, Phone, MapPin, ChevronRight } from 'lucide-react';
import { getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment } from '../../../api';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlanCard = ({ trees, label, image, delay, onPay, isProcessing }: { trees: string; label: string; image: string; delay: number; onPay: () => void; isProcessing: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="flex flex-col items-center group h-full justify-between"
  >
    <div 
      className="h-64 md:h-80 w-full flex items-center justify-center mb-0 transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
      onClick={onPay}
    >
      <img src={image} alt={label} className="max-h-full max-w-full object-contain" />
    </div>
    <div className="text-center">
      <h3 className="text-xl md:text-2xl font-bold mb-4">
        <span className="text-[#247114]">{trees} Tree</span> Every Birthday
      </h3>
      <button 
        onClick={onPay}
        disabled={isProcessing}
        className="px-10 py-3.5 bg-black text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-[#247114] transition-all active:scale-95 shadow-xl shadow-black/5 group-hover:shadow-black/20 disabled:opacity-50"
      >
        {isProcessing ? 'PROCESSING...' : label}
      </button>
    </div>
  </motion.div>
);

export const Plans: React.FC<{ showHeader?: boolean; onPlantClick?: () => void }> = ({ showHeader = true, onPlantClick }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ amount: number; label: string } | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    pincode: ''
  });

  const handlePlanClick = (amount: number, label: string) => {
    setSelectedPlan({ amount, label });
    setShowForm(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const { amount, label } = selectedPlan;
    setProcessingId(label);
    setShowForm(false);

    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setProcessingId(null);
        return;
      }

      const { key } = await getRazorpayKey();
      if (!key) {
        alert('Payment gateway key not found.');
        setProcessingId(null);
        return;
      }

      const order = await createRazorpayOrder(amount, `receipt_${label}_${Date.now()}`);
      
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'Forest Gift',
        description: `Plan: ${label} - ${amount} INR`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userDetails: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob,
                address: `${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`
              },
              planDetails: { amount, label, trees: label === 'CHILD' ? 1 : label === 'YOUTH' ? 5 : 10 }
            });
            
            navigate('/payment-success');
          } catch (err) {
            console.error('Payment Verification Failed', err);
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#247114',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
    } catch (err) {
      console.error('Error initiating payment:', err);
      alert('Error initiating payment');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="bg-white min-h-[600px] flex items-center px-6 py-12 md:py-24 relative">
      <div className="max-w-7xl mx-auto text-center w-full">
        {showHeader && (
          <div className="mb-12 md:mb-20">
            <h2 className="text-5xl md:text-[72px] font-bold mb-4 tracking-tighter leading-none">
              Forest. <span className="text-[#247114]">Plans</span>
            </h2>
            <p className="text-gray-500 text-base md:text-xl font-medium">Start your journey by Taking an Oth.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          <PlanCard
            trees="1"
            label="CHILD"
            image="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/1-weL5oULaZlVRdkoW.svg"
            delay={0.1}
            onPay={() => handlePlanClick(1000, 'CHILD')}
            isProcessing={processingId === 'CHILD'}
          />
          <PlanCard
            trees="5"
            label="YOUTH"
            image="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/3-RfwxF2WHhFUi52Fp.svg"
            delay={0.2}
            onPay={() => handlePlanClick(5000, 'YOUTH')}
            isProcessing={processingId === 'YOUTH'}
          />
          <PlanCard
            trees="10"
            label="ELDER"
            image="https://assets.zyrosite.com/AE0r4EWz6LuN9z6g/2-1fLJvcLm6KVwVDqB.svg"
            delay={0.3}
            onPay={() => handlePlanClick(10000, 'ELDER')}
            isProcessing={processingId === 'ELDER'}
          />
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Planting for a better future</h3>
                    <p className="text-gray-500">Please provide your details to continue.</p>
                  </div>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="text"
                          placeholder="Full name"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="email"
                          placeholder="Email"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Country</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          required
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all appearance-none"
                          value={formData.country}
                          onChange={e => setFormData({...formData, country: e.target.value})}
                        >
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">State</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          required
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all appearance-none"
                          value={formData.state}
                          onChange={e => setFormData({...formData, state: e.target.value})}
                        >
                          <option value="">State</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Rajasthan">Rajasthan</option>
                          {/* Add more as needed */}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="text"
                          placeholder="City"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Pin Code</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="text"
                          placeholder="Pin Code"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all"
                          value={formData.pincode}
                          onChange={e => setFormData({...formData, pincode: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="date"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all"
                          value={formData.dob}
                          onChange={e => setFormData({...formData, dob: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          required
                          type="tel"
                          placeholder="Phone number"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] transition-all"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#247114] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a560e] transition-all shadow-lg shadow-[#247114]/20 group"
                    >
                      PROCEED TO PAY ₹{selectedPlan?.amount}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                      By proceeding, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
