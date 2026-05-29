import { useState } from 'react';
import { MapPin, Phone, Calendar, Clock, TreePine, Cake, ChefHat, Truck, PackageCheck } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import type { DeliveryRequest, WorkflowAction } from '../types/delivery';
import { formatDobDisplay } from '../utils/helpers';
import { OtpVerifyModal } from './OtpVerifyModal';

const STATUS_LABELS: Record<DeliveryRequest['status'], string> = {
  PENDING: 'Pending',
  PREPARING: 'Preparing your cake',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
};

const STATUS_COLORS: Record<DeliveryRequest['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PREPARING: 'bg-pink-100 text-pink-800',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
};

interface DeliveryRequestCardProps {
  request: DeliveryRequest;
  onWorkflow?: (userId: string, action: WorkflowAction, otp?: string) => Promise<void>;
}

export function DeliveryRequestCard({ request, onWorkflow }: DeliveryRequestCardProps) {
  const [otpOpen, setOtpOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (action: WorkflowAction, otp?: string) => {
    if (!onWorkflow) return;
    setBusy(true);
    try {
      await onWorkflow(request.id, action, otp);
    } finally {
      setBusy(false);
    }
  };

  const deliveryDateLabel = (() => {
    const d = new Date(request.deliveryDate);
    return Number.isNaN(d.getTime()) ? request.deliveryDate : d.toLocaleDateString();
  })();

  const isRejected = request.status === 'REJECTED';
  const isDelivered = request.status === 'DELIVERED';
  const isPending = request.status === 'PENDING';
  const isPreparing = request.status === 'PREPARING';
  const isOutForDelivery = request.status === 'OUT_FOR_DELIVERY';

  const workflowSteps = [
    { key: 'preparing' as const, label: 'Preparing Your Cake', icon: ChefHat },
    { key: 'out_for_delivery' as const, label: 'Out For Delivery', icon: Truck },
    { key: 'delivered' as const, label: 'Delivered', icon: PackageCheck },
  ];

  const activeStep =
    isPreparing ? 0 : isOutForDelivery ? 1 : isDelivered ? 2 : -1;

  return (
    <>
      <div
        className={`bg-white rounded-xl border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 p-5 ${
          isRejected ? 'border-red-400 opacity-90' : 'border-[#EC4899] hover:border-l-8'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#FBCFE8] flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-3xl">🎂</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Customer</p>
                <h3 className="font-semibold text-[#1F2937] text-lg truncate">{request.recipientName}</h3>
                <p className="text-sm text-gray-500">
                  Cake order <span className="font-mono text-[#EC4899]">{request.orderId}</span>
                </p>
              </div>
              <Badge className={STATUS_COLORS[request.status]}>{STATUS_LABELS[request.status]}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#EC4899]" />
                <span>{request.phoneNumber}</span>
              </div>
              {request.dob ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Cake className="w-4 h-4 text-[#EC4899]" aria-hidden />
                  <span>DOB {formatDobDisplay(request.dob)}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#EC4899]" />
                <span>{deliveryDateLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#EC4899]" />
                <span>{request.deliveryTime}</span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 mb-4 space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-[#EC4899] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Home</p>
                  <p className="leading-snug">{request.location}</p>
                </div>
              </div>
              {request.zoneLocation &&
              request.zoneLocation !== 'TBD' &&
              !request.location.includes(request.zoneLocation) ? (
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <TreePine className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
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

            {isPending && onWorkflow ? (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Button
                  disabled={busy}
                  onClick={() => void run('accept')}
                  className="bg-[#10B981] hover:bg-[#059669] text-white shadow-sm hover:scale-105 transition-all"
                >
                  Accept
                </Button>
                <Button
                  disabled={busy}
                  onClick={() => void run('reject')}
                  variant="outline"
                  className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                >
                  Reject
                </Button>
              </div>
            ) : null}

            {(isPreparing || isOutForDelivery) && onWorkflow && !isRejected && !isDelivered ? (
              <div className="mt-4 space-y-3">
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 transition-all duration-500 ${
                        i <= activeStep ? 'bg-gradient-to-r from-[#EC4899] to-[#F472B6]' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  {workflowSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === activeStep;
                    const isDone = idx < activeStep;
                    const disabled =
                      busy ||
                      (step.key === 'preparing' && isOutForDelivery) ||
                      (step.key === 'preparing' && isPreparing && isActive) ||
                      (step.key === 'out_for_delivery' && !isPreparing && !isOutForDelivery) ||
                      (step.key === 'delivered' && !isOutForDelivery);

                    if (step.key === 'delivered') {
                      return (
                        <Button
                          key={step.key}
                          disabled={!isOutForDelivery || busy}
                          onClick={() => setOtpOpen(true)}
                          variant={isOutForDelivery ? 'default' : 'outline'}
                          className={
                            isOutForDelivery
                              ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                              : 'border-gray-200 text-gray-400'
                          }
                        >
                          <Icon className="w-4 h-4 mr-1.5" />
                          {step.label}
                        </Button>
                      );
                    }

                    return (
                      <Button
                        key={step.key}
                        disabled={disabled}
                        onClick={() => void run(step.key)}
                        variant={isActive ? 'default' : 'outline'}
                        className={
                          isActive
                            ? 'bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-md'
                            : isDone
                              ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                              : 'border-[#FBCFE8] text-gray-600'
                        }
                      >
                        <Icon className="w-4 h-4 mr-1.5" />
                        {step.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {isRejected ? (
              <p className="text-sm font-semibold text-red-600 mt-3">Order rejected — no further actions.</p>
            ) : null}

            {isDelivered ? (
              <p className="text-sm font-semibold text-emerald-600 mt-3">Completed · recorded in earnings.</p>
            ) : null}
          </div>
        </div>
      </div>

      <OtpVerifyModal
        open={otpOpen}
        customerName={request.recipientName}
        orderId={request.orderId}
        onClose={() => setOtpOpen(false)}
        onVerify={async (otp) => run('complete_delivery', otp)}
      />
    </>
  );
}
