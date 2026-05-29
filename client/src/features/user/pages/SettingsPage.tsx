import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Save, 
  Camera, 
  Globe, 
  Heart, 
  TreePine, 
  Award, 
  TrendingUp,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  CheckCircle
} from "lucide-react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Switch } from "../../../shared/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

import { useUser } from "../context/UserContext";

type SettingsTab = 'profile' | 'notifications';

export function SettingsPage({ handleLogout }: { handleLogout?: () => void }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  const [profile, setProfile] = useState({
    fullName: user?.name || "Member User",
    email: user?.email || "user@forestgift.in",
    phone: user?.phone || "+91 00000 00000",
    location: user?.location || "India",
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSection profile={profile} setProfile={setProfile} />;
      case 'notifications': return <NotificationsSection />;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 pb-20 max-w-7xl mx-auto w-full">
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none uppercase text-emerald-600">ACCOUNT SETTINGS</h1>
            <p className="text-sm text-gray-400 font-medium italic mt-2">Personalize your profile and notification preferences</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-1 space-y-2">
            <SettingsBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile Information" />
            <SettingsBtn active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Notifications" />
            <div className="pt-4 mt-6 border-t border-gray-100">
               <SettingsBtn icon={LogOut} label="Sign Out" variant="destructive" onClick={handleLogout} />
            </div>
         </div>

         <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
               <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  {renderContent()}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

const ProfileSection = ({ profile, setProfile }: any) => (
   <Card className="p-8 border-none shadow-sm space-y-8 bg-white/80">
      <h3 className="text-xl font-bold text-gray-900">Personal Identity</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-50">
         <div className="relative group">
            <div className="w-28 h-28 bg-emerald-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shrink-0">
               {profile.fullName[0]}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 text-emerald-600"><Camera className="w-4 h-4" /></button>
         </div>
         <div className="text-center md:text-left space-y-2">
            <h4 className="text-2xl font-bold text-gray-900 leading-tight">{profile.fullName}</h4>
            <p className="text-sm text-gray-400 font-medium">Official Plant Partner of ForestGift</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px] uppercase">VERIFIED PARTNER</Badge>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
         <InputField label="Name" icon={User} defaultValue={profile.fullName} />
         <InputField label="Email" icon={Mail} defaultValue={profile.email} />
         <InputField label="Contact" icon={Phone} defaultValue={profile.phone} />
      </div>

      <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-widest gap-2">
         <CheckCircle className="w-5 h-5" /> UPDATE PROFILE
      </Button>
   </Card>
);

const NotificationsSection = () => (
   <Card className="p-8 border-none shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Sync & Alerts</h3>
      <div className="space-y-6 divide-y divide-gray-50">
         <ToggleItem icon={TreePine} title="Impact Status" sub="Alerts when your trees sequester significant carbon" />
         <ToggleItem icon={Award} title="Ranking Alerts" sub="Notified when your global ranking increases" />
         <ToggleItem icon={Mail} title="Community Digest" sub="Social updates from your referral network" />
      </div>
   </Card>
);

const SettingsBtn = ({ icon: Icon, label, active, variant, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${
      active 
         ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" 
         : variant === "destructive" ? "text-red-500 hover:bg-red-50" : "text-gray-500 hover:bg-gray-50"
   }`}>
    <div className="flex items-center gap-3">
       <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-400 group-hover:text-emerald-500"}`} />
       <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${active ? "text-white" : ""}`}>{label}</span>
    </div>
    {active && <ChevronRight className="w-4 h-4 text-white/50" />}
  </button>
);

const InputField = ({ label, icon: Icon, defaultValue }: any) => (
   <div className="space-y-2 group">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative">
         <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
         <input type="text" defaultValue={defaultValue} className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-50 font-bold focus:border-emerald-500 bg-gray-50/30 outline-none text-gray-700" />
      </div>
   </div>
);

const ToggleItem = ({ icon: Icon, title, sub }: any) => (
   <div className="pt-6 flex items-center justify-between group">
      <div className="flex items-center gap-4">
         <Icon className="w-5 h-5 text-emerald-600" />
         <div>
            <h4 className="text-sm font-bold text-gray-900 leading-none">{title}</h4>
            <p className="text-xs text-gray-500 mt-1.5">{sub}</p>
         </div>
      </div>
      <Switch defaultChecked />
   </div>
);
