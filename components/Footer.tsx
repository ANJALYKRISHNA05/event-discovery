import React from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Shield, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Event<span className="text-indigo-400">Pulse</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The premier discovery ecosystem for international business conferences, trade expos,
              technology summits, and industry exhibitions worldwide.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> 50+ Global Cities
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Verified Organizers
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-time Updates
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Upcoming Summits
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-400 transition-colors">
                  Admin Management Hub
                </Link>
              </li>
              <li>
                <Link href="/api/events" target="_blank" className="hover:text-indigo-400 transition-colors">
                  REST API Endpoints
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Spec */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
              Built With
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Prisma ORM', 'SQLite', 'Zod', 'Lucide'].map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EventPulse Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Technical Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
