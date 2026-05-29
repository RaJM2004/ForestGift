import { Toaster } from 'sonner';
import { TopNavBar } from '../components/TopNavBar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { WelcomeTour } from '../components/WelcomeTour';
import { useCakeNav } from '../CakeNavContext';
import { Dashboard } from '../pages/Dashboard';
import { AllDeliveries } from '../pages/AllDeliveries';
import { Profile } from '../pages/Profile';
import { EarningsPage } from '../pages/EarningsPage';
import { InvoicesPage } from '../pages/InvoicesPage';

function CakePageContent() {
  const { pathname } = useCakeNav();

  switch (pathname) {
    case '/deliveries':
      return <AllDeliveries />;
    case '/earnings':
      return <EarningsPage />;
    case '/invoices':
      return <InvoicesPage />;
    case '/profile':
      return <Profile />;
    case '/':
    default:
      return <Dashboard />;
  }
}

export function CakeRootLayout({ onLogout }: { onLogout?: () => void }) {
  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-gradient-to-br from-white via-[#FDF2F8] to-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#EC4899]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FBCFE8]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 min-h-0 w-full overflow-hidden">
        <TopNavBar onLogout={onLogout} />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          <CakePageContent />
        </main>
        <MobileBottomNav />
        <WelcomeTour />
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}
