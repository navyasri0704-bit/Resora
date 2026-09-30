import { getAllResources } from '../resources/resourceService';
import { getAllBookings } from '../bookings/bookingService';
import { getAllIssues } from '../maintenance/maintenanceService';

export interface CommandCenterMetrics {
  totalResources: number;
  availableResources: number;
  inUseResources: number;
  pendingApprovals: number;
  underMaintenance: number;
  todayCheckIns: number;
  noShows: number;
  utilizationPercentage: number;
  aiActionableInsights: string[];
}

export async function getCommandCenterAnalytics(): Promise<CommandCenterMetrics> {
  const resources = await getAllResources();
  const bookings = await getAllBookings();
  const issues = await getAllIssues();

  const totalResources = resources.length;
  const availableResources = resources.filter(r => r.status === 'AVAILABLE').length;
  const inUseResources = resources.filter(r => r.status === 'IN_USE' || r.status === 'BOOKED').length;
  const underMaintenance = resources.filter(r => r.status === 'MAINTENANCE').length;
  const pendingApprovals = bookings.filter(b => b.status === 'PENDING').length;
  const todayCheckIns = bookings.filter(b => b.status === 'CHECKED_IN').length;
  const noShows = bookings.filter(b => b.status === 'NO_SHOW').length;

  const utilizationPercentage = totalResources > 0 ? Math.round((inUseResources / totalResources) * 100) : 0;

  const aiActionableInsights = [
    'Seminar Hall A utilization drops below 25% on Tuesdays from 2 PM to 5 PM. Consider opening slots for hackathon team practice.',
    'Robotics & AI Lab demand peaks on Wednesdays (88% occupancy). Automatic waitlist auto-assignment active.',
    'Projector #07 reported 2 maintenance incidents in the last 14 days. Scheduled for hardware replacement cycle.',
    'IoT Lab equipment bundle bookings increased by 42% this week for Smart Agriculture IoT projects.',
  ];

  return {
    totalResources,
    availableResources,
    inUseResources,
    pendingApprovals,
    underMaintenance,
    todayCheckIns,
    noShows,
    utilizationPercentage,
    aiActionableInsights,
  };
}
