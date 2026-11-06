import React, { useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  GraduationCap,
  Trophy,
  Target,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    exams,
    attempts,
    startExamForStudent,
    setActiveStudentTab,
    setSelectedAttemptForResult
  } = usePortal();

  // Real attempts belonging to the current logged-in student
  const myAttempts = useMemo(() => {
    if (!currentUser) return [];
    const cleanPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, '') : '';
    return attempts.filter(
      a => a.studentId === currentUser.id ||
           (cleanPhone && a.studentPhone && a.studentPhone.replace(/\D/g, '') === cleanPhone) ||
           (currentUser.email && a.studentEmail && a.studentEmail.toLowerCase() === currentUser.email.toLowerCase())
    );
  }, [attempts, currentUser]);

  const examsTaken = myAttempts.length;
  const avgScore = examsTaken > 0
    ? Math.round(myAttempts.reduce((sum, a) => sum + (a.totalScore || 0), 0) / examsTaken)
    : 0;
  const avgAccuracy = examsTaken > 0
    ? Math.round(myAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / examsTaken)
    : 0;
  const totalCorrect = myAttempts.reduce((sum, a) => sum + (a.correctCount || 0), 0);

  // Real available exams from portal database
  const liveExams = useMemo(() => {
    return exams.filter(e => e.status === 'Live' || e.status === 'Active' || e.isPublic);
  }, [exams]);

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Welcome Heading */}
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-blue-700 uppercase mb-1">
          // WELCOME BACK
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Hello, {currentUser?.name?.split(' ')[0] || 'Student'}.
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Enrollment #{currentUser?.rollNo || 'GMI-CBT'} &bull; {currentUser?.targetExam || 'Class 11th IIT-JEE'} &bull; Ready for today's mock tests.
        </p>
      </div>

      {/* 4 Real Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* EXAMS TAKEN */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-2xs">
          <div className="flex items-center space-x-2 text-[#002FA7] mb-2">
            <GraduationCap className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              EXAMS TAKEN
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            {examsTaken}
          </div>
        </div>

        {/* AVG SCORE */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-2xs">
          <div className="flex items-center space-x-2 text-[#002FA7] mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              AVG SCORE
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            {avgScore}
          </div>
        </div>

        {/* ACCURACY */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-2xs">
          <div className="flex items-center space-x-2 text-[#002FA7] mb-2">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              ACCURACY
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            {avgAccuracy}%
          </div>
        </div>

        {/* CORRECT */}
        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-2xs">
          <div className="flex items-center space-x-2 text-[#002FA7] mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              CORRECT
            </span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 font-mono">
            {totalCorrect}
          </div>
        </div>
      </div>

      {/* Two columns: Available exams (2/3) & Recent results (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Available exams */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-xs font-bold text-gray-900 uppercase">
                Available Examinations ({liveExams.length})
              </h2>
              <span className="text-[11px] text-gray-400 font-mono">Computer-Based Tests assigned to your curriculum</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveStudentTab('Exams')}
              className="text-xs text-blue-700 hover:text-blue-900 font-mono flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <span>View All &rarr;</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {liveExams.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-mono">
                No active exams available at this moment.
              </div>
            ) : (
              liveExams.slice(0, 8).map(ex => {
                const attended = myAttempts.find(a => a.examId === ex.id);
                return (
                  <div
                    key={ex.id}
                    className="p-3.5 border border-gray-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 text-xs">
                          {ex.title}
                        </span>
                        <span className="px-1.5 py-0.2 font-mono text-[9px] bg-blue-50 text-[#002FA7] border border-blue-200 rounded font-semibold">
                          {ex.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono mt-1 flex items-center space-x-3">
                        <span>{ex.durationMinutes} min</span>
                        <span>&bull;</span>
                        <span>{ex.totalMarks} Marks</span>
                        <span>&bull;</span>
                        <span className={attended ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                          {attended ? `Attempted (${attended.totalScore}/${attended.maxScore})` : 'Not Attempted'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startExamForStudent(ex.id)}
                      className={`px-4 py-1.5 rounded font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer transition shrink-0 ${
                        attended
                          ? 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                          : 'bg-[#002FA7] hover:bg-blue-800 text-white shadow-2xs'
                      }`}
                    >
                      <span>{attended ? 'Retake Exam' : 'Start Exam &rarr;'}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Recent results */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-xs font-bold text-gray-900 uppercase">
              Recent Submissions ({myAttempts.length})
            </h2>
            <span className="text-[11px] text-gray-400 font-mono">Performance history & scores</span>
          </div>

          <div className="space-y-3">
            {myAttempts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-mono">
                No exam submissions recorded yet. Take an exam to see your scorecards.
              </div>
            ) : (
              myAttempts.slice(0, 5).map(att => (
                <div
                  key={att.id}
                  className="p-3 border border-gray-100 bg-slate-50/60 rounded space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-xs truncate max-w-[180px]">
                      {att.examTitle}
                    </span>
                    <span className="font-mono text-emerald-700 font-extrabold text-xs">
                      {att.totalScore}/{att.maxScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                    <span>Accuracy: {att.accuracy}%</span>
                    <span>{att.submittedAt?.slice(0, 10) || 'Recent'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAttemptForResult(att);
                    }}
                    className="text-[11px] text-blue-700 hover:underline font-semibold block pt-1 cursor-pointer"
                  >
                    View Solutions & Analysis &rarr;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
