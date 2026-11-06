import React, { useState, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Save, Upload, Trash2, Image as ImageIcon, Lock, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const InstituteSettingsView: React.FC = () => {
  const { settings, updateSettings, showToast } = usePortal();

  // State matching Screenshots 477, 478, 479 initialized with settings
  const [instituteName, setInstituteName] = useState(settings.instituteName || 'Gyansai Maths IIT Center');
  const [tagline, setTagline] = useState(settings.tagline || 'TEST tagline 1781422274');
  const [storageTag, setStorageTag] = useState(settings.storageTag || '');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || 'https://gyansaimathsiitcenter.co.in/sai.jpeg');
  const [logoSizeW, setLogoSizeW] = useState(settings.logoSizeW || '70');
  const [logoSizeH, setLogoSizeH] = useState(settings.logoSizeH || '70');
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl || '');
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || '');
  const [primaryCTA, setPrimaryCTA] = useState(settings.primaryCTA || '');
  const [secondaryCTA, setSecondaryCTA] = useState(settings.secondaryCTA || '');
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || 'https://gyansaimathsiitcenter.co.in/sai.jpeg');
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#002FA7');

  const [address, setAddress] = useState(settings.address || 'Maths IIT Center, Eknath Rang Mandir Rd,\nNew Usmanpura, Chhatrapati Sambhajinagar');
  const [phone, setPhone] = useState(settings.phone || '+91 9970603939');
  const [email, setEmail] = useState(settings.email || 'gyansaimathiitcentertec@gmail.com');
  const [website, setWebsite] = useState(settings.website || 'https://gyansaimathsiitcenter.co.in/');

  const [upiId, setUpiId] = useState(settings.upiId || 'ujjbb89311773007@ujjivan');
  const [bankName, setBankName] = useState(settings.bankName || 'Ujjivan Small finance Bank');
  const [accountNo, setAccountNo] = useState(settings.accountNo || '4455120040000245');
  const [ifsc, setIfsc] = useState(settings.ifsc || 'UJVN0004455');
  const [upiQrCodeUrl, setUpiQrCodeUrl] = useState(settings.upiQrCodeUrl || '');

  const [youtube, setYoutube] = useState(settings.youtube || '');
  const [instagram, setInstagram] = useState(settings.instagram || '');
  const [twitter, setTwitter] = useState(settings.twitter || '');
  const [facebook, setFacebook] = useState(settings.facebook || '');

  const [metaTitle, setMetaTitle] = useState(settings.metaTitle || 'Gyansai Maths IIT Center — JEE/NEET/MHT-CET Test Portal');
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription || 'Online examination & learning platform for JEE Main, JEE Advanced, NEET and MHT-CET aspirants.');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(settings.googleAnalyticsId || 'G-XXXXXXXX');
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const img = new Image();
        img.onload = () => {
          const maxDim = label.toLowerCase().includes('hero') ? 800 : 360;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/png', 0.9);
            setter(optimized);
            if (label.toLowerCase() === 'logo') {
              updateSettings({ logoUrl: optimized });
            }
            showToast(`${label} processed and saved to portal!`);
          } else {
            setter(result);
            if (label.toLowerCase() === 'logo') {
              updateSettings({ logoUrl: result });
            }
            showToast(`${label} uploaded and saved.`);
          }
        };
        img.onerror = () => {
          setter(result);
          if (label.toLowerCase() === 'logo') {
            updateSettings({ logoUrl: result });
          }
          showToast(`${label} uploaded and saved.`);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      instituteName,
      tagline,
      storageTag,
      logoUrl,
      logoSizeW,
      logoSizeH,
      heroImageUrl,
      heroTitle,
      heroSubtitle,
      primaryCTA,
      secondaryCTA,
      faviconUrl,
      primaryColor,
      address,
      phone,
      email,
      website,
      upiId,
      bankName,
      accountNo,
      ifsc,
      upiQrCodeUrl,
      youtube,
      instagram,
      twitter,
      facebook,
      metaTitle,
      metaDescription,
      googleAnalyticsId,
      adminPassword
    });
    showToast('Institute settings and admin credentials saved successfully.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 477 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // CONFIGURATION
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Institute Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            All fields are editable — changes propagate to public pages and certificates in real-time.
          </p>
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-2 cursor-pointer shadow-xs transition self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Card 1: Branding */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold text-gray-900">
          Branding
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Institute name
            </label>
            <input
              type="text"
              value={instituteName}
              onChange={e => setInstituteName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Storage Tag
            </label>
            <input
              type="text"
              value={storageTag}
              onChange={e => setStorageTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Logo (Upload file or enter URL)
            </label>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              onChange={e => handleImageFile(e, setLogoUrl, 'Logo')}
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={logoUrl.startsWith('data:') ? 'Custom uploaded image (base64)' : 'https://... or select image'}
                value={logoUrl.startsWith('data:') ? 'Custom uploaded image (Active)' : logoUrl}
                onChange={e => {
                  const val = e.target.value;
                  setLogoUrl(val);
                  updateSettings({ logoUrl: val });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload</span>
              </button>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl('');
                    updateSettings({ logoUrl: '' });
                    showToast('Logo cleared.');
                  }}
                  className="p-2 border border-gray-300 rounded text-red-600 hover:bg-red-50 flex items-center cursor-pointer shrink-0"
                  title="Remove logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {logoUrl && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={logoUrl} alt="Logo preview" className="h-10 w-10 object-contain rounded border p-0.5 bg-white shrink-0" />
                <span className="text-[10px] text-emerald-600 font-medium">
                  ✓ Active frontend logo (updates across Landing Page, Navbar, Footer, & Portal)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Logo size (px)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={logoSizeW}
                onChange={e => setLogoSizeW(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
              />
              <input
                type="text"
                value={logoSizeH}
                onChange={e => setLogoSizeH(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Hero image (Upload file or enter URL)
            </label>
            <input
              type="file"
              ref={heroInputRef}
              accept="image/*"
              onChange={e => handleImageFile(e, setHeroImageUrl, 'Hero image')}
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={heroImageUrl.startsWith('data:') ? 'Uploaded image (base64)' : heroImageUrl}
                onChange={e => setHeroImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                className="px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload</span>
              </button>
            </div>
            {heroImageUrl && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={heroImageUrl} alt="Hero preview" className="h-10 w-16 object-cover rounded border" />
                <span className="text-[10px] text-gray-400">Hero image preview</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Hero title
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={e => setHeroTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Hero subtitle
          </label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={e => setHeroSubtitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Primary CTA
            </label>
            <input
              type="text"
              value={primaryCTA}
              onChange={e => setPrimaryCTA(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Secondary CTA
            </label>
            <input
              type="text"
              value={secondaryCTA}
              onChange={e => setSecondaryCTA(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Favicon URL
            </label>
            <input
              type="text"
              value={faviconUrl}
              onChange={e => setFaviconUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Primary color (hex)
            </label>
            <input
              type="text"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Contact */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold text-gray-900">
          Contact
        </h2>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
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
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="text"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Card 3: Payments & UPI */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold text-gray-900">
          Payments & UPI QR
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bank name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Account no.
            </label>
            <input
              type="text"
              value={accountNo}
              onChange={e => setAccountNo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              IFSC
            </label>
            <input
              type="text"
              value={ifsc}
              onChange={e => setIfsc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            UPI QR Code Image (Upload QR image for student checkout)
          </label>
          <input
            type="file"
            ref={qrInputRef}
            accept="image/*"
            onChange={e => handleImageFile(e, setUpiQrCodeUrl, 'UPI QR Code')}
            className="hidden"
          />
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => qrInputRef.current?.click()}
              className="px-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload QR Code Image</span>
            </button>
            {upiQrCodeUrl && (
              <span className="text-xs text-green-700 font-medium">✓ QR Code attached</span>
            )}
          </div>
          {upiQrCodeUrl && (
            <div className="mt-2">
              <img src={upiQrCodeUrl} alt="UPI QR preview" className="w-24 h-24 object-contain border p-1 rounded bg-white" />
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Social Media */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold text-gray-900">
          Social Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Youtube
            </label>
            <input
              type="text"
              value={youtube}
              onChange={e => setYoutube(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="text"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              value={facebook}
              onChange={e => setFacebook(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Card 5: SEO & Analytics */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold text-gray-900">
          SEO & Analytics
        </h2>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Meta title
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={e => setMetaTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Meta description
          </label>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={e => setMetaDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={googleAnalyticsId}
            onChange={e => setGoogleAnalyticsId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Card 6: Security & Admin Console Access */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#002FA7]" />
          <h2 className="text-xs font-bold text-gray-900">
            Security & Admin Console Access
          </h2>
        </div>
        <p className="text-[11px] text-gray-500">
          Set the master password required to unlock the Admin Console. Any attempt by students or unauthenticated users to enter admin mode will be blocked without this password.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Admin Login Email
            </label>
            <input
              type="text"
              readOnly
              value="admin@gyansaimaths.com (Prof. Taterao Kendre)"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-700">
                Admin Master Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAdminPassword('admin123')}
                className="text-[10px] text-[#002FA7] hover:underline cursor-pointer"
              >
                Reset to default
              </button>
            </div>
            <div className="relative">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">
              ✓ Password authentication is strictly enforced on all admin routes & tabs.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Save Button - Exact Screenshot 479 */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-2 cursor-pointer shadow-xs transition"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </form>
  );
};
