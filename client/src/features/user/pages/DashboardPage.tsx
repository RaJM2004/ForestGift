import React, { useState } from "react";
import { 
  TreePine, 
  TrendingUp, 
  Award, 
  Users, 
  Download, 
  Plus, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Monitor,
  Heart,
  Droplets,
  FileCheck,
  X
} from "lucide-react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Progress } from "../../../shared/components/ui/progress";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { customMarkerIcon } from "../../../shared/utils/leaflet-icons";
import { useUser } from "../context/UserContext";
import { ImpactCard } from "../../../shared/components/ui/ImpactCard";
import { CertificateModal } from "../../admin/CertificateModal";

export function DashboardPage() {
  const { user, stats, orders, treeEntries, certificates, isRefreshing } = useUser();
  const [selectedCert, setSelectedCert] = useState<any>(null);

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none uppercase">Welcome back, {user.name.split(' ')[0]} 🌳</h1>
           <p className="text-sm text-gray-400 font-medium italic mt-2">Track and manage your verified environmental impact.</p>
        </div>
        <div className="flex gap-3">
           <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-[10px] uppercase tracking-widest px-6 shadow-lg shadow-emerald-100" onClick={() => window.open('https://forestgift.in/plant')}>
              Plant More Trees
           </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ImpactCard title="My Trees" value={stats?.totalTrees || treeEntries.length} sub={`Active: ${stats?.active || 0}`} icon={TreePine} color="green" loading={isRefreshing} />
        <ImpactCard title="Carbon Offset" value={`${stats?.carbonOffset || 0}kg`} sub="Verified this year" icon={TrendingUp} color="blue" loading={isRefreshing} />
        <ImpactCard title="Leaderboard" value={user.rank || "#42"} sub={`Top ${user.topPercent || "5%"} globally`} icon={Award} color="purple" loading={isRefreshing} />
        <ImpactCard title="Referrals" value={user.referrals || 0} sub={`₹${user.earnings || 2700} earned`} icon={Users} color="orange" loading={isRefreshing} />
      </div>

      {/* Recent Orders Progress */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 uppercase">Recent Plantation Progress</h3>
            <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase text-emerald-600 tracking-widest">View All <ChevronRight className="w-3 h-3 ml-1" /></Button>
         </div>
         <div className="grid grid-cols-1 gap-4">
            {orders.slice(0, 3).map((order) => {
               const cert = certificates.find(c => c.orderId === order.orderId) || (certificates.length > 0 ? certificates[0] : null);
               const displayProgress = cert ? 100 : order.progress;
               const displayStatus = cert ? 'Certified' : order.status;

               return (
                 <Card key={order.orderId} className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="space-y-1 min-w-[200px]">
                          <h4 className="font-bold text-gray-900 tracking-tight">{order.orderId}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.trees} Trees • {order.date}</p>
                       </div>
                       
                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-500">
                             <span>Progress</span>
                             <span className="text-emerald-600">{displayProgress}%</span>
                          </div>
                          <Progress value={displayProgress} className="h-2" />
                       </div>

                       <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const certCode = cert ? (cert as any).verificationCode || cert.id || cert._id : null;
                              if (certCode) {
                                window.open(`/verify/${certCode}`, '_blank');
                              } else {
                                window.alert('Verification not available.');
                              }
                            }}
                            disabled={!cert}
                            className={`h-9 px-6 text-[9px] font-bold uppercase tracking-widest border-2 ${cert ? 'hover:bg-gray-50 text-gray-700 border-gray-200' : 'text-gray-300 border-gray-100 cursor-not-allowed'}`}>
                            Verify
                          </Button>
                          <Button 
                             onClick={() => setSelectedCert(cert)}
                             disabled={!cert}
                             className={`h-9 px-6 text-[9px] font-bold uppercase tracking-widest shadow-sm ${cert ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                          >
                             Certificate
                          </Button>
                          <Badge className={`h-9 px-4 rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center justify-center ${displayStatus === 'Certified' || displayStatus === 'Planted' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                             {displayStatus}
                          </Badge>
                       </div>
                    </div>
                 </Card>
               );
            })}
         </div>
      </div>

      {/* Interactive Map Section */}
      <div className="space-y-4">
         <h3 className="text-xl font-bold text-gray-900 uppercase">Interactive Tree Map</h3>
         <Card className="h-[450px] relative rounded-3xl overflow-hidden border-2 border-emerald-50 shadow-sm z-0">
            <MapContainer 
               center={treeEntries.length > 0 ? [treeEntries[0].lat, treeEntries[0].lng] : [23.2599, 77.4126]}
               zoom={treeEntries.length > 0 ? 12 : 5} 
               style={{ height: '100%', width: '100%' }}
            >
               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
               {treeEntries.filter((te: any) => te.lat && te.lng).map((te: any, idx: number) => (
               <Marker key={idx} position={[te.lat, te.lng]} icon={customMarkerIcon}>
                  <Popup>
                     <div className="p-2 space-y-2 max-w-[200px]">
                        <p className="font-bold text-emerald-700 uppercase">{te.species || "Plantation Unit"}</p>
                        {(te.images?.[0] || te.proofs?.[0]) && (
                           <img 
                           src={te.images?.[0]?.startsWith('data:') || te.proofs?.[0]?.startsWith('data:') ? (te.images?.[0] || te.proofs?.[0]) : `http://localhost:5000/uploads/${te.images?.[0] || te.proofs?.[0]}`} 
                           alt="Tree Proof" 
                           className="w-full h-24 object-cover rounded-lg"
                           />
                        )}
                        <p className="text-[10px] text-gray-500 italic">Verified at {te.location || "assigned GPS coordinates"}</p>
                     </div>
                  </Popup>
               </Marker>
               ))}
            </MapContainer>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
               <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl border border-gray-100 pointer-events-auto">
                  <Button className="h-11 px-8 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase tracking-widest">
                     Explore Full Map
                  </Button>
               </div>
            </div>
         </Card>
      </div>

      {/* Environmental Impact Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <ImpactSubCard icon={Droplets} title="CO2 Absorbed" value={`${stats?.carbonOffset || 0}kg`} sub="Verified atmospheric removal" iconColor="text-blue-500" bgColor="bg-blue-50" />
         <ImpactSubCard icon={Monitor} title="Oxygen Produced" value={`${stats?.oxygenProduced || 0}kg`} sub="Annual production rate" iconColor="text-emerald-500" bgColor="bg-emerald-50" />
         <ImpactSubCard 
            icon={Heart} 
            title="Biodiversity" 
            value={`+${Math.min(25, (new Set(treeEntries.map(t => t.species)).size * 5) + (treeEntries.length > 5 ? 2 : 0))}%`} 
            sub="Local ecosystem variety" 
            iconColor="text-purple-500" 
            bgColor="bg-purple-50" 
         />
      </div>
      
      {selectedCert && (
        <CertificateModal 
            user={{...user, certificate: selectedCert }} 
            submission={{ species: "Trees", ngoName: selectedCert.ngoName || user.ngo }}
            onClose={() => setSelectedCert(null)} 
        />
      )}
    </div>
  );
}

const ImpactSubCard = ({ icon: Icon, title, value, sub, iconColor, bgColor }: any) => (
   <Card className="p-8 border-none shadow-sm hover:shadow-md transition-shadow space-y-4">
      <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
         <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="space-y-1">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
         <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
         <p className="text-xs text-gray-500 font-medium italic">{sub}</p>
      </div>
   </Card>
);
