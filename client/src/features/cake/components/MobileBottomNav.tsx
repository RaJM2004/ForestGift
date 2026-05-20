import { Home, Package, User } from 'lucide-react';
import { useCakeNav } from '../CakeNavContext';
import type { CakePathname } from '../CakeNavContext';

export function MobileBottomNav() {
  const { pathname, navigate } = useCakeNav();

  const navItems: { path: CakePathname; icon: typeof Home; label: string }[] = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/deliveries', icon: Package, label: 'Deliveries' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#FBCFE8] z-50 shadow-lg">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-colors border-0 bg-transparent ${
                isActive ? 'text-[#EC4899]' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-[#EC4899] to-[#FBCFE8] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
