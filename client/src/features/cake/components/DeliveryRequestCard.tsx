import { MapPin, Phone, Calendar, Clock, TreePine, Cake } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import type { DeliveryRequest } from '../data/mockData';
import { formatDobDisplay } from '../utils/helpers';

interface DeliveryRequestCardProps {
  request: DeliveryRequest;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function DeliveryRequestCard({
  request,
  showActions = true,
  onAccept,
  onReject,
}: DeliveryRequestCardProps) {
  return (
    <div className="bg-white rounded-xl border-l-4 border-[#EC4899] shadow-sm hover:shadow-lg transition-all duration-300 hover:border-l-8 p-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-3xl">🎂</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-3 min-w-0">
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Customer</p>
            <h3 className="font-semibold text-[#1F2937] text-lg truncate">{request.recipientName}</h3>
            <p
              className="text-sm text-gray-500"
              title="Each ForestGift member has one cake order; order id matches their account."
            >
              Cake order <span className="font-mono text-[#EC4899]">{request.orderId}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-[#EC4899]" />
              <span>{request.phoneNumber}</span>
            </div>
            {request.dob ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Cake className="w-4 h-4 text-[#EC4899]" aria-hidden />
                <span title="Date of birth">DOB {formatDobDisplay(request.dob)}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-[#EC4899]" />
              <span title="Cake delivery date">{new Date(request.deliveryDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-[#EC4899]" />
              <span>{request.deliveryTime}</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 mb-4 space-y-3">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-[#EC4899] flex-shrink-0 mt-0.5" aria-hidden />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Home</p>
                <p className="leading-snug">{request.location}</p>
              </div>
            </div>
            {request.zoneLocation &&
            request.zoneLocation !== 'TBD' &&
            !request.location.includes(request.zoneLocation) ? (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <TreePine className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Forest / zone</p>
                  <p className="leading-snug">{request.zoneLocation}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-[#FBCFE8] bg-[#FDF2F8] px-3 py-2 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Size:</span> {request.cakeSize}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Flavor:</span> {request.cakeFlavor}
            </p>
          </div>

          {showActions && request.status === 'PENDING' && onAccept && onReject && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Button
                onClick={() => onAccept(request.id)}
                className="bg-[#10B981] hover:bg-[#059669] text-white shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                Accept
              </Button>
              <Button
                onClick={() => onReject(request.id)}
                variant="outline"
                className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
