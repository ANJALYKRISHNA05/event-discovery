import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventSchema } from '@/lib/validators';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const industry = searchParams.get('industry')?.trim() || '';
    const city = searchParams.get('city')?.trim() || '';
    const country = searchParams.get('country')?.trim() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || '';
    const sortBy = searchParams.get('sortBy') || 'startDate';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '12', 10)));

    const where: Prisma.EventWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { organizer: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'ALL') {
      where.category = { equals: category };
    }

    if (industry && industry !== 'ALL') {
      where.industry = { equals: industry };
    }

    if (city && city !== 'ALL') {
      where.city = { equals: city };
    }

    if (country && country !== 'ALL') {
      where.country = { equals: country };
    }

    if (status && status !== 'ALL') {
      where.status = { equals: status };
    }

    // Determine sort field
    let orderBy: Prisma.EventOrderByWithRelationInput = { startDate: 'asc' };
    if (sortBy === 'name') {
      orderBy = { name: sortOrder };
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder };
    } else if (sortBy === 'startDate') {
      orderBy = { startDate: sortOrder };
    }

    const skip = (page - 1) * limit;

    const [total, events, allEventsForFacets] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.event.findMany({
        select: {
          category: true,
          industry: true,
          city: true,
          country: true,
          status: true,
        },
      }),
    ]);

    // Aggregate facet counts
    const categoryCountMap: Record<string, number> = {};
    const industryCountMap: Record<string, number> = {};
    const cityCountMap: Record<string, number> = {};
    const countryCountMap: Record<string, number> = {};
    const statusCountMap: Record<string, number> = {};

    for (const item of allEventsForFacets) {
      if (item.category) categoryCountMap[item.category] = (categoryCountMap[item.category] || 0) + 1;
      if (item.industry) industryCountMap[item.industry] = (industryCountMap[item.industry] || 0) + 1;
      if (item.city) cityCountMap[item.city] = (cityCountMap[item.city] || 0) + 1;
      if (item.country) countryCountMap[item.country] = (countryCountMap[item.country] || 0) + 1;
      if (item.status) statusCountMap[item.status] = (statusCountMap[item.status] || 0) + 1;
    }

    const facets = {
      categories: Object.entries(categoryCountMap).map(([name, count]) => ({ name, count })),
      industries: Object.entries(industryCountMap).map(([name, count]) => ({ name, count })),
      cities: Object.entries(cityCountMap).map(([name, count]) => ({ name, count })),
      countries: Object.entries(countryCountMap).map(([name, count]) => ({ name, count })),
      statuses: Object.entries(statusCountMap).map(([name, count]) => ({ name, count })),
    };

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      facets,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve events. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      const formattedErrors = parsed.error.format();
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const newEvent = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        industry: data.industry,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        venue: data.venue,
        city: data.city,
        country: data.country,
        organizer: data.organizer,
        website: data.website,
        image: data.image,
        status: data.status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event successfully created',
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create event. Server error.',
      },
      { status: 500 }
    );
  }
}
