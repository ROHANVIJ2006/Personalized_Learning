import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Briefcase,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Target,
  Edit,
  Mail,
  Linkedin,
  Github,
  Code,
  Database,
  Cpu,
  Box
} from 'lucide-react';
import { Link } from 'react-router';

const skills = [
  { name: 'Python', progress: 85, icon: Code },
  { name: 'Machine Learning', progress: 72, icon: Cpu },
  { name: 'React', progress: 78, icon: Box },
  { name: 'SQL', progress: 90, icon: Database },
  { name: 'Data Structures', progress: 68, icon: Code }
];

const achievements = [
  { title: 'Python Expert', desc: 'Scored 95% in assessment', date: 'Jan 28' },
  { title: 'ML Enthusiast', desc: 'Completed 5 courses', date: 'Jan 15' },
  { title: '30-Day Streak', desc: 'Consistent learning', date: 'Feb 10' },
  { title: 'Quick Learner', desc: 'Completed 10 courses', date: 'Feb 5' }
];

const activities = [
  { action: 'Completed', item: 'Deep Learning Module 3', time: '2 hours ago' },
  { action: 'Started', item: 'Neural Networks Course', time: '5 hours ago' },
  { action: 'Earned', item: 'Python Expert Badge', time: '1 day ago' },
  { action: 'Scored', item: '9/10 in React Quiz', time: '2 days ago' }
];

export function Profile() {
  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-indigo-600 rounded-lg p-5 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow">
              <span className="text-2xl font-bold text-indigo-600">R</span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Rohani</h1>
              <div className="flex items-center gap-4 text-sm text-indigo-100 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>Mumbai, India</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span>AI Engineer Path</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
              <Mail size={16} className="text-white" />
            </button>
            <button className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
              <Linkedin size={16} className="text-white" />
            </button>
            <button className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
              <Github size={16} className="text-white" />
            </button>
            <Link to="/edit-profile">
              <button className="px-3 py-2 text-sm bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2">
                <Edit size={14} />
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { icon: Target, label: 'Profile Complete', value: '85%' },
          { icon: Award, label: 'Certificates', value: '12' },
          { icon: TrendingUp, label: 'Skills Mastered', value: '8' },
          { icon: Calendar, label: 'Learning Streak', value: '30' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <stat.icon className="text-indigo-600" size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-600">{stat.label}</div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100%-220px)]">
        {/* My Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg p-5 border border-gray-200"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Skills</h2>
          <div className="space-y-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-50 rounded flex items-center justify-center">
                        <Icon size={14} className="text-indigo-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{skill.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{skill.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full bg-indigo-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-white rounded-lg p-5 border border-gray-200"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{achievement.title}</h3>
                  <Award size={16} className="text-indigo-600" />
                </div>
                <p className="text-xs text-gray-600 mb-1">{achievement.desc}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>{achievement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg p-5 border border-gray-200"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-indigo-600" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.action}</span> {activity.item}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
