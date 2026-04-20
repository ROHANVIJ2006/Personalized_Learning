import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Circle, Clock, Target, Brain, Code, Cpu, Map, Lock } from 'lucide-react';
import { api } from '../../lib/api';

export function LearningPath() {
  const [path, setPath] = useState<any>(null);
  const [allPaths, setAllPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getMyPath(), api.getLearningPaths()])
      .then(([myPath, paths]) => { setPath(myPath); setAllPaths(paths); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!path || path.error) return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] text-gray-400">
      <div className="text-center">
        <Map size={48} className="mx-auto mb-3 opacity-30" />
        <p className="text-gray-500">No learning path found. Run seed_database.py first.</p>
      </div>
    </div>
  );

  const statusColor = (s: string) =>
    s === 'completed' ? 'bg-green-500' : s === 'in-progress' ? 'bg-indigo-600' : 'bg-gray-300';
  const statusLabel = (s: string) =>
    s === 'completed' ? 'Completed' : s === 'in-progress' ? 'In Progress' : 'Locked';

  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto flex flex-col overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white mb-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Map size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{path.title}</h1>
              <p className="text-indigo-100 text-sm">Goal: {path.career_goal} · {path.total_weeks} weeks total</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(path.progress_percent)}%</div>
            <div className="text-indigo-200 text-sm">Complete</div>
            <div className="mt-2 w-32 h-2 bg-white/20 rounded-full">
              <div className="h-full bg-white rounded-full transition-all" style={{ width:`${path.progress_percent}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 flex-1">
        {/* Phases */}
        <div className="col-span-2 space-y-3 overflow-y-auto pr-2">
          {(path.phases || []).map((phase: any, i: number) => (
            <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              className={`bg-white rounded-xl p-4 border-2 transition-all ${
                phase.status === 'in-progress' ? 'border-indigo-400 shadow-md' :
                phase.status === 'completed' ? 'border-green-200' : 'border-gray-200 opacity-70'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${statusColor(phase.status)}`}>
                    {phase.status === 'completed' ? '✓' : phase.status === 'locked' ? '🔒' : phase.phase}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Phase {phase.phase}: {phase.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={11} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{phase.duration}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                        phase.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{statusLabel(phase.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(phase.modules || []).map((mod: any, j: number) => (
                  <div key={j} className={`flex items-center gap-2 p-2 rounded-lg ${mod.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                    {mod.completed
                      ? <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      : phase.status === 'locked'
                        ? <Lock size={14} className="text-gray-400 flex-shrink-0" />
                        : <Circle size={14} className="text-gray-400 flex-shrink-0" />
                    }
                    <span className={`text-xs font-medium ${mod.completed ? 'text-green-700' : 'text-gray-600'}`}>{mod.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Schedule + Other Paths */}
        <div className="space-y-4 overflow-y-auto">
          {/* Weekly Schedule */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-indigo-600" /> This Week
            </h2>
            <div className="space-y-2">
              {(path.weekly_schedule || []).map((day: any, i: number) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${day.completed ? 'bg-green-50' : i === 2 ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}>
                  <span className={`text-xs font-bold w-8 ${day.completed ? 'text-green-600' : 'text-gray-500'}`}>{day.day}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${day.completed ? 'text-green-700 line-through' : 'text-gray-800'}`}>{day.task}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{day.time}</span>
                  {day.completed && <CheckCircle size={12} className="text-green-600 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Other available paths */}
          {allPaths.filter(p => p.career_goal !== path.career_goal).length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Other Paths</h2>
              <div className="space-y-2">
                {allPaths.filter(p => p.career_goal !== path.career_goal).map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      {p.career_goal === 'Full Stack Developer' ? <Code size={15} className="text-indigo-600" /> : <Cpu size={15} className="text-indigo-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.total_weeks}w · {p.phases?.length} phases</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
