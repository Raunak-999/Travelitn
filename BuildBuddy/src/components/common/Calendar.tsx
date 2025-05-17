import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export default function Calendar({ selectedDate, onChange, minDate }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const inputRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(selectedDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  useEffect(() => {
    if (isOpen && inputRef.current && calendarRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const calendarHeight = 380; // Approximate height of calendar
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      // If there's not enough space below and more space above, position on top
      if (spaceBelow < calendarHeight && spaceAbove > spaceBelow) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [isOpen]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(date.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    const minDateTime = new Date(minDate).getTime();
    return date.getTime() < minDateTime;
  };

  return (
    <div className="relative">
      <div className="relative" ref={inputRef}>
        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={new Date(selectedDate).toLocaleDateString()}
          onClick={() => setIsOpen(true)}
          readOnly
          className="w-full bg-black/30 text-white p-3 pl-12 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all cursor-pointer"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Calendar Popup */}
            <motion.div
              ref={calendarRef}
              className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 p-4 bg-gray-800/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl z-50 w-[320px]`}
              initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : -5 }}
              transition={{ type: "spring", duration: 0.2 }}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <h3 className="text-lg font-medium">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <motion.button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-sm font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map(i => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}
                {days.map(day => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const isSelected = selectedDate === date.toISOString().split('T')[0];
                  const isDisabled = isDateDisabled(date);

                  return (
                    <motion.button
                      key={day}
                      onClick={() => !isDisabled && handleDateSelect(day)}
                      className={`h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                        ${isSelected ? 'bg-violet-500 text-white' : 'hover:bg-white/10'}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      whileHover={!isDisabled ? { scale: 1.1 } : undefined}
                      whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                    >
                      {day}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 