import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, User, Bell, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

export function Settings() {
  const { user, logout, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    career_goal: user?.career_goal || 'AI Engineer',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.name.trim()) { setError('Name cannot be empty.'); return; }
    setSaving(true);
    setError('');
    try {
      await api.updateMe(form);
      // Instantly update the sidebar and header without needing a page refresh
      updateUser(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-8 py-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <SettingsIcon size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">Manage your profile and account preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-indigo-600" />
            <h2 className="font-bold text-gray-900">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Mumbai, India"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Career Goal</label>
              <select
                value={form.career_goal}
                onChange={e => setForm(p => ({ ...p, career_goal: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {[
                  'AI Engineer',
                  'Full Stack Developer',
                  'Data Scientist',
                  'Cloud Architect',
                  'Mobile Developer',
                  'DevOps Engineer',
                  'Cybersecurity Analyst',
                  'Blockchain Developer',
                ].map(g => <option key={g}>{g}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">This updates your AI recommendations and learning path</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {saved
                ? <><CheckCircle size={16} /> Saved!</>
                : saving
                  ? 'Saving...'
                  : 'Save Changes'}
            </button>
          </div>
        </motion.div>

        {/* Notifications (UI Only) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-indigo-600" />
            <h2 className="font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Weekly Progress Report', desc: 'Get a summary of your learning every Monday', default: true },
              { label: 'New Course Alerts', desc: 'Be notified when new courses matching your skills are added', default: true },
              { label: 'Assessment Reminders', desc: 'Reminders to take skill assessments', default: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-indigo-600" />
            <h2 className="font-bold text-gray-900">Account</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Account Status</p>
              <p className="text-xs text-green-600 font-medium">Active — Free Plan</p>
            </div>
            <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">Active</span>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2.5 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
