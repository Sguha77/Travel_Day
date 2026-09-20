import React, { useEffect, useState } from "react";
import { Trip, EventType, TransitPreference } from "./types";
import { INITIAL_TRIPS } from "./data/mockTrips";
import { generateTimelineForTrip } from "./utils/timelineGenerator";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { TimelineView } from "./components/TimelineView";
import { AddTripForm } from "./components/AddTripForm";
import { ProcessingScreen } from "./components/ProcessingScreen";
import { BoardingPassModal } from "./components/BoardingPassModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { SettingsModal } from "./components/SettingsModal";

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem("travel_day_trips");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved trips", e);
      }
    }

    return INITIAL_TRIPS;
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    return trips[0]?.id || INITIAL_TRIPS[0].id;
  });

  const [activeTab, setActiveTab] = useState<
    "itinerary" | "add" | "pass" | "ai" | "settings"
  >("itinerary");

  const [isProcessing, setIsProcessing] = useState(false);
  const [showBoardingPassModal, setShowBoardingPassModal] = useState(false);
  const [showAssistantDrawer, setShowAssistantDrawer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("travel_day_theme") === "dark";
  });

  /* Save trips */
  useEffect(() => {
    localStorage.setItem("travel_day_trips", JSON.stringify(trips));
  }, [trips]);

  /* Apply theme */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", darkMode);
    root.classList.toggle("light", !darkMode);

    localStorage.setItem(
      "travel_day_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  const activeTrip =
    trips.find((t) => t.id === activeTripId) ||
    trips[0] ||
    null;

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

  const handleToggleStepComplete = (stepId: string) => {
    if (!activeTrip) return;

    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== activeTrip.id) return t;

        return {
          ...t,
          steps: t.steps.map((s) => {
            if (s.id !== stepId) return s;

            const completed = !s.isCompleted;

            return {
              ...s,
              isCompleted: completed,
              status: completed ? "completed" : "upcoming",
            };
          }),
        };
      })
    );
  };

  const handleAddCustomNote = (text: string) => {
    if (!activeTrip) return;

    const newStep = {
      id: `custom-${Date.now()}`,
      type: "custom" as const,
      title: text,
      subtitle: "Personal travel note",
      status: "upcoming" as const,
      icon: "note_add",
      isCompleted: false,
    };

    setTrips((prev) =>
      prev.map((t) =>
        t.id === activeTrip.id
          ? { ...t, steps: [...t.steps, newStep] }
          : t
      )
    );
  };

  const handleTabChange = (
    tab: "itinerary" | "add" | "pass" | "ai" | "settings"
  ) => {
    setActiveTab(tab);

    if (tab === "pass") {
      setShowBoardingPassModal(true);
    } else if (tab === "ai") {
      setShowAssistantDrawer(true);
    } else if (tab === "settings") {
      setShowSettingsModal(true);
    }
  };

  return (
    <div className="app-background min-h-screen text-slate-900 dark:text-white transition-colors duration-500">
      {/* Animated ambient lights */}
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />

      <div className="relative z-10">
        <Header
          trips={trips}
          activeTrip={activeTrip}
          onSelectTrip={(id) => {
            setActiveTripId(id);
            setActiveTab("itinerary");
          }}
          onOpenAddTrip={() => setActiveTab("add")}
          onOpenAssistant={() => setShowAssistantDrawer(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleTheme}
        />

        {isProcessing ? (
          <ProcessingScreen
            onComplete={() => {
              setIsProcessing(false);
              setActiveTab("itinerary");
            }}
          />
        ) : activeTab === "add" ? (
          <AddTripForm onSubmitTrip={handleAddTrip} />
        ) : activeTrip ? (
          <TimelineView
            trip={activeTrip}
            onOpenBoardingPass={() =>
              setShowBoardingPassModal(true)
            }
            onRecalculate={() => setIsProcessing(true)}
            onToggleStepComplete={handleToggleStepComplete}
            onAddCustomNote={handleAddCustomNote}
          />
        ) : (
          <div className="pt-32 text-center px-4">
            <div className="glass-card rounded-3xl p-10 max-w-md mx-auto">
              <span className="material-symbols-outlined text-5xl gradient-text">
                flight_takeoff
              </span>

              <h2 className="text-2xl font-extrabold mt-4">
                Your journey starts here
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Create your first trip and let Travel Day build your timeline.
              </p>

              <button
                onClick={() => setActiveTab("add")}
                className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold shadow-lg hover:scale-[1.03] active:scale-95 transition-all"
              >
                Create Your First Trip
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {showBoardingPassModal && activeTrip && (
        <BoardingPassModal
          trip={activeTrip}
          onClose={() => {
            setShowBoardingPassModal(false);

            if (activeTab === "pass") {
              setActiveTab("itinerary");
            }
          }}
        />
      )}

      {showAssistantDrawer && (
        <AIAssistantDrawer
          trip={activeTrip}
          onClose={() => {
            setShowAssistantDrawer(false);

            if (activeTab === "ai") {
              setActiveTab("itinerary");
            }
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => {
            setShowSettingsModal(false);

            if (activeTab === "settings") {
              setActiveTab("itinerary");
            }
          }}
          darkMode={darkMode}
          onToggleDarkMode={toggleTheme}
          onResetDefaultTrips={() => {
            setTrips(INITIAL_TRIPS);
            setActiveTripId(INITIAL_TRIPS[0].id);
            setActiveTab("itinerary");
          }}
        />
      )}
    </div>
  );
}
