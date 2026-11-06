import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Folder, Share2, Clock, FileText } from 'lucide-react';

export const StudentExamsView: React.FC = () => {
  const {
    exams,
    startExamForStudent,
    setActiveExamIdForShare,
    setActiveExamForQuestionsModal
  } = usePortal();

  const [activeFolderTab, setActiveFolderTab] = useState('MHT-CET');

  // Exam matching Screenshot 481
  const studentExams = [
    {
      id: 'exam-mht-1',
      title: '12 th MHT-CET paper 1',
      examFolder: '12 th MHT-CET paper 1 (50 questions)',
      questionFolder: '12 th MHT-CET paper 1',
      tagType: 'mock',
      targetClass: '11th',
      duration: '90 min',
      passMarks: 'Pass 0'
    }
  ];

  const handleStartExam = (examId: string) => {
    startExamForStudent(examId);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 481 */}
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
          // EXAMINATIONS
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Your Exams
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          {studentExams.length} exams available
        </p>
      </div>

      {/* Folder Tab - Exact Screenshot 481 */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveFolderTab('MHT-CET')}
          className="flex items-center space-x-2 px-3 py-1.5 bg-amber-50/70 border border-amber-200 rounded text-xs font-medium text-gray-800"
        >
          <Folder className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span className="font-bold">MHT-CET</span>
          <span className="text-[11px] text-gray-500 font-mono">1 exam</span>
        </button>
      </div>

      {/* Exam Card - Exact Screenshot 481 */}
      <div className="max-w-md">
        {studentExams.map(ex => (
          <div
            key={ex.id}
            className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-2xs"
          >
            {/* Badges & Share icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded border border-gray-200">
                  {ex.tagType}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded border border-gray-200">
                  {ex.targetClass}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveExamIdForShare(ex.id)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title & Folders */}
            <div>
              <h3 className="text-sm font-bold text-gray-950">
                {ex.title}
              </h3>
              <p className="text-[11px] text-gray-500 font-mono mt-1">
                Exam folder: {ex.examFolder}
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                Question folder: {ex.questionFolder}
              </p>
            </div>

            {/* Duration & Pass */}
            <div className="flex items-center space-x-6 text-[11px] text-gray-600 font-mono pt-1">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{ex.duration}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span>{ex.passMarks}</span>
              </div>
            </div>

            {/* Bottom Buttons: Start Exam (Solid deep blue) & Questions (White) */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleStartExam(ex.id)}
                className="flex-1 py-2.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded text-center cursor-pointer shadow-2xs transition"
              >
                Start Exam
              </button>

              <button
                type="button"
                onClick={() => {
                  const examObj = exams.find(e => e.id === ex.id) || exams[0];
                  setActiveExamForQuestionsModal(examObj);
                }}
                className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium text-xs rounded cursor-pointer shadow-2xs"
              >
                Questions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
