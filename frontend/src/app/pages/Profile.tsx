import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Briefcase, Award, TrendingUp, Code, Cpu, Database, Box, Brain } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

const ICON_MAP: Record<string,any> = { 'Python Programming':Code, 'Machine Learning':Cpu, 'Deep Learning':Brain, 'React Development':Box, 'SQL & Databases':Database };

export function Profile() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSkillProgress(), api.getAssessmentHistory()])
      .then(([s, h]) => { setSkills(s); setHistory(h); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto overflow-y-auto">
      {/* Profile Header */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="bg-indigo-600 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-2xl font-bold text-indigo-600">{user.name[0]?.toUpperCase()}</span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center gap-4 text-sm text-indigo-100 mt-1">
                {user.location && <div className="flex items-center gap-1"><MapPin size={14} /><span>{user.location}</span></div>}
                <div className="flex items-center gap-1"><Briefcase size={14} /><span>{user.career_goal || 'AI Engineer'} Path</span></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center text-white">
              <div className="text-2xl font-bold">{user.streak_days || 0}</div>
              <div className="text-xs text-indigo-200">Day Streak</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold">{(user.total_xp||0).toLocaleString()}</div>
              <div className="text-xs text-indigo-200">Total XP</div>
            </div>
            <div className="text-center text-white">
              <div className="text-2xl font-bold">{skills.length}</div>
              <div className="text-xs text-indigo-200">Skills</div>
            </div>
            <Link to="/dashboard/settings"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-semibold hover:bg-white/30 transition-all">
              Edit Profile
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {/* Skills */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600" /> Skill Proficiencies
          </h2>
          {skills.length > 0 ? (
            <div className="space-y-3">
              {skills.map((sk, i) => {
                const Icon = ICON_MAP[sk.skill_name] || Code;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700 truncate">{sk.skill_name}</span>
                        <span className="text-xs text-gray-500 ml-2">{Math.round(sk.current_score)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <motion.div initial={{ width:0 }} animate={{ width:`${sk.current_score}%` }}
                          transition={{ duration:1, delay:i*0.1 }} className="h-full bg-indigo-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Code size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Take assessments to see your skills</p>
            </div>
          )}
        </div>

        {/* Assessment History */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={16} className="text-indigo-600" /> Recent Assessments
          </h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.slice(0, 8).map((h: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{h.skill_name}</p>
                    <p className="text-xs text-gray-500">{new Date(h.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${h.score >= 80 ? 'text-green-600' : h.score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{h.score}%</div>
                    {h.mastery_probability > 0 && (
                      <div className="text-xs text-indigo-500">MT-KT: {(h.mastery_probability*100).toFixed(0)}%</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Award size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No assessments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
