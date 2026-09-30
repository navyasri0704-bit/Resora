import { Booking, Resource, User, WaitlistEntry, BookingStatus } from '@/types';
import { INITIAL_BOOKINGS, MOCK_RESOURCES } from '@/lib/mockData';
import { getAllResources, getResourceById } from '../resources/resourceService';
import { getActiveMaintenanceWindows } from '../maintenance/maintenanceService';

let memoryBookings: Booking[] = [...INITIAL_BOOKINGS];
let memoryWaitlist: WaitlistEntry[] = [];

export interface BookingValidationResult {
  valid: boolean;
  error?: string;
  conflictReason?: string;
  unmetDependency?: string;
  suggestedAlternatives?: Resource[];
}

export async function validateBookingRequest(params: {
  resourceId: string;
  userId: string;
  userRole: User['role'];
  date: string;
  startTime: string;
  endTime: string;
  numberOfStudents?: number;
}): Promise<BookingValidationResult> {
  const { resourceId, userRole, date, startTime, endTime, numberOfStudents = 1 } = params;

  // 1. Resource exists check
  const resource = await getResourceById(resourceId);
  if (!resource) {
    return { valid: false, error: 'Resource does not exist.' };
  }

  // 2. User permission check
  if (resource.allowedRoles && !resource.allowedRoles.includes(userRole)) {
    return { valid: false, error: `Users with role '${userRole}' are not authorized to book this resource.` };
  }

  // 3. Date check
  if (!date) {
    return { valid: false, error: 'Please select a valid booking date.' };
  }

  // 4. Start < End check
  if (startTime >= endTime) {
    return { valid: false, error: 'Start time must be strictly earlier than end time.' };
  }

  // 5. Capacity check
  if (numberOfStudents > resource.capacity) {
    return {
      valid: false,
      error: `Requested capacity (${numberOfStudents} students) exceeds maximum capacity of ${resource.capacity} for ${resource.name}.`,
    };
  }

  // 6. Maintenance check on main resource
  if (resource.status === 'MAINTENANCE') {
    const alternatives = await findSmartAlternatives(resource, date, startTime, endTime, numberOfStudents);
    return {
      valid: false,
      error: `${resource.name} is currently under maintenance.`,
      conflictReason: 'Resource Under Repair',
      suggestedAlternatives: alternatives,
    };
  }

  // 7. Active Maintenance Windows check
  const activeMaintenance = await getActiveMaintenanceWindows();
  const resMaintenance = activeMaintenance.find(m => m.resourceId === resourceId);
  if (resMaintenance) {
    const alternatives = await findSmartAlternatives(resource, date, startTime, endTime, numberOfStudents);
    return {
      valid: false,
      error: `${resource.name} is scheduled for maintenance: ${resMaintenance.reason}`,
      conflictReason: 'Scheduled Maintenance',
      suggestedAlternatives: alternatives,
    };
  }

  // 8. Dependency Graph Check (Atomic Multi-Resource validation)
  const allResources = await getAllResources();
  if (resource.requiredDependencies && resource.requiredDependencies.length > 0) {
    for (const depName of resource.requiredDependencies) {
      const depResource = allResources.find(r => r.name.toLowerCase().includes(depName.toLowerCase()));
      if (depResource) {
        if (depResource.status === 'MAINTENANCE') {
          const alternatives = await findSmartAlternatives(resource, date, startTime, endTime, numberOfStudents);
          return {
            valid: false,
            error: `Required dependency '${depResource.name}' is currently under maintenance.`,
            unmetDependency: depResource.name,
            suggestedAlternatives: alternatives,
          };
        }

        const depMaintenance = activeMaintenance.find(m => m.resourceId === depResource.id);
        if (depMaintenance) {
          const alternatives = await findSmartAlternatives(resource, date, startTime, endTime, numberOfStudents);
          return {
            valid: false,
            error: `Required dependency '${depResource.name}' is under maintenance (${depMaintenance.reason}).`,
            unmetDependency: depResource.name,
            suggestedAlternatives: alternatives,
          };
        }
      }
    }
  }

  // 9. Overlapping Bookings Check (Conflict detection)
  const conflictingBooking = memoryBookings.find(b => {
    if (b.resourceId !== resourceId) return false;
    if (b.date !== date) return false;
    if (['REJECTED', 'CANCELLED', 'NO_SHOW'].includes(b.status)) return false;

    // Time overlap check: start1 < end2 && start2 < end1
    return startTime < b.endTime && b.startTime < endTime;
  });

  if (conflictingBooking) {
    const alternatives = await findSmartAlternatives(resource, date, startTime, endTime, numberOfStudents);
    return {
      valid: false,
      error: `${resource.name} is already booked from ${conflictingBooking.startTime} to ${conflictingBooking.endTime} on ${date}.`,
      conflictReason: `Time Conflict with Booking #${conflictingBooking.bookingCode}`,
      suggestedAlternatives: alternatives,
    };
  }

  return { valid: true };
}

export async function findSmartAlternatives(
  targetResource: Resource,
  date: string,
  startTime: string,
  endTime: string,
  capacityRequired: number
): Promise<Resource[]> {
  const allResources = await getAllResources();
  
  return allResources.filter(r => {
    if (r.id === targetResource.id) return false;
    if (r.status === 'MAINTENANCE') return false;
    if (r.capacity < capacityRequired) return false;

    // Check availability
    const hasConflict = memoryBookings.some(b => {
      if (b.resourceId !== r.id || b.date !== date) return false;
      if (['REJECTED', 'CANCELLED', 'NO_SHOW'].includes(b.status)) return false;
      return startTime < b.endTime && b.startTime < endTime;
    });

    return !hasConflict;
  }).slice(0, 3);
}

export async function createBookingService(params: {
  userId: string;
  userName: string;
  userRole: User['role'];
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: 'Class' | 'Project' | 'Research' | 'Hackathon' | 'Other';
  additionalItems?: string[];
  numberOfStudents?: number;
}): Promise<{ success: boolean; booking?: Booking; error?: string; alternatives?: Resource[] }> {
  const validation = await validateBookingRequest(params);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      alternatives: validation.suggestedAlternatives,
    };
  }

  const resource = await getResourceById(params.resourceId);
  if (!resource) return { success: false, error: 'Resource not found' };

  const bookingCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
  const needsFacultyApproval = params.userRole === 'STUDENT';

  const newBooking: Booking = {
    id: `bkg_${Date.now()}`,
    bookingCode,
    userId: params.userId,
    userName: params.userName,
    userRole: params.userRole,
    resourceId: params.resourceId,
    resourceName: resource.name,
    resourceType: resource.type,
    location: `${resource.building} · ${resource.floor}`,
    date: params.date,
    startTime: params.startTime,
    endTime: params.endTime,
    purpose: params.purpose,
    status: needsFacultyApproval ? 'PENDING' : 'APPROVED',
    requestedAt: new Date().toLocaleString(),
    additionalItems: params.additionalItems || [],
    qrCodeUrl: needsFacultyApproval ? undefined : `${bookingCode}-${params.userId}-${resource.name.replace(/\s+/g, '-').toUpperCase()}`,
    approvalStep: needsFacultyApproval ? 'Faculty' : 'Approved',
  };

  memoryBookings = [newBooking, ...memoryBookings];
  return { success: true, booking: newBooking };
}

export async function getAllBookings(): Promise<Booking[]> {
  return memoryBookings;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  noteOrReason?: string
): Promise<Booking | undefined> {
  const index = memoryBookings.findIndex(b => b.id === bookingId);
  if (index === -1) return undefined;

  const target = memoryBookings[index];
  const updated: Booking = {
    ...target,
    status,
    approvalStep: status === 'APPROVED' ? 'Approved' : target.approvalStep,
    qrCodeUrl: status === 'APPROVED' ? `${target.bookingCode}-${target.userId}-${target.resourceName.replace(/\s+/g, '-').toUpperCase()}` : target.qrCodeUrl,
    rejectionReason: status === 'REJECTED' ? noteOrReason : target.rejectionReason,
    requestChangesNote: status === 'CHANGES_REQUESTED' ? noteOrReason : target.requestChangesNote,
  };

  memoryBookings[index] = updated;

  // Process waitlist if booking was cancelled or rejected
  if (['CANCELLED', 'REJECTED', 'NO_SHOW'].includes(status)) {
    await processWaitlistForResource(target.resourceId, target.date, target.startTime, target.endTime);
  }

  return updated;
}

export async function joinWaitlistService(params: {
  resourceId: string;
  userId: string;
  userName: string;
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
}): Promise<WaitlistEntry> {
  const resource = await getResourceById(params.resourceId);
  const position = memoryWaitlist.filter(w => w.resourceId === params.resourceId && w.requestedDate === params.requestedDate).length + 1;

  const entry: WaitlistEntry = {
    id: `wt_${Date.now()}`,
    resourceId: params.resourceId,
    resourceName: resource ? resource.name : 'Campus Resource',
    userId: params.userId,
    userName: params.userName,
    requestedDate: params.requestedDate,
    requestedStartTime: params.requestedStartTime,
    requestedEndTime: params.requestedEndTime,
    position,
    createdAt: new Date().toISOString(),
  };

  memoryWaitlist.push(entry);
  return entry;
}

export async function getWaitlist(): Promise<WaitlistEntry[]> {
  return memoryWaitlist;
}

export async function processWaitlistForResource(resourceId: string, date: string, startTime: string, endTime: string) {
  const nextCandidate = memoryWaitlist.find(w => w.resourceId === resourceId && w.requestedDate === date);
  if (nextCandidate) {
    memoryWaitlist = memoryWaitlist.filter(w => w.id !== nextCandidate.id);
  }
}
