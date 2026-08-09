import React, { useState, useEffect } from 'react';
import { Trip, EventType, TransitPreference } from './types';
import { INITIAL_TRIPS } from './data/mockTrips';
import { generateTimelineForTrip } from './utils/timelineGenerator';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TimelineView } from './components/TimelineView';
import { AddTripForm } from './components/AddTripForm';
import { ProcessingScreen } from './components/ProcessingScreen';
import { BoardingPassModal } from './components/BoardingPassModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('travel_day_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved trips', e);
      }
    }
    return INITIAL_TRIPS;
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    return trips[0]?.id || INITIAL_TRIPS[0].id;
  });

  const [activeTab, setActiveTab] = useState<'itinerary' | 'add' | 'pass' | 'ai' | 'settings'>('itinerary');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showBoardingPassModal, setShowBoardingPassModal] = useState<boolean>(false);
  const [showAssistantDrawer, setShowAssistantDrawer] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('travel_day_theme') === 'dark';
  });

  // Sync trips to localStorage
  useEffect(() => {
    localStorage.setItem('travel_day_trips', JSON.stringify(trips));
  }, [trips]);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('travel_day_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('travel_day_theme', 'light');
    }
  }, [darkMode]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || null;

  // Handler for adding a new trip
  const handleAddTrip = (params: {
    origin: string;
    destination: string;
    eventType: EventType;
    identifier: string;
    departureTime: string;
    transitPreference: TransitPreference;
    baggageDrop: boolean;
    tsaPrecheck: boolean;
  }) => {
    setIsProcessing(true);

    setTimeout(() => {
      const newTrip = generateTimelineForTrip(
        params.origin,
        params.destination,
        params.eventType,
        params.identifier,
        params.departureTime,
        params.transitPreference,
        params.baggageDrop,
        params.tsaPrecheck
      );

      setTrips((prev) => [newTrip, ...prev]);
      setActiveTripId(newTrip.id);
    }, 500);
  };

  // Handler for step completion toggling
  const handleToggleStepComplete = (stepId: string) => {
    if (!activeTrip) return;
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === activeTrip.id) {
          const updatedSteps = t.steps.map((s) => {
            if (s.id === stepId) {
              const isComp = !s.isCompleted;
              return { ...s, isCompleted: isComp, status: isComp ? ('completed' as const) : ('upcoming' as const) };
            }
            return s;
          });
          return { ...t, steps: updatedSteps };
        }
        return t;
      })
    );
  };

  // Handler for adding a custom note to active trip's timeline
  const handleAddCustomNote = (text: string) => {
    if (!activeTrip) return;
    const newStep = {
      id: `custom-${Date.now()}`,
      type: 'custom' as const,
      title: text,
      subtitle: 'Personal travel note',
      status: 'upcoming' as const,
      icon: 'note_add',
      isCompleted: false,
    };

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === activeTrip.id) {
          return { ...t, steps: [...t.steps, newStep] };
        }
        return t;
      })
    );
  };

  // Handle BottomNav tab changes
  const handleTabChange = (tab: 'itinerary' | 'add' | 'pass' | 'ai' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'pass') {
      setShowBoardingPassModal(true);
    } else if (tab === 'ai') {
      setShowAssistantDrawer(true);
    } else if (tab === 'settings') {
      setShowSettingsModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8fb] dark:bg-[#1b1b1d] text-[#1b1b1d] dark:text-[#f3f0f2] font-['Inter',sans-serif] transition-colors">
      {/* Top Header */}
      <Header
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={(id) => {
          setActiveTripId(id);
          setActiveTab('itinerary');
        }}
        onOpenAddTrip={() => setActiveTab('add')}
        onOpenAssistant={() => setShowAssistantDrawer(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main View Area */}
      {isProcessing ? (
        <ProcessingScreen
          onComplete={() => {
            setIsProcessing(false);
            setActiveTab('itinerary');
          }}
        />
      ) : activeTab === 'add' ? (
        <AddTripForm onSubmitTrip={handleAddTrip} />
      ) : activeTrip ? (
        <TimelineView
          trip={activeTrip}
          onOpenBoardingPass={() => setShowBoardingPassModal(true)}
          onRecalculate={() => setIsProcessing(true)}
          onToggleStepComplete={handleToggleStepComplete}
          onAddCustomNote={handleAddCustomNote}
        />
      ) : (
        <div className="pt-24 text-center px-4">
          <p className="text-sm text-[#717786]">No active trips found.</p>
          <button
            onClick={() => setActiveTab('add')}
            className="mt-4 px-4 py-2 bg-[#0058bc] text-white rounded-lg text-xs font-bold"
          >
            Create Your First Trip
          </button>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Boarding Pass Modal */}
      {showBoardingPassModal && activeTrip && (
        <BoardingPassModal
          trip={activeTrip}
          onClose={() => {
            setShowBoardingPassModal(false);
            if (activeTab === 'pass') setActiveTab('itinerary');
          }}
        />
      )}

      {/* AI Travel Assistant Drawer */}
      {showAssistantDrawer && (
        <AIAssistantDrawer
          trip={activeTrip}
          onClose={() => {
            setShowAssistantDrawer(false);
            if (activeTab === 'ai') setActiveTab('itinerary');
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => {
            setShowSettingsModal(false);
            if (activeTab === 'settings') setActiveTab('itinerary');
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onResetDefaultTrips={() => {
            setTrips(INITIAL_TRIPS);
            setActiveTripId(INITIAL_TRIPS[0].id);
            setActiveTab('itinerary');
          }}
        />
      )}
    </div>
  );
}
