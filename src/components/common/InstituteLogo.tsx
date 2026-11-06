import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { GraduationCap, LayoutGrid, BookOpen } from 'lucide-react';

interface InstituteLogoProps {
  className?: string;
  imgClassName?: string;
  fallbackType?: 'emblem' | 'grid' | 'cap' | 'book';
  sizePx?: number;
  alt?: string;
}

export const InstituteLogo: React.FC<InstituteLogoProps> = ({
  className = 'w-10 h-10',
  imgClassName = 'w-full h-full object-contain',
  fallbackType = 'emblem',
  sizePx,
  alt
}) => {
  const { settings } = usePortal();
  const [hasError, setHasError] = useState(false);

  // Reset error state when logoUrl changes in settings
  useEffect(() => {
    setHasError(false);
  }, [settings?.logoUrl]);

  const customStyle = sizePx
    ? { width: `${sizePx}px`, height: `${sizePx}px` }
    : undefined;

  const logoSrc = settings?.logoUrl?.trim();

  if (logoSrc && !hasError) {
    return (
      <div
        style={customStyle}
        className={`flex items-center justify-center overflow-hidden rounded shrink-0 bg-white ${className}`}
      >
        <img
          src={logoSrc}
          alt={alt || settings?.instituteName || 'Institute Logo'}
          className={imgClassName}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback rendering
  if (fallbackType === 'grid') {
    return (
      <div
        style={customStyle}
        className={`rounded bg-[#002FA7] flex items-center justify-center text-white shrink-0 shadow-2xs ${className}`}
      >
        <LayoutGrid className="w-1/2 h-1/2" />
      </div>
    );
  }

  if (fallbackType === 'cap') {
    return (
      <div
        style={customStyle}
        className={`rounded bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-2xs ${className}`}
      >
        <GraduationCap className="w-1/2 h-1/2" />
      </div>
    );
  }

  if (fallbackType === 'book') {
    return (
      <div
        style={customStyle}
        className={`rounded bg-[#002FA7] text-white flex items-center justify-center shrink-0 shadow-2xs ${className}`}
      >
        <BookOpen className="w-1/2 h-1/2" />
      </div>
    );
  }

  // Default: Colorful GyanSai emblem SVG matching Screenshots 459 / 464
  return (
    <div
      style={customStyle}
      className={`rounded-lg border border-gray-200 bg-white flex items-center justify-center p-1 shadow-2xs shrink-0 ${className}`}
    >
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
        <circle cx="24" cy="24" r="22" fill="#FEF3C7" />
        <path d="M12 32C12 26 18 24 24 24C30 24 36 26 36 32" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15 22L24 14L33 22" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 24V32" stroke="#2563EB" strokeWidth="2.5" />
        <path d="M30 24V32" stroke="#2563EB" strokeWidth="2.5" />
        <circle cx="24" cy="18" r="3.5" fill="#DC2626" />
        <text x="24" y="42" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#B45309">
          ज्ञानसाई
        </text>
      </svg>
    </div>
  );
};
