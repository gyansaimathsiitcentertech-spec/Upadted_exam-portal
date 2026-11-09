import React, { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Folder, Share2, Clock, FileText, Search, Play, Award, CheckCircle } from 'lucide-react';

export const StudentExamsView: React.FC = () => {
  const {
    exams,
    attempts,
    currentUser,
    startExamForStudent,
    setActiveExamIdForShare
  } = usePortal();

  const [activeFolderTab, setActiveFolderTab] = useState('All');
  const [classFilter, setClassFilter] = useState<'my_class' | '11th' | '12th' | 'all'>('my_class');
  const [searchText, setSearchText] = useState('');

  // Determine student's assigned class from their profile
  const studentClass = useMemo<'11th' | '12th'>(() => {
    if (!currentUser) return '11th';
    const text = `${currentUser.targetExam || ''} ${currentUser.batchName || ''}`.toLowerCase();
    if (text.includes('12') || text.includes('xii')) return '12th';
    return '11th';
  }, [currentUser]);

  // Student's completed attempts
  const myAttempts = useMemo(() => {
    if (!currentUser) return [];
    const cleanPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, '') : '';
    return attempts.filter(
      a => a.studentId === currentUser.id ||
           (cleanPhone && a.studentPhone && a.studentPhone.replace(/\D/g, '') === cleanPhone) ||
           (currentUser.email && a.studentEmail && a.studentEmail.toLowerCase() === currentUser.email.toLowerCase())
    );
  }, [attempts, currentUser]);

  // Extract unique folders / categories from real exams
  const foldersList = useMemo(() => {
    const set = new Set<string>();
    exams.forEach(e => {
      if (e.folderName) set.add(e.folderName);
    });
    return Array.from(set);
  }, [exams]);

  // Class counts for tabs
  const count11th = useMemo(() => {
    return exams.filter(e => {
      const cls = (e.targetClass || '').toLowerCase();
      return cls.includes('11') || cls.includes('both') || cls.includes('&') || !e.targetClass;
    }).length;
  }, [exams]);

  const count12th = useMemo(() => {
    return exams.filter(e => {
      const cls = (e.targetClass || '').toLowerCase();
      return cls.includes('12') || cls.includes('both') || cls.includes('&');
    }).length;
  }, [exams]);

  const filteredExams = useMemo(() => {
    return exams.filter(ex => {
      // 1. Class filter
      const examClass = (ex.targetClass || '11th').toLowerCase();
      if (classFilter === 'my_class') {
        const matchesStudent = studentClass === '12th'
          ? (examClass.includes('12') || examClass.includes('both') || examClass.includes('&'))
          : (examClass.includes('11') || examClass.includes('both') || examClass.includes('&') || !ex.targetClass);
        if (!matchesStudent) return false;
      } else if (classFilter === '11th') {
        if (!examClass.includes('11') && !examClass.includes('both') && !examClass.includes('&') && ex.targetClass) return false;
      } else if (classFilter === '12th') {
        if (!examClass.includes('12') && !examClass.includes('both') && !examClass.includes('&')) return false;
      }

      // 2. Folder filter
      const matchFolder = activeFolderTab === 'All' || ex.folderName === activeFolderTab;

      // 3. Search text
      const q = searchText.toLowerCase().trim();
      const matchSearch = !q ||
        ex.title.toLowerCase().includes(q) ||
        ex.code.toLowerCase().includes(q) ||
        (ex.folderName && ex.folderName.toLowerCase().includes(q));

      return matchFolder && matchSearch;
    });
  }, [exams, classFilter, studentClass, activeFolderTab, searchText]);

  const handleStartExam = (examId: string) => {
    startExamForStudent(examId);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-[#002FA7] uppercase mb-1">
            // EXAMINATIONS CURRICULUM
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight flex items-center space-x-2">
            <span>Your Examinations</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#002FA7] border border-blue-200 font-mono">
              Class {studentClass} Enrolled
            </span>
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Official papers assigned to your class &bull; {myAttempts.length} attempted
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search test name or code..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs bg-white text-gray-900 focus:outline-none focus:border-[#002FA7]"
          />
        </div>
      </div>

      {/* Class Level Selector Tabs (11th vs 12th) */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 font-mono uppercase mr-1">Class Filter:</span>
          <button
            type="button"
            onClick={() => setClassFilter('my_class')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              classFilter === 'my_class'
                ? 'bg-[#002FA7] text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🎯 Assigned to My Class ({studentClass})</span>
          </button>

          <button
            type="button"
            onClick={() => setClassFilter('11th')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
              classFilter === '11th'
                ? 'bg-[#002FA7] text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Class 11th Papers ({count11th})</span>
          </button>

          <button
            type="button"
            onClick={() => setClassFilter('12th')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
              classFilter === '12th'
                ? 'bg-[#002FA7] text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Class 12th Papers ({count12th})</span>
          </button>

          <button
            type="button"
            onClick={() => setClassFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
              classFilter === 'all'
                ? 'bg-[#002FA7] text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Classes ({exams.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-mono hidden md:block">
          Showing {filteredExams.length} matching test papers
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveFolderTab('All')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
            activeFolderTab === 'All'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>All Folders</span>
          <span className="font-mono text-[10px]">({exams.length})</span>
        </button>

        {foldersList.map(fname => {
          const count = exams.filter(e => e.folderName === fname).length;
          return (
            <button
              key={fname}
              type="button"
              onClick={() => setActiveFolderTab(fname)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                activeFolderTab === fname
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span>{fname}</span>
              <span className="font-mono text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-400 font-mono">
          No examinations found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map(ex => {
            const attended = myAttempts.find(a => a.examId === ex.id);
            const questionCount = ex.questions?.length || (ex.sections?.[0]?.questionIds?.length) || 10;

            return (
              <div
                key={ex.id}
                className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 shadow-2xs hover:border-gray-300 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Badges & Share icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#002FA7] font-mono text-[10px] font-bold rounded border border-blue-200">
                        {ex.code}
                      </span>
                      <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded border ${
                        (ex.targetClass || '').includes('12')
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        Class {ex.targetClass || '11th'}
                      </span>
                      {((studentClass === '11th' && (ex.targetClass || '').includes('11')) ||
                        (studentClass === '12th' && (ex.targetClass || '').includes('12'))) && (
                        <span className="px-1.5 py-0.5 bg-emerald-100/70 text-emerald-800 text-[9px] font-bold rounded hidden sm:inline">
                          ✓ Your Class
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveExamIdForShare(ex.id)}
                      className="text-gray-400 hover:text-blue-700 cursor-pointer p-1"
                      title="Share exam link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Folders */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 leading-snug">
                      {ex.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-mono mt-1">
                      Target: <span className="font-semibold text-slate-800">Class {ex.targetClass || '11th'}</span> &bull; Folder: {ex.folderName || 'General Mock Tests'}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-[11px] font-mono text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Duration</span>
                      <span className="font-bold text-gray-900">{ex.durationMinutes} min</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Questions</span>
                      <span className="font-bold text-gray-900">{questionCount} Qs</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase">Total Marks</span>
                      <span className="font-bold text-gray-900">{ex.totalMarks} M</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button & Status */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    {attended ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Score: {attended.totalScore}/{attended.maxScore}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Not attempted yet</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartExam(ex.id)}
                    className={`px-4 py-1.5 rounded font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-2xs transition ${
                      attended
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-[#002FA7] hover:bg-blue-800 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{attended ? 'Retake' : 'Start Exam'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
