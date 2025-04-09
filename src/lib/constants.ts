export const ROLES = {
  CLIENT: 'client',
  DESIGNER: 'designer',
  PROJECT_MANAGER: 'project_manager'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
