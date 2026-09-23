import { z } from 'zod';

export const eventSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Event name must be at least 3 characters long.' })
    .max(200, { message: 'Event name must not exceed 200 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long.' }),
  category: z
    .string()
    .min(2, { message: 'Please specify a category.' }),
  industry: z
    .string()
    .min(2, { message: 'Please specify an industry.' }),
  startDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Invalid start date format.',
  }),
  endDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Invalid end date format.',
  }),
  venue: z
    .string()
    .min(2, { message: 'Venue name is required.' }),
  city: z
    .string()
    .min(2, { message: 'City is required.' }),
  country: z
    .string()
    .min(2, { message: 'Country is required.' }),
  organizer: z
    .string()
    .min(2, { message: 'Organizer name is required.' }),
  website: z
    .string()
    .url({ message: 'Please enter a valid website URL (e.g. https://example.com).' }),
  image: z
    .string()
    .url({ message: 'Please enter a valid image URL.' }),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED'], {
    message: 'Status must be UPCOMING, ONGOING, or COMPLETED.',
  }),
}).refine(
  (data) => new Date(data.endDate).getTime() >= new Date(data.startDate).getTime(),
  {
    message: 'End date cannot be earlier than start date.',
    path: ['endDate'],
  }
);

export type EventInput = z.infer<typeof eventSchema>;
