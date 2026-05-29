import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar, AvatarFallback } from '../../../shared/components/ui/avatar';
import { NotificationsPanel } from './NotificationsPanel';
import { createInitialCakeNotifications } from '../data/notifications';
import { useCakeUser } from '../CakeUserContext';
import { useCakeData } from '../CakeDataContext';
import { useCakeNav } from '../CakeNavContext';
import type { CakePathname } from '../CakeNavContext';
import { initialsFromName } from '../utils/helpers';

const navLinkClass = (active: boolean) =>
  `shrink-0 text-base sm:text-lg font-semibold transition-colors border-0 bg-transparent cursor-pointer py-2.5 px-2 sm:px-1 rounded-md sm:rounded-none ${
    active ? 'text-[#EC4899]' : 'text-gray-600 hover:text-[#EC4899]'
  }`;

const NAV_ITEMS: { path: CakePathname; label: string }[] = [
  { path: '/', label: 'Dashboard' },
  { path: '/deliveries', label: 'Deliveries' },
  { path: '/earnings', label: 'Earnings' },
  { path: '/invoices', label: 'Invoices' },
  { path: '/profile', label: 'Profile' },
];

export function TopNavBar({ onLogout }: { onLogout?: () => void }) {
  const { pathname, navigate } = useCakeNav();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState(createInitialCakeNotifications);
  const user = useCakeUser();
  const { vendor } = useCakeData();

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handleMarkOneRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const shopName = vendor?.name?.trim() || user.name?.trim() || 'Cake shop';
  const subtitle = user.area?.trim() || vendor?.area?.trim() || 'Delivery partner';
  const initials = initialsFromName(user.contact || user.name);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#FBCFE8] shrink-0 overflow-visible">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 sm:py-2">
          <div className="flex items-center justify-between gap-3 min-h-[44px]">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial min-w-0">
              <button
                type="button"
                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
                onClick={() => setShowSidebar(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity text-left min-w-0 flex-1 sm:flex-initial"
              >
                <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-xl" aria-hidden>
                    🎂
                  </span>
                </div>
                <div className="hidden sm:flex flex-col min-w-0 text-left">
                  <span className="text-lg sm:text-xl font-bold text-[#1F2937] truncate" title={shopName}>
                    {shopName}
                  </span>
                  <span className="text-sm text-gray-500 truncate">{subtitle}</span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-2.5 sm:px-3 text-red-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
                  <span className="hidden sm:inline text-sm font-semibold">Log out</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white !text-gray-900 shadow-sm transition-colors hover:border-[#EC4899]/35 hover:bg-[#FDF2F8] hover:!text-[#DB2777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899] focus-visible:ring-offset-2"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
                {unreadCount > 0 ? (
                  <Badge className="pointer-events-none absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 flex items-center justify-center p-0 bg-[#EC4899] text-white text-[10px] font-bold border-2 border-white shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899] focus-visible:ring-offset-2 shrink-0"
                aria-label="Open profile"
              >
                <Avatar className="w-9 h-9 border-2 border-[#FBCFE8] hover:border-[#EC4899] transition-colors cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] text-white font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>

          <div
            className="hidden md:flex flex-wrap items-center gap-x-6 lg:gap-x-8 gap-y-2 border-t border-[#FBCFE8] pt-4 sm:border-t-0 sm:pt-2 -mx-1 px-1 sm:mx-0 sm:px-0"
            role="navigation"
            aria-label="Main"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={navLinkClass(pathname === item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkOneRead={handleMarkOneRead}
      />

      {/* Mobile Sidebar Overlay */}
      {showSidebar ? (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 transition-opacity" 
            onClick={() => setShowSidebar(false)} 
            aria-label="Close sidebar"
          />
          <div className="relative w-64 max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 border-r border-[#FBCFE8]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#FBCFE8]/40 bg-gradient-to-r from-[#FDF2F8] to-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#EC4899] rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-sm">🎂</span>
                </div>
                <span className="font-bold text-[#1F2937]">Menu</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSidebar(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setShowSidebar(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl font-medium transition-all ${
                      isActive 
                        ? 'bg-[#FDF2F8] text-[#EC4899] shadow-sm border border-[#FBCFE8]/50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            
            {onLogout && (
              <div className="p-4 border-t border-[#FBCFE8]/40 bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowSidebar(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
