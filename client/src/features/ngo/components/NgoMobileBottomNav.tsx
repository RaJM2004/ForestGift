import { useState } from 'react';
import { Home, Package, Map, List, MoreHorizontal, FileText, Users, User } from 'lucide-react';
import { useNgoNav, type NgoSection } from '../NgoNavContext';

const PRIMARY: { section: NgoSection; icon: typeof Home; label: string }[] = [
  { section: 'Dashboard', icon: Home, label: 'Home' },
  { section: 'Orders', icon: Package, label: 'Orders' },
  { section: 'Plantation', icon: Map, label: 'Plant' },
  { section: 'Bulk Entry', icon: List, label: 'Bulk' },
];

const MORE: { section: NgoSection; icon: typeof FileText; label: string }[] = [
  { section: 'Reports', icon: FileText, label: 'Reports' },
  { section: 'Volunteers', icon: Users, label: 'Volunteers' },
  { section: 'Profile', icon: User, label: 'Profile' },
];

export function NgoMobileBottomNav() {
  const { activeSection, setActiveSection } = useNgoNav();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMoreActive = MORE.some((m) => m.section === activeSection);

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
        <div className="lg:hidden fixed bottom-16 right-4 left-4 z-50 bg-white rounded-2xl border border-[#b2d8d0] shadow-xl p-2">
          {MORE.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.section}
                type="button"
                onClick={() => {
                  setActiveSection(item.section);
                  setMoreOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  activeSection === item.section ? 'bg-[#eef8f6] text-[#5a9e94]' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#b2d8d0] z-50 shadow-lg">
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {PRIMARY.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.section;
            return (
              <button
                key={item.section}
                type="button"
                onClick={() => setActiveSection(item.section)}
                className={`flex flex-col items-center justify-center gap-0.5 ${active ? 'text-[#5a9e94]' : 'text-gray-500'}`}
              >
                <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={`flex flex-col items-center justify-center gap-0.5 ${isMoreActive || moreOpen ? 'text-[#5a9e94]' : 'text-gray-500'}`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
