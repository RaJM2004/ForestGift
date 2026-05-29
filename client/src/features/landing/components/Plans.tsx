import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Calendar, Phone, MapPin, ChevronRight, Trees, Heart } from 'lucide-react';
import { getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment, recordBankTransfer } from '../../../api';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlanCard = ({
  trees,
  label,
  image,
  delay,
  onPay,
  isProcessing,
  price,
  tagline,
  features,
  badge
}: {
  trees: string;
  label: string;
  image: string;
  delay: number;
  onPay: () => void;
  isProcessing: boolean;
  price: string;
  tagline: string;
  features: string[];
  badge?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -8 }}
    className="relative flex flex-col items-center bg-white border border-emerald-100/60 rounded-[32px] p-8 shadow-xl shadow-emerald-950/[0.01] hover:shadow-2xl hover:shadow-emerald-950/[0.06] hover:border-emerald-200/80 transition-all duration-500 group h-full justify-between overflow-hidden"
  >
    {/* Background Ambient Glow */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

    {badge && (
      <div className="absolute top-4 right-4 bg-[#247114] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm z-10 animate-pulse">
        {badge}
      </div>
    )}

    {/* Plan Image */}
    <motion.div
      className="h-64 md:h-80 w-full flex items-center justify-center mb-6 mt-4 relative z-10 cursor-pointer"
      onClick={onPay}
    >
      <img src={image} alt={label} className="max-h-full max-w-full object-contain mix-blend-multiply scale-100 md:scale-110 transition-transform duration-500 group-hover:scale-110 md:group-hover:scale-125" />
    </motion.div>

    {/* Title & Tagline */}
    <div className="text-center w-full relative z-10 flex-grow flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          <span className="text-[#247114]">{trees} Tree</span> Every Birthday
        </h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed px-2">
          {tagline}
        </p>
      </div>

      {/* Pricing Tag */}
      <div className="mb-4 bg-emerald-50/50 py-3 rounded-2xl border border-emerald-100/30">
        <div className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">
          ₹{price}
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-2 mb-6 text-left w-full border-t border-gray-100 pt-4">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 font-medium">
            <span className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mt-0.5 flex-shrink-0">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        onClick={onPay}
        disabled={isProcessing}
        className="px-10 py-3.5 bg-black hover:bg-[#247114] text-white disabled:bg-gray-200 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-black/5 group-hover:shadow-black/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
      >
        <span>{isProcessing ? 'PROCESSING...' : label}</span>
        <ChevronRight size={12} className="transform group-hover:translate-x-0.5 transition-transform text-white/80" />
      </button>
    </div>
  </motion.div>
);

export const Plans: React.FC<{ showHeader?: boolean; onPlantClick?: () => void }> = ({ showHeader = true, onPlantClick }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ amount: number; label: string } | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'method'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'bank' | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
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
    setPledgeChecked(false);
    setPaymentStep('details');
    setPaymentMethod(null);
    setShowForm(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !pledgeChecked) return;
    setPaymentStep('method');
  };

  const handleRazorpayPayment = async () => {
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

  const handleBankTransferSubmit = async () => {
    if (!selectedPlan) return;
    const { amount, label } = selectedPlan;
    setIsPlacingOrder(true);

    try {
      await recordBankTransfer({
        userDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          address: `${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`
        },
        planDetails: {
          amount,
          label,
          trees: label === 'CHILD' ? 1 : label === 'YOUTH' ? 5 : 10
        }
      });

      navigate('/payment-success');
    } catch (err) {
      console.error('Bank Transfer registration failed:', err);
      alert('Failed to register Bank Transfer order.');
    } finally {
      setIsPlacingOrder(false);
      setShowForm(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-white via-[#fafdfb] to-white flex flex-col justify-start px-6 pt-6 pb-16 md:pt-8 md:pb-24 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center w-full relative z-10">
        {showHeader && (
          <div className="mb-12 md:mb-20">
            <h2 className="text-5xl md:text-[72px] font-bold mb-4 tracking-tighter leading-none">
              Forest. <span className="text-[#247114]">Plans</span>
            </h2>
            <p className="text-gray-500 text-base md:text-xl font-medium">Start your journey by Taking an Oth.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          <PlanCard
            trees="1"
            label="CHILD"
            price="1,000"
            tagline="Perfect for young pioneers beginning their lifelong green journey."
            features={[
              "1 Premium tree planted & nurtured",
              "Sustains 2 people with daily oxygen",
              "Absorbs 22kg of CO₂ annually",
              "Digital Birthday Legacy Certificate",
              "Exact GPS tracking & location updates"
            ]}
            badge="FRESH START"
            image="/plans/plan_1_tree.png"
            delay={0.1}
            onPay={() => handlePlanClick(1000, 'CHILD')}
            isProcessing={processingId === 'CHILD'}
          />
          <PlanCard
            trees="5"
            label="YOUTH"
            price="5,000"
            tagline="For active change-makers establishing a robust ecological impact."
            features={[
              "5 Premium trees planted & registered",
              "Sustains 10 people with daily oxygen",
              "Absorbs 110kg of CO₂ annually",
              "Custom Engraved Timber Plaque",
              "Quarterly growth & photo reports"
            ]}
            badge="MOST POPULAR"
            image="/plans/plan_5_trees.png"
            delay={0.2}
            onPay={() => handlePlanClick(5000, 'YOUTH')}
            isProcessing={processingId === 'YOUTH'}
          />
          <PlanCard
            trees="10"
            label="ELDER"
            price="10,000"
            tagline="A noble, heavy-impact legacy seeding a high-biodiversity micro-forest."
            features={[
              "10 Trees planted in a dedicated cluster",
              "Sustains 20 people with daily oxygen",
              "Absorbs 220kg of CO₂ annually",
              "Premium Engraved Brass Plaque",
              "Lifetime GPS & Drone Photo updates",
              "Creates a thriving local wild habitat"
            ]}
            badge="LEADER IMPACT"
            image="/plans/plan_10_trees.png"
            delay={0.3}
            onPay={() => handlePlanClick(10000, 'ELDER')}
            isProcessing={processingId === 'ELDER'}
          />
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
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
              className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl border border-emerald-100 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                {paymentStep === 'details' ? (
                  <>
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-bold">Planting for a better future</h3>
                        <p className="text-gray-500 text-sm">Please provide your details to continue.</p>
                      </div>
                      <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <X className="w-6 h-6 text-gray-500" />
                      </button>
                    </div>

                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              required
                              type="text"
                              placeholder="Full name"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Country</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              required
                              type="text"
                              placeholder="Country"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.country}
                              onChange={e => setFormData({ ...formData, country: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">State</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              required
                              type="text"
                              placeholder="State"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.state}
                              onChange={e => setFormData({ ...formData, state: e.target.value })}
                            />
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
                              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#247114] focus:bg-white focus:ring-1 focus:ring-[#247114] outline-none text-sm font-semibold text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.city}
                              onChange={e => setFormData({ ...formData, city: e.target.value })}
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
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.pincode}
                              onChange={e => setFormData({ ...formData, pincode: e.target.value })}
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
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all"
                              value={formData.dob}
                              onChange={e => setFormData({ ...formData, dob: e.target.value })}
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
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#247114] outline-none text-sm text-gray-800 transition-all placeholder:text-gray-400"
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Interactive Terms & Conditions Checkbox */}
                      <div className="pt-2">
                        <div className="flex items-start gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 transition-all duration-300">
                          <input
                            type="checkbox"
                            id="pledge"
                            required
                            checked={pledgeChecked}
                            onChange={(e) => setPledgeChecked(e.target.checked)}
                            className="mt-1 w-4 h-4 text-[#247114] focus:ring-[#247114] border-emerald-300 rounded cursor-pointer flex-shrink-0"
                          />
                          <label htmlFor="pledge" className="text-xs text-emerald-800 font-bold leading-relaxed select-none cursor-pointer">
                            I agree to{' '}
                            <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-950 transition-colors">
                              Terms & Conditions
                            </a>{' '}
                            and{' '}
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-950 transition-colors">
                              Privacy policy
                            </a>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={!pledgeChecked}
                          className="w-full py-4 bg-[#247114] hover:bg-[#1b550e] disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-2xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#247114]/25 active:scale-[0.98] cursor-pointer group"
                        >
                          PROCEED TO PAY ₹{selectedPlan?.amount.toLocaleString()}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                          By proceeding, you agree to our Terms of Service and Privacy Policy.
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Payment Method Step */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPaymentStep('details')}
                          className="p-2 hover:bg-emerald-50 rounded-full text-gray-500 hover:text-[#247114] transition-colors cursor-pointer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div>
                          <h3 className="text-xl font-bold">Choose Payment</h3>
                          <p className="text-xs text-gray-500">Select your preferred payment method</p>
                        </div>
                      </div>
                      <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <X className="w-6 h-6 text-gray-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`p-5 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2.5 ${paymentMethod === 'razorpay'
                            ? 'border-[#247114] bg-emerald-50/20 shadow-sm shadow-emerald-100/50'
                            : 'border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/5'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'razorpay' ? 'bg-[#247114] text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">Razorpay</h4>
                          <p className="text-[9px] text-gray-400 font-semibold mt-0.5">UPI, Cards, NetBanking</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-5 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-2.5 ${paymentMethod === 'bank'
                            ? 'border-[#247114] bg-emerald-50/20 shadow-sm shadow-emerald-100/50'
                            : 'border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/5'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'bank' ? 'bg-[#247114] text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">Bank Transfer</h4>
                          <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Direct Deposit</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {paymentMethod === 'razorpay' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-2xl p-4 text-[11px] font-semibold text-emerald-800 leading-relaxed">
                            🌿 You will be redirected to the secure Razorpay Payment Gateway. Once the payment succeeds, your tree registration and global certificate will be minted instantly!
                          </div>

                          <button
                            onClick={handleRazorpayPayment}
                            disabled={processingId !== null}
                            className="w-full py-4 bg-[#247114] hover:bg-[#1b550e] disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-2xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#247114]/25 active:scale-[0.98] cursor-pointer"
                          >
                            {processingId ? 'PROCESSING...' : `PROCEED TO PAY ₹${selectedPlan?.amount.toLocaleString()}`}
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      )}

                      {paymentMethod === 'bank' && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-left space-y-3">
                            <h4 className="text-[#247114] font-bold uppercase tracking-wider text-[10px] border-b border-emerald-100 pb-1.5 flex items-center gap-1.5">
                              <Trees size={12} />
                              <span>Bank Transfer Instructions</span>
                            </h4>

                            <div className="space-y-1.5 text-xs text-gray-800 font-semibold">
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-gray-400 text-[10px] font-bold uppercase">Beneficiary</span>
                                <span className="font-bold text-gray-900">Rupak Kumar Gouda</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-gray-400 text-[10px] font-bold uppercase">Role</span>
                                <span className="font-bold text-gray-900">Founder, Director</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-gray-400 text-[10px] font-bold uppercase">Bank Name</span>
                                <span className="font-bold text-[#247114]">Axis Bank</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-gray-400 text-[10px] font-bold uppercase">Account No</span>
                                <span className="font-bold text-gray-950 font-mono select-all">925010059072428</span>
                              </div>
                              <div className="flex justify-between items-center py-0.5">
                                <span className="text-gray-400 text-[10px] font-bold uppercase">IFSC Code</span>
                                <span className="font-bold text-gray-950 font-mono select-all">UTIB0002952</span>
                              </div>
                            </div>

                            <div className="pt-2.5 border-t border-emerald-100 text-[10px] font-bold text-emerald-800 leading-relaxed flex gap-2">
                              <span className="text-xs mt-0.5">🌿</span>
                              <span>You will get a copy of these instructions to your email after placing an order.</span>
                            </div>
                          </div>

                          <button
                            onClick={handleBankTransferSubmit}
                            disabled={isPlacingOrder}
                            className="w-full py-4 bg-[#247114] hover:bg-[#1b550e] disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-2xl font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#247114]/25 active:scale-[0.98] cursor-pointer"
                          >
                            {isPlacingOrder ? 'PLACING ORDER...' : 'PLACE ORDER (BANK TRANSFER)'}
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      )}

                      {!paymentMethod && (
                        <div className="text-center text-gray-400 text-xs font-bold py-12 border border-dashed border-gray-200 rounded-2xl">
                          Please select a payment method above to proceed.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
