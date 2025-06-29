
export interface Participant {
  id: string;
  name: string;
  interest: 'interested' | 'confirmed';
  payment: 'paid' | 'unpaid';
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  location: string;
  cost: number;
  description: string;
  minParticipants: number;
  maxParticipants: number;
  participants: Participant[];
}

export type TripStatus = 'confirmed' | 'pending';
