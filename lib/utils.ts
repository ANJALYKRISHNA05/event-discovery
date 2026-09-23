import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const startYear = startDate.getFullYear();

  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const endDay = endDate.getDate();
  const endYear = endDate.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth) {
      if (startDay === endDay) {
        return `${startMonth} ${startDay}, ${startYear}`;
      }
      return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }

  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
}

export function formatSingleDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case 'UPCOMING':
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400 animate-pulse',
        label: 'Upcoming',
      };
    case 'ONGOING':
      return {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        dot: 'bg-amber-400 animate-pulse',
        label: 'Ongoing',
      };
    case 'COMPLETED':
      return {
        badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
        dot: 'bg-zinc-400',
        label: 'Completed',
      };
    default:
      return {
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        dot: 'bg-indigo-400',
        label: status,
      };
  }
}

export const PRESET_IMAGES = [
  {
    title: 'Technology & AI Summit',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
    category: 'Technology',
  },
  {
    title: 'Global Trade Expo',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    category: 'Business & Trade',
  },
  {
    title: 'Healthcare & Biotech Congress',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    category: 'Healthcare',
  },
  {
    title: 'Clean Energy & Climate Forum',
    url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1600&q=80',
    category: 'Energy',
  },
  {
    title: 'FinTech & Capital Innovation',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
    category: 'Finance',
  },
  {
    title: 'Robotics & Industrial Expo',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80',
    category: 'Manufacturing',
  },
  {
    title: 'Design & Creative Conference',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80',
    category: 'Creative & Design',
  },
  {
    title: 'Global Leadership Summit',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80',
    category: 'Leadership',
  },
];

export const PRESET_CATEGORIES = [
  'Technology',
  'Business & Trade',
  'Healthcare',
  'Finance',
  'Energy & Sustainability',
  'Manufacturing',
  'Retail & E-commerce',
  'Creative & Design',
];

export const PRESET_INDUSTRIES = [
  'AI & Robotics',
  'FinTech & Blockchain',
  'Biotechnology & MedTech',
  'Renewable Energy',
  'Supply Chain & Logistics',
  'Cybersecurity',
  'Automotive & EV',
  'Cloud & Enterprise SaaS',
];
