'use client';

import React from 'react';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { EventItem } from '@/lib/types';
import { toast } from 'sonner';

interface CalendarExportProps {
  event: EventItem;
}

export const CalendarExport: React.FC<CalendarExportProps> = ({ event }) => {
  const downloadICS = () => {
    const startDateFormatted = new Date(event.startDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    const endDateFormatted = new Date(event.endDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventPulse//Global Events Platform//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@eventpulse.io`,
      `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}`,
      `DTSTART:${startDateFormatted}`,
      `DTEND:${endDateFormatted}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.venue}, ${event.city}, ${event.country}`,
      `URL:${event.website}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendar .ics file downloaded!');
  };

  const openGoogleCalendar = () => {
    const startStr = new Date(event.startDate).toISOString().replace(/-|:|\.\d+/g, '');
    const endStr = new Date(event.endDate).toISOString().replace(/-|:|\.\d+/g, '');
    const details = encodeURIComponent(`${event.description}\n\nWebsite: ${event.website}`);
    const location = encodeURIComponent(`${event.venue}, ${event.city}, ${event.country}`);
    const title = encodeURIComponent(event.name);

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={downloadICS}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-600 transition-colors cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        <span>Add to iCal / Outlook</span>
      </button>

      <button
        onClick={openGoogleCalendar}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-600 transition-colors cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
        <span>Google Calendar</span>
        <ExternalLink className="w-3 h-3 text-slate-400" />
      </button>
    </div>
  );
};
