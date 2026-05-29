import React, { useState } from "react";
import { 
  Users, 
  Gift, 
  Copy, 
  Share2, 
  Mail, 
  MessageCircle, 
  Trophy, 
  TrendingUp, 
  ChevronRight,
  Award
} from "lucide-react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Input } from "../../../shared/components/ui/input";
import { Progress } from "../../../shared/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { motion } from "framer-motion";

import { useUser } from "../context/UserContext";
import { ImpactCard } from "../../../shared/components/ui/ImpactCard";
import { API_ENDPOINTS } from "../../../shared/config/api";

export function ReferralsPage() {
  const { user, isRefreshing } = useUser();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived user stats from real backend data
  const referralsCount = user?.referralCount || 0;
  const referralCode = user?.referralCode || `FOREST-${user?.name?.split(' ')[0].toUpperCase()}-${user?.id?.substring(0,4)}`;
  const impactPoints = user?.impactPoints || (referralsCount * 50);
  const rankInfluence = user?.rankInfluence || "+0%";

  React.useEffect(() => {
    const fetchReferrals = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(API_ENDPOINTS.USER_REFERRALS(user.id));
        const data = await res.json();
        setReferrals(data || []);
      } catch (err) {
        console.error("Referral fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [user?.id]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied to clipboard!");
  };

  const handleShare = (platform: 'email' | 'whatsapp') => {
    const shareText = `Help us maintain the balance of our planet by buying a plan to plant a tree. Visit: https://forestgift.in. My Referral Code: ${referralCode}. This helps our community grow further and track our collective impact! 🌳✨`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=Join me in planting the future&body=${encodeURIComponent(shareText)}`;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase text-emerald-600">SOCIAL IMPACT</h1>
           <p className="text-sm text-gray-400 font-medium italic">Your referral network contributes directly to your Global Ranking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactCard title="Total Invites" value={referralsCount} icon={Users} color="green" loading={isRefreshing && referralsCount === 0} />
        <ImpactCard title="Active Networks" value={referralsCount} icon={TrendingUp} color="blue" loading={loading} />
        <ImpactCard title="Impact Points" value={impactPoints} icon={Award} color="purple" loading={loading} />
        <ImpactCard title="Rank Influence" value={rankInfluence} icon={Trophy} color="orange" loading={loading} />
      </div>

      <Card className="p-10 bg-emerald-950 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full -mr-40 -mt-40 blur-3xl" />
         <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight leading-loose uppercase">GROW THE FOREST<br /><span className="text-emerald-500 underline decoration-wavy">TOGETHER</span></h2>
            <p className="text-gray-300 text-sm font-medium leading-relaxed italic opacity-80 uppercase tracking-widest text-[10px]">Invite friends to plant trees. Every plantation in your network increases your Global Impact Score and increases your Ranking.</p>
            
            <div className="max-w-md mx-auto pt-6 space-y-4">
               <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="h-14 text-center text-lg font-bold bg-white/5 border-white/20 text-white placeholder-white/40" />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <Button onClick={handleCopyCode} className="h-14 px-8 bg-emerald-600 text-white font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40">
                       COPY
                     </Button>
                  </motion.div>
               </div>
                <div className="flex flex-wrap justify-center gap-4">
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <InviteBtn onClick={() => handleShare('email')} icon={Mail} label="Email Invites" />
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <InviteBtn onClick={() => handleShare('whatsapp')} icon={MessageCircle} label="WhatsApp" />
                   </motion.div>
                </div>
            </div>
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="p-8 border-none shadow-sm space-y-8 bg-white min-h-[500px]">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-gray-900 uppercase">Referral Network</h3>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold italic tracking-tighter">Live Sync</Badge>
                  </div>
                   <div className="space-y-4">
                     {loading ? (
                       <div className="p-10 text-center font-bold text-gray-400 animate-pulse uppercase tracking-[0.2em] text-[10px]">Synchronizing Social Data...</div>
                     ) : referrals.length === 0 ? (
                       <div className="p-10 text-center space-y-4">
                          <p className="font-bold text-gray-400 text-xs uppercase tracking-widest leading-loose">No active network members found.</p>
                          <p className="text-[10px] text-gray-300 font-medium italic">Your community starts with your first invite!</p>
                       </div>
                     ) : (
                       referrals.map((ref, i) => <ReferralMember key={i} member={ref} index={i} />)
                     )}
                   </div>
                   <Button variant="ghost" className="w-full text-[10px] font-bold uppercase text-gray-400 tracking-widest mt-auto pt-8">View Complete Network History</Button>
               </Card>

               {/* RECURRING STREAK COMPONENT */}
               <Card className="p-8 border-none shadow-sm space-y-8 bg-white relative overflow-hidden min-h-[500px] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <h2 className="text-3xl font-bold text-amber-500 tracking-tighter leading-none">{referralsCount * 7 + 3}-day streak</h2>
                        <p className="text-[11px] font-bold text-gray-400 mt-3 uppercase tracking-widest italic opacity-60">You're making a difference!</p>
                     </div>
                     <div className="relative">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl drop-shadow-lg">🔥</motion.div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center py-6 border-y border-gray-50 bg-gray-50/30 -mx-4 px-4 rounded-xl">
                     {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${idx < 3 ? "bg-amber-400 text-white shadow-xl shadow-amber-100 scale-110" : "bg-white border-2 border-gray-100 text-gray-200"}`}>
                              {idx < 3 ? "✓" : ""}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mt-4">
                     <span className="text-xl">❄️</span>
                     <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">1 streak freeze ready to use</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-8 mt-auto">
                     <StreakBadge days="3 days" label="Star" achieved />
                     <StreakBadge days="5 days" label="Super" achieved />
                     <StreakBadge days="7 days" label="Elite" />
                     <StreakBadge days="31 days" label="Icon" />
                  </div>
               </Card>
            </div>
         </div>

         <div className="space-y-8 order-1 lg:order-3">
             <Card className="p-10 border-none shadow-sm space-y-8 bg-emerald-50/30">
                <h4 className="text-sm font-bold text-emerald-900 tracking-[0.2em] uppercase">Impact Milestone</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Rank Booster</p>
                         <h4 className="font-bold text-gray-900">10 Active Referrals</h4>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{referralsCount}/10</p>
                   </div>
                   <Progress value={(referralsCount / 10) * 100} className="h-2 bg-white shadow-inner" />
                   <p className="text-[10px] text-gray-400 font-medium italic mt-2 uppercase tracking-widest">
                      {referralsCount >= 10 ? "Milestone Achieved! Boost Level 1 Active" : `${10 - referralsCount} more to Boost Ranking by 5%`}
                   </p>
                </div>
             </Card>

             <div className="p-10 space-y-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">How Ranking Works</h4>
                <HowMetric num="01" label="Invitations" weight="+50 pts" />
                <HowMetric num="02" label="Actual Plants" weight="+150 pts" />
                <HowMetric num="03" label="Carbon Offset" weight="+10 pts/kg" />
                
                <div className="pt-12">
                   <Button 
                      onClick={() => {
                        localStorage.removeItem('user_token');
                        localStorage.removeItem('user_data');
                        window.location.href = '/';
                      }}
                      className="w-full bg-[#1e293b] text-white font-bold text-[12px] uppercase tracking-[0.1em] py-8 rounded-3xl hover:bg-black transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
                   >
                     Logout & Reset Account
                   </Button>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}

const RefStatCard = ({ title, value, icon: Icon, color }: any) => {
  const colors: any = {
    green: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50"
  };
  return (
    <Card className="p-6 border-none shadow-sm space-y-6 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
       <div className={`p-3 w-fit rounded-2xl ${colors[color]} group-hover:rotate-12 transition-transform shadow-sm`}>
          <Icon className="w-5 h-5" />
       </div>
       <div>
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900 tracking-tighter italic">{value}</h4>
       </div>
    </Card>
  );
};

const InviteBtn = ({ icon: Icon, label, onClick }: any) => (
  <Button onClick={onClick} variant="outline" className="h-12 px-6 bg-white/5 hover:bg-white/10 border-white/10 text-white font-bold text-[10px] uppercase tracking-widest gap-2">
    <Icon className="w-4 h-4" /> {label}
  </Button>
);

const StreakBadge = ({ days, label, achieved }: any) => (
  <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${achieved ? "bg-amber-100 text-amber-600 shadow-sm" : "bg-gray-50 text-gray-300"}`}>
        {days.includes('31') ? "🏆" : days.includes('7') ? "🥇" : "⭐️"}
     </div>
     <p className={`text-[8px] font-bold uppercase tracking-tighter ${achieved ? "text-amber-600" : "text-gray-400"}`}>{days}</p>
     <p className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">{label}</p>
  </div>
);

const ReferralMember = ({ member, index }: any) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-xs shadow-inner">
           {member.name[0]}
        </div>
        <div>
           <h4 className="font-bold text-gray-900 text-sm leading-none mb-1">{member.name}</h4>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.treesPlanted} Trees • Joining Date: {member.joinedDate}</p>
        </div>
     </div>
     <div className="text-right">
        <p className="font-bold text-emerald-600 text-sm italic">{member.impact}</p>
        <Badge className="bg-white text-emerald-600 font-bold text-[8px] uppercase border shadow-sm px-2 tracking-tighter mt-1">RANKING IMPACT</Badge>
     </div>
  </motion.div>
);

const HowMetric = ({ num, label, weight }: any) => (
  <div className="flex items-center justify-between border-b border-gray-50 pb-3">
     <div className="flex gap-4 items-center">
        <span className="text-emerald-100 font-bold text-lg leading-none">#{num}</span>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
     </div>
     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 rounded tracking-widest">{weight}</span>
  </div>
);
