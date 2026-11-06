import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ShieldAlert, Lock, Eye, EyeOff, X, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { InstituteLogo } from './InstituteLogo';

export const AdminLoginModal: React.FC = () => {
  const {
    adminLoginModalOpen,
    setAdminLoginModalOpen,
    loginAdmin,
    settings,
    setPortalMode
  } = usePortal();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!adminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('Please enter the administrator password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(password.trim());
      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.error || 'Incorrect admin password.');
      } else {
        setPassword('');
        setErrorMsg('');
      }
    }, 200);
  };


  const handleClose = () => {
    setAdminLoginModalOpen(false);
    setErrorMsg('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 relative select-none">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <InstituteLogo
              className="w-10 h-10 rounded border border-blue-400/30 shadow-xs"
              imgClassName="max-h-10 max-w-10 object-contain rounded"
              fallbackType="grid"
            />
            <div>
              <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-semibold">
                // SECURE FACULTY GATE
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                Admin Console Login
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Administrative access is restricted to Gyansai Maths IIT Center faculty & management.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Info Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Account
              </label>
              <div className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 block">Prof. Taterao Kendre (KT Sir)</span>
                  <span className="text-[11px] text-gray-500 font-mono">admin@gyansaimaths.com</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-[#002FA7] font-bold text-[10px] rounded uppercase tracking-wider">
                  SUPER ADMIN
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Admin Master Password <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded text-xs text-gray-900 focus:outline-none focus:ring-1 ${
                    errorMsg
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-gray-300 focus:border-[#002FA7] focus:ring-[#002FA7]'
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

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start space-x-2 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Authentication Failed</p>
                  <p className="mt-0.5 text-[11px] text-red-600">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded cursor-pointer transition shadow-2xs flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Unlock Admin Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded cursor-pointer transition"
              >
                Cancel & Return
              </button>
            </div>
          </form>

          {/* Helper note */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Faculty help desk: +91 94227 18290</span>
            <span className="font-mono text-gray-400">Gyansai IIT Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
