import React from 'react';
import { usePortal } from '../../context/PortalContext';

export const StudentCoursesView: React.FC = () => {
  const { showToast } = usePortal();

  const coursesList = [
    {
      id: 'crs-1',
      tag: 'Mathamatics',
      title: '12th full syllabus cources',
      description: '## MHT-CET Mathematics — Complete Practice Course Prepare smarter for **MHT-CET Mathematics** with a structured practice course designed to strengthen your concepts, improve problem-solving speed, and build exa...',
      price: 149
    }
  ];

  const handleBuy = (c: any) => {
    showToast(`Initiating manual UPI payment for ₹${c.price}...`);
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 482 */}
      <div>
        <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
          // LEARNING
        </div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
          Courses
        </h1>
      </div>

      {/* Course Card - Exact Screenshot 482 */}
      <div className="max-w-sm">
        {coursesList.map(course => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Grey image box */}
              <div className="h-48 bg-gray-100 border-b border-gray-200 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80"
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-2">
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded border border-gray-200">
                  {course.tag}
                </span>

                <h3 className="text-sm font-bold text-gray-950">
                  {course.title}
                </h3>

                <p className="text-[11px] text-gray-500 font-sans leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="font-extrabold font-mono text-sm text-gray-900">
                ₹{course.price}
              </span>

              <button
                type="button"
                onClick={() => handleBuy(course)}
                className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded cursor-pointer shadow-2xs transition"
              >
                Buy ₹{course.price}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
