import React, { useState } from 'react';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';
import { StatCard, Icon } from '../../shared/components/UI';

export const CakeDashboard = ({ user }: { user: any }) => {
  const [activeSection, setActiveSection] = useState("Financial Overview");


  const navItems = [
    { label: "Financial Overview", icon: "finance" },
    { label: "Allocation Logic", icon: "settings" },
    { label: "Audit Logs", icon: "reports" },
  ];

  return (
    <DashboardLayout 
      title="FORESTGIFT" 
      navItems={navItems} 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Bakery Console: {user.name}</h2>
              <p className="text-gray-500 font-medium">Managing gift allocations for {user.area}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Vendor ID</p>
              <p className="text-xl font-mono text-emerald-600 font-black tracking-tighter">{user.id}</p>
           </div>
        </div>

        <div className="bg-emerald-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">

           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                 <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">Total Funds Managed</p>
                 <h2 className="text-6xl font-black italic tracking-tighter">₹94,20,500</h2>
                 <p className="mt-4 text-emerald-200/60 font-medium italic">Verified by CAKE Algorithm • Last Sync 2m ago</p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/5 text-center px-10">
                    <p className="text-3xl font-black">8,420</p>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Trees Funded</p>
                 </div>
              </div>
           </div>
           <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-6 flex justify-between">
                 Allocation Progress
                 <span className="text-emerald-600">89%</span>
              </h3>
              <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden p-1 shadow-inner">
                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89%' }} />
              </div>
              <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Target: 10,000 Trees</p>
           </div>
           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3">
                 <Icon name="settings" size={24} />
              </div>
              <h4 className="font-black text-gray-900">Cake Configuration</h4>
              <p className="text-gray-400 font-medium text-xs mt-1">Adjust auto-allocation price points</p>
              <button className="mt-4 bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Manage Algorithm</button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
