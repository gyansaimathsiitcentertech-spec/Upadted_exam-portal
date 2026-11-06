export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
  phone?: string;
  rollNo?: string;
  batchId?: string;
  batchName?: string;
  targetExam?: string; // 'JEE Main & Advanced 2025' | 'MHT-CET 2025' | etc.
  collegeName?: string;
  avatar?: string;
  joinedDate?: string;
  assignedExamId?: string;
  assignedExamTitle?: string;
}

export interface Batch {
  id: string;
  name: string;
  code: string;
  targetExam: string;
  timing: string;
  startDate: string;
  studentCount: number;
  assignedTeacherIds: string[];
  status: 'Active' | 'Completed' | 'Upcoming';
  description?: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string; // e.g. "Founder & Head of Mathematics (KT Sir)"
  subject: string;
  phone: string;
  email: string;
  assignedBatchIds: string[];
  qualification: string;
  status: 'Active' | 'On Leave';
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'numerical' | 'matrix_match';
export type DifficultyLevel = 'Easy' | 'Moderate' | 'Advanced IIT';

export interface QuestionOption {
  id: string;
  label: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  code: string;
  subject: string; // 'Mathematics' | 'Physics' | 'Chemistry'
  topic: string;
  type: QuestionType | string;
  difficulty: DifficultyLevel | string;
  questionText: string;
  imageUrl?: string;
  formulaNote?: string;
  year?: string;
  tag?: string;
  options: QuestionOption[];
  correctAnswer: string; // 'A' or 'A,C' or '12.5'
  marksPositive: number;
  marksNegative: number;
  explanation: string;
  createdAt: string;
}

export interface ExamFolder {
  id: string;
  name: string;
  description: string;
  examCount: number;
  category: string; // 'JEE Advanced' | 'JEE Main' | 'MHT-CET' | 'Foundation'
  createdAt: string;
}

export interface ExamSection {
  id: string;
  name: string; // e.g. "Section 1: Single Correct (SCQ)"
  subject: string;
  questionIds: string[];
  instructions?: string;
}

export interface Exam {
  id: string;
  title: string;
  code: string; // e.g. "GYAN-IIT-2025-01"
  folderId: string;
  folderName: string;
  batchIds: string[]; // empty means all or public
  durationMinutes: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  sections: ExamSection[];
  startTime: string;
  endTime: string;
  status: 'Active' | 'Draft' | 'Completed' | 'Published' | 'Live';
  isPublic: boolean;
  publicAccessUrl: string;
  instructions: string[];
  createdAt: string;
  passPercentage: number;
  targetClass?: string;
  examCategory?: string;
  questions?: any[];
  maxTabSwitches?: number;
  webcamEnabled?: boolean;
  randomizeQuestions?: boolean;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption?: string; // e.g. 'A' or '14.2'
  status: 'answered' | 'not_answered' | 'marked_for_review' | 'answered_and_marked' | 'not_visited';
  timeSpentSeconds: number;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  examCode: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentEmail: string;
  answers: Record<string, StudentAnswer>; // questionId -> answer
  totalScore: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  rank?: number;
  totalParticipants?: number;
  startedAt: string;
  submittedAt: string;
  timeTakenMinutes: number;
  status: 'In Progress' | 'Submitted' | 'Evaluated';
  tabSwitches?: string;
  snapshots?: number;
  violations?: { time: string; text: string }[];
  studentCollege?: string;
  studentPhone?: string;
  isQuickJoin?: boolean;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  date: string;
  records: {
    studentId: string;
    studentName: string;
    rollNo: string;
    status: 'Present' | 'Absent' | 'Late';
    remarks?: string;
  }[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  topic: string;
  batchIds: string[];
  fileType: 'PDF' | 'Formula Sheet' | 'DPP' | 'Notes';
  fileSize: string;
  uploadedAt: string;
  downloadCount: number;
  url: string;
  description?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: 'High' | 'Normal' | 'Urgent';
  target: 'All Students' | 'Selected Batch';
  batchName?: string;
  createdAt: string;
  author: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  subject?: string;
  description?: string;
  instructor: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  features: string[];
  enrolledCount: number;
  category: 'JEE Advanced' | 'JEE Main' | 'MHT-CET' | 'Class 11/12';
  status: 'Published' | 'Draft';
  thumbnailUrl?: string;
}

export interface TestSeries {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  testsCount: number;
  testCount?: number;
  price: number;
  discountedPrice?: number;
  validity: string;
  category: 'IIT-JEE' | 'MHT-CET' | 'Chapterwise';
  features: string[];
  enrolledCount: number;
  examIds: string[];
  status: 'Active' | 'Archived';
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  itemName: string;
  itemType: 'Course' | 'Test Series' | 'Institute Tuition Fee';
  amount: number;
  transactionId: string;
  paymentMode: 'UPI' | 'Netbanking' | 'Cash / Offline' | 'Credit/Debit Card';
  date: string;
  status: 'Verified' | 'Pending' | 'Failed';
  receiptNo: string;
}

export interface InstituteSettings {
  instituteName: string;
  tagline: string;
  directorName: string;
  directorDesignation: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  website: string;
  defaultNegativeMarking: number;
  defaultPositiveMarking: number;
  defaultExamDurationMinutes: number;
  allowResultReviewImmediately: boolean;
  watermarkRollNumber: boolean;
  enforceFullScreenInExam: boolean;
  academicYear: string;
  storageTag?: string;
  logoUrl?: string;
  logoSizeW?: string;
  logoSizeH?: string;
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  faviconUrl?: string;
  primaryColor?: string;
  upiId?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  upiQrCodeUrl?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  metaTitle?: string;
  metaDescription?: string;
  googleAnalyticsId?: string;
  adminPassword?: string;
}
