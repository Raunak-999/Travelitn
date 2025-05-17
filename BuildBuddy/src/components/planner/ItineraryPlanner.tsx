import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, HTMLMotionProps } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../context/ThemeContext';
import { 
  Plus, X, Share2, Filter, Save, Download, MapPin, Coffee, 
  Utensils, Map, Plane, Bed, Camera, Sun, Sunrise, Sunset,
  Star, Tag, Clock, Calendar, Edit3, MoreHorizontal, Trash2,
  ChevronDown, Check, LayoutGrid, GanttChart, Cloud
} from 'lucide-react';
import toast, { Toast } from 'react-hot-toast';
import DayColumn from './components/DayColumn';
import TimelineView from './components/TimelineView';
import ProgressTracker from './components/ProgressTracker';
import type { Day, Activity, ChecklistItem } from './types';
import { mockWeather } from './utils/mockData';
import type { Mood } from './components/MoodSelector';
import BackButton from '../common/BackButton';
import PlannerHeader from './components/PlannerHeader';
import PlannerModals from './components/PlannerModals';

interface TripData {
  destination: string;
  tripType: 'beaches' | 'mountains' | 'cities';
  numberOfDays: number;
  startDate: string;
}

const createChecklistItem = (text: string): ChecklistItem => ({
  id: `checklist-${Math.random().toString(36).substr(2, 9)}`,
  text,
  completed: false
});

const ItineraryPlanner = () => {
  const { currentTheme, themeColors } = useTheme();
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [tripData, setTripData] = useState<TripData | null>(() => {
    const tripDataStr = localStorage.getItem('tripData');
    if (tripDataStr) {
      return JSON.parse(tripDataStr);
    }
    // Mock trip data if none exists
    return {
      destination: "Bali Adventure",
      tripType: "beaches",
      numberOfDays: 4,
      startDate: new Date().toISOString().split('T')[0]
    };
  });
  const [days, setDays] = useState<Day[]>(() => {
    const tripDataStr = localStorage.getItem('tripData');
    if (tripDataStr) {
      const tripData: TripData = JSON.parse(tripDataStr);
      return Array.from({ length: tripData.numberOfDays }, (_, i) => ({
        id: `day-${i + 1}`,
        title: `Day ${i + 1}`,
        activities: i === 0 ? [
        {
          id: 'activity-1',
            title: 'Airport Arrival & Check-in',
            timeStart: '10:00',
            timeEnd: '12:00',
            location: 'Ngurah Rai International Airport',
            notes: 'Collect luggage and transfer to hotel',
            tags: ['travel', 'booked'],
            type: 'travel',
            checklist: [
              createChecklistItem('Passport'),
              createChecklistItem('Hotel Booking'),
              createChecklistItem('Transfer Confirmation')
            ]
        },
        {
          id: 'activity-2',
            title: 'Beach Club Relaxation',
            timeStart: '14:00',
            timeEnd: '18:00',
            location: 'Potato Head Beach Club',
            notes: 'Beachfront relaxation and sunset views',
            tags: ['must-do'],
          type: 'activity',
            checklist: [
              createChecklistItem('Swimwear'),
              createChecklistItem('Sunscreen')
            ]
        }
        ] : i === 1 ? [
          {
            id: 'activity-3',
            title: 'Ubud Temple Tour',
            timeStart: '09:00',
            timeEnd: '15:00',
            location: 'Ubud Sacred Temples',
            notes: 'Visit multiple temples with local guide',
            tags: ['explore', 'booked'],
            type: 'explore',
            checklist: [
              createChecklistItem('Camera'),
              createChecklistItem('Comfortable Shoes')
      ]
    },
    {
            id: 'activity-4',
            title: 'Traditional Dinner Show',
            timeStart: '19:00',
            timeEnd: '21:00',
            location: 'Royal Palace',
            notes: 'Traditional Balinese dance performance',
            tags: ['food', 'must-do'],
            type: 'food',
            checklist: []
          }
        ] : i === 2 ? [
          {
            id: 'activity-5',
            title: 'Surfing Lesson',
            timeStart: '08:00',
            timeEnd: '11:00',
            location: 'Kuta Beach',
            notes: 'Beginner-friendly surf instruction',
            tags: ['activity', 'booked'],
            type: 'activity',
            checklist: [
              createChecklistItem('Swimwear'),
              createChecklistItem('Sunscreen'),
              createChecklistItem('Change of clothes')
            ]
          }
        ] : []
      }));
    }
    // Default mock data if no trip data exists
    return [
      {
        id: 'day-1',
        title: 'Day 1',
      activities: [
        {
            id: 'activity-1',
            title: 'Airport Arrival & Check-in',
            timeStart: '10:00',
          timeEnd: '12:00',
            location: 'Ngurah Rai International Airport',
            notes: 'Collect luggage and transfer to hotel',
          tags: ['travel', 'booked'],
          type: 'travel',
            checklist: [
              createChecklistItem('Passport'),
              createChecklistItem('Hotel Booking'),
              createChecklistItem('Transfer Confirmation')
            ]
        }
      ]
      },
      {
        id: 'day-2',
        title: 'Day 2',
        activities: [
          {
            id: 'activity-2',
            title: 'Beach Club Relaxation',
            timeStart: '14:00',
            timeEnd: '18:00',
            location: 'Potato Head Beach Club',
            notes: 'Beachfront relaxation and sunset views',
            tags: ['must-do'],
            type: 'activity',
            checklist: [
              createChecklistItem('Swimwear'),
              createChecklistItem('Sunscreen')
            ]
          }
        ]
      },
      {
        id: 'day-3',
        title: 'Day 3',
        activities: []
      }
    ];
  });
  
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [targetDayId, setTargetDayId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [lastDeletedActivity, setLastDeletedActivity] = useState<{dayId: string; activity: Activity} | null>(null);
  
  // Filter activities based on selected tags
  const getFilteredActivities = (activities: Activity[]) => {
    if (selectedTags.length === 0) return activities;
    return activities.filter(activity => 
      selectedTags.some(tag => 
        activity.tags.includes(tag) || activity.type === tag
      )
    );
  };
  
  // Add weather info helper function
  const getWeatherInfo = (location: string | undefined) => {
    if (!location) return null;
    return mockWeather[location];
  };
  
  // Get theme colors
  const getPrimaryColor = () => {
    switch(currentTheme) {
      case 'mountains':
        return 'indigo';
      case 'beaches':
        return 'sky';
      case 'cities':
        return 'violet';
      default:
        return 'indigo';
    }
  };
  
  const getGradient = () => {
    switch(currentTheme) {
      case 'mountains':
        return 'from-indigo-500 to-purple-600';
      case 'beaches':
        return 'from-sky-400 to-teal-500';
      case 'cities':
        return 'from-violet-500 to-fuchsia-500';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };
  
  const getTagColor = (tag: string) => {
    switch(tag) {
      case 'food':
        return 'bg-amber-100 text-amber-800';
      case 'travel':
        return 'bg-sky-100 text-sky-800';
      case 'explore':
        return 'bg-emerald-100 text-emerald-800';
      case 'accommodation':
        return 'bg-indigo-100 text-indigo-800';
      case 'activity':
        return 'bg-rose-100 text-rose-800';
      case 'must-do':
        return 'bg-red-100 text-red-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'food':
        return <Utensils className="w-4 h-4" />;
      case 'travel':
        return <Plane className="w-4 h-4" />;
      case 'explore':
        return <Map className="w-4 h-4" />;
      case 'accommodation':
        return <Bed className="w-4 h-4" />;
      case 'activity':
        return <Sun className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Fixed drag and drop handling
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If no destination or dropped in same place, return early
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Find source and destination day
    const sourceDay = days.find(day => day.id === source.droppableId);
    const destDay = days.find(day => day.id === destination.droppableId);
    
    if (!sourceDay || !destDay) return;
    
    // Create new array of days
    const newDays = [...days];
    const sourceDayIndex = days.findIndex(day => day.id === source.droppableId);
    const destDayIndex = days.findIndex(day => day.id === destination.droppableId);

    // If moving within the same day
    if (source.droppableId === destination.droppableId) {
      const newActivities = Array.from(sourceDay.activities);
      const [movedActivity] = newActivities.splice(source.index, 1);
      newActivities.splice(destination.index, 0, movedActivity);

      newDays[sourceDayIndex] = {
        ...sourceDay,
        activities: newActivities
      };
    } else {
      // Moving between different days
      const sourceActivities = Array.from(sourceDay.activities);
      const destActivities = Array.from(destDay.activities);
      
      const [movedActivity] = sourceActivities.splice(source.index, 1);
      destActivities.splice(destination.index, 0, movedActivity);

      newDays[sourceDayIndex] = {
        ...sourceDay,
        activities: sourceActivities
      };
      
      newDays[destDayIndex] = {
        ...destDay,
        activities: destActivities
      };
    }
    
    setDays(newDays);

    // Show success toast
    toast.success(
      source.droppableId === destination.droppableId
        ? 'Activity reordered'
        : `Activity moved to ${destDay.title}`,
      {
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        duration: 2000,
      }
    );
  };
  
  // Add a new day
  const addDay = () => {
    const newDayId = `day-${days.length + 1}`;
    const newDay: Day = {
      id: newDayId,
      title: `Day ${days.length + 1}`,
      activities: []
    };
    
    setDays([...days, newDay]);
  };
  
  // Edit day title
  const updateDayTitle = (dayId: string, newTitle: string) => {
    const newDays = days.map(day => 
      day.id === dayId ? { ...day, title: newTitle } : day
    );
    setDays(newDays);
  };
  
  // Add a new activity
  const addActivity = (dayId: string) => {
    setTargetDayId(dayId);
    setIsAddingActivity(true);
    setEditingActivity({
      id: `activity-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      timeStart: '',
      timeEnd: '',
      location: '',
      notes: '',
      tags: [],
      type: 'activity',
      checklist: []
    });
  };
  
  // Save activity
  const saveActivity = () => {
    if (!editingActivity || !targetDayId) return;
    
    const dayIndex = days.findIndex(day => day.id === targetDayId);
    if (dayIndex === -1) return;
    
    const existingActivityIndex = days[dayIndex].activities.findIndex(
      act => act.id === editingActivity.id
    );
    
    const newDays = [...days];
    
    if (existingActivityIndex !== -1) {
      // Update existing activity
      newDays[dayIndex].activities[existingActivityIndex] = editingActivity;
    } else {
      // Add new activity
      newDays[dayIndex].activities.push(editingActivity);
    }
    
    setDays(newDays);
    setEditingActivity(null);
    setIsAddingActivity(false);
    setTargetDayId(null);
  };
  
  // Enhanced delete with undo functionality
  const handleDeleteActivity = (dayId: string, activityId: string) => {
    const dayIndex = days.findIndex(day => day.id === dayId);
    if (dayIndex === -1) return;
    
    const activity = days[dayIndex].activities.find(act => act.id === activityId);
    if (!activity) return;
    
    const newDays = [...days];
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter(
      act => act.id !== activityId
    );
    
    setDays(newDays);
    setLastDeletedActivity({ dayId, activity });

    toast.custom((t: Toast) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl border border-white/10 flex items-center gap-4"
      >
        <span>Activity deleted</span>
        <button
          onClick={() => {
            const dayIndex = days.findIndex(day => day.id === dayId);
            if (dayIndex !== -1) {
              const newDays = [...days];
              newDays[dayIndex].activities.push(activity);
              setDays(newDays);
              setLastDeletedActivity(null);
              toast.dismiss(t.id);
            }
          }}
          className="text-cyan-400 hover:text-cyan-300 font-medium"
        >
          Undo
        </button>
      </motion.div>
    ), { duration: 4000 });
  };
  
  // Edit activity
  const editActivity = (dayId: string, activity: Activity) => {
    const dayIndex = days.findIndex(day => day.id === dayId);
    if (dayIndex === -1) return;

    const activityIndex = days[dayIndex].activities.findIndex(act => act.id === activity.id);
    if (activityIndex === -1) return;

    const newDays = [...days];
    newDays[dayIndex].activities[activityIndex] = activity;
    setDays(newDays);

    // Only open the edit modal if we're not just updating the checklist
    if (!activity.checklist || activity.checklist.length === 0) {
      setTargetDayId(dayId);
      setEditingActivity(activity);
      setIsAddingActivity(true);
    }
  };
  
  // Share itinerary
  const shareItinerary = () => {
    alert('Sharing link copied to clipboard!');
    // In a real app, this would generate a shareable link or prompt a share dialog
  };
  
  // Mock save functionality
  const handleSave = () => {
    toast.success('Plan saved successfully!', {
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });
  };

  // Mock export functionality
  const handleExport = () => {
    const data = JSON.stringify(days, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'itinerary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Itinerary exported!', {
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.1)',
      },
    });
  };

  // Handle mood selection
  const handleMoodSelect = (dayId: string, mood: Mood) => {
    const newDays = days.map(day =>
      day.id === dayId ? { ...day, mood } : day
    );
    setDays(newDays);

    // Save to localStorage
    try {
      localStorage.setItem('itinerary-moods', JSON.stringify(
        newDays.reduce((acc, day) => ({
          ...acc,
          [day.id]: day.mood
        }), {})
      ));
    } catch (error) {
      console.error('Failed to save moods to localStorage:', error);
    }
  };

  // Load saved moods on mount
  useEffect(() => {
    try {
      const savedMoods = localStorage.getItem('itinerary-moods');
      if (savedMoods) {
        const moodData = JSON.parse(savedMoods);
        setDays(days.map(day => ({
          ...day,
          mood: moodData[day.id]
        })));
      }
    } catch (error) {
      console.error('Failed to load moods from localStorage:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      {/* Fixed Header Section with proper spacing */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Main Heading */}
        <PlannerHeader 
          tripData={tripData}
          getGradient={getGradient}
          onShare={shareItinerary}
        />

        {/* Progress Tracker */}
        <ProgressTracker days={days} getGradient={getGradient} />

        {/* Control Bar */}
        <div className="bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="py-3 flex items-center justify-between gap-4">
              {/* Control Buttons Group */}
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </motion.button>

                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsTagManagerOpen(true)}
            >
              <Tag className="w-4 h-4" />
                  <span className="hidden sm:inline">Tags</span>
                </motion.button>

                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
            >
              <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </motion.button>

                <motion.button
                  className="h-9 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 flex items-center gap-2 text-sm font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
            >
              <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </motion.button>
          </div>
          
              {/* Share Button - Mobile Only */}
              <motion.button
                className="md:hidden h-9 bg-gradient-to-r ${getGradient()} px-4 rounded-full flex items-center gap-2 text-white font-medium shadow-md hover:shadow-lg transition-all"
            onClick={shareItinerary}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area with proper spacing */}
      <div className="pt-[200px] pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white/90">Your Itinerary</h2>
          </div>

          {/* Main Content Views */}
          <AnimatePresence mode="wait">
            {viewMode === 'cards' ? (
                  <motion.div
                key="card-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar"
              >
                <DragDropContext onDragEnd={handleDragEnd}>
                  {days.map((day) => (
                    <DayColumn
                      key={day.id}
                      day={day}
                      getGradient={getGradient}
                      getPrimaryColor={getPrimaryColor}
                      updateDayTitle={updateDayTitle}
                      addActivity={addActivity}
                      onEditActivity={editActivity}
                      onDeleteActivity={handleDeleteActivity}
                      onMoodSelect={handleMoodSelect}
                    />
                  ))}
                </DragDropContext>

                {/* Add Day Button */}
                        <motion.button
                  onClick={addDay}
                  className="flex-shrink-0 w-[320px] h-[65vh] rounded-xl border-2 border-dashed border-white/20
                    hover:border-white/40 transition-colors flex items-center justify-center gap-3
                    text-white/60 hover:text-white/80"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-lg font-medium">Add Day</span>
                        </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="timeline-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-[65vh]"
              >
                <TimelineView
                  days={days}
                  getPrimaryColor={getPrimaryColor}
                  getGradient={getGradient}
                  onEditActivity={editActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating View Toggle Button */}
      <motion.button
        onClick={() => setViewMode(viewMode === 'cards' ? 'timeline' : 'cards')}
        className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-gray-800/95 backdrop-blur-sm
          border border-white/10 shadow-lg hover:shadow-xl transition-all
          flex items-center gap-2 text-sm font-medium z-40
          hover:bg-gray-700/95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {viewMode === 'cards' ? (
          <>
            <GanttChart className="w-4 h-4 text-cyan-400" />
            <span>Timeline View</span>
          </>
        ) : (
          <>
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>Card View</span>
          </>
        )}
      </motion.button>

      {/* Modals */}
      <PlannerModals
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        isTagManagerOpen={isTagManagerOpen}
        setIsTagManagerOpen={setIsTagManagerOpen}
        isAddingActivity={isAddingActivity}
        setIsAddingActivity={setIsAddingActivity}
        editingActivity={editingActivity}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        getTagColor={getTagColor}
        getGradient={getGradient}
        onSaveActivity={saveActivity}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ItineraryPlanner; 