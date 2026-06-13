import { NextResponse } from 'next/server';
import db from '@/src/lib/db';
import { sendEmail } from '@/src/lib/email';
import { abandonedCartTemplate } from '@/src/lib/email-templates';
import { subHours, subDays } from 'date-fns';

export async function GET(req: Request) {
  // Optional: Add basic auth to protect this cron endpoint
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Find bookings that have been pending for more than 1 hour but less than 24 hours
    // Adjust logic depending on your database schema for 'carts' vs 'bookings'
    const oneHourAgo = subHours(new Date(), 1);
    const oneDayAgo = subDays(new Date(), 1);

    const abandonedCarts = await db.booking.findMany({
      where: {
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: {
          lte: oneHourAgo,
          gte: oneDayAgo,
        },
        user: {
          email: {
            contains: "@",
          },
        },
        // We'll assume we only send one email and might need a way to track it,
        // but for this example, we fetch them. In production, add a flag like 'abandonedEmailSent'
      },
      include: {
        user: true,
        car: true,
      },
    });

    let sentCount = 0;

    for (const cart of abandonedCarts) {
      if (!cart.user?.email) continue;

      const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${cart.id}`;
      
      const emailHtml = abandonedCartTemplate(
        cart.user?.name || 'Valued Customer',
        `${cart.car?.make || 'Vehicle'} ${cart.car?.model || ''}`,
        checkoutUrl
      );

      await sendEmail({
        to: cart.user.email,
        subject: `Complete your booking at ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}`,
        html: emailHtml,
      });

      sentCount++;
    }

    return NextResponse.json({ success: true, sentCount });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
