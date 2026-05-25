import { useMemo } from 'react';
import { Cake, Truck, CalendarCheck, Target, TrendingUp, FileText, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { MetricCard } from '../components/MetricCard';
import { DeliveryRequestCard } from '../components/DeliveryRequestCard';
import { BirthdayAlerts } from '../components/BirthdayAlerts';
import { getGreeting } from '../utils/helpers';
import { useCakeUser } from '../CakeUserContext';
import { useCakeData } from '../CakeDataContext';
import { useCakeNav } from '../CakeNavContext';

const QUICK_LINKS = [
  { path: '/deliveries' as const, label: 'All orders', icon: Truck, desc: 'Search & filter' },
  { path: '/earnings' as const, label: 'Earnings', icon: TrendingUp, desc: 'Verified deliveries' },
  { path: '/invoices' as const, label: 'Invoices', icon: FileText, desc: 'PDF download' },
];

export function Dashboard() {
  const { name, area } = useCakeUser();
  const { deliveries, summary, loading, error, runWorkflow } = useCakeData();
  const { navigate } = useCakeNav();
  const displayName = name ?? 'Partner';

  const pendingCount = summary?.pendingCount ?? deliveries.filter((d) => d.status === 'PENDING').length;

  const activePipeline = useMemo(
    () =>
      deliveries.filter(
        (d) => d.status === 'PREPARING' || d.status === 'OUT_FOR_DELIVERY',
      ),
    [deliveries],
  );

  const completedCount = summary?.deliveredCount ?? deliveries.filter((d) => d.status === 'DELIVERED').length;
  const successRateDisplay = summary?.successRate ?? 0;

  const handleWorkflow = async (id: string, action: Parameters<typeof runWorkflow>[1], otp?: string) => {
    try {
      await runWorkflow(id, action, otp);
      const messages: Record<string, string> = {
        accept: 'Order accepted — preparing started',
        reject: 'Order rejected',
        preparing: 'Preparing your cake',
        out_for_delivery: 'Out for delivery — OTP sent to customer',
        complete_delivery: 'Delivered — added to earnings',
      };
      toast.success(messages[action] || 'Updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const newRequestsToShow = deliveries.filter((d) => d.status === 'PENDING');
  const inProgress = deliveries.filter(
    (d) => d.status === 'PREPARING' || d.status === 'OUT_FOR_DELIVERY',
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-2/3 max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-6">
        <p className="font-semibold">Could not load dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[#1F2937]">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {displayName}!
        </h1>
        <p className="text-gray-600">
          {area ? `Deliveries in ${area} — live data from your database.` : 'Your delivery overview.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard icon={Cake} title="Pending" value={pendingCount} gradient="from-[#F59E0B] to-[#FCD34D]" />
        <MetricCard
          icon={Truck}
          title="In progress"
          value={activePipeline.length}
          gradient="from-[#EC4899] to-[#FBCFE8]"
        />
        <MetricCard
          icon={CalendarCheck}
          title="Delivered"
          value={completedCount}
          gradient="from-[#10B981] to-[#34D399]"
        />
        <MetricCard
          icon={Target}
          title="Success rate"
          value={`${successRateDisplay}%`}
          gradient="from-[#8B5CF6] to-[#C4B5FD]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
              className="group flex items-center justify-between bg-white rounded-2xl border border-[#FBCFE8]/60 p-4 shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] flex items-center justify-center text-[#EC4899] group-hover:bg-[#EC4899] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{link.label}</p>
                  <p className="text-xs text-gray-500">{link.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#EC4899]" />
            </button>
          );
        })}
      </div>

      <BirthdayAlerts deliveries={deliveries} />

      <div>
        <h2 className="text-xl font-semibold">New requests</h2>
        <p className="text-sm text-gray-500 mb-4 mt-1">Accept or reject — then manage the full workflow on each card.</p>
        {newRequestsToShow.length > 0 ? (
          <div className="space-y-4">
            {newRequestsToShow.map((request) => (
              <DeliveryRequestCard key={request.id} request={request} onWorkflow={handleWorkflow} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No pending requests.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">In progress</h2>
        {inProgress.length > 0 ? (
          <div className="space-y-4 mt-4">
            {inProgress.map((request) => (
              <DeliveryRequestCard key={request.id} request={request} onWorkflow={handleWorkflow} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No orders in the kitchen or on the road.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Completed & rejected</h2>
        <div className="space-y-4 mt-4">
          {deliveries
            .filter((d) => d.status === 'DELIVERED' || d.status === 'REJECTED')
            .map((request) => (
              <DeliveryRequestCard key={request.id} request={request} />
            ))}
        </div>
      </div>
    </div>
  );
}
