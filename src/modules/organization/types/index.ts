/**
 * Organization module types
 */

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: 'admin' | 'manager' | 'member';
  joinedAt: string;
}
