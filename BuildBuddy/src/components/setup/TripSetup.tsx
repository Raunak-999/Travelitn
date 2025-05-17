import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palmtree, Mountain, Building2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import BackButton from '../common/BackButton';
import Calendar from '../common/Calendar';

interface TripData {
  destination: string;
  tripType: 'beaches' | 'mountains' | 'cities';
  numberOfDays: number;
  startDate: string;
}

// Background animation variants
const backgroundVariants = {
  beaches: {
    backgroundColor: ['rgba(56, 189, 248, 0.1)', 'rgba(20, 184, 166, 0.1)'],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  },
  mountains: {
    backgroundColor: ['rgba(99, 102, 241, 0.1)', 'rgba(147, 51, 234, 0.1)'],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  },
  cities: {
    backgroundColor: ['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)'],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  }
};

// Floating elements animation variants
const floatingVariants = {
  beaches: {
    elements: [
      { emoji: '🏖️', size: '4xl', delay: 0, position: 'left' },
      { emoji: '🌊', size: '3xl', delay: 0.3, position: 'right' },
      { emoji: '🌴', size: '4xl', delay: 0.6, position: 'left' },
      { emoji: '🏄‍♂️', size: '3xl', delay: 0.9, position: 'right' },
      { emoji: '🏖️', size: '3xl', delay: 1.2, position: 'left' },
      { emoji: '🌊', size: '4xl', delay: 1.5, position: 'right' },
      { emoji: '🌴', size: '3xl', delay: 1.8, position: 'left' },
      { emoji: '🏄‍♂️', size: '4xl', delay: 2.1, position: 'right' }
    ]
  },
  mountains: {
    elements: [
      { emoji: '🏔️', size: '4xl', delay: 0, position: 'left' },
      { emoji: '⛰️', size: '3xl', delay: 0.3, position: 'right' },
      { emoji: '🏕️', size: '4xl', delay: 0.6, position: 'left' },
      { emoji: '🌲', size: '3xl', delay: 0.9, position: 'right' },
      { emoji: '🏔️', size: '3xl', delay: 1.2, position: 'left' },
      { emoji: '⛰️', size: '4xl', delay: 1.5, position: 'right' },
      { emoji: '🏕️', size: '3xl', delay: 1.8, position: 'left' },
      { emoji: '🌲', size: '4xl', delay: 2.1, position: 'right' }
    ]
  },
  cities: {
    elements: [
      { emoji: '🏙️', size: '4xl', delay: 0, position: 'left' },
      { emoji: '🌆', size: '3xl', delay: 0.3, position: 'right' },
      { emoji: '🚇', size: '4xl', delay: 0.6, position: 'left' },
      { emoji: '🌃', size: '3xl', delay: 0.9, position: 'right' },
      { emoji: '🏙️', size: '3xl', delay: 1.2, position: 'left' },
      { emoji: '🌆', size: '4xl', delay: 1.5, position: 'right' },
      { emoji: '🚇', size: '3xl', delay: 1.8, position: 'left' },
      { emoji: '🌃', size: '4xl', delay: 2.1, position: 'right' }
    ]
  }
};

export default function TripSetup() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [tripData, setTripData] = useState<TripData>({
    destination: '',
    tripType: 'beaches',
    numberOfDays: 3,
    startDate: new Date().toISOString().split('T')[0]
  });

  const tripTypes = [
    { id: 'beaches', icon: Palmtree, label: 'Beach Vibes', emoji: '🏖️' },
    { id: 'mountains', icon: Mountain, label: 'Mountain Trek', emoji: '🏔️' },
    { id: 'cities', icon: Building2, label: 'City Life', emoji: '🏙️' }
  ];

  const handleTripTypeSelect = (type: 'beaches' | 'mountains' | 'cities') => {
    setTripData(prev => ({ ...prev, tripType: type }));
    setTheme(type);
  };

  const handleDaysChange = (increment: boolean) => {
    setTripData(prev => ({
      ...prev,
      numberOfDays: Math.min(Math.max(prev.numberOfDays + (increment ? 1 : -1), 1), 10)
    }));
  };

  const handleSubmit = () => {
    // Save trip data to localStorage
    localStorage.setItem('tripData', JSON.stringify(tripData));
    // Navigate to planner
    navigate('/planner');
  };

  const getGradient = () => {
    switch(tripData.tripType) {
      case 'beaches':
        return 'from-sky-400 to-teal-500';
      case 'mountains':
        return 'from-indigo-500 to-purple-600';
      case 'cities':
        return 'from-violet-500 to-fuchsia-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button - Added at the top left */}
      <div className="fixed top-4 left-4 z-50">
        <BackButton to="/" />
      </div>

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={backgroundVariants[tripData.tripType]}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {floatingVariants[tripData.tripType].elements.map((element, index) => (
            <motion.div
              key={`${tripData.tripType}-${index}`}
              className={`absolute text-${element.size} opacity-40`}
              initial={{ 
                x: element.position === 'left' ? -100 : window.innerWidth + 100,
                y: 100 + (index * 100),
                scale: 0,
                rotate: 0
              }}
              animate={{ 
                x: element.position === 'left' ? 50 : window.innerWidth - 150,
                y: [100 + (index * 100), 70 + (index * 100), 100 + (index * 100)],
                rotate: element.position === 'left' ? [-10, 10, -10] : [10, -10, 10],
                scale: 1,
              }}
              exit={{ 
                x: element.position === 'left' ? -100 : window.innerWidth + 100,
                scale: 0,
                opacity: 0 
              }}
              transition={{
                x: { duration: 0.5 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: element.delay
                },
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: element.delay
                },
                scale: { duration: 0.5 }
              }}
            >
              {element.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full mx-auto relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Let's Plan Your Adventure
          </motion.h1>

          <div className="space-y-8">
            {/* Destination Input */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Where to?</label>
              <input
                type="text"
                value={tripData.destination}
                onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="Enter destination"
                className="w-full bg-black/30 text-white p-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
              />
            </div>

            {/* Trip Type Selection */}
            <div>
              <label className="text-sm text-gray-300 mb-3 block">What's your vibe?</label>
              <div className="grid grid-cols-3 gap-4">
                {tripTypes.map(({ id, icon: Icon, label, emoji }) => (
                  <motion.button
                    key={id}
                    onClick={() => handleTripTypeSelect(id as 'beaches' | 'mountains' | 'cities')}
                    className={`relative p-4 rounded-xl border transition-all ${
                      tripData.tripType === id
                        ? 'bg-gradient-to-br from-violet-600/30 to-purple-700/30 border-violet-400'
                        : 'bg-black/30 border-gray-700 hover:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="w-6 h-6" />
                      <span className="text-sm">{label}</span>
                      <span className="text-xl">{emoji}</span>
                    </div>
                    {tripData.tripType === id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 rounded-xl border-2 border-violet-400"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Number of Days */}
            <div>
              <label className="text-sm text-gray-300 mb-3 block">How many days?</label>
              <div className="flex items-center gap-4 justify-center">
                <motion.button
                  onClick={() => handleDaysChange(false)}
                  disabled={tripData.numberOfDays <= 1}
                  className="p-2 rounded-lg bg-black/30 border border-gray-700 disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <motion.div
                  key={tripData.numberOfDays}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 text-center text-3xl font-bold"
                >
                  {tripData.numberOfDays}
                </motion.div>
                <motion.button
                  onClick={() => handleDaysChange(true)}
                  disabled={tripData.numberOfDays >= 10}
                  className="p-2 rounded-lg bg-black/30 border border-gray-700 disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm text-gray-300 mb-1 block">When do you start?</label>
              <Calendar
                selectedDate={tripData.startDate}
                onChange={(date) => setTripData(prev => ({ ...prev, startDate: date }))}
                minDate={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={!tripData.destination}
              className={`w-full mt-8 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${getGradient()}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's Go <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 