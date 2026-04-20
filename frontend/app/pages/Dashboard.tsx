import { motion } from 'motion/react';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Flame,
  Award,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const learningData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 2.7 },
  { day: 'Sun', hours: 3.0 }
];

const skills = [
  { name: 'Python', progress: 85 },
  { name: 'Machine Learning', progress: 72 },
  { name: 'React', progress: 78 },
  { name: 'SQL', progress: 90 }
];

const recommendedCourses = [
  {
    title: 'Advanced Machine Learning',
    provider: 'Stanford Online',
    duration: '6 weeks',
    match: '95%',
    thumbnail: 'ML'
  },
  {
    title: 'Deep Learning Specialization',
    provider: 'Coursera',
    duration: '3 months',
    match: '92%',
    thumbnail: 'DL'
  },
  {
    title: 'Neural Networks',
    provider: 'NPTEL',
    duration: '8 weeks',
    match: '88%',
    thumbnail: 'NN'
  }
];

export function Dashboard() {
  return (
    <>
      <div className="px-8 py-3 space-y-3 max-w-[1400px] mx-auto h-[calc(100vh-80px)] overflow-y-auto">
        {/* Hero Welcome Section with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-xl p-4 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={20} className="text-indigo-200" />
                  <span className="text-sm font-semibold text-indigo-200">Welcome back</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Hello, Rohani!</h1>
                <p className="text-indigo-100 text-base">Ready to continue your AI Engineer journey? You're making great progress!</p>
              </div>

              {/* Quick Stats in Hero */}
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} className="text-white" />
                    <span className="text-xs text-indigo-100">Progress</span>
                  </div>
                  <div className="text-2xl font-bold">68%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame size={16} className="text-white" />
                    <span className="text-xs text-indigo-100">Streak</span>
                  </div>
                  <div className="text-2xl font-bold">6 days</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions with Visual Enhancement */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-5 border-2 border-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={22} />
                </div>
                <ArrowRight className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Continue Learning</h3>
              <p className="text-sm text-gray-600">Machine Learning Module 3</p>
              <div className="mt-3 pt-3 border-t border-indigo-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-indigo-600">67%</span>
                </div>
                <div className="mt-1.5 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-5 border-2 border-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <CheckCircle className="text-white" size={22} />
                </div>
                <ArrowRight className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Test Your Skills</h3>
              <p className="text-sm text-gray-600">Python Programming Assessment</p>
              <div className="mt-3 pt-3 border-t border-indigo-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Last Score</span>
                  <span className="font-bold text-indigo-600">9/10</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                    <div key={star} className={`h-1.5 flex-1 rounded-full ${star <= 9 ? 'bg-indigo-600' : 'bg-indigo-100'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { 
              icon: TrendingUp, 
              label: 'Overall Progress', 
              value: '68%',
              subtext: '+12% this week',
              iconBg: 'bg-indigo-600'
            },
            { 
              icon: Flame, 
              label: 'Learning Streak', 
              value: '6 days',
              subtext: 'Personal best: 12',
              iconBg: 'bg-indigo-600'
            },
            { 
              icon: Clock, 
              label: 'Total Hours', 
              value: '127h',
              subtext: '23h this month',
              iconBg: 'bg-indigo-600'
            },
            { 
              icon: Award, 
              label: 'Skills Mastered', 
              value: '8',
              subtext: '2 in progress',
              iconBg: 'bg-indigo-600'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
              className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all"
            >
              <div className={`w-11 h-11 ${stat.iconBg} rounded-lg flex items-center justify-center mb-3 shadow`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-indigo-600 font-medium">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Your Skills - Better Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-lg p-5 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Your Skills</h2>
              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{skill.name}</span>
                    <span className="text-sm font-bold text-gray-900">{skill.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-indigo-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="bg-white rounded-lg p-5 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-indigo-600" size={18} />
              <h3 className="text-base font-bold text-gray-900">Weekly Goal</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Complete 5 learning hours this week</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">3.5 / 5 hours</span>
                <span className="text-sm font-semibold text-gray-900">70%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
            <div className="text-xs text-gray-700 bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <span className="font-semibold text-indigo-600">Keep going!</span> You're 1.5 hours away from your goal.
            </div>
          </motion.div>
        </div>

        {/* Learning Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-lg p-4 border border-gray-200"
        >
          <h2 className="text-base font-bold text-gray-900 mb-3">Learning Activity</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#9ca3af' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recommended Courses Based on Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recommended for You</h2>
              <p className="text-sm text-gray-600">Based on your AI Engineer learning path</p>
            </div>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {recommendedCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
                    {course.thumbnail}
                  </div>
                  <div className="bg-indigo-50 px-2 py-1 rounded">
                    <span className="text-xs font-semibold text-indigo-600">{course.match}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <span className="font-medium">{course.provider}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                  <Play size={14} />
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-base font-bold text-gray-900 mb-3">Recent Activity</h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {[
              { action: 'Completed', item: 'Machine Learning Module 2', time: '2 hours ago', icon: CheckCircle },
              { action: 'Started', item: 'Neural Networks Course', time: '5 hours ago', icon: BookOpen },
              { action: 'Earned', item: 'Python Expert Badge', time: '1 day ago', icon: Award }
            ].map((activity, index) => (
              <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <activity.icon className="text-indigo-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}