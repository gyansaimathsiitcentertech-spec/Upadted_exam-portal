import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { CheckSquare, Search, Award, CheckCircle, Edit3, Save, X } from 'lucide-react';
import { ExamAttempt } from '../../types';

export const EvaluationView: React.FC = () => {
  const { attempts, questions, updateAttempt, showToast } = usePortal();

  const [search, setSearch] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(attempts[0] || null);
  const [bonusMarks, setBonusMarks] = useState(0);

  const filteredAttempts = attempts.filter(a =>
    a.studentName.toLowerCase().includes(search.toLowerCase()) ||
    a.studentRollNo.toLowerCase().includes(search.toLowerCase()) ||
    a.examTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEvaluation = () => {
    if (!selectedAttempt) return;

    const newScore = selectedAttempt.totalScore + Number(bonusMarks);
    updateAttempt(selectedAttempt.id, {
      totalScore: newScore,
      status: 'Evaluated'
    });

    showToast(`Evaluation saved! Score updated to ${newScore}/${selectedAttempt.maxScore}`);
    setBonusMarks(0);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            Manual Evaluation & Submission Review
          </h2>
          <p className="text-[11px] text-slate-500">
            Audit numerical value tolerances, bonus mark adjustments, and question validity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Attempts list */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate or test..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredAttempts.map(att => {
              const isSelected = selectedAttempt?.id === att.id;
              return (
                <div
                  key={att.id}
                  onClick={() => {
                    setSelectedAttempt(att);
                    setBonusMarks(0);
                  }}
                  className={`p-3 rounded border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50 border-[#1E3A8A] shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{att.studentName}</span>
                    <span className="font-bold text-[#1E3A8A]">
                      {att.totalScore}/{att.maxScore}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{att.studentRollNo}</div>
                  <div className="text-[11px] text-slate-600 mt-1 truncate">{att.examTitle}</div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400">{att.accuracy}% Accuracy</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                      {att.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Attempt Evaluation Inspector */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-2xs p-5 space-y-5">
          {selectedAttempt ? (
            <div>
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedAttempt.studentName} &bull; {selectedAttempt.studentRollNo}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedAttempt.examTitle} ({selectedAttempt.examCode})
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Score</span>
                    <span className="text-base font-extrabold text-[#1E3A8A]">
                      {selectedAttempt.totalScore} / {selectedAttempt.maxScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bonus or penalty adjustments */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Score Adjustment / Override</span>
                  <span className="text-[11px] text-slate-500">Add or deduct marks for disputed questions</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={bonusMarks}
                    onChange={e => setBonusMarks(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-800 text-center"
                    placeholder="+4 or -1"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEvaluation}
                    className="px-4 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded flex items-center space-x-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Adjustment</span>
                  </button>
                </div>
              </div>

              {/* Answer breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Submitted Question Responses:
                </h4>
                {Object.entries(selectedAttempt.answers).map(([qId, ans], idx) => {
                  const q = questions.find(item => item.id === qId);
                  if (!q) return null;
                  return (
                    <div
                      key={qId}
                      className={`p-3 rounded border text-xs space-y-1.5 ${
                        ans.isCorrect ? 'bg-emerald-50/20 border-emerald-200' : 'bg-red-50/20 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Q{idx + 1}. {q.topic} ({q.code})
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ans.isCorrect ? `+${q.marksPositive} Awarded` : `${q.marksNegative} Negative`}
                        </span>
                      </div>
                      <p className="text-slate-700">{q.questionText}</p>
                      <div className="flex items-center space-x-4 text-[11px] pt-1">
                        <span>Candidate Selected: <strong className="font-mono">{ans.selectedOption || 'None'}</strong></span>
                        <span>Official Key: <strong className="font-mono text-emerald-800">{q.correctAnswer}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">Select a submission on the left to evaluate.</div>
          )}
        </div>
      </div>
    </div>
  );
};
