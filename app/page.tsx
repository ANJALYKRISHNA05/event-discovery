'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { FilterBar } from '@/components/FilterBar';
import { EventModal } from '@/components/EventModal';
import { EventItem, FilterState, EventsApiResponse, EventFormData } from '@/lib/types';
import {
  Sparkles,
  Calendar,
  Globe,
  TrendingUp,
  Search,
  PlusCircle,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  const [facets, setFacets] = useState({
    categories: [] as { name: string; count: number }[],
    industries: [] as { name: string; count: number }[],
    cities: [] as { name: string; count: number }[],
    countries: [] as { name: string; count: number }[],
    statuses: [] as { name: string; count: number }[],
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    industry: '',
    city: '',
    country: '',
    status: '',
    sortBy: 'startDate',
    sortOrder: 'asc',
    page: 1,
  });

  // Fetch events from backend API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.industry) params.set('industry', filters.industry);
      if (filters.city) params.set('city', filters.city);
      if (filters.country) params.set('country', filters.country);
      if (filters.status) params.set('status', filters.status);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
      params.set('page', String(filters.page));
      params.set('limit', String(pagination.limit));

      const res = await fetch(`/api/events?${params.toString()}`);
      const data: EventsApiResponse = await res.json();

      if (res.ok && data.events) {
        setEvents(data.events);
        setPagination(data.pagination);
        setFacets(data.facets);

        // Set featured event if on first page and not filtered
        if (filters.page === 1 && !filters.search && data.events.length > 0 && !featuredEvent) {
          setFeaturedEvent(data.events[0]);
        }
      } else {
        toast.error('Could not load events.');
      }
    } catch (err) {
      console.error('Fetch events error:', err);
      toast.error('Network error loading events.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.limit, featuredEvent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      industry: '',
      city: '',
      country: '',
      status: '',
      sortBy: 'startDate',
      sortOrder: 'asc',
      page: 1,
    });
    toast.info('Filters have been reset.');
  };

  const handleCreateEvent = async (formData: EventFormData): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to create event.');
        return false;
      }

      toast.success('Event published successfully!');
      fetchEvents();
      return true;
    } catch (e) {
      toast.error('Network error publishing event.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenCreateModal={() => setIsModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          {/* Subtle glowing ambient blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Discover Over 1,200+ Flagship Summits & Trade Expos</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Explore the World’s Leading{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Business & Tech
              </span>{' '}
              Conferences.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Connect with global industry leaders, benchmark emerging technologies, and attend
              frontier exhibitions across San Francisco, London, Dubai, Tokyo, and Singapore.
            </p>

            {/* Fast Category Quick-Filter Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Popular categories:</span>
              {['Technology', 'Healthcare', 'Finance', 'Energy & Sustainability', 'Manufacturing'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange({ category: cat, page: 1 })}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      filters.category === cat
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section id="events-explorer" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Discover Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Filter by industry, location, date, and live status
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/25 border border-indigo-500/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            facets={facets}
            totalResults={pagination.total}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isLoading={isLoading}
          />
        </section>

        {/* Events Grid / List Section */}
        <section className="space-y-6">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-4 animate-pulse"
                >
                  <div className="w-full h-48 rounded-xl bg-slate-800/60" />
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-slate-800/60 rounded" />
                    <div className="h-6 w-3/4 bg-slate-800/60 rounded" />
                    <div className="h-4 w-full bg-slate-800/40 rounded" />
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between">
                    <div className="h-4 w-1/4 bg-slate-800/60 rounded" />
                    <div className="h-8 w-24 bg-slate-800/60 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            /* Events Content */
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 text-center space-y-4 backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">No matching events found</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  We couldn&apos;t find any events matching your current search query or filter criteria.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
              <span className="text-xs text-slate-400">
                Page <strong className="text-white">{pagination.page}</strong> of{' '}
                <strong className="text-white">{pagination.totalPages}</strong> ({pagination.total} total)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() =>
                    handleFilterChange({
                      page: Math.min(pagination.totalPages, filters.page + 1),
                    })
                  }
                  disabled={filters.page >= pagination.totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Create Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateEvent}
        isSaving={isSaving}
      />
    </div>
  );
}
