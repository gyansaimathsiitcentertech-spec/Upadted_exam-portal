import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { RotateCw } from 'lucide-react';

export const StudentPurchasesView: React.FC = () => {
  const { setActiveStudentTab, showToast } = usePortal();

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 484 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // ACCOUNT
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            My Purchases
          </h1>
          <p className="text-xs text-gray-500 font-sans mt-1">
            All your payments — pending, approved & rejected.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast('Purchases refreshed.')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs"
        >
          <RotateCw className="w-3.5 h-3.5 text-gray-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Empty State Box - Exact Screenshot 484 */}
      <div className="bg-white border border-gray-200 rounded-sm p-16 flex flex-col items-center justify-center text-center space-y-3 min-h-[360px]">
        <div className="text-3xl text-gray-400 font-mono">
          ₹
        </div>

        <div className="font-bold text-sm text-gray-900">
          No purchases yet
        </div>

        <p className="text-xs text-gray-500 font-sans">
          Browse{' '}
          <button
            type="button"
            onClick={() => setActiveStudentTab('Courses')}
            className="text-blue-700 underline cursor-pointer"
          >
            courses
          </button>{' '}
          or{' '}
          <button
            type="button"
            onClick={() => setActiveStudentTab('Test Series')}
            className="text-blue-700 underline cursor-pointer"
          >
            test series
          </button>{' '}
          to get started.
        </p>
      </div>
    </div>
  );
};
