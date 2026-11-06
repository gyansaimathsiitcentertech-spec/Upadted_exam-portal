import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Plus, Share2, Edit2, Trash2, X } from 'lucide-react';
import { TestSeries } from '../../types';

export const TestSeriesView: React.FC = () => {
  const { testSeries, addTestSeries, updateTestSeries, deleteTestSeries, showToast } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<TestSeries | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPrice, setNewPrice] = useState('99');
  const [newExamsCount, setNewExamsCount] = useState('5');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTestSeries({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Comprehensive mock assessments for entrance examinations.',
      description: newSubtitle.trim() || 'Full-length mocks + chapter tests with All India Ranking.',
      price: parseInt(newPrice) || 99,
      testsCount: parseInt(newExamsCount) || 5,
      testCount: parseInt(newExamsCount) || 5,
      validity: '1 Year',
      category: 'IIT-JEE',
      features: ['All India Rank prediction', 'Real NTA Exam CBT UI', 'Detailed solution analysis'],
      examIds: ['exam-1', 'exam-2'],
      status: 'Active'
    });

    setModalOpen(false);
    showToast(`Test series "${newTitle}" created.`);
  };

  const handleDelete = (ts: TestSeries) => {
    deleteTestSeries(ts.id);
    showToast(`Test series "${ts.title}" removed permanently.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeries) return;
    updateTestSeries(editingSeries.id, {
      title: editingSeries.title,
      subtitle: editingSeries.subtitle,
      description: editingSeries.subtitle,
      price: editingSeries.price,
      testsCount: editingSeries.testsCount,
      testCount: editingSeries.testsCount
    });
    showToast(`Test series "${editingSeries.title}" updated.`);
    setEditingSeries(null);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 476 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // STOREFRONT
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Test Series
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {testSeries.length} published packages
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewTitle('');
            setNewSubtitle('');
            setNewPrice('99');
            setNewExamsCount('5');
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Test Series</span>
        </button>
      </div>

      {/* 3 Cards Grid - Dynamic and Deletable */}
      {testSeries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500">
          No test series available. Click &quot;New Test Series&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testSeries.map(ts => (
            <div
              key={ts.id}
              className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-2xs flex flex-col justify-between hover:border-gray-300 transition"
            >
              <div className="space-y-2.5">
                <div>
                  <span className="px-2 py-0.5 bg-[#002FA7] text-white font-mono text-[10px] font-bold rounded">
                    {ts.status === 'Archived' ? 'ARCHIVED' : 'LIVE'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-950">
                  {ts.title}
                </h3>

                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  {ts.subtitle || ts.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold font-mono text-gray-950">
                    ₹{ts.price}
                  </div>
                  <div className="text-[11px] font-mono text-gray-500">
                    {ts.testsCount || ts.testCount || 3} mock tests
                  </div>
                </div>

                {/* 3 icons: Share, Edit, Delete */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin + `?series=${ts.id}`);
                      showToast('Test series link copied!');
                    }}
                    className="p-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 cursor-pointer shadow-2xs"
                    title="Share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSeries(ts)}
                    className="p-1.5 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 cursor-pointer shadow-2xs"
                    title="Edit test series"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(ts)}
                    className="p-1.5 border border-gray-200 rounded text-red-500 hover:bg-red-50 cursor-pointer shadow-2xs"
                    title="Delete package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Test Series Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Create New Test Series</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12th Full Section Exam"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 25 Full-length mocks + chapter tests with All India Ranking."
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Number of Mocks
                  </label>
                  <input
                    type="number"
                    required
                    value={newExamsCount}
                    onChange={e => setNewExamsCount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold cursor-pointer"
                >
                  Save Test Series
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Test Series Modal */}
      {editingSeries && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Edit Test Series</h3>
              <button type="button" onClick={() => setEditingSeries(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingSeries.title}
                  onChange={e => setEditingSeries({ ...editingSeries, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={editingSeries.subtitle || ''}
                  onChange={e => setEditingSeries({ ...editingSeries, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingSeries.price}
                    onChange={e => setEditingSeries({ ...editingSeries, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Number of Mocks
                  </label>
                  <input
                    type="number"
                    required
                    value={editingSeries.testsCount || editingSeries.testCount || 3}
                    onChange={e => setEditingSeries({ ...editingSeries, testsCount: parseInt(e.target.value) || 1, testCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSeries(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
