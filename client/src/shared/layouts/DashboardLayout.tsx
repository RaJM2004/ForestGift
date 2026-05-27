import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/UI';

interface LayoutProps {
  children: React.ReactNode;
  navItems: { label: string, icon: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  title: string;
  subtitle?: string;
  lastUpdated?: Date;
  notifications?: any[];
  onLogout?: () => void;
}

const ForecastTree = ({ className, size = 300, z = 0, opacity = 0.2, delay = 0, speed = "animate-sway" }: any) => (
  <div 
    className={`absolute pointer-events-none transition-transform duration-1000 ${speed} ${className}`}
    style={{ 
      transform: `translateZ(${z}px)`,
      opacity: opacity,
      animationDelay: `${delay}s`,
      color: '#e5e7eb' // Light gray for visibility on slightly off-white bg
    }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 98V75 M50 85 L44 78 M50 82 L56 75 M50 75 L40 65 M50 72 L62 60" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M50 2C50 2 25 15 22 45C20 75 50 92 50 92C50 92 80 75 78 45C75 15 50 2 50 2Z" opacity="0.3" />
      <path d="M50 12C50 12 30 25 28 48C26 70 50 85 50 85C50 85 74 70 72 48C70 25 50 12 50 12Z" opacity="0.4" />
      <path d="M50 25C50 25 35 35 34 52C33 68 50 78 50 78C50 78 67 68 66 52C65 35 50 25 50 25Z" opacity="0.5" />
      <path d="M50 38C50 38 40 45 40 55C40 65 50 72 50 72C50 72 60 65 60 55C60 45 50 38 50 38Z" opacity="0.7" />
    </svg>
  </div>
);

const ForestBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1] perspective-forest bg-[#fcfcfc]">
    <div className="absolute inset-0 bg-forest-pattern opacity-20"></div>
    
    {/* Far Background (Z: -300px) */}
    <ForecastTree z={-400} size={500} opacity={0.3} className="top-[5%] right-[10%]" speed="animate-sway-slow" delay={0} />
    <ForecastTree z={-500} size={400} opacity={0.2} className="top-[15%] left-[5%]" speed="animate-sway-slow" delay={2} />
    <ForecastTree z={-450} size={450} opacity={0.4} className="bottom-[20%] right-[40%]" speed="animate-sway-slow" delay={1} />

    {/* Mid Ground (Z: -100px) */}
    <ForecastTree z={-150} size={600} opacity={0.5} className="top-[40%] right-[-5%]" speed="animate-sway" delay={0.5} />
    <ForecastTree z={-200} size={550} opacity={0.4} className="bottom-[5%] left-[-2%]" speed="animate-sway" delay={1.5} />

    {/* Near Ground (Z: 50px) */}
    <ForecastTree z={50} size={800} opacity={0.6} className="bottom-[-10%] right-[5%]" speed="animate-sway" delay={0} />
    <ForecastTree z={100} size={700} opacity={0.5} className="top-[-5%] left-[20%]" speed="animate-sway" delay={3} />

    {/* Foreground Focus - Large animated leaves floating closer to camera */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/10 to-transparent"></div>
    <div className="absolute top-[30%] left-[10%] opacity-20 animate-sway-slow">
       <svg width="40" height="40" viewBox="0 0 24 24" fill="#666"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
    </div>
    <div className="absolute bottom-[20%] right-[15%] opacity-15 animate-sway">
       <svg width="60" height="60" viewBox="0 0 24 24" fill="#999"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
    </div>
  </div>
);

export const DashboardLayout = ({ children, navItems, activeSection, setActiveSection, title, subtitle, lastUpdated, notifications = [], onLogout }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const hasUnread = notifications.length > lastSeenCount;

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!notificationRef.current) return;
      if (!notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (isNotificationOpen) {
      setLastSeenCount(notifications.length);
    }
  }, [isNotificationOpen, notifications.length]);

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:relative h-full z-50 bg-black flex flex-col transition-all duration-300 shadow-xl overflow-hidden
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16 w-64'}
      `}>
        {/* Realistic 3D Forest Elements in Sidebar */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] perspective-forest overflow-hidden">
          <ForecastTree z={-100} size={200} opacity={0.5} className="-bottom-10 -right-5 text-white" speed="animate-sway" />
          <ForecastTree z={-50} size={150} opacity={0.3} className="top-20 -left-10 text-white" speed="animate-sway-slow" delay={1} />
        </div>

        <div className="p-4 border-b border-white/10 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-lg">
              <Icon name="tree" size={20} className="stroke-black" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-[10px] font-black text-white tracking-widest leading-none uppercase">{title}</div>
                <div className="text-[8px] text-gray-400 tracking-widest uppercase">{subtitle ?? 'Gifting Solutions'}</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="md:hidden p-1 text-white hover:bg-white/20 rounded" onClick={() => setSidebarOpen(false)}>
              <Icon name="x" size={16} />
            </button>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto relative z-10">
          {navItems.map(item => (
            <button 
              key={item.label}
              onClick={() => {
                 setActiveSection(item.label);
                 if (window.innerWidth <= 768) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all group relative ${activeSection === item.label ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon name={item.icon} size={18} className={activeSection === item.label ? 'stroke-black' : 'stroke-gray-400 group-hover:stroke-white'} />
              {sidebarOpen && <span className="text-sm font-bold tracking-wide">{item.label}</span>}
              {activeSection === item.label && <div className="absolute left-0 w-1 h-6 bg-black rounded-r-full" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between relative z-10 w-full">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-black uppercase shrink-0">A</div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">Authorized User</div>
                <div className="text-[10px] text-gray-400 truncate tracking-widest uppercase">Admin Level</div>
              </div>
            )}
          </div>
          {sidebarOpen && onLogout && (
             <button 
                onClick={onLogout}
                className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors rounded-lg flex items-center justify-center shrink-0 ml-2"
                title="Logout"
             >
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
             </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA WITH 3D FOREST BACKGROUND */}
      <div className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto relative z-0 bg-transparent min-w-0">
        <ForestBackground />

        {/* HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <Icon name="filter" size={18} className="text-black" />
            </button>
            <div className="text-sm md:text-lg font-black text-black tracking-tight uppercase truncate">{activeSection}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
              >
                <Icon name="bell" size={18} className="text-black" />
              </button>
              {hasUnread && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full border-2 border-white" />}

              {isNotificationOpen && (
                <div className="absolute right-0 top-12 w-[22rem] max-h-[26rem] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
                    <h4 className="text-sm font-bold tracking-wide text-gray-900">Notifications</h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      {notifications.length} items
                    </span>
                  </div>
                  <div className="p-2 max-h-[21rem] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-sm text-gray-500 text-center">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 25).map((item, idx) => (
                        <div key={item?._id || item?.id || `${item?.time || 'n'}-${idx}`} className="rounded-xl border border-gray-100 bg-white p-3 mb-2 hover:bg-gray-50">
                          <div className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-black shrink-0" />
                            <div>
                              <div className="text-xs font-medium text-gray-900 leading-5">{item?.msg || item?.message || 'Notification'}</div>
                              <div className="text-[10px] text-gray-500 mt-1">
                                {item?.time || (item?.createdAt ? new Date(item.createdAt).toLocaleString() : '')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 w-full max-w-7xl mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
