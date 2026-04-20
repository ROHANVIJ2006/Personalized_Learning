import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

interface PageHeroProps {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  stats?: StatItem[];
}

export function PageHero({ icon: Icon, category, title, description, stats }: PageHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-xl p-6 text-white relative overflow-hidden mb-5 shadow-lg"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={20} className="text-indigo-200" />
              <span className="text-sm font-semibold text-indigo-200">{category}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-indigo-100 text-base">{description}</p>
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex gap-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border border-white/20 shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <StatIcon size={16} className="text-white" />
                      <span className="text-xs text-indigo-100">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
