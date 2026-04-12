import type { Staff } from '@/types/calendar';

export function getStaffDisplayName(staff?: Staff): string {
  if (!staff) return 'Staff';

  const firstName = staff.firstName?.trim() || staff.shortName?.trim() || '';
  const lastInitial = staff.lastName?.trim()?.[0]?.toUpperCase() ?? '';

  if (!firstName) return 'Staff';

  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}

export function getStaffSummary(staffList: Staff[]): string {
  const first = staffList[0];

  if (!first) return '';

  const base = getStaffDisplayName(first);

  if (staffList.length === 1) return base;

  return `${base} (+${staffList.length - 1} more)`;
}

export function getVisibleStaff<T>(list: T[], max = 3): T[] {
  return list.slice(0, max);
}

export function getRemainingStaffCount(total: number, visible: number): number {
  return Math.max(total - visible, 0);
}
