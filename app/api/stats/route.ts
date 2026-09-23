import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalEvents, upcomingCount, ongoingCount, completedCount, allEvents] =
      await Promise.all([
        prisma.event.count(),
        prisma.event.count({ where: { status: 'UPCOMING' } }),
        prisma.event.count({ where: { status: 'ONGOING' } }),
        prisma.event.count({ where: { status: 'COMPLETED' } }),
        prisma.event.findMany({
          select: {
            city: true,
            country: true,
            category: true,
            industry: true,
          },
        }),
      ]);

    const uniqueCities = new Set(allEvents.map((e) => e.city)).size;
    const uniqueCountries = new Set(allEvents.map((e) => e.country)).size;

    // Calculate top category
    const categoryCount: Record<string, number> = {};
    allEvents.forEach((e) => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    });

    let topCategory = 'None';
    let maxCategoryCount = 0;
    for (const [cat, count] of Object.entries(categoryCount)) {
      if (count > maxCategoryCount) {
        maxCategoryCount = count;
        topCategory = cat;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        upcomingCount,
        ongoingCount,
        completedCount,
        uniqueCities,
        uniqueCountries,
        topCategory,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch platform metrics.',
      },
      { status: 500 }
    );
  }
}
