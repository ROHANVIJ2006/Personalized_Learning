import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Bell, Search, Settings, User, LogOut, Award, BookOpen, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ChatBot } from './ChatBot';
import { UpgradeModal } from './UpgradeModal';
import { Link, useNavigate } from 'react-router';

export function RootLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: 'Course Update',
      message: 'New module added to "Machine Learning Basics"',
      time: '5 min ago',
      unread: true,
      icon: BookOpen
    },
    {
      id: 2,
      title: 'Achievement Unlocked',
      message: 'You earned "Python Master" badge!',
      time: '2 hours ago',
      unread: true,
      icon: Award
    },
    {
      id: 3,
      title: 'Skill Assessment',
      message: 'Your React assessment is now available',
      time: '1 day ago',
      unread: false,
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        onUpgrade={() => setIsUpgradeOpen(true)}
      />
      
      {/* Main Content */}
      <div 
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'
        }`}
      >
        {/* Top Header - Modern */}
        <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between px-10 py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ask me anything... (Try: 'Find Python courses' or 'What should I learn?')"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center gap-3 ml-6">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="relative p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                >
                  <Bell size={20} className="text-gray-600 group-hover:text-gray-900" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-[9998]" onClick={() => setShowNotifications(false)} />
                    <div className="absolute top-12 right-0 shadow-2xl rounded-xl w-96 z-[9999] border-2 border-gray-300 overflow-hidden bg-white">
                      <div className="p-4 border-b-2 border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">2</span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto bg-white">
                        {notifications.map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <div 
                              key={notification.id} 
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors bg-white ${
                                notification.unread ? '!bg-indigo-50' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  notification.unread ? 'bg-indigo-600' : 'bg-gray-400'
                                }`}>
                                  <Icon size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-gray-900">{notification.title}</h4>
                                    {notification.unread && (
                                      <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 border-t-2 border-gray-200 bg-white">
                        <button className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700 py-2">
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Settings Icon */}
              <Link 
                to="/dashboard/settings"
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <Settings size={20} className="text-gray-600 group-hover:text-gray-900" />
              </Link>
              
              {/* Profile */}
              <div className="relative">
                <button 
                  className="flex items-center gap-3 pl-3 pr-4 py-2 hover:bg-gray-100 rounded-lg transition-colors" 
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                >
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-sm bg-indigo-600"
                  >
                    R
                  </div>
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-semibold text-gray-900">Rohani</div>
                    <div className="text-xs text-gray-500">Intermediate</div>
                  </div>
                </button>

                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-[9998]" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute top-12 right-0 shadow-2xl rounded-xl w-64 z-[9999] border-2 border-gray-300 overflow-hidden bg-white">
                      <div className="p-4 border-b-2 border-gray-200 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md bg-indigo-600">
                            R
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Rohani</div>
                            <div className="text-xs text-gray-500">rohani@skillnova.com</div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2 bg-white">
                        <Link 
                          to="/dashboard/profile" 
                          className="px-4 py-3 flex items-center justify-between hover:!bg-gray-50 transition-colors group !bg-white"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="flex items-center gap-3">
                            <User size={18} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">My Profile</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </Link>
                        <Link 
                          to="/dashboard/settings" 
                          className="px-4 py-3 flex items-center justify-between hover:!bg-gray-50 transition-colors group !bg-white"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="flex items-center gap-3">
                            <Settings size={18} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Settings</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </Link>
                        <div className="border-t-2 border-gray-200 my-2 bg-white" />
                        <button 
                          className="w-full px-4 py-3 flex items-center gap-3 hover:!bg-red-50 transition-colors group !bg-white"
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/');
                          }}
                        >
                          <LogOut size={18} className="text-gray-500 group-hover:text-red-600" />
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-red-600">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="min-h-[calc(100vh-73px)]">
          <Outlet />
        </main>
      </div>

      {/* Global ChatBot - Floating on Right */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onOpen={() => setIsChatOpen(true)} />

      {/* Upgrade Modal */}
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </div>
  );
}