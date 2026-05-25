import { useState } from 'react';
import { Home, Package, TrendingUp, MoreHorizontal, FileText, User, IndianRupee } from 'lucide-react';
import { useCakeNav } from '../CakeNavContext';
import type { CakePathname } from '../CakeNavContext';

const PRIMARY_NAV: { path: CakePathname; icon: typeof Home; label: string }[] = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/deliveries', icon: Package, label: 'Orders' },
  { path: '/earnings', icon: IndianRupee, label: 'Earnings' },
  { path: '/invoices', icon: FileText, label: 'Invoices' },
];

const MORE_NAV: { path: CakePathname; icon: typeof User; label: string }[] = [
  { path: '/profile', icon: User, label: 'Profile' },
];

export function MobileBottomNav() {
  const { pathname, navigate } = useCakeNav();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = MORE_NAV.some((n) => n.path === pathname);

  return (
    <>
      {moreOpen ? (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black/20"
          aria-label="Close menu"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}
      {moreOpen ? (
        <div className="lg:hidden fixed bottom-16 right-4 left-4 z-50 bg-white rounded-2xl border border-[#FBCFE8] shadow-xl p-2">
          {MORE_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setMoreOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === item.path ? 'bg-[#FDF2F8] text-[#EC4899]' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#FBCFE8] z-50 shadow-lg">
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {PRIMARY_NAV.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors border-0 bg-transparent ${
                  isActive ? 'text-[#EC4899]' : 'text-gray-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive ? (
                  <div className="absolute bottom-0 w-10 h-0.5 bg-gradient-to-r from-[#EC4899] to-[#FBCFE8] rounded-t-full" />
                ) : null}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={`relative flex flex-col items-center justify-center gap-0.5 border-0 bg-transparent ${
              isMoreActive || moreOpen ? 'text-[#EC4899]' : 'text-gray-500'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
