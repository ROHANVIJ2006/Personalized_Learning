import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, User, Bell, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';

export function Settings() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name||'', location: user?.location||'', career_goal: user?.career_goal||'' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateMe(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="px-8 py-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <SettingsIcon size={20} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-indigo-600" />
            <h2 className="font-bold text-gray-900">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input value={user?.email||''} disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm(p=>({...p,location:e.target.value}))}
                placeholder="e.g. Mumbai, India"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Career Goal</label>
              <select value={form.career_goal} onChange={e => setForm(p=>({...p,career_goal:e.target.value}))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                {['AI Engineer','Full Stack Developer','Data Scientist','Cloud Architect','Mobile Developer','DevOps Engineer'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <button onClick={save} disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2">
              {saved ? <><CheckCircle size={16}/> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-indigo-600" />
            <h2 className="font-bold text-gray-900">Account</h2>
          </div>
          <button onClick={logout}
            className="px-6 py-2.5 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
