import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Upload,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Building,
  Phone,
  MessageSquare,
  Sparkles,
  Download,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { User, Batch } from '../../types';

export const StudentsView: React.FC = () => {
  const { users, batches, attempts, addUser, updateUser, deleteUser, showToast } = usePortal();

  const [activeSourceTab, setActiveSourceTab] = useState<'all' | 'enrolled' | 'quick_join'>('all');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [assignBatchStudent, setAssignBatchStudent] = useState<User | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');

  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newClass, setNewClass] = useState('11th');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCollege, setNewCollege] = useState('');

  // All student users
  const studentList = users.filter(u => u.role === 'student');

  const quickJoinList = studentList.filter(
    s => s.batchName?.includes('Quick Join') || !!s.collegeName || !s.batchId
  );
  const enrolledList = studentList.filter(
    s => !s.batchName?.includes('Quick Join') && s.batchId
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const cleanPhone = newPhone.trim().replace(/\D/g, '');
    addUser({
      name: newName.trim(),
      username: newUsername.trim() || `g${Date.now().toString().slice(-9)}`,
      email: newEmail.trim() || `${cleanPhone || Date.now()}@student.gyansai.in`,
      phone: cleanPhone,
      collegeName: newCollege.trim(),
      role: 'student',
      targetExam: `Class ${newClass} IIT-JEE / MHT-CET`,
      rollNo: `GMI-${newClass.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      batchName: `${newClass} Standard Batch`
    });

    setModalOpen(false);
    setNewName('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setNewCollege('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateUser(editingStudent.id, {
      name: editingStudent.name,
      username: editingStudent.username,
      email: editingStudent.email,
      phone: editingStudent.phone,
      collegeName: editingStudent.collegeName,
      targetExam: editingStudent.targetExam,
      rollNo: editingStudent.rollNo,
      batchName: editingStudent.batchName
    });
    setEditingStudent(null);
  };

  const handleAssignBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignBatchStudent || !selectedBatchId) return;
    const targetBatch = batches.find(b => b.id === selectedBatchId);
    if (!targetBatch) return;

    updateUser(assignBatchStudent.id, {
      batchId: targetBatch.id,
      batchName: targetBatch.name
    });
    showToast(`Assigned ${assignBatchStudent.name} to batch "${targetBatch.name}".`);
    setAssignBatchStudent(null);
    setSelectedBatchId('');
  };

  const handleDelete = (student: User) => {
    if (window.confirm(`Delete student record for "${student.name}"?`)) {
      deleteUser(student.id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'College/School', 'Class/Target', 'Roll No', 'Username', 'Email', 'Source', 'Enrolled Batch', 'Joined Date'];
    const rows = studentList.map(s => [
      `"${s.name}"`,
      `"${s.phone || ''}"`,
      `"${s.collegeName || ''}"`,
      `"${s.targetExam || ''}"`,
      `"${s.rollNo || ''}"`,
      `"${s.username || ''}"`,
      `"${s.email}"`,
      `"${s.batchName?.includes('Quick Join') || s.collegeName ? 'Quick Join' : 'Regular'}"`,
      `"${s.batchName || 'Unassigned'}"`,
      `"${s.joinedDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gyansai_Student_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student roster exported to CSV successfully.');
  };

  // Filter based on Tab + Search + Status
  const tabFiltered = studentList.filter(s => {
    if (activeSourceTab === 'quick_join') {
      return s.batchName?.includes('Quick Join') || !!s.collegeName || !s.batchId;
    }
    if (activeSourceTab === 'enrolled') {
      return !s.batchName?.includes('Quick Join') && !!s.batchId;
    }
    return true;
  });

  const filtered = tabFiltered.filter(s => {
    const q = searchText.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.collegeName && s.collegeName.toLowerCase().includes(q)) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
      (s.targetExam && s.targetExam.toLowerCase().includes(q)) ||
      (s.assignedExamTitle && s.assignedExamTitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-[#002FA7] uppercase mb-1">
            // ROSTER & CANDIDATES
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            {studentList.length} total students &bull; {quickJoinList.length} Quick Join public candidates &bull; {enrolledList.length} enrolled in batches
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
            title="Export roster to CSV"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewName('');
              setNewUsername('');
              setNewClass('11th');
              setNewEmail('');
              setNewPhone('');
              setNewCollege('');
              setModalOpen(true);
            }}
            className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold text-xs flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Source Segment Tabs (All / Enrolled / Quick Join Candidates) */}
      <div className="flex items-center border-b border-gray-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveSourceTab('all')}
          className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
            activeSourceTab === 'all'
              ? 'border-[#002FA7] text-[#002FA7]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>All Students</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-gray-100 text-gray-700">
            {studentList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSourceTab('quick_join')}
          className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
            activeSourceTab === 'quick_join'
              ? 'border-[#002FA7] text-[#002FA7]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Join Candidates</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {quickJoinList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSourceTab('enrolled')}
          className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
            activeSourceTab === 'enrolled'
              ? 'border-[#002FA7] text-[#002FA7]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>Enrolled Batches</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-gray-100 text-gray-700">
            {enrolledList.length}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50/80 p-3 rounded border border-gray-200">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate name, mobile, college, roll number, class..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:border-[#002FA7]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-500 text-[11px] font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-800 text-xs focus:outline-none focus:border-[#002FA7]"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
          </select>
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText('')}
              className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-mono text-xs space-y-2">
              <p>No student candidates found matching current filter.</p>
              {activeSourceTab === 'quick_join' && (
                <p className="text-[11px] text-gray-500">
                  When students open any shared exam link and start the exam, they will automatically appear here!
                </p>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/80 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3">CANDIDATE / STUDENT</th>
                  <th className="px-5 py-3">MOBILE / WHATSAPP</th>
                  <th className="px-5 py-3">CLASS / TARGET</th>
                  <th className="px-5 py-3">ROLL NO / USERNAME</th>
                  <th className="px-5 py-3">ORIGIN & ASSIGNMENT</th>
                  <th className="px-5 py-3">EXAM ACTIVITY</th>
                  <th className="px-5 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(student => {
                  const isQuickJoin = student.batchName?.includes('Quick Join') || !student.batchId || !!student.collegeName;
                  const cleanPhone = student.phone ? student.phone.replace(/\D/g, '') : '';
                  const studentAttempts = attempts.filter(
                    a => a.studentId === student.id || (cleanPhone && a.studentPhone === cleanPhone)
                  );
                  const latestAttempt = studentAttempts[0];

                  return (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition group">
                      {/* Name & College */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                            isQuickJoin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-[#002FA7]'
                          }`}>
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-950 flex items-center space-x-1.5">
                              <span className="truncate">{student.name}</span>
                              {isQuickJoin && (
                                <span className="px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono text-[9px] font-bold shrink-0">
                                  QUICK JOIN
                                </span>
                              )}
                            </div>
                            {student.collegeName ? (
                              <div className="text-[11px] text-gray-500 flex items-center space-x-1 truncate mt-0.5" title={student.collegeName}>
                                <Building className="w-3 h-3 text-gray-400 shrink-0" />
                                <span className="truncate">{student.collegeName}</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                                {student.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone & WhatsApp */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {cleanPhone ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-gray-800 text-xs font-medium">
                              +91 {cleanPhone}
                            </span>
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${student.name}, regarding your Gyansai Maths IIT Center examination attendance...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Class */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-[#002FA7] border border-blue-200 rounded text-[11px] font-semibold">
                          {student.targetExam || 'Class 11th'}
                        </span>
                      </td>

                      {/* Roll / Username */}
                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-gray-600">
                        <div className="font-semibold text-gray-900">{student.rollNo || '—'}</div>
                        <div className="text-[10px] text-gray-400">{student.username || `g${student.id.slice(-6)}`}</div>
                      </td>

                      {/* Origin & Batch Assignment */}
                      <td className="px-5 py-3.5">
                        {isQuickJoin ? (
                          <div>
                            <span className="text-xs font-semibold text-amber-900 block truncate">
                              {student.assignedExamTitle || 'Public Link Candidate'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setAssignBatchStudent(student);
                                setSelectedBatchId(batches[0]?.id || '');
                              }}
                              className="text-[10px] text-[#002FA7] hover:underline font-semibold mt-0.5 flex items-center space-x-1 cursor-pointer"
                            >
                              <UserCheck className="w-2.5 h-2.5" />
                              <span>Assign to Batch</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-800 font-medium">
                            {student.batchName || 'Regular Batch'}
                          </span>
                        )}
                      </td>

                      {/* Exam Activity */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {studentAttempts.length > 0 ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold font-mono text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{latestAttempt?.totalScore ?? 0}/{latestAttempt?.maxScore ?? 100} ({latestAttempt?.percentage ?? 0}%)</span>
                            </span>
                            <span className="block text-[10px] text-gray-400 font-mono">
                              {studentAttempts.length} attempt{studentAttempts.length > 1 ? 's' : ''} recorded
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No submissions yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setAssignBatchStudent(student);
                              setSelectedBatchId(batches[0]?.id || '');
                            }}
                            className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition cursor-pointer font-medium"
                            title="Assign to institute batch"
                          >
                            Assign Batch
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStudent({ ...student })}
                            className="text-gray-400 hover:text-gray-700 cursor-pointer p-1 rounded hover:bg-gray-100"
                            title="Edit student record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student)}
                            className="text-red-400 hover:text-red-600 cursor-pointer p-1 rounded hover:bg-red-50"
                            title="Delete student record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Assign to Batch Modal */}
      {assignBatchStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Assign Student to Batch</h3>
                <p className="text-xs text-gray-500">{assignBatchStudent.name} &bull; {assignBatchStudent.phone || assignBatchStudent.collegeName}</p>
              </div>
              <button
                type="button"
                onClick={() => setAssignBatchStudent(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Institute Batch
                </label>
                <select
                  value={selectedBatchId}
                  onChange={e => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:border-[#002FA7]"
                  required
                >
                  <option value="">-- Choose a batch --</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.targetExam} &bull; {b.timing})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                This student will be formally enrolled into the batch roster and will gain full access to batch mock tests and study material.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAssignBatchStudent(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold cursor-pointer shadow-2xs"
                >
                  Confirm Batch Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Add New Student</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Patil"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-[#002FA7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-[#002FA7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={newClass}
                    onChange={e => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white text-gray-900 focus:outline-none focus:border-[#002FA7]"
                  >
                    <option value="11th">Class 11th</option>
                    <option value="12th">Class 12th</option>
                    <option value="Repeater">Repeater / Dropper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  College / School Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deogiri College"
                  value={newCollege}
                  onChange={e => setNewCollege(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-[#002FA7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-[#002FA7]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold cursor-pointer shadow-2xs"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Edit Student Record</h3>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={editingStudent.phone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={editingStudent.rollNo || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-mono text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  College / School Name
                </label>
                <input
                  type="text"
                  value={editingStudent.collegeName || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, collegeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Exam
                </label>
                <input
                  type="text"
                  value={editingStudent.targetExam || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, targetExam: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold cursor-pointer shadow-2xs"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
