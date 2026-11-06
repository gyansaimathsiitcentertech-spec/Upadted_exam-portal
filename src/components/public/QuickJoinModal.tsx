import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { UserPlus, X, ArrowRight, BookOpen, Building, ShieldCheck } from 'lucide-react';

export const QuickJoinModal: React.FC = () => {
  const {
    quickJoinModalOpen,
    setQuickJoinModalOpen,
    exams,
    activeExamIdForShare,
    quickJoinAndStartExam
  } = usePortal();

  const currentExam = exams.find(
    e => (activeExamIdForShare && (e.id.toLowerCase() === activeExamIdForShare.toLowerCase() || e.code.toLowerCase() === activeExamIdForShare.toLowerCase()))
  ) || exams[0];

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

  if (!quickJoinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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

    const targetExamId = currentExam ? currentExam.id : (activeExamIdForShare || exams[0]?.id);

    try {
      quickJoinAndStartExam(
        fullName.trim(),
        cleanMobile,
        targetClass,
        collegeName.trim(),
        rollNumber.trim(),
        targetExamId
      );
    } catch (err) {
      console.error('Quick join error:', err);
      setErrorMsg('Unable to launch exam. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <div className="w-7 h-7 rounded-md bg-[#002FA7]/10 flex items-center justify-center text-[#002FA7]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-extrabold text-slate-900">Quick Join Registration</span>
              <span className="block text-[10px] text-slate-500 font-mono">
                {currentExam?.title ? `${currentExam.title.slice(0, 42)}...` : 'Direct CBT Examination Access'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQuickJoinModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/50 cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Exactly 5 Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center space-x-2">
              <span className="font-bold">•</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Atharva Kendre"
              value={fullName}
              onChange={e => {
                setFullName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
              autoFocus
            />
          </div>

          {/* 2. Mobile Number & 3. Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
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
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={targetClass}
                onChange={e => setTargetClass(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:ring-1 focus:ring-[#002FA7]"
              >
                <option value="11th">11th (Class XI)</option>
                <option value="12th">12th (Class XII)</option>
                <option value="Repeater / Dropper">Repeater / Dropper</option>
              </select>
            </div>
          </div>

          {/* 4. College Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              College Name <span className="text-red-500">*</span>
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
                Roll Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <span className="text-[10px] text-slate-500">Auto-assigned if left blank</span>
            </div>
            <input
              type="text"
              placeholder="e.g. GMI-2025-098 or leave blank"
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-[#002FA7] focus:bg-white"
            />
          </div>

          {/* Exam Summary Notice */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-[11px] text-blue-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#002FA7]" />
              <span>Assigned Examination:</span>
            </div>
            <div className="font-semibold text-slate-900 pl-5">
              {currentExam?.title || 'Gyansai Mathematics Assessment'} ({currentExam?.code || 'LIVE'})
            </div>
            <div className="text-slate-600 pl-5 text-[10px]">
              Duration: {currentExam?.durationMinutes || 180} min &bull; Marking: +{currentExam?.positiveMarks || 4} / {currentExam?.negativeMarks || -1}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#002FA7] hover:bg-blue-800 text-white font-bold text-xs rounded transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <span>Start Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
