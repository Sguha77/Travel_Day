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
      } catch (error) {
        console.error("Failed to parse saved trips:", error);
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
  const [showBoardingPassModal, setShowBoardingPassModal] =
    useState(false);
  const [showAssistantDrawer, setShowAssistantDrawer] =
    useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("travel_day_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "travel_day_trips",
      JSON.stringify(trips)
    );
  }, [trips]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", darkMode);
    root.classList.toggle("light", !darkMode);

    localStorage.setItem(
      "travel_day_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const activeTrip =
    trips.find((trip) => trip.id === activeTripId) ||
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

      setTrips((previousTrips) => [
        newTrip,
        ...previousTrips,
      ]);

      setActiveTripId(newTrip.id);
    }, 500);
  };

  const handleToggleStepComplete = (stepId: string) => {
    if (!activeTrip) return;

    setTrips((previousTrips) =>
      previousTrips.map((trip) => {
        if (trip.id !== activeTrip.id) {
          return trip;
        }

        const updatedSteps = trip.steps.map((step) => {
          if (step.id !== stepId) {
            return step;
          }

          const completed = !step.isCompleted;

          return {
            ...step,
            isCompleted: completed,
            status: completed
              ? ("completed" as const)
              : ("upcoming" as const),
          };
        });

        return {
          ...trip,
          steps: updatedSteps,
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

    setTrips((previousTrips) =>
      previousTrips.map((trip) => {
        if (trip.id !== activeTrip.id) {
          return trip;
        }

        return {
          ...trip,
          steps: [...trip.steps, newStep],
        };
      })
    );
  };

  const handleTabChange = (
    tab: "itinerary" | "add" | "pass" | "ai" | "settings"
  ) => {
    setActiveTab(tab);

    if (tab === "pass") {
      setShowBoardingPassModal(true);
    }

    if (tab === "ai") {
      setShowAssistantDrawer(true);
    }

    if (tab === "settings") {
      setShowSettingsModal(true);
    }
  };

  return (
    <div className="app-background min-h-screen text-slate-900 dark:text-slate-100">
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="ambient-orb ambient-orb-three" />

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
          onToggleDarkMode={() =>
            setDarkMode((current) => !current)
          }
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
          <div className="min-h-screen flex items-center justify-center px-5 pt-20 pb-24">
            <div className="glass-card rounded-3xl p-8 text-center max-w-sm">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">
                  flight_takeoff
                </span>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                No active trips found.
              </p>

              <button
                onClick={() => setActiveTab("add")}
                className="gradient-button mt-5 px-5 py-3 rounded-xl text-xs font-bold"
              >
                Create Your First Trip
              </button>
            </div>
          </div>
        )}

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
            onToggleDarkMode={() =>
              setDarkMode((current) => !current)
            }
            onResetDefaultTrips={() => {
              setTrips(INITIAL_TRIPS);
              setActiveTripId(INITIAL_TRIPS[0].id);
              setActiveTab("itinerary");
            }}
          />
        )}
      </div>
    </div>
  );
}
