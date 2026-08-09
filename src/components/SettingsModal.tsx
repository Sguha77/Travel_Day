import React from 'react';
import { X, Moon, Sun, Trash2, RotateCcw, ShieldCheck, MapPin, Check } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetDefaultTrips: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  darkMode,
  onToggleDarkMode,
  onResetDefaultTrips,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] dark:bg-[#212123] border border-[#c1c6d7] dark:border-[#414755] rounded-2xl w-full max-w-md p-5 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e2e4] dark:border-[#414755] pb-3">
          <h3 className="text-lg font-bold text-[#1b1b1d] dark:text-[#f3f0f2]">
            Travel Day Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f0edef] dark:hover:bg-[#2f2f32] text-[#414755] dark:text-[#c1c6d7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preferences */}
        <div className="space-y-4 text-xs">
          {/* Theme */}
          <div className="flex items-center justify-between p-3 bg-[#f6f3f5] dark:bg-[#28282a] rounded-xl border border-[#c1c6d7] dark:border-[#414755]">
            <div className="flex items-center gap-2.5">
              {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-600" />}
              <div>
                <p className="font-bold text-sm text-[#1b1b1d] dark:text-[#f3f0f2]">Appearance</p>
                <p className="text-[11px] text-[#717786] dark:text-[#8b91a0]">{darkMode ? 'Dark Theme' : 'Light Theme'}</p>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 bg-[#0058bc] text-white font-bold text-xs rounded-lg hover:opacity-90"
            >
              Toggle
            </button>
          </div>

          {/* Home Location */}
          <div className="p-3 bg-[#f6f3f5] dark:bg-[#28282a] rounded-xl border border-[#c1c6d7] dark:border-[#414755] space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0058bc]" />
              <p className="font-bold text-sm text-[#1b1b1d] dark:text-[#f3f0f2]">Default Home Location</p>
            </div>
            <p className="text-[11px] text-[#717786] dark:text-[#8b91a0]">
              San Francisco, CA (Used for automatic transit calculations)
            </p>
          </div>

          {/* PreCheck Info */}
          <div className="p-3 bg-[#f6f3f5] dark:bg-[#28282a] rounded-xl border border-[#c1c6d7] dark:border-[#414755] space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006b27]" />
              <p className="font-bold text-sm text-[#1b1b1d] dark:text-[#f3f0f2]">Security Credentials</p>
            </div>
            <p className="text-[11px] text-[#717786] dark:text-[#8b91a0]">
              TSA PreCheck & Global Entry enabled by default
            </p>
          </div>

          {/* Reset sample trips */}
          <div className="pt-2">
            <button
              onClick={() => {
                onResetDefaultTrips();
                onClose();
              }}
              className="w-full py-2.5 border border-[#c1c6d7] dark:border-[#414755] rounded-xl text-xs font-bold text-[#ba1a1a] dark:text-[#ffdad6] hover:bg-[#ffdad6]/20 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Sample Trips & Timelines</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-[#717786] dark:text-[#8b91a0] pt-2 border-t border-[#e4e2e4] dark:border-[#414755]">
          Travel Day v1.0 • Built with Google Stitch Design System & Gemini AI
        </div>
      </div>
    </div>
  );
};
