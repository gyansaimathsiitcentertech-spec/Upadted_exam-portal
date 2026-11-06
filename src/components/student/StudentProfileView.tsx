import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Upload, Camera, Trash2 } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser, updateUser, showToast } = usePortal();

  const [name, setName] = useState(currentUser?.name || 'add');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [mobile, setMobile] = useState(currentUser?.phone || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser?.avatar || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        showToast('Photo selected! Click Save to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.id) {
      updateUser(currentUser.id, {
        name,
        email,
        phone: mobile,
        avatar: photoUrl
      });
    }
    showToast('Profile updated successfully.');
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 485 */}
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
          // ACCOUNT
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Profile
        </h1>
      </div>

      {/* Profile Form Card - Exact Screenshot 485 */}
      <div className="max-w-xl bg-white border border-gray-200 rounded-sm p-6 shadow-2xs">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Preview & Upload Area */}
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-gray-500" />
                  <span>Upload Photo</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                PNG, JPG or WebP up to 5MB.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Photo URL (or use Upload above)
            </label>
            <input
              type="text"
              value={photoUrl.startsWith('data:') ? 'Uploaded image (base64)' : photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono text-gray-600">
            <div>
              <span className="text-gray-400 block text-[11px]">Username</span>
              <span className="font-semibold text-gray-900">{currentUser?.username || 'vir'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Enrollment</span>
              <span className="font-semibold text-gray-900">{currentUser?.rollNo || '—'}</span>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded cursor-pointer shadow-xs transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
