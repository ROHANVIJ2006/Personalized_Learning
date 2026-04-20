import { motion } from 'motion/react';
import { 
  ClipboardList, 
  CheckCircle,
  Award,
  Sparkles
} from 'lucide-react';

const availableAssessments = [
  {
    id: 1,
    skill: 'Python Programming',
    difficulty: 'Intermediate',
    questions: 15,
    timeLimit: 30,
    lastScore: 9,
    totalQuestions: 10,
    category: 'Programming'
  },
  {
    id: 2,
    skill: 'Machine Learning',
    difficulty: 'Advanced',
    questions: 20,
    timeLimit: 45,
    lastScore: 7,
    totalQuestions: 10,
    category: 'AI/ML'
  },
  {
    id: 3,
    skill: 'React Development',
    difficulty: 'Intermediate',
    questions: 12,
    timeLimit: 25,
    lastScore: 8,
    totalQuestions: 10,
    category: 'Web Development'
  },
  {
    id: 4,
    skill: 'Data Structures',
    difficulty: 'Advanced',
    questions: 18,
    timeLimit: 40,
    lastScore: null,
    totalQuestions: 10,
    category: 'Computer Science'
  },
  {
    id: 5,
    skill: 'SQL & Databases',
    difficulty: 'Beginner',
    questions: 10,
    timeLimit: 20,
    lastScore: 9,
    totalQuestions: 10,
    category: 'Database'
  },
  {
    id: 6,
    skill: 'Cloud Computing',
    difficulty: 'Intermediate',
    questions: 15,
    timeLimit: 30,
    lastScore: null,
    totalQuestions: 10,
    category: 'Cloud'
  }
];

const recentScores = [
  { skill: 'Python Programming', score: 9, total: 10, date: '2 days ago' },
  { skill: 'React Development', score: 8, total: 10, date: '5 days ago' },
  { skill: 'SQL & Databases', score: 9, total: 10, date: '1 week ago' }
];

export function SkillAssessment() {
  return (
    <div className="px-8 py-5 h-[calc(100vh-80px)] max-w-[1400px] mx-auto flex flex-col">
      {/* Hero Header - Unique Layered Card Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-5"
      >
        {/* Base Layer - Shadow */}
        <div className="absolute inset-0 bg-indigo-200 rounded-xl translate-y-2 translate-x-2 opacity-30" />
        
        {/* Main Card */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border-2 border-white/40">
                <ClipboardList size={26} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="px-2 py-0.5 bg-white/20 rounded text-xs font-bold uppercase tracking-wide">
                    Skill Assessment
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-1">Test Your Knowledge</h1>
                <p className="text-indigo-100 text-base">Validate your skills and track your progress with comprehensive assessments</p>
              </div>
            </div>

            {/* Stats - Floating Cards */}
            <div className="flex gap-3">
              <div className="bg-white text-indigo-700 rounded-xl px-5 py-3 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} />
                  <span className="text-xs font-semibold">Available</span>
                </div>
                <div className="text-2xl font-bold">6</div>
              </div>
              <div className="bg-white text-indigo-700 rounded-xl px-5 py-3 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Award size={16} />
                  <span className="text-xs font-semibold">Avg Score</span>
                </div>
                <div className="text-2xl font-bold">8.7/10</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Scores - More Compact */}
      <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-indigo-600" size={16} />
          <h2 className="text-base font-bold text-gray-900">Recent Test Results</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {recentScores.map((score, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-3 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{score.skill}</div>
                  <div className="text-xs text-gray-500">{score.date}</div>
                </div>
                <CheckCircle className="text-indigo-600 ml-2" size={16} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">{score.score}</span>
                <span className="text-sm text-gray-500">/ {score.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Assessments + Guidelines */}
      <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
        {/* Left - Assessments Grid (3 columns) */}
        <div className="col-span-3 overflow-y-auto pr-2">
          <h2 className="text-base font-bold text-gray-900 mb-3">Available Assessments</h2>
          <div className="grid grid-cols-3 gap-3 pb-4">
            {availableAssessments.map((assessment, index) => (
              <div
                key={assessment.id}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{assessment.skill}</h3>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {assessment.category}
                    </span>
                  </div>
                  {assessment.lastScore && (
                    <div className="bg-indigo-50 px-2 py-0.5 rounded ml-2">
                      <span className="text-xs font-semibold text-indigo-600">
                        {assessment.lastScore}/{assessment.totalQuestions}
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-1 mb-3 py-2 border-y border-gray-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Difficulty</div>
                    <div className="text-xs font-bold text-gray-900">{assessment.difficulty}</div>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="text-xs text-gray-500 mb-0.5">Questions</div>
                    <div className="text-xs font-bold text-gray-900">{assessment.questions}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Time</div>
                    <div className="text-xs font-bold text-gray-900">{assessment.timeLimit}m</div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  className="w-full py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 hover:bg-indigo-700 transition-all"
                >
                  <CheckCircle size={12} />
                  {assessment.lastScore ? 'Retake Test' : 'Start Test'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Guidelines */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award className="text-indigo-600" size={16} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Assessment Guidelines</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <span>Read each question carefully before answering</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <span>Manage your time wisely across all questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <span>You can retake assessments to improve your score</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
              <span>Your highest score will be recorded</span>
            </li>
          </ul>

          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Your Performance</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tests Completed</span>
                <span className="font-bold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Average Score</span>
                <span className="font-bold text-indigo-600">8.7/10</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Best Score</span>
                <span className="font-bold text-indigo-600">9/10</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Completion Rate</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '50%' }} />
              </div>
              <span className="text-sm font-bold text-gray-900">50%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">3 of 6 assessments completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}