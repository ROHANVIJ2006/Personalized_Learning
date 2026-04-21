import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Clock, ExternalLink, Filter, CheckCircle, Users, Award, GraduationCap } from 'lucide-react';
import { api } from '../../lib/api';

export function CourseRecommendations() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'free' | 'govt'>('all');
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [enrolled, setEnrolled] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    api.getRecommendations().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const enroll = async (courseId: number, courseTitle: string, url?: string) => {
    setEnrolling(courseId);
    try {
      await api.enrollCourse(courseId);
      setEnrolled(prev => new Set(prev).add(courseId));
      showToast(`Enrolled in "${courseTitle}" ✓`, 'success');
      if (url) window.open(url, '_blank');
    } catch (e: any) {
      if (e.message?.includes('Already enrolled')) {
        setEnrolled(prev => new Set(prev).add(courseId));
        showToast(`Already enrolled in "${courseTitle}"`, 'success');
        if (url) window.open(url, '_blank');
      } else {
        showToast(e.message || 'Enrollment failed. Try again.', 'error');
      }
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">DQN model ranking courses...</p>
        </div>
      </div>
    );
  }

  const courses: any[] = data?.courses || [];
  const aiInsight = data?.ai_insight || {};
  const userState = data?.user_state || {};

  const filtered = courses.filter(c => {
    if (filter === 'free') return c.price === 'Free' || c.price === 'Free to audit';
    if (filter === 'govt') return c.is_govt_certified;
    return true;
  });

  return (
    <div className="px-8 py-5 max-w-[1400px] mx-auto h-[calc(100vh-80px)] overflow-y-auto relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            <CheckCircle size={16} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      {/* AI Insight Banner */}
      {aiInsight.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white mb-5 shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-indigo-200">AI Insight · DQN Policy Engine</span>
                </div>
                <p className="text-white/90 text-sm">{aiInsight.message}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1">Focus: {aiInsight.focus}</span>
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1">{aiInsight.impact}</span>
                </div>
              </div>
            </div>
            {/* User state indicators */}
            <div className="flex gap-3 ml-4">
              <div className="text-center">
                <div className="text-lg font-bold">{userState.avg_correctness || 0}%</div>
                <div className="text-xs text-indigo-200">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{userState.focus_level || 0}%</div>
                <div className="text-xs text-indigo-200">Focus</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <Filter size={16} className="text-gray-400" />
        {(['all', 'free', 'govt'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All Courses' : f === 'free' ? 'Free Only' : 'Govt Certified'}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500">{filtered.length} courses · Ranked by DQN model</span>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((course: any, i: number) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {course.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      tag === 'Govt' ? 'bg-green-100 text-green-700' :
                      tag === 'Recommended' ? 'bg-purple-100 text-purple-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>{tag}</span>
                  ))}
                  {course.is_govt_certified && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                      <Award size={10} /> Govt Certified
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{course.provider}</p>
                {course.instructor && (
                  <p className="text-xs text-gray-400 mt-0.5">by {course.instructor}</p>
                )}
              </div>
              {/* Match Score */}
              <div className="ml-3 flex-shrink-0 text-center bg-indigo-50 rounded-xl px-3 py-2">
                <div className="text-lg font-bold text-indigo-600">{course.match_score}%</div>
                <div className="text-xs text-indigo-400">match</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-gray-700">{course.rating}</span>
                <span className="text-xs text-gray-400">({course.review_count?.toLocaleString()})</span>
              </div>
              {course.duration_weeks && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {course.duration_weeks}w
                </div>
              )}
              {course.enrolled_count > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} />
                  {course.enrolled_count?.toLocaleString()}
                </div>
              )}
              <span className={`text-xs font-semibold ml-auto ${
                course.price === 'Free' || course.price === 'Free to audit'
                  ? 'text-green-600' : 'text-gray-700'
              }`}>{course.price}</span>
            </div>

            {course.reason && (
              <p className="text-xs text-gray-500 italic mb-3 border-l-2 border-indigo-200 pl-2">{course.reason}</p>
            )}

            <button
              onClick={() => enroll(course.id, course.title, course.url)}
              disabled={enrolling === course.id}
              className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                enrolled.has(course.id)
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
              }`}
            >
              {enrolling === course.id ? 'Enrolling...' : enrolled.has(course.id) ? <><CheckCircle size={14} /> Enrolled!</> : <>Enroll & Open <ExternalLink size={14} /></>}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-40" />
          <p>No courses match this filter</p>
        </div>
      )}
    </div>
  );
}
