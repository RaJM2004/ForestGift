import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCakeVendorDashboard,
  fetchCakeVendorCustomers,
  patchCakeVendorDelivery,
  type CakeVendorDashboardResponse,
  type CakeVendorDeliveryDto,
  type ServerCakeDeliveryStatus,
} from '../../api';
import type { DeliveryRequest } from './data/mockData';
import { useCakeUser } from './CakeUserContext';

type CakeSummary = CakeVendorDashboardResponse['summary'];
type CakeVendorInfo = CakeVendorDashboardResponse['vendor'];

type CakeDataContextValue = {
  vendorId: string | undefined;
  vendor: CakeVendorInfo | null;
  deliveries: DeliveryRequest[];
  summary: CakeSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateDelivery: (userId: string, uiStatus: DeliveryRequest['status']) => Promise<void>;
};

const CakeDataContext = createContext<CakeDataContextValue | null>(null);

function toDeliveryRequest(d: CakeVendorDeliveryDto): DeliveryRequest {
  return {
    id: d.id,
    orderId: d.orderId,
    recipientName: d.recipientName,
    dob: d.dob,
    phoneNumber: d.phoneNumber,
    deliveryDate: d.deliveryDate,
    deliveryTime: d.deliveryTime,
    location: d.location,
    zoneLocation: d.zoneLocation,
    cakeSize: d.cakeSize,
    cakeFlavor: d.cakeFlavor,
    treeCount: d.treeCount,
    status: d.status as DeliveryRequest['status'],
  };
}

function uiStatusToServer(s: DeliveryRequest['status']): ServerCakeDeliveryStatus {
  const m: Record<DeliveryRequest['status'], ServerCakeDeliveryStatus> = {
    PENDING: 'Ordered',
    ACCEPTED: 'Accepted',
    OUT_FOR_DELIVERY: 'OutForDelivery',
    DELIVERED: 'Delivered',
    REJECTED: 'Rejected',
  };
  return m[s];
}

export function CakeDataProvider({ children }: { children: React.ReactNode }) {
  const { id: vendorId } = useCakeUser();
  const [vendor, setVendor] = useState<CakeVendorInfo | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [summary, setSummary] = useState<CakeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!vendorId) {
      setVendor(null);
      setDeliveries([]);
      setSummary(null);
      setLoading(false);
      setError(
        'Missing vendor id for this session. Log out and sign in with your cake shop email so deliveries can load.',
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [dash, customers] = await Promise.all([
        fetchCakeVendorDashboard(vendorId),
        fetchCakeVendorCustomers(vendorId).catch(() => null),
      ]);
      setVendor(dash.vendor);
      setSummary(dash.summary);
      const rows = customers?.deliveries?.length ? customers.deliveries : dash.deliveries;
      setDeliveries(rows.map(toDeliveryRequest));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
      setVendor(null);
      setDeliveries([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateDelivery = useCallback(
    async (userId: string, uiStatus: DeliveryRequest['status']) => {
      if (!vendorId) return;
      const serverStatus = uiStatusToServer(uiStatus);
      await patchCakeVendorDelivery(vendorId, userId, serverStatus);
      await load();
    },
    [vendorId, load],
  );

  const value = useMemo(
    () => ({
      vendorId,
      vendor,
      deliveries,
      summary,
      loading,
      error,
      refetch: load,
      updateDelivery,
    }),
    [vendorId, vendor, deliveries, summary, loading, error, load, updateDelivery],
  );

  return <CakeDataContext.Provider value={value}>{children}</CakeDataContext.Provider>;
}

export function useCakeData(): CakeDataContextValue {
  const ctx = useContext(CakeDataContext);
  if (!ctx) {
    throw new Error('useCakeData must be used within CakeDataProvider');
  }
  return ctx;
}
