import React from 'react';
import { Home, Package, TreePine, Settings, FileText, Users } from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  section: string;
}

const navItems: NavItem[] = [
  { icon: Package, label: "Orders", section: "Orders" },
  { icon: TreePine, label: "Trees", section: "My Trees" },
  { icon: Home, label: "Home", section: "Dashboard" },
  { icon: FileText, label: "Certs", section: "Certificates" },
  { icon: Users, label: "Refs", section: "Referrals" },
];

export function MobileNav({ onSectionChange, activeSection }: { onSectionChange: (section: string) => void, activeSection: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden h-16">
      <div className="flex items-center justify-around h-full px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.section;
          
          return (
            <button
              key={item.section}
              onClick={() => onSectionChange(item.section)}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
            >
              <Icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`} 
              />
              <span 
                className={`text-[10px] uppercase font-bold tracking-tighter transition-colors ${
                  isActive ? "text-emerald-700" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
