import { motion } from 'motion/react';
import { Mail, ArrowLeft, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset email
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#4f46e5' }}>
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillNova</span>
          </Link>
          <div className="text-sm text-gray-600">
            Remember your password? <Link to="/login" className="font-semibold" style={{ color: '#4f46e5' }}>Sign in</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {!isSubmitted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Back Button */}
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to login</span>
              </Link>

              {/* Header */}
              <div className="mb-8">
                <div 
                  className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
                  style={{ background: '#4f46e5' }}
                >
                  <Mail className="text-white" size={28} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h1>
                <p className="text-gray-600">No worries, we'll send you reset instructions</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                  style={{ background: '#4f46e5' }}
                >
                  Reset password
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Success State */}
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: '#10b981' }}
                >
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Check your email</h1>
                <p className="text-gray-600 mb-6">
                  We've sent password reset instructions to <span className="font-semibold text-gray-900">{email}</span>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Didn't receive the email?</span>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Check your spam folder</li>
                    <li>• Verify the email address is correct</li>
                    <li>• Wait a few minutes and try again</li>
                  </ul>
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all mb-3"
                  style={{ background: '#4f46e5' }}
                >
                  Resend email
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield size={14} />
              <span>Password reset links expire after 24 hours</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
