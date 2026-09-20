import React from "react";
import {
  Plane,
  Train,
  Clock,
  AlertTriangle,
  Navigation,
  CheckCircle2,
  MapPin,
  Ticket,
  Plus,
  RefreshCw,
  Share2,
  Sparkles,
  Luggage,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Trip, TimelineStep } from "../types";

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
  const isFlight = trip.eventType === "flight";

  const completedSteps = trip.steps.filter(
    (step) => step.isCompleted
  ).length;

  const progress =
    trip.steps.length > 0
      ? Math.round(
          (completedSteps / trip.steps.length) * 100
        )
      : 0;

  const handleAddNote = () => {
    const note = window.prompt("Add a travel note");

    if (note?.trim()) {
      onAddCustomNote(note.trim());
    }
  };

  const renderStepIcon = (step: TimelineStep) => {
    if (step.type === "weather") return "cloud";
    if (step.type === "alert") return "warning";
    if (step.type === "transit") return "directions_car";
    if (step.type === "checkin") return "how_to_reg";
    if (step.type === "boarding") return "flight_takeoff";
    if (step.type === "journey")
      return isFlight ? "flight" : "train";
    if (step.type === "arrival") return "location_on";

    return step.icon || "event_note";
  };

  return (
    <main className="min-h-screen px-4 sm:px-6 pt-24 pb-28">
      <div className="max-w-5xl mx-auto">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[2rem] text-white shadow-2xl animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500" />

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-cyan-300/10 blur-3xl" />

          {/* Floating decorative logo */}
          <div className="absolute right-4 top-4 sm:right-7 sm:top-6 z-20 w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center pointer-events-none animate-float">
            {isFlight ? (
              <Plane className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            ) : (
              <Train className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            )}
          </div>

          {/* Content has reserved right-side space */}
          <div className="relative z-10 p-5 sm:p-8 pr-20 sm:pr-28">

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/12 border border-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Smart Journey
              </span>

              <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold">
                {trip.departureDate}
              </span>
            </div>

            {/* Route */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">

              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs text-white/65 font-semibold uppercase tracking-wider mb-1">
                  Departure
                </div>

                <div className="text-3xl sm:text-5xl font-black tracking-tight">
                  {trip.originCode}
                </div>

                <div className="text-[10px] sm:text-xs text-white/70 mt-1 truncate">
                  {trip.origin}
                </div>
              </div>

              {/* Duration column */}
              <div className="flex flex-col items-center min-w-[72px] sm:min-w-[100px]">
                <div className="flex items-center w-full gap-2">
                  <div className="h-px flex-1 bg-white/25" />

                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                    {isFlight ? (
                      <Plane className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Train className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>

                  <div className="h-px flex-1 bg-white/25" />
                </div>

                <div className="mt-2 text-[10px] sm:text-xs font-semibold text-white/75 whitespace-nowrap">
                  {trip.duration}
                </div>
              </div>

              <div className="text-right min-w-0">
                <div className="text-[10px] sm:text-xs text-white/65 font-semibold uppercase tracking-wider mb-1">
                  Arrival
                </div>

                <div className="text-3xl sm:text-5xl font-black tracking-tight">
                  {trip.destinationCode}
                </div>

                <div className="text-[10px] sm:text-xs text-white/70 mt-1 truncate">
                  {trip.destination}
                </div>
              </div>
            </div>

            {/* Trip information */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                <div className="text-[9px] text-white/55 uppercase tracking-wider">
                  Departure
                </div>
                <div className="text-sm font-bold mt-1">
                  {trip.departureTime}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                <div className="text-[9px] text-white/55 uppercase tracking-wider">
                  Arrival
                </div>
                <div className="text-sm font-bold mt-1">
                  {trip.arrivalTime}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                <div className="text-[9px] text-white/55 uppercase tracking-wider">
                  {isFlight ? "Gate" : "Platform"}
                </div>
                <div className="text-sm font-bold mt-1">
                  {trip.gate}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                <div className="text-[9px] text-white/55 uppercase tracking-wider">
                  {isFlight ? "Seat" : "Coach"}
                </div>
                <div className="text-sm font-bold mt-1">
                  {trip.seat}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenBoardingPass}
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-xs font-extrabold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-transform duration-150"
              >
                <Ticket className="w-4 h-4" />
                View Pass
              </button>

              <button
                onClick={onRecalculate}
                className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold flex items-center gap-2 hover:bg-white/15 transition-colors duration-150"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Live
              </button>

              <button className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors duration-150">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* PROGRESS */}

        <section className="mt-5 glass-card rounded-2xl p-4 animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-extrabold">
                Journey progress
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {completedSteps} of {trip.steps.length} steps completed
              </div>
            </div>

            <span className="text-xs font-black text-indigo-600 dark:text-indigo-300">
              {progress}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* QUICK INFO */}

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="glass-card glass-card-hover rounded-2xl p-4 animate-fade-up">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>

            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Boarding
            </div>

            <div className="text-sm font-extrabold mt-1">
              {trip.boardingTime}
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-4 animate-fade-up">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 flex items-center justify-center mb-3">
              <MapPin className="w-4 h-4" />
            </div>

            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Terminal
            </div>

            <div className="text-sm font-extrabold mt-1">
              {trip.terminal}
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-4 animate-fade-up">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-3">
              <Luggage className="w-4 h-4" />
            </div>

            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Baggage
            </div>

            <div className="text-sm font-extrabold mt-1">
              {trip.baggageDrop ? "Drop enabled" : "Carry-on"}
            </div>
          </div>

          <div className="glass-card glass-card-hover rounded-2xl p-4 animate-fade-up">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Security
            </div>

            <div className="text-sm font-extrabold mt-1">
              {trip.tsaPrecheck ? "PreCheck" : "Standard"}
            </div>
          </div>
        </section>

        {/* TIMELINE */}

        <section className="mt-8">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Your Journey
                </h2>

                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Everything you need, exactly when you need it.
              </p>
            </div>

            <button
              onClick={onRecalculate}
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 hover:underline"
            >
              Recalculate
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative">
            <div className="timeline-line hidden sm:block" />

            <div className="space-y-4">
              {trip.steps.map((step, index) => {
                const completed = step.isCompleted;
                const urgent = step.status === "urgent";
                const active = step.status === "active";

                return (
                  <article
                    key={step.id}
                    className="relative pl-0 sm:pl-12 animate-fade-up"
                    style={{
                      animationDelay: `${Math.min(
                        index * 55,
                        500
                      )}ms`,
                    }}
                  >
                    <div
                      className={`hidden sm:flex absolute left-[5px] top-6 w-7 h-7 rounded-full items-center justify-center z-10 ${
                        completed
                          ? "bg-emerald-500 text-white"
                          : urgent
                          ? "bg-red-500 text-white"
                          : active
                          ? "bg-indigo-500 text-white timeline-dot"
                          : "bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-500"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span className="material-symbols-outlined text-[15px]">
                          {renderStepIcon(step)}
                        </span>
                      )}
                    </div>

                    <div
                      className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 ${
                        urgent
                          ? "border-red-300/50 dark:border-red-500/30"
                          : ""
                      } ${
                        active
                          ? "ring-1 ring-indigo-500/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`sm:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                            completed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                              : urgent
                              ? "bg-red-500/10 text-red-600 dark:text-red-300"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : urgent ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <span className="material-symbols-outlined text-[19px]">
                              {renderStepIcon(step)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {step.time && (
                            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 mb-1">
                              {step.time}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-sm sm:text-base font-extrabold ${
                                completed
                                  ? "line-through opacity-60"
                                  : ""
                              }`}
                            >
                              {step.title}
                            </h3>

                            {step.badge && (
                              <span
                                className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                  step.badgeType === "error"
                                    ? "bg-red-500/10 text-red-600 dark:text-red-300"
                                    : step.badgeType ===
                                      "tertiary"
                                    ? "bg-violet-500/10 text-violet-600 dark:text-violet-300"
                                    : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                                }`}
                              >
                                {step.badge}
                              </span>
                            )}
                          </div>

                          {step.subtitle && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {step.subtitle}
                            </p>
                          )}

                          {step.detail && (
                            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mt-3">
                              {step.detail}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mt-4">
                            {step.actionType ===
                              "boarding_pass" && (
                              <button
                                onClick={onOpenBoardingPass}
                                className="gradient-button px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5"
                              >
                                <Ticket className="w-3.5 h-3.5" />
                                {step.actionText ||
                                  "Boarding Pass"}
                              </button>
                            )}

                            {step.actionType ===
                              "directions" && (
                              <button className="px-3 py-2 rounded-xl text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/15 transition-colors">
                                <span className="inline-flex items-center gap-1.5">
                                  <Navigation className="w-3.5 h-3.5" />
                                  {step.actionText ||
                                    "Directions"}
                                </span>
                              </button>
                            )}

                            {step.actionType === "complete" && (
                              <button
                                onClick={() =>
                                  onToggleStepComplete(step.id)
                                }
                                className={`px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-colors ${
                                  completed
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                    : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/15"
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />

                                {completed
                                  ? "Completed"
                                  : step.actionText ||
                                    "Mark Complete"}
                              </button>
                            )}

                            {!step.actionType &&
                              step.type !== "weather" && (
                                <button
                                  onClick={() =>
                                    onToggleStepComplete(step.id)
                                  }
                                  className={`px-3 py-2 rounded-xl text-[10px] font-bold ${
                                    completed
                                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                  }`}
                                >
                                  {completed
                                    ? "Completed"
                                    : "Mark complete"}
                                </button>
                              )}
                          </div>
                        </div>

                        {step.time && (
                          <div className="hidden sm:block text-right shrink-0">
                            <div className="text-[10px] font-bold text-slate-400">
                              TIME
                            </div>

                            <div className="text-xs font-extrabold mt-1">
                              {step.time}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ADD NOTE */}

        <section className="mt-6 glass-card rounded-2xl p-4 border-dashed animate-fade-up">
          <button
            onClick={handleAddNote}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            Add personal travel note
          </button>
        </section>
      </div>
    </main>
  );
};
