import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { RotateCw, Trash2, AlertTriangle, X } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const {
    payments,
    deletePayment,
    togglePaymentStatus,
    clearRejectedPayments,
    resetPaymentsToDefault,
    showToast
  } = usePortal();

  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const filtered = payments.filter(p => {
    const isSuccess = p.status === 'SUCCESS' || p.status === 'Verified' || (p.status as any) === 'Success';
    const isRejected = p.status === 'REJECTED' || p.status === 'Failed';
    if (statusFilter === 'All') return true;
    if (statusFilter === 'SUCCESS') return isSuccess;
    if (statusFilter === 'REJECTED') return isRejected;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 474 */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // PAYMENTS
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Payment Approvals
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Verify UTRs, approve within <span className="font-bold text-gray-800">1 hour</span> to unlock access. Nothing pending — great!
          </p>
        </div>

        {/* Filter Status & Actions on Top Right */}
        <div className="flex flex-wrap items-center gap-2">
          {payments.some(p => p.status === 'REJECTED' || p.status === 'Failed') && (
            <button
              type="button"
              onClick={clearRejectedPayments}
              className="px-2.5 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition"
              title="Clear all rejected payments"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
              <span>Clear Rejected</span>
            </button>
          )}

          <div className="border border-gray-300 rounded p-1 bg-white flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase px-1">
              FILTER STATUS
            </span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs text-gray-800 bg-transparent pr-2 focus:outline-none cursor-pointer"
            >
              <option value="All">All ({payments.length})</option>
              <option value="SUCCESS">
                SUCCESS ({payments.filter(p => p.status === 'SUCCESS' || p.status === 'Verified' || (p.status as any) === 'Success').length})
              </option>
              <option value="REJECTED">
                REJECTED ({payments.filter(p => p.status === 'REJECTED' || p.status === 'Failed').length})
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => showToast('Payment ledger refreshed.')}
            className="p-2 border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition"
            title="Refresh payment records"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table - Exact Screenshot 474 */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3">SUBMITTED</th>
                <th className="px-5 py-3">STUDENT</th>
                <th className="px-5 py-3">ITEM</th>
                <th className="px-5 py-3">AMOUNT</th>
                <th className="px-5 py-3">UTR</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 font-sans">
                    <p className="text-sm font-semibold text-gray-600 mb-1">No payment approvals found</p>
                    <p className="text-xs text-gray-400 mb-4">
                      {statusFilter !== 'All'
                        ? `There are no payment records with status "${statusFilter}".`
                        : 'All payment records have been deleted or cleared.'}
                    </p>
                    <button
                      type="button"
                      onClick={resetPaymentsToDefault}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 cursor-pointer transition inline-flex items-center space-x-1"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Restore Demo Payments</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(row => {
                  const isSuccess = row.status === 'SUCCESS' || row.status === 'Verified' || (row.status as any) === 'Success';
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition">
                      {/* Submitted */}
                      <td className="px-5 py-3.5 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                        {row.submitted || row.date}
                      </td>

                      {/* Student */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900">{row.studentName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{row.studentEmail}</div>
                      </td>

                      {/* Item */}
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900">{row.item || row.itemName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{row.itemType}</div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 font-bold font-mono text-gray-900 whitespace-nowrap">
                        ₹ {row.amount}
                      </td>

                      {/* UTR */}
                      <td className="px-5 py-3.5 font-mono text-[11px] text-gray-600 whitespace-pre-line">
                        {row.utr || row.transactionId || '—'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded ${
                            isSuccess ? 'bg-[#002FA7]' : 'bg-[#D32F2F]'
                          }`}
                        >
                          {isSuccess ? 'SUCCESS' : 'REJECTED'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <div className="font-mono text-[11px] text-gray-500 whitespace-nowrap">
                            {row.actionTimestamp || (isSuccess ? '✓ Verified' : '✕ Pending / Rejected')}
                          </div>
                          {row.actionReason && (
                            <div className="text-[10px] font-mono text-red-500">
                              {row.actionReason}
                            </div>
                          )}
                          <div className="flex items-center space-x-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => togglePaymentStatus(row.id)}
                              className="px-2 py-0.5 border border-gray-300 rounded text-[10px] text-gray-700 hover:bg-gray-50 cursor-pointer font-medium transition"
                            >
                              {isSuccess ? 'Reject' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(row)}
                              className="px-2 py-0.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded text-[10px] flex items-center space-x-1 cursor-pointer font-medium transition"
                              title="Delete this payment approval record"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">
                      Delete Payment Record
                    </h3>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(null)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Are you sure you want to permanently delete this payment approval record?
                  </p>
                  
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1 font-mono">
                    <div>
                      <span className="text-gray-400">Student:</span> <strong className="text-gray-800 font-sans">{deleteTarget.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400">Item:</span> <span className="text-gray-700">{deleteTarget.item || deleteTarget.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span><span className="text-gray-400">Amount:</span> <strong className="text-gray-900">₹{deleteTarget.amount}</strong></span>
                      <span>
                        <span className="text-gray-400">Status:</span>{' '}
                        <span className={deleteTarget.status === 'SUCCESS' || deleteTarget.status === 'Verified' ? 'text-blue-700 font-bold' : 'text-red-600 font-bold'}>
                          {deleteTarget.status}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">UTR:</span> <span className="text-gray-700">{deleteTarget.utr || deleteTarget.transactionId || '—'}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-red-600 mt-2 font-medium">
                    This action will remove the record from your payment ledger and update dashboard revenue immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end items-center space-x-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-white cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePayment(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
