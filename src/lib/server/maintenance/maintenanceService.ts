import { MaintenanceIssue } from '@/types';
import { INITIAL_ISSUES } from '@/lib/mockData';
import { updateResource } from '../resources/resourceService';

export interface MaintenanceWindow {
  id: string;
  resourceId: string;
  resourceName: string;
  reason: string;
  startTime: string;
  endTime: string;
  isResolved: boolean;
}

let memoryIssues: MaintenanceIssue[] = [...INITIAL_ISSUES];
let memoryMaintenanceWindows: MaintenanceWindow[] = [];

export async function getAllIssues(): Promise<MaintenanceIssue[]> {
  return memoryIssues;
}

export async function getActiveMaintenanceWindows(): Promise<MaintenanceWindow[]> {
  return memoryMaintenanceWindows.filter(w => !w.isResolved);
}

export async function toggleResourceMaintenance(
  resourceId: string,
  resourceName: string,
  reason: string = 'Scheduled Repair'
): Promise<{ isMaintenance: boolean }> {
  const existingWinIndex = memoryMaintenanceWindows.findIndex(w => w.resourceId === resourceId && !w.isResolved);

  if (existingWinIndex !== -1) {
    // Resolve maintenance
    memoryMaintenanceWindows[existingWinIndex].isResolved = true;
    await updateResource(resourceId, { status: 'AVAILABLE' });
    return { isMaintenance: false };
  } else {
    // Create new maintenance window
    const newWin: MaintenanceWindow = {
      id: `maint_${Date.now()}`,
      resourceId,
      resourceName,
      reason,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
      isResolved: false,
    };
    memoryMaintenanceWindows.push(newWin);
    await updateResource(resourceId, { status: 'MAINTENANCE' });
    return { isMaintenance: true };
  }
}

export async function resolveMaintenanceIssue(issueId: string): Promise<MaintenanceIssue | undefined> {
  const index = memoryIssues.findIndex(i => i.id === issueId);
  if (index === -1) return undefined;

  memoryIssues[index] = {
    ...memoryIssues[index],
    status: 'RESOLVED',
  };
  return memoryIssues[index];
}
