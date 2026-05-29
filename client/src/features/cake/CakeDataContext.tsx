import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCakeVendorDashboard,
  fetchCakeVendorCustomers,
  type CakeVendorDashboardResponse,
  type CakeVendorDeliveryDto,
} from '../../api';
import { postCakeDeliveryWorkflow, type WorkflowAction } from './api/finance';
import type { DeliveryRequest } from './types/delivery';
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
  runWorkflow: (userId: string, action: WorkflowAction, otp?: string) => Promise<void>;
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
    amount: d.amount,
    status: d.status as DeliveryRequest['status'],
    statusUpdatedAt: d.statusUpdatedAt,
    orderPlacedAt: d.orderPlacedAt,
  };
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

  const runWorkflow = useCallback(
    async (userId: string, action: WorkflowAction, otp?: string) => {
      if (!vendorId) return;
      await postCakeDeliveryWorkflow(vendorId, userId, action, otp);
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
      runWorkflow,
    }),
    [vendorId, vendor, deliveries, summary, loading, error, load, runWorkflow],
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
