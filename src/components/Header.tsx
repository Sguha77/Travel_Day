import React, { useState } from 'react';
import { Trip } from '../types';
import { Menu, ChevronDown, Sparkles, Sun, Moon, Plus } from 'lucide-react';

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
    <header className="fixed top-0 w-full z-40 bg-[#fcf8fb] dark:bg-[#1b1b1d] border-b border-[#c1c6d7] dark:border-[#414755] flex items-center justify-between px-4 h-12 shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className="hover:bg-[#f6f3f5] dark:hover:bg-[#28282a] transition-all active:scale-95 flex items-center justify-center p-1.5 rounded-full text-[#414755] dark:text-[#c1c6d7]"
          title="Settings & Menu"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        {/* Brand logo & active trip switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 text-left font-bold text-xl text-[#0058bc] dark:text-[#adc6ff] tracking-tight hover:opacity-90 transition-opacity"
          >
            <span>Travel Day</span>
            {activeTrip && (
              <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#d8e2ff] dark:bg-[#004493] text-[#001a41] dark:text-[#d8e2ff]">
                {activeTrip.identifier} ({activeTrip.originCode}➔{activeTrip.destinationCode})
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            )}
          </button>

          {/* Active trips dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-xl shadow-lg py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#717786] dark:text-[#8b91a0] uppercase tracking-wider">
                My Journeys
              </div>
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTrip(t.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-[#f6f3f5] dark:hover:bg-[#28282a] transition-colors ${
                    activeTrip?.id === t.id ? 'font-bold text-[#0058bc] dark:text-[#adc6ff] bg-[#f0edef] dark:bg-[#2f2f32]' : 'text-[#1b1b1d] dark:text-[#f3f0f2]'
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate">{t.identifier} • {t.originCode} ➔ {t.destinationCode}</div>
                    <div className="text-xs text-[#717786] dark:text-[#8b91a0] font-normal">{t.departureDate} at {t.departureTime}</div>
                  </div>
                  {activeTrip?.id === t.id && (
                    <span className="w-2 h-2 rounded-full bg-[#0058bc] dark:bg-[#adc6ff]"></span>
                  )}
                </button>
              ))}

              <div className="border-t border-[#c1c6d7] dark:border-[#414755] my-1"></div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenAddTrip();
                }}
                className="w-full text-left px-3 py-2 text-sm text-[#0058bc] dark:text-[#adc6ff] font-medium hover:bg-[#f6f3f5] dark:hover:bg-[#28282a] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Trip</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons on the right */}
      <div className="flex items-center gap-2">
        {/* Navigation items for desktop */}
        <nav className="hidden md:flex items-center gap-4 mr-2">
          <button
            onClick={onOpenAddTrip}
            className="text-xs font-semibold flex items-center gap-1.5 text-[#0058bc] dark:text-[#adc6ff] hover:underline"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Add Trip</span>
          </button>
          <button
            onClick={onOpenAssistant}
            className="text-xs font-semibold flex items-center gap-1.5 text-[#006b27] dark:text-[#53e16f] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Companion</span>
          </button>
        </nav>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-full hover:bg-[#f6f3f5] dark:hover:bg-[#28282a] text-[#414755] dark:text-[#c1c6d7] transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={onOpenSettings}
          className="hover:bg-[#f6f3f5] dark:hover:bg-[#28282a] transition-all rounded-full overflow-hidden h-8 w-8 border border-[#c1c6d7] dark:border-[#414755] flex-shrink-0"
          title="Profile & Settings"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
