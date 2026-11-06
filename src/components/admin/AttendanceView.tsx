import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { CalendarCheck, Users, Check, X as XIcon, Clock, Save, FileSpreadsheet } from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { batches, users, attendance, saveAttendance, showToast } = usePortal();

  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'batch-1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const batchStudents = users.filter(u => u.role === 'student');

  // Load existing attendance for batch & date if available
  const existingRecord = attendance.find(a => a.batchId === selectedBatchId && a.date === date);

  const [attendanceState, setAttendanceState] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>(() => {
    const init: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    batchStudents.forEach(s => {
      const match = existingRecord?.records.find(r => r.studentId === s.id);
      init[s.id] = match ? match.status : 'Present';
    });
    return init;
  });

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    const records = batchStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo || 'GMI',
      status: attendanceState[s.id] || 'Present'
    }));

    saveAttendance(selectedBatchId, date, records);
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const next: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    batchStudents.forEach(s => {
      next[s.id] = status;
    });
    setAttendanceState(next);
  };

  const presentCount = Object.values(attendanceState).filter(s => s === 'Present').length;
  const absentCount = Object.values(attendanceState).filter(s => s === 'Absent').length;
  const lateCount = Object.values(attendanceState).filter(s => s === 'Late').length;

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Daily Classroom & Test Attendance
          </h2>
          <p className="text-[11px] text-slate-500">
            Track daily attendance for Super 30 and Target batches at Osmanpura center
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Attendance Record</span>
        </button>
      </div>

      {/* Control bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Select Batch
          </label>
          <select
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 bg-white"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Attendance Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button
            type="button"
            onClick={() => handleMarkAll('Present')}
            className="flex-1 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold rounded hover:bg-emerald-100 cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('Absent')}
            className="flex-1 py-2 bg-red-50 border border-red-300 text-red-800 font-bold rounded hover:bg-red-100 cursor-pointer"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Present</span>
          <span className="text-xl font-extrabold text-emerald-700">{presentCount}</span>
        </div>
        <div className="bg-red-50 p-3 rounded border border-red-200">
          <span className="text-[10px] font-bold uppercase text-red-800 block">Absent</span>
          <span className="text-xl font-extrabold text-red-700">{absentCount}</span>
        </div>
        <div className="bg-amber-50 p-3 rounded border border-amber-200">
          <span className="text-[10px] font-bold uppercase text-amber-800 block">Late</span>
          <span className="text-xl font-extrabold text-amber-700">{lateCount}</span>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchStudents.map(student => {
                const currentStatus = attendanceState[student.id] || 'Present';
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono font-bold text-[#1E3A8A]">
                      {student.rollNo || 'GMI-2025'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {student.batchName || currentBatch.name}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex rounded-md shadow-2xs" role="group">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`px-3 py-1 text-xs font-bold rounded-l border cursor-pointer ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`px-3 py-1 text-xs font-bold border-t border-b cursor-pointer ${
                            currentStatus === 'Late'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`px-3 py-1 text-xs font-bold rounded-r border cursor-pointer ${
                            currentStatus === 'Absent'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
