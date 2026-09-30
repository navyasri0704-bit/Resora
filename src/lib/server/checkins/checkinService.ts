import { Booking } from '@/types';
import { getAllBookings, updateBookingStatus } from '../bookings/bookingService';

export interface CheckInRecord {
  id: string;
  bookingId: string;
  bookingCode: string;
  userId: string;
  scannedAt: string;
}

let memoryCheckIns: CheckInRecord[] = [];

export async function processQRCheckIn(bookingCodeInput: string): Promise<{
  success: boolean;
  message: string;
  booking?: Booking;
}> {
  const codeClean = bookingCodeInput.trim().toUpperCase();
  const bookings = await getAllBookings();

  const booking = bookings.find(
    b => b.bookingCode.toUpperCase() === codeClean || (b.qrCodeUrl && b.qrCodeUrl.toUpperCase().includes(codeClean))
  );

  if (!booking) {
    return {
      success: false,
      message: `Invalid Check-in Pass: Booking code '${codeClean}' was not found in the system registry.`,
    };
  }

  if (booking.status === 'CHECKED_IN') {
    return {
      success: true,
      message: `User is already checked in for ${booking.resourceName} (${booking.bookingCode}). Access granted!`,
      booking,
    };
  }

  if (booking.status === 'COMPLETED') {
    return {
      success: false,
      message: `Booking #${booking.bookingCode} is already completed.`,
      booking,
    };
  }

  if (booking.status !== 'APPROVED') {
    return {
      success: false,
      message: `Check-in Failed: Booking status is currently '${booking.status}'. Only APPROVED bookings can check in.`,
      booking,
    };
  }

  // Update status to CHECKED_IN
  const updatedBooking = await updateBookingStatus(booking.id, 'CHECKED_IN');
  const record: CheckInRecord = {
    id: `chk_${Date.now()}`,
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    userId: booking.userId,
    scannedAt: new Date().toLocaleString(),
  };

  memoryCheckIns.push(record);

  return {
    success: true,
    message: `Check-in Successful! Welcome to ${booking.resourceName}. Access Pass Verified.`,
    booking: updatedBooking || booking,
  };
}

export async function getAllCheckIns(): Promise<CheckInRecord[]> {
  return memoryCheckIns;
}
