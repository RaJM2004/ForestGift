import { Bell, LogOut, TreePine } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar, AvatarFallback } from '../../../shared/components/ui/avatar';
import { useNgoNav, type NgoSection } from '../NgoNavContext';

const navLinkClass = (active: boolean) =>
  `shrink-0 text-base sm:text-lg font-semibold transition-colors border-0 bg-transparent cursor-pointer py-2.5 px-2 sm:px-1 rounded-md ${
    active ? 'text-[#5a9e94]' : 'text-gray-600 hover:text-[#5a9e94]'
  }`;

const NAV_ITEMS: { section: NgoSection; label: string }[] = [
  { section: 'Dashboard', label: 'Dashboard' },
  { section: 'Orders', label: 'Orders' },
  { section: 'Plantation', label: 'Plantation' },
  { section: 'Bulk Entry', label: 'Bulk Entry' },
  { section: 'Reports', label: 'Reports' },
  { section: 'Volunteers', label: 'Volunteers' },
  { section: 'Profile', label: 'Profile' },
];

export function NgoTopNavBar() {
  const { activeSection, setActiveSection, title, subtitle, notifications, onLogout } = useNgoNav();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  const handleMarkAllRead = useCallback(() => setShowNotifications(false), []);

  const initials = title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#b2d8d0] shrink-0">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 sm:py-2">
          <div className="flex items-center justify-between gap-3 min-h-[44px]">
            <button
              type="button"
              onClick={() => setActiveSection('Dashboard')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-90 text-left min-w-0"
            >
              <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#b2d8d0] to-white rounded-lg flex items-center justify-center shadow-sm border border-[#b2d8d0]/50">
                <TreePine className="w-5 h-5 text-[#2d6a62]" />
              </div>
              <div className="min-w-0">
                <span className="text-lg sm:text-xl font-bold text-[#1F2937] truncate block">{title}</span>
                <span className="text-xs text-gray-500 truncate block">{subtitle}</span>
              </div>
            </button>

            <div className="flex items-center gap-2 shrink-0">
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-100 px-2.5 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-semibold">Log out</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative h-10 w-10 rounded-lg border border-[#b2d8d0]/60 bg-white hover:bg-[#eef8f6]"
              >
                <Bell className="h-5 w-5 text-gray-800" />
                {unreadCount > 0 ? (
                  <Badge className="absolute -top-0.5 -right-0.5 min-w-5 h-5 p-0 flex items-center justify-center bg-[#5a9e94] text-white text-[10px]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                ) : null}
              </button>
              <button type="button" onClick={() => setActiveSection('Profile')} className="rounded-full">
                <Avatar className="w-9 h-9 border-2 border-[#b2d8d0]">
                  <AvatarFallback className="bg-gradient-to-br from-[#b2d8d0] to-white text-[#2d6a62] font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#b2d8d0]/40 pt-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => setActiveSection(item.section)}
                className={navLinkClass(activeSection === item.section)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showNotifications ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20"
            aria-label="Close notifications"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-4 sm:right-8 top-full mt-1 z-50 w-[min(22rem,calc(100vw-2rem))] max-h-80 overflow-y-auto rounded-2xl border border-[#b2d8d0] bg-white shadow-xl p-3">
            <p className="text-sm font-semibold text-[#1F2937] mb-2 px-1">Notifications</p>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 px-1">No notifications.</p>
            ) : (
              notifications.slice(0, 15).map((item: { _id?: string; msg?: string; time?: string }, i) => (
                <div key={item._id || i} className="p-3 rounded-xl border border-[#b2d8d0]/30 mb-2 text-sm">
                  <p className="font-medium text-gray-900">{item.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                </div>
              ))
            )}
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="w-full text-xs font-medium text-[#5a9e94] py-2"
            >
              Dismiss
            </button>
          </div>
        </>
      ) : null}
    </nav>
  );
}
