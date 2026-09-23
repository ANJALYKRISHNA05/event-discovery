'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
  Bookmark,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { EventItem } from '@/lib/types';
import { formatDateRange, getStatusStyle, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EventCardProps {
  event: EventItem;
  viewMode?: 'grid' | 'list';
}

export const EventCard: React.FC<EventCardProps> = ({ event, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const statusInfo = getStatusStyle(event.status);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`bookmark_${event.id}`);
      if (saved === 'true') setIsBookmarked(true);
    } catch {}
  }, [event.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      localStorage.setItem(`bookmark_${event.id}`, String(next));
      if (next) {
        toast.success(`Saved "${event.name}" to your bookmarks!`);
      } else {
        toast.info(`Removed from bookmarks`);
      }
    } catch {}
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${event.id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between backdrop-blur-md hover:shadow-xl hover:shadow-indigo-500/5">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full md:w-auto">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 h-32 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-950 border border-slate-800/80">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-2 left-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border backdrop-blur-md uppercase',
                  statusInfo.badge
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dot)} />
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {event.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {event.industry}
              </span>
            </div>

            <Link href={`/events/${event.id}`}>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {event.name}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {formatDateRange(event.startDate, event.endDate)}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                {event.venue}, {event.city}, {event.country}
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
              {event.description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t border-slate-800/80 md:border-t-0 pt-3 md:pt-0">
          <button
            onClick={toggleBookmark}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark event'}
            className={cn(
              'p-2 rounded-xl border transition-all cursor-pointer',
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-amber-400')} />
          </button>

          <button
            onClick={handleShare}
            title="Share event link"
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <Link
            href={`/events/${event.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/20"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-md hover:shadow-2xl hover:shadow-indigo-500/10">
      {/* Banner Image Container */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-950">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border backdrop-blur-md uppercase shadow-lg',
              statusInfo.badge
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dot)} />
            {statusInfo.label}
          </span>

          {/* Bookmark & Share Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              title="Share event link"
              className="p-1.5 rounded-full bg-slate-950/70 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors backdrop-blur-md cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleBookmark}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark event'}
              className={cn(
                'p-1.5 rounded-full border transition-colors backdrop-blur-md cursor-pointer',
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-950/70 border-white/10 text-slate-300 hover:text-white hover:bg-slate-900'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isBookmarked && 'fill-amber-400')} />
            </button>
          </div>
        </div>

        {/* Category Pill on Image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-600/90 text-white backdrop-blur-md shadow">
            {event.category}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 backdrop-blur-md border border-white/10">
            {event.industry}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          <Link href={`/events/${event.id}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
              {event.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            {/* Dates */}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-medium">
                {formatDateRange(event.startDate, event.endDate)}
              </span>
            </div>

            {/* Location & Venue */}
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                <span className="text-slate-200 font-medium">{event.city}, {event.country}</span>
                <span className="text-slate-400 ml-1">({event.venue})</span>
              </span>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="line-clamp-1 font-medium">{event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <Link
            href={`/events/${event.id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-800/80 hover:bg-indigo-600 border border-slate-700/60 hover:border-indigo-500/40 transition-all duration-200 group/btn shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
