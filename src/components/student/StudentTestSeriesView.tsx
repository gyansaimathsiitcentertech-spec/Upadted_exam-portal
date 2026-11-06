import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { Share2 } from 'lucide-react';

export const StudentTestSeriesView: React.FC = () => {
  const { showToast } = usePortal();

  const testSeriesList = [
    {
      id: 'ts-1',
      title: '12th Full Section Exam',
      description: '25 Full-length mocks + chapter tests with All India Ranking.',
      price: 99,
      mocksCount: '5 mocks'
    },
    {
      id: 'ts-2',
      title: '12th Full 3D Vectore',
      description: '25 Full lenght mock test',
      price: 99,
      mocksCount: '1 mocks'
    },
    {
      id: 'ts-3',
      title: '12TH MHT-CET Full Syllabus exams',
      description: 'MHT-CET Mathematics — Complete Practice Course',
      price: 149,
      mocksCount: '3 mocks'
    }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 483 */}
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
          // MARKETPLACE
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Test Series
        </h1>
        <p className="text-xs text-gray-500 font-sans mt-1">
          Compete with All-India ranks.
        </p>
      </div>

      {/* 3 Cards Grid - Exact Screenshot 483 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testSeriesList.map(ts => (
          <div
            key={ts.id}
            className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 font-mono text-[10px] rounded border border-gray-200">
                Test Series
              </span>

              <h3 className="text-sm font-bold text-gray-950">
                {ts.title}
              </h3>

              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                {ts.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-base font-extrabold font-mono text-gray-950">
                  ₹{ts.price}
                </div>
                <div className="text-[11px] font-mono text-gray-400">
                  {ts.mocksCount}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => showToast('Share link copied!')}
                  className="px-2.5 py-1.5 border border-gray-200 rounded text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-gray-500" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(`Initiating manual UPI payment of ₹${ts.price}...`)}
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold rounded cursor-pointer shadow-2xs transition"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note - Exact Screenshot 483 */}
      <div className="pt-4 text-xs font-mono text-gray-500 leading-relaxed">
        Payment is manual via UPI/bank transfer. After submitting your UTR, admin verifies & unlocks within <span className="font-bold text-gray-800">1 hour</span>.
      </div>
    </div>
  );
};
