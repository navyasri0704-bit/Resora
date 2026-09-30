import { Booking } from '@/types';
import { updateBookingStatus } from '../bookings/bookingService';

export async function approveBookingAction(bookingId: string, notes?: string): Promise<Booking | undefined> {
  return updateBookingStatus(bookingId, 'APPROVED', notes);
}

export async function rejectBookingAction(bookingId: string, reason?: string): Promise<Booking | undefined> {
  return updateBookingStatus(bookingId, 'REJECTED', reason);
}

export async function requestChangesBookingAction(bookingId: string, commentNote: string): Promise<Booking | undefined> {
  return updateBookingStatus(bookingId, 'CHANGES_REQUESTED', commentNote);
}
