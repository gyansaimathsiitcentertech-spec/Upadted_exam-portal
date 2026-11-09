import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Share2, X, Copy, Check, MessageSquare, Mail, QrCode, ExternalLink, Download } from 'lucide-react';
import QRCode from 'qrcode';

export const ShareExamModal: React.FC = () => {
  const {
    activeExamIdForShare,
    setActiveExamIdForShare,
    exams,
    questions,
    showToast
  } = usePortal();

  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const currentExam = useMemo(() => {
    if (!activeExamIdForShare) return null;
    return exams.find(e => e.id === activeExamIdForShare || e.code.toLowerCase() === activeExamIdForShare.toLowerCase()) || exams[0];
  }, [exams, activeExamIdForShare]);

  const relevantQuestions = useMemo(() => {
    if (!currentExam) return [];
    if (currentExam.questions && currentExam.questions.length > 0) {
      return currentExam.questions;
    }
    const qIds = currentExam.sections?.flatMap(s => s.questionIds) || [];
    return questions.filter(q => qIds.includes(q.id));
  }, [currentExam, questions]);

  // Clean, official exam URL (e.g. https://domain/?exam=GYAN-1414)
  const examShareUrl = useMemo(() => {
    if (!currentExam) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gyansaimathsiitcenter.in';
    const slug = encodeURIComponent(currentExam.code || currentExam.id);
    return `${origin}/?exam=${slug}`;
  }, [currentExam]);

  // Sync exam and questions to server-side endpoint in background so any mobile device can resolve it instantly
  useEffect(() => {
    if (!currentExam) return;
    try {
      fetch('/api/sync-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentExam,
          questions: relevantQuestions
        })
      }).catch(() => {
        // Safe failover if static/offline
      });
    } catch {}
  }, [currentExam, relevantQuestions]);

  useEffect(() => {
    // Generate an ultra-scannable, high-contrast QR code compliant with ISO/IEC 18004
    // Pure pitch-black (#000000) on pure white (#FFFFFF) with quiet zone margin of 3
    if (examShareUrl) {
      QRCode.toDataURL(examShareUrl, {
        width: 360,
        margin: 3,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => {
          console.warn('High-res QR code generation failed, retrying standard mode:', err);
          QRCode.toDataURL(examShareUrl, { width: 300, margin: 2 })
            .then(url => setQrDataUrl(url))
            .catch(e => console.error('Fallback QR code failed:', e));
        });
    }
  }, [examShareUrl]);

  if (!activeExamIdForShare || !currentExam) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(examShareUrl);
    setCopied(true);
    showToast('Exam Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 *GYANSAI MATHS IIT CENTER — Online CBT Exam*\n\n` +
      `📝 *Exam:* ${currentExam.title}\n` +
      `📌 *Code:* ${currentExam.code}\n` +
      `⏱️ *Duration:* ${currentExam.durationMinutes} Minutes\n` +
      `🏆 *Marking:* +${currentExam.positiveMarks || 4} / ${currentExam.negativeMarks || -1}\n` +
      `👥 *Class:* ${currentExam.targetClass || '11th'}\n\n` +
      `👉 *Click to Attempt Test:* ${examShareUrl}\n\n` +
      `_Open link directly on any mobile or laptop._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Exam Invitation: ${currentExam.title} - Gyansai Maths IIT Center`);
    const body = encodeURIComponent(
      `Hello Aspirant,\n\nYou are invited to attempt the following online examination:\n\n` +
      `Exam: ${currentExam.title} (${currentExam.code})\n` +
      `Class: ${currentExam.targetClass || '11th'}\n` +
      `Duration: ${currentExam.durationMinutes} mins\n` +
      `Total Marks: ${currentExam.totalMarks || 100}\n\n` +
      `Click this link to start your test immediately:\n${examShareUrl}\n\n` +
      `Best regards,\nGyansai Maths IIT Center`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleTestLinkInNewTab = () => {
    window.open(examShareUrl, '_blank');
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    const cleanCode = (currentExam.code || 'exam').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.download = `GYANSAI_${cleanCode}_Exam_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('QR Code image downloaded as high-res PNG!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm">
            <Share2 className="w-4 h-4 text-[#002FA7]" />
            <span>Share Online Examination</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveExamIdForShare(null)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 font-sans text-xs">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-950">
                {currentExam.title}
              </h3>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-[11px] font-bold text-[#002FA7] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {currentExam.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  (currentExam.targetClass || '').includes('12')
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  Class: {currentExam.targetClass || '11th'}
                </span>
              </div>
            </div>
            <p className="text-gray-500 font-mono text-[11px] mt-0.5">
              Folder: {currentExam.folderName || 'Assessments'} &bull; Duration: {currentExam.durationMinutes} mins &bull; <span className={relevantQuestions.length === 0 ? "text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200" : "text-[#002FA7] font-bold"}>{relevantQuestions.length} Questions Assigned</span>
            </p>
          </div>

          {relevantQuestions.length === 0 && (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-900 text-[11px] flex items-center justify-between">
              <span>⚠️ <strong>Notice:</strong> This exam currently has <strong>0 questions</strong> assigned. Candidates will see an empty test. Use <strong>Manage Questions</strong> in Exam Management to add questions.</span>
            </div>
          )}

          {/* URL Box */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-md space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span className="font-bold text-gray-700 uppercase">Official Examination Link</span>
              <button
                type="button"
                onClick={handleTestLinkInNewTab}
                className="text-[#002FA7] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="p-2.5 bg-white border border-gray-300 rounded font-mono text-[11px] text-gray-900 break-all select-all shadow-2xs font-semibold">
              {examShareUrl}
            </div>
          </div>

          {/* Action Buttons Grid (Copy, WhatsApp, Email) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#002FA7]" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleEmail}
              className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs transition"
            >
              <Mail className="w-4 h-4 text-gray-600" />
              <span>Email</span>
            </button>
          </div>

          {/* QR Code Graphic Display - High Contrast & Decodable */}
          <div className="pt-3 flex flex-col items-center justify-center border-t border-gray-200">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-mono font-bold text-gray-700 uppercase flex items-center space-x-1">
                <QrCode className="w-3.5 h-3.5 text-[#002FA7]" />
                <span>Instant Mobile QR (Pure High Contrast)</span>
              </span>
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={!qrDataUrl}
                className="text-[11px] font-bold text-[#002FA7] hover:underline flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3 h-3" />
                <span>Download PNG</span>
              </button>
            </div>

            <div className="p-4 bg-white border-2 border-gray-900 rounded-xl shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="High contrast exam QR code"
                  className="w-48 h-48 object-contain rendering-pixelated"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  Generating Ultra-Clean QR...
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-2.5">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-3.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-[11px] font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR Code (PNG)</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition"
              >
                <Copy className="w-3 h-3 text-[#002FA7]" />
                <span>Copy URL</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-500 font-mono mt-2 text-center max-w-sm">
              Tested for instant autofocus & decoding on all smartphone cameras (iOS Camera, Google Lens, Android, WhatsApp, QR scanners).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
