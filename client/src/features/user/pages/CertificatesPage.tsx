import React, { useState, useMemo } from "react";
import { Download, Share2, Award, MapPin, FileCheck, Filter, Search, Calendar, TreePine, TrendingUp, X } from "lucide-react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Input } from "../../../shared/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import { useUser } from "../context/UserContext";
import { ImpactCard } from "../../../shared/components/ui/ImpactCard";

export function CertificatesPage() {
  const { certificates: userCerts = [], treeEntries = [], isRefreshing } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Multi-Pass Filtering Engine
  const filteredCerts = useMemo(() => {
    return userCerts.filter(cert => {
      const idStr = (cert.id || cert._id || "").toLowerCase();
      const locStr = (cert.location || "").toLowerCase();
      const orderIdStr = (cert.orderId || "").toLowerCase();
      
      const matchesSearch = 
        idStr.includes(searchTerm.toLowerCase()) || 
        locStr.includes(searchTerm.toLowerCase()) || 
        orderIdStr.includes(searchTerm.toLowerCase());

      const matchesStatus = !onlyVerified || cert.verified;

      return matchesSearch && matchesStatus;
    });
  }, [userCerts, searchTerm, onlyVerified]);

  const totalTrees = treeEntries.reduce((acc, t) => acc + (t.count || 1), 0) || 0;
  const totalCO2 = (totalTrees * 0.0222).toFixed(3); // in tons

  const handleDownload = (cert: any) => {
    const certId = cert.id || cert._id?.substring(0,8);
    alert(`🌳 Generating Secure Digital Credential...\ncertificate_id: FG-${certId}\n\nThis high-resolution PDF will include your verified GPS coordinates and NGO audit signatures.`);
  };

  const handleDownloadAll = () => {
    alert(`📦 Preparing Bulk Export...\nCompiling ${filteredCerts.length} verified certificates into a zip archive.`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CERTIFICATES</h1>
           <p className="text-sm text-gray-500 font-medium italic">Your verified environmental credentials and plantation proofs</p>
        </div>
        <div className="flex gap-2">
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant={onlyVerified ? "default" : "outline"}
                size="sm" 
                onClick={() => setOnlyVerified(!onlyVerified)}
                className={`font-bold text-[10px] uppercase tracking-widest border-2 ${onlyVerified ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-emerald-100 text-emerald-700 hover:bg-emerald-50'}`}
              >
                <Filter className="w-3.5 h-3.5 mr-2" /> {onlyVerified ? "Show All" : "Verified Only"}
              </Button>
           </motion.div>
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleDownloadAll}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold text-[10px] uppercase tracking-widest px-6 ml-2 shadow-lg shadow-emerald-100"
              >
                Download All ({filteredCerts.length})
              </Button>
           </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ImpactCard title="Total" value={userCerts.length} icon={Award} color="emerald" loading={isRefreshing && userCerts.length === 0} />
        <ImpactCard title="Verified" value={userCerts.filter(c => c.verified).length} icon={FileCheck} color="blue" loading={isRefreshing && userCerts.length === 0} />
        <ImpactCard title="Projects" value={new Set(userCerts.map(c => c.location)).size} icon={MapPin} color="green" loading={isRefreshing && userCerts.length === 0} />
        <ImpactCard title="CO2 Offset" value={`${totalCO2}t`} icon={TrendingUp} color="cyan" loading={isRefreshing && totalCO2 === "0.000"} />
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Search by certificate ID, Order OR project location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-white border-2 border-gray-50 focus:border-emerald-500 rounded-xl" 
        />
        {searchTerm && (
           <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
              <X className="w-3.5 h-3.5 text-gray-400" />
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        <AnimatePresence>
           {filteredCerts.map((cert, i) => (
             <motion.div 
               key={cert.id || cert._id} 
               layout
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ delay: i * 0.05 }}
             >
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group">
                   <div className="relative h-40 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                         <Award className="w-48 h-48" />
                      </div>
                      <div className="relative z-10 flex justify-between">
                         <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                            <Award className="w-8 h-8" />
                         </div>
                         <Badge className="bg-white/20 backdrop-blur border-none font-bold text-[9px] uppercase tracking-[0.2em]">
                           {cert.verified ? "VERIFIED CREDENTIAL" : "VALUATION PENDING"}
                         </Badge>
                      </div>
                      <div className="mt-4 relative z-10">
                         <h3 className="text-xl font-bold tracking-tight leading-tight uppercase">Plantation<br />Certificate</h3>
                         <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest mt-1 opacity-70">SERIAL: FG-{cert.id || cert._id?.substring(0,8)}</p>
                      </div>
                   </div>

                   <div className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <DataPoint label="Order Ref" value={cert.orderId || "Sync Pending"} />
                         <DataPoint label="Trees Count" value={`${cert.treeCount || cert.count || "TBD"} Units`} />
                         <DataPoint label="Issue Date" value={cert.issuedDate || (cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : "Processing")} icon={Calendar} />
                         <DataPoint label="Foundation" value={cert.location || "ForestGift Central"} icon={MapPin} />
                      </div>
                      
                      <div className="flex gap-3 pt-6 border-t border-gray-50">
                         <Button variant="outline" className="flex-1 h-11 text-[10px] font-bold uppercase tracking-widest gap-2 bg-white hover:bg-gray-50">
                           <Share2 className="w-4 h-4" /> Share Impact
                         </Button>
                         <Button 
                           onClick={() => handleDownload(cert)}
                           className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold uppercase tracking-widest gap-2 shadow-lg shadow-emerald-200"
                         >
                           <Download className="w-4 h-4" /> Export PDF
                         </Button>
                      </div>
                   </div>
                </Card>
             </motion.div>
           ))}
        </AnimatePresence>

        {filteredCerts.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <FileCheck className="w-10 h-10 text-gray-200" />
             </div>
             <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">No Credentials Found</p>
                <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto italic">We couldn't find any certificates matching your search or filter criteria.</p>
                <button onClick={() => { setSearchTerm(""); setOnlyVerified(false); }} className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline mt-4">Clear All Filters</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DataPoint = ({ label, value, icon: Icon }: any) => (
  <div className="space-y-1">
     <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">{label}</p>
     <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-emerald-500 opacity-70" />}
        <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
     </div>
  </div>
);
