import React, { useState } from 'react';
import { Trip, TimelineStep } from '../types';
import { Check, Clock, AlertTriangle, ExternalLink, RefreshCw, Plus, ChevronRight, Share2 } from 'lucide-react';

interface TimelineViewProps {
  trip: Trip;
  onOpenBoardingPass: () => void;
  onRecalculate: () => void;
  onToggleStepComplete: (stepId: string) => void;
  onAddCustomNote: (text: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  trip,
  onOpenBoardingPass,
  onRecalculate,
  onToggleStepComplete,
  onAddCustomNote,
}) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddCustomNote(noteText.trim());
    setNoteText('');
    setShowAddNote(false);
  };

  return (
    <div className="relative pb-24 pt-16 max-w-2xl mx-auto px-4">
      {/* Trip Header Banner */}
      <div className="bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#d8e2ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff]">
              {trip.eventType === 'flight' ? 'FLIGHT' : 'TRAIN'} {trip.identifier}
            </span>
            <span className="text-xs text-[#717786] dark:text-[#8b91a0]">
              {trip.departureDate}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1b1b1d] dark:text-[#f3f0f2] mt-1">
            {trip.originCode} ➔ {trip.destinationCode}
          </h2>
          <p className="text-xs text-[#414755] dark:text-[#c1c6d7] mt-0.5">
            {trip.origin} to {trip.destination}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onRecalculate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#c1c6d7] dark:border-[#414755] hover:bg-[#f0edef] dark:hover:bg-[#2f2f32] text-[#0058bc] dark:text-[#adc6ff] transition-all active:scale-95"
            title="Re-calculate transit and security buffers with Gemini AI"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live</span>
          </button>
          <button
            onClick={onOpenBoardingPass}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0058bc] text-white hover:opacity-90 transition-all active:scale-95"
          >
            <span>Pass</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Timeline Spine Container */}
      <div className="relative">
        {/* Vertical Timeline Connector Line */}
        <div className="absolute top-4 bottom-6 left-[32px] w-[2px] bg-[#c1c6d7] dark:bg-[#414755] z-0"></div>

        {/* Render Step Nodes */}
        <div className="space-y-4">
          {trip.steps.map((step, index) => {
            const isCompleted = step.isCompleted || step.status === 'completed';

            return (
              <div key={step.id} className="relative pl-[64px] pr-2 py-1 group">
                {/* Timeline Dot Node Indicator */}
                <button
                  onClick={() => onToggleStepComplete(step.id)}
                  title={isCompleted ? "Mark as incomplete" : "Mark step as complete"}
                  className={`absolute left-[26px] top-[18px] w-[14px] h-[14px] rounded-full border-2 transition-all z-10 flex items-center justify-center cursor-pointer ${
                    isCompleted
                      ? 'bg-[#006b27] border-[#006b27] text-white ring-2 ring-[#006b27]/20'
                      : step.status === 'urgent'
                      ? 'bg-[#ba1a1a] border-white dark:border-[#1b1b1d] ring-4 ring-[#ba1a1a]/30 animate-pulse'
                      : step.status === 'active'
                      ? 'bg-[#0058bc] border-white dark:border-[#1b1b1d] ring-4 ring-[#0058bc]/20'
                      : 'bg-[#ffffff] dark:bg-[#212123] border-[#717786]'
                  }`}
                >
                  {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </button>

                {/* Node Content Card */}
                {step.type === 'alert' ? (
                  /* Urgent Alert Node Card */
                  <div className="bg-[#ffdad6] dark:bg-[#93000a]/30 border border-[#ba1a1a] rounded-xl p-3.5 relative overflow-hidden transition-all shadow-xs">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ba1a1a]"></div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#ba1a1a] dark:text-[#ffdad6] text-xl mt-0.5">
                          warning
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-[#93000a] dark:text-[#ffdad6]">
                              {step.title}
                            </h3>
                            {step.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ba1a1a] text-white uppercase tracking-wider">
                                {step.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#93000a] dark:text-[#ffdad6] opacity-90 mt-1 font-medium">
                            {step.subtitle}
                          </p>
                          {step.detail && (
                            <p className="text-[11px] text-[#ba1a1a] dark:text-[#ffdad6] mt-1.5 opacity-80">
                              {step.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : step.type === 'journey' ? (
                  /* Main Journey Node Card */
                  <div className="bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl p-4 shadow-sm hover:border-[#0058bc] transition-all">
                    {/* Header bar inside card */}
                    <div className="flex items-center justify-between border-b border-[#e4e2e4] dark:border-[#414755] pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0058bc] dark:text-[#adc6ff] text-xl">
                          {step.icon || 'flight_takeoff'}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#414755] dark:text-[#c1c6d7]">
                          {step.title}
                        </span>
                      </div>
                      <span className="bg-[#f7fff2] dark:bg-[#00531c]/40 text-[#006b27] dark:text-[#53e16f] text-xs font-bold px-2.5 py-0.5 rounded border border-[#008733]/30">
                        {step.badge || 'On Time'}
                      </span>
                    </div>

                    {/* Departure / Arrival Graphic */}
                    <div className="flex justify-between items-end mb-4 px-1">
                      <div>
                        <p className="text-3xl font-extrabold text-[#1b1b1d] dark:text-[#f3f0f2] tracking-tight">
                          {trip.departureTime}
                        </p>
                        <p className="text-xs font-medium text-[#414755] dark:text-[#8b91a0] mt-0.5">
                          {trip.originCode} • {trip.origin.split(',')[0]}
                        </p>
                      </div>

                      <div className="flex flex-col items-center px-3">
                        <span className="text-[11px] font-semibold text-[#717786] dark:text-[#8b91a0] mb-1">
                          {trip.duration}
                        </span>
                        <div className="w-20 h-0.5 bg-[#c1c6d7] dark:bg-[#414755] relative flex items-center justify-center">
                          <span className="material-symbols-outlined absolute text-[#0058bc] dark:text-[#adc6ff] text-sm bg-white dark:bg-[#212123] px-1">
                            {trip.eventType === 'flight' ? 'flight' : 'train'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-[#1b1b1d] dark:text-[#f3f0f2] tracking-tight">
                          {trip.arrivalTime}
                        </p>
                        <p className="text-xs font-medium text-[#414755] dark:text-[#8b91a0] mt-0.5">
                          {trip.destinationCode} • {trip.destination.split(',')[0]}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button inside card */}
                    <button
                      onClick={onOpenBoardingPass}
                      className="w-full bg-[#0058bc] hover:bg-[#0070eb] text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <span>View Boarding Pass</span>
                      <span className="material-symbols-outlined text-sm">confirmation_number</span>
                    </button>
                  </div>
                ) : (
                  /* General Node Card (Weather, Transit, Check-in, Boarding, Arrival) */
                  <div className={`bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl p-3.5 transition-all shadow-2xs ${
                    isCompleted ? 'opacity-60 bg-[#f6f3f5] dark:bg-[#28282a]' : ''
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#f0edef] dark:bg-[#2f2f32] flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[#414755] dark:text-[#c1c6d7] text-xl">
                            {step.icon}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-bold text-sm ${isCompleted ? 'line-through text-[#717786]' : 'text-[#1b1b1d] dark:text-[#f3f0f2]'}`}>
                              {step.title}
                            </p>
                            {step.badge && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                step.badgeType === 'primary'
                                  ? 'bg-[#d8e2ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff]'
                                  : step.badgeType === 'tertiary'
                                  ? 'bg-[#f7fff2] dark:bg-[#00531c] text-[#006b27] dark:text-[#53e16f]'
                                  : 'bg-[#f0edef] dark:bg-[#2f2f32] text-[#414755] dark:text-[#c1c6d7]'
                              }`}>
                                {step.badge}
                              </span>
                            )}
                          </div>
                          {step.subtitle && (
                            <p className="text-xs text-[#717786] dark:text-[#8b91a0] mt-0.5">
                              {step.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Optional Action Button inside node */}
                      {step.actionText && (
                        <button
                          onClick={() => {
                            if (step.actionType === 'boarding_pass') {
                              onOpenBoardingPass();
                            } else if (step.actionType === 'uber') {
                              window.open('https://m.uber.com', '_blank');
                            } else {
                              window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip.destination)}`, '_blank');
                            }
                          }}
                          className="bg-[#f0edef] dark:bg-[#2f2f32] text-[#1b1b1d] dark:text-[#f3f0f2] hover:bg-[#e4e2e4] dark:hover:bg-[#3a3a3e] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
                        >
                          <span>{step.actionText}</span>
                          <ExternalLink className="w-3 h-3 text-[#717786]" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Note / Reminder Section */}
      <div className="mt-8 border-t border-[#c1c6d7] dark:border-[#414755] pt-4">
        {showAddNote ? (
          <form onSubmit={handleNoteSubmit} className="bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl p-3 space-y-2 shadow-sm">
            <label className="block text-xs font-bold text-[#414755] dark:text-[#c1c6d7] uppercase tracking-wider">
              Add Personal Reminder / Timeline Step
            </label>
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g., Buy water bottle & power bank after TSA security"
              className="w-full bg-[#f6f3f5] dark:bg-[#28282a] border border-[#c1c6d7] dark:border-[#414755] rounded-lg p-2.5 text-sm text-[#1b1b1d] dark:text-[#f3f0f2] focus:outline-none focus:border-[#0058bc]"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddNote(false)}
                className="px-3 py-1.5 text-xs font-medium text-[#717786]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-[#0058bc] text-white rounded-lg hover:opacity-90"
              >
                Add Step
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddNote(true)}
            className="w-full py-3 border border-dashed border-[#c1c6d7] dark:border-[#414755] rounded-xl text-xs font-bold text-[#0058bc] dark:text-[#adc6ff] hover:bg-[#f6f3f5] dark:hover:bg-[#28282a] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Personal Note / Reminder to Timeline</span>
          </button>
        )}
      </div>
    </div>
  );
};
