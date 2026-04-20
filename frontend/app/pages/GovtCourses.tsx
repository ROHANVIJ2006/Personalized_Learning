import { motion } from 'motion/react';
import { 
  Building2, 
  Award, 
  Star,
  Calendar,
  Users,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Clock,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Landmark
} from 'lucide-react';
import { useState } from 'react';

const providers = [
  {
    id: 1,
    name: 'NPTEL',
    description: 'IIT/IISc courses with certification',
    coursesCount: 1200,
    icon: GraduationCap
  },
  {
    id: 2,
    name: 'Swayam',
    description: 'MHRD initiative for all disciplines',
    coursesCount: 2000,
    icon: BookOpen
  },
  {
    id: 3,
    name: 'Infosys Springboard',
    description: 'Industry-focused tech training',
    coursesCount: 300,
    icon: Building2
  }
];

const upcomingCourses = [
  {
    id: 1,
    title: 'Machine Learning Foundations',
    provider: 'NPTEL',
    instructor: 'Prof. Balaraman Ravindran, IIT Madras',
    startDate: 'Feb 15',
    duration: '12w',
    rating: 4.8,
    enrolled: 45000
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    provider: 'Swayam',
    instructor: 'Prof. Naveen Garg, IIT Delhi',
    startDate: 'Feb 20',
    duration: '8w',
    rating: 4.9,
    enrolled: 67000
  },
  {
    id: 3,
    title: 'Full Stack Development',
    provider: 'Infosys',
    instructor: 'Industry Experts',
    startDate: 'Feb 18',
    duration: '16w',
    rating: 4.6,
    enrolled: 23000
  },
  {
    id: 4,
    title: 'Cloud Computing Fundamentals',
    provider: 'NPTEL',
    instructor: 'Prof. Soumya Banerjee, IIT KGP',
    startDate: 'Feb 22',
    duration: '10w',
    rating: 4.7,
    enrolled: 34000
  },
  {
    id: 5,
    title: 'Python for Data Science',
    provider: 'Swayam',
    instructor: 'Prof. Padmanabhan, IIT Bombay',
    startDate: 'Feb 25',
    duration: '6w',
    rating: 4.8,
    enrolled: 56000
  },
  {
    id: 6,
    title: 'Cybersecurity Essentials',
    provider: 'Infosys',
    instructor: 'Infosys Security Team',
    startDate: 'Feb 28',
    duration: '12w',
    rating: 4.5,
    enrolled: 19000
  }
];

// Calendar data for February 2026
const calendarCourses = [
  { date: 15, title: 'ML Foundations' },
  { date: 18, title: 'Full Stack' },
  { date: 20, title: 'DSA' },
  { date: 22, title: 'Cloud Computing' },
  { date: 25, title: 'Python DS' },
  { date: 28, title: 'Cybersecurity' }
];

export function GovtCourses() {
  const [showCalendar, setShowCalendar] = useState(false);

  // Generate calendar days for February 2026
  const daysInMonth = 28;
  const firstDayOfWeek = 6; // Saturday (Feb 1, 2026)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - firstDayOfWeek + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto">
      {/* Hero Header - Unique Badge/Shield Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-xl mb-5 shadow-lg"
      >
        {/* Split Background Design */}
        <div className="relative z-10 flex items-stretch">
          {/* Left Side - Darker Gradient */}
          <div className="flex-1 bg-gradient-to-br from-indigo-700 to-indigo-900 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <Landmark size={26} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award size={14} className="text-indigo-200" />
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-wide">Government Certified</span>
                </div>
                <h1 className="text-3xl font-bold mb-1">Official Programs</h1>
                <p className="text-indigo-100 text-base">Free quality education from premier institutions</p>
              </div>
            </div>
          </div>

          {/* Right Side - Lighter Gradient with Stats */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20 shadow-lg text-white">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} />
                <span className="text-xs font-semibold text-indigo-100">Courses</span>
              </div>
              <div className="text-2xl font-bold">3,500+</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20 shadow-lg text-white">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} />
                <span className="text-xs font-semibold text-indigo-100">Learners</span>
              </div>
              <div className="text-2xl font-bold">2.5M+</div>
            </div>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-white text-indigo-700 px-4 py-3 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2 ml-2"
            >
              <Calendar size={16} />
              {showCalendar ? 'View List' : 'Calendar'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Platform Selector */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {providers.map((provider, index) => {
          const Icon = provider.icon;
          return (
            <div
              key={provider.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-all">
                    <Icon size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-gray-500">{provider.coursesCount}+ Courses</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{provider.description}</p>
            </div>
          );
        })}
      </div>

      {/* Key Benefits */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { icon: Award, title: 'Free Certification' },
          { icon: Building2, title: 'Govt Recognized' },
          { icon: Users, title: 'Expert Faculty' },
          { icon: GraduationCap, title: 'Career Boost' }
        ].map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <benefit.icon className="text-gray-700" size={18} />
            </div>
            <div className="text-sm font-semibold text-gray-900">{benefit.title}</div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      {showCalendar ? (
        // Compact Calendar View
        <div className="grid grid-cols-5 gap-4 h-[calc(100%-270px)]">
          {/* Calendar */}
          <div className="col-span-2 bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button className="p-1.5 hover:bg-gray-100 rounded transition-all">
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <h3 className="text-base font-bold text-gray-900">February 2026</h3>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-all">
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs font-semibold text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const hasCourse = calendarCourses.find(c => c.date === day);
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded flex items-center justify-center text-sm transition-all ${
                      day
                        ? day === 10
                          ? 'bg-indigo-600 text-white font-bold'
                          : hasCourse
                          ? 'bg-indigo-50 text-indigo-600 font-semibold cursor-pointer hover:bg-indigo-100'
                          : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                        : ''
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course List for Calendar */}
          <div className="col-span-3 bg-white rounded-lg p-4 border border-gray-200 overflow-y-auto">
            <h3 className="text-base font-bold text-gray-900 mb-3">Scheduled Courses</h3>
            <div className="space-y-2">
              {upcomingCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{course.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-semibold text-indigo-600">{course.provider}</span>
                        <span>•</span>
                        <span>{course.instructor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={14} className="text-amber-500" fill="#f59e0b" />
                      <span className="font-semibold text-gray-900">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{course.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{(course.enrolled / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-all">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Refined List View
        <div className="grid grid-cols-3 gap-3 h-[calc(100%-270px)] overflow-y-auto pr-1">
          {upcomingCourses.map((course, index) => (
            <div
              key={course.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-all group h-fit"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-indigo-600">{course.provider}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                      Free
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm ml-2">
                  <Star size={14} className="text-amber-500" fill="#f59e0b" />
                  <span className="font-bold text-gray-900">{course.rating}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <Users size={14} className="text-gray-400" />
                <span className="text-xs text-gray-600">{course.instructor}</span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Start Date</div>
                  <div className="text-sm font-bold text-gray-900">{course.startDate}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Duration</div>
                  <div className="text-sm font-bold text-gray-900">{course.duration}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Enrolled</div>
                  <div className="text-sm font-bold text-gray-900">{(course.enrolled / 1000).toFixed(0)}K</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Register
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  <ExternalLink size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}