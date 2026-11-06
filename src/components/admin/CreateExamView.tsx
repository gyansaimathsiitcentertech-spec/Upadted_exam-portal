import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  PlusCircle,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Award,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Calendar,
  RefreshCw,
  Link as LinkIcon
} from 'lucide-react';
import { ExamSection } from '../../types';

export const CreateExamView: React.FC = () => {
  const {
    folders,
    batches,
    questions,
    addExam,
    setActiveAdminTab,
    setActiveExamIdForShare,
    showToast
  } = usePortal();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState(`GYAN-IIT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [folderId, setFolderId] = useState(folders[0]?.id || 'folder-1');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [positiveMarks, setPositiveMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(-1);
  const [passPercentage, setPassPercentage] = useState(40);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(['batch-1']);
  const [isPublic, setIsPublic] = useState(true);

  // Selected question IDs
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(
    questions.slice(0, 4).map(q => q.id)
  );

  const selectedFolder = folders.find(f => f.id === folderId) || folders[0];

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestionIds.length === questions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(questions.map(q => q.id));
    }
  };

  const totalCalculatedMarks = selectedQuestionIds.length * positiveMarks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide an exam title', 'error');
      return;
    }
    if (selectedQuestionIds.length === 0) {
      showToast('Please select at least 1 question for the exam', 'error');
      return;
    }

    const sections: ExamSection[] = [
      {
        id: 'sec-1',
        name: 'General Assessment Section',
        subject: 'IIT-JEE Mathematics & Science',
        questionIds: selectedQuestionIds,
        instructions: `+${positiveMarks} for correct answer, ${negativeMarks} for wrong response.`
      }
    ];

    const selectedQuestionObjects = questions.filter(q => selectedQuestionIds.includes(q.id));

    const origin = typeof window !== 'undefined'
      ? window.location.origin
      : 'https://gyansai-exam-portal.vercel.app';
    const examSlug = code.trim().replace(/[^a-zA-Z0-9_-]/g, '-');
    const shareUrl = `${origin}/?exam=${examSlug}`;

    const createdExam = addExam({
      title: title.trim(),
      code: code.trim(),
      folderId: selectedFolder?.id || 'folder-1',
      folderName: selectedFolder?.name || 'General Tests',
      batchIds: selectedBatchIds,
      durationMinutes: Number(durationMinutes),
      totalMarks: totalCalculatedMarks,
      positiveMarks: Number(positiveMarks),
      negativeMarks: Number(negativeMarks),
      sections,
      questions: selectedQuestionObjects,
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      status: 'Live',
      isPublic,
      publicAccessUrl: shareUrl,
      instructions: [
        'Each question has four options out of which ONLY ONE is correct, or numerical value entry.',
        `For each question, +${positiveMarks} will be awarded for correct and ${negativeMarks} deducted for incorrect response.`,
        'Use question palette on the right to navigate between questions.',
        'Do not refresh or navigate away from the test tab during examination.'
      ],
      passPercentage: Number(passPercentage)
    });

    // Immediately present the unique exam link and share controls
    setActiveExamIdForShare(createdExam.id);
    setActiveAdminTab('Exam Management');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Create Online Examination (CBT Builder)
          </h2>
          <p className="text-[11px] text-slate-500">
            Define exam parameters, question mappings, and scoring configurations
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveAdminTab('Exam Management')}
          className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Exams</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: General Exam Config */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-100 pb-2">
            1. Basic Examination Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. JEE Advanced Full Mock 02 - Mathematics Paper 1"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 font-semibold focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">
                  Unique Exam Code
                </label>
                <button
                  type="button"
                  onClick={() => setCode(`GYAN-IIT-${Math.floor(1000 + Math.random() * 9000)}`)}
                  className="text-[10px] text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Randomize</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().replace(/\s+/g, '-'))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 font-mono font-bold focus:outline-none"
              />
              <div className="mt-1 flex items-center space-x-1 text-[10px] text-slate-500 font-mono truncate">
                <LinkIcon className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                <span className="truncate">/?exam={code.trim() || 'CODE'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Exam Folder / Series
              </label>
              <select
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
              >
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="10"
                max="360"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Qualifying Cut-off %
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={passPercentage}
                onChange={e => setPassPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Default Positive Marks (+4)
              </label>
              <input
                type="number"
                value={positiveMarks}
                onChange={e => setPositiveMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Default Negative Marks (-1)
              </label>
              <input
                type="number"
                value={negativeMarks}
                onChange={e => setNegativeMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-bold text-red-600"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Question Selector */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-bold text-slate-900 uppercase text-xs">
                2. Select Questions from Central Bank
              </h3>
              <p className="text-[11px] text-slate-500">
                Selected: <strong className="text-[#1E3A8A]">{selectedQuestionIds.length} Questions</strong> &bull; Total Max Score: <strong className="text-emerald-700">{totalCalculatedMarks} Marks</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleSelectAllQuestions}
              className="text-[11px] text-[#1E3A8A] font-semibold hover:underline cursor-pointer"
            >
              {selectedQuestionIds.length === questions.length ? 'Deselect All' : 'Select All Questions'}
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isChecked = selectedQuestionIds.includes(q.id);
              return (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuestion(q.id)}
                  className={`p-3 rounded border flex items-start space-x-3 cursor-pointer transition ${
                    isChecked
                      ? 'bg-blue-50/60 border-blue-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent div
                    className="mt-1 rounded text-[#1E3A8A] focus:ring-0"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[#1E3A8A]">{q.code}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-600 font-semibold">
                        {q.subject} &bull; {q.topic}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        ({q.difficulty})
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium mt-1 leading-snug line-clamp-2">
                      {q.questionText}
                    </p>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px] shrink-0">
                    +{q.marksPositive}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Test will be published and available immediately in Student Portal & Public URL.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded shadow-xs text-xs uppercase tracking-wider cursor-pointer transition"
          >
            Publish Online Examination
          </button>
        </div>
      </form>
    </div>
  );
};
