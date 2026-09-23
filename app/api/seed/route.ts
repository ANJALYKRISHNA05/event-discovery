import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_EVENTS } from '@/prisma/seed';

export async function POST() {
  try {
    // Delete existing events
    await prisma.event.deleteMany({});

    // Seed events
    for (const ev of INITIAL_EVENTS) {
      await prisma.event.create({
        data: ev,
      });
    }

    const count = await prisma.event.count();

    return NextResponse.json({
      success: true,
      message: `Database successfully re-seeded with ${count} curated events!`,
      count,
    });
  } catch (error) {
    console.error('Error re-seeding database:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to re-seed database.',
      },
      { status: 500 }
    );
  }
}
