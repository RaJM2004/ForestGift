import React, { useMemo, useState } from 'react';
import { Badge } from '../../../shared/components/UI';

export type OrdersPageProps = {
  orders: any[];
  submissions: any[];
  onUpdateStatus: (orderId: string, status: string) => void;
};

export const OrdersPage = ({ orders, submissions, onUpdateStatus }: OrdersPageProps) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const id = (o.id || '').toString().toLowerCase();
      const name = (o.name || '').toString().toLowerCase();
      const location = (o.location || o.region || '').toString().toLowerCase();
      return id.includes(q) || name.includes(q) || location.includes(q);
    });
  }, [orders, search]);

  const getOrderSubmissions = (orderId: string) =>
    submissions.filter((s) => (s.orderId || s.order || '').toString() === orderId);

  const getComputedStatus = (order: any) => {
    const subs = getOrderSubmissions(order.id);
    if (subs.length > 0) return 'planted';
    return order.status || 'new';
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'New', color: 'bg-amber-400', value: 10 };
      case 'accepted':
        return { label: 'Accepted', color: 'bg-blue-500', value: 45 };
      case 'shipped':
        return { label: 'Shipped', color: 'bg-indigo-500', value: 75 };
      case 'planted':
        return { label: 'Planted', color: 'bg-emerald-500', value: 100 };
      default:
        return { label: status || 'Unknown', color: 'bg-slate-500', value: 10 };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-sm text-gray-500">Track and manage order status.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="h-10 px-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200"
          />
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-xl border border-gray-200 hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Order#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Trees</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const computedStatus = getComputedStatus(order);
                const progress = getStatusProgress(computedStatus);
                const hasSubmissions = getOrderSubmissions(order.id).length > 0;

                return (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">{order.id}</td>
                    <td className="px-4 py-4">{order.name}</td>
                    <td className="px-4 py-4">{order.tree_count ?? '-'}</td>
                    <td className="px-4 py-4">
                      <Badge status={computedStatus} />
                    </td>
                    <td className="px-4 py-4">{order.region || order.location}</td>
                    <td className="px-4 py-4">
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className={`${progress.color} h-full`} style={{ width: `${progress.value}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{progress.label}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {computedStatus === 'new' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'accepted')}
                          className="text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Accept
                        </button>
                      )}
                      {computedStatus === 'accepted' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'shipped')}
                          className="text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Ship
                        </button>
                      )}
                      {computedStatus === 'shipped' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'planted')}
                          className="text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Submit
                        </button>
                      )}
                      {computedStatus === 'planted' && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          Completed
                        </span>
                      )}
                      {hasSubmissions && computedStatus !== 'planted' && (
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-1">
                          Submission exists
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
