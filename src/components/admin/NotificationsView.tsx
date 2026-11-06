import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Bell, Plus, Trash2, Send, AlertTriangle, X } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, addNotification, deleteNotification, batches } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('High');
  const [target, setTarget] = useState<'All Students' | 'Selected Batch'>('All Students');
  const [batchName, setBatchName] = useState(batches[0]?.name || 'JEE Advanced Super 30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addNotification({
      title: title.trim(),
      message: message.trim(),
      priority,
      target,
      batchName: target === 'Selected Batch' ? batchName : undefined,
      author: 'Prof. Taterao Kendre (KT Sir)'
    });

    setTitle('');
    setMessage('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Announcements & Student Notifications
          </h2>
          <p className="text-[11px] text-slate-500">
            Send real-time alerts about upcoming mock tests, classroom schedules, and results
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                  notif.priority === 'Urgent'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : notif.priority === 'High'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-[#1E3A8A] border border-blue-200'
                }`}>
                  {notif.priority}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Audience: {notif.target} {notif.batchName ? `(${notif.batchName})` : ''}
                </span>
                <span className="text-[10px] text-slate-400">&bull; {notif.createdAt}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{notif.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{notif.message}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Posted by: <strong className="text-slate-700">{notif.author}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                deleteNotification(notif.id);
              }}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer self-start"
              title="Delete announcement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 uppercase">
                Broadcast Announcement
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Title / Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JEE Advanced Full Mock 02 Scheduled"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Target Audience
                  </label>
                  <select
                    value={target}
                    onChange={e => setTarget(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    <option value="All Students">All Students</option>
                    <option value="Selected Batch">Selected Batch</option>
                  </select>
                </div>
              </div>

              {target === 'Selected Batch' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Choose Batch
                  </label>
                  <select
                    value={batchName}
                    onChange={e => setBatchName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Announcement Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write clear instructions or schedule notice for students..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
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
                  className="px-5 py-2 bg-[#1E3A8A] text-white font-bold rounded cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
