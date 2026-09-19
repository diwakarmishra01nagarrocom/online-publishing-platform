export type UserRole = 'reader' | 'writer';

export interface AppUser {

  uid: string;

  name: string;

  email: string;

  photoUrl: string;

  role: UserRole;

  // Mainly used for writer profile
  bio: string;

  createdAt?: Date;
}