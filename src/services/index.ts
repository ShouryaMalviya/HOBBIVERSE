/**
 * Hobbiverse Repository & Service Layer
 * Abstracts data storage between local demo mode and remote providers.
 */

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  isDemo: boolean;
}
