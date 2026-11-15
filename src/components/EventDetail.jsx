import { useState } from "react";
import {
  DoorOpen,
  ArrowRight,
  MapPin,
  Heart,
  Check,
  X,
  Clock,
  Info,
  Ticket,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Users,
} from "lucide-react";
import { accessOptions } from "../../server/data.js";
import { matchEvent } from "../../shared/matching.js";
import { money, date, time, api, downloadCalendar } from "../lib.js";
import Icon from "./Icon.jsx";
import Modal from "./Modal.jsx";
import VenueGuide from "./VenueGuide.jsx";

export default function EventDetail({
  preview,
  event: e,
  needs,
  saved,
  onSave,
  onClose,
  booking,
  onBook,
  onCancel,
  notify,
}) {
  const [tab, setTab] = useState("overview");
  const m = matchEvent(e, needs);
  return (
    <Modal title="Make a little room for a good day" wide onClose={onClose}>
      <div className="detail-cover">
        <img src={`/images/${e.image}.jpg`} width="1000" height="420" alt="" />
        <span className="detail-category">{e.category}</span>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="event-meta">
            <span>
              {date(e.date, { weekday: "long", day: "numeric", month: "long" })}{" "}
              at {time(e.date)}
            </span>
          </div>
          <h2>{e.title}</h2>
          <p className="detail-tagline">{e.tagline}</p>
          <div className="detail-venue">
            <MapPin size={17} />
            {e.venue}, {e.area}
          </div>
          <div
            className="detail-tabs"
            role="tablist"
            onKeyDown={(event) => {
              const tabs = ["overview", "access guide", "updates"];
              const key = event.key;
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key))
                return;
              event.preventDefault();
              const next =
                key === "Home"
                  ? 0
                  : key === "End"
                    ? 2
                    : (tabs.indexOf(tab) + (key === "ArrowRight" ? 1 : 2)) % 3;
              setTab(tabs[next]);
              event.currentTarget.querySelectorAll("button")[next].focus();
            }}
            aria-label="Event details"
          >
            {["overview", "access guide", "updates"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                tabIndex={tab === t ? 0 : -1}
                aria-controls="event-details-panel"
                id={`event-tab-${t.replaceAll(" ", "-")}`}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t === "updates"
                  ? `Updates (${e.updates.length})`
                  : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="event-details-panel"
            aria-labelledby={`event-tab-${tab.replaceAll(" ", "-")}`}
          >
            {tab === "overview" ? (
              <>
                <h3>A little about the day</h3>
                <p>{e.description}</p>
                <div className="event-facts">
                  <span>
                    <Clock size={18} />
                    {e.duration} minutes
                  </span>
                  <span>
                    <Users size={18} />
                    {e.capacity} places
                  </span>
                  <span>
                    <DoorOpen size={18} />
                    Hosted by {e.host}
                  </span>
                </div>
                <h3>Getting there</h3>
                <p>{e.transport}</p>
                <a
                  className="text-button"
                  href={`https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View location in Maps <ExternalLink size={14} />
                </a>
              </>
            ) : tab === "access guide" ? (
              <>
                <h3>Know before you go.</h3>
                <p>
                  Details are supplied by the demo organiser. Unconfirmed
                  features are never counted as supported.
                </p>
                <div className="access-checklist">
                  {accessOptions.map((a) => (
                    <div className="access-check" key={a.key}>
                      <Icon name={a.key} size={20} />
                      <span>
                        <strong>{a.label}</strong>
                        <small>
                          {e.access[a.key] === true
                            ? "Available"
                            : e.access[a.key] === false
                              ? "Not available"
                              : "Not yet confirmed"}
                        </small>
                      </span>
                      {e.access[a.key] === true ? (
                        <CheckCircle2 className="positive" size={20} />
                      ) : e.access[a.key] === false ? (
                        <X className="muted" size={20} />
                      ) : (
                        <Info size={20} />
                      )}
                    </div>
                  ))}
                </div>
                <h3>The space & entrance</h3>
                <p>{e.accessNotes}</p>
                <h3>Sound & atmosphere</h3>
                <p>{e.noise}</p>
                <VenueGuide event={e} />
              </>
            ) : (
              <>
                <h3>The latest from your host</h3>
                <div className="updates-list">
                  {[...e.updates].reverse().map((u, i) => (
                    <article key={u._id || i}>
                      <span className="update-dot" />
                      <small>
                        {date(u.createdAt, {
                          day: "numeric",
                          month: "long",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </small>
                      <p>{u.text}</p>
                      <span>{e.host} • Demo organiser</span>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <aside className="booking-aside">
          <div className="booking-box">
            <div className="booking-price">
              {money(e.price)}
              <small>
                {e.price
                  ? "per person, illustrative price"
                  : "because good company is for everyone"}
              </small>
            </div>
            {needs.length > 0 ? (
              <div className="your-match">
                <strong>
                  <CheckCircle2 size={18} />
                  {m.supported.length} of {needs.length} needs supported
                </strong>
                <div>
                  {needs.map((k) => (
                    <span key={k}>
                      <Icon name={k} />
                      {accessOptions.find((a) => a.key === k).label}
                      <span>
                        {e.access[k] === true ? (
                          <Check size={15} />
                        ) : e.access[k] === false ? (
                          <X size={15} />
                        ) : (
                          <Info size={15} />
                        )}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p>
                Open the access guide to get to know the space before you
                decide.
              </p>
            )}
            <button
              className="primary full"
              disabled={preview || (!booking && e.booked >= e.capacity)}
              onClick={booking ? () => downloadCalendar(e, booking) : onBook}
            >
              {preview
                ? "Reservations coming soon"
                : booking
                  ? "Add to calendar"
                  : e.booked >= e.capacity
                    ? "All places reserved"
                    : "Save me a place"}
              {booking ? <Download size={16} /> : <ArrowRight size={16} />}
            </button>
            <button
              className="outline full"
              aria-pressed={saved}
              onClick={onSave}
            >
              <Heart size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved to your wish list" : "Save for another day"}
            </button>
            {booking ? (
              <>
                <div className="booking-reference">
                  <Ticket size={15} />
                  {booking.reference}
                </div>
                <button className="text-button" onClick={onCancel}>
                  Cancel demo reservation
                </button>
              </>
            ) : (
              <small className="booking-caption">
                {e.capacity - e.booked} places available • Demo reservation
              </small>
            )}
            <button
              className="text-button full"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${location.origin}/?event=${e._id}`,
                  );
                  notify(
                    "Link copied. Events are private to your demo session.",
                  );
                } catch {
                  notify(
                    "Copy the event URL from your address bar to keep this link.",
                  );
                }
              }}
            >
              <Share2 size={14} />
              Copy event link
            </button>
          </div>
          <p className="detail-honesty">
            <Info size={14} />{" "}
            {preview
              ? "Design preview. Reservations will be enabled when the database is connected."
              : "Illustrative event. No payment is collected. Your booking is saved in this demo session only."}
          </p>
        </aside>
      </div>
    </Modal>
  );
}
