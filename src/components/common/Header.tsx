import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  GraduationCap,
  Shield,
  User as UserIcon,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  LogIn,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { InstituteLogo } from './InstituteLogo';

export const Header: React.FC = () => {
  const {
    settings,
    currentUser,
    setCurrentUser,
    users,
    portalMode,
    setPortalMode,
    setAuthModalOpen,
    setQuickJoinModalOpen,
    resetAllToDefault,
    exams
  } = usePortal();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Brand logo & title */}
      <div className="flex items-center space-x-3">
        <InstituteLogo
          className="w-10 h-10 rounded shadow-xs"
          imgClassName="w-10 h-10 object-contain rounded"
          fallbackType="cap"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[15px] sm:text-[17px] tracking-tight text-slate-900 uppercase">
              {settings?.instituteName || 'GYANSAI MATHS IIT CENTER'}
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-200">
              OFFICIAL CBT PORTAL
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            {settings?.tagline || 'Premier Institute for IIT-JEE (Main & Adv) • Founded by Prof. Taterao Kendre (KT Sir)'}
          </p>
        </div>
      </div>

      {/* Center mode pills: Admin Console / Student Portal */}
      <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setPortalMode('admin');
            const adminUser = users.find(u => u.role === 'admin') || users[0];
            setCurrentUser(adminUser);
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
            portalMode === 'admin'
              ? 'bg-[#1E3A8A] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Console</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPortalMode('student');
            const studentUser = users.find(u => u.role === 'student') || users[1];
            setCurrentUser(studentUser);
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
            portalMode === 'student'
              ? 'bg-[#1E3A8A] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPortalMode('public_exam');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all cursor-pointer ${
            portalMode === 'public_exam'
              ? 'bg-[#1E3A8A] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Shared Exam Page</span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Join Public Exam button */}
        <button
          type="button"
          onClick={() => setQuickJoinModalOpen(true)}
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          <span>Quick Join Exam</span>
        </button>

        {/* User profile dropdown & switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {currentUser.role === 'admin' ? 'Administrator' : (currentUser.rollNo || 'Student')}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                <p className="text-[11px] font-semibold uppercase text-slate-400">Signed in as</p>
                <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setCurrentUser(u);
                      setPortalMode(u.role === 'admin' ? 'admin' : 'student');
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 transition ${
                      currentUser.id === u.id ? 'bg-blue-50 text-[#1E3A8A] font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">
                      {u.name} <span className="text-[10px] text-slate-400">({u.role})</span>
                    </span>
                    {currentUser.id === u.id && <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]"></span>}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalOpen(true);
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Login with Another Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all portal exams, students and scores to factory default?')) {
                      resetAllToDefault();
                    }
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
