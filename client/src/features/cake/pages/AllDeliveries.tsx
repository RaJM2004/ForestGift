import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { DeliveryRequestCard } from '../components/DeliveryRequestCard';
import type { DeliveryRequest } from '../data/mockData';
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
  const { deliveries, loading, error, updateDelivery } = useCakeData();
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

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === 'PENDING').length,
    outForDelivery: deliveries.filter((d) => d.status === 'OUT_FOR_DELIVERY').length,
    delivered: deliveries.filter((d) => d.status === 'DELIVERED').length,
  };

  if (loading) {
    return <div className="text-gray-500">Loading deliveries…</div>;
  }

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
        <p className="text-gray-600">
          Each entry is one customer with one cake order — name, phone, and home address for drop-off.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-[#1F2937]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Out for Delivery</p>
          <p className="text-2xl font-bold text-[#EC4899]">{stats.outForDelivery}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-[#10B981]">{stats.delivered}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, order ID, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus-visible:border-[#EC4899] focus-visible:ring-[#EC4899]/30"
            />
          </div>

          <div className="w-full md:w-64">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-200 focus-visible:border-[#EC4899] focus-visible:ring-[#EC4899]/30">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || statusFilter !== 'all') && (
            <Button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              variant="outline"
              className="border-[#EC4899] text-[#EC4899] hover:bg-[#EC4899] hover:text-white"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredDeliveries.length} of {deliveries.length} deliveries
        </p>

        {filteredDeliveries.length > 0 ? (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <DeliveryRequestCard
                key={delivery.id}
                request={delivery}
                onAccept={delivery.status === 'PENDING' ? handleAccept : undefined}
                onReject={delivery.status === 'PENDING' ? handleReject : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No deliveries found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
