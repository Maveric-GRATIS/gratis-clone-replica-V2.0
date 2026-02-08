// src/middleware/maintenance.ts
// Maintenance Mode Middleware

import { platformConfigService } from '@/lib/config/platform-config-service';

/**
 * Check if the platform is in maintenance mode
 * Returns true if in maintenance, false otherwise
 */
export async function checkMaintenanceMode(ipAddress?: string, userIsAdmin?: boolean): Promise<boolean> {
  // Admins can always access during maintenance
  if (userIsAdmin) {
    return false;
  }

  return await platformConfigService.isMaintenanceMode(ipAddress);
}

/**
 * Maintenance page redirect helper
 */
export function getMaintenanceRedirect(): string {
  return '/maintenance';
}
