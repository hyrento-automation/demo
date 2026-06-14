import { NextResponse } from 'next/server';
import db from '@/src/lib/db';
import { sendEmail } from '@/src/lib/email';
import { bookingFollowupTemplate } from '@/src/lib/email-templates';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Optional: Add basic auth to protect this cron endpoint
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Find bookings that were completed exactly 1 day ago (or based on returnDate)
    const yesterday = subDays(new Date(), 1);
    const twoDaysAgo = subDays(new Date(), 2);

    const completedBookings = await db.booking.findMany({
      where: {
        status: 'COMPLETED',
        returnDate: {
          lte: yesterday,
          gte: twoDaysAgo,
        },
        user: {
          email: {
            contains: "@",
          },
        },
      },
      include: {
        user: true,
        car: true,
      },
    });

    let sentCount = 0;

    for (const booking of completedBookings) {
      if (!booking.user?.email) continue;

      const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cars/${booking.car?.slug}#reviews`;
      
      const emailHtml = bookingFollowupTemplate(
        booking.user?.name || 'Customer',
        `${booking.car?.make || 'Vehicle'} ${booking.car?.model || ''}`,
        reviewUrl
      );

      await sendEmail({
        to: booking.user.email,
        subject: `How was your trip with the ${booking.car?.make || 'Vehicle'}?`,
        html: emailHtml,
      });

      sentCount++;
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (error) {
    console.error('Booking followup cron error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
