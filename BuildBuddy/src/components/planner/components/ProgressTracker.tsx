import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { Day } from '@/components/planner/types';

interface ProgressTrackerProps {
  days: Day[];
  getGradient: () => string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ days, getGradient }) => {
  const totalDays = days.length;
  const plannedDays = days.filter(day => day.activities.length > 0).length;
  const percentage = Math.round((plannedDays / totalDays) * 100) || 0;

  const getStatusIcon = () => {
    if (percentage === 100) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (percentage >= 50) return <Clock className="w-5 h-5 text-amber-400" />;
    return <AlertCircle className="w-5 h-5 text-pink-400" />;
  };

  const getMessage = () => {
    if (percentage === 100) return "Perfect! All days are planned. 🎉";
    if (percentage >= 50) return "You're making great progress! 🌟";
    if (percentage > 0) return "Let's add more adventures! 🎯";
    return "Start planning your journey! ✈️";
  };

  return (
    <div className="sticky top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-white/10 py-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-3">
          {/* Progress Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">
                {plannedDays} of {totalDays} Days Planned
              </span>
            </div>
            <span className="text-sm font-medium text-white/90">
              {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getGradient()}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Motivational Message */}
          <motion.p
            className="text-sm text-white/70 text-center font-medium"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {getMessage()}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 