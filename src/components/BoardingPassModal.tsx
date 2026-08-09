import React, { useState } from 'react';
import { Trip } from '../types';
import { X, QrCode, Share2, Download, Check, ShieldCheck, Plane, Train } from 'lucide-react';

interface BoardingPassModalProps {
  trip: Trip;
  onClose: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({ trip, onClose }) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Pass Header */}
        <div className="bg-[#0058bc] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
            {trip.eventType === 'flight' ? <Plane className="w-4 h-4" /> : <Train className="w-4 h-4" />}
            <span>{trip.airline || 'Travel Pass'}</span>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-3xl font-extrabold tracking-tight">{trip.originCode}</p>
              <p className="text-xs text-blue-100">{trip.origin.split(',')[0]}</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-semibold uppercase text-blue-200 mb-0.5">{trip.duration}</span>
              <div className="w-16 h-0.5 bg-blue-300 relative flex items-center justify-center">
                <span className="material-symbols-outlined text-xs bg-[#0058bc] px-1 text-blue-100">
                  {trip.eventType === 'flight' ? 'flight' : 'train'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-extrabold tracking-tight">{trip.destinationCode}</p>
              <p className="text-xs text-blue-100">{trip.destination.split(',')[0]}</p>
            </div>
          </div>
        </div>

        {/* Pass Details Grid */}
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#e4e2e4] dark:border-[#414755] pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#717786]">Passenger</p>
              <p className="text-sm font-bold text-[#1b1b1d] dark:text-[#f3f0f2]">{trip.passengerName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#717786]">{trip.eventType === 'flight' ? 'Flight No' : 'Train No'}</p>
              <p className="text-sm font-bold text-[#0058bc] dark:text-[#adc6ff]">{trip.identifier}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center bg-[#f6f3f5] dark:bg-[#28282a] p-3 rounded-xl border border-[#c1c6d7] dark:border-[#414755]">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#717786]">Gate</p>
              <p className="text-sm font-extrabold text-[#1b1b1d] dark:text-[#f3f0f2]">{trip.gate}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#717786]">Seat</p>
              <p className="text-sm font-extrabold text-[#1b1b1d] dark:text-[#f3f0f2]">{trip.seat}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#717786]">Zone</p>
              <p className="text-sm font-extrabold text-[#1b1b1d] dark:text-[#f3f0f2]">{trip.boardingZone}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-[#717786]">Boarding</p>
              <p className="text-sm font-extrabold text-[#0058bc] dark:text-[#adc6ff]">{trip.boardingTime}</p>
            </div>
          </div>

          {/* Barcode & QR Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#ffffff] dark:bg-[#1b1b1d] border border-[#c1c6d7] dark:border-[#414755] rounded-xl text-center shadow-2xs">
            {/* Simulated High Density Barcode */}
            <div className="w-full flex justify-between h-14 items-center px-2 space-x-1 mb-2 bg-white p-2 rounded">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-black h-full rounded-2xs"
                  style={{ width: `${(i % 3) + 1}px`, opacity: i % 7 === 0 ? 0.3 : 1 }}
                />
              ))}
            </div>
            <p className="text-[11px] font-mono tracking-widest text-[#717786]">
              M1{trip.passengerName.replace(' ', '/')} E{trip.identifier} {trip.originCode}{trip.destinationCode} 14A
            </p>
          </div>

          {/* TSA PreCheck / Status Badge */}
          {trip.tsaPrecheck && (
            <div className="flex items-center justify-center gap-2 py-1.5 px-3 bg-[#f7fff2] dark:bg-[#00531c]/30 text-[#006b27] dark:text-[#53e16f] rounded-lg text-xs font-bold border border-[#008733]/30">
              <ShieldCheck className="w-4 h-4" />
              <span>TSA PreCheck Verified • Fast-Track Access</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-[#0058bc] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Wallet</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save Pass</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Boarding Pass - ${trip.identifier}`,
                    text: `My ${trip.eventType} pass from ${trip.originCode} to ${trip.destinationCode} (Seat ${trip.seat}, Gate ${trip.gate}).`,
                  });
                } else {
                  alert(`Pass details copied for ${trip.identifier}`);
                }
              }}
              className="px-4 py-3 bg-[#f0edef] dark:bg-[#2f2f32] text-[#1b1b1d] dark:text-[#f3f0f2] font-bold text-xs uppercase rounded-xl hover:bg-[#e4e2e4] dark:hover:bg-[#3a3a3e] transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
