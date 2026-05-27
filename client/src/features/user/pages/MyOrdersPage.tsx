import React, { useEffect, useState } from "react";
import { 
  Package, 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  MapPin, 
  TreePine, 
  TrendingUp,
  Plus,
  ShoppingCart,
  ExternalLink
} from "lucide-react";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { Progress } from "../../../shared/components/ui/progress";
import { Input } from "../../../shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { motion } from "framer-motion";

import { useUser } from "../context/UserContext";
import { ImpactCard } from "../../../shared/components/ui/ImpactCard";

export function MyOrdersPage() {
  const { orders, loading, isRefreshing } = useUser();

  const totalInvested = orders.reduce((acc, curr) => acc + parseInt(curr.amount?.replace(/[^0-9]/g, '') || "0"), 0);
  const totalTrees = orders.reduce((acc, curr) => acc + curr.trees, 0);
  
  const activeOrdersList = orders.filter(o => o.progress < 100);
  const completedOrdersList = orders.filter(o => o.progress === 100);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">MY ORDERS</h1>
           <p className="text-sm text-gray-500 font-medium italic">Tracking all your tree plantation investments</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-emerald-200" onClick={() => window.open('https://forestgift.in/plant')}>
              <Plus className="w-4 h-4" /> Plant More Trees
           </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <ImpactCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="green" loading={isRefreshing && orders.length === 0} />
        <ImpactCard title="Total Trees" value={totalTrees} icon={TreePine} color="blue" loading={isRefreshing && totalTrees === 0} />
        <ImpactCard title="In Progress" value={activeOrdersList.length} icon={Package} color="orange" loading={isRefreshing && orders.length === 0} />
        <ImpactCard title="Invested" value={`₹${totalInvested.toLocaleString()}`} icon={TrendingUp} color="purple" loading={isRefreshing && totalInvested === 0} />
      </div>

      <div className="flex gap-4 items-center">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search orders by ID or location..." className="pl-10 h-11 bg-white border-2 border-gray-50 focus:border-emerald-500 rounded-xl" />
         </div>
         <Button variant="outline" className="h-11 px-6 font-bold text-[10px] uppercase tracking-widest gap-2 border-2 text-gray-500 border-gray-50">
            <Filter className="w-4 h-4" /> Filters
         </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
         <div className="w-full overflow-x-auto scrollbar-none pb-1">
            <TabsList className="bg-gray-100/50 p-1 rounded-xl w-full justify-start sm:justify-center">
               <TabsTrigger value="all" className="rounded-lg font-bold text-xs uppercase tracking-widest px-3 sm:px-6 md:px-8">All Orders</TabsTrigger>
               <TabsTrigger value="active" className="rounded-lg font-bold text-xs uppercase tracking-widest px-3 sm:px-6 md:px-8">Active</TabsTrigger>
               <TabsTrigger value="completed" className="rounded-lg font-bold text-xs uppercase tracking-widest px-3 sm:px-6 md:px-8">Completed</TabsTrigger>
            </TabsList>
         </div>

         <TabsContent value="all" className="space-y-6">
            {isRefreshing && orders.length === 0 ? (
               <div className="p-20 text-center font-bold text-emerald-600 animate-pulse uppercase tracking-[0.3em]">Synching with Forest...</div>
            ) : orders.length > 0 ? (
               orders.map((order, i) => (
                 <OrderCard key={i} order={order} index={i} />
               ))
            ) : (
               <EmptyState />
            )}
         </TabsContent>

         <TabsContent value="active" className="space-y-6">
            {activeOrdersList.length > 0 ? (
               activeOrdersList.map((order, i) => (
                 <OrderCard key={i} order={order} index={i} />
               ))
            ) : (
               <EmptyState message="All your orders are verified and thriving!" />
            )}
         </TabsContent>

         <TabsContent value="completed" className="space-y-6">
            {completedOrdersList.length > 0 ? (
               completedOrdersList.map((order, i) => (
                 <OrderCard key={i} order={order} index={i} />
               ))
            ) : (
               <EmptyState message="Once your plantations are verified, they will appear here." />
            )}
         </TabsContent>
      </Tabs>
    </div>
  );
}

const OrderCard = ({ order, index }: any) => {
  const statusColors: any = {
    Growing: "bg-emerald-50 text-emerald-600",
    Planted: "bg-blue-50 text-blue-600",
    Verified: "bg-emerald-100 text-emerald-700",
    "Audit Pending": "bg-amber-50 text-amber-600"
  };
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
       <Card className="p-8 border-none shadow-sm hover:shadow-xl transition-all duration-300 grid md:grid-cols-4 gap-8 group">
          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 tracking-tight">{order.orderId}</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{order.date}</p>
                </div>
                <Badge className={`${statusColors[order.status] || "bg-gray-100"} font-bold text-[9px] uppercase border-none px-3 py-1`}>{order.status}</Badge>
             </div>
             <div className="grid grid-cols-2 gap-4 pt-2">
                <MiniInfo label="Quantity" value={`${order.trees} Trees`} />
                <MiniInfo label="Investment" value={order.amount} />
                <div className="col-span-2">
                   <MiniInfo label="Species Plan" value={order.species} />
                </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 pt-2 border-t border-gray-50">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span className="truncate">{order.location}</span>
             </div>
          </div>

          <div className="space-y-6 flex flex-col justify-center">
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <span>Growth Health</span>
                   <span className="text-emerald-600">{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2 bg-gray-50 shadow-inner" />
                <p className="text-[10px] text-gray-300 font-medium italic">Latest sync: {order.date}</p>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-emerald-50/30 rounded-2xl border border-dashed border-emerald-100 group-hover:bg-emerald-50/50 transition-colors">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100 mb-2">
                <TreePine className="w-6 h-6 text-emerald-500 scale-90" />
             </div>
             <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Audit Status</p>
             <h4 className="text-xs font-bold text-gray-800 mt-1">{order.progress === 100 ? "100% Verified" : "Verification Pending"}</h4>
             <Button variant="link" className="text-emerald-600 font-bold text-[9px] uppercase tracking-widest mt-2 p-0 h-auto">View Proofs</Button>
          </div>
       </Card>
    </motion.div>
  );
};

const MiniInfo = ({ label, value }: any) => (
  <div>
     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-0.5">{label}</p>
     <p className="text-xs font-bold text-gray-700 leading-tight">{value}</p>
  </div>
);

const EmptyState = ({ message }: any) => (
  <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
       <Package className="w-10 h-10 text-gray-200" />
    </div>
    <div>
       <p className="text-lg font-bold text-gray-900">No Orders Found</p>
       <p className="text-sm text-gray-400 font-medium italic">{message || "Your tree plantation records will appear here."}</p>
       <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 font-bold text-[11px] uppercase tracking-[0.2em] px-8 shadow-lg shadow-emerald-100" onClick={() => window.open('https://forestgift.in/plant')}>Plant My First Tree</Button>
    </div>
  </div>
);
