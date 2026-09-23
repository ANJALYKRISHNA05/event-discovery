'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Calendar,
  MapPin,
  Building2,
  Globe,
  Tag,
  Briefcase,
  AlertCircle,
  Sparkles,
  Check,
  ImageIcon,
} from 'lucide-react';
import { EventItem, EventFormData } from '@/lib/types';
import { PRESET_IMAGES, PRESET_CATEGORIES, PRESET_INDUSTRIES } from '@/lib/utils';
import { toast } from 'sonner';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<boolean>;
  initialData?: EventItem | null;
  isSaving?: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}) => {
  const isEditing = Boolean(initialData);

  const defaultFormState: EventFormData = {
    name: '',
    description: '',
    category: PRESET_CATEGORIES[0],
    industry: PRESET_INDUSTRIES[0],
    startDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000 * 9).toISOString().slice(0, 16),
    venue: '',
    city: '',
    country: '',
    organizer: '',
    website: '',
    image: PRESET_IMAGES[0].url,
    status: 'UPCOMING',
  };

  const [formData, setFormData] = useState<EventFormData>(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        category: initialData.category,
        industry: initialData.industry,
        startDate: new Date(initialData.startDate).toISOString().slice(0, 16),
        endDate: new Date(initialData.endDate).toISOString().slice(0, 16),
        venue: initialData.venue,
        city: initialData.city,
        country: initialData.country,
        organizer: initialData.organizer,
        website: initialData.website,
        image: initialData.image,
        status: initialData.status,
      });
    } else {
      setFormData(defaultFormState);
    }
    setErrors({});
    setShowPresetPicker(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 3) {
      errs.name = 'Event name is required (min 3 chars)';
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      errs.description = 'Description is required (min 10 chars)';
    }
    if (!formData.category.trim()) errs.category = 'Category is required';
    if (!formData.industry.trim()) errs.industry = 'Industry is required';
    if (!formData.venue.trim()) errs.venue = 'Venue name is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.country.trim()) errs.country = 'Country is required';
    if (!formData.organizer.trim()) errs.organizer = 'Organizer name is required';

    if (!formData.website.trim()) {
      errs.website = 'Website URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.website)) {
      errs.website = 'Enter a valid URL (e.g. https://example.com)';
    }

    if (!formData.image.trim()) {
      errs.image = 'Banner image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.image)) {
      errs.image = 'Enter a valid image URL';
    }

    if (new Date(formData.endDate).getTime() < new Date(formData.startDate).getTime()) {
      errs.endDate = 'End date cannot be earlier than start date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the highlighted validation errors.');
      return;
    }

    const success = await onSave(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Event Details' : 'Create New Event'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update event metadata, schedule, and venue information'
                  : 'Add a new summit, conference, or trade show to the global registry'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> 1. Basic Information
            </h3>

            {/* Event Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Event Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. World AI & Frontier Robotics Summit 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive overview of the conference agenda, target audience, keynote highlights..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.description && (
                <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Category & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="category-suggestions"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Technology"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <datalist id="category-suggestions">
                    {PRESET_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Industry / Focus <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="industry-suggestions"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. AI & Robotics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <datalist id="industry-suggestions">
                    {PRESET_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} />
                    ))}
                  </datalist>
                </div>
                {errors.industry && <p className="text-xs text-rose-400 mt-1">{errors.industry}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Status */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 2. Schedule & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Start Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.startDate && <p className="text-xs text-rose-400 mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  End Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.endDate && <p className="text-xs text-rose-400 mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Event Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> 3. Location & Venue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Venue Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Moscone Convention Center"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.venue && <p className="text-xs text-rose-400 mt-1">{errors.venue}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  City <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. San Francisco"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.city && <p className="text-xs text-rose-400 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Country <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. United States"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.country && <p className="text-xs text-rose-400 mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Organizer & Banner */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> 4. Organizer & Media
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Organizer Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="e.g. Nexus Tech Alliances"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.organizer && (
                  <p className="text-xs text-rose-400 mt-1">{errors.organizer}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Website / Registration Link <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                {errors.website && <p className="text-xs text-rose-400 mt-1">{errors.website}</p>}
              </div>
            </div>

            {/* Banner Image Input & Quick Preset Picker */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Banner Image URL <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPresetPicker(!showPresetPicker)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {showPresetPicker ? 'Hide Presets' : 'Choose Curated Banner'}
                </button>
              </div>

              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              {errors.image && <p className="text-xs text-rose-400 mt-1">{errors.image}</p>}

              {/* Preset Image Grid Picker */}
              {showPresetPicker && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-200">
                  <p className="text-[11px] text-slate-400">
                    Select a high-resolution Unsplash conference banner:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: preset.url });
                          setShowPresetPicker(false);
                        }}
                        className="group relative h-20 rounded-lg overflow-hidden border border-slate-700/60 hover:border-indigo-500 transition-all text-left"
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/60 p-1.5 flex flex-col justify-end">
                          <span className="text-[10px] font-semibold text-white leading-tight line-clamp-1">
                            {preset.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Preview of the Image */}
              {formData.image && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-36 relative">
                  <img
                    src={formData.image}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-950/80 text-[10px] text-slate-300 font-mono">
                    Live Banner Preview
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Event...
              </span>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Publish Event'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
