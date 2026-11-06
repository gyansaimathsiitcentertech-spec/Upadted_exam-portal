import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Upload,
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Save,
  Check,
  Image as ImageIcon,
  Folder,
  Zap,
  Key
} from 'lucide-react';
import { Question } from '../../types';

export const QuestionBankView: React.FC = () => {
  const {
    questions,
    folders,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setCreateFolderModalOpen,
    setCreateQuestionModalOpen,
    showToast
  } = usePortal();

  const [subjectFilter, setSubjectFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [folderFilter, setFolderFilter] = useState('All folders');
  const [searchText, setSearchText] = useState('');

  // Modals state
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePdfImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate OCR question extraction
    showToast(`Analyzing "${file.name}" with OCR pipeline...`);
    setTimeout(() => {
      addQuestion({
        code: `IMP-${Date.now().toString().slice(-4)}`,
        subject: 'Mathematics',
        topic: 'Imported from ' + file.name,
        type: 'single_choice',
        difficulty: 'Moderate',
        questionText: `[Imported from ${file.name}] If f(x) is a continuous function satisfying f(x) + f(2 - x) = 4, then find ∫[0 to 2] f(x) dx.`,
        tag: 'JEE',
        year: '[2024]',
        options: [
          { id: 'opt-1', label: '(1)', text: '4' },
          { id: 'opt-2', label: '(2)', text: '8' },
          { id: 'opt-3', label: '(3)', text: '2' },
          { id: 'opt-4', label: '(4)', text: '0' }
        ],
        correctAnswer: '(1)',
        marksPositive: 4,
        marksNegative: -1,
        explanation: 'Using King\'s property, 2I = ∫[0 to 2] 4 dx = 8 => I = 4.'
      });
      showToast(`Successfully extracted and added questions from ${file.name}`);
    }, 1000);
  };

  const handleDelete = (q: Question) => {
    deleteQuestion(q.id);
    showToast('Question deleted from Question Bank.');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    updateQuestion(editingQuestion.id, {
      questionText: editingQuestion.questionText,
      subject: editingQuestion.subject,
      topic: editingQuestion.topic,
      marksPositive: editingQuestion.marksPositive,
      marksNegative: editingQuestion.marksNegative,
      imageUrl: editingQuestion.imageUrl
    });
    showToast('Question updated successfully.');
    setEditingQuestion(null);
  };

  // Filtered list
  const filteredQuestions = questions.filter(q => {
    const matchSubject = subjectFilter === 'All' || q.subject === subjectFilter;
    const matchDiff = diffFilter === 'All' || q.difficulty === diffFilter;
    const matchText = !searchText.trim() ||
      q.questionText.toLowerCase().includes(searchText.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchText.toLowerCase()) ||
      q.code.toLowerCase().includes(searchText.toLowerCase());
    return matchSubject && matchDiff && matchText;
  });

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header & 6 Action Buttons - Exact Screenshot 469 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // REPOSITORY
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Question Bank
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {questions.length} questions stored permanently
          </p>
        </div>

        {/* 6 Action Buttons from Screenshot 469 */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={pdfInputRef}
            onChange={handlePdfImport}
            accept=".pdf,.txt,.docx,.csv"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => pdfInputRef.current?.click()}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Import PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateFolderModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0B192C] hover:bg-slate-900 text-white rounded text-xs font-medium flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
            <span>Create Exam Folder</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Select answer key file (CSV/JSON/PDF) to import.')}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Answer Keys</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Bulk image uploader: Drag and drop formula/diagram image files.')}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Bulk Images</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Quick assign: Select an exam folder to batch-link questions.')}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-gray-500" />
            <span>Quick Assign</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateQuestionModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold rounded text-xs flex items-center space-x-1 cursor-pointer shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Filter Row - Exact Screenshot 469 */}
      <div className="bg-white border border-gray-200 rounded p-4 flex flex-wrap items-end gap-3 shadow-2xs">
        {/* Subject */}
        <div className="min-w-[130px]">
          <label className="block text-[11px] font-medium text-gray-600 mb-1">
            Subject
          </label>
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="min-w-[130px]">
          <label className="block text-[11px] font-medium text-gray-600 mb-1">
            Difficulty
          </label>
          <select
            value={diffFilter}
            onChange={e => setDiffFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:outline-none focus:border-blue-600"
          >
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Advanced IIT">Advanced IIT</option>
          </select>
        </div>

        {/* Test Folder */}
        <div className="min-w-[150px]">
          <label className="block text-[11px] font-medium text-gray-600 mb-1 flex items-center space-x-1">
            <Folder className="w-3 h-3 text-gray-400" />
            <span>Test Folder</span>
          </label>
          <select
            value={folderFilter}
            onChange={e => setFolderFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white text-gray-800 focus:outline-none focus:border-blue-600"
          >
            <option value="All folders">All folders</option>
            {folders.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-medium text-gray-600 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search text..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Apply Button */}
        <div>
          <button
            type="button"
            onClick={() => showToast('Filters applied.')}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded text-xs font-medium cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Question Cards List - Dynamic and Deletable */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500">
          No questions found matching your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-2xs hover:border-gray-300 transition"
            >
              {/* Top row tags & actions */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded font-mono text-[11px]">
                    {q.subject}
                  </span>

                  <span className="px-2 py-0.5 bg-[#002FA7] text-white font-mono text-[11px] font-bold rounded flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-300 rounded-2xs inline-block"></span>
                    <span>{q.tag || 'JEE'}</span>
                  </span>

                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-mono text-[11px] rounded border border-gray-200">
                    {q.difficulty}
                  </span>

                  <span className="px-2.5 py-0.5 bg-[#002FA7] text-white font-mono text-[11px] font-semibold rounded">
                    {q.type}
                  </span>

                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-mono text-[11px] rounded border border-gray-200">
                    +{q.marksPositive} / -{Math.abs(q.marksNegative)}
                  </span>
                </div>

                {/* Edit & Delete Icons */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingQuestion(q)}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                    title="Edit question"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(q)}
                    className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Math Text & Formula */}
              <div className="p-4 bg-gray-50/70 border border-gray-200 rounded text-gray-900 space-y-3 font-serif text-sm">
                <div className="leading-relaxed">
                  <span className="font-sans font-bold text-gray-600 mr-2 text-xs">Q{idx + 1}.</span>
                  {q.questionText}
                  {q.year && <span className="font-mono text-xs text-gray-500 ml-2 font-bold">{q.year}</span>}
                </div>

                {/* Diagram/Image preview if available */}
                {q.imageUrl && (
                  <div className="pt-2">
                    <img
                      src={q.imageUrl}
                      alt="Question diagram"
                      className="max-h-56 max-w-full rounded border border-gray-300 bg-white object-contain p-1"
                    />
                  </div>
                )}

                {q.formulaNote && (
                  <div className="text-xs font-mono text-blue-800 bg-blue-50/80 p-2 rounded border border-blue-200">
                    💡 Formula: {q.formulaNote}
                  </div>
                )}

                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`flex items-center space-x-2 p-1.5 rounded ${
                          opt.label === q.correctAnswer ? 'bg-green-50 border border-green-200 text-green-900 font-bold' : 'text-gray-800'
                        }`}
                      >
                        <span className="text-gray-500 font-bold">{opt.label}</span>
                        <span>{opt.text}</span>
                        {opt.label === q.correctAnswer && <Check className="w-3.5 h-3.5 text-green-600 ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Edit Question ({editingQuestion.code})</h3>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingQuestion.questionText}
                  onChange={e => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={editingQuestion.subject}
                    onChange={e => setEditingQuestion({ ...editingQuestion, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.topic}
                    onChange={e => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
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
