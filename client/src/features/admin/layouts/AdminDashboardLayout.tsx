import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Cake, 
  Map, 
  BarChart3, 
  BookOpen, 
  ShieldAlert, 
  Settings, 
  User, 
  ChevronRight,
  MoreHorizontal,
  TreePine
} from 'lucide-react';
import { Icon } from '../../../shared/components/UI';
import { Badge } from '../../../shared/components/ui/badge';
import { Avatar, AvatarFallback } from '../../../shared/components/ui/avatar';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  navItems: { label: string; icon: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  title: string;
  subtitle?: string;
  lastUpdated?: Date;
  notifications?: any[];
  onLogout?: () => void;
}

const navLinkClass = (active: boolean) =>
  `shrink-0 text-base sm:text-lg font-semibold transition-all border-0 bg-transparent cursor-pointer py-2.5 px-2 sm:px-1 rounded-none border-b-2 ${
    active ? 'text-black border-black font-bold' : 'text-zinc-500 border-transparent hover:text-black hover:border-zinc-300'
  }`;

export function AdminDashboardLayout({
  children,
  navItems,
  activeSection,
  setActiveSection,
  title,
  subtitle,
  lastUpdated,
  notifications = [],
  onLogout
}: AdminDashboardLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!notificationRef.current) return;
      if (!notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Primary tabs for mobile bottom navigation (first 4 tabs)
  const mobilePrimaryTabs = useMemo(() => {
    return navItems.slice(0, 4);
  }, [navItems]);

  // Remaining tabs for "More" menu on mobile
  const mobileMoreTabs = useMemo(() => {
    return navItems.slice(4);
  }, [navItems]);

  const isMoreTabActive = useMemo(() => {
    return mobileMoreTabs.some(item => item.label === activeSection);
  }, [mobileMoreTabs, activeSection]);

  const initials = "AD";

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col bg-gradient-to-br from-white via-zinc-100/40 to-white relative text-zinc-950 font-sans">
      
      {/* Sleek ambient monochrome blurs matching the NGO dashboard style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-zinc-200/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-zinc-300/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        
        {/* DESKTOP & MOBILE TOP NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 shrink-0">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 py-3 sm:py-2">
              <div className="flex items-center justify-between gap-3 min-h-[44px]">
                
                {/* Brand Logo & Title */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => setShowSidebar(true)}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setActiveSection('Dashboard Overview')}
                    className="flex items-center gap-2 sm:gap-3 hover:opacity-90 text-left min-w-0"
                  >
                    {/* Premium monochrome logo matching GreenEarth branding */}
                    <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-zinc-100 to-white rounded-lg flex items-center justify-center shadow-sm border border-zinc-200">
                      <TreePine className="w-5 h-5 text-black" />
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-[#1F2937] truncate block">{title || "ForestGift"}</span>
                        <span className="bg-black text-white text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase leading-none">
                          ADMIN
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 truncate block">{subtitle || "Core Administration"}</span>
                    </div>
                  </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {lastUpdated && (
                    <div className="hidden lg:flex flex-col text-right pr-2 border-r border-zinc-200 mr-1">
                      <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest leading-none mb-1">REAL-TIME ACTIVE</span>
                      <span className="text-[10px] text-zinc-500 font-bold">Sync: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                  )}

                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline text-sm font-semibold">Sign out</span>
                    </button>
                  )}

                  {/* Notifications Dropdown */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative h-10 w-10 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors flex items-center justify-center"
                    >
                      <Bell className="h-5 w-5 text-gray-800" />
                      {unreadCount > 0 ? (
                        <Badge className="absolute -top-0.5 -right-0.5 min-w-5 h-5 p-0 flex items-center justify-center bg-black text-white text-[10px] border border-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      ) : null}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2.5 z-50 w-[min(22rem,calc(100vw-2rem))] max-h-80 overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                        <p className="text-sm font-bold text-[#1F2937] mb-2 px-1">Notifications Log</p>
                        {notifications.length === 0 ? (
                          <p className="text-sm text-gray-500 px-1 py-4 text-center">No system events logged.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {notifications.slice(0, 10).map((item, i) => (
                              <div key={item._id || i} className="p-3 rounded-xl border border-zinc-150 text-xs">
                                <p className="font-semibold text-zinc-800 leading-normal">{item.msg || item.message}</p>
                                <p className="text-[10px] text-zinc-400 mt-1 font-bold">{item.time}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowNotifications(false)}
                          className="w-full text-xs font-semibold text-zinc-500 hover:text-black py-2 mt-2 border-t border-zinc-100"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setActiveSection('Settings')} 
                    className="rounded-full focus:outline-none"
                  >
                    <Avatar className="w-9 h-9 border-2 border-zinc-200">
                      <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-white text-zinc-800 font-semibold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </div>
              </div>

              {/* HORIZONTAL DESKTOP NAVIGATION TABS */}
              <div 
                className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-100 pt-3"
                role="navigation"
                aria-label="Admin Navigation"
              >
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveSection(item.label)}
                    className={navLinkClass(activeSection === item.label)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </nav>

        {/* MAIN BODY AND CONTENT LAYOUT */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:py-8 lg:pb-8 relative z-10">
          <div className="mb-6 flex flex-col gap-1 sm:hidden">
            <h1 className="text-xl font-bold text-zinc-900">
              {activeSection}
            </h1>
            <div className="w-8 h-0.5 bg-black rounded-full" />
          </div>
          {children}
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 shadow-lg">
          <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
            {mobilePrimaryTabs.map((item) => {
              const isActive = activeSection === item.label;
              const shortLabel = item.label === "Dashboard Overview" ? "Home" : item.label.replace(" Management", "");
              
              // We retrieve the matching Lucide icon dynamically for standard spacing
              let TabIcon = LayoutDashboard;
              if (item.label === "User Management") TabIcon = Users;
              else if (item.label === "NGO Management") TabIcon = Building2;
              else if (item.label === "Cake Management") TabIcon = Cake;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.label);
                    setMoreOpen(false);
                  }}
                  className={`relative flex flex-col items-center justify-center gap-1 transition-colors border-0 bg-transparent ${
                    isActive ? 'text-black font-semibold' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{shortLabel}</span>
                  {isActive && (
                    <div className="absolute bottom-0 w-8 h-0.5 bg-black rounded-t-full" />
                  )}
                </button>
              );
            })}
            
            {/* "More" Trigger Button for mobile overflow */}
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className={`relative flex flex-col items-center justify-center gap-1 border-0 bg-transparent transition-colors ${
                isMoreTabActive || moreOpen ? 'text-black font-semibold' : 'text-zinc-400'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
              {isMoreTabActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-black rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MORE MENU OVERFLOW OVERLAY */}
        {moreOpen && (
          <>
            <button
              type="button"
              className="lg:hidden fixed inset-0 z-30 bg-black/20 transition-opacity"
              aria-label="Close menu"
              onClick={() => setMoreOpen(false)}
            />
            <div className="lg:hidden fixed bottom-16 right-4 left-4 z-40 bg-white rounded-2xl border border-zinc-200 shadow-xl p-2 animate-in slide-in-from-bottom-5 duration-200">
              {mobileMoreTabs.map((item) => {
                const isActive = activeSection === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.label);
                      setMoreOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-zinc-50 text-black border border-zinc-150' : 'text-zinc-600'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* MOBILE SLIDE-IN SIDEBAR DRAWER MENU */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/40 transition-opacity" 
              onClick={() => setShowSidebar(false)} 
              aria-label="Close sidebar"
            />
            <div className="relative w-64 max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 border-r border-zinc-200">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-250/40 bg-gradient-to-r from-zinc-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center shadow-inner">
                    <TreePine className="w-4 h-4 text-black" />
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
              
              {/* Drawer Tabs List */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setActiveSection(item.label);
                        setShowSidebar(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl font-semibold transition-all ${
                        isActive 
                          ? 'bg-zinc-50 text-black shadow-sm border border-zinc-200/50' 
                          : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              
              {/* Drawer Footer */}
              {onLogout && (
                <div className="p-4 border-t border-zinc-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSidebar(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-red-650 hover:bg-red-50 transition-colors border border-red-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
