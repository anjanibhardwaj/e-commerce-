import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  FileText, 
  AlertCircle,
  UserCheck 
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export default function AdminPrescriptionsPage() {
  const { user } = useAuth();
  const { prescriptions, approvePrescription, rejectPrescription } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewRx, setPreviewRx] = useState(null);
  const [rejectModalRx, setRejectModalRx] = useState(null);
  const [rejectReason, setRejectReason] = useState('Doctor signature illegible or prescription expired');

  const filtered = prescriptions.filter((rx) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = rx.userName?.toLowerCase().includes(q) || rx.patientName?.toLowerCase().includes(q) || rx.id?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && rx.status !== statusFilter) return false;
    return true;
  });

  const handleConfirmReject = (e) => {
    e.preventDefault();
    rejectPrescription(rejectModalRx.id, user?.email || 'admin@example.com', rejectReason);
    setRejectModalRx(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Pharmacist Prescription Review Station</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit patient doctor prescriptions for Schedule H compliance before pharmacy dispensing ({prescriptions.length} uploads)
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient, user, or Rx ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-semibold">Review Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold text-gray-800 p-1.5 rounded-xl border border-gray-300 bg-white"
          >
            <option value="all">All Prescriptions</option>
            <option value="pending_review">Pending Verification (Action Required)</option>
            <option value="approved">Approved &amp; Certified</option>
            <option value="rejected">Rejected Slips</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">Prescription Slip</th>
                  <th className="p-4 font-bold">Patient Details</th>
                  <th className="p-4 font-bold">Prescribing Physician</th>
                  <th className="p-4 font-bold">Linked Order</th>
                  <th className="p-4 font-bold">Clinical Status</th>
                  <th className="p-4 font-bold text-right">Pharmacist Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center space-x-3 min-w-[200px]">
                      <div
                        onClick={() => setPreviewRx(rx)}
                        className="w-12 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group cursor-pointer shrink-0"
                      >
                        <img src={rx.rxImageUrl} alt="Rx" className="w-full h-full object-cover group-hover:scale-110 transition" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-gray-900">{rx.id}</div>
                        <div className="text-[10px] text-gray-400">{formatDateTime(rx.uploadedAt)}</div>
                        <button
                          onClick={() => setPreviewRx(rx)}
                          className="text-[10px] text-teal-700 font-bold hover:underline cursor-pointer"
                        >
                          View Document &rarr;
                        </button>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{rx.patientName || rx.userName}</div>
                      <div className="text-[10px] text-gray-500">Account: {rx.userName}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{rx.doctorName || 'Dr. Certified Physician'}</div>
                      <div className="text-[10px] text-gray-400">{rx.hospitalClinic || 'General Medical Clinic'}</div>
                    </td>

                    <td className="p-4 font-mono font-bold text-gray-900">
                      {rx.orderId ? (
                        <span className="text-teal-800">#{rx.orderId}</span>
                      ) : (
                        <span className="text-gray-400 font-normal">Direct Upload</span>
                      )}
                    </td>

                    <td className="p-4">
                      {rx.status === 'approved' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                        </span>
                      )}
                      {rx.status === 'pending_review' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 mr-1" /> Awaiting Review
                        </span>
                      )}
                      {rx.status === 'rejected' && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3 mr-1" /> Rejected
                        </span>
                      )}
                      {rx.pharmacistNotes && (
                        <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[150px]">
                          {rx.pharmacistNotes}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {rx.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => approvePrescription(rx.id, user?.email || 'admin@example.com')}
                            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer shadow-xs"
                          >
                            Verify &amp; Approve ✓
                          </button>
                          <button
                            onClick={() => setRejectModalRx(rx)}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                          >
                            Reject Rx
                          </button>
                        </>
                      )}

                      {rx.status === 'approved' && (
                        <span className="text-emerald-600 font-bold text-xs">Verified by {rx.reviewedBy || 'Pharmacist'}</span>
                      )}

                      {rx.status === 'rejected' && (
                        <button
                          onClick={() => approvePrescription(rx.id, user?.email || 'admin@example.com')}
                          className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-xl"
                        >
                          Re-approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 text-xs">
            No prescriptions matching current filter.
          </div>
        )}
      </div>

      {/* Prescription Document Modal Preview */}
      {previewRx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Doctor Prescription #{previewRx.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Patient: {previewRx.patientName} • Uploaded: {formatDateTime(previewRx.uploadedAt)}
                </p>
              </div>
              <button
                onClick={() => setPreviewRx(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-center max-h-[500px] overflow-hidden border border-gray-200">
              <img
                src={previewRx.rxImageUrl}
                alt="Doctor Prescription Document"
                className="max-h-[480px] max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 text-xs space-y-1">
              <div><strong>Doctor:</strong> {previewRx.doctorName || 'Dr. Sen, MBBS, MD'}</div>
              <div><strong>Clinic / Hospital:</strong> {previewRx.hospitalClinic || 'Certified Health Center'}</div>
              {previewRx.orderId && <div><strong>Linked Order:</strong> #{previewRx.orderId}</div>}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setPreviewRx(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Close Preview
              </button>
              {previewRx.status === 'pending_review' && (
                <button
                  onClick={() => {
                    approvePrescription(previewRx.id, user?.email || 'admin@example.com');
                    setPreviewRx(null);
                  }}
                  className="px-5 py-2 text-xs font-extrabold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-md"
                >
                  Confirm &amp; Approve Prescription ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalRx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">
              Reject Prescription #{rejectModalRx.id}
            </h3>
            <p className="text-xs text-gray-500">
              State the clinical reason for rejecting this doctor slip. The patient will be notified to re-upload.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Reason for Rejection</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                >
                  <option value="Doctor signature illegible or prescription expired">
                    Doctor signature illegible or prescription expired
                  </option>
                  <option value="Dosage does not match requested medicine strength">
                    Dosage does not match requested medicine strength
                  </option>
                  <option value="Patient name does not match order account">
                    Patient name does not match order account
                  </option>
                  <option value="Restricted Schedule X narcotic without specialized authorization">
                    Restricted Schedule X narcotic without specialized authorization
                  </option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRejectModalRx(null)}
                  className="text-xs text-gray-500 px-3 py-1.5 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
