import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Target, 
  Award,
  LineChart,
  CheckCircle,
  Trophy,
  ArrowUp,
  Code,
  Cpu,
  Box,
  Database
} from 'lucide-react';
import { PageHero } from '../components/PageHero';

const skillsData = [
  { 
    name: 'Python', 
    current: 85, 
    target: 90, 
    improvement: 15, 
    icon: Code
  },
  { 
    name: 'Machine Learning', 
    current: 72, 
    target: 85, 
    improvement: 22, 
    icon: Cpu
  },
  { 
    name: 'React', 
    current: 78, 
    target: 85, 
    improvement: 18, 
    icon: Box
  },
  { 
    name: 'SQL', 
    current: 90, 
    target: 95, 
    improvement: 12, 
    icon: Database
  },
  { 
    name: 'Data Structures', 
    current: 68, 
    target: 80, 
    improvement: 25, 
    icon: Code
  }
];

const milestones = [
  {
    id: 1,
    title: 'First ML Project Completed',
    description: 'Built a sentiment analysis model',
    date: 'Jan 15, 2026',
    icon: Target
  },
  {
    id: 2,
    title: 'Python Expert Badge Earned',
    description: 'Scored 95% in Python assessment',
    date: 'Jan 28, 2026',
    icon: Trophy
  },
  {
    id: 3,
    title: 'React Certification',
    description: 'Completed Advanced React course',
    date: 'Feb 5, 2026',
    icon: Award
  },
  {
    id: 4,
    title: '30-Day Learning Streak',
    description: 'Consistent daily learning achievement',
    date: 'Feb 10, 2026',
    icon: TrendingUp
  }
];

const monthlyProgress = [
  { month: 'Sep', score: 55 },
  { month: 'Oct', score: 62 },
  { month: 'Nov', score: 68 },
  { month: 'Dec', score: 74 },
  { month: 'Jan', score: 80 },
  { month: 'Feb', score: 87 }
];

export function SkillProgress() {
  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto flex flex-col">
      {/* Hero Header - Unique Design with Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl border-2 border-indigo-200 p-6 mb-5 relative overflow-hidden shadow-lg"
      >
        {/* Diagonal Stripe Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #4f46e5 0px, #4f46e5 20px, transparent 20px, transparent 40px)',
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Animated Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Skill Progress</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Track Your Growth</h1>
                <p className="text-gray-600 text-base">Monitor your skill development and celebrate your achievements</p>
              </div>
            </div>

            {/* Stats in bordered cards */}
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl px-5 py-3 border-2 border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-indigo-600" />
                  <span className="text-xs text-gray-600 font-semibold">Avg Growth</span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">+18%</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl px-5 py-3 border-2 border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={16} className="text-indigo-600" />
                  <span className="text-xs text-gray-600 font-semibold">Badges</span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">24</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Two Columns */}
      <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
        {/* Left Column - Chart + Skills */}
        <div className="col-span-2 space-y-4 overflow-y-auto pr-2">
          {/* Monthly Progress Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LineChart className="text-indigo-600" size={18} />
                <h2 className="text-base font-bold text-gray-900">Score Progression</h2>
              </div>
              <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs font-semibold">
                <ArrowUp size={14} />
                <span>+32% in 6 months</span>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between h-40 gap-2">
              {monthlyProgress.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${month.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute bottom-0 w-full bg-indigo-600 rounded-t-lg flex items-start justify-center pt-1"
                    >
                      <span className="text-white font-bold text-xs">{month.score}</span>
                    </motion.div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 mt-1">{month.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-3">Detailed Skill Metrics</h2>
            <div className="space-y-3">
              {skillsData.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <Icon size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{skill.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-600">Current: <span className="font-semibold text-gray-900">{skill.current}%</span></span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-600">Target: <span className="font-semibold text-gray-900">{skill.target}%</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right bg-indigo-50 px-3 py-1.5 rounded-lg">
                        <div className="flex items-center gap-1">
                          <TrendingUp size={12} className="text-indigo-600" />
                          <span className="text-sm font-bold text-gray-900">+{skill.improvement}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.current}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-indigo-600 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">0%</span>
                        <span className="text-xs font-semibold text-gray-700">{skill.current}%</span>
                        <span className="text-xs text-gray-500">100%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Milestones */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-indigo-600" size={18} />
            <h2 className="text-base font-bold text-gray-900">Milestones</h2>
          </div>

          <div className="space-y-3">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.id}
                  className="flex gap-3"
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-900 flex-1">{milestone.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                      <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {milestone.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}