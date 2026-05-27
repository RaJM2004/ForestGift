import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './card';

interface ImpactCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'cyan' | 'emerald';
  loading?: boolean;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ title, value, sub, icon: Icon, color, loading }) => {
  const colorMap = {
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  };

  if (loading) {
    return (
      <Card className="p-3 sm:p-4 md:p-6 border shadow-sm animate-pulse flex flex-col items-center space-y-3 bg-gray-50/50">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
        <div className="space-y-2 w-full flex flex-col items-center">
          <div className="h-2 w-16 bg-gray-200 rounded" />
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-20 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-3 sm:p-4 md:p-6 border shadow-sm flex flex-col items-center text-center space-y-2 md:space-y-3 group hover:scale-[1.02] transition-all duration-300 ${colorMap[color]}`}>
      <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl group-hover:rotate-12 transition-transform shadow-inner`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div>
        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className={`text-xl md:text-2xl font-black text-gray-900 tracking-tighter ${title === "Global Rank" ? "italic" : ""}`}>
          {(title === "Global Rank" && (value === "#0" || value === 0)) ? "UNRANKED" : value}
        </h4>
        {sub && <p className="text-[9px] md:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">{sub}</p>}
      </div>
    </Card>
  );
};
