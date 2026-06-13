"use server"

import db from '@/src/lib/db'

export async function verifyBookingAccess(bookingRef: string, email: string) {
  if (!bookingRef || !email) throw new Error("Please provide both Booking Reference and Email.")
  
  const booking = await db.booking.findFirst({
    where: {
      bookingRef,
      driverEmail: email,
    },
    select: { id: true, status: true }
  })

  if (!booking) {
    throw new Error("No booking found instantly matching this Reference and Email combination.")
  }

  // Prevent managing cancelled/completed bookings? Let them view it at least, but maybe state is handled in UI.
  return booking.id
}

export async function submitCancellationRequest(bookingId: string) {
  const booking = await db.booking.findUnique({ where: { id: bookingId }, select: { pickupDate: true, status: true } })
  if (!booking) throw new Error("Booking not found")

  const pickup = new Date(booking.pickupDate)
  const now = new Date()
  const hoursUntilPickup = (pickup.getTime() - now.getTime()) / (1000 * 60 * 60)

  let penaltyApplied = false
  if (hoursUntilPickup < 48 && hoursUntilPickup > 0) {
    penaltyApplied = true
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' }
  })

  return { success: true, penaltyApplied }
}

export async function submitModificationRequest(bookingId: string, modifications: { pickupDate: string, returnDate: string, notes: string }) {
  const booking = await db.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error("Booking not found")

  const newNotes = `[MODIFICATION REQUEST from Customer]:
Requested Pickup: ${modifications.pickupDate}
Requested Return: ${modifications.returnDate}
Customer Notes: ${modifications.notes}
${booking.internalNotes ? '\n---\n' + booking.internalNotes : ''}`

  await db.booking.update({
    where: { id: bookingId },
    data: {
      internalNotes: newNotes.substring(0, 5000),
    }
  })

  return { success: true }
}
