import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Search,
  Trash2,
  Share2,
  Download,
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { ExamAttempt } from '../../types';

export const ResultsRecordingView: React.FC = () => {
  const { attempts, exams, updateAttempt, deleteAttempt, showToast } = usePortal();

  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);
  const [examFilter, setExamFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const displayAttempts = attempts;

  const filtered = displayAttempts.filter(att => {
    const studentMatch = (att.studentName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (att.examTitle || '').toLowerCase().includes(searchText.toLowerCase());
    const examMatch = examFilter === 'All' || att.examTitle === examFilter;
    const statusMatch = statusFilter === 'All' ||
      (att.status || '').toUpperCase().includes(statusFilter.toUpperCase()) ||
      (statusFilter === 'SUBMITTED' && (att.status === 'Submitted' || att.status === 'Evaluated'));
    return studentMatch && examMatch && statusMatch;
  });

  // SCREENSHOT 473: Detailed Attempt & Proctoring Inspector View
  if (selectedAttempt) {
    const scoreVal = selectedAttempt.totalScore !== undefined ? selectedAttempt.totalScore : (selectedAttempt as any).score || 14;
    const maxVal = selectedAttempt.maxScore || 100;
    const accuracyVal = selectedAttempt.accuracy !== undefined ? selectedAttempt.accuracy : 30;
    const rankVal = (selectedAttempt as any).rank || '#1/3';
    const snapshotCount = (selectedAttempt as any).snapshots || 3;

    return (
      <div className="space-y-6 font-sans">
        {/* Top Back navigation & delete */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedAttempt(null)}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to results</span>
          </button>

          <button
            type="button"
            onClick={() => {
              deleteAttempt(selectedAttempt.id);
              setSelectedAttempt(null);
            }}
            className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1 cursor-pointer font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete attempt + recording</span>
          </button>
        </div>

        {/* Heading & Meta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase">
                // ATTEMPT
              </div>
              <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                {selectedAttempt.studentName} — {selectedAttempt.examTitle || 'JEE'}
              </h2>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {selectedAttempt.submittedAt} · manual
              </p>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 border border-gray-200 rounded-sm">
                <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  SCORE
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {scoreVal}/{maxVal}
                </div>
              </div>

              <div className="bg-white p-4 border border-gray-200 rounded-sm">
                <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  RANK
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {rankVal}
                </div>
              </div>

              <div className="bg-white p-4 border border-gray-200 rounded-sm">
                <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  ACCURACY
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {accuracyVal}%
                </div>
              </div>

              <div className="bg-white p-4 border border-gray-200 rounded-sm">
                <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  SNAPSHOTS
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {snapshotCount}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Identity Baseline Card (Exact Screenshot 473) */}
          <div className="lg:col-span-4 bg-white p-4 border border-gray-200 rounded-sm space-y-2">
            <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              IDENTITY BASELINE
            </div>
            <div className="font-bold text-sm text-gray-900">
              {selectedAttempt.studentName}
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              First webcam capture at start of exam.
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              If this face does not match the enrolled student, mark the attempt for review.
            </p>

            <div className="mt-3 w-28 h-28 border border-gray-200 rounded overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Webcam baseline"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* SHARE WITH PARENTS Banner */}
        <div className="bg-white p-5 border border-gray-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-1">
              SHARE WITH PARENTS
            </div>
            <p className="text-xs text-gray-600">
              Send a no-login parent link with score, rank & certificate.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => showToast('Parent scorecard link copied to clipboard!')}
              className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white text-xs font-semibold rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share parent link</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Official candidate scorecard certificate downloaded.')}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Download certificate</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Proctoring Recording & Violations Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Proctoring Recording with webcam snapshot */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 text-xs font-mono font-bold text-gray-600 uppercase tracking-wider">
              PROCTORING RECORDING ({snapshotCount} SNAPSHOTS)
            </div>
            <div className="p-4 bg-gray-900 relative flex items-center justify-center min-h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
                alt="Webcam capture feed"
                className="max-h-[380px] w-full object-cover rounded opacity-85"
              />
              <span className="absolute top-7 right-7 px-2.5 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded">
                baseline
              </span>
            </div>
          </div>

          {/* Right: Violations Log */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-gray-600 uppercase">
                VIOLATIONS LOG (1)
              </div>
              <div className="text-xs text-gray-500 font-mono mt-1">
                Tab switches: 1/30
              </div>
            </div>

            <div className="border-l-2 border-amber-400 pl-3 py-1 space-y-0.5">
              <div className="text-xs font-bold text-gray-900">
                tab switch
              </div>
              <div className="text-[11px] font-mono text-gray-500">
                09:31:37
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREENSHOT 472: Table View
  return (
    <div className="space-y-6 font-sans">
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-2">
          // RECORDINGS & REPORTS
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Results & Recordings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          All student attempts — open any to see the proctoring recording, violations & share with parents.
        </p>
      </div>

      {/* Filter Bar (Exact Screenshot 472) */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <label className="text-gray-500 text-[11px]">Exam</label>
          <select
            value={examFilter}
            onChange={e => setExamFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-800 text-xs"
          >
            <option value="All">All exams</option>
            {exams.map(e => (
              <option key={e.id} value={e.title}>{e.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-500 text-[11px]">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-800 text-xs"
          >
            <option value="All">All</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="TAB SWITCH LIMIT EXCEEDED">TAB SWITCH LIMIT EXCEEDED</option>
          </select>
        </div>

        <div className="flex-1 max-w-sm flex items-center space-x-2">
          <label className="text-gray-500 text-[11px]">Search</label>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Student or exam..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
            />
          </div>
          <button
            type="button"
            className="px-4 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Results Table (Exact Screenshot 472) */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3">STUDENT</th>
                <th className="px-5 py-3">EXAM</th>
                <th className="px-5 py-3">SUBMITTED</th>
                <th className="px-5 py-3">SCORE</th>
                <th className="px-5 py-3">TAB/VIOLATIONS</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3 text-right"></th>
                <th className="px-3 py-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((att: any) => (
                <tr key={att.id} className="hover:bg-gray-50/60 transition">
                  <td className="px-5 py-3.5 text-gray-900">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <span>{att.studentName}</span>
                      {att.isQuickJoin && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded">
                          QUICK JOIN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                      {att.studentCollege ? `${att.studentCollege} · ` : ''}{att.studentRollNo || 'GMI-QJ'}
                      {att.studentPhone ? ` · 📞 ${att.studentPhone}` : ''}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-gray-700">
                    {att.examTitle || att.examCode || 'JEE'}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-gray-500 text-[11px]">
                    {att.submittedAt}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">
                    {att.totalScore !== undefined ? att.totalScore : att.score} / {att.maxScore || 100}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-mono text-[11px]">
                    <span className="flex items-center space-x-1">
                      <span>{att.tabSwitches || '0/30'}</span>
                      {att.tabSwitches && att.tabSwitches.includes('alerts') && (
                        <AlertTriangle className="w-3 h-3 text-amber-500 inline" />
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 bg-[#002FA7] text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded">
                      {att.status || 'SUBMITTED'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAttempt(att)}
                      className="text-xs text-gray-700 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Open &gt;
                    </button>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => deleteAttempt(att.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1 hover:bg-red-50 rounded"
                      title="Delete attempt record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400 font-mono text-xs">
                    No exam attempts or recording logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
