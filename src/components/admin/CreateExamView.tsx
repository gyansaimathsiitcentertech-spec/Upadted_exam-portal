import React, { useState, useMemo } from 'react';
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
  Search,
  Filter,
  Link as LinkIcon,
  Sparkles,
  Plus
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
  const [targetClass, setTargetClass] = useState<'11th' | '12th' | 'Repeater / Dropper'>('11th');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [positiveMarks, setPositiveMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(-1);
  const [passPercentage, setPassPercentage] = useState(40);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(['batch-1']);
  const [isPublic, setIsPublic] = useState(true);

  // Blank by default: Each exam must have its own deliberately selected question paper
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const selectedFolder = folders.find(f => f.id === folderId) || folders[0];

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSub = subjectFilter === 'All' || q.subject === subjectFilter;
      const term = questionSearch.toLowerCase().trim();
      const matchTerm = !term ||
        q.questionText.toLowerCase().includes(term) ||
        q.code.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term);
      return matchSub && matchTerm;
    });
  }, [questions, subjectFilter, questionSearch]);

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredQuestions.map(q => q.id);
    const allAlreadySelected = filteredIds.every(id => selectedQuestionIds.includes(id));
    if (allAlreadySelected) {
      setSelectedQuestionIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedQuestionIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleAutoSelectClass = (cls: string) => {
    const is12th = cls.includes('12');
    const math = questions.filter(q => (q.subject || '').toLowerCase() === 'mathematics');
    let matches = math.filter(q => is12th ? q.tag?.includes('12th') : q.tag?.includes('11th'));
    if (matches.length === 0) matches = math;
    const picked = matches.slice(0, 8).map(q => q.id);
    setSelectedQuestionIds(prev => Array.from(new Set([...prev, ...picked])));
    showToast(`Selected ${picked.length} Mathematics questions for Class ${cls}.`);
  };

  const handleAutoSelectTopics = () => {
    const relevant = questions.filter(q => {
      const topic = (q.topic || '').toLowerCase();
      const text = (q.questionText || '').toLowerCase();
      return topic.includes('integration') || topic.includes('trigonometry') || text.includes('int') || text.includes('sin') || text.includes('cos');
    });
    const picked = relevant.map(q => q.id);
    setSelectedQuestionIds(prev => Array.from(new Set([...prev, ...picked])));
    showToast(`Selected ${picked.length} Calculus & Trigonometry questions.`);
  };

  const totalCalculatedMarks = selectedQuestionIds.length * positiveMarks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide an examination title', 'error');
      return;
    }
    if (selectedQuestionIds.length === 0) {
      showToast('Please select at least 1 question for the examination', 'error');
      return;
    }

    const sections: ExamSection[] = [
      {
        id: 'sec-1',
        name: 'Mathematics Section',
        subject: 'Mathematics',
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
      targetClass,
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

    // Sync exam and questions to server endpoint for instant mobile QR and link resolution
    try {
      fetch('/api/sync-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createdExam,
          questions: selectedQuestionObjects
        })
      }).catch(() => {});
    } catch {}

    // Immediately present the unique exam link and share controls
    setActiveExamIdForShare(createdExam.id);
    setActiveAdminTab('Exam Management');
    showToast(`Examination "${createdExam.title}" created with ${selectedQuestionIds.length} questions for Class ${targetClass}.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs font-sans">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#002FA7] uppercase mb-0.5">
            // ASSESSMENT BUILDER
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create Online Examination (CBT)
          </h2>
          <p className="text-[11px] text-slate-500 font-mono">
            Define exam parameters, target class, and assign dedicated questions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveAdminTab('Exam Management')}
          className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1 cursor-pointer transition shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Exams</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Exam Details */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4">
          <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-100 pb-2">
            1. Examination Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Examination Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 12th Mathematics Integration & Calculus Unit Test"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#002FA7]"
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
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 font-mono font-bold focus:outline-none focus:border-[#002FA7]"
              />
              <div className="mt-1 flex items-center space-x-1 text-[10px] text-slate-500 font-mono truncate">
                <LinkIcon className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                <span className="truncate">/?exam={code.trim() || 'CODE'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Target Class / Level
              </label>
              <select
                value={targetClass}
                onChange={e => setTargetClass(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
              >
                <option value="11th">Class 11th</option>
                <option value="12th">Class 12th</option>
                <option value="Repeater / Dropper">Repeater / Dropper</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Folder / Series
              </label>
              <select
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
              >
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
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
                Correct Response (Marks +)
              </label>
              <input
                type="number"
                min="1"
                value={positiveMarks}
                onChange={e => setPositiveMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Negative Marking (Penalty -)
              </label>
              <input
                type="number"
                max="0"
                value={negativeMarks}
                onChange={e => setNegativeMarks(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-bold text-red-600"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Dedicated Question Selector */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 uppercase text-xs">
                2. Select Dedicated Questions from Question Bank
              </h3>
              <p className="text-[11px] text-slate-500">
                Selected: <strong className="text-[#002FA7] font-mono text-sm">{selectedQuestionIds.length} Questions</strong> &bull; Total Marks: <strong className="text-emerald-700 font-mono text-sm">{totalCalculatedMarks} Marks</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAutoSelectClass(targetClass)}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#002FA7] border border-blue-200 font-semibold rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                title={`Auto-select 8 questions for Class ${targetClass}`}
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Auto-Pick Class {targetClass} Math (8 Qs)</span>
              </button>

              <button
                type="button"
                onClick={handleAutoSelectTopics}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                title="Auto-select Calculus & Trigonometry questions"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Calculus & Trig</span>
              </button>

              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] cursor-pointer"
              >
                {filteredQuestions.every(q => selectedQuestionIds.includes(q.id)) && filteredQuestions.length > 0
                  ? 'Deselect Filtered'
                  : `Select Filtered (${filteredQuestions.length})`}
              </button>
              {selectedQuestionIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedQuestionIds([])}
                  className="px-2.5 py-1 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded text-[11px] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search & Subject filter toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search questions by topic, code, or question text..."
                value={questionSearch}
                onChange={e => setQuestionSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-500 font-semibold">Subject:</span>
              <select
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono">
                No questions found matching search.
              </div>
            ) : (
              filteredQuestions.map(q => {
                const isChecked = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestion(q.id)}
                    className={`p-3 rounded border flex items-start space-x-3 cursor-pointer transition ${
                      isChecked
                        ? 'bg-blue-50/70 border-blue-300 text-slate-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by parent div
                      className="mt-1 rounded text-[#002FA7] focus:ring-0"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#002FA7]">{q.code}</span>
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
                      {q.imageUrl && (
                        <div className="pt-1.5">
                          <img
                            src={q.imageUrl}
                            alt="Question diagram"
                            className="max-h-28 max-w-xs rounded border border-slate-200 bg-white p-1 object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-emerald-700 font-bold text-[11px] font-mono">
                        +{q.marksPositive}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-50 text-[#002FA7] border border-blue-200'
                      }`}>
                        {isChecked ? (
                          <span>✓ Added</span>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 stroke-[3]" />
                            <span>Add</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Test paper will be isolated to this exam and immediately available via CBT link.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#002FA7] hover:bg-blue-800 text-white font-bold rounded shadow-xs text-xs uppercase tracking-wider cursor-pointer transition"
          >
            Publish Online Examination
          </button>
        </div>
      </form>
    </div>
  );
};
