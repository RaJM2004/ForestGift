import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { TreePine, Activity, CheckCircle } from 'lucide-react';
import { NgoMetricCard } from '../components/NgoMetricCard';

export type DashboardPageProps = {
  orders: any[];
  submissions: any[];
  bulkEntries: any[];
};

export const DashboardPage = ({ orders, submissions, bulkEntries }: DashboardPageProps) => {
  const orderUserNameById = useMemo(() => {
    const map = new Map<string, string>();
    (orders || []).forEach((order) => {
      if (order?.id && order?.name) {
        map.set(String(order.id), String(order.name));
      }
    });
    return map;
  }, [orders]);

  const totalOrderTrees = useMemo(
    () => (orders || []).reduce((sum, order) => sum + Number(order?.tree_count || 0), 0),
    [orders]
  );
  const totalBulkTrees = useMemo(
    () => (bulkEntries || []).reduce((sum, entry) => sum + Number(entry?.count || 0), 0),
    [bulkEntries]
  );
  const totalTrees = totalOrderTrees + totalBulkTrees;

  const CO2_KG_PER_TREE_PER_YEAR = 21;
  const estimatedCO2Kg = totalTrees * CO2_KG_PER_TREE_PER_YEAR;

  const totalOrderCompleted = useMemo(() => {
    const hasSubmissionForOrder = (orderId: string) =>
      (submissions || []).some((s) => (s.orderId || s.order || '').toString() === orderId.toString());

    return (orders || []).filter((order) => {
      const status = (order?.status || '').toString().toLowerCase();
      return status === 'planted' || hasSubmissionForOrder(String(order.id || ''));
    }).length;
  }, [orders, submissions]);

  const mapPins = useMemo(() => {
    const submissionPins = (submissions || [])
      .filter((item) => item?.lat != null && item?.lng != null)
      .map((item) => ({
        id: item._id || item.id || `sub-${item.createdAt || Math.random()}`,
        lat: Number(item.lat),
        lng: Number(item.lng),
        source: 'Submission',
        userName:
          orderUserNameById.get(String(item.userId || '')) ||
          orderUserNameById.get(String(item.orderId || '')) ||
          'Unknown User',
        trees: Number(item.count || 0),
        location: item.location || 'Unknown location',
        createdAt: item.createdAt,
      }));

    const bulkPins = (bulkEntries || [])
      .filter((item) => item?.lat != null && item?.lng != null)
      .map((item) => ({
        id: item._id || item.id || `bulk-${item.createdAt || Math.random()}`,
        lat: Number(item.lat),
        lng: Number(item.lng),
        source: 'Bulk Tree',
        userName:
          orderUserNameById.get(String(item.userId || '')) ||
          orderUserNameById.get(String(item.orderId || '')) ||
          'Unknown User',
        trees: Number(item.count || 0),
        location: item.location || 'Unknown location',
        createdAt: item.createdAt,
      }));

    return [...submissionPins, ...bulkPins];
  }, [submissions, bulkEntries, orderUserNameById]);

  const mapCenter = useMemo(() => {
    const firstPin = mapPins.find((pin) => Number.isFinite(pin.lat) && Number.isFinite(pin.lng));
    if (firstPin) return { lat: firstPin.lat, lng: firstPin.lng };
    return { lat: 22.9734, lng: 78.6569 };
  }, [mapPins]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NgoMetricCard
          icon={TreePine}
          title="Total Trees (Bulk + Orders)"
          value={totalTrees}
          gradient="from-[#b2d8d0] to-white"
        />
        <NgoMetricCard
          icon={Activity}
          title="CO2 Absorption Estimate (kg/year)"
          value={estimatedCO2Kg}
          gradient="from-[#b2d8d0]/80 to-[#d4ebe6]"
        />
        <NgoMetricCard
          icon={CheckCircle}
          title="Total Order Completed"
          value={totalOrderCompleted}
          gradient="from-[#5a9e94] to-[#b2d8d0]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1F2937] mb-2">NGO Map Showcase</h3>
        <p className="text-sm text-gray-500 mb-4">Tree mapping from submission database and bulk tree entries.</p>
        <div className="h-96 rounded-2xl overflow-hidden border border-[#b2d8d0]/30">
          <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
            {mapPins.map((pin) => (
              <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="text-xs">
                    <div className="font-semibold">{pin.source === 'Submission' ? pin.userName : pin.source}</div>
                    <div>{pin.location}</div>
                    <div>{pin.trees} trees</div>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{pin.source === 'Submission' ? pin.userName : pin.source}</div>
                    <div className="text-xs text-gray-600">{pin.location}</div>
                    <div className="text-xs text-gray-600">{pin.trees} trees</div>
                    {pin.createdAt && (
                      <div className="text-xs text-gray-500">{new Date(pin.createdAt).toLocaleString()}</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {mapPins.length === 0 && <div className="mt-3 text-sm text-gray-500">No tree mapping records found yet.</div>}
      </div>
    </div>
  );
};
