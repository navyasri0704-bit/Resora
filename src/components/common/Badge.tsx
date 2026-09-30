import React from 'react';
import { ResourceStatus, BookingStatus, Priority, IssueStatus } from '@/types';

interface BadgeProps {
  status: ResourceStatus | BookingStatus | Priority | IssueStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const s = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (s === 'AVAILABLE' || s === 'APPROVED' || s === 'COMPLETED' || s === 'RESOLVED') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (s === 'PENDING' || s === 'IN_REPAIR' || s === 'SCHEDULED' || s === 'MEDIUM') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (s === 'MAINTENANCE' || s === 'REJECTED' || s === 'HIGH' || s === 'CRITICAL' || s === 'NO_SHOW') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (s === 'IN_USE' || s === 'BOOKED') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
