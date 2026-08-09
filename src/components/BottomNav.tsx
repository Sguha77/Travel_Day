import React from 'react';
import { Plus, Ticket, Sparkles, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'itinerary' | 'add' | 'pass' | 'ai' | 'settings';
  onTabChange: (tab: 'itinerary' | 'add' | 'pass' | 'ai' | 'settings') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-40 border-t border-[#c1c6d7] dark:border-[#414755] bg-[#fcf8fb] dark:bg-[#1b1b1d] flex justify-around items-center h-16 px-4 pb-safe shadow-sm transition-colors">
      <button
        onClick={() => onTabChange('itinerary')}
        className={`flex flex-col items-center justify-center w-16 transition-opacity ${
          activeTab === 'itinerary' ? 'text-[#0058bc] dark:text-[#adc6ff] font-bold' : 'text-[#414755] dark:text-[#8b91a0]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">timeline</span>
        <span className="text-[11px] font-medium mt-0.5">Itinerary</span>
      </button>

      <button
        onClick={() => onTabChange('add')}
        className={`flex flex-col items-center justify-center w-16 transition-opacity ${
          activeTab === 'add' ? 'text-[#0058bc] dark:text-[#adc6ff] font-bold' : 'text-[#414755] dark:text-[#8b91a0]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">add_circle</span>
        <span className="text-[11px] font-medium mt-0.5">Add Trip</span>
      </button>

      <button
        onClick={() => onTabChange('pass')}
        className={`flex flex-col items-center justify-center w-16 transition-opacity ${
          activeTab === 'pass' ? 'text-[#0058bc] dark:text-[#adc6ff] font-bold' : 'text-[#414755] dark:text-[#8b91a0]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">confirmation_number</span>
        <span className="text-[11px] font-medium mt-0.5">Pass</span>
      </button>

      <button
        onClick={() => onTabChange('ai')}
        className={`flex flex-col items-center justify-center w-16 transition-opacity ${
          activeTab === 'ai' ? 'text-[#006b27] dark:text-[#53e16f] font-bold' : 'text-[#414755] dark:text-[#8b91a0]'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[11px] font-medium mt-0.5">AI Day</span>
      </button>

      <button
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center justify-center w-16 transition-opacity ${
          activeTab === 'settings' ? 'text-[#0058bc] dark:text-[#adc6ff] font-bold' : 'text-[#414755] dark:text-[#8b91a0]'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">settings</span>
        <span className="text-[11px] font-medium mt-0.5">Settings</span>
      </button>
    </nav>
  );
};
