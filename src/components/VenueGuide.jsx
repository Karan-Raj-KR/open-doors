import { useState } from "react";
import {
  DoorOpen,
  VolumeX,
  Armchair,
  TramFront,
  Navigation,
} from "lucide-react";

export default function VenueGuide({ event: e }) {
  const [spot, setSpot] = useState("entrance");
  const spots = {
    entrance: {
      label: "Entrance",
      icon: DoorOpen,
      detail:
        e.access.stepFree === true
          ? "Step-free route reported by the organiser."
          : e.access.stepFree === false
            ? "Steps at the entrance. No step-free route reported."
            : "Entrance access has not been confirmed.",
    },
    seating: {
      label: "Seating",
      icon: Armchair,
      detail:
        e.access.seating === true
          ? "Seats and companion space are available."
          : "Seating availability is unconfirmed.",
    },
    quiet: { label: "Sound", icon: VolumeX, detail: e.noise },
    transport: { label: "Transport", icon: TramFront, detail: e.transport },
  };
  return (
    <div className="venue-guide">
      <div className="venue-guide-heading">
        <Navigation size={17} />
        <strong>Explore your arrival</strong>
        <small>Illustrative guide</small>
      </div>
      <div className="venue-path">
        {Object.entries(spots).map(([k, s]) => {
          const I = s.icon;
          return (
            <button
              key={k}
              className={spot === k ? "selected" : ""}
              onClick={() => setSpot(k)}
              aria-pressed={spot === k}
            >
              <I size={23} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite">{spots[spot].detail}</p>
    </div>
  );
}
