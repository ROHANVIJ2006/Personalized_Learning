import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  ClipboardList, 
  TrendingUp, 
  GraduationCap, 
  Map, 
  Building2, 
  User, 
  Settings,
  Sparkles,
  Crown,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ClipboardList, label: 'Skill Assessment', path: '/dashboard/assessment' },
  { icon: TrendingUp, label: 'Skill Progress', path: '/dashboard/progress' },
  { icon: GraduationCap, label: 'Courses', path: '/dashboard/recommendations' },
  { icon: Map, label: 'Learning Path', path: '/dashboard/learning-path' },
  { icon: Building2, label: 'Govt Programs', path: '/dashboard/govt-courses' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onUpgrade: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onUpgrade }: SidebarProps) {
  const location = useLocation();
  
  return (
    <div 
      className={`fixed left-0 top-0 bottom-0 bg-white flex flex-col border-r border-gray-200 transition-all duration-300 z-20 ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {/* Logo */}
      <div 
        className={`flex items-center gap-3 px-6 py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          isCollapsed ? 'justify-center px-4' : ''
        }`}
        onClick={onToggle}
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#4F46E5' }}
        >
          <Sparkles className="text-white" size={20} />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <span className="text-gray-900 text-xl font-bold block leading-tight">SkillNova</span>
            <span className="text-gray-500 text-xs font-medium">Learning Platform</span>
          </div>
        )}
      </div>
      
      {/* Menu */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Pro Upgrade Card */}
        {!isCollapsed && (
          <div className="mt-6 mx-2">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-4 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-yellow-300" size={20} />
                  <span className="text-sm font-bold text-white">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-indigo-100 mb-3">
                  Unlock unlimited courses & AI coaching
                </p>
                <button 
                  onClick={onUpgrade}
                  className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all shadow"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* User Profile & Logout Section */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        {!isCollapsed ? (
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all group"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium text-sm">Log Out</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="flex items-center justify-center p-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
            title="Log Out"
          >
            <LogOut size={20} />
          </Link>
        )}
      </div>
    </div>
  );
}