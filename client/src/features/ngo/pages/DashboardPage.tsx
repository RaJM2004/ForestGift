import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { Icon, StatCard } from '../../../shared/components/UI';

export type DashboardPageProps = {
  orders: any[];
  submissions: any[];
  bulkEntries: any[];
  activities: any[];
};

export const DashboardPage = ({ orders, submissions, bulkEntries, activities }: DashboardPageProps) => {
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

  // Rough estimate in kg/year.
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
        <StatCard label="Total Trees (Bulk + Orders)" value={totalTrees} icon="tree" colorClass="bg-emerald-50 text-emerald-600" />
        <StatCard label="CO2 Absorption Estimate (kg/year)" value={estimatedCO2Kg} icon="activity" colorClass="bg-blue-50 text-blue-600" />
        <StatCard label="Total Order Completed" value={totalOrderCompleted} icon="check" colorClass="bg-indigo-50 text-indigo-600" />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">NGO Map Showcase</h3>
        <p className="text-sm text-gray-500 mb-4">Tree mapping from submission database and bulk tree entries.</p>
        <div className="h-96 rounded-2xl overflow-hidden">
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

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          {activities.slice(0, 8).map((item) => (
            <li key={item._id || item.time} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon name={item.type === 'report' ? 'reports' : item.type === 'payment' ? 'finance' : item.type === 'token' ? 'tree' : 'activity'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.msg}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </li>
          ))}
          {activities.length === 0 && <li className="text-sm text-gray-500">No recent activity available.</li>}
        </ul>
      </div>
    </div>
  );
};
