import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { BookOpen, Plus, Download, Trash2, FileText, X, Upload } from 'lucide-react';
import { StudyMaterial } from '../../types';

export const StudyMaterialView: React.FC = () => {
  const { studyMaterials, addStudyMaterial, deleteStudyMaterial, showToast } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'Formula Sheet' | 'DPP' | 'Notes'>('Notes');
  const [description, setDescription] = useState('');
  const [fileData, setFileData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSizeStr(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileData(reader.result);
        showToast(`File "${file.name}" loaded.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dummyContent = `data:text/plain;charset=utf-8,${encodeURIComponent(`Gyansai Maths IIT Center - Study Material\nTitle: ${title}\nSubject: ${subject}\nTopic: ${topic || 'General'}\n\nKey Concepts & Formulas curated by Prof. KT Sir.`)}`;

    addStudyMaterial({
      title: title.trim(),
      subject,
      topic: topic.trim() || 'Calculus & Geometry',
      batchIds: ['batch-1', 'batch-2'],
      fileType,
      fileSize: fileSizeStr || `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      url: fileData || dummyContent,
      description: description || 'Classroom material authored by KT Sir'
    });

    setTitle('');
    setTopic('');
    setDescription('');
    setFileData('');
    setFileName('');
    setFileSizeStr('');
    setModalOpen(false);
    showToast(`Material "${title}" published.`);
  };

  const handleDownload = (mat: StudyMaterial) => {
    const downloadUrl = mat.url && mat.url.startsWith('data:') ? mat.url : `data:text/plain;charset=utf-8,${encodeURIComponent(`Gyansai Maths IIT Center - ${mat.title}\nSubject: ${mat.subject}\nTopic: ${mat.topic}\n\nContents verified by IIT Faculty.`)}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${mat.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${mat.fileType === 'PDF' ? 'pdf' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded "${mat.title}"`);
  };

  const handleDelete = (mat: StudyMaterial) => {
    deleteStudyMaterial(mat.id);
    showToast(`Study material "${mat.title}" removed.`);
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // REPOSITORY
          </div>
          <h2 className="text-xl font-extrabold text-gray-950 tracking-tight">
            Study Material & Formula Books
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-0.5">
            Handwritten notes, Daily Practice Problems (DPP), and cheat sheets for students
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Material</span>
        </button>
      </div>

      {studyMaterials.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500">
          No study materials available. Click &quot;Upload Material&quot; to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyMaterials.map(mat => (
            <div key={mat.id} className="bg-white rounded-sm border border-gray-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between hover:border-gray-300 transition">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[#002FA7] font-bold text-[10px] uppercase font-mono">
                    {mat.fileType}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{mat.fileSize}</span>
                </div>

                <h3 className="font-bold text-gray-950 text-sm mt-2">{mat.title}</h3>
                <p className="text-gray-500 text-[11px] mt-0.5">{mat.subject} &bull; {mat.topic}</p>

                {mat.description && (
                  <p className="text-gray-600 text-[11px] mt-2 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">
                    {mat.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">
                  {mat.uploadedAt} &bull; {mat.downloadCount} Downloads
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(mat)}
                    className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-gray-500" />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(mat)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition"
                    title="Delete Material"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Upload New Study Material
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Real file upload input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Document / PDF / Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-gray-600 font-medium">
                    {fileName ? fileName : 'Click to select file (PDF, DOC, Images)'}
                  </span>
                  {fileSizeStr && <span className="text-[10px] text-gray-400 font-mono mt-0.5">{fileSizeStr}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Definite Integrals Short Formula Booklet"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Material Type
                  </label>
                  <select
                    value={fileType}
                    onChange={e => setFileType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  >
                    <option value="Notes">Class Notes</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="DPP">Daily Practice Problem</option>
                    <option value="PDF">Reference PDF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chapter / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coordinate Geometry"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief summary or reading instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold rounded cursor-pointer"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
