import { UserRole, User } from '@/types';
import { DEMO_USERS } from '@/lib/mockData';

export function getDemoUserByRole(role: UserRole): User {
  return DEMO_USERS[role];
}

export function validateRolePermission(
  currentRole: UserRole,
  allowedRoles: UserRole[]
): { authorized: boolean; statusCode: number; message: string } {
  if (!allowedRoles.includes(currentRole)) {
    return {
      authorized: false,
      statusCode: 403,
      message: `Forbidden: User role '${currentRole}' is unauthorized for this resource. Required: ${allowedRoles.join(', ')}`,
    };
  }
  return { authorized: true, statusCode: 200, message: 'Authorized' };
}
