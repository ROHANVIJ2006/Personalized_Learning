import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Circle,
  Clock,
  Target,
  Code,
  Cpu,
  Brain,
  TrendingUp,
  Map
} from 'lucide-react';

const learningPaths = [
  {
    id: 1,
    title: 'AI Engineer',
    icon: Brain,
    description: 'Master ML and deep learning',
    progress: 65,
    active: true
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    icon: Code,
    description: 'Build web applications',
    progress: 40,
    active: false
  },
  {
    id: 3,
    title: 'Data Scientist',
    icon: Cpu,
    description: 'Analyze complex data',
    progress: 25,
    active: false
  }
];

const aiEngineerPhases = [
  {
    phase: 1,
    title: 'Programming Fundamentals',
    status: 'completed',
    duration: '4 weeks',
    modules: [
      { name: 'Python Basics', completed: true },
      { name: 'Data Structures', completed: true },
      { name: 'Algorithms', completed: true },
      { name: 'OOP Concepts', completed: true }
    ]
  },
  {
    phase: 2,
    title: 'Machine Learning Basics',
    status: 'in-progress',
    duration: '6 weeks',
    modules: [
      { name: 'Linear Regression', completed: true },
      { name: 'Classification', completed: true },
      { name: 'Decision Trees', completed: false },
      { name: 'Neural Networks', completed: false }
    ]
  },
  {
    phase: 3,
    title: 'Deep Learning',
    status: 'locked',
    duration: '8 weeks',
    modules: [
      { name: 'CNNs', completed: false },
      { name: 'RNNs', completed: false },
      { name: 'Transformers', completed: false },
      { name: 'GANs', completed: false }
    ]
  },
  {
    phase: 4,
    title: 'Specialization',
    status: 'locked',
    duration: '10 weeks',
    modules: [
      { name: 'NLP Projects', completed: false },
      { name: 'Computer Vision', completed: false },
      { name: 'Capstone Project', completed: false },
      { name: 'Portfolio', completed: false }
    ]
  }
];

const weeklySchedule = [
  { day: 'Mon', task: 'Decision Trees Theory', time: '2h', completed: true },
  { day: 'Tue', task: 'Practice Problems', time: '1.5h', completed: true },
  { day: 'Wed', task: 'Neural Networks', time: '2h', completed: false, current: true },
  { day: 'Thu', task: 'Coding Exercise', time: '1h', completed: false },
  { day: 'Fri', task: 'Project Work', time: '3h', completed: false }
];

export function LearningPath() {
  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto">
      {/* Hero Header - Unique Grid Pattern Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-700 rounded-xl p-6 text-white relative overflow-hidden mb-5 shadow-lg"
      >
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                <Map size={26} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Learning Path</span>
                </div>
                <h1 className="text-3xl font-bold mb-1">Your Journey Roadmap</h1>
                <p className="text-indigo-100 text-base">Structured paths to achieve your career goals</p>
              </div>
            </div>

            {/* Glass Morphism Stats */}
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={16} className="text-white" />
                  <span className="text-xs text-indigo-100 font-semibold">Progress</span>
                </div>
                <div className="text-2xl font-bold">65%</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-white" />
                  <span className="text-xs text-indigo-100 font-semibold">Est. Time</span>
                </div>
                <div className="text-2xl font-bold">12w</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Path Selector */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {learningPaths.map((path, index) => {
          const Icon = path.icon;
          return (
            <div
              key={path.id}
              className={`rounded-lg p-4 cursor-pointer transition-all border ${
                path.active 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    path.active ? 'bg-white/20' : 'bg-indigo-50'
                  }`}
                >
                  <Icon size={20} className={path.active ? 'text-white' : 'text-indigo-600'} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-bold ${path.active ? 'text-white' : 'text-gray-900'}`}>
                    {path.title}
                  </h3>
                  <p className={`text-xs ${path.active ? 'text-indigo-100' : 'text-gray-600'}`}>
                    {path.description}
                  </p>
                </div>
              </div>
              <div className="mb-2">
                <div className={`h-1.5 rounded-full overflow-hidden ${path.active ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <div 
                    className={`h-full rounded-full ${path.active ? 'bg-white' : 'bg-indigo-600'}`}
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
              <div className={`text-sm font-semibold ${path.active ? 'text-white' : 'text-gray-900'}`}>
                {path.progress}% Complete
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100%-230px)]">
        {/* Roadmap Timeline */}
        <div className="col-span-2 bg-white rounded-lg p-4 border border-gray-200 overflow-y-auto">
          <h2 className="text-base font-bold text-gray-900 mb-4">AI Engineer Roadmap</h2>

          <div className="space-y-3">
            {aiEngineerPhases.map((phase, index) => (
              <div key={phase.phase} className="flex gap-3">
                {/* Phase Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    phase.status === 'completed' 
                      ? 'bg-indigo-600 text-white' 
                      : phase.status === 'in-progress' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {phase.status === 'completed' ? <CheckCircle size={18} /> : phase.phase}
                  </div>
                  {index < aiEngineerPhases.length - 1 && (
                    <div className={`w-0.5 h-10 my-1 ${
                      phase.status === 'completed' ? 'bg-indigo-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Phase Content */}
                <div className="flex-1">
                  <div className={`rounded-lg p-3 border transition-all ${
                    phase.status === 'completed' 
                      ? 'bg-white border-indigo-200' 
                      : phase.status === 'in-progress' 
                      ? 'bg-indigo-50 border-indigo-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-gray-900">{phase.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            phase.status === 'completed' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : phase.status === 'in-progress' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {phase.status === 'completed' ? 'Completed' : phase.status === 'in-progress' ? 'Active' : 'Locked'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock size={12} />
                          <span>{phase.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-0.5">Progress</div>
                        <div className="text-base font-bold text-gray-900">
                          {phase.modules.filter(m => m.completed).length}/{phase.modules.length}
                        </div>
                      </div>
                    </div>

                    {/* Modules */}
                    <div className="grid grid-cols-2 gap-2">
                      {phase.modules.map((module, i) => (
                        <div 
                          key={i}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                            module.completed 
                              ? 'bg-white border-indigo-200' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {module.completed ? (
                            <CheckCircle size={14} className="text-indigo-600 flex-shrink-0" />
                          ) : (
                            <Circle size={14} className="text-gray-400 flex-shrink-0" />
                          )}
                          <span className={`text-xs font-medium ${module.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                            {module.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h2 className="text-base font-bold text-gray-900 mb-4">This Week</h2>

          <div className="space-y-2">
            {weeklySchedule.map((day, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border transition-all ${
                  day.completed 
                    ? 'bg-white border-indigo-200' 
                    : day.current 
                    ? 'bg-indigo-50 border-indigo-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-xs font-bold ${day.completed ? 'text-indigo-600' : day.current ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {day.day}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock size={11} />
                    <span>{day.time}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-900 font-medium mb-2">
                  {day.task}
                </div>
                {day.completed && (
                  <div className="flex items-center gap-1 text-xs text-indigo-600">
                    <CheckCircle size={12} />
                    <span className="font-semibold">Completed</span>
                  </div>
                )}
                {day.current && (
                  <div className="flex items-center gap-1 text-xs text-indigo-600">
                    <TrendingUp size={12} />
                    <span className="font-semibold">In Progress</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weekly Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Weekly Progress</span>
              <span className="text-sm font-bold text-gray-900">2/5 days</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>3.5 hours completed</span>
              <span className="font-semibold text-gray-900">9.5h total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}