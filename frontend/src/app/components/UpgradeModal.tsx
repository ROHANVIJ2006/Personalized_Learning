// UpgradeModal - kept for backwards compatibility
export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Pro</h2>
        <p className="text-gray-500 mb-6">Unlock unlimited AI coaching, advanced assessments, and career mentorship.</p>
        <div className="space-y-3 mb-6">
          {['Unlimited AI-powered recommendations','Advanced MT-KT mastery tracking','1-on-1 career mentorship','Priority course access'].map(f => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-gray-700">{f}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors mb-3">
          Upgrade Now — ₹999/mo
        </button>
        <button onClick={onClose} className="w-full py-2 text-gray-400 text-sm hover:text-gray-600">
          Maybe later
        </button>
      </div>
    </div>
  );
}
