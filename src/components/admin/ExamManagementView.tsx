import React, { useState, useMemo } from 'react';
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
  Search,
  ListPlus,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Filter,
  Check,
  Eye,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Exam, ExamSection, Question } from '../../types';
import { MathText } from '../../utils/mathRenderer';

export const ExamManagementView: React.FC = () => {
  const {
    exams,
    questions,
    setActiveAdminTab,
    setActiveExamIdForShare,
    deleteExam,
    updateExam,
    addExam,
    addQuestion,
    startExamForStudent,
    showToast
  } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Draft'>('All');
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Manage Questions Modal state
  const [managingQuestionsExam, setManagingQuestionsExam] = useState<Exam | null>(null);
  const [selectedQuestionIdsForModal, setSelectedQuestionIdsForModal] = useState<string[]>([]);
  const [modalTab, setModalTab] = useState<'assigned' | 'bank'>('assigned');
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubject, setBankSubject] = useState('All');

  // Inline Create & Attach Question state
  const [showCreateQuestionInline, setShowCreateQuestionInline] = useState(false);
  const [newQImage, setNewQImage] = useState('');
  const [newQTopic, setNewQTopic] = useState('JEE & Entrance Exam Practice');
  const [newQDifficulty, setNewQDifficulty] = useState<'Easy' | 'Moderate' | 'Hard'>('Moderate');
  const [newQCorrectOpt, setNewQCorrectOpt] = useState('A');
  const [newQOptA, setNewQOptA] = useState('Option A');
  const [newQOptB, setNewQOptB] = useState('Option B');
  const [newQOptC, setNewQOptC] = useState('Option C');
  const [newQOptD, setNewQOptD] = useState('Option D');

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

  const handleOpenManageQuestions = (exam: Exam) => {
    setManagingQuestionsExam(exam);
    const existingIds = (exam.sections && exam.sections.length > 0)
      ? exam.sections.flatMap(s => s.questionIds || [])
      : (exam.questions ? exam.questions.map(q => q.id) : []);
    setSelectedQuestionIdsForModal(existingIds);
    setModalTab(existingIds.length === 0 ? 'bank' : 'assigned');
    setBankSearch('');
    setBankSubject('All');
  };

  const handleAutoAssign = (targetClass?: string) => {
    const is12th = targetClass?.includes('12');
    const mathQuestions = questions.filter(q => (q.subject || '').toLowerCase() === 'mathematics');
    let filtered = mathQuestions.filter(q => is12th ? q.tag?.includes('12th') : q.tag?.includes('11th'));
    if (filtered.length === 0) filtered = mathQuestions;
    const pickedIds = filtered.slice(0, 8).map(q => q.id);
    setSelectedQuestionIdsForModal(prev => Array.from(new Set([...prev, ...pickedIds])));
    showToast(`Added ${pickedIds.length} recommended Mathematics questions for Class ${targetClass || '11th'}.`);
  };

  const handleAutoAssignTopics = () => {
    const relevant = questions.filter(q => {
      const topic = (q.topic || '').toLowerCase();
      const text = (q.questionText || '').toLowerCase();
      return topic.includes('integration') || topic.includes('trigonometry') || text.includes('int') || text.includes('sin') || text.includes('cos');
    });
    const pickedIds = relevant.map(q => q.id);
    setSelectedQuestionIdsForModal(prev => Array.from(new Set([...prev, ...pickedIds])));
    showToast(`Added ${pickedIds.length} Calculus & Trigonometry questions.`);
  };

  const handleToggleQuestionInModal = (id: string) => {
    const qObj = questions.find(q => q.id === id || q.code === id);
    const canonicalId = qObj ? qObj.id : id;
    const isCurrentlySelected = selectedQuestionIdsForModal.some(
      currId => currId === canonicalId || (qObj && currId === qObj.code)
    );
    if (isCurrentlySelected) {
      setSelectedQuestionIdsForModal(prev =>
        prev.filter(currId => currId !== canonicalId && (!qObj || currId !== qObj.code))
      );
      showToast(`Removed ${qObj ? `[${qObj.code}]` : 'question'} from selection.`);
    } else {
      setSelectedQuestionIdsForModal(prev => Array.from(new Set([...prev, canonicalId])));
      showToast(`Added ${qObj ? `[${qObj.code}]` : 'question'}! Click "Save & Apply" or use Instant Add.`);
    }
  };

  const handleInstantAddAndSave = (q: Question) => {
    if (!managingQuestionsExam) return;
    const nextSelected = Array.from(new Set([...selectedQuestionIdsForModal, q.id]));
    setSelectedQuestionIdsForModal(nextSelected);

    const allChosen = nextSelected.map(id =>
      questions.find(item => item.id === id || item.code === id) ||
      managingQuestionsExam.questions?.find(item => item.id === id || item.code === id)
    ).filter(Boolean) as Question[];

    const posMarks = managingQuestionsExam.positiveMarks || 4;
    const negMarks = managingQuestionsExam.negativeMarks !== undefined ? managingQuestionsExam.negativeMarks : -1;

    updateExam(managingQuestionsExam.id, {
      sections: [
        {
          id: 'sec-1',
          name: 'Mathematics Section',
          subject: 'Mathematics',
          questionIds: allChosen.map(item => item.id),
          instructions: `+${posMarks} for correct answer, ${negMarks} for wrong response.`
        }
      ],
      questions: allChosen,
      totalMarks: allChosen.length * posMarks
    });

    showToast(`Added [${q.code}] directly to Exam "${managingQuestionsExam.title}"!`);
  };

  const handleRemoveQuestionFromAssigned = (id: string) => {
    setSelectedQuestionIdsForModal(prev => prev.filter(qId => qId !== id));
  };

  const handleImageFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image (PNG, JPG, JPEG).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewQImage(reader.result);
        showToast('Question image attached!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndAttachNewQuestion = () => {
    if (!managingQuestionsExam) return;
    if (!newQImage) {
      showToast('Please upload or attach a question image.', 'error');
      return;
    }

    const created = addQuestion({
      code: `MATH-Q${questions.length + 1}-${Date.now().toString().slice(-4)}`,
      subject: 'Mathematics',
      topic: newQTopic.trim() || 'JEE & Entrance Exam Practice',
      type: 'single_choice',
      difficulty: newQDifficulty,
      tag: 'JEE',
      year: `[${new Date().getFullYear()}]`,
      questionText: 'Refer to the attached image for question details.',
      imageUrl: newQImage,
      options: [
        { id: 'opt-1', label: '(1)', text: newQOptA },
        { id: 'opt-2', label: '(2)', text: newQOptB },
        { id: 'opt-3', label: '(3)', text: newQOptC },
        { id: 'opt-4', label: '(4)', text: newQOptD }
      ],
      correctAnswer: newQCorrectOpt === 'A' ? '(1)' : newQCorrectOpt === 'B' ? '(2)' : newQCorrectOpt === 'C' ? '(3)' : '(4)',
      marksPositive: managingQuestionsExam.positiveMarks || 4,
      marksNegative: managingQuestionsExam.negativeMarks !== undefined ? managingQuestionsExam.negativeMarks : -1,
      explanation: `Correct answer is Option ${newQCorrectOpt}.`
    });

    const nextSelected = Array.from(new Set([...selectedQuestionIdsForModal, created.id]));
    setSelectedQuestionIdsForModal(nextSelected);

    // Save directly to the exam object in real time
    const allChosen = nextSelected.map(id =>
      id === created.id ? created : (questions.find(q => q.id === id || q.code === id) || managingQuestionsExam.questions?.find(q => q.id === id || q.code === id))
    ).filter(Boolean) as Question[];

    updateExam(managingQuestionsExam.id, {
      sections: [
        {
          id: 'sec-1',
          name: 'Mathematics Section',
          subject: 'Mathematics',
          questionIds: allChosen.map(q => q.id),
          instructions: `+${managingQuestionsExam.positiveMarks || 4} for correct answer, ${managingQuestionsExam.negativeMarks || -1} for wrong response.`
        }
      ],
      questions: allChosen,
      totalMarks: allChosen.length * (managingQuestionsExam.positiveMarks || 4)
    });

    showToast(`Question [${created.code}] created and added to Exam "${managingQuestionsExam.title}"!`);

    // Reset inline form
    setNewQImage('');
    setShowCreateQuestionInline(false);
    setModalTab('assigned');
  };

  const handleGenerateSampleQuestions = () => {
    if (!managingQuestionsExam) return;
    const presets = [
      {
        topic: 'Definite Integration',
        text: 'Evaluate \\int_0^\\pi \\frac{x \\sin x}{1 + \\cos^2 x} dx',
        optA: '\\frac{\\pi^2}{4}',
        optB: '\\frac{\\pi^2}{2}',
        optC: '\\pi',
        optD: '2\\pi',
        correct: 'A'
      },
      {
        topic: 'Vectors & 3D Geometry',
        text: 'If \\vec{a}, \\vec{b}, \\vec{c} are unit vectors such that \\vec{a} + \\vec{b} + \\vec{c} = \\vec{0}, find \\vec{a}\\cdot\\vec{b} + \\vec{b}\\cdot\\vec{c} + \\vec{c}\\cdot\\vec{a}',
        optA: '-\\frac{3}{2}',
        optB: '1',
        optC: '0',
        optD: '3',
        correct: 'A'
      },
      {
        topic: 'Coordinate Geometry (Conics)',
        text: 'Find the equation of tangent to the parabola y^2 = 8x at point (2, 4)',
        optA: 'x - y + 2 = 0',
        optB: '2x - y + 1 = 0',
        optC: 'x + y - 6 = 0',
        optD: 'y = 2x',
        correct: 'A'
      },
      {
        topic: 'Differential Calculus',
        text: 'If y = \\tan^{-1}\\left(\\frac{\\sqrt{1+x^2}-1}{x}\\right), find \\frac{dy}{dx}',
        optA: '\\frac{1}{2(1+x^2)}',
        optB: '\\frac{1}{1+x^2}',
        optC: '\\frac{2}{1+x^2}',
        optD: '\\frac{x}{1+x^2}',
        correct: 'A'
      },
      {
        topic: 'Trigonometry & Functions',
        text: 'Find the maximum value of f(x) = 3\\sin x + 4\\cos x + 5',
        optA: '10',
        optB: '12',
        optC: '8',
        optD: '5',
        correct: 'A'
      }
    ];

    const addedIds: string[] = [];
    presets.forEach((p, idx) => {
      const q = addQuestion({
        code: `IIT-Q${questions.length + idx + 1}-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: 'Mathematics',
        topic: p.topic,
        type: 'single_choice',
        difficulty: 'Moderate',
        tag: 'JEE',
        year: `[2026]`,
        questionText: p.text,
        options: [
          { id: 'opt-1', label: '(1)', text: p.optA },
          { id: 'opt-2', label: '(2)', text: p.optB },
          { id: 'opt-3', label: '(3)', text: p.optC },
          { id: 'opt-4', label: '(4)', text: p.optD }
        ],
        correctAnswer: '(1)',
        marksPositive: 4,
        marksNegative: -1,
        explanation: `Standard IIT-JEE result. Correct option is (1).`
      });
      addedIds.push(q.id);
    });

    const nextSelected = Array.from(new Set([...selectedQuestionIdsForModal, ...addedIds]));
    setSelectedQuestionIdsForModal(nextSelected);

    const allChosen = nextSelected.map(id =>
      questions.find(item => item.id === id || item.code === id) ||
      managingQuestionsExam.questions?.find(item => item.id === id || item.code === id)
    ).filter(Boolean) as Question[];

    updateExam(managingQuestionsExam.id, {
      sections: [
        {
          id: 'sec-1',
          name: 'Mathematics Section',
          subject: 'Mathematics',
          questionIds: allChosen.map(item => item.id),
          instructions: `+4 for correct answer, -1 for wrong response.`
        }
      ],
      questions: allChosen,
      totalMarks: allChosen.length * 4
    });

    showToast(`Added 5 new IIT-JEE Mathematics practice questions directly to this exam!`);
    setModalTab('assigned');
  };

  const handleSaveQuestionsToExam = () => {
    if (!managingQuestionsExam) return;
    // Map in exact order and pull latest question object (with imageUrl) from Question Bank
    const chosenQuestions = selectedQuestionIdsForModal.map(id =>
      questions.find(q => q.id === id || q.code === id) ||
      managingQuestionsExam.questions?.find(q => q.id === id || q.code === id)
    ).filter(Boolean) as Question[];

    const posMarks = managingQuestionsExam.positiveMarks || 4;
    const negMarks = managingQuestionsExam.negativeMarks !== undefined ? managingQuestionsExam.negativeMarks : -1;
    const updatedTotalMarks = chosenQuestions.length * posMarks;

    const sections: ExamSection[] = [
      {
        id: 'sec-1',
        name: 'Mathematics Section',
        subject: 'Mathematics',
        questionIds: chosenQuestions.map(q => q.id),
        instructions: `+${posMarks} for correct answer, ${negMarks} for wrong response.`
      }
    ];

    updateExam(managingQuestionsExam.id, {
      sections,
      questions: chosenQuestions,
      totalMarks: updatedTotalMarks
    });

    showToast(`Exam "${managingQuestionsExam.title}" synced with ${chosenQuestions.length} questions.`);
    setManagingQuestionsExam(null);
  };

  const filteredBankQuestions = useMemo(() => {
    const query = bankSearch.toLowerCase().trim();
    return questions.filter(q => {
      const matchSub = bankSubject === 'All' || q.subject === bankSubject;
      const matchSearch = !query ||
        q.questionText.toLowerCase().includes(query) ||
        q.code.toLowerCase().includes(query) ||
        (q.topic && q.topic.toLowerCase().includes(query));
      return matchSub && matchSearch;
    });
  }, [questions, bankSearch, bankSubject]);

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

                    {/* Question Count Interactive Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenManageQuestions(card)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition ${
                          questionsCount === 0
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-blue-50 hover:bg-blue-100 text-[#002FA7] border border-blue-200'
                        }`}
                        title="Click to view and manage questions in this exam"
                      >
                        {questionsCount === 0 ? (
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                        ) : (
                          <FileText className="w-3 h-3 text-[#002FA7]" />
                        )}
                        <span>{questionsCount} Questions {questionsCount === 0 ? '(Click to Add)' : '(View/Add)'}</span>
                      </button>
                      <span className="text-[11px] text-gray-400">&bull;</span>
                      <span className="text-[11px] text-gray-500 font-mono">{card.durationMinutes || 60} mins</span>
                      <span className="text-[11px] text-gray-400">&bull;</span>
                      <span className="text-[11px] text-gray-500 font-mono">{card.examCategory || 'IIT-JEE'}</span>
                    </div>
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
                      <button
                        type="button"
                        onClick={() => handleOpenManageQuestions(card)}
                        className={`font-mono font-bold text-xs mt-0.5 flex items-center space-x-1 cursor-pointer hover:underline ${
                          questionsCount === 0 ? 'text-amber-700 font-extrabold' : 'text-[#002FA7]'
                        }`}
                        title="Click to manage questions"
                      >
                        <span>{questionsCount} Qs</span>
                        <ListPlus className="w-3 h-3" />
                      </button>
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
                  {/* Top Action: Manage & + Add Questions Buttons */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenManageQuestions(card)}
                      className={`flex-1 py-2 px-2.5 rounded flex items-center justify-center space-x-1.5 cursor-pointer font-bold transition text-xs shadow-2xs ${
                        questionsCount === 0
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002FA7]'
                      }`}
                      title="View questions currently in this exam"
                    >
                      <ListPlus className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{questionsCount === 0 ? '0 Questions' : `${questionsCount} Questions`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleOpenManageQuestions(card);
                        setModalTab('bank');
                      }}
                      className="py-2 px-3 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-xs transition active:scale-95 flex-shrink-0"
                      title="Quick add questions from question bank"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Add Questions</span>
                    </button>
                  </div>

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
                        className="py-1 px-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                        title="Preview & Test CBT"
                      >
                        <Play className="w-3 h-3 text-emerald-700" />
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

      {/* Manage Exam Questions Modal */}
      {managingQuestionsExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden font-sans text-xs">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#002FA7] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    // EXAM QUESTION PAPER
                  </span>
                  <span className="font-mono text-xs text-gray-500">
                    Code: <strong>{managingQuestionsExam.code}</strong>
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-gray-950 mt-1">
                  {managingQuestionsExam.title}
                </h2>
                <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                  Class: {managingQuestionsExam.targetClass || '11th'} &bull; Duration: {managingQuestionsExam.durationMinutes || 60} mins &bull; Folder: {managingQuestionsExam.folderName || 'Assessments'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManagingQuestionsExam(null)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stat Pill Bar */}
            <div className="px-6 py-2.5 bg-blue-50/60 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-gray-600">
                  Questions Assigned: <strong className="font-mono text-sm text-[#002FA7]">{selectedQuestionIdsForModal.length}</strong>
                </span>
                <span className="text-gray-400">&bull;</span>
                <span className="text-gray-600">
                  Total Marks: <strong className="font-mono text-sm text-emerald-700">{selectedQuestionIdsForModal.length * (managingQuestionsExam.positiveMarks || 4)}</strong>
                </span>
                <span className="text-gray-400">&bull;</span>
                <span className="text-gray-500 font-mono text-[11px]">
                  Scheme: +{managingQuestionsExam.positiveMarks || 4} / {managingQuestionsExam.negativeMarks || -1}
                </span>
              </div>

              {/* Quick One-Click Auto-Assign Shortcuts */}
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleAutoAssign(managingQuestionsExam.targetClass)}
                  className="px-2.5 py-1 bg-white border border-blue-300 hover:bg-blue-100 text-[#002FA7] font-semibold text-[11px] rounded flex items-center space-x-1 cursor-pointer shadow-2xs"
                  title="Auto-assign recommended Mathematics questions for this class"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Auto-Assign Class {managingQuestionsExam.targetClass || '11th'} Math (8 Qs)</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoAssignTopics}
                  className="px-2.5 py-1 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-semibold text-[11px] rounded flex items-center space-x-1 cursor-pointer shadow-2xs"
                  title="Auto-assign Calculus & Trigonometry questions"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>Calculus & Trig</span>
                </button>
              </div>
            </div>

            {/* Tabs Row with prominent + Add More Questions Button */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-6 pt-2 bg-white gap-2">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setModalTab('assigned')}
                  className={`pb-2.5 px-3 font-bold flex items-center space-x-1.5 cursor-pointer border-b-2 transition ${
                    modalTab === 'assigned'
                      ? 'border-[#002FA7] text-[#002FA7]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Assigned Questions ({selectedQuestionIdsForModal.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('bank')}
                  className={`pb-2.5 px-3 font-bold flex items-center space-x-1.5 cursor-pointer border-b-2 transition ${
                    modalTab === 'bank'
                      ? 'border-[#002FA7] text-[#002FA7]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  <span>Browse & Add from Question Bank ({filteredBankQuestions.length})</span>
                </button>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateQuestionInline(prev => !prev)}
                  className="mb-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-md flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
                  title="Create a new question and attach directly to this exam"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Create Question with Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalTab('bank');
                    setShowCreateQuestionInline(false);
                  }}
                  className={`mb-1.5 px-3 py-1.5 border font-bold text-xs rounded-md flex items-center space-x-1.5 cursor-pointer shadow-xs transition ${
                    modalTab === 'bank'
                      ? 'bg-blue-50 border-[#002FA7] text-[#002FA7]'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  title="Add more questions from question bank"
                >
                  <ListPlus className="w-4 h-4" />
                  <span>Browse Bank ({filteredBankQuestions.length})</span>
                </button>
              </div>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
              {/* Inline Create & Attach Question Form */}
              {showCreateQuestionInline && (
                <div className="bg-white border-2 border-[#002FA7] rounded-xl p-5 shadow-lg space-y-4 mb-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#002FA7] text-white flex items-center justify-center font-bold text-xs">
                        +
                      </span>
                      <h3 className="font-extrabold text-sm text-gray-900">
                        Create & Attach Question to this Exam
                      </h3>
                      <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">
                        (Saves to Question Bank & automatically adds to this exam paper)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCreateQuestionInline(false)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Question Diagram / Image Upload */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                          <span>Upload Question Diagram / Problem Image (PNG, JPG):</span>
                          <span className="text-[10px] text-[#002FA7] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Required</span>
                        </label>
                        {newQImage ? (
                          <div className="p-3 border-2 border-blue-300 bg-blue-50/60 rounded-xl flex items-center justify-between shadow-2xs">
                            <div className="flex items-center space-x-3">
                              <img src={newQImage} alt="Uploaded problem diagram" className="h-20 w-28 object-contain rounded-lg border border-gray-300 bg-white p-1 shadow-2xs" />
                              <div>
                                <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                                  <span>✓ Question Image Attached</span>
                                </span>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  This diagram will be displayed as the question problem.
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNewQImage('')}
                              className="px-3 py-1.5 text-red-600 hover:bg-red-100 rounded-md text-xs font-bold cursor-pointer transition"
                            >
                              Replace Image
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-blue-300 hover:border-[#002FA7] rounded-xl p-6 text-center bg-blue-50/30 hover:bg-blue-50/60 transition group cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              id="inline-q-img-upload"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageFileChange(e.target.files[0]);
                                }
                              }}
                            />
                            <label htmlFor="inline-q-img-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-[#002FA7] text-[#002FA7] group-hover:text-white flex items-center justify-center transition shadow-2xs">
                                <Upload className="w-6 h-6" />
                              </div>
                              <div>
                                <span className="text-sm font-extrabold text-[#002FA7]">
                                  Click or Drag & Drop Question Image Here
                                </span>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  Upload screenshot or diagram containing the full math problem
                                </p>
                              </div>
                              <span className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] font-mono rounded">
                                Supports PNG, JPG, JPEG
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Options & Key */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Topic / Chapter:
                        </label>
                        <input
                          type="text"
                          value={newQTopic}
                          onChange={e => setNewQTopic(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs"
                          placeholder="e.g. Calculus / Coordinate Geometry"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800">
                          Options & Correct Answer Key:
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {(['A', 'B', 'C', 'D'] as const).map(letter => {
                            const val = letter === 'A' ? newQOptA : letter === 'B' ? newQOptB : letter === 'C' ? newQOptC : newQOptD;
                            const setVal = letter === 'A' ? setNewQOptA : letter === 'B' ? setNewQOptB : letter === 'C' ? setNewQOptC : setNewQOptD;
                            const isKey = newQCorrectOpt === letter;
                            return (
                              <div
                                key={letter}
                                className={`p-1.5 border rounded flex items-center space-x-1.5 ${
                                  isKey ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 bg-white'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => setNewQCorrectOpt(letter)}
                                  className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 cursor-pointer ${
                                    isKey ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                                  }`}
                                  title="Click to set as correct answer key"
                                >
                                  {letter}
                                </button>
                                <input
                                  type="text"
                                  value={val}
                                  onChange={e => setVal(e.target.value)}
                                  className="w-full bg-transparent border-0 text-xs text-gray-900 focus:outline-none"
                                  placeholder={`Option ${letter}`}
                                />
                                {isKey && <span className="text-[10px] text-emerald-700 font-bold shrink-0">Key</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCreateQuestionInline(false)}
                      className="px-3 py-1.5 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveAndAttachNewQuestion}
                      className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white font-extrabold rounded cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Add to Exam Immediately</span>
                    </button>
                  </div>
                </div>
              )}

              {modalTab === 'assigned' ? (
                /* Tab 1: Assigned Questions View */
                selectedQuestionIdsForModal.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-amber-300 rounded-lg p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">
                        0 Questions Currently Assigned
                      </h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                        This examination has no questions linked to it yet. Students attempting this test will see an empty question paper.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateQuestionInline(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>+ Create Question with Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAutoAssign(managingQuestionsExam.targetClass)}
                        className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-bold rounded flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Auto-Assign 8 Class {managingQuestionsExam.targetClass || '11th'} Math Questions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalTab('bank')}
                        className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ListPlus className="w-4 h-4" />
                        <span>Browse Question Bank Manually</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs gap-2">
                      <span className="font-medium">
                        Showing <strong className="text-gray-900 font-mono text-xs">{selectedQuestionIdsForModal.length} questions</strong> attached to this exam:
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setModalTab('bank')}
                          className="px-3 py-1 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center space-x-1 cursor-pointer shadow-2xs transition"
                          title="Browse Question Bank to add more questions"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>+ Add Questions</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedQuestionIdsForModal([])}
                          className="text-red-600 hover:underline font-semibold cursor-pointer text-[11px] px-1"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {selectedQuestionIdsForModal.map((qId, index) => {
                      const q = questions.find(item => item.id === qId || item.code === qId) ||
                                managingQuestionsExam?.questions?.find(item => item.id === qId || item.code === qId);
                      if (!q) {
                        return (
                          <div key={qId} className="p-3 bg-white border border-gray-200 rounded flex items-center justify-between">
                            <span className="font-mono text-gray-500">Q{index + 1}. [Question ID: {qId}]</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestionFromAssigned(qId)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div key={q.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="w-6 h-6 rounded bg-[#002FA7] text-white flex items-center justify-center font-bold text-xs">
                                {index + 1}
                              </span>
                              <span className="font-mono text-xs font-bold text-gray-800">
                                [{q.code}]
                              </span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[10px]">
                                {q.topic || 'General'}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {q.subject || 'Mathematics'} &bull; Level: {q.difficulty || 'IIT'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveQuestionFromAssigned(q.id)}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded flex items-center space-x-1 cursor-pointer transition"
                              title="Remove this question from exam"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="text-[11px] font-semibold">Remove</span>
                            </button>
                          </div>

                          <div className="text-gray-900 font-medium text-xs leading-relaxed pl-8">
                            <MathText text={q.questionText} />
                          </div>

                          {q.imageUrl && (
                            <div className="pl-8 py-2">
                              <img
                                src={q.imageUrl}
                                alt={`Question ${index + 1} Diagram`}
                                className="max-h-56 max-w-full rounded-lg border border-gray-300 p-1.5 bg-white object-contain shadow-2xs"
                              />
                            </div>
                          )}

                          {q.formulaNote && (
                            <div className="ml-8 p-2 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-900 font-mono">
                              <strong>Formula:</strong> <MathText text={q.formulaNote} />
                            </div>
                          )}

                          {q.options && q.options.length > 0 && (
                            <div className="ml-8 grid grid-cols-2 gap-2 pt-1 text-[11px]">
                              {q.options.map((opt: any) => {
                                const isCorrect = q.correctAnswer === opt.label;
                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-2 rounded border flex items-center justify-between ${
                                      isCorrect
                                        ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950'
                                        : 'bg-slate-50 border-gray-200 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-1.5">
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                                      }`}>
                                        {opt.label}
                                      </span>
                                      <span><MathText text={opt.text} /></span>
                                    </div>
                                    {isCorrect && (
                                      <span className="text-[10px] font-mono font-bold text-emerald-700">✓ Key</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Prominent + Add More Questions Card at bottom of assigned list */}
                    {/* Prominent + Add More Questions Card at bottom of assigned list */}
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 border-2 border-dashed border-[#002FA7]/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center space-x-3 text-left">
                        <div className="w-11 h-11 rounded-full bg-[#002FA7] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                          <Plus className="w-6 h-6 stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm flex items-center space-x-2">
                            <span>+ Add More Questions to this Exam</span>
                          </h4>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            Create a new question with diagram/formula image, or browse questions from Question Bank.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCreateQuestionInline(true)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow-xs cursor-pointer transition whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>+ Create Question with Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModalTab('bank')}
                          className="px-3.5 py-2 bg-[#002FA7] hover:bg-blue-800 active:scale-95 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow-xs cursor-pointer transition whitespace-nowrap"
                        >
                          <ListPlus className="w-3.5 h-3.5" />
                          <span>Browse Question Bank</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* Tab 2: Question Bank Selector */
                <div className="space-y-3">
                  {/* Quick Action Bar for Adding Questions */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 border border-blue-200 rounded-lg flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-950 flex items-center space-x-1.5">
                        <span>Add Questions to Exam:</span>
                      </h4>
                      <p className="text-[11px] text-gray-600">
                        Create custom questions with diagrams or generate 5 IIT-JEE questions in 1-click.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateQuestionInline(true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-md flex items-center space-x-1 cursor-pointer shadow-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>+ Create Question with Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateSampleQuestions}
                        className="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-100 text-[#002FA7] font-bold text-xs rounded-md flex items-center space-x-1 cursor-pointer shadow-2xs transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>+ Generate 5 More IIT-JEE Questions</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex-1 min-w-[200px] relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search questions by topic, code, or question text..."
                          value={bankSearch}
                          onChange={e => setBankSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#002FA7]"
                        />
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-gray-500 font-semibold text-[11px]">Subject:</span>
                        <select
                          value={bankSubject}
                          onChange={e => setBankSubject(e.target.value)}
                          className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs"
                        >
                          <option value="All">All Subjects</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const bankIds = filteredBankQuestions.map(q => q.id);
                          const allSelected = bankIds.every(id => selectedQuestionIdsForModal.includes(id));
                          if (allSelected) {
                            setSelectedQuestionIdsForModal(prev => prev.filter(id => !bankIds.includes(id)));
                          } else {
                            setSelectedQuestionIdsForModal(prev => Array.from(new Set([...prev, ...bankIds])));
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded font-semibold text-[11px] cursor-pointer"
                      >
                        {filteredBankQuestions.every(q => selectedQuestionIdsForModal.includes(q.id)) && filteredBankQuestions.length > 0
                          ? 'Deselect Filtered'
                          : `Select All Filtered (${filteredBankQuestions.length})`}
                      </button>
                    </div>
                  </div>

                  {/* Question Checklist */}
                  <div className="space-y-2">
                    {filteredBankQuestions.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 font-mono bg-white rounded border border-gray-200">
                        No questions found matching your search.
                      </div>
                    ) : (
                      filteredBankQuestions.map(q => {
                        const isChecked = selectedQuestionIdsForModal.includes(q.id);
                        return (
                          <div
                            key={q.id}
                            onClick={() => handleToggleQuestionInModal(q.id)}
                            className={`p-3.5 rounded-lg border flex items-start space-x-3 cursor-pointer transition ${
                              isChecked
                                ? 'bg-blue-50/80 border-blue-300 text-gray-900 shadow-2xs'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent div
                              className="mt-1 rounded text-[#002FA7] focus:ring-0 cursor-pointer"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold text-gray-900">
                                  [{q.code}]
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {q.topic || 'General Practice'}
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  &bull; {q.subject || 'Mathematics'} &bull; +{q.marksPositive || 4} Marks
                                </span>
                              </div>
                              <div className="text-gray-800 text-xs font-medium">
                                <MathText text={q.questionText} />
                              </div>

                              {q.imageUrl && (
                                <div className="pt-2 pb-1">
                                  <img
                                    src={q.imageUrl}
                                    alt={`Question ${q.code} diagram`}
                                    className="max-h-48 max-w-full rounded border border-gray-300 bg-white object-contain p-1 shadow-2xs"
                                  />
                                </div>
                              )}

                              {q.formulaNote && (
                                <div className="text-[11px] font-mono text-blue-800 bg-blue-50/70 px-2 py-1 rounded border border-blue-200">
                                  💡 Formula: <MathText text={q.formulaNote} />
                                </div>
                              )}
                            </div>
                            {isChecked ? (
                              <div className="flex items-center space-x-1 shrink-0">
                                <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-2xs">
                                  In Exam ✓
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleQuestionInModal(q.id);
                                  }}
                                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[10px] font-bold cursor-pointer transition"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInstantAddAndSave(q);
                                }}
                                className="px-3 py-1.5 rounded text-[11px] font-bold flex items-center space-x-1 shrink-0 bg-[#002FA7] hover:bg-blue-800 text-white shadow-xs cursor-pointer active:scale-95 transition"
                                title="Add to exam paper and save immediately"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>+ Add to Exam</span>
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="text-xs text-gray-600">
                  Total: <strong className="font-mono text-sm text-[#002FA7]">{selectedQuestionIdsForModal.length} Questions</strong> will be saved to this exam paper.
                </div>
                {modalTab === 'assigned' && (
                  <button
                    type="button"
                    onClick={() => setModalTab('bank')}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002FA7] rounded font-bold text-xs flex items-center space-x-1 cursor-pointer transition shadow-2xs"
                    title="Add more questions from question bank"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+ Add More Questions</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setManagingQuestionsExam(null)}
                  className="px-4 py-2 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveQuestionsToExam}
                  className="px-5 py-2 bg-[#002FA7] hover:bg-blue-800 active:scale-[0.99] text-white font-extrabold rounded cursor-pointer shadow-md flex items-center space-x-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Apply to Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
