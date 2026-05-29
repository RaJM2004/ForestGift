import React, { useState, useMemo } from "react";
import { 
  TreePine, 
  MapPin, 
  Heart, 
  Share2, 
  Camera, 
  TrendingUp, 
  Filter, 
  Grid3x3, 
  List,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Activity
} from "lucide-react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Progress } from "../../../shared/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Input } from "../../../shared/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

import { useUser } from "../context/UserContext";
import { ImpactCard } from "../../../shared/components/ui/ImpactCard";

type HealthStatus = "all" | "thriving" | "monitoring";

export function MyTreesPage() {
  const { treeEntries: userTrees, isRefreshing, toggleFavorite } = useUser();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  // New Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [healthStatus, setHealthStatus] = useState<HealthStatus>("all");

  // Multi-Pass Filtering Logic
  const filteredTrees = useMemo(() => {
    return userTrees.filter(tree => {
      const matchesSearch = 
        (tree.species || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tree._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tree.treeId || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const health = tree.health || 0;
      const matchesHealth = 
        healthStatus === "all" ||
        (healthStatus === "thriving" && health >= 90) ||
        (healthStatus === "monitoring" && health < 80);

      return matchesSearch && matchesHealth;
    });
  }, [userTrees, searchTerm, healthStatus]);

  // Tabbed subsets
  const favorites = filteredTrees.filter(t => t.favorite);
  const recentUpdates = [...filteredTrees].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const openLightbox = (images: string[]) => {
    setLightboxImages(images);
    setCurrentImgIndex(0);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">MY TREES</h1>
           <p className="text-sm text-gray-500 font-medium italic">Managing your {userTrees.length} personal environmental assets</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex border-2 border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
             <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="icon" 
                onClick={() => setViewMode("grid")} 
                className={`h-9 w-9 rounded-none transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-emerald-600'}`}
             >
                <Grid3x3 className="w-4 h-4" />
             </Button>
             <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="icon" 
                onClick={() => setViewMode("list")} 
                className={`h-9 w-9 rounded-none transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-emerald-600'}`}
             >
                <List className="w-4 h-4" />
             </Button>
           </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <ImpactCard title="Active" icon={TreePine} value={userTrees.length} color="green" loading={isRefreshing && userTrees.length === 0} />
        <ImpactCard title="Thriving" icon={TrendingUp} value={userTrees.filter(t => (t.health || 0) >= 90).length} color="blue" loading={isRefreshing && userTrees.length === 0} />
        <ImpactCard title="Favorites" icon={Heart} value={userTrees.filter(t => t.favorite).length} color="red" loading={isRefreshing && userTrees.length === 0} />
        <ImpactCard title="Photos" icon={Camera} value={userTrees.reduce((acc, t) => acc + (t.images?.length || t.proofs?.length || 0), 0)} color="purple" loading={isRefreshing && userTrees.length === 0} />
      </div>

      {/* Search & Global Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by species or Tree ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white border-2 border-gray-50 focus:border-emerald-500 rounded-xl" 
            />
         </div>
         <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100">
            {(["all", "thriving", "monitoring"] as HealthStatus[]).map((status) => (
               <Button
                 key={status}
                 variant="ghost"
                 size="sm"
                 onClick={() => setHealthStatus(status)}
                 className={`rounded-lg px-4 h-8 font-bold text-[9px] uppercase tracking-widest transition-all ${healthStatus === status ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 opacity-60'}`}
               >
                 {status}
               </Button>
            ))}
         </div>
      </div>

      {/* Tabbed Navigation */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="w-full overflow-x-auto scrollbar-none pb-1">
          <TabsList className="bg-gray-100/50 p-1 rounded-xl w-full justify-start sm:justify-center">
            <TabsTrigger value="all" className="rounded-lg font-bold text-xs uppercase tracking-widest px-3 sm:px-6">All Forest ({filteredTrees.length})</TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-lg font-bold text-xs uppercase tracking-widest px-3 sm:px-6">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="recent" className="rounded-lg font-bold text-xs uppercase tracking-widest px-3 sm:px-6">Recent</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
           {filteredTrees.map((tree, i) => <TreeCard key={tree._id} tree={tree} index={i} viewMode={viewMode} onToggle={() => toggleFavorite(tree._id, tree.proofs ? 'submission' : 'bulk')} onViewPhotos={openLightbox} />)}
           {filteredTrees.length === 0 && <EmptyState message={searchTerm ? `No results for "${searchTerm}"` : "None of your trees match this filter."} onReset={() => {setSearchTerm(""); setHealthStatus("all"); }} />}
        </TabsContent>

        <TabsContent value="favorites" className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
           {favorites.map((tree, i) => <TreeCard key={tree._id} tree={tree} index={i} viewMode={viewMode} onToggle={() => toggleFavorite(tree._id, tree.proofs ? 'submission' : 'bulk')} onViewPhotos={openLightbox} />)}
           {favorites.length === 0 && <EmptyState message="No favorites found matching your criteria." />}
        </TabsContent>

        <TabsContent value="recent" className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
           {recentUpdates.map((tree, i) => <TreeCard key={tree._id} tree={tree} index={i} viewMode={viewMode} onToggle={() => toggleFavorite(tree._id, tree.proofs ? 'submission' : 'bulk')} onViewPhotos={openLightbox} />)}
           {recentUpdates.length === 0 && <EmptyState message="No recent activity matches these filters." />}
        </TabsContent>
      </Tabs>

      {/* Lightbox Slideshow Modal (Kept intact) */}
      <AnimatePresence>
         {lightboxImages && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
           >
              <button onClick={() => setLightboxImages(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110]"><X /></button>
              <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center text-white">
                 <button onClick={() => setCurrentImgIndex(prev => (prev > 0 ? prev - 1 : lightboxImages.length - 1))} className="absolute left-0 p-4 opacity-50 hover:opacity-100"><ChevronLeft className="w-12 h-12" /></button>
                 <button onClick={() => setCurrentImgIndex(prev => (prev < lightboxImages.length - 1 ? prev + 1 : 0))} className="absolute right-0 p-4 opacity-50 hover:opacity-100"><ChevronRight className="w-12 h-12" /></button>
                 <motion.img key={currentImgIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={lightboxImages[currentImgIndex].startsWith('data:') ? lightboxImages[currentImgIndex] : `http://localhost:5000/uploads/${lightboxImages[currentImgIndex]}`} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

const TreeCard = ({ tree, index, viewMode, onToggle, onViewPhotos }: any) => {
  const images = tree.images || tree.proofs || [];
  const health = tree.health || 95;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
      <Card className="overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm group">
         <div className="relative h-48 bg-gray-100 overflow-hidden">
            {images?.[0] ? (
              <img 
                src={images[0].startsWith('data:') ? images[0] : `http://localhost:5000/uploads/${images[0]}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                onClick={() => onViewPhotos(images)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                 <TreePine className="w-16 h-16 text-emerald-200" />
              </div>
            )}
            <div className="absolute top-3 inset-x-3 flex justify-between items-start">
               <Badge className="bg-white/90 backdrop-blur text-emerald-700 font-bold text-[9px] border-none uppercase">
                 {health >= 90 ? "Thriving" : "Monitoring"}
               </Badge>
               <button onClick={onToggle} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-gray-300 hover:text-red-500 transition-all active:scale-90">
                  <Heart className={`w-4 h-4 ${tree.favorite ? "fill-red-500 text-red-500" : ""}`} />
               </button>
            </div>
         </div>
         <div className="p-5 space-y-4">
            <div className="space-y-1">
               <h3 className="font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase text-sm tracking-tight">{tree.species || "Native Tree"}</h3>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{tree.treeId || tree._id?.substring(0,8) || "Plantation Unit"}</p>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Growth Health</span>
                  <span className="text-emerald-600">{health}%</span>
               </div>
               <Progress value={health} className="h-1.5" />
            </div>

            <div className="grid grid-cols-2 gap-y-3 pt-2 border-t border-gray-50 text-[10px]">
               <InfoItem label="Count" value={`${tree.count || 1} Unit(s)`} />
               <InfoItem label="CO2 Offset" value={`${((tree.count || 1) * 22.2).toFixed(1)}kg/yr`} />
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
               <MapPin className="w-3 h-3 text-emerald-500" />
               <span className="truncate">{tree.location || "Verified GPS Location"}</span>
            </div>

            <div className="pt-2">
               <Button className="w-full h-9 text-[10px] font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100" onClick={() => onViewPhotos(images)}>
                  View Photo Proof
               </Button>
            </div>
         </div>
      </Card>
    </motion.div>
  );
};

const InfoItem = ({ label, value }: any) => (
  <div>
    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">{label}</p>
    <p className="text-xs font-bold text-gray-700">{value}</p>
  </div>
);

const EmptyState = ({ message, onReset }: any) => (
  <div className="col-span-full py-20 text-center space-y-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
        <Activity className="w-10 h-10 text-gray-200" />
     </div>
     <div className="space-y-1">
        <p className="text-sm text-gray-400 font-medium italic">{message || "No trees match these filters."}</p>
        {onReset && <button onClick={onReset} className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline">Clear all filters</button>}
     </div>
  </div>
);
