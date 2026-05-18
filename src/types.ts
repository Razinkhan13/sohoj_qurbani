export interface Partner {
  id: string;
  name: string;
  area: string;
  presentAddress: string;
  profession: string;
  incomeSource: string;
  budget: number;
  budgetStr: string;
  animal: string;
  isHalalCertified: boolean;
  trustScore: number;
}

export interface Haat {
  id: string;
  name: string;
  area: string;
  district: string;
  lat: number;
  lng: number;
  /** Day-of-week indices: 0=Sun … 6=Sat */
  days: number[];
  openTime: string;  // "06:00"
  closeTime: string; // "21:00"
  animalTypes: string[];
  description: string;
  isEidSpecial: boolean;
  phone?: string;
  capacity?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

export type AuthMethod = 'email' | 'whatsapp';
