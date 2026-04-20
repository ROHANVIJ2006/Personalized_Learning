import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, ClipboardList, TrendingUp, GraduationCap,
  Map, Building2, User, Settings, Sparkles, Crown, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      path: '/dashboard' },
  { icon: ClipboardList,   label: 'Skill Assessment', path: '/dashboard/assessment' },
  { icon: TrendingUp,      label: 'Skill Progress', path: '/dashboard/progress' },
  { icon: GraduationCap,   label: 'Courses',        path: '/dashboard/recommendations' },
  { icon: Map,             label: 'Learning Path',  path: '/dashboard/learning-path' },
  { icon: Building2,       label: 'Govt Programs',  path: '/dashboard/govt-courses' },
  { icon: User,            label: 'Profile',        path: '/dashboard/profile' },
  { icon: Settings,        label: 'Settings',       path: '/dashboard/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`relative flex-shrink-0 bg-white flex flex-col border-r border-gray-200 transition-all duration-300 z-20 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 z-30"
      >
        {collapsed ? <ChevronRight size={12} className="text-gray-500" /> : <ChevronLeft size={12} className="text-gray-500" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-white" size={18} />
        </div>
        {!collapsed && (
          <div>
            <span className="text-gray-900 text-lg font-bold block leading-tight">SkillNova</span>
            <span className="text-gray-400 text-xs">AI Learning Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={19} className="flex-shrink-0" />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade card */}
        {!collapsed && (
          <div className="mt-5 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="text-yellow-300" size={16} />
                <span className="text-sm font-bold text-white">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-indigo-200 mb-3">Unlock unlimited courses & AI coaching</p>
              <button className="w-full py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User + Logout */}
      <div className={`px-3 py-4 border-t border-gray-200 space-y-1`}>
        {user && !collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 mb-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 font-bold text-sm">{user.name[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.career_goal}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Log Out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Log Out</span>}
        </button>
      </div>
    </div>
  );
}
