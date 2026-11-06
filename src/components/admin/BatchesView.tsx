import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Layers, Plus, Users, Clock, Calendar, Trash2, Edit2, X } from 'lucide-react';
import { Batch } from '../../types';

export const BatchesView: React.FC = () => {
  const { batches, addBatch, updateBatch, deleteBatch, users } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [targetExam, setTargetExam] = useState('IIT-JEE Advanced 2025');
  const [timing, setTiming] = useState('07:30 AM - 10:30 AM');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBatch) {
      updateBatch(editingBatch.id, {
        name,
        code,
        targetExam,
        timing,
        description
      });
      setEditingBatch(null);
    } else {
      addBatch({
        name,
        code: code || `GMI-B-${Math.floor(10 + Math.random() * 90)}`,
        targetExam,
        timing,
        startDate: new Date().toISOString().split('T')[0],
        studentCount: 25,
        assignedTeacherIds: ['teacher-1'],
        status: 'Active',
        description
      });
    }

    setName('');
    setCode('');
    setTiming('07:30 AM - 10:30 AM');
    setDescription('');
    setModalOpen(false);
  };

  const handleStartEdit = (b: Batch) => {
    setEditingBatch(b);
    setName(b.name);
    setCode(b.code);
    setTargetExam(b.targetExam);
    setTiming(b.timing);
    setDescription(b.description || '');
    setModalOpen(true);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Academic Batches & Sections
          </h2>
          <p className="text-[11px] text-slate-500">
            Target groups for IIT-JEE Super 30, JEE Main, Droppers, and MHT-CET coaching
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBatch(null);
            setName('');
            setCode(`GMI-B-${Math.floor(10 + Math.random() * 90)}`);
            setTiming('07:30 AM - 10:30 AM');
            setDescription('');
            setModalOpen(true);
          }}
          className="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map(batch => {
          const batchStudents = users.filter(u => u.batchName === batch.name);
          return (
            <div key={batch.id} className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{batch.name}</h3>
                    <span className="font-mono text-[10px] text-[#1E3A8A] font-bold">{batch.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {batch.status}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] mt-2 leading-relaxed">
                  {batch.description || 'Intensive classroom test batch for competitive examination.'}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batch.timing}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batchStudents.length || batch.studentCount} Students Enrolled</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Curriculum: <strong className="text-slate-700">{batch.targetExam}</strong>
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(batch)}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteBatch(batch.id);
                    }}
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    title="Delete batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 uppercase">
                {editingBatch ? 'Edit Batch' : 'Create New Academic Batch'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Batch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JEE Advanced 2025 Super 30"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Batch Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Class Timing
                  </label>
                  <input
                    type="text"
                    value={timing}
                    onChange={e => setTiming(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Target Curriculum
                </label>
                <select
                  value={targetExam}
                  onChange={e => setTargetExam(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                >
                  <option value="IIT-JEE Advanced 2025">IIT-JEE Advanced 2025</option>
                  <option value="JEE Main 2025">JEE Main 2025</option>
                  <option value="MHT-CET 2025">MHT-CET 2025</option>
                  <option value="11th Foundation">11th Foundation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Description / Focus
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
