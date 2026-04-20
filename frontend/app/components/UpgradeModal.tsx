import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Crown, Sparkles, Zap, TrendingUp, Users, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  { icon: Sparkles, text: 'Unlimited AI coaching & personalized guidance' },
  { icon: TrendingUp, text: 'Advanced analytics & progress insights' },
  { icon: Users, text: 'Priority support & mentorship' },
  { icon: Zap, text: 'Access to all premium courses & certifications' },
  { icon: Shield, text: 'Exclusive learning paths & career roadmaps' },
];

const plans = [
  {
    name: 'Monthly',
    price: '$19',
    period: '/month',
    description: 'Perfect for getting started',
    popular: false
  },
  {
    name: 'Annual',
    price: '$149',
    period: '/year',
    description: 'Save 35% with annual billing',
    popular: true,
    badge: 'Most Popular'
  }
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4 shadow-lg">
                  <Crown size={32} className="text-indigo-900" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Upgrade to SkillNova Pro</h2>
                <p className="text-indigo-100 text-lg">Accelerate your learning journey with premium features</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Features Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Everything in Pro</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100"
                      >
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1.5">{feature.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Your Plan</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {plans.map((plan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        plan.popular
                          ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {plan.badge}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600 ml-1">{plan.period}</span>
                        </div>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>

                      <button
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          plan.popular
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Get Started
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Free Features Comparison */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Compare with Free Plan</h4>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700"><span className="font-semibold">Pro:</span> Unlimited courses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700"><span className="font-semibold">Pro:</span> AI coaching 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <X size={14} className="text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-500"><span className="font-medium">Free:</span> 5 courses/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <X size={14} className="text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-500"><span className="font-medium">Free:</span> Basic support</span>
                  </div>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">30-day money-back guarantee.</span> Try Pro risk-free.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
