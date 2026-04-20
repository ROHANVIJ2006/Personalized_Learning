import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Target, Clock, TrendingUp, Flame, Award, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router';

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || data?.user?.name || 'Learner';
  const weeklyHours = data?.weekly_hours || [];
  const skillProfiles = data?.skill_profiles || [];
  const recentCourses = data?.recent_courses || [];
  const overallProgress = data?.overall_progress || 0;
  const streakDays = data?.streak_days || 0;
  const totalXp = data?.user?.total_xp || 0;

  return (
    <div className="px-8 py-3 space-y-3 max-w-[1400px] mx-auto h-[calc(100vh-80px)] overflow-y-auto">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-xl p-4 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
        </div>
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-indigo-200" />
              <span className="text-sm font-semibold text-indigo-200">Welcome back</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Hello, {userName}!</h1>
            <p className="text-indigo-100 text-base">
              {overallProgress > 0
                ? `You're ${Math.round(overallProgress)}% through your ${user?.career_goal || 'AI Engineer'} journey. Keep it up!`
                : 'Start your first skill assessment to unlock personalized AI recommendations.'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-white" />
                <span className="text-xs text-indigo-100">Progress</span>
              </div>
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={16} className="text-white" />
                <span className="text-xs text-indigo-100">Streak</span>
              </div>
              <div className="text-2xl font-bold">{streakDays} days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Award size={16} className="text-white" />
                <span className="text-xs text-indigo-100">XP</span>
              </div>
              <div className="text-2xl font-bold">{totalXp.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-2 bg-white rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-base font-bold text-gray-900 mb-3">Weekly Learning Activity</h2>
          {weeklyHours.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [`${v}h`, 'Hours']} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-gray-400">
              <Clock size={32} className="mb-2 opacity-40" />
              <p className="text-sm">No sessions yet. Take an assessment to begin!</p>
              <Link to="/dashboard/assessment" className="mt-2 text-indigo-600 text-sm font-semibold hover:underline">
                Start Assessment →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Skill Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-gray-200"
        >
          <h2 className="text-base font-bold text-gray-900 mb-3">Skill Snapshot</h2>
          {skillProfiles.length > 0 ? (
            <div className="space-y-3">
              {skillProfiles.slice(0, 4).map((skill: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{skill.skill_name}</span>
                    <span className="text-xs text-gray-500">{Math.round(skill.proficiency)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-6">
              <Target size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs">Take assessments to see your skills</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Courses or CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl p-4 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">
            {recentCourses.length > 0 ? 'Enrolled Courses' : 'Get Started'}
          </h2>
          <Link to="/dashboard/recommendations" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {recentCourses.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {recentCourses.map((course: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen size={16} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{course.provider}</p>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${course.progress_percent || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{course.progress_percent || 0}% complete</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-3">Take a skill assessment to get AI-powered course recommendations</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard/assessment"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Take Assessment
              </Link>
              <Link to="/dashboard/recommendations"
                className="px-4 py-2 border border-indigo-200 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
