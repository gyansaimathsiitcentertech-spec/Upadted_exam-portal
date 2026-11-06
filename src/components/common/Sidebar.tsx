import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  LayoutGrid,
  Users,
  GraduationCap,
  Layers,
  HelpCircle,
  FileText,
  CalendarCheck,
  BookOpen,
  Bell,
  BarChart3,
  CheckSquare,
  CreditCard,
  BookMarked,
  Award,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { InstituteLogo } from './InstituteLogo';

export const Sidebar: React.FC = () => {
  const {
    settings,
    portalMode,
    setPortalMode,
    activeAdminTab,
    setActiveAdminTab,
    activeStudentTab,
    setActiveStudentTab,
    currentUser,
    logoutAdmin,
    requestAdminAccess
  } = usePortal();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Admin Items
  const adminItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'Students', label: 'Students', icon: Users },
    { id: 'Teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'Batches', label: 'Batches', icon: Layers },
    { id: 'Question Bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'Exams', label: 'Exams', icon: FileText },
    { id: 'Attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'Study Material', label: 'Study Material', icon: BookOpen },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Results & Recording', label: 'Results & Recording', icon: BarChart3 },
    { id: 'Evaluation', label: 'Evaluation', icon: CheckSquare },
    { id: 'Payments', label: 'Payments', icon: CreditCard },
    { id: 'Courses', label: 'Courses', icon: BookMarked },
    { id: 'Test Series', label: 'Test Series', icon: Award },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  // Student Items
  const studentItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'Exams', label: 'Exams', icon: FileText },
    { id: 'Courses', label: 'Courses', icon: BookMarked },
    { id: 'Test Series', label: 'Test Series', icon: Award },
    { id: 'My Purchases', label: 'My Purchases', icon: CreditCard },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  const currentItems = portalMode === 'admin' ? adminItems : studentItems;
  const currentActiveTab = portalMode === 'admin' ? activeAdminTab : activeStudentTab;

  const isCurrentActive = (id: string) => {
    if (portalMode === 'admin') {
      if (id === 'Exams' && (activeAdminTab === 'Exams' || activeAdminTab === 'Exam Management' || activeAdminTab === 'Create Exam')) return true;
      if (id === 'Settings' && (activeAdminTab === 'Settings' || activeAdminTab === 'Institute Settings')) return true;
      return activeAdminTab === id;
    }
    return activeStudentTab === id;
  };

  const handleItemClick = (id: string) => {
    if (portalMode === 'admin') {
      if (id === 'Exams') {
        setActiveAdminTab('Exam Management');
      } else if (id === 'Settings') {
        setActiveAdminTab('Institute Settings');
      } else {
        setActiveAdminTab(id);
      }
    } else {
      setActiveStudentTab(id);
    }
    setMobileDrawerOpen(false);
  };

  const renderNavList = () => (
    <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
      {currentItems.map(item => {
        const active = isCurrentActive(item.id);
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded text-xs font-medium transition cursor-pointer text-left ${
              active
                ? 'bg-[#002FA7] text-white font-semibold shadow-2xs'
                : 'text-gray-800 hover:bg-gray-100/80 hover:text-gray-950'
            }`}
          >
            <div className="flex items-center space-x-2.5 truncate">
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
              <span className="truncate">{item.label}</span>
            </div>
            {active && <ChevronRight className="w-3.5 h-3.5 text-white/80 shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  const renderFooter = () => (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="text-xs text-gray-600 truncate font-mono mb-1">
        {portalMode === 'admin' ? 'admin@gyansaimaths.com' : (currentUser?.email || currentUser?.name || 'student')}
      </div>
      <button
        type="button"
        onClick={() => {
          setMobileDrawerOpen(false);
          if (portalMode === 'admin') {
            logoutAdmin();
          } else {
            setPortalMode('landing');
          }
        }}
        className="text-xs text-gray-800 hover:text-red-600 flex items-center space-x-1.5 font-medium cursor-pointer transition py-1"
      >
        <LogOut className="w-3.5 h-3.5 text-gray-500" />
        <span>Sign Out</span>
      </button>

      {/* Quick portal role switcher */}
      <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
        <span>Portal View:</span>
        <div className="space-x-1">
          <button
            type="button"
            onClick={() => {
              setMobileDrawerOpen(false);
              requestAdminAccess();
            }}
            className={`px-2 py-0.5 rounded cursor-pointer font-medium ${
              portalMode === 'admin' ? 'bg-blue-100 text-[#002FA7] font-bold' : 'hover:text-gray-700'
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileDrawerOpen(false);
              setPortalMode('student');
            }}
            className={`px-2 py-0.5 rounded cursor-pointer font-medium ${
              portalMode === 'student' ? 'bg-blue-100 text-[#002FA7] font-bold' : 'hover:text-gray-700'
            }`}
          >
            Student
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. MOBILE TOP NAVIGATION BAR (Visible on screens < md) */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 rounded border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer active:scale-95 transition"
            aria-label="Open portal navigation menu"
          >
            <Menu className="w-5 h-5 text-[#002FA7]" />
          </button>

          <div
            onClick={() => setPortalMode('landing')}
            className="flex items-center space-x-2 cursor-pointer select-none truncate"
          >
            <InstituteLogo
              className="w-7 h-7 rounded shrink-0 shadow-2xs"
              imgClassName="w-7 h-7 object-contain rounded"
              fallbackType="grid"
            />
            <div className="truncate">
              <span className="text-xs font-extrabold text-gray-950 block truncate leading-tight">
                {settings?.instituteName?.split(' ')[0] || 'Gyansai'}
              </span>
              <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-wider block leading-tight">
                {portalMode === 'admin' ? `Admin · ${currentActiveTab}` : `Student · ${currentActiveTab}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={portalMode === 'admin' ? () => setPortalMode('student') : requestAdminAccess}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#002FA7] font-semibold text-[11px] rounded border border-blue-200 transition cursor-pointer"
          >
            {portalMode === 'admin' ? 'Student' : 'Admin'}
          </button>
        </div>
      </div>

      {/* 2. MOBILE SLIDE-OUT DRAWER OVERLAY (Visible on screens < md when open) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Body */}
          <aside className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setPortalMode('landing');
                }}
                className="flex items-center space-x-2.5 cursor-pointer"
              >
                <InstituteLogo
                  className="w-8 h-8 rounded shrink-0 shadow-2xs"
                  imgClassName="w-8 h-8 object-contain rounded"
                  fallbackType="grid"
                />
                <div>
                  <div className="text-sm font-extrabold text-gray-950 leading-tight">
                    {settings?.instituteName || 'Gyansai Maths'}
                  </div>
                  <div className="text-[10px] font-mono tracking-wider text-blue-700 font-bold uppercase">
                    {portalMode === 'admin' ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            {renderNavList()}

            {/* Footer user profile & sign out */}
            {renderFooter()}
          </aside>
        </div>
      )}

      {/* 3. DESKTOP PERMANENT SIDEBAR (Visible on screens >= md) */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 flex-col shrink-0 h-screen select-none sticky top-0">
        {/* Top Header Logo */}
        <div
          onClick={() => setPortalMode('landing')}
          className="p-4 flex items-center space-x-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition"
        >
          <InstituteLogo
            className="w-8 h-8 rounded shrink-0 shadow-2xs"
            imgClassName="w-8 h-8 object-contain rounded"
            fallbackType="grid"
          />
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-gray-950 leading-tight truncate">
              {settings?.instituteName?.split(' ')[0] || 'Gyansai'}
            </div>
            <div className="text-[10px] font-mono tracking-wider text-gray-400 uppercase leading-none mt-0.5">
              {portalMode === 'admin' ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}
            </div>
          </div>
        </div>

        {/* Nav list */}
        {renderNavList()}

        {/* Footer */}
        {renderFooter()}
      </aside>
    </>
  );
};
