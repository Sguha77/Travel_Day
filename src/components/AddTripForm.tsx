import React, { useState } from 'react';
import { EventType, TransitPreference } from '../types';
import { Plane, Train, Car, Bus, Footprints, Sparkles, ArrowRight, Check } from 'lucide-react';

interface AddTripFormProps {
  onSubmitTrip: (params: {
    origin: string;
    destination: string;
    eventType: EventType;
    identifier: string;
    departureTime: string;
    transitPreference: TransitPreference;
    baggageDrop: boolean;
    tsaPrecheck: boolean;
  }) => void;
}

export const AddTripForm: React.FC<AddTripFormProps> = ({ onSubmitTrip }) => {
  const [origin, setOrigin] = useState('San Francisco, CA');
  const [destination, setDestination] = useState('JFK Airport, NY');
  const [eventType, setEventType] = useState<EventType>('flight');
  const [identifier, setIdentifier] = useState('UA 123');
  const [departureTime, setDepartureTime] = useState('11:00');
  const [transitPreference, setTransitPreference] = useState<TransitPreference>('rideshare');
  const [baggageDrop, setBaggageDrop] = useState(true);
  const [tsaPrecheck, setTsaPrecheck] = useState(true);

  // AI Paste/Parse state
  const [aiText, setAiText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleAiParse = async () => {
    if (!aiText.trim()) return;
    setIsParsing(true);
    setParseError(null);

    try {
      const res = await fetch('/api/parse-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      });
      const data = await res.json();
      
      if (data.origin) setOrigin(data.origin);
      if (data.destination) setDestination(data.destination);
      if (data.eventType) setEventType(data.eventType as EventType);
      if (data.identifier) setIdentifier(data.identifier);
      if (data.departureTime) setDepartureTime(data.departureTime);
      if (data.transitPreference) setTransitPreference(data.transitPreference as TransitPreference);
      if (typeof data.baggageDrop === 'boolean') setBaggageDrop(data.baggageDrop);
      if (typeof data.tsaPrecheck === 'boolean') setTsaPrecheck(data.tsaPrecheck);
    } catch (err: any) {
      console.error(err);
      setParseError('Could not auto-parse text. Please fill in the details manually.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !identifier) return;

    onSubmitTrip({
      origin,
      destination,
      eventType,
      identifier,
      departureTime,
      transitPreference,
      baggageDrop,
      tsaPrecheck,
    });
  };

  return (
    <main className="pt-20 pb-24 px-4 max-w-xl mx-auto flex flex-col gap-6">
      {/* Form Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-[#1b1b1d] dark:text-[#f3f0f2]">
          Plan Your Journey
        </h2>
        <p className="text-sm text-[#414755] dark:text-[#c1c6d7]">
          Enter your travel details to generate a timeline.
        </p>
      </div>

      {/* AI Smart Import Box */}
      <div className="bg-[#f0edef] dark:bg-[#2f2f32] border border-[#c1c6d7] dark:border-[#414755] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0058bc] dark:text-[#adc6ff]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0058bc] dark:text-[#adc6ff]">
            AI Instant Import
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            placeholder="Paste flight confirmation text or e.g. United UA 450 from SFO to JFK at 9:15 AM..."
            className="flex-1 bg-white dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-lg p-2 text-xs text-[#1b1b1d] dark:text-[#f3f0f2] focus:outline-none focus:border-[#0058bc]"
          />
          <button
            type="button"
            onClick={handleAiParse}
            disabled={isParsing || !aiText.trim()}
            className="px-3 py-2 bg-[#0058bc] text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1"
          >
            {isParsing ? 'Parsing...' : 'Auto-Fill'}
          </button>
        </div>
        {parseError && <p className="text-[11px] text-[#ba1a1a]">{parseError}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Location Section */}
        <section className="flex flex-col gap-3 bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl p-4 shadow-2xs">
          <div className="relative bg-[#f6f3f5] dark:bg-[#28282a] border border-[#c1c6d7] dark:border-[#414755] rounded-lg p-3 focus-within:border-[#0058bc] transition-colors">
            <label className="block text-[11px] font-bold text-[#414755] dark:text-[#c1c6d7] mb-1 uppercase tracking-wider">
              Origin
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter your home address"
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-base font-medium text-[#1b1b1d] dark:text-[#f3f0f2] placeholder-[#717786]"
              required
            />
          </div>

          <div className="relative bg-[#f6f3f5] dark:bg-[#28282a] border border-[#c1c6d7] dark:border-[#414755] rounded-lg p-3 focus-within:border-[#0058bc] transition-colors">
            <label className="block text-[11px] font-bold text-[#414755] dark:text-[#c1c6d7] mb-1 uppercase tracking-wider">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., JFK Airport"
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-base font-medium text-[#1b1b1d] dark:text-[#f3f0f2] placeholder-[#717786]"
              required
            />
          </div>
        </section>

        {/* Event Details Section */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#414755] dark:text-[#c1c6d7] uppercase tracking-wider pl-1">
            Main Event
          </h3>

          <div className="flex p-1 bg-[#eae7ea] dark:bg-[#2f2f32] rounded-xl border border-[#c1c6d7] dark:border-[#414755]">
            <button
              type="button"
              onClick={() => setEventType('flight')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                eventType === 'flight'
                  ? 'bg-[#0058bc] text-white shadow-xs'
                  : 'text-[#414755] dark:text-[#c1c6d7] hover:bg-[#f0edef] dark:hover:bg-[#3a3a3e]'
              }`}
            >
              <span className="material-symbols-outlined text-base">flight</span>
              <span>Flight</span>
            </button>

            <button
              type="button"
              onClick={() => setEventType('train')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                eventType === 'train'
                  ? 'bg-[#0058bc] text-white shadow-xs'
                  : 'text-[#414755] dark:text-[#c1c6d7] hover:bg-[#f0edef] dark:hover:bg-[#3a3a3e]'
              }`}
            >
              <span className="material-symbols-outlined text-base">train</span>
              <span>Train</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="relative bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-lg p-3 focus-within:border-[#0058bc] transition-colors">
              <label className="block text-[11px] font-bold text-[#414755] dark:text-[#c1c6d7] mb-1 uppercase tracking-wider">
                Identifier
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., UA 123"
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-base font-medium text-[#1b1b1d] dark:text-[#f3f0f2]"
                required
              />
            </div>

            <div className="relative bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-lg p-3 focus-within:border-[#0058bc] transition-colors">
              <label className="block text-[11px] font-bold text-[#414755] dark:text-[#c1c6d7] mb-1 uppercase tracking-wider">
                Departure
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-base font-medium text-[#1b1b1d] dark:text-[#f3f0f2]"
                required
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#414755] dark:text-[#c1c6d7] uppercase tracking-wider pl-1">
            Transit & Preferences
          </h3>

          <div className="bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl overflow-hidden flex divide-x divide-[#c1c6d7] dark:divide-[#414755]">
            <button
              type="button"
              onClick={() => setTransitPreference('drive')}
              className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${
                transitPreference === 'drive'
                  ? 'bg-[#adc6ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff] font-bold'
                  : 'text-[#414755] dark:text-[#c1c6d7] hover:bg-[#f6f3f5] dark:hover:bg-[#28282a]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">directions_car</span>
              <span className="text-[10px] font-bold uppercase">Drive</span>
            </button>

            <button
              type="button"
              onClick={() => setTransitPreference('rideshare')}
              className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${
                transitPreference === 'rideshare'
                  ? 'bg-[#adc6ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff] font-bold'
                  : 'text-[#414755] dark:text-[#c1c6d7] hover:bg-[#f6f3f5] dark:hover:bg-[#28282a]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">local_taxi</span>
              <span className="text-[10px] font-bold uppercase">Rideshare</span>
            </button>

            <button
              type="button"
              onClick={() => setTransitPreference('transit')}
              className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${
                transitPreference === 'transit'
                  ? 'bg-[#adc6ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff] font-bold'
                  : 'text-[#414755] dark:text-[#c1c6d7] hover:bg-[#f6f3f5] dark:hover:bg-[#28282a]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">directions_transit</span>
              <span className="text-[10px] font-bold uppercase">Transit</span>
            </button>

            <button
              type="button"
              onClick={() => setTransitPreference('walk')}
              className={`flex-1 py-3.5 flex flex-col items-center gap-1 transition-colors ${
                transitPreference === 'walk'
                  ? 'bg-[#adc6ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff] font-bold'
                  : 'text-[#414755] dark:text-[#c1c6d7] hover:bg-[#f6f3f5] dark:hover:bg-[#28282a]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">directions_walk</span>
              <span className="text-[10px] font-bold uppercase">Walk</span>
            </button>
          </div>

          {/* Toggle Switches matching Stitch mockup */}
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between p-3.5 bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#414755] dark:text-[#c1c6d7]">luggage</span>
                <span className="text-sm font-medium text-[#1b1b1d] dark:text-[#f3f0f2]">Baggage Drop Required</span>
              </div>
              <button
                type="button"
                onClick={() => setBaggageDrop(!baggageDrop)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  baggageDrop ? 'bg-[#0058bc]' : 'bg-[#e4e2e4] dark:bg-[#414755]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    baggageDrop ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#414755] dark:text-[#c1c6d7]">security</span>
                <span className="text-sm font-medium text-[#1b1b1d] dark:text-[#f3f0f2]">TSA PreCheck / Fast Track</span>
              </div>
              <button
                type="button"
                onClick={() => setTsaPrecheck(!tsaPrecheck)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  tsaPrecheck ? 'bg-[#0058bc]' : 'bg-[#e4e2e4] dark:bg-[#414755]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    tsaPrecheck ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full bg-[#0058bc] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm mt-2"
        >
          <span>Generate My Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
};
