import { Exam, ExamSection, Question } from '../types';

export interface CompactExamPayload {
  id: string;
  title: string;
  code: string;
  folderId?: string;
  folderName?: string;
  durationMinutes: number;
  totalMarks: number;
  positiveMarks: number;
  negativeMarks: number;
  passPercentage?: number;
  targetClass?: string;
  examCategory?: string;
  instructions?: string[];
  qIds?: string[];
  questions?: Partial<Question>[];
  startTime?: string;
  endTime?: string;
}

/**
 * Encodes a string to URL-safe base64
 */
export function toBase64Url(str: string): string {
  try {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch {
    return encodeURIComponent(str);
  }
}

/**
 * Decodes a URL-safe base64 string
 */
export function fromBase64Url(base64Url: string): string {
  try {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    try {
      return decodeURIComponent(base64Url);
    } catch {
      return '';
    }
  }
}

/**
 * Generate a complete, self-hydrating shareable URL for an Exam.
 * When ANY user or student opens this URL on ANY device (even with no previous localStorage),
 * the app decodes the exam parameters and hydrates it into their state instantly.
 */
export function generateExamShareUrl(exam: Exam, customQuestions?: Question[], preferredBaseUrl?: string): string {
  const origin = preferredBaseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://gyansai-exam-portal.vercel.app');
  const examSlug = (exam.code || exam.id).trim().replace(/[^a-zA-Z0-9_-]/g, '-');

  const questionIds = (exam.sections && exam.sections.length > 0)
    ? exam.sections.flatMap(s => s.questionIds || [])
    : (exam.questions ? exam.questions.map((q: any) => q.id || q) : []);

  const payload: CompactExamPayload = {
    id: exam.id,
    title: exam.title,
    code: exam.code,
    folderId: exam.folderId,
    folderName: exam.folderName,
    durationMinutes: exam.durationMinutes,
    totalMarks: exam.totalMarks,
    positiveMarks: exam.positiveMarks,
    negativeMarks: exam.negativeMarks,
    passPercentage: exam.passPercentage || 40,
    targetClass: exam.targetClass || '11th',
    examCategory: exam.examCategory || 'JEE Mains',
    instructions: exam.instructions,
    qIds: questionIds,
    startTime: exam.startTime,
    endTime: exam.endTime
  };

  // If there are custom questions passed in, include their essentials
  if (customQuestions && customQuestions.length > 0) {
    payload.questions = customQuestions.map(q => ({
      id: q.id,
      code: q.code,
      subject: q.subject,
      topic: q.topic,
      type: q.type,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marksPositive: q.marksPositive,
      marksNegative: q.marksNegative,
      explanation: q.explanation
    }));
  }

  const encodedData = toBase64Url(JSON.stringify(payload));
  // Use root query param URL (/?exam=CODE&d=DATA) to prevent 404 on Vercel and any static hosting
  return `${origin}/?exam=${examSlug}&d=${encodedData}`;
}

/**
 * Decodes an exam and any bundled questions from the current URL
 */
export function decodeExamFromUrl(): { exam: Exam; customQuestions: Question[] } | null {
  if (typeof window === 'undefined') return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    let dataParam = searchParams.get('d') || searchParams.get('examData');

    // Also support hash parameters (e.g. /#/?d=... or /#/exam/...&d=...)
    if (!dataParam && window.location.hash) {
      try {
        const hashQuery = window.location.hash.split('?')[1];
        if (hashQuery) {
          const hashParams = new URLSearchParams(hashQuery);
          dataParam = hashParams.get('d') || hashParams.get('examData');
        }
      } catch {}
    }

    if (!dataParam) return null;

    const jsonStr = fromBase64Url(dataParam);
    if (!jsonStr) return null;

    const payload: CompactExamPayload = JSON.parse(jsonStr);
    if (!payload || !payload.title) return null;

    const qIds = payload.qIds || [];
    const sections: ExamSection[] = [
      {
        id: 'sec-1',
        name: 'General Assessment Section',
        subject: 'Mathematics & Science',
        questionIds: qIds,
        instructions: `+${payload.positiveMarks || 4} for correct answer, ${payload.negativeMarks || -1} for wrong response.`
      }
    ];

    const fullExam: Exam = {
      id: payload.id || `exam-${Date.now()}`,
      title: payload.title,
      code: payload.code || `GYAN-EXAM-${Math.floor(1000 + Math.random() * 9000)}`,
      folderId: payload.folderId || 'folder-1',
      folderName: payload.folderName || 'Online Tests',
      batchIds: [],
      durationMinutes: Number(payload.durationMinutes) || 60,
      totalMarks: Number(payload.totalMarks) || (qIds.length * (payload.positiveMarks || 4)) || 100,
      positiveMarks: Number(payload.positiveMarks) || 4,
      negativeMarks: Number(payload.negativeMarks) !== undefined ? Number(payload.negativeMarks) : -1,
      passPercentage: Number(payload.passPercentage) || 40,
      targetClass: payload.targetClass || '11th',
      examCategory: payload.examCategory || 'JEE Mains',
      sections,
      startTime: payload.startTime || new Date().toISOString().slice(0, 16),
      endTime: payload.endTime || new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      status: 'Live',
      isPublic: true,
      publicAccessUrl: window.location.href,
      instructions: payload.instructions && payload.instructions.length > 0 ? payload.instructions : [
        'Read each question carefully before submitting your answer.',
        `Marking Scheme: +${payload.positiveMarks || 4} for correct response, ${payload.negativeMarks || -1} for wrong response.`,
        'Use question palette to navigate between questions.',
        'Do not refresh or switch tabs during the examination.'
      ],
      createdAt: new Date().toISOString()
    };

    const customQuestions: Question[] = (payload.questions || []).map(q => ({
      id: q.id || `q-shared-${Date.now()}-${Math.random()}`,
      code: q.code || 'Q-SH',
      subject: q.subject || 'Mathematics',
      topic: q.topic || 'General Practice',
      type: q.type || 'single_choice',
      difficulty: 'Moderate',
      questionText: q.questionText || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer || 'A',
      marksPositive: q.marksPositive || 4,
      marksNegative: q.marksNegative !== undefined ? q.marksNegative : -1,
      explanation: q.explanation || '',
      createdAt: new Date().toISOString()
    }));

    return { exam: fullExam, customQuestions };
  } catch (err) {
    console.error('Failed to decode shared exam from URL:', err);
    return null;
  }
}
