'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventModal } from '@/components/EventModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { EventItem, EventFormData } from '@/lib/types';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Calendar,
  MapPin,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  Globe2,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { formatDateRange, getStatusStyle, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingCount: 0,
    ongoingCount: 0,
    completedCount: 0,
    uniqueCities: 0,
    topCategory: 'None',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch all events for admin table
  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventsRes, statsRes] = await Promise.all([
        fetch('/api/events?limit=100&sortBy=startDate&sortOrder=asc'),
        fetch('/api/stats'),
      ]);

      const eventsData = await eventsRes.json();
      const statsData = await statsRes.json();

      if (eventsRes.ok && eventsData.events) {
        setEvents(eventsData.events);
      }
      if (statsRes.ok && statsData.stats) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load admin data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Filter events in memory for fast table search
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      !searchQuery ||
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || ev.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Create or Update
  const handleSaveEvent = async (formData: EventFormData): Promise<boolean> => {
    setIsSaving(true);
    try {
      const isEditing = Boolean(editingEvent);
      const url = isEditing ? `/api/events/${editingEvent?.id}` : '/api/events';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to save event.');
        return false;
      }

      toast.success(
        isEditing
          ? `Event "${formData.name}" updated!`
          : `Event "${formData.name}" created!`
      );
      fetchAdminData();
      return true;
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Network error saving event.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${deletingEvent.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || 'Failed to delete event.');
        return;
      }

      toast.success(`Event "${deletingEvent.name}" deleted.`);
      setDeletingEvent(null);
      fetchAdminData();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Network error deleting event.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Reset / Re-seed sample database
  const handleResetData = async () => {
    if (!confirm('Reset and re-seed the event database with original 12 sample events?')) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || 'Database reset successfully!');
        fetchAdminData();
      } else {
        toast.error('Failed to reset database.');
      }
    } catch {
      toast.error('Network error during reset.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenCreateModal={() => { setEditingEvent(null); setIsModalOpen(true); }} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Admin Management Hub
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create, inspect, update, and manage global conferences and trade expos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              title="Re-seed database with default sample data"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={cn('w-3.5 h-3.5', isResetting && 'animate-spin')} />
              <span>Reset & Re-seed Demo</span>
            </button>

            <button
              onClick={() => {
                setEditingEvent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/25 border border-indigo-500/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Events */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Events</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
          </div>

          {/* Upcoming */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Upcoming</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.upcomingCount}</p>
          </div>

          {/* Ongoing */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Ongoing</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.ongoingCount}</p>
          </div>

          {/* Cities */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Destinations</span>
              <Globe2 className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.uniqueCities} Cities</p>
          </div>

          {/* Top Category */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Top Category</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-lg font-bold text-white truncate">{stats.topCategory}</p>
          </div>
        </div>

        {/* Management Table Section */}
        <section className="space-y-4">
          {/* Table Search & Status Tabs */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between backdrop-blur-md">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search table by name, venue, city, organizer..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 overflow-x-auto">
              {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer',
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  {st.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden backdrop-blur-md hidden md:block shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Event</th>
                    <th className="px-5 py-3.5">Category & Industry</th>
                    <th className="px-5 py-3.5">Dates</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                          <span>Loading events catalog...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((ev) => {
                      const statusStyle = getStatusStyle(ev.status);
                      return (
                        <tr
                          key={ev.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Event Thumbnail & Name */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                                <img
                                  src={ev.image}
                                  alt={ev.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <Link
                                  href={`/events/${ev.id}`}
                                  className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1"
                                >
                                  {ev.name}
                                </Link>
                                <span className="text-[11px] text-slate-400 block line-clamp-1">
                                  {ev.organizer}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category & Industry */}
                          <td className="px-5 py-3.5">
                            <div className="space-y-1">
                              <span className="inline-block font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                                {ev.category}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {ev.industry}
                              </span>
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="text-slate-200 font-medium">
                              {formatDateRange(ev.startDate, ev.endDate)}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="px-5 py-3.5">
                            <span className="text-slate-200 font-medium block">
                              {ev.city}, {ev.country}
                            </span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {ev.venue}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase',
                                statusStyle.badge
                              )}
                            >
                              <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
                              {statusStyle.label}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Public Page */}
                              <Link
                                href={`/events/${ev.id}`}
                                title="View public page"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setEditingEvent(ev);
                                  setIsModalOpen(true);
                                }}
                                title="Edit event"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/40 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeletingEvent(ev)}
                                title="Delete event"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        No events match the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="space-y-3 md:hidden">
            {filteredEvents.map((ev) => {
              const statusStyle = getStatusStyle(ev.status);
              return (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={ev.image}
                      alt={ev.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border uppercase mb-1',
                          statusStyle.badge
                        )}
                      >
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
                        {statusStyle.label}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{ev.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{ev.city}, {ev.country}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>{formatDateRange(ev.startDate, ev.endDate)}</span>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/events/${ev.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingEvent(ev);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingEvent(ev)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/* Create / Edit Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialData={editingEvent}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleConfirmDelete}
        event={deletingEvent}
        isDeleting={isDeleting}
      />
    </div>
  );
}
