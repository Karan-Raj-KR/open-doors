import { useState } from "react";
import { ArrowUpRight, MapPin, Map, ExternalLink } from "lucide-react";
import { matchEvent } from "../../shared/matching.js";
import { money, date, time, api } from "../lib.js";

export default function MapView({ events, needs, onSelect }) {
  const [active, setActive] = useState(events[0]?._id);
  const e = events.find((x) => x._id === active) || events[0];
  return (
    <div className="map-layout">
      <div className="city-map">
        <div className="map-grid" />
        <div className="map-park p1" />
        <div className="map-park p2" />
        <div className="map-road r1" />
        <div className="map-road r2" />
        <div className="map-road r3" />
        <span className="map-city-name">BENGALURU</span>
        <span className="map-neighbour n1">MALLESHWARAM</span>
        <span className="map-neighbour n2">INDIRANAGAR</span>
        <span className="map-neighbour n3">JAYANAGAR</span>
        {events.map((x, i) => (
          <button
            key={x._id}
            className={`map-pin ${e._id === x._id ? "active" : ""}`}
            style={{
              left: `${18 + (x.lng - 77.57) * 700}%`,
              top: `${18 + (13.02 - x.lat) * 530}%`,
            }}
            aria-label={`Show ${x.title}`}
            aria-pressed={e._id === x._id}
            onClick={() => setActive(x._id)}
          >
            <MapPin size={19} />
            <span>{money(x.price)}</span>
          </button>
        ))}
        <div className="map-legend">
          <Map size={15} /> Illustrative location overview, not navigation
        </div>
      </div>
      <div className="map-detail">
        <img src={`/images/${e.image}.jpg`} width="500" height="300" alt="" />
        <span className="eyebrow">{e.category}</span>
        <h3>{e.title}</h3>
        <p>
          {e.venue}, {e.area}
        </p>
        <p>
          {date(e.date, { weekday: "long", day: "numeric", month: "short" })} at{" "}
          {time(e.date)}
        </p>
        {needs.length > 0 && (
          <p>
            {matchEvent(e, needs).supported.length} of {needs.length} needs
            supported
          </p>
        )}
        <button className="primary" onClick={() => onSelect(e._id)}>
          Explore this event <ArrowUpRight size={16} />
        </button>
        <a
          className="text-button"
          href={`https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`}
          target="_blank"
          rel="noreferrer"
        >
          Open location in Maps <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
