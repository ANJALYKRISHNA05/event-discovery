'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { CalendarExport } from '@/components/CalendarExport';
import { EventItem } from '@/lib/types';
import {
  Calendar,
  MapPin,
  Building2,
  Globe,
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import { formatDateRange, formatDateTime, getStatusStyle, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        if (res.ok && data.event) {
          setEvent(data.event);
          setRelatedEvents(data.relatedEvents || []);

          try {
            const saved = localStorage.getItem(`bookmark_${data.event.id}`);
            if (saved === 'true') setIsBookmarked(true);
          } catch {}
        } else {
          toast.error(data.error || 'Event not found.');
        }
      } catch (err) {
        console.error('Error loading event:', err);
        toast.error('Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const toggleBookmark = () => {
    if (!event) return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      localStorage.setItem(`bookmark_${event.id}`, String(next));
      if (next) {
        toast.success(`Saved "${event.name}" to your bookmarks!`);
      } else {
        toast.info('Removed from bookmarks');
      }
    } catch {}
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 space-y-8 animate-pulse">
          <div className="h-6 w-36 bg-slate-800 rounded" />
          <div className="h-80 w-full bg-slate-800/60 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-slate-800 rounded" />
              <div className="h-32 bg-slate-800/40 rounded-xl" />
            </div>
            <div className="h-64 bg-slate-800/40 rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
          <p className="text-slate-400 text-sm">
            The event you are looking for does not exist or has been removed from the registry.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Event Discovery</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = getStatusStyle(event.status);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb & Navigation Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={toggleBookmark}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer',
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isBookmarked && 'fill-amber-400')} />
              <span>{isBookmarked ? 'Bookmarked' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl">
          <div className="relative w-full h-72 sm:h-96">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Overlay Info Header */}
            <div className="absolute bottom-6 inset-x-6 sm:inset-x-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Status Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border backdrop-blur-md uppercase shadow-lg',
                    statusInfo.badge
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full', statusInfo.dot)} />
                  {statusInfo.label}
                </span>

                {/* Category Pill */}
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-indigo-600 text-white shadow">
                  {event.category}
                </span>

                {/* Industry Pill */}
                <span className="text-xs font-medium px-3 py-1 rounded-md bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-md">
                  {event.industry}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {event.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold">{formatDateRange(event.startDate, event.endDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>
                    {event.venue} — <strong className="text-white">{event.city}, {event.country}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description & Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                About This Event
              </h2>
              <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Key Event Highlights */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                What to Expect
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Keynote sessions by global industry pioneers & CTOs</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Live interactive technology showcases & product expos</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated executive networking lounges & 1-on-1 matchmaking</span>
                </li>
                <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Access to recorded session archives and post-event whitepapers</span>
                </li>
              </ul>
            </div>

            {/* Schedule & Calendar Action */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    Event Schedule
                  </h2>
                  <p className="text-xs text-slate-400">Add directly to your personal calendar</p>
                </div>
                <CalendarExport event={event} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Conference Opening
                  </span>
                  <p className="text-sm font-bold text-white">{formatDateTime(event.startDate)}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Concluding Session
                  </span>
                  <p className="text-sm font-bold text-white">{formatDateTime(event.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Location, Organizer & Official Link */}
          <div className="space-y-6">
            {/* Quick Action Ticket / Website Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-900/40 via-slate-900/90 to-slate-950 border border-indigo-500/30 backdrop-blur-xl shadow-xl space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Registration & Passes
                </span>
                <h3 className="text-lg font-bold text-white">Official Event Portal</h3>
                <p className="text-xs text-slate-300">
                  Access tickets, keynote speaker schedules, and delegate registration via the organizer&apos;s portal.
                </p>
              </div>

              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Organizer Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Organizer Information
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-bold text-lg">
                  {event.organizer.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">{event.organizer}</h4>
                    <span title="Verified Organizer">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Verified Event Organizer</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Official Link:</span>
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline line-clamp-1 max-w-[180px]"
                  >
                    {event.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Location & Venue Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-rose-400" />
                Venue & Destination
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white">{event.venue}</h4>
                <p className="text-xs text-slate-300">
                  {event.city}, {event.country}
                </p>
              </div>

              {/* Map Preview Placeholder Visual */}
              <div className="h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative flex items-center justify-center text-center p-3">
                <div className="space-y-1">
                  <Navigation className="w-6 h-6 text-indigo-400 mx-auto animate-bounce" />
                  <span className="text-[11px] font-semibold text-slate-200 block">
                    {event.venue}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {event.city}, {event.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related / Similar Events Section */}
        {relatedEvents.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-800/80">
            <div>
              <h3 className="text-xl font-bold text-white">Similar Conferences & Summits</h3>
              <p className="text-xs text-slate-400">Explore more events in {event.category} and {event.industry}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <EventCard key={rel.id} event={rel} viewMode="grid" />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
