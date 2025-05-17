import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Tag, Share2, Plus, Check, Clock, MapPin, FileText, Calendar, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { Activity } from '../types';

interface PlannerModalsProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isTagManagerOpen: boolean;
  setIsTagManagerOpen: (open: boolean) => void;
  isAddingActivity: boolean;
  setIsAddingActivity: (adding: boolean) => void;
  editingActivity: Activity | null;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  getTagColor: (tag: string) => string;
  getGradient: () => string;
  onSaveActivity?: () => void;
}

const activityOptions = {
  food: [
    'Breakfast', 'Lunch', 'Dinner', 'Cafe Visit', 'Food Tour', 
    'Local Market', 'Fine Dining', 'Street Food', 'Cooking Class'
  ],
  travel: [
    'Flight', 'Train Ride', 'Bus Journey', 'Taxi', 'Car Rental',
    'Airport Transfer', 'Ferry Ride', 'Bike Rental'
  ],
  explore: [
    'City Tour', 'Museum Visit', 'Temple Visit', 'Shopping',
    'Park Visit', 'Beach Time', 'Hiking', 'Photography Tour'
  ],
  accommodation: [
    'Hotel Check-in', 'Hotel Check-out', 'Resort Stay',
    'Hostel Check-in', 'Villa Arrival', 'Apartment Check-in'
  ],
  activity: [
    'Spa Treatment', 'Yoga Class', 'Gym Session', 'Swimming',
    'Surfing', 'Snorkeling', 'Diving', 'Adventure Sports'
  ]
};

const availableTags = ['planned', 'booked', 'must-do'];

export default function PlannerModals({
  isFilterOpen,
  setIsFilterOpen,
  isTagManagerOpen,
  setIsTagManagerOpen,
  isAddingActivity,
  setIsAddingActivity,
  editingActivity,
  selectedTags,
  setSelectedTags,
  getTagColor,
  getGradient,
  onSaveActivity
}: PlannerModalsProps) {
  const [localActivity, setLocalActivity] = useState<Activity | null>(editingActivity);
  const [selectedType, setSelectedType] = useState<keyof typeof activityOptions>('activity');
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  // Update local activity when editingActivity changes
  useEffect(() => {
    if (editingActivity) {
      setLocalActivity(editingActivity);
      setSelectedType(editingActivity.type as keyof typeof activityOptions);
      setCustomTitle(editingActivity.title);
    }
  }, [editingActivity]);

  const handleActivitySave = () => {
    if (onSaveActivity && localActivity && editingActivity) {
      // Update the editingActivity with all the local changes before saving
      editingActivity.title = localActivity.title;
      editingActivity.type = localActivity.type;
      editingActivity.timeStart = localActivity.timeStart;
      editingActivity.timeEnd = localActivity.timeEnd;
      editingActivity.location = localActivity.location;
      editingActivity.notes = localActivity.notes;
      editingActivity.tags = localActivity.tags;
      editingActivity.checklist = localActivity.checklist || [];
      
      onSaveActivity();
    }
    setIsAddingActivity(false);
  };

  return (
    <>
      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              className="bg-gray-800/95 rounded-xl p-6 w-full max-w-md shadow-2xl border border-white/10"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filter Activities</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Activity Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['food', 'travel', 'explore', 'accommodation', 'activity'].map((type) => (
                      <motion.button
                        key={type}
                        className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium
                          ${selectedTags.includes(type)
                            ? 'bg-white/20 text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/15'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedTags(
                            selectedTags.includes(type)
                              ? selectedTags.filter((t: string) => t !== type)
                              : [...selectedTags, type]
                          );
                        }}
                      >
                        <span className="capitalize">{type}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedTags([]);
                    setIsFilterOpen(false);
                  }}
                >
                  Clear All
                </motion.button>
                <motion.button
                  className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getGradient()} text-white font-medium`}
                  whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tag Manager Modal */}
      <AnimatePresence>
        {isTagManagerOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsTagManagerOpen(false)}
          >
            <motion.div
              className="bg-gray-800/95 rounded-xl p-6 w-full max-w-md shadow-2xl border border-white/10"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Tags</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsTagManagerOpen(false)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Available Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['planned', 'booked', 'must-do'].map(tag => (
                      <div
                        key={tag}
                        className={`px-3 py-1.5 rounded-full ${getTagColor(tag)} flex items-center gap-2`}
                      >
                        <span className="capitalize">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">
                    Custom tag management coming soon! You'll be able to create and manage your own tags.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-8 pt-4 border-t border-white/10">
                <motion.button
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsTagManagerOpen(false)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Editor Modal */}
      <AnimatePresence>
        {isAddingActivity && editingActivity && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingActivity(false)}
          >
            <motion.div
              className="bg-gray-800/95 rounded-xl w-full max-w-lg shadow-2xl border border-white/10 max-h-[90vh] flex flex-col"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <motion.h2 
                  className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {editingActivity.id ? 'Edit Activity' : 'Add New Activity'}
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/60 hover:text-white"
                  onClick={() => setIsAddingActivity(false)}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6 space-y-8">
                  {/* Activity Type Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-300 block font-medium">Activity Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.keys(activityOptions).map((type) => (
                        <motion.button
                          key={type}
                          onClick={() => {
                            setSelectedType(type as keyof typeof activityOptions);
                            setShowCustomTitle(false);
                            if (localActivity) {
                              setLocalActivity({
                                ...localActivity,
                                type: type as Activity['type']
                              });
                            }
                          }}
                          className={`p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all
                            ${selectedType === type
                              ? 'bg-gradient-to-br from-violet-600/30 to-purple-700/30 border border-violet-400'
                              : 'bg-black/30 border border-gray-700 hover:border-gray-600'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="capitalize">{type}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Activity Title Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-300 mb-2 block font-medium">Activity Title</label>
                    {!showCustomTitle ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                          {activityOptions[selectedType].map((option) => (
                            <motion.button
                              key={option}
                              onClick={() => {
                                if (localActivity) {
                                  setLocalActivity({
                                    ...localActivity,
                                    title: option,
                                    type: selectedType
                                  });
                                }
                              }}
                              className={`p-3 rounded-lg text-left text-sm transition-all
                                ${localActivity?.title === option
                                  ? 'bg-gradient-to-br from-violet-600/30 to-purple-700/30 border border-violet-400'
                                  : 'bg-black/30 border border-gray-700 hover:border-gray-600'
                                }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                        <motion.button
                          onClick={() => setShowCustomTitle(true)}
                          className="w-full p-3 rounded-lg bg-black/30 border border-gray-700 hover:border-gray-600 text-sm text-gray-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          + Custom Activity
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => {
                            setCustomTitle(e.target.value);
                            if (localActivity) {
                              setLocalActivity({
                                ...localActivity,
                                title: e.target.value,
                                type: selectedType
                              });
                            }
                          }}
                          placeholder="Enter custom activity title"
                          className="w-full bg-black/30 text-white p-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                        />
                        <motion.button
                          onClick={() => setShowCustomTitle(false)}
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          ← Back to suggestions
                        </motion.button>
                      </div>
                    )}
                  </motion.div>

                  {/* Time Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-300 block font-medium">Time</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Start Time</label>
                        <input
                          type="time"
                          value={localActivity?.timeStart || ''}
                          onChange={(e) => {
                            if (localActivity) {
                              setLocalActivity({
                                ...localActivity,
                                timeStart: e.target.value
                              });
                            }
                          }}
                          className="w-full bg-black/30 text-white p-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">End Time</label>
                        <input
                          type="time"
                          value={localActivity?.timeEnd || ''}
                          onChange={(e) => {
                            if (localActivity) {
                              setLocalActivity({
                                ...localActivity,
                                timeEnd: e.target.value
                              });
                            }
                          }}
                          className="w-full bg-black/30 text-white p-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-300 block font-medium">Location</label>
                    <input
                      type="text"
                      value={localActivity?.location || ''}
                      onChange={(e) => {
                        if (localActivity) {
                          setLocalActivity({
                            ...localActivity,
                            location: e.target.value
                          });
                        }
                      }}
                      placeholder="Enter location"
                      className="w-full bg-black/30 text-white p-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    />
                  </motion.div>

                  {/* Notes */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-300 block font-medium">Notes</label>
                    <textarea
                      value={localActivity?.notes || ''}
                      onChange={(e) => {
                        if (localActivity) {
                          setLocalActivity({
                            ...localActivity,
                            notes: e.target.value
                          });
                        }
                      }}
                      placeholder="Add any additional notes..."
                      rows={3}
                      className="w-full bg-black/30 text-white p-3 rounded-xl border border-gray-700 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all resize-none"
                    />
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <label className="text-sm text-gray-300 block font-medium">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <motion.button
                          key={tag}
                          onClick={() => {
                            if (localActivity) {
                              const newTags = localActivity.tags.includes(tag)
                                ? localActivity.tags.filter(t => t !== tag)
                                : [...localActivity.tags, tag];
                              setLocalActivity({
                                ...localActivity,
                                tags: newTags
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                            ${localActivity?.tags.includes(tag)
                              ? getTagColor(tag)
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-end gap-3"
                >
                  <motion.button
                    className="px-5 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingActivity(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className={`px-5 py-2.5 rounded-lg bg-gradient-to-r ${getGradient()} text-white font-medium`}
                    whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleActivitySave}
                    disabled={!localActivity?.title}
                  >
                    Save Activity
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 