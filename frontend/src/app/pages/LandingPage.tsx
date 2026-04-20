import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  CheckCircle, 
  TrendingUp, 
  Target, 
  GraduationCap,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  BookOpen,
  Star,
  Globe,
  Zap,
  Shield,
  MessageCircle,
  ChevronDown,
  Code,
  Cloud,
  Database,
  Brain
} from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';

const features = [
  {
    icon: Target,
    title: 'Skill Assessment',
    description: 'Take comprehensive tests to identify your current skill level and knowledge gaps'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Get personalized recommendations based on your performance and career goals'
  },
  {
    icon: GraduationCap,
    title: 'Personalized Learning',
    description: 'Access curated courses from top platforms aligned with your learning path'
  }
];

const courses = [
  {
    category: 'Artificial Intelligence',
    icon: Brain,
    color: 'from-indigo-500 to-purple-600',
    topics: ['Machine Learning', 'NLP', 'Computer Vision', 'Deep Learning']
  },
  {
    category: 'Web Development',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    topics: ['React', 'Node.js', 'Full Stack', 'TypeScript']
  },
  {
    category: 'Cloud Computing',
    icon: Cloud,
    color: 'from-indigo-500 to-blue-600',
    topics: ['AWS', 'Azure', 'Docker', 'Kubernetes']
  },
  {
    category: 'Data Science',
    icon: Database,
    color: 'from-purple-500 to-indigo-600',
    topics: ['Python', 'SQL', 'Analytics', 'Visualization']
  }
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Data Scientist at TCS',
    image: 'PS',
    quote: 'From non-tech to Data Scientist in 6 months. The AI recommendations saved me countless hours of random searching.',
    rating: 5
  },
  {
    name: 'Rahul Kumar',
    role: 'Full Stack Developer',
    image: 'RK',
    quote: 'Finally, a platform that understands my learning style. The personalized path was exactly what I needed.',
    rating: 5
  },
  {
    name: 'Anita Desai',
    role: 'ML Engineer at Infosys',
    image: 'AD',
    quote: 'The government-certified courses combined with AI guidance gave me the perfect blend of credentials and skills.',
    rating: 5
  }
];

const faqs = [
  {
    question: 'Is the platform really free?',
    answer: 'Yes! We aggregate high-quality free content from NPTEL, Infosys Springboard, Swayam, and other trusted sources. Premium features are available for advanced AI coaching.'
  },
  {
    question: 'Do I get a certificate?',
    answer: 'Absolutely. You earn verified certificates from our government and industry partners including NPTEL, AICTE, and leading tech companies.'
  },
  {
    question: 'How does the AI assessment work?',
    answer: 'Our adaptive quizzes analyze your strengths and weaknesses to build a custom roadmap just for you. The AI continuously learns from your progress to refine recommendations.'
  },
  {
    question: 'Can I track my progress?',
    answer: 'Yes! Our comprehensive dashboard shows your skill levels, learning hours, streaks, and achievements. You can monitor your growth in real-time.'
  }
];

const stats = [
  { value: '10,000+', label: 'Active Learners' },
  { value: '500+', label: 'Industry Courses' },
  { value: '50,000+', label: 'Badges Earned' },
  { value: '1M+', label: 'Learning Hours' }
];

// Interactive Card Component with Tilt Effect
function InteractiveCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    // Track interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHoveringInteractive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHoveringInteractive(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Custom Animated Cursor - Soft Scattered Glow Effect */}
      
      {/* Cursor Glow Effect - Inner (Soft Pink/Purple) */}
      <motion.div
        className="fixed pointer-events-none z-[10000]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-32 h-32 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(232, 121, 249, 0.12) 0%, rgba(196, 181, 253, 0.08) 40%, transparent 70%)',
          }}
          animate={{
            scale: isHoveringInteractive ? 1.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Cursor Glow Effect - Middle (Scattered) */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-48 h-48 rounded-full blur-[60px]"
          style={{
            background: 'radial-gradient(circle, rgba(196, 181, 253, 0.10) 0%, rgba(232, 121, 249, 0.06) 50%, transparent 70%)',
          }}
          animate={{
            scale: isHoveringInteractive ? 1.8 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Cursor Glow Effect - Outer (Very Soft Scatter) */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-64 h-64 rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(219, 168, 255, 0.08) 0%, rgba(232, 121, 249, 0.05) 50%, transparent 70%)',
          }}
          animate={{
            scale: isHoveringInteractive ? 2 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Extra Outer Scatter Effect */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      >
        <motion.div
          className="w-80 h-80 rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(196, 181, 253, 0.06) 0%, rgba(232, 121, 249, 0.04) 50%, transparent 70%)',
          }}
          animate={{
            scale: isHoveringInteractive ? 2.2 : 1,
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden" 
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="text-white relative z-10" size={20} />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillNova
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </button>
              <button onClick={() => scrollToSection('courses')} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group">
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative group">
                Testimonials
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors relative z-10"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-2xl shadow-md relative overflow-hidden group"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                >
                  <span className="relative z-10">Sign Up</span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-8 border border-indigo-200 shadow-sm relative overflow-hidden group"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="text-indigo-600 relative z-10" size={16} />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent relative z-10">
                  AI-Powered Learning Platform
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Master In-Demand Skills.<br />
                <motion.span 
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% auto',
                  }}
                >
                  Transform Your Future.
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Bridge critical skill gaps with AI-powered assessments and personalized learning paths. 
                Access government-certified courses and industry-recognized certifications to accelerate your professional growth.
              </motion.p>
              
              <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <Link
                    to="/register"
                    className="px-8 py-4 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-xl relative overflow-hidden z-10"
                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <ArrowRight size={20} className="relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-xl opacity-50"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
                <motion.button
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl transition-all hover:bg-indigo-50 relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">View Platform</span>
                  <motion.div
                    className="absolute inset-0 bg-indigo-50"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>

              <motion.div 
                className="flex items-center justify-center gap-6 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="text-green-600" size={16} />
                  <span>Free 14-day trial</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="text-green-600" size={16} />
                  <span>No credit card required</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center cursor-pointer"
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm font-medium text-indigo-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-6 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Democratizing Education with AI
              </h2>
              <p className="text-xl text-gray-600">
                We believe personalized learning is the key to unlocking human potential
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', description: 'To provide accessible, high-quality, and personalized education to every learner, regardless of their background or location.' },
              { icon: Sparkles, title: 'The AI Advantage', description: 'No more one-size-fits-all. Our AI adapts to your pace, identifies gaps, and creates a learning journey unique to you.' },
              { icon: Globe, title: 'Global Standards', description: 'Aligned with UN SDG-4 (Quality Education) to ensure inclusive, equitable learning opportunities for all.' }
            ].map((item, index) => (
              <InteractiveCard
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="text-white relative z-10" size={28} />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Three simple steps to accelerate your learning journey</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <InteractiveCard
                key={index}
                className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl p-8 border border-indigo-100 hover:shadow-2xl transition-all relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <motion.div 
                    className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {index + 1}
                  </motion.div>
                  <motion.div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <feature.icon className="text-white relative z-10" size={28} />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Top-Rated Learning Paths</h2>
              <p className="text-xl text-gray-600">Master in-demand skills with courses from industry leaders</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <InteractiveCard
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group cursor-pointer relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${course.color} shadow-lg relative overflow-hidden`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <course.icon className="text-white relative z-10" size={28} />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{course.category}</h3>
                  <div className="space-y-2">
                    {course.topics.map((topic, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-2 text-sm text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircle className="text-green-600" size={14} />
                        <span>{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <motion.button 
                      className="text-sm font-semibold flex items-center gap-1 transition-all text-indigo-600 group"
                      whileHover={{ gap: 8 }}
                    >
                      Explore Path
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Learners Who Transformed Their Careers</h2>
              <p className="text-xl text-gray-600">Join thousands of successful professionals who started here</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <InteractiveCard
                key={index}
                className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl p-8 border border-indigo-100 hover:shadow-2xl transition-all relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.2, rotate: 20 }}
                      >
                        <Star className="text-amber-500" size={16} fill="#f59e0b" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {testimonial.image}
                    </motion.div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 px-6 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <InteractiveCard className="bg-gradient-to-br from-white to-indigo-50/50 rounded-3xl p-12 shadow-xl border border-indigo-100 relative overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-10">
                  <motion.div 
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Users className="text-white relative z-10" size={32} />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 2 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Learn Together, Grow Faster</h2>
                  <p className="text-xl text-gray-600">Join our thriving community of passionate learners</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: MessageCircle, title: 'Active Community', description: 'Join our Discord with 5,000+ learners sharing knowledge' },
                    { icon: Award, title: 'Peer Reviews', description: 'Get feedback on your projects from experienced developers' },
                    { icon: Zap, title: 'Live Sessions', description: 'Weekly mentorship from industry professionals' }
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.6 }}>
                        <item.icon className="mx-auto mb-4 text-indigo-600" size={32} />
                      </motion.div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </InteractiveCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Everything you need to know about SkillNova</p>
            </motion.div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border border-indigo-100 overflow-hidden hover:shadow-lg transition-all"
                whileHover={{ scale: 1.01 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-indigo-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="flex-shrink-0 text-indigo-600" size={20} />
                  </motion.div>
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: openFaq === index ? 'auto' : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)' }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated decorative elements */}
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
              }}
            />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of learners advancing their careers with SkillNova's AI-powered platform
              </p>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-2xl transition-all shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <motion.div
                    className="absolute inset-0 bg-indigo-50"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
              <p className="mt-4 text-sm text-indigo-200">No credit card required • Free forever plan available</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 relative overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 opacity-95" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(124, 58, 237, 0.3) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(79, 70, 229, 0.3) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(124, 58, 237, 0.3) 0px, transparent 50%)
          `
        }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" 
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Sparkles className="text-white" size={20} />
                </motion.div>
                <span className="text-xl font-bold text-white">
                  SkillNova
                </span>
              </div>
              <p className="text-gray-300 mb-4 max-w-sm">
                Empowering learners worldwide with AI-driven personalized education and government-certified courses.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield size={16} />
                <span>Aligned with UN SDG-4 (Quality Education)</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <button onClick={() => scrollToSection('features')} className="hover:text-indigo-400 transition-colors">Features</button>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <button onClick={() => scrollToSection('courses')} className="hover:text-indigo-400 transition-colors">Courses</button>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <button onClick={() => scrollToSection('about')} className="hover:text-indigo-400 transition-colors">About Us</button>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
                </motion.li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <a href="#help" className="hover:text-indigo-400 transition-colors">Help Center</a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <a href="#terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: '#a5b4fc' }}>
                  <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact Us</a>
                </motion.li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2026 SkillNova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}