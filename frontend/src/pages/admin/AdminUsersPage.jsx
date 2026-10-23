import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import demoUsers from '../../data/demoUsers.json';
import { Users, Search, ShieldCheck, UserX, UserCheck, Star } from 'lucide-react';

export default function AdminUsersPage() {
  const { orders, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState(() => {
    const registered = JSON.parse(localStorage.getItem('med_ecommerce_registered_users') || '[]');
    return [...demoUsers.users, ...registered];
  });

  const handleToggleStatus = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'blocked' ? 'active' : 'blocked';
          showToast(`User ${u.name} status updated to ${nextStatus.toUpperCase()}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const filtered = usersList.filter((u) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Customer Accounts Directory</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage registered patients, monitor VIP Plus tiers, and handle account status
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold">User Profile</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Tier</th>
                <th className="p-4 font-bold">Orders Count</th>
                <th className="p-4 font-bold">Account Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const userOrders = orders.filter((o) => o.userId === u.id || o.userEmail === u.email);
                const isBlocked = u.status === 'blocked';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
                        {u.name ? u.name[0] : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{u.name}</div>
                        <div className="text-[10px] text-gray-400">ID: {u.id}</div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-gray-900">{u.email}</div>
                      <div className="text-[10px] text-gray-500">{u.phone}</div>
                    </td>

                    <td className="p-4">
                      {u.isPlusMember ? (
                        <span className="inline-flex items-center text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                          <Star className="w-3 h-3 fill-amber-500 mr-1" />
                          PLUS VIP
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500">Regular</span>
                      )}
                    </td>

                    <td className="p-4 font-bold text-gray-800">
                      {userOrders.length} order(s)
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isBlocked
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isBlocked ? 'BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-xl transition cursor-pointer ${
                          isBlocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {isBlocked ? 'Activate' : 'Block Access'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
