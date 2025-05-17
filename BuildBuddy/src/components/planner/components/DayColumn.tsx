import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Edit3, Plus } from 'lucide-react';
import ActivityCard from './ActivityCard';
import MoodSelector, { Mood } from './MoodSelector';
import type { Activity, DayColumnProps } from '@/components/planner/types';

const DayColumn: React.FC<DayColumnProps> = ({ 
  day, 
  getGradient, 
  getPrimaryColor, 
  updateDayTitle, 
  addActivity,
  onEditActivity,
  onDeleteActivity,
  onMoodSelect
}) => {
  return (
    <Droppable droppableId={day.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-shrink-0 w-[320px] min-h-[65vh] rounded-xl snap-start
            ${snapshot.isDraggingOver 
              ? 'bg-gray-700/50 backdrop-blur-xl ring-2 ring-white/20 shadow-lg scale-[1.02] border-white/30' 
              : 'bg-gray-800/30 backdrop-blur-lg'
            }
            border border-white/10 shadow-lg overflow-hidden flex flex-col
            hover:shadow-xl transition-all duration-300`}
        >
          {/* Day Header */}
          <div className={`p-4 border-b border-white/10 bg-gradient-to-r 
            ${day.mood ? day.mood.gradient : getGradient()} bg-opacity-40`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <input
                  className="text-xl font-bold bg-transparent border-none outline-none w-full font-space-grotesk truncate mr-2"
                  value={day.title}
                  onChange={(e) => updateDayTitle(day.id, e.target.value)}
                  placeholder="Day Title"
                />
                {day.mood && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-white/70 mt-0.5"
                  >
                    {day.mood.label}
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MoodSelector
                  selectedMood={day.mood}
                  onSelect={(mood) => onMoodSelect?.(day.id, mood)}
                />
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/70 hover:text-white transition-colors p-1.5 bg-white/5 rounded-full"
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[calc(65vh-60px)] custom-scrollbar">
            {day.activities.map((activity: Activity, index: number) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                getPrimaryColor={getPrimaryColor}
                onEdit={onEditActivity ? (activity) => onEditActivity(day.id, activity) : undefined}
                onDelete={onDeleteActivity ? (activityId) => onDeleteActivity(day.id, activityId) : undefined}
              />
            ))}
            {provided.placeholder}

            {/* Add Activity Button */}
            <button
              className="w-full p-3 mt-1 rounded-lg border border-dashed border-white/30 text-white/70 
                flex items-center justify-center gap-2.5 hover:bg-white/10 transition-all
                hover:border-white/50 hover:text-white"
              onClick={() => addActivity(day.id)}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Activity</span>
            </button>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DayColumn;