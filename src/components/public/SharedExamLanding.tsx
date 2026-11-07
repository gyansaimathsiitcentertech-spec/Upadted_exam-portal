import React, { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Clock,
  FileText,
  Shield,
  Award,
  CheckCircle2,
  ArrowRight,
  Building,
  UserCheck,
  Sparkles,
  BookOpen,
  KeyRound,
  Lock,
  Copy,
  Check,
  Play,
  RotateCcw
} from 'lucide-react';
import { InstituteLogo } from '../common/InstituteLogo';

export const SharedExamLanding: React.FC = () => {
  const {
    settings,
    exams,
    activeExamIdForShare,
    setPortalMode,
    quickJoinAndStartExam,
    showToast
  } = usePortal();

  // 1. Identify the exact examination associated with the link
  const currentExam = useMemo(() => {
    if (!activeExamIdForShare) return exams[0];
    const match = exams.find(
      e => e.id.toLowerCase() === activeExamIdForShare.toLowerCase() ||
           e.code.toLowerCase() === activeExamIdForShare.toLowerCase()
    );
    return match || exams[0];
  }, [exams, activeExamIdForShare]);

  // Stage state: 'form' -> fills data; 'credentials' -> shows username, password & Quick Start Exam
  const [stage, setStage] = useState<'form' | 'credentials'>('form');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<{
    username: string;
    password: string;
    rollNo: string;
  } | null>(null);

  // Form state - The 5 required fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [targetClass, setTargetClass] = useState<'11th' | '12th' | 'Repeater / Dropper'>(() => {
    if (currentExam?.targetClass?.includes('12')) return '12th';
    if (currentExam?.targetClass?.includes('Repeater')) return 'Repeater / Dropper';
    return '11th';
  });
  const [collegeName, setCollegeName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsCount = useMemo(() => {
    if (currentExam?.questions && currentExam.questions.length > 0) {
      return currentExam.questions.length;
    }
    if (currentExam?.sections && currentExam.sections.length > 0) {
      const qIds = currentExam.sections.flatMap(s => s.questionIds || []);
      if (qIds.length > 0) return qIds.length;
    }
    return 10;
  }, [currentExam]);

  const totalMarks = currentExam?.totalMarks || (questionsCount * (currentExam?.positiveMarks || 4)) || 100;
  const passPercentage = currentExam?.passPercentage || 40;
  const passMarks = Math.round((totalMarks * passPercentage) / 100);
  const positiveMarks = currentExam?.positiveMarks || 4;
  const negativeMarks = currentExam?.negativeMarks !== undefined ? currentExam.negativeMarks : -1;

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegisterAndShowCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!collegeName.trim()) {
      setErrorMsg('Please enter your college or school name.');
      return;
    }

    const assignedRoll = rollNumber.trim() || `GMI-QJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const genUsername = `g_${cleanMobile}`;
    const genPassword = 'gyansai123';

    setCredentials({
      username: genUsername,
      password: genPassword,
      rollNo: assignedRoll
    });
    setStage('credentials');
  };

  const handleQuickStartExam = () => {
    setIsSubmitting(true);
    const targetExamId = currentExam ? currentExam.id : (activeExamIdForShare || exams[0]?.id);
    const cleanMobile = mobile.trim().replace(/\D/g, '');
    const finalRoll = credentials?.rollNo || rollNumber.trim() || `GMI-QJ-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      quickJoinAndStartExam(
        fullName.trim(),
        cleanMobile,
        targetClass,
        collegeName.trim(),
        finalRoll,
        targetExamId
      );
    } catch (err) {
      console.error('Failed to start exam:', err);
      setIsSubmitting(false);
      setErrorMsg('Unable to launch examination. Please check details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-100">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div
          onClick={() => setPortalMode('landing')}
          className="flex items-center space-x-3 text-slate-900 font-semibold cursor-pointer select-none hover:opacity-90 transition"
        >
          <InstituteLogo
            className="w-9 h-9 rounded-md border border-slate-200 shadow-2xs"
            imgClassName="max-h-9 max-w-9 object-contain rounded-md"
            fallbackType="cap"
          />
          <div>
            <span className="text-sm font-extrabold tracking-tight text-[#002FA7] block leading-tight">
              {settings?.instituteName || 'GYANSAI MATHS IIT CENTER'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              Direct Public Examination Access &bull; Computer-Based Test (CBT)
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>EXAM READY</span>
          </span>
        </div>
      </header>

      {/* Main Container: Two-column on desktop, stacked on mobile */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Exam Information (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Exam Title & Tag Badges */}
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#002FA7] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                  // OFFICIAL ASSESSMENT
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Exam Code: <span className="font-bold text-slate-900">{currentExam?.code || 'LIVE'}</span>
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
                  {currentExam?.title || 'Mathematics Examination'}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Subject Series: <span className="text-slate-800 font-semibold">{currentExam?.folderName || 'Mathematics'}</span> &bull; Status: <span className="text-emerald-700 font-bold">Active for Public Entry</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-xs font-semibold">
                  Class: {currentExam?.targetClass || '11th & 12th'}
                </span>
                <span className="px-2.5 py-0.5 bg-[#002FA7] text-white rounded text-xs font-semibold">
                  {currentExam?.examCategory || 'IIT-JEE / MHT-CET'}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Marking: +{positiveMarks} / {negativeMarks}</span>
                </span>
              </div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  DURATION
                </div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-[#002FA7] shrink-0" />
                  <span>{currentExam?.durationMinutes || 180}m</span>
                </div>
              </div>

              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  QUESTIONS
                </div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-1.5 mt-0.5">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{questionsCount} Qs</span>
                </div>
              </div>

              <div className="bg-white p-3.5 border border-slate-200 rounded-lg shadow-2xs">
                <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  MAX MARKS
                </div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-1.5 mt-0.5">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{totalMarks}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                <Shield className="w-4 h-4 text-[#002FA7]" />
                <span className="uppercase tracking-wider">Candidate Guidelines</span>
              </div>
              
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>Questions are strictly from the assigned syllabus of this examination.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>Responses and timers are saved locally. Refreshing will resume your attempt.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>Upon submission, you can immediately view your score and download your official question & solution PDF.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Quick Join Registration / CBT Credentials (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              {stage === 'form' ? (
                <>
                  {/* Form Card Header */}
                  <div className="bg-gradient-to-r from-[#002FA7] to-blue-800 p-4 sm:p-5 text-white">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-blue-200" />
                      <h2 className="text-base font-extrabold tracking-tight">
                        Quick Join Registration
                      </h2>
                    </div>
                    <p className="text-[11px] text-blue-100 mt-1">
                      No login required. Fill details to access the exam instantly.
                    </p>
                  </div>

                  {/* Form Body - Exact 5 Required Fields */}
                  <form onSubmit={handleRegisterAndShowCredentials} className="p-5 sm:p-6 space-y-3.5 text-xs">
                    {errorMsg && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center space-x-1.5">
                        <span className="font-bold">•</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* 1. Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        1. Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={e => {
                          setFullName(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
                        autoFocus
                      />
                    </div>

                    {/* 2. Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        2. Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 text-xs text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l font-mono">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit mobile"
                          value={mobile}
                          onChange={e => {
                            setMobile(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-r text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
                        />
                      </div>
                    </div>

                    {/* 3. Class */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        3. Class / Standard <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={targetClass}
                        onChange={e => setTargetClass(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
                      >
                        <option value="11th">Class 11th (XI Aspirant)</option>
                        <option value="12th">Class 12th (XII Board + JEE/CET)</option>
                        <option value="Repeater / Dropper">Repeater / Dropper Batch</option>
                      </select>
                    </div>

                    {/* 4. College Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        4. College / School Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Deogiri College / MIT Aurangabad"
                          value={collegeName}
                          onChange={e => {
                            setCollegeName(e.target.value);
                            if (errorMsg) setErrorMsg('');
                          }}
                          className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
                        />
                        <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    {/* 5. Roll Number (optional) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800">
                          5. Roll Number <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Auto-generated if blank</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. GMI-2025-0101 or leave blank"
                        value={rollNumber}
                        onChange={e => setRollNumber(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:bg-white"
                      />
                    </div>

                    {/* Register & Continue Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#002FA7] hover:bg-blue-800 active:scale-[0.99] text-white font-extrabold text-xs rounded transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                      >
                        <span>Generate Exam Pass & Credentials</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-slate-500 pt-1 leading-normal">
                      Your examination credentials will be generated instantly for <strong className="text-slate-700">{currentExam?.title}</strong>.
                    </p>
                  </form>
                </>
              ) : (
                /* Stage 2: Candidate Hall Ticket & Login Credentials Card */
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Registration Verified &bull; CBT Hall Ticket</span>
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900 mt-1">
                        CBT Exam Login Credentials
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Candidate registered for <strong className="text-slate-800">{currentExam?.title}</strong>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#002FA7] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      CBT PASS
                    </span>
                  </div>

                  {/* Candidate Summary Block */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 font-sans">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Candidate Name:</span>
                      <strong className="text-slate-900 font-bold">{fullName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Mobile Number:</span>
                      <strong className="text-slate-900 font-mono">+91 {mobile}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Class & College:</span>
                      <span className="text-slate-800 truncate max-w-[200px] text-right font-medium">
                        {targetClass} &bull; {collegeName}
                      </span>
                    </div>
                  </div>

                  {/* Credentials Highlight Box */}
                  <div className="p-3.5 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border-2 border-blue-200 rounded-lg space-y-3 shadow-2xs">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-[#002FA7] uppercase flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <KeyRound className="w-3 h-3 text-[#002FA7]" />
                        <span>YOUR CBT LOGIN CREDENTIALS</span>
                      </span>
                      <span className="text-emerald-700 font-bold">READY TO START</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Username */}
                      <div className="p-2.5 bg-white border border-blue-200 rounded shadow-2xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                          <span>USERNAME</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(credentials?.username || '', 'Username')}
                            className="text-[#002FA7] hover:underline flex items-center space-x-0.5 cursor-pointer"
                          >
                            {copiedKey === 'Username' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono font-extrabold text-sm text-slate-900 select-all">
                          {credentials?.username}
                        </div>
                      </div>

                      {/* Password */}
                      <div className="p-2.5 bg-white border border-blue-200 rounded shadow-2xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                          <span>PASSWORD</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(credentials?.password || '', 'Password')}
                            className="text-[#002FA7] hover:underline flex items-center space-x-0.5 cursor-pointer"
                          >
                            {copiedKey === 'Password' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="font-mono font-extrabold text-sm text-[#002FA7] select-all flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-blue-600 inline" />
                          <span>{credentials?.password}</span>
                        </div>
                      </div>
                    </div>

                    {/* Roll Number Row */}
                    <div className="p-2 bg-white/80 border border-slate-200 rounded flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Roll Number:</span>
                      <strong className="font-mono font-bold text-slate-800 select-all">
                        {credentials?.rollNo}
                      </strong>
                    </div>
                  </div>

                  {/* Actions: Quick Start Exam and Edit */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleQuickStartExam}
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#002FA7] hover:bg-blue-800 active:scale-[0.99] text-white font-extrabold text-sm rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Quick Start Exam &rarr;</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStage('form')}
                      disabled={isSubmitting}
                      className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Candidate Information</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-slate-500 pt-1 leading-normal">
                    Clicking <strong className="text-slate-800">Quick Start Exam</strong> will immediately load your assigned questions and start the CBT test interface.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 {settings?.instituteName || 'Gyansai Maths IIT Center'} &bull; Official Examination Portal
      </footer>
    </div>
  );
};
