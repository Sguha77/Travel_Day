import { Trip, TimelineStep, EventType, TransitPreference } from '../types';

export function generateTimelineForTrip(
  origin: string,
  destination: string,
  eventType: EventType,
  identifier: string,
  departureTime: string,
  transitPreference: TransitPreference,
  baggageDrop: boolean,
  tsaPrecheck: boolean
): Trip {
  const originCode = inferCode(origin);
  const destinationCode = inferCode(destination);
  
  // Calculate time buffers
  const [depHour, depMinute] = departureTime.split(':').map(Number);
  const depTotalMin = depHour * 60 + depMinute;

  // Boarding is typically 45 mins prior to flight, 20 mins prior to train
  const boardingBuffer = eventType === 'flight' ? 45 : 20;
  const boardingTotalMin = Math.max(0, depTotalMin - boardingBuffer);
  const boardingTime = formatMinutes(boardingTotalMin);

  // Baggage cutoff is 60 mins prior to flight
  const baggageBuffer = eventType === 'flight' ? 60 : 30;
  const baggageTotalMin = Math.max(0, depTotalMin - baggageBuffer);
  const baggageDropCutoff = formatMinutes(baggageTotalMin);

  // Transit duration estimation
  const transitMin = transitPreference === 'drive' ? 30 : transitPreference === 'rideshare' ? 25 : transitPreference === 'transit' ? 45 : 60;

  // Leave time = boarding - security - transit
  const securityMin = tsaPrecheck ? 15 : 35;
  const leaveTotalMin = Math.max(0, boardingTotalMin - securityMin - transitMin);
  const leaveTime = formatMinutes(leaveTotalMin);

  const durationStr = eventType === 'flight' ? '4h 15m' : '2h 30m';
  const arrivalTotalMin = (depTotalMin + (eventType === 'flight' ? 255 : 150)) % (24 * 60);
  const arrivalTime = formatMinutes(arrivalTotalMin);

  const steps: TimelineStep[] = [
    {
      id: 'step-0',
      type: 'weather',
      title: '74°F Mostly Sunny',
      subtitle: `${origin} • Favorable conditions`,
      status: 'completed',
      icon: 'partly_cloudy_day',
    },
    {
      id: 'step-1',
      type: 'alert',
      title: 'Leave Now',
      subtitle: `Leave by ${leaveTime} to reach ${destination} on time for departure.`,
      detail: `Calculated with ${transitMin}m ${transitPreference} + ${securityMin}m ${tsaPrecheck ? 'TSA PreCheck' : 'Standard Security'} buffer.`,
      status: 'urgent',
      icon: 'warning',
      badge: 'Calculated Buffer',
      badgeType: 'error',
    },
    {
      id: 'step-2',
      type: 'transit',
      title: `${transitMin} min ${transitPreference.toUpperCase()}`,
      subtitle: `To ${destination} Departure Terminal`,
      status: 'active',
      icon: transitPreference === 'drive' ? 'directions_car' : transitPreference === 'rideshare' ? 'local_taxi' : transitPreference === 'transit' ? 'directions_transit' : 'directions_walk',
      actionText: 'Get Directions',
      actionType: 'directions',
    },
  ];

  if (baggageDrop) {
    steps.push({
      id: 'step-3',
      type: 'checkin',
      title: `Baggage drop closes ${baggageDropCutoff}`,
      subtitle: 'Main Terminal Counter • Have ID and passport ready',
      status: 'upcoming',
      icon: 'luggage',
      badge: tsaPrecheck ? 'TSA PreCheck' : 'Baggage Line',
      badgeType: tsaPrecheck ? 'tertiary' : 'outline',
    });
  }

  steps.push(
    {
      id: 'step-4',
      type: 'boarding',
      title: `Boarding ${boardingTime}`,
      subtitle: `${eventType === 'flight' ? 'Group 2' : 'Platform gate'} • Door closes 15m prior`,
      status: 'upcoming',
      icon: eventType === 'flight' ? 'door_open' : 'train',
      badge: eventType === 'flight' ? 'Gate B22' : 'Platform 3',
      badgeType: 'primary',
    },
    {
      id: 'step-5',
      type: 'journey',
      title: `${eventType === 'flight' ? 'Flight' : 'Train'} ${identifier}`,
      subtitle: `${departureTime} ${originCode} ➔ ${arrivalTime} ${destinationCode} (${durationStr})`,
      status: 'upcoming',
      icon: eventType === 'flight' ? 'flight_takeoff' : 'train',
      badge: 'On Time',
      badgeType: 'tertiary',
      actionText: 'View Pass',
      actionType: 'boarding_pass',
    },
    {
      id: 'step-6',
      type: 'arrival',
      title: 'Arrival & Baggage Claim',
      subtitle: `${destinationCode} • Follow airport signs on arrival`,
      status: 'upcoming',
      icon: 'luggage',
    }
  );

  return {
    id: `trip-${Date.now()}`,
    passengerName: 'Alex Morgan',
    origin,
    destination,
    originCode,
    destinationCode,
    eventType,
    identifier,
    airline: eventType === 'flight' ? 'Global Airways' : 'Express Rail',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime,
    arrivalTime,
    duration: durationStr,
    terminal: 'Terminal 1',
    gate: eventType === 'flight' ? 'Gate B22' : 'Platform 3',
    seat: '12A',
    boardingZone: 'Group 2',
    boardingTime,
    baggageDropCutoff,
    transitPreference,
    baggageDrop,
    tsaPrecheck,
    weatherOrigin: {
      temp: '74°F',
      condition: 'Sunny',
      city: origin.split(',')[0] || origin,
    },
    weatherDestination: {
      temp: '70°F',
      condition: 'Partly Cloudy',
      city: destination.split(',')[0] || destination,
    },
    steps,
    createdAt: Date.now(),
  };
}

function inferCode(locationStr: string): string {
  if (!locationStr) return 'DEP';
  const upper = locationStr.toUpperCase();
  if (upper.includes('SAN FRANCISCO') || upper.includes('SFO')) return 'SFO';
  if (upper.includes('NEW YORK') || upper.includes('JFK')) return 'JFK';
  if (upper.includes('LONDON') || upper.includes('ST PANCRAS') || upper.includes('LHR')) return 'LHR';
  if (upper.includes('PARIS') || upper.includes('CDG')) return 'CDG';
  if (upper.includes('LOS ANGELES') || upper.includes('LAX')) return 'LAX';
  if (upper.includes('CHICAGO') || upper.includes('ORD')) return 'ORD';
  
  // Extract 3 capital letters if present, or first 3 chars
  const words = locationStr.replace(/[^a-zA-Z]/g, ' ').trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return (words[0][0] + words[1][0] + (words[2] ? words[2][0] : words[0][1] || 'X')).toUpperCase();
}

function formatMinutes(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${period}`;
}
