import { Outlet, Navigate } from 'react-router';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatBot } from './ChatBot';
import { useAuth } from '../../contexts/AuthContext';

export function RootLayout() {
  const { user, loading } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <ChatBot
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
