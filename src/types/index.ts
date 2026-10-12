/**
 * Hobbiverse Domain Types
 * Single source of truth for application models.
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
