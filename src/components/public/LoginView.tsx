import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { InstituteLogo } from '../common/InstituteLogo';

export const LoginView: React.FC = () => {
  const {
    setPortalMode,
    users,
    setCurrentUser,
    setActiveAdminTab,
    setActiveStudentTab,
    showToast,
    loginAdmin,
    settings
  } = usePortal();

  const [roleTab, setRoleTab] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (roleTab === 'admin') {
      if (!password.trim()) {
        setErrorMsg('Please enter the administrator password.');
        return;
      }

      const result = loginAdmin(password.trim(), username);
      if (!result.success) {
        setErrorMsg(result.error || 'Invalid administrator password.');
      }
    } else {
      // Student login
      const query = username.trim().toLowerCase();
      const studentUser = users.find(
        u => u.role === 'student' && (
          u.email.toLowerCase() === query ||
          u.name.toLowerCase() === query ||
          (u.rollNo && u.rollNo.toLowerCase() === query)
        )
      ) || users.find(u => u.role === 'student') || users[1];

      setCurrentUser(studentUser);
      setActiveStudentTab('Dashboard');
      setPortalMode('student');
      showToast(`Welcome back, ${studentUser.name}!`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#080B10] text-white font-sans">
      {/* Left Column: Command Center Branding with Subtle Dark Grid (Exact Screenshot 464) */}
      <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-neutral-800 bg-[#07090E]">
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Top-left: Dynamic Logo */}
        <div className="relative z-10 flex items-center space-x-3 select-none">
          <InstituteLogo
            className="w-9 h-9 sm:w-10 sm:h-10 border border-neutral-700 shadow-xs"
            imgClassName="max-h-9 max-w-9 sm:max-h-10 sm:max-w-10 object-contain rounded"
            fallbackType="emblem"
          />
          <div>
            <div className="font-bold text-sm sm:text-base text-white tracking-tight">
              {settings?.instituteName || 'Gyansai Maths IIT Center'}
            </div>
            <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              {settings?.storageTag ? `${settings.storageTag} · TEST PORTAL` : 'TEST PORTAL · V2.0'}
            </div>
          </div>
        </div>

        {/* Center: Command Center Tagline */}
        <div className="relative z-10 my-6 sm:my-10 md:my-0 space-y-3 sm:space-y-4 max-w-lg">
          <div className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">
            // EXCELLENCE ENGINEERED
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sign in to your exam command center.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
            Live proctoring · Tab-switch detection · AI question import · All-India ranking — all from one secure portal.
          </p>
        </div>

        {/* Bottom-left: Copyright */}
        <div className="relative z-10 text-xs font-mono text-neutral-500 hidden sm:block">
          © 2026 Gyansai · All rights reserved
        </div>
      </div>

      {/* Right Column: White Clean Login Form (Exact Screenshot 464) */}
      <div className="w-full md:w-1/2 bg-white text-slate-900 p-6 sm:p-10 lg:p-20 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="text-xs font-mono font-medium tracking-widest text-gray-500 uppercase mb-2">
              // AUTHENTICATION
            </div>
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">
              Welcome back.
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose your account type to continue.
            </p>
          </div>

          {/* Student / Admin Tab Toggle */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setRoleTab('student');
                setErrorMsg('');
                if (username === 'admin@gyansaimaths.com') setUsername('');
              }}
              className={`py-2 text-xs font-semibold rounded cursor-pointer transition ${
                roleTab === 'student'
                  ? 'bg-white text-gray-900 shadow-2xs border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab('admin');
                setErrorMsg('');
                if (!username) setUsername('admin@gyansaimaths.com');
              }}
              className={`py-2 text-xs font-semibold rounded cursor-pointer transition ${
                roleTab === 'admin'
                  ? 'bg-white text-gray-900 shadow-2xs border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Authentication Failed</p>
                <p className="mt-0.5 text-[11px] text-red-600">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {roleTab === 'admin' ? 'Admin Email / Username' : 'Username or Roll No'}
              </label>
              <input
                type="text"
                placeholder={roleTab === 'admin' ? 'admin@gyansaimaths.com' : 'Enter your roll number or email'}
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  {roleTab === 'admin' ? 'Master Admin Password' : 'Password'}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={roleTab === 'admin' ? 'Enter admin master password' : 'Enter your password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 ${
                    errorMsg
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#002FA7] hover:bg-blue-800 text-white font-medium text-sm rounded cursor-pointer transition shadow-2xs"
            >
              {roleTab === 'admin' ? 'Sign In as Administrator' : 'Sign In'}
            </button>
          </form>

          {/* Helper notes & back link */}
          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-500">
              Forgot your password? Contact your institute.
            </p>

            <div>
              <button
                type="button"
                onClick={() => setPortalMode('landing')}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                ← Back to homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
