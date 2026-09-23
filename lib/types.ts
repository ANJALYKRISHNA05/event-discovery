export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface EventItem {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  startDate: string | Date;
  endDate: string | Date;
  venue: string;
  city: string;
  country: string;
  organizer: string;
  website: string;
  image: string;
  status: EventStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface EventsApiResponse {
  events: EventItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  facets: {
    categories: { name: string; count: number }[];
    industries: { name: string; count: number }[];
    cities: { name: string; count: number }[];
    countries: { name: string; count: number }[];
    statuses: { name: string; count: number }[];
  };
}

export interface EventFormData {
  name: string;
  description: string;
  category: string;
  industry: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  organizer: string;
  website: string;
  image: string;
  status: EventStatus;
}

export interface FilterState {
  search: string;
  category: string;
  industry: string;
  city: string;
  country: string;
  status: string;
  sortBy: 'startDate' | 'name' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  page: number;
}
