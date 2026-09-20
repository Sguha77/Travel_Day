import React, { useState } from "react";
import { Trip } from "../types";
import {
  Menu,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Plane,
} from "lucide-react";

interface HeaderProps {
  trips: Trip[];
  activeTrip: Trip | null;
  onSelectTrip: (tripId: string) => void;
  onOpenAddTrip: () => void;
  onOpenAssistant: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onOpenAddTrip,
  onOpenAssistant,
  onOpenSettings,
  darkMode,
  onToggleDarkMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-5 pt-3">
      <div className="glass-card rounded-2xl h-14 px-3 sm:px-5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 hover:scale-105 transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                <Plane className="w-4 h-4" />
              </div>

              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold tracking-tight gradient-text">
                  Travel Day
                </div>

                {activeTrip && (
                  <div className="hidden sm:block text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                    {activeTrip.originCode} → {activeTrip.destinationCode}
                  </div>
                )}
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-12 left-0 w-72 glass-card rounded-2xl p-2 shadow-2xl animate-fade-up">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  My Journeys
                </div>

                {trips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      onSelectTrip(trip.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeTrip?.id === trip.id
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold">
                          {trip.identifier}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {trip.originCode} → {trip.destinationCode}
                        </div>
                      </div>

                      {activeTrip?.id === trip.id && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}

                <div className="h-px bg-slate-200/70 dark:bg-slate-700/70 my-2" />

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenAddTrip();
                  }}
                  className="w-full p-3 rounded-xl flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Trip
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-2 mr-2">
            <button
              onClick={onOpenAddTrip}
              className="px-3 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 transition-all"
            >
              + Add Trip
            </button>

            <button
              onClick={onOpenAssistant}
              className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-violet-600 dark:text-violet-300 hover:bg-violet-500/10 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Companion
            </button>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="relative w-12 h-8 rounded-full p-1 bg-slate-200 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700 transition-all duration-500 hover:scale-105"
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                darkMode
                  ? "translate-x-4 bg-gradient-to-br from-indigo-500 to-violet-600"
                  : "translate-x-0 bg-white"
              }`}
            >
              {darkMode ? (
                <Moon className="w-3.5 h-3.5 text-white" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-orange-500" />
              )}
            </span>
          </button>

          {/* Avatar */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-xl overflow-hidden border border-white/50 dark:border-slate-700 shadow-md hover:scale-105 transition-transform"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
