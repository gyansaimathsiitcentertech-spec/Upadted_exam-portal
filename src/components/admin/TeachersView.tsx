import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { GraduationCap, Plus, Mail, Phone, BookOpen, Trash2, Edit2, X } from 'lucide-react';
import { Teacher } from '../../types';

export const TeachersView: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, batches } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [designation, setDesignation] = useState('Senior Faculty');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        name,
        subject,
        designation,
        phone,
        email,
        qualification
      });
      setEditingTeacher(null);
    } else {
      addTeacher({
        name,
        subject,
        designation,
        phone: phone || '+91 94227 00000',
        email: email || 'faculty@gyansaimaths.com',
        assignedBatchIds: ['batch-1'],
        qualification: qualification || 'M.Sc. / B.Tech IIT',
        status: 'Active'
      });
    }

    setName('');
    setPhone('');
    setEmail('');
    setQualification('');
    setModalOpen(false);
  };

  const handleStartEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setSubject(t.subject);
    setDesignation(t.designation);
    setPhone(t.phone);
    setEmail(t.email);
    setQualification(t.qualification);
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Faculty & Teachers Directory
          </h2>
          <p className="text-[11px] text-slate-500">
            Teaching staff led by Prof. Taterao Kendre (KT Sir) & Subject Experts
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTeacher(null);
            setName('');
            setSubject('Mathematics');
            setDesignation('Senior Faculty');
            setPhone('');
            setEmail('');
            setQualification('');
            setModalOpen(true);
          }}
          className="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Faculty</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{teacher.name}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">{teacher.designation}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {teacher.status}
                </span>
              </div>

              <div className="space-y-1.5 pt-3 text-[11px] text-slate-600">
                <div className="flex items-center space-x-2">
                  <strong className="text-slate-800">Subject:</strong>
                  <span>{teacher.subject}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <strong className="text-slate-800">Qualification:</strong>
                  <span>{teacher.qualification}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <strong className="text-slate-800">Email:</strong>
                  <span className="text-slate-500 font-mono">{teacher.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <strong className="text-slate-800">Contact:</strong>
                  <span className="text-slate-500 font-mono">{teacher.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Active in {teacher.assignedBatchIds.length} Classroom Batches
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => handleStartEdit(teacher)}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTeacher(teacher.id);
                  }}
                  className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  title="Remove faculty"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 uppercase">
                {editingTeacher ? 'Edit Faculty Details' : 'Add New Faculty Member'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Faculty Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Subject Specialization
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Degrees & Experience
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={e => setQualification(e.target.value)}
                  placeholder="e.g. M.Sc. Mathematics, 10 Years IIT Teaching"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A8A] text-white font-bold rounded"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
