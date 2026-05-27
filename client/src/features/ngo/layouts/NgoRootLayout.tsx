import { Toaster } from 'sonner';
import { NgoTopNavBar } from '../components/NgoTopNavBar';
import { NgoMobileBottomNav } from '../components/NgoMobileBottomNav';

export function NgoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-gradient-to-br from-white via-[#b2d8d0]/35 to-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#b2d8d0]/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#b2d8d0]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full overflow-hidden">
        <NgoTopNavBar />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
          {children}
        </main>
        <NgoMobileBottomNav />
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}
