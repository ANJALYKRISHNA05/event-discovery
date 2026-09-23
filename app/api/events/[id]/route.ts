import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventSchema } from '@/lib/validators';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: `Event with ID "${id}" not found.`,
        },
        { status: 404 }
      );
    }

    // Also fetch similar/related events by category or industry
    const relatedEvents = await prisma.event.findMany({
      where: {
        id: { not: id },
        OR: [{ category: event.category }, { industry: event.industry }],
      },
      take: 3,
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json({
      success: true,
      event,
      relatedEvents,
    });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve event.',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Check if event exists
    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Event with ID "${id}" not found.`,
        },
        { status: 404 }
      );
    }

    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updatedEvent = await prisma.event.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully.',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update event. Server error.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Event with ID "${id}" not found.`,
        },
        { status: 404 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Event "${existing.name}" successfully deleted.`,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete event. Server error.',
      },
      { status: 500 }
    );
  }
}
