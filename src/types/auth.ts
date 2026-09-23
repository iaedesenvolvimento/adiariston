export const adminProfileValues = [
  "Admin",
  "Leadership",
  "Reception",
  "Intercessor",
  "Editor",
] as const;

export type AdminProfile =
  (typeof adminProfileValues)[number];

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string | null;
  profiles: AdminProfile[];
}
