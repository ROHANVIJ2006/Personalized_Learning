import { motion } from 'motion/react';
import { 
  Sparkles, 
  Star, 
  Clock, 
  TrendingUp,
  ExternalLink,
  Filter,
  Play,
  CheckCircle,
  Users,
  Award,
  GraduationCap,
  Trophy
} from 'lucide-react';
import { PageHero } from '../components/PageHero';

const aiInsight = {
  message: "Based on your skill analysis, focusing on Advanced Machine Learning will significantly boost your AI Engineer path progression.",
  focus: "Machine Learning & Deep Learning",
  impact: "35% improvement"
};

const courses = [
  {
    id: 1,
    title: 'Deep Learning Specialization',
    provider: 'Coursera',
    instructor: 'Andrew Ng',
    rating: 4.9,
    reviews: 125,
    duration: '3mo',
    matchScore: 98,
    price: 'Free',
    tags: ['AI/ML', 'Recommended'],
    level: 'Intermediate'
  },
  {
    id: 2,
    title: 'Machine Learning with Python',
    provider: 'NPTEL',
    instructor: 'IIT Madras',
    rating: 4.7,
    reviews: 45,
    duration: '12w',
    matchScore: 95,
    price: 'Free',
    tags: ['AI/ML', 'Govt'],
    level: 'Intermediate'
  },
  {
    id: 3,
    title: 'Advanced React Patterns',
    provider: 'Frontend Masters',
    instructor: 'Kent C. Dodds',
    rating: 4.8,
    reviews: 28,
    duration: '6w',
    matchScore: 87,
    price: '$39/mo',
    tags: ['Web Dev'],
    level: 'Advanced'
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms',
    provider: 'Swayam',
    instructor: 'IIT Delhi',
    rating: 4.6,
    reviews: 67,
    duration: '8w',
    matchScore: 82,
    price: 'Free',
    tags: ['CS Fund'],
    level: 'Intermediate'
  },
  {
    id: 5,
    title: 'Cloud Computing with AWS',
    provider: 'AWS Training',
    instructor: 'Amazon',
    rating: 4.7,
    reviews: 89,
    duration: '10w',
    matchScore: 78,
    price: 'Free',
    tags: ['Cloud'],
    level: 'Beginner'
  },
  {
    id: 6,
    title: 'Full Stack Web Development',
    provider: 'Infosys',
    instructor: 'Infosys Team',
    rating: 4.5,
    reviews: 34,
    duration: '16w',
    matchScore: 75,
    price: 'Free',
    tags: ['Web Dev', 'Govt'],
    level: 'Intermediate'
  },
  {
    id: 7,
    title: 'Natural Language Processing',
    provider: 'Coursera',
    instructor: 'deeplearning.ai',
    rating: 4.8,
    reviews: 52,
    duration: '4mo',
    matchScore: 92,
    price: 'Free',
    tags: ['AI/ML'],
    level: 'Advanced'
  },
  {
    id: 8,
    title: 'Computer Vision Fundamentals',
    provider: 'NPTEL',
    instructor: 'IIT Bombay',
    rating: 4.6,
    reviews: 38,
    duration: '10w',
    matchScore: 88,
    price: 'Free',
    tags: ['AI/ML', 'Govt'],
    level: 'Intermediate'
  },
  {
    id: 9,
    title: 'Docker & Kubernetes',
    provider: 'Linux Foundation',
    instructor: 'LF Team',
    rating: 4.7,
    reviews: 41,
    duration: '8w',
    matchScore: 73,
    price: '$299',
    tags: ['DevOps'],
    level: 'Intermediate'
  }
];

const filters = ['All', 'AI/ML', 'Web Dev', 'Cloud', 'Free', 'Govt'];

export function CourseRecommendations() {
  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto flex flex-col">
      {/* Hero Header - Unique Wave Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-xl p-6 text-white relative overflow-hidden mb-5 shadow-lg"
      >
        {/* Animated Wave Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,80 600,80 900,0 C1050,40 1150,40 1200,0 L1200,120 L0,120 Z" fill="white"/>
          </svg>
          <svg className="absolute top-0 right-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)' }}>
            <path d="M0,0 C300,80 600,80 900,0 C1050,40 1150,40 1200,0 L1200,120 L0,120 Z" fill="white"/>
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                <GraduationCap size={26} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-indigo-200" />
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-wide">AI-Powered Recommendations</span>
                </div>
                <h1 className="text-3xl font-bold mb-1">Personalized Learning</h1>
                <p className="text-indigo-100 text-base">Courses tailored to your goals and skill level</p>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={16} className="text-white fill-white" />
                  <span className="text-xs text-white font-semibold">Match Rate</span>
                </div>
                <div className="text-2xl font-bold">98%</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap size={16} className="text-white" />
                  <span className="text-xs text-white font-semibold">Courses</span>
                </div>
                <div className="text-2xl font-bold">127</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Insight Card - Very Compact */}
      <div className="bg-indigo-600 rounded-lg p-3 text-white mb-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold">AI Recommendation</h2>
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-indigo-200">Focus: </span>
                  <span className="font-semibold">{aiInsight.focus}</span>
                </div>
                <div>
                  <span className="text-indigo-200">Impact: </span>
                  <span className="font-semibold">{aiInsight.impact}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-indigo-100">{aiInsight.message}</p>
          </div>
        </div>
      </div>

      {/* Filter Pills - Compact */}
      <div className="flex items-center gap-2 mb-3">
        {filters.map((filter, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              index === 0 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Course Grid - 3 Columns, Maximum Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-3 gap-3 pb-3">{courses.map((course, index) => (
            <div
              key={course.id}
              className="bg-white rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-all"
            >
              {/* Header with Match Score */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <div className="text-xs text-indigo-600 font-semibold mb-0.5">{course.provider}</div>
                  <div className="text-xs text-gray-600">{course.instructor}</div>
                </div>
                
                <div className="ml-2 flex-shrink-0">
                  <div className="w-11 h-11 rounded-lg bg-indigo-50 flex flex-col items-center justify-center border border-indigo-200">
                    <span className="text-base font-bold text-indigo-600">{course.matchScore}</span>
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                </div>
              </div>

              {/* Tags - Compact */}
              <div className="flex flex-wrap gap-1 mb-2">
                {course.tags.map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    {tag}
                  </span>
                ))}
                <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                  {course.level}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-1.5 mb-2 py-2 border-y border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 mb-0.5">
                    <Star className="text-amber-500" size={11} fill="#f59e0b" />
                    <span className="text-xs font-bold text-gray-900">{course.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{course.reviews}K</span>
                </div>
                <div className="flex flex-col items-center border-x border-gray-100">
                  <Clock className="text-gray-500 mb-0.5" size={11} />
                  <span className="text-xs font-bold text-gray-900">{course.duration}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Award className="text-gray-500 mb-0.5" size={11} />
                  <span className="text-xs font-bold text-gray-900">{course.price}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button className="flex-1 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 hover:bg-indigo-700 transition-all">
                  <Play size={12} />
                  Enroll Now
                </button>
                <button className="px-2 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-all">
                  <ExternalLink size={12} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path Progress Card - Professional */}
      <div className="mt-3 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-2 border-b border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={14} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Your AI Engineer Learning Path</h3>
                <p className="text-xs text-gray-600">2 of 4 milestones • 50% Complete</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-center justify-between">
            {[
              { title: 'Python Basics', icon: CheckCircle, completed: true },
              { title: 'ML Fundamentals', icon: CheckCircle, completed: true },
              { title: 'Deep Learning', icon: Award, completed: false },
              { title: 'Real Projects', icon: Trophy, completed: false }
            ].map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    {/* Icon Circle */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 shadow-sm ${
                      milestone.completed 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}>
                      <Icon size={16} />
                    </div>
                    
                    {/* Title */}
                    <div className="text-center">
                      <div className={`text-xs font-semibold ${
                        milestone.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {milestone.title}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 -mt-5 mx-1 ${
                      index < 2 ? 'bg-indigo-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}