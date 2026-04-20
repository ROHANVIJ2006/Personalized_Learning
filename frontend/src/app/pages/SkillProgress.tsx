import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Trophy, Award, ArrowUp, Code, Cpu, Box, Database, Brain } from 'lucide-react';
import { api } from '../../lib/api';

const ICON_MAP: Record<string,any> = { 'Python Programming':Code, 'Machine Learning':Cpu, 'Deep Learning':Brain, 'React Development':Box, 'SQL & Databases':Database };

export function SkillProgress() {
  const [skills, setSkills] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSkillProgress(), api.getMonthlyProgress()])
      .then(([s, m]) => { setSkills(s); setMonthly(m); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const avgGrowth = skills.length ? Math.round(skills.reduce((s,sk) => s + (sk.improvement||0), 0) / skills.length) : 0;
  const monthlyWithData = monthly.filter(m => m.score !== null);
  const maxScore = Math.max(...monthlyWithData.map(m => m.score), 50);

  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="bg-white rounded-xl border-2 border-indigo-200 p-5 mb-4 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'repeating-linear-gradient(45deg,#4f46e5 0px,#4f46e5 20px,transparent 20px,transparent 40px)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Track Your Growth</h1>
              <p className="text-gray-500 text-sm mt-0.5">Powered by MT-KT mastery probability tracking</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-indigo-50 rounded-xl px-5 py-3 border-2 border-indigo-200">
              <div className="flex items-center gap-2 mb-1"><TrendingUp size={14} className="text-indigo-600" /><span className="text-xs text-gray-600 font-semibold">Avg Growth</span></div>
              <div className="text-2xl font-bold text-indigo-600">{avgGrowth > 0 ? '+' : ''}{avgGrowth}%</div>
            </div>
            <div className="bg-indigo-50 rounded-xl px-5 py-3 border-2 border-indigo-200">
              <div className="flex items-center gap-2 mb-1"><Trophy size={14} className="text-indigo-600" /><span className="text-xs text-gray-600 font-semibold">Assessed</span></div>
              <div className="text-2xl font-bold text-indigo-600">{skills.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {skills.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <Award size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-semibold text-gray-500">No skill data yet</p>
          <p className="text-sm mt-1">Take assessments to see your progress here</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
          {/* Left: Chart + Skills */}
          <div className="col-span-2 space-y-4 overflow-y-auto pr-2">
            {/* Monthly Chart */}
            {monthlyWithData.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900">Score Progression</h2>
                  {monthlyWithData.length >= 2 && (
                    <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-semibold">
                      <ArrowUp size={12} />
                      <span>+{Math.round(monthlyWithData[monthlyWithData.length-1].score - monthlyWithData[0].score)}% trend</span>
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between h-36 gap-2">
                  {monthly.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height:'100%' }}>
                        {m.score !== null && (
                          <motion.div
                            initial={{ height:0 }}
                            animate={{ height:`${(m.score/maxScore)*100}%` }}
                            transition={{ duration:1, delay:i*0.1 }}
                            className="absolute bottom-0 w-full bg-indigo-600 rounded-t-lg flex items-start justify-center pt-1">
                            <span className="text-white font-bold text-xs">{Math.round(m.score)}</span>
                          </motion.div>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-gray-600 mt-1">{m.month}</span>
                      {m.count > 0 && <span className="text-xs text-gray-400">{m.count}×</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Cards */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h2 className="text-base font-bold text-gray-900 mb-3">Detailed Skill Metrics</h2>
              <div className="space-y-3">
                {skills.map((sk, i) => {
                  const Icon = ICON_MAP[sk.skill_name] || Code;
                  return (
                    <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <Icon size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">{sk.skill_name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500">Current: <strong className="text-gray-800">{Math.round(sk.current_score)}%</strong></span>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-gray-500">Target: <strong className="text-gray-800">{Math.round(sk.target_score)}%</strong></span>
                              {sk.mastery_probability > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-xs text-indigo-600 font-semibold">MT-KT: {(sk.mastery_probability*100).toFixed(0)}%</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <TrendingUp size={12} className="text-indigo-600" />
                          <span className="text-sm font-bold text-gray-900">{sk.improvement > 0 ? '+' : ''}{Math.round(sk.improvement)}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width:0 }} animate={{ width:`${sk.current_score}%` }}
                          transition={{ duration:1, delay:i*0.1 }} className="h-full bg-indigo-600 rounded-full" />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">0%</span>
                        <span className="text-xs font-semibold text-gray-700">{Math.round(sk.current_score)}%</span>
                        <span className="text-xs text-gray-400">100%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Score History per skill */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-indigo-600" size={18} />
              <h2 className="text-base font-bold text-gray-900">Assessment History</h2>
            </div>
            <div className="space-y-4">
              {skills.filter(sk => sk.score_history?.length > 0).map((sk, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">{sk.skill_name}</h3>
                  {sk.score_history.map((h: any, j: number) => (
                    <div key={j} className="flex justify-between items-center text-xs py-1">
                      <span className="text-gray-500">{h.date}</span>
                      <span className={`font-semibold ${h.score >= 80 ? 'text-green-600' : h.score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{h.score}%</span>
                    </div>
                  ))}
                </div>
              ))}
              {skills.filter(sk => sk.score_history?.length > 0).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Complete assessments to see history</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
