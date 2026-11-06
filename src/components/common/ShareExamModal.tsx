import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Share2, X, Copy, Check, MessageSquare, Mail, QrCode, Sparkles, ExternalLink, Link2 } from 'lucide-react';
import QRCode from 'qrcode';
import { generateExamShareUrl } from '../../utils/examShare';

export const ShareExamModal: React.FC = () => {
  const {
    activeExamIdForShare,
    setActiveExamIdForShare,
    exams,
    questions,
    showToast
  } = usePortal();

  const [copiedType, setCopiedType] = useState<'smart' | 'short' | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [linkTab, setLinkTab] = useState<'smart' | 'short'>('smart');

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

  // Complete self-hydrating link that works everywhere
  const smartShareUrl = useMemo(() => {
    if (!currentExam) return '';
    return generateExamShareUrl(currentExam, relevantQuestions);
  }, [currentExam, relevantQuestions]);

  // Clean short slug URL
  const shortSlugUrl = useMemo(() => {
    if (!currentExam) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gyansai-exam-portal.vercel.app';
    const slug = encodeURIComponent(currentExam.code || currentExam.id);
    return `${origin}/?exam=${slug}`;
  }, [currentExam]);

  const activeUrl = linkTab === 'smart' ? smartShareUrl : shortSlugUrl;

  useEffect(() => {
    if (smartShareUrl) {
      QRCode.toDataURL(smartShareUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#002FA7',
          light: '#FFFFFF'
        }
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR code error:', err));
    }
  }, [smartShareUrl]);

  if (!activeExamIdForShare || !currentExam) return null;

  const handleCopy = (type: 'smart' | 'short') => {
    const urlToCopy = type === 'smart' ? smartShareUrl : shortSlugUrl;
    navigator.clipboard.writeText(urlToCopy);
    setCopiedType(type);
    showToast(`${type === 'smart' ? 'Unique Smart Exam Link' : 'Short Exam Link'} copied to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 *GYANSAI MATHS IIT CENTER — Online CBT Exam*\n\n` +
      `📝 *Exam:* ${currentExam.title}\n` +
      `📌 *Code:* ${currentExam.code}\n` +
      `⏱️ *Duration:* ${currentExam.durationMinutes} Minutes\n` +
      `🏆 *Marking:* +${currentExam.positiveMarks || 4} / ${currentExam.negativeMarks || -1}\n\n` +
      `👉 *Click to Attempt Test:* ${smartShareUrl}\n\n` +
      `_No prior app installation needed. Open link directly on any mobile or laptop._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Exam Invitation: ${currentExam.title} - Gyansai Maths IIT Center`);
    const body = encodeURIComponent(
      `Hello Aspirant,\n\nYou are invited to attempt the following online examination:\n\n` +
      `Exam: ${currentExam.title} (${currentExam.code})\n` +
      `Duration: ${currentExam.durationMinutes} mins\n` +
      `Total Marks: ${currentExam.totalMarks || 100}\n\n` +
      `Click this link to start your test immediately:\n${smartShareUrl}\n\n` +
      `Best regards,\nGyansai Maths IIT Center`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleTestLinkInNewTab = () => {
    window.open(activeUrl, '_blank');
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
              <span className="font-mono text-[11px] font-bold text-[#002FA7] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {currentExam.code}
              </span>
            </div>
            <p className="text-gray-500 font-mono text-[11px] mt-0.5">
              Folder: {currentExam.folderName || 'Assessments'} &bull; Duration: {currentExam.durationMinutes} mins
            </p>
          </div>

          {/* Link Type Tabs */}
          <div className="flex border-b border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setLinkTab('smart')}
              className={`pb-2 px-3 font-semibold flex items-center space-x-1 cursor-pointer transition ${
                linkTab === 'smart'
                  ? 'border-b-2 border-[#002FA7] text-[#002FA7]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Direct Link (Universal)</span>
            </button>
            <button
              type="button"
              onClick={() => setLinkTab('short')}
              className={`pb-2 px-3 font-semibold flex items-center space-x-1 cursor-pointer transition ${
                linkTab === 'short'
                  ? 'border-b-2 border-[#002FA7] text-[#002FA7]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Link2 className="w-3.5 h-3.5 text-gray-500" />
              <span>Short Slug Link</span>
            </button>
          </div>

          {/* URL Box */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>{linkTab === 'smart' ? 'SELF-HYDRATING PAYLOAD URL' : 'CLEAN SLUG URL'}</span>
              <button
                type="button"
                onClick={handleTestLinkInNewTab}
                className="text-[#002FA7] hover:underline font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded font-mono text-[11px] text-gray-800 break-all select-all max-h-20 overflow-y-auto">
              {activeUrl}
            </div>
          </div>

          {/* 2x2 Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleCopy(linkTab)}
              className="py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs transition"
            >
              {copiedType === linkTab ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#002FA7]" />}
              <span>{copiedType === linkTab ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Share</span>
            </button>

            <button
              type="button"
              onClick={handleEmail}
              className="py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs transition"
            >
              <Mail className="w-4 h-4 text-gray-600" />
              <span>Email Invite</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy('smart')}
              className="py-2.5 px-4 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#002FA7] font-semibold rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Copy Smart Link</span>
            </button>
          </div>

          {/* QR Code Graphic Display */}
          <div className="pt-2 flex flex-col items-center justify-center border-t border-gray-100">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-2">
              Scan QR to Attempt on Mobile
            </span>
            <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-2xs">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Exam QR Code" className="w-40 h-40 object-contain" />
              ) : (
                <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                  Loading QR...
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-mono mt-2 text-center">
              Candidate can scan directly using any smartphone camera
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
