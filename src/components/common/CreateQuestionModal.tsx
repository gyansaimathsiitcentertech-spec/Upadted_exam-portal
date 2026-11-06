import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Upload, Save, Plus, ArrowLeft, Check, Image as ImageIcon } from 'lucide-react';
import { Question } from '../../types';

export const CreateQuestionModal: React.FC = () => {
  const {
    createQuestionModalOpen,
    setCreateQuestionModalOpen,
    questions,
    addQuestion,
    showToast
  } = usePortal();

  const [currentQIndex, setCurrentQIndex] = useState(1);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('MCQ — Single');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [marksPositive, setMarksPositive] = useState(4);
  const [marksNegative, setMarksNegative] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!createQuestionModalOpen) return null;

  const handleImageFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedImage(reader.result);
        showToast('Image attached to question.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveCurrent = (proceedToNext = false, finish = false) => {
    if (!questionText.trim() && !uploadedImage) {
      showToast('Please type question text or attach an image.', 'error');
      return;
    }

    const newQ: Omit<Question, 'id' | 'createdAt'> = {
      code: `MATH-Q${currentQIndex}-${Date.now().toString().slice(-4)}`,
      subject: 'Mathematics',
      topic: 'JEE & Entrance Exam Practice',
      type: questionType === 'Numerical Value' ? 'numerical' : 'single_choice',
      difficulty: 'Moderate',
      tag: 'JEE',
      year: `[${new Date().getFullYear()}]`,
      questionText: questionText.trim() || 'Refer to the attached image for question details.',
      imageUrl: uploadedImage || undefined,
      options: questionType === 'Numerical Value' ? [] : [
        { id: 'opt-1', label: '(1)', text: 'Option A' },
        { id: 'opt-2', label: '(2)', text: 'Option B' },
        { id: 'opt-3', label: '(3)', text: 'Option C' },
        { id: 'opt-4', label: '(4)', text: 'Option D' }
      ],
      correctAnswer: correctAnswer === 'A' ? '(1)' : correctAnswer === 'B' ? '(2)' : correctAnswer === 'C' ? '(3)' : '(4)',
      marksPositive: marksPositive || 4,
      marksNegative: marksNegative || 1,
      explanation: `Correct answer is Option ${correctAnswer}. Marks awarded: +${marksPositive}, penalty: -${marksNegative}.`
    };

    addQuestion(newQ);

    if (finish) {
      showToast(`Question Q${currentQIndex} saved! Questions added successfully.`);
      setCreateQuestionModalOpen(false);
      setCurrentQIndex(1);
      setQuestionText('');
      setUploadedImage('');
    } else if (proceedToNext) {
      showToast(`Question Q${currentQIndex} saved. Ready for Q${currentQIndex + 1}!`);
      setCurrentQIndex(prev => prev + 1);
      setQuestionText('');
      setUploadedImage('');
    } else {
      showToast(`Question Q${currentQIndex} saved.`);
    }
  };

  const handleClose = () => {
    setCreateQuestionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-100 font-sans text-xs">
        {/* Header - Exact Screenshot 470 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Create Question
            </h2>
            <span className="px-2 py-0.5 bg-[#002FA7] text-white font-bold text-xs rounded-xs tracking-wider">
              Q{currentQIndex}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body - Exact Screenshot 470 */}
        <div className="p-6 space-y-4">
          {/* 1. Question text */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Question text
            </label>
            <textarea
              rows={4}
              placeholder="Type the question (include options A/B/C/D inside if you want, or upload an image)"
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          {/* 2. Image (optional) Drag & Drop Container */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Image (optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {!uploadedImage ? (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-gray-300 rounded p-6 text-center bg-white hover:bg-gray-50/50 cursor-pointer transition select-none"
              >
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-blue-600">
                  <Upload className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="text-xs text-gray-600">
                  Drag & drop or{' '}
                  <span className="text-blue-600 underline font-medium">browse</span>
                </div>
              </div>
            ) : (
              <div className="relative border border-gray-200 rounded p-2 bg-gray-50 flex items-center space-x-3">
                <img
                  src={uploadedImage}
                  alt="Uploaded question attachment"
                  className="w-16 h-16 object-contain bg-white rounded border p-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">Question Image Attached</p>
                  <p className="text-[10px] text-gray-500">Will be displayed inside question paper & student exam</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedImage('')}
                  className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* 3. Question type */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Question type
            </label>
            <select
              value={questionType}
              onChange={e => setQuestionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="MCQ — Single">MCQ — Single</option>
              <option value="MCQ — Multiple">MCQ — Multiple</option>
              <option value="Numerical Value">Numerical Value</option>
              <option value="Matrix Match">Matrix Match</option>
            </select>
          </div>

          {/* 4. Correct Answer (4 large cards A, B, C, D) */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Correct Answer
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                const isSelected = correctAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCorrectAnswer(opt)}
                    className={`py-3.5 border rounded text-lg font-bold transition cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'border-[#002FA7] bg-[#002FA7] text-white shadow-xs'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Marks (+) & Negative (-) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Marks (+)
              </label>
              <input
                type="number"
                value={marksPositive}
                onChange={e => setMarksPositive(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Negative (-)
              </label>
              <input
                type="number"
                value={marksNegative}
                onChange={e => setMarksNegative(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Footer Action Buttons - Exact Screenshot 470 */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              disabled={currentQIndex <= 1}
              onClick={() => setCurrentQIndex(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => handleSaveCurrent(false, false)}
              className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-800 hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-gray-600" />
              <span>Save</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveCurrent(true, false)}
              className="px-4 py-2 border border-gray-300 rounded text-xs font-medium text-gray-800 hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
              <span>Next</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveCurrent(false, true)}
              className="px-5 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
            >
              <Save className="w-3.5 h-3.5 text-white" />
              <span>Finish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
