import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Sliders, ShieldCheck, Activity, Save, Search, RefreshCw } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export default function AdminSettingsPage() {
  const { auditLogs, showToast } = useData();

  const [commissionRate, setCommissionRate] = useState('8');
  const [deliveryThreshold, setDeliveryThreshold] = useState('499');
  const [supportEmail, setSupportEmail] = useState('compliance@pharmeasy-demo.in');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Platform commission and delivery rules saved!');
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return log.action.toLowerCase().includes(q) || log.details.toLowerCase().includes(q) || log.actor.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-xl font-black text-gray-900">Platform Settings &amp; Compliance Audit Logs</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure marketplace fees, delivery thresholds, and inspect immutable regulatory logs
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
          <Sliders className="w-4 h-4 mr-1.5 text-teal-700" />
          Financial &amp; Delivery Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Marketplace Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Free Delivery Order Threshold (₹)
            </label>
            <input
              type="number"
              min="0"
              value={deliveryThreshold}
              onChange={(e) => setDeliveryThreshold(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Compliance Pharmacist Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-teal-700/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Parameters</span>
          </button>
        </div>
      </form>

      {/* Compliance Audit Trail */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-700" />
              Administrative Audit Log (Regulatory Compliance)
            </h2>
            <p className="text-xs text-gray-500">
              Audit recording for seller verifications, product approvals, and prescription approvals
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-3 font-bold">Timestamp</th>
                <th className="p-3 font-bold">Action Event</th>
                <th className="p-3 font-bold">Action Details</th>
                <th className="p-3 font-bold text-right">Authorized Actor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-3 font-mono text-gray-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-bold text-[10px] bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-gray-800 font-medium">
                    {log.details}
                  </td>
                  <td className="p-3 text-right font-mono text-gray-500">
                    {log.actor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
