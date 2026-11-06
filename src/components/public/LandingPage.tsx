import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Camera,
  Shield,
  Trophy,
  BarChart3,
  BookOpen,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Menu,
  X
} from 'lucide-react';
import { InstituteLogo } from '../common/InstituteLogo';

export const LandingPage: React.FC = () => {
  const {
    settings,
    setPortalMode,
    setActiveAdminTab,
    setActiveStudentTab,
    courses,
    testSeries,
    exams,
    setActiveExamIdForShare,
    setAuthModalOpen,
    setAuthModalTab,
    requestAdminAccess
  } = usePortal();

  const [showAdmissionsModal, setShowAdmissionsModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartMock = () => {
    if (exams.length > 0) {
      setActiveExamIdForShare(exams[0].id);
      setPortalMode('public_exam');
    } else {
      setPortalMode('student');
    }
  };

  const handleExploreCourses = () => {
    const el = document.getElementById('featured-courses-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLogin = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      requestAdminAccess();
    } else {
      setPortalMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-blue-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          {/* Left: Institute Logo & Name */}
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              setPortalMode('landing');
            }}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none truncate"
          >
            {/* Dynamic Institute Logo */}
            <InstituteLogo
              className="w-9 h-9 sm:w-11 sm:h-11 shrink-0"
              imgClassName="max-h-9 max-w-9 sm:max-h-11 sm:max-w-11 object-contain rounded"
              fallbackType="emblem"
            />
            <div className="truncate">
              <div className="font-bold text-sm sm:text-base text-gray-900 tracking-tight leading-none truncate">
                {settings?.instituteName || 'Gyansai Maths IIT Center'}
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-1 leading-none">
                {settings?.storageTag || 'STORAGE'}
              </div>
            </div>
          </div>

          {/* Center Links (Desktop only) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium text-gray-700">
            <a href="#features" className="hover:text-blue-700 transition">Features</a>
            <a href="#featured-courses-section" className="hover:text-blue-700 transition">Courses</a>
            <a href="#test-series-section" className="hover:text-blue-700 transition">Test Series</a>
            <a href="#contact-section" className="hover:text-blue-700 transition">Contact</a>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-3 text-sm">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('signup');
                setPortalMode('login');
              }}
              className="px-3.5 py-2 text-gray-700 hover:text-gray-900 font-medium cursor-pointer"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => handleOpenLogin('student')}
              className="px-3.5 py-2 border border-gray-300 rounded text-gray-800 hover:bg-gray-50 font-medium cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleOpenLogin('admin')}
              className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold rounded cursor-pointer transition shadow-2xs"
            >
              Admin
            </button>
          </div>

          {/* Mobile Right Controls: Fast Login + Hamburger Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => handleOpenLogin('student')}
              className="px-3 py-1.5 bg-[#002FA7] text-white text-xs font-semibold rounded"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-1.5 border border-gray-200 rounded text-gray-700 hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white px-5 py-4 space-y-3.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-gray-800">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-700"
              >
                Features
              </a>
              <a
                href="#featured-courses-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-700"
              >
                Courses & Batches
              </a>
              <a
                href="#test-series-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-700"
              >
                Test Series & DPPs
              </a>
              <a
                href="#contact-section"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-700"
              >
                Contact & Address
              </a>
            </nav>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenLogin('student');
                }}
                className="py-2.5 bg-blue-50 border border-blue-200 text-[#002FA7] font-bold rounded text-center"
              >
                Student Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalTab('signup');
                  setPortalMode('login');
                }}
                className="py-2.5 bg-white border border-gray-300 text-gray-800 font-semibold rounded text-center"
              >
                Sign Up
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenLogin('admin');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded text-center"
            >
              Faculty / Admin Console →
            </button>
          </div>
        )}
      </header>

      {/* Hero Section - Exact replica of Screenshot 459 */}
      <section className="border-b border-gray-200 pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-7">
            <div className="text-xs font-mono font-medium tracking-widest text-gray-500 uppercase">
              // JEE · NEET · MHT-CET · OLYMPIADS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.1]">
              Where numbers meet destiny.
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              India's most rigorous online examination & learning platform for IIT-JEE, NEET and MHT-CET aspirants.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleStartMock}
                className="px-7 py-3.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-sm rounded flex items-center space-x-2 cursor-pointer shadow-xs transition"
              >
                <span>Start Free Mock Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExploreCourses}
                className="px-6 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded cursor-pointer transition"
              >
                Explore Courses
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-950">12K+</div>
                <div className="text-xs font-mono font-medium text-gray-500 uppercase tracking-wider mt-1">
                  STUDENTS
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-950">840+</div>
                <div className="text-xs font-mono font-medium text-gray-500 uppercase tracking-wider mt-1">
                  MOCKS
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-950">1.2L+</div>
                <div className="text-xs font-mono font-medium text-gray-500 uppercase tracking-wider mt-1">
                  QUESTIONS
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card - Branded Gyansai Exam Portal Graphic */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg border border-gray-200 overflow-hidden shadow-lg bg-white group hover:shadow-xl transition-all">
              <img
                src="/assets/aistudio/image_40fcb04d.png"
                alt="Gyansai Maths IIT Center Exam Portal"
                className="w-full h-auto object-cover group-hover:scale-101 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-[#002FA7]/95 backdrop-blur-xs text-white px-3 py-1 font-mono text-xs font-bold rounded-xs tracking-wider border border-blue-400/40 flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>CBT PORTAL V2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Modules Strip matching the Exam Portal Graphic */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold tracking-wider text-gray-500 uppercase">
              // COMPLETE MATHEMATICS ASSESSMENT SUITE
            </span>
            <span className="text-xs text-blue-800 font-semibold mt-1 md:mt-0">
              Online Examination & Practice Platform for 11th & 12th Mathematics
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'Topic Tests', desc: 'Micro-topic problem sets', icon: '☑' },
              { title: 'Chapterwise Tests', desc: 'Algebra, Calculus & Vectors', icon: '📚' },
              { title: 'Previous Year Papers', desc: 'JEE & MHT-CET archives', icon: '📝' },
              { title: 'Mock Tests', desc: 'Full length 3-hr simulations', icon: '🎯' },
              { title: 'Detailed Analytics', desc: 'Accuracy & time heatmaps', icon: '📊' },
              { title: 'Performance Tracking', desc: 'All-India percentile rank', icon: '🏆' }
            ].map((module, i) => (
              <div
                key={i}
                onClick={handleStartMock}
                className="bg-gray-50/70 border border-gray-200 rounded p-3 hover:border-blue-400 hover:bg-white hover:shadow-xs transition cursor-pointer group"
              >
                <div className="text-base mb-1.5">{module.icon}</div>
                <div className="font-bold text-xs text-gray-900 group-hover:text-blue-700 transition-colors">
                  {module.title}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {module.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY GYANSAI Features Section - Exact replica of Screenshot 460 */}
      <section id="features" className="py-20 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="text-xs font-mono font-medium tracking-widest text-gray-500 uppercase mb-2">
              // WHY GYANSAI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              An exam platform engineered for top-1% aspirants.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. AI Question Import */}
            <div className="p-8 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition">
              <div className="w-10 h-10 border border-blue-200 rounded text-blue-600 flex items-center justify-center mb-5">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Question Import</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload a photo or PDF of any paper — our GPT-4o OCR pipeline extracts questions, options & answers, ready to publish.
              </p>
            </div>

            {/* 2. Live Proctoring */}
            <div className="p-8 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition">
              <div className="w-10 h-10 border border-blue-200 rounded text-blue-600 flex items-center justify-center mb-5">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Proctoring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Webcam face detection, tab-switch monitoring, fullscreen lock & violation logs. Cheat-proof exams.
              </p>
            </div>

            {/* 3. All-India Ranking */}
            <div className="p-8 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition">
              <div className="w-10 h-10 border border-blue-200 rounded text-blue-600 flex items-center justify-center mb-5">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">All-India Ranking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Real-time leaderboards, percentile, accuracy and subject-wise topic analysis after every attempt.
              </p>
            </div>

            {/* 4. Deep Analytics */}
            <div className="p-8 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition">
              <div className="w-10 h-10 border border-blue-200 rounded text-blue-600 flex items-center justify-center mb-5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Deep Analytics</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Heatmaps, time-per-question, difficulty curves — for both students and institute admins.
              </p>
            </div>

            {/* 5. Course Library */}
            <div className="p-8 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition">
              <div className="w-10 h-10 border border-blue-200 rounded text-blue-600 flex items-center justify-center mb-5">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Course Library</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                200+ recorded video lectures, notes & assignments mapped to JEE/NEET syllabi.
              </p>
            </div>

            {/* 6. Smart Test Series */}
            <div className="p-8 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition">
              <div className="w-10 h-10 border border-blue-200 rounded text-blue-600 flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Test Series</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sell test series with coupons, UPI payments, instant access — all from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES - Exact replica of Screenshot 461 */}
      <section id="featured-courses-section" className="py-20 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono font-medium tracking-widest text-gray-500 uppercase mb-2">
                // FEATURED COURSES
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                Crafted by top IIT/AIIMS faculty.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveStudentTab('Courses');
                setPortalMode('student');
              }}
              className="text-sm font-semibold text-gray-800 hover:text-blue-700 flex items-center space-x-1 border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 cursor-pointer transition w-fit"
            >
              <span>See all courses</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-sm bg-white overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / grey box */}
                  <div className="h-44 bg-gray-100 border-b border-gray-200 relative">
                    <img
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80"
                      alt={course.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">
                      {course.subject || 'MATHEMATICS'}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-gray-950">
                    ₹{course.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStudentTab('Courses');
                      setPortalMode('student');
                    }}
                    className="px-4 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded cursor-pointer"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEST SERIES - Exact replica of Screenshot 462 & 463 */}
      <section id="test-series-section" className="py-20 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="text-xs font-mono font-medium tracking-widest text-gray-500 uppercase mb-2">
              // TEST SERIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
              Compete with India's brightest minds.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testSeries.map((ts) => (
              <div
                key={ts.id}
                className="border border-gray-200 rounded-sm p-6 bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">
                    TEST SERIES
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 mb-2">
                    {ts.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    {ts.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-2xl font-extrabold text-gray-950">₹{ts.price}</span>
                      <span className="text-xs text-gray-500 block font-mono mt-0.5">
                        {ts.testCount} mock tests
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStudentTab('Test Series');
                        setPortalMode('student');
                      }}
                      className="px-5 py-2 bg-[#002FA7] hover:bg-blue-800 text-white text-xs font-semibold rounded cursor-pointer transition shadow-2xs"
                    >
                      Buy now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Exact replica of Screenshot 463 */}
      <footer id="contact-section" className="pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-gray-200">
            {/* Col 1: Institute Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <InstituteLogo
                  className="w-8 h-8"
                  imgClassName="max-h-8 max-w-8 object-contain rounded"
                  fallbackType="book"
                />
                <span className="font-bold text-base text-gray-900">
                  {settings?.instituteName || 'Gyansai Maths IIT Center'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">
                {settings?.tagline || 'TEST tagline 1781422274'}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
                {settings?.address || 'Maths IIT Center, Eknath Rang Mandir Rd, New Usmanpura, Chhatrapati Sambhajinagar'}
              </p>
            </div>

            {/* Col 2: Contact */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                CONTACT
              </div>
              <div className="space-y-1.5 text-xs text-gray-700">
                <p className="font-medium">+91 9970603939</p>
                <p className="text-gray-600">gyansaimathiitcentertec@gmail.com</p>
                <p className="text-blue-700 hover:underline">
                  https://gyansaimathsiitcenter.co.in/
                </p>
              </div>
            </div>

            {/* Col 3: Quick Links */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold tracking-widest text-gray-400 uppercase">
                QUICK LINKS
              </div>
              <div className="flex flex-col space-y-2 text-xs font-medium text-gray-700">
                <button
                  type="button"
                  onClick={() => handleOpenLogin('student')}
                  className="text-left hover:text-blue-700 cursor-pointer"
                >
                  Student Login
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenLogin('admin')}
                  className="text-left hover:text-blue-700 cursor-pointer"
                >
                  Admin Login
                </button>
                <a href="#featured-courses-section" className="hover:text-blue-700">
                  Courses
                </a>
                <a href="#test-series-section" className="hover:text-blue-700">
                  Test Series
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <div>
              © 2026 Gyansai Maths IIT Center — All rights reserved.
            </div>
            <div className="font-mono text-gray-400">
              Built for India's toughest entrance exams.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
