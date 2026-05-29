import React, { useState, useEffect } from "react";
import { 
  TreePine, 
  TrendingUp, 
  Award, 
  Users, 
  MapPin, 
  ChevronRight, 
  FileText,
  Scan,
  Activity,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Plus
} from "lucide-react";
import { Card } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import { Progress } from "../../shared/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { MyTreesPage } from "./pages/MyTreesPage";
import { ImpactReportPage } from "./pages/ImpactReportPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { ReferralsPage } from "./pages/ReferralsPage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { SettingsPage } from "./pages/SettingsPage";

// Components
import { MobileNav } from "./components/MobileNav";
import { MobileHeader } from "./components/MobileHeader";
import { useUser } from "./context/UserContext";
import { ImpactCard } from "../../shared/components/ui/ImpactCard";
import { customMarkerIcon } from "../../shared/utils/leaflet-icons";

type Section = 'Dashboard' | 'My Trees' | 'Impact' | 'Certificates' | 'Referrals' | 'Orders' | 'Settings';

export const UserDashboard = ({ handleLogout }: { handleLogout: () => void }) => {
  const [activeSection, setActiveSection] = useState<Section>('Dashboard');
  const { user, error, refreshData } = useUser();

  if (!user) return <div className="h-screen w-full flex items-center justify-center font-bold animate-pulse text-emerald-600 tracking-[0.3em] uppercase">SYNCING WITH FOREST...</div>;

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard': return <DashboardPage />;
      case 'My Trees': return <MyTreesPage />;
      case 'Impact': return <ImpactReportPage />;
      case 'Certificates': return <CertificatesPage />;
      case 'Referrals': return <ReferralsPage />;
      case 'Orders': return <MyOrdersPage />;
      case 'Settings': return <SettingsPage handleLogout={handleLogout} />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <MobileHeader 
          userName={user.name} 
          notificationCount={3} 
          currentSection={activeSection} 
          onProfileClick={() => setActiveSection('Settings')}
        />
        
        {error && (
          <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-center gap-3">
             <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{error}</span>
             <Button variant="outline" size="sm" onClick={refreshData} className="h-7 text-[9px] font-bold uppercase text-red-600 border-red-200 hover:bg-red-100">Retry Sync</Button>
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white md:bg-gray-50/30">
            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }} 
                transition={{ duration: 0.3 }} 
                key={activeSection}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
        </main>

        <MobileNav onSectionChange={(section: any) => setActiveSection(section as Section)} activeSection={activeSection} />
      </div>
    </div>
  );
};

const Sidebar = ({ activeSection, setActiveSection, handleLogout }: any) => (
  <aside className="hidden md:flex w-72 flex-col bg-white border-r border-gray-100 z-50">
    <div className="p-8 pb-4">
       <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
             <TreePine className="text-white w-6 h-6" />
          </div>
          <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0r4EWz6LuN9z6g/title-IA5qPxoWCRTW532I.jpg" alt="ForestGift" className="h-8 w-auto object-contain" />
       </div>
       
       <nav className="space-y-1">
          <SidebarItem icon={Scan} label="Dashboard" active={activeSection === 'Dashboard'} onClick={() => setActiveSection('Dashboard')} />
          <SidebarItem icon={TreePine} label="My Trees" active={activeSection === 'My Trees'} onClick={() => setActiveSection('My Trees')} />
          <SidebarItem icon={TrendingUp} label="Impact Report" active={activeSection === 'Impact'} onClick={() => setActiveSection('Impact')} />
          <SidebarItem icon={Award} label="Referrals" active={activeSection === 'Referrals'} onClick={() => setActiveSection('Referrals')} />
          <SidebarItem icon={FileText} label="Certificates" active={activeSection === 'Certificates'} onClick={() => setActiveSection('Certificates')} />
          <SidebarItem icon={Activity} label="My Orders" active={activeSection === 'Orders'} onClick={() => setActiveSection('Orders')} />
       </nav>
    </div>

    <div className="mt-auto p-8 border-t border-gray-50">
       <SidebarItem icon={UserIcon} label="Settings" active={activeSection === 'Settings'} onClick={() => setActiveSection('Settings')} />
       <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 font-bold mt-2" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3" /> Logout
       </Button>
    </div>
  </aside>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center p-3 rounded-xl transition-all ${active ? "bg-emerald-50 text-emerald-800 shadow-sm" : "text-gray-400 hover:bg-gray-50 hover:text-emerald-600"}`}>
    <Icon className={`w-5 h-5 mr-3 ${active ? "text-emerald-600 scale-110" : ""}`} />
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "translate-x-1" : ""} transition-transform`}>{label}</span>
  </button>
);
