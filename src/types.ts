export type EventType = 'flight' | 'train';
export type TransitPreference = 'drive' | 'rideshare' | 'transit' | 'walk';
export type StepStatus = 'completed' | 'urgent' | 'active' | 'upcoming';
export type StepType = 'weather' | 'alert' | 'transit' | 'checkin' | 'boarding' | 'journey' | 'arrival' | 'custom';

export interface TimelineStep {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  time?: string;
  status: StepStatus;
  icon: string;
  detail?: string;
  badge?: string;
  badgeType?: 'primary' | 'tertiary' | 'error' | 'outline';
  actionText?: string;
  actionType?: 'boarding_pass' | 'directions' | 'uber' | 'complete' | 'link';
  meta?: Record<string, any>;
  isCompleted?: boolean;
}

export interface Trip {
  id: string;
  passengerName: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  eventType: EventType;
  identifier: string; // e.g., UA 123
  airline?: string;
  departureDate: string;
  departureTime: string; // HH:MM
  arrivalTime: string; // HH:MM
  duration: string; // e.g. 5h 30m
  terminal: string; // e.g. Terminal 3
  gate: string; // e.g. Gate G12
  seat: string; // e.g. 14A
  boardingZone: string; // e.g. Zone 2
  boardingTime: string; // HH:MM
  baggageDropCutoff: string; // HH:MM
  transitPreference: TransitPreference;
  baggageDrop: boolean;
  tsaPrecheck: boolean;
  weatherOrigin: {
    temp: string;
    condition: string;
    city: string;
  };
  weatherDestination: {
    temp: string;
    condition: string;
    city: string;
  };
  steps: TimelineStep[];
  createdAt: number;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
