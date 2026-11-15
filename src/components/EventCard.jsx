import {
  ArrowUpRight,
  MapPin,
  Heart,
  Check,
  Plus,
  ChevronRight,
  Info,
  Ticket,
  CheckCircle2,
} from "lucide-react";
import { accessOptions } from "../../server/data.js";
import { matchEvent } from "../../shared/matching.js";
import { money, date, time } from "../lib.js";
import Icon from "./Icon.jsx";

export default function EventCard({
  event: e,
  needs,
  saved,
  onSave,
  onSelect,
  booking,
  compared,
  onCompare,
}) {
  const m = matchEvent(e, needs);
  return (
    <article className="event-card">
      <div className="event-image-wrap">
        <button
          className="image-open"
          aria-label={`View ${e.title}`}
          onClick={onSelect}
        >
          <img
            src={`/images/${e.image}.jpg`}
            alt=""
            width="600"
            height="400"
            loading="lazy"
          />
        </button>
        <span className="image-category">{e.category}</span>
        <button
          className={`save-event ${saved ? "saved" : ""}`}
          aria-label={`${saved ? "Unsave" : "Save"} ${e.title}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
        {booking && (
          <span className="booked-ribbon">
            <Ticket size={13} /> You’re on the list
          </span>
        )}
      </div>
      <div className="card-main">
        <div className="event-meta">
          <span>
            {date(e.date, { weekday: "short", day: "numeric", month: "short" })}{" "}
            <span className="meta-divider" /> {time(e.date)}
          </span>
          <strong>{money(e.price)}</strong>
        </div>
        <h3>
          <button onClick={onSelect}>
            {e.title}
            <ArrowUpRight size={21} />
          </button>
        </h3>
        <p className="card-tagline">
          {e.tagline || e.description.slice(0, 90)}
        </p>
        <div className="venue-line">
          <MapPin size={14} />
          {e.venue}
          <span className="venue-area">{e.area}</span>
        </div>
        <div className="card-access">
          {accessOptions
            .filter((a) => e.access[a.key] === true)
            .slice(0, 3)
            .map((a) => (
              <span key={a.key}>
                <Icon name={a.key} size={14} />
                {a.short}
              </span>
            ))}
          {Object.values(e.access).filter((v) => v === true).length > 3 && (
            <span>
              +{Object.values(e.access).filter((v) => v === true).length - 3}
            </span>
          )}
        </div>
        {needs.length > 0 && (
          <button
            className={`match-line ${m.score === 100 ? "full-match" : ""}`}
            onClick={onSelect}
          >
            {m.score === 100 ? <CheckCircle2 size={15} /> : <Info size={15} />}
            <span>
              {m.supported.length} of {needs.length} needs supported
              {m.unknown.length > 0 ? ` • ${m.unknown.length} unconfirmed` : ""}
            </span>
            <ChevronRight size={14} />
          </button>
        )}
        <button
          className={`compare-card ${compared ? "checked" : ""}`}
          aria-pressed={compared}
          onClick={onCompare}
        >
          {compared ? <Check size={13} /> : <Plus size={13} />}{" "}
          {compared ? "Added to comparison" : "Compare access"}
        </button>
      </div>
    </article>
  );
}
