import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import BackButton from '../../common/BackButton';

interface TripData {
  destination: string;
  tripType: 'beaches' | 'mountains' | 'cities';
  numberOfDays: number;
  startDate: string;
}

interface PlannerHeaderProps {
  tripData: TripData | null;
  getGradient: () => string;
  onShare: () => void;
}

export default function PlannerHeader({ tripData, getGradient, onShare }: PlannerHeaderProps) {
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Title and Navigation Group */}
          <div className="flex items-center gap-4">
            <BackButton to="/setup" />
            <div className="flex items-center gap-3">
              <motion.div
                className="relative group"
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <span role="img" aria-label="travel" className="text-2xl md:text-3xl">
                  {tripData?.tripType === 'beaches' ? '🏖️' : 
                   tripData?.tripType === 'mountains' ? '🏔️' : '🏙️'}
                </span>
                <div className="absolute inset-0 bg-white/10 rounded-full filter blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-space-grotesk tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                    {tripData ? tripData.destination : 'Itinerary Planner'}
                  </span>
                </h1>
                <p className="text-sm text-white/70">
                  {tripData ? `${tripData.numberOfDays} days starting ${new Date(tripData.startDate).toLocaleDateString()}` : 'Plan your perfect days'}
                </p>
              </div>
            </div>
          </div>

          {/* Share Plan Button - Visible on MD and above */}
          <motion.button
            className={`hidden md:flex h-9 bg-gradient-to-r ${getGradient()} px-4 rounded-full items-center gap-2 text-white font-medium shadow-md hover:shadow-lg transition-all`}
            onClick={onShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
            <span>Share Plan</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
} 