import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Plus,
  Users,
  Edit2,
  Share2,
  Copy,
  BarChart3,
  Trash2,
  X,
  Play,
  Search
} from 'lucide-react';
import { Exam } from '../../types';

export const ExamManagementView: React.FC = () => {
  const {
    exams,
    setActiveAdminTab,
    setActiveExamIdForShare,
    deleteExam,
    updateExam,
    addExam,
    startExamForStudent,
    showToast
  } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Draft'>('All');
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Filter exams based on search and status
  const filteredExams = exams.filter(e => {
    const matchesSearch = (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.code || '').toLowerCase().includes(searchQuery.toLowerCase());
    const isLive = e.status === 'Live' || e.status === 'Active' || e.status === 'Published';
    const matchesStatus = statusFilter === 'All'
      ? true
      : statusFilter === 'Live'
      ? isLive
      : !isLive;
    return matchesSearch && matchesStatus;
  });

  const liveCount = exams.filter(e => e.status === 'Live' || e.status === 'Active' || e.status === 'Published').length;

  const handleClone = (exam: Exam) => {
    const cloned = addExam({
      title: `${exam.title} (Clone)`,
      code: `${exam.code}-COPY`,
      folderId: exam.folderId,
      folderName: exam.folderName,
      batchIds: exam.batchIds || [],
      durationMinutes: exam.durationMinutes,
      totalMarks: exam.totalMarks,
      positiveMarks: exam.positiveMarks,
      negativeMarks: exam.negativeMarks,
      sections: exam.sections || [],
      startTime: exam.startTime,
      endTime: exam.endTime,
      status: 'Live',
      isPublic: exam.isPublic,
      publicAccessUrl: exam.publicAccessUrl,
      instructions: exam.instructions,
      passPercentage: exam.passPercentage,
      targetClass: exam.targetClass || '11th',
      examCategory: exam.examCategory || 'JEE'
    });
    showToast(`Exam cloned as "${cloned.title}".`);
  };

  const handleTogglePublish = (exam: Exam) => {
    const isLive = exam.status === 'Live' || exam.status === 'Active' || exam.status === 'Published';
    const nextStatus = isLive ? 'Draft' : 'Live';
    updateExam(exam.id, { status: nextStatus });
    showToast(`Exam "${exam.title}" ${isLive ? 'unpublished (moved to Draft)' : 'published (now Live)'}.`);
  };

  const handleDelete = (exam: Exam) => {
    deleteExam(exam.id);
    showToast(`Exam "${exam.title}" deleted.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam) return;
    updateExam(editingExam.id, {
      title: editingExam.title,
      durationMinutes: editingExam.durationMinutes,
      targetClass: editingExam.targetClass,
      folderName: editingExam.folderName
    });
    showToast(`Exam "${editingExam.title}" updated.`);
    setEditingExam(null);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // ASSESSMENTS
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Exam Management
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {exams.length} exams · {liveCount} live
          </p>
        </div>

        {/* Action Button Top Right */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveAdminTab('Create Exam')}
            className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      {/* Clean Search & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search exams by title or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-[#002FA7]"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['All', 'Live', 'Draft'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                statusFilter === tab
                  ? 'bg-[#002FA7] text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Exam Cards Grid - Dynamic and Deletable */}
      {filteredExams.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500">
          No exams found in this folder. Click &quot;Create Exam&quot; to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map(card => {
            const isLive = card.status === 'Live' || card.status === 'Active' || card.status === 'Published';
            const questionsCount = card.sections?.reduce((sum, s) => sum + s.questionIds.length, 0) || card.questions?.length || 0;
            const studentsCount = (card.batchIds && card.batchIds.length > 0) ? card.batchIds.length * 36 : 74;

            return (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-2xs flex flex-col justify-between hover:border-gray-300 transition"
              >
                <div className="space-y-3">
                  {/* Badges row */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 font-mono text-[10px] font-bold rounded ${
                        isLive ? 'bg-[#002FA7] text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {card.status ? card.status.toUpperCase() : 'LIVE'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-mono text-[10px] rounded border border-gray-200">
                      {card.targetClass || '11th'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-mono text-[10px] rounded border border-gray-200 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>{studentsCount}</span>
                    </span>
                  </div>

                  {/* Title & Folder name */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-950">
                        {card.title}
                      </h3>
                      <span className="font-mono text-[10px] font-bold text-[#002FA7] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">
                        {card.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      {questionsCount} Questions &bull; {card.durationMinutes || 60} mins &bull; {card.examCategory || 'IIT-JEE'}
                    </p>
                  </div>

                  {/* 3 Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100 text-[11px]">
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                        TYPE
                      </div>
                      <div className="font-mono text-gray-800 mt-0.5">
                        mock
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                        DURATION
                      </div>
                      <div className="font-mono text-gray-800 mt-0.5">
                        {card.durationMinutes} min
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                        QUESTIONS
                      </div>
                      <div className="font-mono text-gray-800 mt-0.5">
                        {questionsCount}
                      </div>
                    </div>
                  </div>

                  {card.startTime && (
                    <div className="text-[11px] font-mono text-gray-500 flex items-center space-x-1 pt-1">
                      <span>↗</span>
                      <span>Opens: {card.startTime.replace('T', ' ')}</span>
                    </div>
                  )}
                </div>

                {/* Actions Grid */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditingExam(card)}
                      className="py-1.5 px-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-gray-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePublish(card)}
                      className="py-1.5 px-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-center cursor-pointer font-medium"
                    >
                      {isLive ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveExamIdForShare(card.id)}
                      className="py-1.5 px-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Share2 className="w-3 h-3 text-gray-500" />
                      <span>Share</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleClone(card)}
                      className="py-1.5 px-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                      <span>Clone</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveAdminTab('Results & Recording')}
                        className="py-1 px-2.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center space-x-1 text-xs cursor-pointer"
                      >
                        <BarChart3 className="w-3 h-3 text-gray-500" />
                        <span>Analytics</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => startExamForStudent(card.id)}
                        className="py-1 px-2.5 bg-blue-50 border border-blue-200 text-[#002FA7] hover:bg-blue-100 rounded flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                        title="Preview & Test CBT"
                      >
                        <Play className="w-3 h-3 text-[#002FA7]" />
                        <span>Test CBT</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(card)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Exam Modal */}
      {editingExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Edit Exam Details</h3>
              <button
                type="button"
                onClick={() => setEditingExam(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Exam Title
                </label>
                <input
                  type="text"
                  required
                  value={editingExam.title}
                  onChange={e => setEditingExam({ ...editingExam, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingExam.durationMinutes}
                    onChange={e => setEditingExam({ ...editingExam, durationMinutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target Class
                  </label>
                  <select
                    value={editingExam.targetClass || '11th'}
                    onChange={e => setEditingExam({ ...editingExam, targetClass: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                  >
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="Repeater">Repeater</option>
                    <option value="Foundation">Foundation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={editingExam.folderName}
                  onChange={e => setEditingExam({ ...editingExam, folderName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingExam(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold rounded cursor-pointer"
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
