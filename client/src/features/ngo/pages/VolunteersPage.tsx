import React, { useMemo, useState } from 'react';
import { Icon } from '../../../shared/components/UI';

export type VolunteersPageProps = {
  submissions: any[];
  ngoData?: any;
};

export const VolunteersPage = ({ submissions, ngoData }: VolunteersPageProps) => {
  const [search, setSearch] = useState('');

  const volunteers = useMemo(() => {
    const grouped: Record<string, any> = {};
    submissions.forEach((sub) => {
      const key = (sub.orderId || sub.id || '').toString();
      if (!key) return;

      if (!grouped[key]) {
        grouped[key] = {
          id: sub.id,
          name: sub.orderId || `Order ${sub.id}`,
          email: `${(sub.orderId || 'user').toString().toLowerCase()}@forestgift.org`,
          trees: 0,
          hours: 0,
          joined_at: sub.createdAt || new Date().toISOString(),
        };
      }

      grouped[key].trees += sub.count ?? 0;

      const timestamp = sub.createdAt ? new Date(sub.createdAt).getTime() : Date.now();
      const hoursSince = Math.floor((Date.now() - timestamp) / 3600000);
      grouped[key].hours = Math.max(grouped[key].hours, hoursSince);
    });

    return Object.values(grouped);
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter((v) => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
  }, [volunteers, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Volunteers</h2>
          <p className="text-sm text-gray-500">Manage your volunteer roster and activity metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search volunteers..."
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

      <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Active Volunteers</div>
            <div className="text-2xl font-black text-gray-900 mt-2">{volunteers.length}</div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total Trees</div>
            <div className="text-2xl font-black text-gray-900 mt-2">{volunteers.reduce((total, v) => total + v.trees, 0)}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total Hours</div>
            <div className="text-2xl font-black text-gray-900 mt-2">{volunteers.reduce((total, v) => total + v.hours, 0)}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Trees</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No volunteers match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((vol) => (
                  <tr key={vol.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">{vol.name}</td>
                    <td className="px-4 py-4">{vol.email}</td>
                    <td className="px-4 py-4">{vol.trees}</td>
                    <td className="px-4 py-4">{vol.hours}</td>
                    <td className="px-4 py-4 text-gray-500">{new Date(vol.joined_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
