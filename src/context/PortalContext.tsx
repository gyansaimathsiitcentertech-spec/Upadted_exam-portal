import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  Batch,
  Teacher,
  Question,
  ExamFolder,
  Exam,
  ExamAttempt,
  AttendanceRecord,
  StudyMaterial,
  NotificationItem,
  Course,
  TestSeries,
  PaymentTransaction,
  InstituteSettings
} from '../types';
import {
  INITIAL_INSTITUTE_SETTINGS,
  INITIAL_USERS,
  INITIAL_BATCHES,
  INITIAL_TEACHERS,
  INITIAL_QUESTIONS,
  INITIAL_EXAM_FOLDERS,
  INITIAL_EXAMS,
  INITIAL_ATTEMPTS,
  INITIAL_ATTENDANCE,
  INITIAL_STUDY_MATERIAL,
  INITIAL_NOTIFICATIONS,
  INITIAL_COURSES,
  INITIAL_TEST_SERIES,
  INITIAL_PAYMENTS
} from '../data/initialData';
import { decodeExamFromUrl } from '../utils/examShare';

export type PortalMode = 'landing' | 'login' | 'admin' | 'student' | 'public_exam' | 'taking_exam';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface PortalContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  isAdminAuthenticated: boolean;
  adminLoginModalOpen: boolean;
  setAdminLoginModalOpen: (open: boolean) => void;
  loginAdmin: (password: string, emailOrUsername?: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  requestAdminAccess: () => void;

  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  activeStudentTab: string;
  setActiveStudentTab: (tab: string) => void;

  activeExamIdForCBT: string | null;
  setActiveExamIdForCBT: (examId: string | null) => void;
  activeExamIdForShare: string | null;
  setActiveExamIdForShare: (examId: string | null) => void;
  activeExamForQuestionsModal: Exam | null;
  setActiveExamForQuestionsModal: (exam: Exam | null) => void;
  selectedAttemptForResult: ExamAttempt | null;
  setSelectedAttemptForResult: (attempt: ExamAttempt | null) => void;

  createFolderModalOpen: boolean;
  setCreateFolderModalOpen: (open: boolean) => void;
  createQuestionModalOpen: boolean;
  setCreateQuestionModalOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup';
  setAuthModalTab: (tab: 'login' | 'signup') => void;
  quickJoinModalOpen: boolean;
  setQuickJoinModalOpen: (open: boolean) => void;

  settings: InstituteSettings;
  updateSettings: (newSettings: Partial<InstituteSettings>) => void;

  users: User[];
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  updateBatch: (id: string, data: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, data: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  questions: Question[];
  addQuestion: (q: Omit<Question, 'id' | 'createdAt'>) => void;
  updateQuestion: (id: string, data: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  importQuestions: (newQuestions: Question[]) => void;

  folders: ExamFolder[];
  addFolder: (f: Omit<ExamFolder, 'id' | 'createdAt' | 'examCount'>) => void;
  updateFolder: (id: string, data: Partial<ExamFolder>) => void;
  deleteFolder: (id: string) => void;

  exams: Exam[];
  addExam: (e: Omit<Exam, 'id' | 'createdAt'>) => Exam;
  updateExam: (id: string, data: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  attempts: ExamAttempt[];
  recordAttempt: (att: Omit<ExamAttempt, 'id'>) => ExamAttempt;
  updateAttempt: (id: string, data: Partial<ExamAttempt>) => void;
  deleteAttempt: (id: string) => void;

  attendance: AttendanceRecord[];
  saveAttendance: (batchId: string, date: string, records: AttendanceRecord['records']) => void;

  studyMaterials: StudyMaterial[];
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  deleteStudyMaterial: (id: string) => void;

  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  deleteNotification: (id: string) => void;

  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'enrolledCount'>) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  testSeries: TestSeries[];
  addTestSeries: (ts: Omit<TestSeries, 'id' | 'enrolledCount'>) => void;
  updateTestSeries: (id: string, data: Partial<TestSeries>) => void;
  deleteTestSeries: (id: string) => void;

  payments: PaymentTransaction[];
  addPayment: (p: Omit<PaymentTransaction, 'id' | 'receiptNo' | 'date'>) => PaymentTransaction;
  verifyPayment: (id: string) => void;

  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  startExamForStudent: (examId: string, studentOverride?: User) => void;
  quickJoinAndStartExam: (
    name: string,
    phone: string,
    targetClassOrEmail: string,
    collegeNameOrTargetExam?: string,
    customRollNoOrExamCode?: string,
    examCodeOrIdParam?: string,
    optionalEmailParam?: string
  ) => void;
  resetAllToDefault: () => void;
}

const STORAGE_PREFIX = 'gyansai_test_portal_v1_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<InstituteSettings>(() =>
    loadFromStorage('settings', INITIAL_INSTITUTE_SETTINGS)
  );
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedStudent = sessionStorage.getItem('cbt_active_student');
      if (savedStudent) {
        return JSON.parse(savedStudent);
      }
    } catch {}
    const storedUsers = loadFromStorage('users', INITIAL_USERS);
    return storedUsers[0] || INITIAL_USERS[0];
  });
  const [batches, setBatches] = useState<Batch[]>(() => loadFromStorage('batches', INITIAL_BATCHES));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadFromStorage('teachers', INITIAL_TEACHERS));
  const [questions, setQuestions] = useState<Question[]>(() => loadFromStorage('questions', INITIAL_QUESTIONS));
  const [folders, setFolders] = useState<ExamFolder[]>(() => loadFromStorage('folders', INITIAL_EXAM_FOLDERS));
  const [exams, setExams] = useState<Exam[]>(() => loadFromStorage('exams', INITIAL_EXAMS));
  const [attempts, setAttempts] = useState<ExamAttempt[]>(() => loadFromStorage('attempts', INITIAL_ATTEMPTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', INITIAL_ATTENDANCE));
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => loadFromStorage('studyMaterials', INITIAL_STUDY_MATERIAL));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [courses, setCourses] = useState<Course[]>(() => loadFromStorage('courses', INITIAL_COURSES));
  const [testSeries, setTestSeries] = useState<TestSeries[]>(() => loadFromStorage('testSeries', INITIAL_TEST_SERIES));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    loadFromStorage('admin_auth', false)
  );
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState<boolean>(false);

  const [portalModeState, setPortalModeState] = useState<PortalMode>(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('cbt_active_taking_exam')) {
        return 'taking_exam';
      }
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes('/exam') ||
        path.includes('/share') ||
        path.includes('/test') ||
        search.includes('exam=') ||
        search.includes('share=') ||
        search.includes('test=')
      ) {
        return 'public_exam';
      }
      const isAuth = loadFromStorage('admin_auth', false);
      if (path.includes('/admin')) {
        return isAuth ? 'admin' : 'landing';
      }
      if (path.includes('/app') || path.includes('/student')) return 'student';
      if (path.includes('/login') || path.includes('/auth')) return 'login';
      return 'landing';
    } catch {
      return 'landing';
    }
  });

  const portalMode = portalModeState;

  const setPortalMode = (mode: PortalMode) => {
    if (mode === 'admin' && !isAdminAuthenticated) {
      setAdminLoginModalOpen(true);
      return;
    }
    setPortalModeState(mode);
    try {
      if (mode === 'landing') {
        window.history.pushState({}, '', '/');
      } else if (mode === 'student') {
        window.history.pushState({}, '', '/student');
      } else if (mode === 'login') {
        window.history.pushState({}, '', '/login');
      } else if (mode === 'admin') {
        window.history.pushState({}, '', '/admin');
      }
    } catch {
      // ignore
    }
  };
  const [activeAdminTab, setActiveAdminTab] = useState<string>('Dashboard');
  const [activeStudentTab, setActiveStudentTab] = useState<string>('Dashboard');

  const [activeExamIdForCBT, setActiveExamIdForCBT] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('cbt_active_taking_exam') || null;
    } catch {
      return null;
    }
  });
  const [activeExamIdForShare, setActiveExamIdForShare] = useState<string | null>(() => {
    try {
      const path = window.location.pathname;
      if (path.toLowerCase().includes('/exam/')) {
        const parts = path.split(/\/exam\//i);
        if (parts[1]) {
          const raw = decodeURIComponent(parts[1].split('/')[0].split('?')[0]);
          if (raw) return raw;
        }
      }
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('exam') || urlParams.get('test') || urlParams.get('share') || null;
    } catch {
      return null;
    }
  });
  const [activeExamForQuestionsModal, setActiveExamForQuestionsModal] = useState<Exam | null>(null);
  const [selectedAttemptForResult, setSelectedAttemptForResult] = useState<ExamAttempt | null>(null);

  const [createFolderModalOpen, setCreateFolderModalOpen] = useState<boolean>(false);
  const [createQuestionModalOpen, setCreateQuestionModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [quickJoinModalOpen, setQuickJoinModalOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Synchronized refs so resolveUrlRoute can read fresh state without triggering re-renders
  const examsRef = useRef(exams);
  useEffect(() => { examsRef.current = exams; }, [exams]);

  const questionsRef = useRef(questions);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  // Check URL pathname & query parameters on mount and on popstate for direct shared exam landing (/exam/:id or ?exam=CODE)
  useEffect(() => {
    const resolveUrlRoute = () => {
      try {
        // If candidate is actively taking an examination in CBT mode, NEVER kick them back to public_exam
        if (typeof window !== 'undefined' && sessionStorage.getItem('cbt_active_taking_exam')) {
          const takingId = sessionStorage.getItem('cbt_active_taking_exam');
          if (takingId) {
            setActiveExamIdForCBT(takingId);
          }
          setPortalModeState('taking_exam');
          return;
        }

        // 1. Check if the URL has a self-hydrating exam payload
        const decoded = decodeExamFromUrl();
        if (decoded && decoded.exam) {
          if (decoded.customQuestions && decoded.customQuestions.length > 0) {
            setQuestions(prev => {
              const existingIds = new Set(prev.map(q => q.id));
              const missing = decoded.customQuestions.filter(q => !existingIds.has(q.id));
              return missing.length > 0 ? [...missing, ...prev] : prev;
            });
          }

          setExams(prev => {
            const index = prev.findIndex(
              e => e.id.toLowerCase() === decoded.exam.id.toLowerCase() ||
                   e.code.toLowerCase() === decoded.exam.code.toLowerCase()
            );
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = { ...updated[index], ...decoded.exam };
              return updated;
            }
            return [decoded.exam, ...prev];
          });

          setActiveExamIdForShare(decoded.exam.id);
          setPortalModeState('public_exam');
          return;
        }

        const currentExams = examsRef.current;
        const currentQuestions = questionsRef.current;

        const path = window.location.pathname;
        const search = window.location.search;
        let examParam: string | null = null;

        if (path.toLowerCase().includes('/exam/')) {
          const parts = path.split(/\/exam\//i);
          if (parts[1]) {
            examParam = decodeURIComponent(parts[1].split('/')[0].split('?')[0]);
          }
        }
        if (!examParam) {
          const urlParams = new URLSearchParams(search);
          examParam = urlParams.get('exam') || urlParams.get('test') || urlParams.get('share');
        }
        if (!examParam && window.location.hash) {
          try {
            const hash = window.location.hash;
            if (hash.toLowerCase().includes('/exam/')) {
              const parts = hash.split(/\/exam\//i);
              if (parts[1]) examParam = decodeURIComponent(parts[1].split('/')[0].split('?')[0]);
            } else if (hash.includes('?')) {
              const hashParams = new URLSearchParams(hash.split('?')[1]);
              examParam = hashParams.get('exam') || hashParams.get('test') || hashParams.get('share');
            }
          } catch {}
        }

        if (examParam) {
          const found = currentExams.find(
            e => e.id.toLowerCase() === examParam!.toLowerCase() ||
                 e.code.toLowerCase() === examParam!.toLowerCase()
          );
          if (found) {
            setActiveExamIdForShare(found.id);
          } else {
            // Reconstruct exam shell for this code so it never shows incorrect fallback test
            const cleanCode = examParam.trim();
            const dynamicTitle = cleanCode.startsWith('GYAN-')
              ? `Gyansai Assessment (${cleanCode})`
              : cleanCode.replace(/[-_]/g, ' ');
            const titleLower = dynamicTitle.toLowerCase();
            const relevantForDynamic = currentQuestions.filter(q => {
              const qTopic = (q.topic || '').toLowerCase();
              const qText = (q.questionText || '').toLowerCase();
              const qSubject = (q.subject || '').toLowerCase();
              if (qSubject !== 'mathematics') return false;

              if (titleLower.includes('integration') || titleLower.includes('integral') || titleLower.includes('calculus')) {
                return qTopic.includes('integration') || qTopic.includes('calculus') || qText.includes('integral') || qText.includes('dx');
              }
              if (titleLower.includes('trigonometry') || titleLower.includes('trig')) {
                return qTopic.includes('trigonometry') || qText.includes('sin') || qText.includes('cos');
              }
              if (titleLower.includes('vector') || titleLower.includes('3d')) {
                return qTopic.includes('vector') || qTopic.includes('3d');
              }
              if (titleLower.includes('diff') || titleLower.includes('derivat')) {
                return qTopic.includes('diff') || qText.includes('dy/dx');
              }
              if (titleLower.includes('conic') || titleLower.includes('parabola') || titleLower.includes('ellipse')) {
                return qTopic.includes('conic') || qTopic.includes('parabola') || qTopic.includes('ellipse');
              }
              return true;
            });
            const assignedQuestions = (relevantForDynamic.length > 0
              ? relevantForDynamic
              : currentQuestions.filter(q => (q.subject || '').toLowerCase() === 'mathematics')
            ).slice(0, 10);

            const dynamicExam: Exam = {
              id: cleanCode,
              title: dynamicTitle,
              code: cleanCode,
              folderId: 'folder-1',
              folderName: 'Assessment Series',
              batchIds: [],
              durationMinutes: 180,
              totalMarks: assignedQuestions.length * 4 || 100,
              positiveMarks: 4,
              negativeMarks: -1,
              passPercentage: 40,
              targetClass: '11th & 12th',
              examCategory: 'IIT-JEE / CET',
              sections: [
                {
                  id: 'sec-1',
                  name: 'Mathematics Section',
                  subject: 'Mathematics',
                  questionIds: assignedQuestions.map(q => q.id),
                  instructions: '+4 for correct answer, -1 for wrong response.'
                }
              ],
              questions: assignedQuestions,
              startTime: new Date().toISOString().slice(0, 16),
              endTime: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 16),
              status: 'Live',
              isPublic: true,
              publicAccessUrl: window.location.href,
              instructions: [
                'Each question has four options with only ONE correct answer.',
                'Marking: +4 marks for correct response, -1 mark for wrong response.',
                'Submit the examination before the countdown timer expires.'
              ],
              createdAt: new Date().toISOString()
            };
            setExams(prev => [dynamicExam, ...prev]);
            setActiveExamIdForShare(dynamicExam.id);
          }
          setPortalModeState('public_exam');
        } else if (path.toLowerCase().startsWith('/exam')) {
          if (currentExams.length > 0) {
            setActiveExamIdForShare(currentExams[0].id);
          }
          setPortalModeState('public_exam');
        } else if (path.toLowerCase().includes('/login')) {
          setPortalModeState('login');
        } else if (path.toLowerCase().includes('/student') || path.toLowerCase().includes('/app')) {
          setPortalModeState('student');
        } else if (path.toLowerCase().includes('/admin')) {
          const isAuth = loadFromStorage('admin_auth', false);
          setPortalModeState(isAuth ? 'admin' : 'landing');
        }
      } catch (err) {
        console.error('Error resolving URL route:', err);
      }
    };

    resolveUrlRoute();
    window.addEventListener('popstate', resolveUrlRoute);
    return () => window.removeEventListener('popstate', resolveUrlRoute);
  }, []);

  // Sync to localStorage
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('users', users); }, [users]);
  useEffect(() => { saveToStorage('batches', batches); }, [batches]);
  useEffect(() => { saveToStorage('teachers', teachers); }, [teachers]);
  useEffect(() => { saveToStorage('questions', questions); }, [questions]);
  useEffect(() => { saveToStorage('folders', folders); }, [folders]);
  useEffect(() => { saveToStorage('exams', exams); }, [exams]);
  useEffect(() => { saveToStorage('attempts', attempts); }, [attempts]);
  useEffect(() => { saveToStorage('attendance', attendance); }, [attendance]);
  useEffect(() => { saveToStorage('studyMaterials', studyMaterials); }, [studyMaterials]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('courses', courses); }, [courses]);
  useEffect(() => { saveToStorage('testSeries', testSeries); }, [testSeries]);
  useEffect(() => { saveToStorage('payments', payments); }, [payments]);
  useEffect(() => { saveToStorage('admin_auth', isAdminAuthenticated); }, [isAdminAuthenticated]);

  // Dynamically sync browser tab favicon with custom logo/favicon
  useEffect(() => {
    try {
      const fav = settings?.faviconUrl || settings?.logoUrl;
      if (fav) {
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.head.appendChild(link);
        }
        link.href = fav;
      }
    } catch {
      // ignore in SSR / environments without document
    }
  }, [settings?.faviconUrl, settings?.logoUrl]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<InstituteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Institute settings saved successfully!');
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now(),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`User ${newUser.name} added successfully.`);
    return newUser;
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
    showToast('User record updated.');
  };

  const deleteUser = (id: string) => {
    const targetUser = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (targetUser) {
      setAttempts(prev => prev.filter(a => a.studentId !== id && a.studentName.toLowerCase() !== targetUser.name.toLowerCase()));
    }
    showToast(`Student ${targetUser?.name || ''} and associated exam results deleted.`);
  };

  const addBatch = (batchData: Omit<Batch, 'id'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: 'batch-' + Date.now()
    };
    setBatches(prev => [newBatch, ...prev]);
    showToast(`Batch "${newBatch.name}" created successfully.`);
  };

  const updateBatch = (id: string, data: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    showToast('Batch updated.');
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    showToast('Batch deleted.');
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: 'teacher-' + Date.now()
    };
    setTeachers(prev => [newTeacher, ...prev]);
    showToast(`Faculty "${newTeacher.name}" added successfully.`);
  };

  const updateTeacher = (id: string, data: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('Faculty updated.');
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast('Faculty removed.');
  };

  const addQuestion = (qData: Omit<Question, 'id' | 'createdAt'>) => {
    const newQ: Question = {
      ...qData,
      id: 'q-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuestions(prev => [newQ, ...prev]);
    showToast(`Question ${newQ.code} added to Question Bank.`);
  };

  const updateQuestion = (id: string, data: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
    showToast('Question updated.');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    showToast('Question deleted.');
  };

  const importQuestions = (newQuestions: Question[]) => {
    setQuestions(prev => [...newQuestions, ...prev]);
    showToast(`${newQuestions.length} questions imported successfully!`);
  };

  const addFolder = (fData: Omit<ExamFolder, 'id' | 'createdAt' | 'examCount'>) => {
    const newFolder: ExamFolder = {
      ...fData,
      id: 'folder-' + Date.now(),
      examCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFolders(prev => [newFolder, ...prev]);
    showToast(`Exam folder "${newFolder.name}" created.`);
  };

  const updateFolder = (id: string, data: Partial<ExamFolder>) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    showToast('Folder updated.');
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    showToast('Folder deleted.');
  };

  const addExam = (eData: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const newExam: Exam = {
      ...eData,
      id: 'exam-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExams(prev => [newExam, ...prev]);
    // increment folder count
    if (newExam.folderId) {
      setFolders(prev => prev.map(f => f.id === newExam.folderId ? { ...f, examCount: f.examCount + 1 } : f));
    }
    showToast(`Exam "${newExam.title}" created successfully!`);
    return newExam;
  };

  const updateExam = (id: string, data: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast('Exam updated.');
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('Exam deleted.');
  };

  const recordAttempt = (attData: Omit<ExamAttempt, 'id'>): ExamAttempt => {
    const newAtt: ExamAttempt = {
      ...attData,
      id: 'att-' + Date.now()
    };
    setAttempts(prev => [newAtt, ...prev]);
    showToast(`Exam submitted! Score: ${newAtt.totalScore}/${newAtt.maxScore}`);
    return newAtt;
  };

  const updateAttempt = (id: string, data: Partial<ExamAttempt>) => {
    setAttempts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    showToast('Submission updated.');
  };

  const deleteAttempt = (id: string) => {
    setAttempts(prev => prev.filter(a => a.id !== id));
    showToast('Attempt record removed.');
  };

  const saveAttendance = (batchId: string, date: string, records: AttendanceRecord['records']) => {
    const newRec: AttendanceRecord = {
      id: 'att-rec-' + Date.now(),
      batchId,
      date,
      records
    };
    setAttendance(prev => {
      const filtered = prev.filter(r => !(r.batchId === batchId && r.date === date));
      return [newRec, ...filtered];
    });
    showToast(`Attendance marked for ${records.length} students on ${date}.`);
  };

  const addStudyMaterial = (matData: Omit<StudyMaterial, 'id' | 'uploadedAt' | 'downloadCount'>) => {
    const newMat: StudyMaterial = {
      ...matData,
      id: 'mat-' + Date.now(),
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadCount: 0
    };
    setStudyMaterials(prev => [newMat, ...prev]);
    showToast(`Study material "${newMat.title}" uploaded.`);
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Study material deleted.');
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'createdAt'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: 'notif-' + Date.now(),
      createdAt: new Date().toLocaleString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast('Notification published to students.');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification removed.');
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: 'crs-' + Date.now(),
      enrolledCount: 0
    };
    setCourses(prev => [newCourse, ...prev]);
    showToast(`Course "${newCourse.title}" created.`);
  };

  const updateCourse = (id: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast('Course updated.');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    showToast('Course deleted.');
  };

  const addTestSeries = (tsData: Omit<TestSeries, 'id' | 'enrolledCount'>) => {
    const newTS: TestSeries = {
      ...tsData,
      id: 'ts-' + Date.now(),
      enrolledCount: 0
    };
    setTestSeries(prev => [newTS, ...prev]);
    showToast(`Test Series "${newTS.title}" created.`);
  };

  const updateTestSeries = (id: string, data: Partial<TestSeries>) => {
    setTestSeries(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast('Test Series updated.');
  };

  const deleteTestSeries = (id: string) => {
    setTestSeries(prev => prev.filter(t => t.id !== id));
    showToast('Test series deleted.');
  };

  const addPayment = (pData: Omit<PaymentTransaction, 'id' | 'receiptNo' | 'date'>): PaymentTransaction => {
    const receiptNo = `REC-GMI-2025-${(payments.length + 1).toString().padStart(3, '0')}`;
    const newPay: PaymentTransaction = {
      ...pData,
      id: 'pay-' + Date.now(),
      receiptNo,
      date: new Date().toLocaleString()
    };
    setPayments(prev => [newPay, ...prev]);
    showToast(`Payment of ₹${newPay.amount.toLocaleString()} recorded successfully!`);
    return newPay;
  };

  const verifyPayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Verified' } : p));
    showToast('Payment verified successfully.');
  };

  const startExamForStudent = (examId: string, studentOverride?: User) => {
    if (studentOverride) {
      setCurrentUser(studentOverride);
      try {
        sessionStorage.setItem('cbt_active_student', JSON.stringify(studentOverride));
      } catch {}
    }
    try {
      sessionStorage.setItem('cbt_active_taking_exam', examId);
    } catch {}
    setActiveExamIdForCBT(examId);
    setPortalModeState('taking_exam');
    try {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch {}
  };

  const quickJoinAndStartExam = (
    name: string,
    phone: string,
    targetClassOrEmail: string,
    collegeNameOrTargetExam?: string,
    customRollNoOrExamCode?: string,
    examCodeOrIdParam?: string,
    optionalEmailParam?: string
  ) => {
    let targetClass = '11th';
    let collegeName = '';
    let customRollNo = '';
    let examCodeOrId = '';
    let email = '';

    if (examCodeOrIdParam !== undefined) {
      // Direct call: (name, phone, targetClass, collegeName, customRollNo, examCodeOrId, optionalEmail)
      targetClass = targetClassOrEmail || '11th';
      collegeName = collegeNameOrTargetExam || '';
      customRollNo = customRollNoOrExamCode || '';
      examCodeOrId = examCodeOrIdParam;
      email = optionalEmailParam || `${phone.replace(/\D/g, '') || Date.now()}@quickjoin.gyansai.in`;
    } else {
      // Legacy call: (name, phone, email, targetExam, examCodeOrId)
      email = targetClassOrEmail;
      targetClass = collegeNameOrTargetExam || '11th';
      examCodeOrId = customRollNoOrExamCode || '';
      collegeName = '';
    }

    const assignedRollNo = customRollNo.trim() || `GMI-QJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanPhone = phone.trim().replace(/\D/g, '');

    // Locate the exact target exam from code or ID first
    const targetExamObj = exams.find(e =>
      (examCodeOrId && (e.id.toLowerCase() === examCodeOrId.toLowerCase() || e.code.toLowerCase() === examCodeOrId.toLowerCase())) ||
      (activeExamIdForShare && (e.id.toLowerCase() === activeExamIdForShare.toLowerCase() || e.code.toLowerCase() === activeExamIdForShare.toLowerCase()))
    ) || exams[0];

    const finalTargetClass = targetClass.startsWith('Class') ? targetClass : `Class ${targetClass}`;

    let student = users.find(u =>
      (cleanPhone && u.phone && u.phone.replace(/\D/g, '') === cleanPhone) ||
      (email && u.email && u.email.toLowerCase() === email.toLowerCase())
    );

    if (!student) {
      student = addUser({
        name: name.trim(),
        username: `qj_${cleanPhone || Date.now().toString().slice(-6)}`,
        email: email || `${cleanPhone || Date.now()}@quickjoin.gyansai.in`,
        phone: cleanPhone,
        role: 'student',
        rollNo: assignedRollNo,
        targetExam: `${finalTargetClass} IIT-JEE / CET`,
        collegeName: collegeName.trim(),
        batchName: 'Quick Join Candidate',
        assignedExamId: targetExamObj ? targetExamObj.id : undefined,
        assignedExamTitle: targetExamObj ? targetExamObj.title : undefined,
        joinedDate: new Date().toISOString().split('T')[0]
      });
    } else {
      const updatedData: Partial<User> = {
        name: name.trim(),
        phone: cleanPhone || student.phone,
        collegeName: collegeName.trim() || student.collegeName,
        targetExam: `${finalTargetClass} IIT-JEE / CET`,
        assignedExamId: targetExamObj ? targetExamObj.id : student.assignedExamId,
        assignedExamTitle: targetExamObj ? targetExamObj.title : student.assignedExamTitle
      };
      if (customRollNo.trim()) {
        updatedData.rollNo = customRollNo.trim();
      }
      student = { ...student, ...updatedData };
      updateUser(student.id, updatedData);
    }

    setCurrentUser(student);
    setQuickJoinModalOpen(false);
    startExamForStudent(targetExamObj.id, student);
  };

  const loginAdmin = (password: string, emailOrUsername?: string): { success: boolean; error?: string } => {
    const expectedPassword = (settings.adminPassword || 'admin123').trim();
    if (password.trim() === expectedPassword) {
      setIsAdminAuthenticated(true);
      saveToStorage('admin_auth', true);
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      setAdminLoginModalOpen(false);
      setPortalModeState('admin');
      setActiveAdminTab('Dashboard');
      showToast(`Admin access granted. Welcome, ${adminUser.name}!`);
      return { success: true };
    }
    return {
      success: false,
      error: 'Invalid administrator password. Please check your credentials.'
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    saveToStorage('admin_auth', false);
    const studentUser = users.find(u => u.role === 'student') || INITIAL_USERS[1];
    setCurrentUser(studentUser);
    setPortalModeState('landing');
    showToast('Signed out of Administrator Console.');
  };

  const requestAdminAccess = () => {
    if (isAdminAuthenticated) {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      setPortalModeState('admin');
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setSettings(INITIAL_INSTITUTE_SETTINGS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1] || INITIAL_USERS[0]);
    setBatches(INITIAL_BATCHES);
    setTeachers(INITIAL_TEACHERS);
    setQuestions(INITIAL_QUESTIONS);
    setFolders(INITIAL_EXAM_FOLDERS);
    setExams(INITIAL_EXAMS);
    setAttempts(INITIAL_ATTEMPTS);
    setAttendance(INITIAL_ATTENDANCE);
    setStudyMaterials(INITIAL_STUDY_MATERIAL);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCourses(INITIAL_COURSES);
    setTestSeries(INITIAL_TEST_SERIES);
    setPayments(INITIAL_PAYMENTS);
    setIsAdminAuthenticated(false);
    setAdminLoginModalOpen(false);
    setPortalModeState('landing');
    setActiveAdminTab('Dashboard');
    showToast('All data reset to initial Gyansai Maths IIT Center state.');
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        portalMode,
        setPortalMode,
        isAdminAuthenticated,
        adminLoginModalOpen,
        setAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        requestAdminAccess,
        activeAdminTab,
        setActiveAdminTab,
        activeStudentTab,
        setActiveStudentTab,
        activeExamIdForCBT,
        setActiveExamIdForCBT,
        activeExamIdForShare,
        setActiveExamIdForShare,
        activeExamForQuestionsModal,
        setActiveExamForQuestionsModal,
        selectedAttemptForResult,
        setSelectedAttemptForResult,
        createFolderModalOpen,
        setCreateFolderModalOpen,
        createQuestionModalOpen,
        setCreateQuestionModalOpen,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        quickJoinModalOpen,
        setQuickJoinModalOpen,
        settings,
        updateSettings,
        users,
        addUser,
        updateUser,
        deleteUser,
        batches,
        addBatch,
        updateBatch,
        deleteBatch,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        importQuestions,
        folders,
        addFolder,
        updateFolder,
        deleteFolder,
        exams,
        addExam,
        updateExam,
        deleteExam,
        attempts,
        recordAttempt,
        updateAttempt,
        deleteAttempt,
        attendance,
        saveAttendance,
        studyMaterials,
        addStudyMaterial,
        deleteStudyMaterial,
        notifications,
        addNotification,
        deleteNotification,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        testSeries,
        addTestSeries,
        updateTestSeries,
        deleteTestSeries,
        payments,
        addPayment,
        verifyPayment,
        toasts,
        showToast,
        removeToast,
        startExamForStudent,
        quickJoinAndStartExam,
        resetAllToDefault
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
