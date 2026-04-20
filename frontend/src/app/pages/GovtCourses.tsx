import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Star, Users, Clock, ExternalLink, Award } from 'lucide-react';
import { api } from '../../lib/api';

export function GovtCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<'all'|'NPTEL'|'Swayam'|'Infosys Springboard'>('all');
  const [enrolling, setEnrolling] = useState<number|null>(null);

  useEffect(() => {
    api.getCourses({ govt_only: true }).then(setCourses).catch(console.error).finally(() => setLoading(false));
  }, []);

  const enroll = async (id: number, url?: string) => {
    setEnrolling(id);
    try { await api.enrollCourse(id); if (url) window.open(url,'_blank'); }
    catch (e: any) { if (url) window.open(url,'_blank'); }
    finally { setEnrolling(null); }
  };

  const filtered = courses.filter(c => provider === 'all' || c.provider === provider);
  const providers = ['NPTEL','Swayam','Infosys Springboard'];

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="px-8 py-5 max-w-[1400px] mx-auto h-[calc(100vh-80px)] overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 text-white mb-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Government Certified Courses</h1>
            <p className="text-indigo-100 text-sm mt-0.5">NPTEL · Swayam · Infosys Springboard — Free & officially certified</p>
          </div>
        </div>
      </motion.div>

      {/* Provider filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {(['all',...providers] as const).map(p => (
          <button key={p} onClick={() => setProvider(p as any)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${provider === p ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {p === 'all' ? `All (${courses.length})` : `${p} (${courses.filter(c=>c.provider===p).length})`}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award size={10} /> {course.provider}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">Free</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{course.instructor}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{course.description}</p>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-700">{course.rating}</span>
                <span>({course.review_count?.toLocaleString()})</span>
              </div>
              {course.duration_weeks && (
                <div className="flex items-center gap-1"><Clock size={12} />{course.duration_weeks}w</div>
              )}
              {course.enrolled_count > 0 && (
                <div className="flex items-center gap-1"><Users size={12} />{course.enrolled_count?.toLocaleString()}</div>
              )}
            </div>
            {course.start_date && (
              <p className="text-xs text-indigo-600 font-semibold mb-3">Starts: {course.start_date}</p>
            )}
            <button onClick={() => enroll(course.id, course.url)} disabled={enrolling === course.id}
              className="w-full py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {enrolling === course.id ? 'Enrolling...' : 'Enroll Free'}
              <ExternalLink size={13} />
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-40" />
          <p>No courses for this provider</p>
        </div>
      )}
    </div>
  );
}
