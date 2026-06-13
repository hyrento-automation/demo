export const abandonedCartTemplate = (name: string, carModel: string, checkoutUrl: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Complete your booking, ${name}!</h2>
  <p>We noticed you left the <strong>${carModel}</strong> in your cart.</p>
  <p>Your dates are still reserved for a little while longer. Complete your booking now to ensure you don't lose your car!</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${checkoutUrl}" style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
      Resume Booking
    </a>
  </div>
  <p>If you have any questions, feel free to reply to this email.</p>
  <p>Best regards,<br>${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} Team</p>
</div>
`;

export const bookingFollowupTemplate = (name: string, carModel: string, reviewUrl: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">How was your trip with the ${carModel}?</h2>
  <p>Hi ${name},</p>
  <p>We hope you had a fantastic experience renting with us. Your feedback is extremely important to us and helps us improve our service.</p>
  <p>Could you take a quick minute to leave us a review?</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${reviewUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
      Leave a Review
    </a>
  </div>
  <p>Thank you for choosing ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}!</p>
  <p>Best regards,<br>${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} Team</p>
</div>
`;

export const bookingConfirmationTemplate = (name: string, bookingRef: string, carModel: string, pickupDate: string, dropoffDate: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #0D9B84; padding: 20px; text-align: center;">
    <h2 style="color: white; margin: 0;">Booking Confirmed!</h2>
  </div>
  <div style="padding: 20px; background-color: #f9f9f9;">
    <p>Hi ${name},</p>
    <p>Thank you for choosing ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}. Your booking has been successfully received.</p>
    
    <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
      <h3 style="margin-top: 0; color: #1A4D5C;">Booking Details</h3>
      <p><strong>Reference:</strong> ${bookingRef}</p>
      <p><strong>Vehicle:</strong> ${carModel}</p>
      <p><strong>Pickup Date:</strong> ${pickupDate}</p>
      <p><strong>Drop-off Date:</strong> ${dropoffDate}</p>
    </div>
    
    <p>If you have any questions or need to make changes, please reply to this email or contact our support team.</p>
    <p>We look forward to seeing you!</p>
    <p>Best regards,<br><strong>${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} Team</strong></p>
  </div>
</div>
`;

export const adminBookingNotificationTemplate = (bookingRef: string, customerName: string, customerEmail: string, customerPhone: string, carModel: string, pickupDate: string, dropoffDate: string, totalPrice: number) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #1A4D5C; padding: 20px; text-align: center;">
    <h2 style="color: white; margin: 0;">New Booking Alert 🚨</h2>
  </div>
  <div style="padding: 20px; background-color: #f9f9f9;">
    <p>A new booking has just been created on ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}.</p>
    
    <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
      <h3 style="margin-top: 0; color: #1A4D5C;">Booking Reference: ${bookingRef}</h3>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
      <p><strong>Vehicle:</strong> ${carModel}</p>
      <p><strong>Pickup:</strong> ${pickupDate}</p>
      <p><strong>Drop-off:</strong> ${dropoffDate}</p>
      <p><strong>Total Price:</strong> MUR ${totalPrice.toLocaleString()}</p>
    </div>
    
    <p>Log in to your admin dashboard to view the full details.</p>
  </div>
</div>
`;
