export type Category = 'yemek' | 'tatlı' | 'kafe' | 'bar';

export interface Venue {
  id: string;
  name: string;
  district: string | null;
  category: Category | null;
  tags: string[];
  isCustom?: boolean;

  // Google Places (optional)
  placeId?: string | null;
  rating?: number | null;
  priceLevel?: number | null;
  photoUrl?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
}

export type UserRole = 'guest' | 'admin';

export interface AuthSession {
  role: UserRole;
  isAdmin: boolean;
}

