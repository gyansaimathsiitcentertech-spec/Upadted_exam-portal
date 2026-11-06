import React from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  GraduationCap,
  Trophy,
  Target,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    startExamForStudent,
    setActiveStudentTab
  } = usePortal();

  // 10 Available exams matching Screenshot 480
  const availableExams = [
    { id: 'exam-addi', title: 'addi', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-1', title: 'JEE', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-2', title: 'Jee', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-p2', title: 'Full jeemains paper 2', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-p1', title: 'Full jee main paper1', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-alg', title: 'Jee exam algebra', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-trig', title: 'Jeemains trigonometry 11paper1', duration: '60 min · mock · not attempted' },
    { id: 'exam-jee-ellipse', title: '11jeemains ellipse paper2', duration: '60 min · mock · not attempted' },
    { id: 'exam-12-alg', title: '12th algebra jee', duration: '60 min · mock · not attempted' },
    { id: 'exam-12-alg-cap', title: '12TH JEE Algebra', duration: '60 min · mock · not attempted' }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Welcome Heading - Exact Screenshot 480 */}
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
          // WELCOME BACK
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Hello, {currentUser?.name?.split(' ')[0]?.toLowerCase() || 'add'}.
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Enrollment #{currentUser?.rollNo || '—'} · Let's conquer today's mock.
        </p>
      </div>

      {/* 4 Metric Cards - Exact Screenshot 480 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* EXAMS TAKEN */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              EXAMS TAKEN
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            0
          </div>
        </div>

        {/* AVG SCORE */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              AVG SCORE
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            0
          </div>
        </div>

        {/* ACCURACY */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              ACCURACY
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            0%
          </div>
        </div>

        {/* CORRECT */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              CORRECT
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            0
          </div>
        </div>
      </div>

      {/* Two columns: Available exams (2/3) & Recent results (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Available exams */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xs font-bold text-gray-900">
              Available exams
            </h2>
            <button
              type="button"
              onClick={() => setActiveStudentTab('Exams')}
              className="text-xs text-gray-500 hover:text-blue-700 font-mono flex items-center space-x-1 cursor-pointer"
            >
              <span>view all →</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {availableExams.map(ex => (
              <div
                key={ex.id}
                className="p-3.5 border border-gray-200 rounded-sm flex items-center justify-between hover:bg-gray-50/50 transition"
              >
                <div>
                  <div className="font-bold text-gray-900 text-xs">
                    {ex.title}
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {ex.duration}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startExamForStudent(ex.id)}
                  className="px-4 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-800 rounded font-medium text-xs flex items-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <span>Start →</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent results */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-sm p-6 space-y-4">
          <h2 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-3">
            Recent results
          </h2>
          <div className="py-6 text-center text-xs text-gray-400 font-mono">
            No attempts yet.
          </div>
        </div>
      </div>
    </div>
  );
};
