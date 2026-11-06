import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { LogIn, UserPlus, X, KeyRound, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    users,
    setCurrentUser,
    setPortalMode,
    addUser,
    showToast,
    loginAdmin,
    requestAdminAccess
  } = usePortal();

  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [password, setPassword] = useState('password123');

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupTarget, setSignupTarget] = useState('JEE Advanced 2025');

  if (!authModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const query = emailOrRoll.trim().toLowerCase();
    const found = users.find(u =>
      u.email.toLowerCase() === query ||
      (u.rollNo && u.rollNo.toLowerCase() === query)
    );

    if (found && found.role === 'admin') {
      const res = loginAdmin(password);
      if (res.success) {
        setAuthModalOpen(false);
      } else {
        showToast(res.error || 'Invalid admin password.', 'error');
      }
      return;
    }

    if (found) {
      setCurrentUser(found);
      setPortalMode('student');
      setAuthModalOpen(false);
      showToast(`Welcome back, ${found.name}!`);
    } else {
      // Default to student login
      const fallback = users.find(u => u.role === 'student') || users[1];
      setCurrentUser(fallback);
      setPortalMode('student');
      setAuthModalOpen(false);
      showToast(`Logged in as ${fallback.name}`);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) return;

    const newStudent = addUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      phone: signupPhone.trim() || '+91 94220 00000',
      role: 'student',
      rollNo: `GMI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      targetExam: signupTarget,
      batchName: 'Open Mock Batch'
    });

    setCurrentUser(newStudent);
    setPortalMode('student');
    setAuthModalOpen(false);
    showToast(`Account created successfully! Your Roll No is ${newStudent.rollNo}`);
  };

  const handleQuickLoginAs = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      if (user.role === 'admin') {
        setAuthModalOpen(false);
        requestAdminAccess();
      } else {
        setCurrentUser(user);
        setPortalMode('student');
        setAuthModalOpen(false);
        showToast(`Logged in as ${user.name}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 flex items-center justify-between px-4 pt-3">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setAuthModalTab('login')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
                authModalTab === 'login'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthModalTab('signup')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition ${
                authModalTab === 'signup'
                  ? 'border-[#1E3A8A] text-[#1E3A8A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              New Registration
            </button>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs">
          {authModalTab === 'login' ? (
            <div>
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Email Address or Roll Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. rahul.sharma@gmail.com or GMI-2025-0101"
                      value={emailOrRoll}
                      onChange={e => setEmailOrRoll(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase">
                      Password
                    </label>
                    <span className="text-[10px] text-slate-400">Default: password123</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded shadow-xs cursor-pointer transition uppercase tracking-wider text-xs"
                >
                  Sign In to Test Portal
                </button>
              </form>

              {/* Fast 1-Click Demo Accounts */}
              <div className="mt-5 pt-4 border-t border-slate-200">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                  1-Click Demo Profiles (For Instant Testing)
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLoginAs('user-admin')}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded flex items-center justify-between text-left cursor-pointer transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">Prof. Taterao Kendre (KT Sir)</span>
                      <span className="text-[10px] text-slate-500">Admin & Head Faculty &bull; Full Console Access</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-[#1E3A8A] font-bold px-2 py-0.5 rounded">
                      ADMIN
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLoginAs('student-1')}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded flex items-center justify-between text-left cursor-pointer transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">Rahul Sharma (Rank 1 Aspirant)</span>
                      <span className="text-[10px] text-slate-500">Super 30 Batch &bull; GMI-2025-0101</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      STUDENT
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLoginAs('student-2')}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 rounded flex items-center justify-between text-left cursor-pointer transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">Priya Patel (JEE Main Target)</span>
                      <span className="text-[10px] text-slate-500">Target 2025 &bull; GMI-2025-0102</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                      STUDENT
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Patil"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Mobile / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+91 94220 12345"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Target Competitive Exam
                </label>
                <select
                  value={signupTarget}
                  onChange={e => setSignupTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                >
                  <option value="JEE Advanced 2025">IIT-JEE Advanced 2025</option>
                  <option value="JEE Main 2025">JEE Main 2025</option>
                  <option value="MHT-CET 2025">MHT-CET Engineering 2025</option>
                  <option value="Class 11 Foundation">Class 11 Foundation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs cursor-pointer transition uppercase tracking-wider text-xs"
              >
                Register & Enter Student Portal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
