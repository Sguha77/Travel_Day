import React, { useState } from "react";
import { Trip } from "../types";
import {
  Check,
  ExternalLink,
  RefreshCw,
  Plus,
  ChevronRight,
  MapPin,
  Clock3,
  Plane,
  Train,
  Sparkles,
} from "lucide-react";

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
  const [noteText, setNoteText] = useState("");

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noteText.trim()) return;

    onAddCustomNote(noteText.trim());
    setNoteText("");
    setShowAddNote(false);
  };

  const completedCount = trip.steps.filter(
    (step) => step.isCompleted || step.status === "completed"
  ).length;

  const progress = Math.round(
    (completedCount / trip.steps.length) * 100
  );

  return (
    <main className="relative min-h-screen pt-24 pb-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* HERO */}
        <section className="animate-fade-up">
          <div className="relative overflow-hidden rounded-[28px] p-5 sm:p-7 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest">
                    {trip.eventType === "flight"
                      ? "Flight"
                      : "Train"}
                  </span>

                  <span className="text-xs text-white/70">
                    {trip.identifier}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  ON TIME
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl sm:text-5xl font-black tracking-tight">
                    {trip.originCode}
                  </p>

                  <p className="text-xs text-white/70 mt-1">
                    {trip.origin.split(",")[0]}
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center pb-2">
                  <span className="text-[10px] font-semibold text-white/60 mb-2">
                    {trip.duration}
                  </span>

                  <div className="relative w-full max-w-32 h-px bg-white/30">
                    <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg float-slow">
                      {trip.eventType === "flight" ? (
                        <Plane className="w-4 h-4" />
                      ) : (
                        <Train className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-4xl sm:text-5xl font-black tracking-tight">
                    {trip.destinationCode}
                  </p>

                  <p className="text-xs text-white/70 mt-1">
                    {trip.destination.split(",")[0]}
                  </p>
                </div>
              </div>

              {/* Times */}
              <div className="mt-7 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/60">
                    Departure
                  </p>

                  <p className="text-lg font-extrabold">
                    {trip.departureTime}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-white/60">
                    Arrival
                  </p>

                  <p className="text-lg font-extrabold">
                    {trip.arrivalTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK INFO */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            {
              label: "Gate",
              value: trip.gate,
              icon: "confirmation_number",
            },
            {
              label: "Seat",
              value: trip.seat,
              icon: "event_seat",
            },
            {
              label: "Boarding",
              value: trip.boardingTime,
              icon: "schedule",
            },
            {
              label: "Terminal",
              value: trip.terminal,
              icon: "flight_takeoff",
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`glass-card premium-card rounded-2xl p-3.5 animate-fade-up animate-fade-up-delay-${index + 1}`}
            >
              <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-300 text-lg">
                {item.icon}
              </span>

              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mt-2">
                {item.label}
              </p>

              <p className="text-sm font-extrabold mt-0.5 truncate">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* PROGRESS */}
        <section className="glass-card rounded-2xl p-4 mt-4 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />

                <span className="text-xs font-bold">
                  Journey Progress
                </span>
              </div>

              <p className="text-[10px] text-slate-500 mt-1">
                {completedCount} of {trip.steps.length} steps completed
              </p>
            </div>

            <span className="text-sm font-black gradient-text">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* ACTIONS */}
        <section className="flex gap-3 mt-4">
          <button
            onClick={onRecalculate}
            className="flex-1 py-3 rounded-2xl glass-card font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
          >
            <RefreshCw className="w-4 h-4 text-indigo-500" />
            Sync Live
          </button>

          <button
            onClick={onOpenBoardingPass}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            View Pass
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* TIMELINE */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-500 dark:text-indigo-300">
                Smart itinerary
              </p>

              <h2 className="text-xl font-black mt-1">
                Your journey
              </h2>
            </div>

            <Clock3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="timeline-line absolute left-[18px] top-3 bottom-6 w-[2px] rounded-full" />

            <div className="space-y-4">
              {trip.steps.map((step, index) => {
                const completed =
                  step.isCompleted ||
                  step.status === "completed";

                return (
                  <div
                    key={step.id}
                    className="relative pl-12 animate-fade-up"
                    style={{
                      animationDelay: `${index * 70}ms`,
                    }}
                  >
                    {/* Node */}
                    <button
                      onClick={() =>
                        onToggleStepComplete(step.id)
                      }
                      className={`timeline-node absolute left-[7px] top-5 w-6 h-6 rounded-full z-10 flex items-center justify-center border-4 border-[var(--app-bg)] ${
                        completed
                          ? "bg-emerald-500 text-white"
                          : step.status === "urgent"
                            ? "bg-rose-500 text-white pulse-glow"
                            : step.status === "active"
                              ? "bg-indigo-500 text-white pulse-glow"
                              : "bg-white dark:bg-slate-800 border-2 border-indigo-400"
                      }`}
                    >
                      {completed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </button>

                    {step.type === "alert" ? (
                      <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-500/10 to-orange-500/5 border border-rose-400/20 shadow-lg">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-rose-500">
                              warning
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-extrabold text-sm">
                                {step.title}
                              </h3>

                              {step.badge && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-rose-500 text-white">
                                  {step.badge}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                              {step.subtitle}
                            </p>

                            {step.detail && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                                {step.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : step.type === "journey" ? (
                      <div className="glass-card premium-card rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                              <Plane className="w-4 h-4 text-indigo-500" />
                            </span>

                            <div>
                              <p className="text-xs font-extrabold">
                                {step.title}
                              </p>

                              <p className="text-[10px] text-slate-500">
                                {step.badge || "On Time"}
                              </p>
                            </div>
                          </div>

                          <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                            ON TIME
                          </span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-2xl font-black">
                              {trip.departureTime}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {trip.originCode}
                            </p>
                          </div>

                          <div className="flex-1 mx-4 h-px bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-cyan-500/20 relative">
                            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--surface-solid)] rounded-full p-1.5">
                              <Plane className="w-3.5 h-3.5 text-indigo-500" />
                            </span>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-black">
                              {trip.arrivalTime}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {trip.destinationCode}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={onOpenBoardingPass}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                        >
                          View Boarding Pass
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`glass-card premium-card rounded-2xl p-4 ${
                          completed ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-300">
                              {step.icon}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p
                                className={`text-sm font-extrabold ${
                                  completed
                                    ? "line-through text-slate-400"
                                    : ""
                                }`}
                              >
                                {step.title}
                              </p>

                              {step.badge && (
                                <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                                  {step.badge}
                                </span>
                              )}
                            </div>

                            {step.subtitle && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                {step.subtitle}
                              </p>
                            )}
                          </div>

                          {step.actionText && (
                            <button
                              onClick={() => {
                                if (
                                  step.actionType ===
                                  "boarding_pass"
                                ) {
                                  onOpenBoardingPass();
                                } else if (
                                  step.actionType === "uber"
                                ) {
                                  window.open(
                                    "https://m.uber.com",
                                    "_blank"
                                  );
                                } else {
                                  window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      trip.destination
                                    )}`,
                                    "_blank"
                                  );
                                }
                              }}
                              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-indigo-500/10 transition-colors"
                            >
                              {step.actionText}
                              <ExternalLink className="w-3 h-3" />
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
        </section>

        {/* ADD NOTE */}
        <section className="mt-8">
          {showAddNote ? (
            <form
              onSubmit={handleNoteSubmit}
              className="glass-card rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />

                <p className="text-xs font-bold">
                  Add personal reminder
                </p>
              </div>

              <input
                value={noteText}
                onChange={(e) =>
                  setNoteText(e.target.value)
                }
                placeholder="e.g. Buy water after security"
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 outline-none px-3 py-3 text-sm transition-all"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Add Step
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddNote(true)}
              className="w-full py-4 rounded-2xl border border-dashed border-indigo-300/50 dark:border-indigo-500/30 text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Personal Note
            </button>
          )}
        </section>
      </div>
    </main>
  );
};
