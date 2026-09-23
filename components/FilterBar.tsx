'use client';

import React from 'react';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { FilterState } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FacetOption {
  name: string;
  count: number;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  facets: {
    categories: FacetOption[];
    industries: FacetOption[];
    cities: FacetOption[];
    countries: FacetOption[];
    statuses: FacetOption[];
  };
  totalResults: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isLoading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  facets,
  totalResults,
  viewMode,
  onViewModeChange,
  isLoading = false,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    (Boolean(filters.category) && filters.category !== 'ALL') ||
    (Boolean(filters.industry) && filters.industry !== 'ALL') ||
    (Boolean(filters.city) && filters.city !== 'ALL') ||
    (Boolean(filters.country) && filters.country !== 'ALL') ||
    (Boolean(filters.status) && filters.status !== 'ALL');

  const statusTabs = [
    { label: 'All Events', value: 'ALL' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Top Search and Status Tabs Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              placeholder="Search by event name, venue, city, organizer, keyword..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-950/80 border border-slate-700/60 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '', page: 1 })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 overflow-x-auto">
            {statusTabs.map((tab) => {
              const isActive =
                (!filters.status && tab.value === 'ALL') ||
                filters.status === tab.value ||
                (filters.status === '' && tab.value === 'ALL');

              return (
                <button
                  key={tab.value}
                  onClick={() => onFilterChange({ status: tab.value === 'ALL' ? '' : tab.value, page: 1 })}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800/80">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={filters.category || 'ALL'}
              onChange={(e) => onFilterChange({ category: e.target.value === 'ALL' ? '' : e.target.value, page: 1 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="ALL">All Categories</option>
              {facets.categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Industry Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Industry
            </label>
            <select
              value={filters.industry || 'ALL'}
              onChange={(e) => onFilterChange({ industry: e.target.value === 'ALL' ? '' : e.target.value, page: 1 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="ALL">All Industries</option>
              {facets.industries.map((ind) => (
                <option key={ind.name} value={ind.name}>
                  {ind.name} ({ind.count})
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              City
            </label>
            <select
              value={filters.city || 'ALL'}
              onChange={(e) => onFilterChange({ city: e.target.value === 'ALL' ? '' : e.target.value, page: 1 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="ALL">All Cities</option>
              {facets.cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.count})
                </option>
              ))}
            </select>
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Country
            </label>
            <select
              value={filters.country || 'ALL'}
              onChange={(e) => onFilterChange({ country: e.target.value === 'ALL' ? '' : e.target.value, page: 1 })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="ALL">All Countries</option>
              {facets.countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name} ({country.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [
                  'startDate' | 'name' | 'createdAt',
                  'asc' | 'desc'
                ];
                onFilterChange({ sortBy, sortOrder, page: 1 });
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="startDate-asc">Date: Earliest First</option>
              <option value="startDate-desc">Date: Furthest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="createdAt-desc">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Results Count Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            Showing <strong className="text-white">{totalResults}</strong> {totalResults === 1 ? 'event' : 'events'}
          </span>

          {/* Active Chips */}
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs">
              Search: &quot;{filters.search}&quot;
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category && filters.category !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs">
              Category: {filters.category}
              <button
                onClick={() => onFilterChange({ category: '' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.industry && filters.industry !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs">
              Industry: {filters.industry}
              <button
                onClick={() => onFilterChange({ industry: '' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.city && filters.city !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs">
              City: {filters.city}
              <button
                onClick={() => onFilterChange({ city: '' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.country && filters.country !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs">
              Country: {filters.country}
              <button
                onClick={() => onFilterChange({ country: '' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.status && filters.status !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs">
              Status: {filters.status}
              <button
                onClick={() => onFilterChange({ status: '' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors ml-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>

        {/* View Toggle (Grid / List) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            title="List View"
            className={cn(
              'p-1.5 rounded-lg transition-colors cursor-pointer',
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
