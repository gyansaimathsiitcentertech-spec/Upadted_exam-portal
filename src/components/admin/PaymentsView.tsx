import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { RotateCw } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { showToast } = usePortal();

  const [statusFilter, setStatusFilter] = useState('All');

  const [paymentRows, setPaymentRows] = useState([
    {
      id: 'pay-1',
      submitted: '2026-10-13 10:46',
      studentName: 'Advait',
      studentEmail: 'advaitpadhye9gmail.com',
      item: '12TH MHT-CET Full Syllabus exams',
      itemType: 'test_series',
      amount: 149,
      utr: '123456789',
      status: 'SUCCESS',
      actionTimestamp: '✓ 2026-10-13 10:49',
      actionReason: ''
    },
    {
      id: 'pay-2',
      submitted: '2026-08-22 11:00',
      studentName: 'ADAVIT NIRANJAN PADHYE',
      studentEmail: 'Advait',
      item: '12th Full Section Exam',
      itemType: 'test_series',
      amount: 99,
      utr: '123456789',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-22 11:01',
      actionReason: 'triaol'
    },
    {
      id: 'pay-3',
      submitted: '2026-06-18 17:13',
      studentName: 'Gyani',
      studentEmail: 'Gyani',
      item: 'JEE Main 2026 — All India Test Series',
      itemType: 'test_series',
      amount: 4999,
      utr: '1234567890-',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-21 12:37',
      actionReason: 'Not specified'
    },
    {
      id: 'pay-4',
      submitted: '2026-06-17 10:45',
      studentName: 'Kartik',
      studentEmail: 'Kartik',
      item: 'JEE',
      itemType: 'course',
      amount: 1,
      utr: '616875383253',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-21 12:38',
      actionReason: 'Not specified'
    },
    {
      id: 'pay-5',
      submitted: '2026-06-15 19:11',
      studentName: 'Demo Student',
      studentEmail: 'demo',
      item: 'TEST_iter8_e2e_course',
      itemType: 'course',
      amount: 500,
      utr: 'TEST1781530861009IT8',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-21 12:38',
      actionReason: 'Not specified'
    },
    {
      id: 'pay-6',
      submitted: '2026-06-15 18:55',
      studentName: 'Demo Student',
      studentEmail: 'demo',
      item: 'TEST_iter8_e2e_course',
      itemType: 'course',
      amount: 500,
      utr: 'TEST1781529921716IT8',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-21 12:38',
      actionReason: 'Not specified'
    },
    {
      id: 'pay-7',
      submitted: '2026-06-15 18:50',
      studentName: 'Advait01',
      studentEmail: 'Advait01',
      item: 'JEE Main 2026 — All India Test Series',
      itemType: 'test_series',
      amount: 4999,
      utr: '78894984619416481',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-21 12:38',
      actionReason: 'Not specified'
    },
    {
      id: 'pay-8',
      submitted: '2026-06-15 15:27',
      studentName: 'demo1',
      studentEmail: 'demo1',
      item: 'wer',
      itemType: 'test_series',
      amount: 9000,
      utr: '32134567890999\n+ GYAN10',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-08-21 12:38',
      actionReason: 'Not specified'
    },
    {
      id: 'pay-9',
      submitted: '2026-06-15 15:02',
      studentName: 'TEST Pay',
      studentEmail: 'TEST_rej_1781515950391',
      item: 'G-MATH 2026',
      itemType: 'course',
      amount: 200,
      utr: 'REJ1781515951030',
      status: 'REJECTED',
      actionTimestamp: '✕ 2026-06-15 15:02',
      actionReason: 'UTR mismatch'
    }
  ]);

  const handleToggleStatus = (id: string) => {
    setPaymentRows(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'SUCCESS' ? 'REJECTED' : 'SUCCESS';
        return {
          ...p,
          status: nextStatus,
          actionTimestamp: nextStatus === 'SUCCESS' ? '✓ Verified' : '✕ Rejected',
          actionReason: nextStatus === 'SUCCESS' ? '' : 'Payment rejected by admin'
        };
      }
      return p;
    }));
    showToast('Payment status updated.');
  };

  const filtered = paymentRows.filter(p => {
    if (statusFilter === 'All') return true;
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

        {/* Filter Status on Top Right */}
        <div className="flex items-center space-x-2">
          <div className="border border-gray-300 rounded p-1 bg-white flex items-center space-x-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase px-1">
              FILTER STATUS
            </span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs text-gray-800 bg-transparent pr-2 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => showToast('Payment ledger refreshed.')}
            className="p-2 border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table - Exact Screenshot 474 */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
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
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition">
                  {/* Submitted */}
                  <td className="px-5 py-3.5 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                    {row.submitted}
                  </td>

                  {/* Student */}
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-gray-900">{row.studentName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{row.studentEmail}</div>
                  </td>

                  {/* Item */}
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900">{row.item}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{row.itemType}</div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 font-bold font-mono text-gray-900 whitespace-nowrap">
                    ₹ {row.amount}
                  </td>

                  {/* UTR */}
                  <td className="px-5 py-3.5 font-mono text-[11px] text-gray-600 whitespace-pre-line">
                    {row.utr}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded ${
                        row.status === 'SUCCESS' ? 'bg-[#002FA7]' : 'bg-[#D32F2F]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="space-y-1">
                      <div className="font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {row.actionTimestamp}
                      </div>
                      {row.actionReason && (
                        <div className="text-[10px] font-mono text-red-500">
                          {row.actionReason}
                        </div>
                      )}
                      <div>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(row.id)}
                          className="px-2 py-0.5 border border-gray-300 rounded text-[10px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {row.status === 'SUCCESS' ? 'Reject' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
