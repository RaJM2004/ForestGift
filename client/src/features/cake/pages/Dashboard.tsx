import { useMemo } from 'react';
import { Cake, Truck, CalendarCheck, Target } from 'lucide-react';
import { toast } from 'sonner';
import { MetricCard } from '../components/MetricCard';
import { DeliveryRequestCard } from '../components/DeliveryRequestCard';
import { BirthdayAlerts } from '../components/BirthdayAlerts';
import { performanceStats } from '../data/mockData';
import { getGreeting } from '../utils/helpers';
import { useCakeUser } from '../CakeUserContext';
import { useCakeData } from '../CakeDataContext';

export function Dashboard() {
  const { name, area } = useCakeUser();
  const { deliveries, summary, loading, error, updateDelivery } = useCakeData();
  const displayName = name ?? 'Partner';

  const pendingCount = summary?.pendingCount ?? deliveries.filter((d) => d.status === 'PENDING').length;

  const activePipeline = useMemo(
    () => deliveries.filter((d) => d.status !== 'PENDING' && d.status !== 'REJECTED'),
    [deliveries],
  );

  const completedThisMonth = summary?.deliveredCount ?? deliveries.filter((d) => d.status === 'DELIVERED').length;

  const successRateDisplay = summary?.successRate ?? performanceStats.successRate;

  const handleAccept = async (id: string) => {
    try {
      await updateDelivery(id, 'ACCEPTED');
      toast.success('Request accepted!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDelivery(id, 'REJECTED');
      toast.success('Request rejected');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const newRequestsToShow = deliveries.filter((d) => d.status === 'PENDING');

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg w-2/3 max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-40 bg-white border border-gray-100 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-6">
        <p className="font-semibold">Could not load dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2 text-red-700">
          Check that the API server is running and <code className="bg-red-100 px-1 rounded">VITE_API_URL</code> points
          to it (default <code className="bg-red-100 px-1 rounded">http://localhost:5000/api</code>).
        </p>
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
          {area ? `Here is what is happening with deliveries in ${area}.` : 'Here is your delivery overview.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          icon={Cake}
          title="Pending Requests"
          value={pendingCount}
          gradient="from-[#F59E0B] to-[#FCD34D]"
        />
        <MetricCard
          icon={Truck}
          title="Active pipeline"
          value={activePipeline.length}
          gradient="from-[#EC4899] to-[#FBCFE8]"
        />
        <MetricCard
          icon={CalendarCheck}
          title="Completed (assigned)"
          value={completedThisMonth}
          gradient="from-[#10B981] to-[#34D399]"
        />
        <MetricCard
          icon={Target}
          title="Success Rate"
          value={`${successRateDisplay}%`}
          gradient="from-[#8B5CF6] to-[#C4B5FD]"
        />
      </div>

      <BirthdayAlerts deliveries={deliveries} />

      <div>
        <h2 className="text-xl font-semibold">New delivery requests</h2>
        <p className="text-sm text-gray-500 mb-4 mt-1">
          One ForestGift member = one cake order. Use their name and home address for delivery.
        </p>
        {newRequestsToShow.length > 0 ? (
          <div className="space-y-4">
            {newRequestsToShow.map((request) => (
              <DeliveryRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No pending requests right now.
            {deliveries.length === 0 ? (
              <>
                {' '}
                If the whole dashboard is empty, assign{' '}
                <code className="text-xs bg-gray-100 px-1 rounded">cakeVendor</code> on users to your shop id (for
                example <code className="text-xs bg-gray-100 px-1 rounded">VND001</code>), or run{' '}
                <code className="text-xs bg-gray-100 px-1 rounded">npm run assign-cake-vendors</code> in the server
                folder.
              </>
            ) : null}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">In progress &amp; completed</h2>
        <p className="text-sm text-gray-500 mb-4 mt-1">Same rule: each row is one customer and one cake order.</p>
        {activePipeline.length > 0 ? (
          <div className="space-y-4">
            {activePipeline.map((request) => (
              <DeliveryRequestCard key={request.id} request={request} showActions={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No active deliveries.</p>
        )}
      </div>
    </div>
  );
}
