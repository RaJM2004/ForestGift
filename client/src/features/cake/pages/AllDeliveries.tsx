import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { DeliveryRequestCard } from '../components/DeliveryRequestCard';
import { Input } from '../../../shared/components/ui/input';
import { Button } from '../../../shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select';
import { useCakeData } from '../CakeDataContext';

export function AllDeliveries() {
  const { deliveries, loading, error, runWorkflow } = useCakeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchQuery, statusFilter]);

  const handleWorkflow = async (
    id: string,
    action: Parameters<typeof runWorkflow>[1],
    otp?: string,
  ) => {
    try {
      await runWorkflow(id, action, otp);
      toast.success('Order updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === 'PENDING').length,
    preparing: deliveries.filter((d) => d.status === 'PREPARING').length,
    outForDelivery: deliveries.filter((d) => d.status === 'OUT_FOR_DELIVERY').length,
    delivered: deliveries.filter((d) => d.status === 'DELIVERED').length,
  };

  if (loading) return <div className="text-gray-500">Loading deliveries…</div>;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-6">
        <p className="font-semibold">Could not load deliveries</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">All deliveries</h1>
        <p className="text-gray-600">Live orders from MongoDB — accept, prepare, dispatch, and verify OTP.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(
          [
            ['Total', stats.total, 'text-[#1F2937]'],
            ['Pending', stats.pending, 'text-[#F59E0B]'],
            ['Preparing', stats.preparing, 'text-[#EC4899]'],
            ['Out for delivery', stats.outForDelivery, 'text-purple-600'],
            ['Delivered', stats.delivered, 'text-[#10B981]'],
          ] as const
        ).map(([label, value, color]) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search name, order ID, location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus-visible:border-[#EC4899]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-64 border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PREPARING">Preparing</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => (
          <DeliveryRequestCard
            key={delivery.id}
            request={delivery}
            onWorkflow={
              delivery.status !== 'DELIVERED' && delivery.status !== 'REJECTED'
                ? handleWorkflow
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
