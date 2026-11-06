import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { Course } from '../../types';

export const CoursesView: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, showToast } = usePortal();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('149');
  const [newSubject, setNewSubject] = useState('MATHAMATICS');
  const [newDescription, setNewDescription] = useState('## MHT-CET Mathematics — Complete Practice Course Prepare smarter for **MHT-CET Mathematics** with a curated set of video lectures and practice papers.');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewThumbnail(reader.result);
        showToast('Thumbnail uploaded.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCourse({
      title: newTitle.trim(),
      subtitle: newTitle.trim(),
      subject: newSubject,
      description: newDescription,
      instructor: 'Prof. Taterao Kendre (KT Sir)',
      price: parseInt(newPrice) || 149,
      duration: '6 Months',
      features: ['200+ Video Lectures', 'Chapterwise DPPs', 'Mock Tests included'],
      category: 'MHT-CET',
      status: 'Published',
      thumbnailUrl: newThumbnail
    });

    setModalOpen(false);
    showToast(`Course "${newTitle}" created.`);
  };

  const handleDelete = (course: Course) => {
    deleteCourse(course.id);
    showToast(`Course "${course.title}" removed permanently.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, {
      title: editingCourse.title,
      price: editingCourse.price,
      description: editingCourse.description,
      subject: editingCourse.subject
    });
    showToast(`Course "${editingCourse.title}" updated.`);
    setEditingCourse(null);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 475 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // LEARNING
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Course Management
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {courses.length} active courses
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewTitle('');
            setNewPrice('149');
            setNewSubject('MATHAMATICS');
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-1.5 cursor-pointer shadow-2xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Course</span>
        </button>
      </div>

      {/* Grid of Course Cards - Exact Screenshot 475 */}
      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500">
          No courses available. Click &quot;New Course&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-2xs hover:border-gray-300 transition"
            >
              <div>
                {/* Course image box */}
                <div className="h-48 bg-gray-100 border-b border-gray-200 overflow-hidden relative">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.subject && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] tracking-wider uppercase rounded">
                      {course.subject}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-[#002FA7] text-white font-mono text-[10px] font-bold rounded">
                      {course.status === 'Draft' ? 'DRAFT' : 'LIVE'}
                    </span>
                    <span className="text-gray-500 font-mono text-[11px]">
                      {course.enrolledCount || 0} students enrolled
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-950">
                    {course.title}
                  </h3>

                  {course.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {course.description.replace(/^##\s*/, '')}
                    </p>
                  )}

                  <div className="text-sm font-bold font-mono text-gray-900">
                    ₹{course.price}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingCourse(course)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center space-x-1 text-xs cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3 h-3 text-gray-500" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(course)}
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer transition hover:bg-red-50 rounded"
                  title="Delete Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Create New Course</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12th full syllabus cources"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject Tag
                  </label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Course Thumbnail Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Course Thumbnail Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-gray-300 rounded p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={newThumbnail}
                      alt="Thumbnail preview"
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <span className="text-gray-600 text-xs">Click to upload custom image</span>
                  </div>
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Edit Course</h3>
              <button type="button" onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject Tag
                  </label>
                  <input
                    type="text"
                    value={editingCourse.subject || 'MATHEMATICS'}
                    onChange={e => setEditingCourse({ ...editingCourse, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCourse.price}
                    onChange={e => setEditingCourse({ ...editingCourse, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCourse.description || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
