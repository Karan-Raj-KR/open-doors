import ReferenceLanding, {
  ReferenceCommunity,
  ReferenceClosing,
} from "./components/ReferenceLanding.jsx";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  DoorOpen,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Heart,
  Check,
  X,
  Plus,
  Grid2X2,
  Map,
  Leaf,
  Info,
  Download,
  CheckCircle2,
  TriangleAlert,
  Sun,
} from "lucide-react";
import { accessOptions } from "../server/data.js";
import { matchEvent } from "../shared/matching.js";
import { categoryIcons, date, time, api, downloadCalendar } from "./lib.js";
import Icon from "./components/Icon.jsx";
import Modal from "./components/Modal.jsx";
import EventCard from "./components/EventCard.jsx";
import MapView from "./components/MapView.jsx";
import EventDetail from "./components/EventDetail.jsx";
import BookingModal from "./components/BookingModal.jsx";
import Organiser from "./components/Organiser.jsx";
import CompareModal from "./components/CompareModal.jsx";

export default function App() {
  const initial = new URLSearchParams(location.search);
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [needs, setNeeds] = useState(
      initial
        .get("needs")
        ?.split(",")
        .filter((k) => accessOptions.some((a) => a.key === k)) || [],
    ),
    [saved, setSaved] = useState([]);
  const [q, setQ] = useState(initial.get("q") || ""),
    [category, setCategory] = useState(initial.get("category") || "All events"),
    [tab, setTab] = useState(initial.get("tab") || "explore"),
    [view, setView] = useState(initial.get("view") || "grid"),
    [onlyMatches, setOnlyMatches] = useState(initial.get("match") === "true"),
    [sort, setSort] = useState("recommended");
  const [modal, setModal] = useState(null),
    [selected, setSelected] = useState(initial.get("event")),
    [toast, setToast] = useState(""),
    [busy, setBusy] = useState(false),
    [comfort, setComfort] = useState(false),
    [profileDirty, setProfileDirty] = useState(false),
    [compare, setCompare] = useState([]);
  const profileRevision = useRef(0);
  const load = async (first = false) => {
    try {
      const d = await api("/bootstrap");
      setData(d);
      setError("");
      if (first) {
        if (!initial.has("needs")) setNeeds(d.profile.needs);
        setSaved(d.profile.saved);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(true);
  }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    if (needs.length) p.set("needs", needs.join(","));
    if (q) p.set("q", q);
    if (category !== "All events") p.set("category", category);
    if (tab !== "explore") p.set("tab", tab);
    if (view !== "grid") p.set("view", view);
    if (onlyMatches) p.set("match", "true");
    if (selected) p.set("event", selected);
    history.replaceState(
      null,
      "",
      `${location.pathname}${p.size ? "?" + p : ""}`,
    );
  }, [needs, q, category, tab, view, onlyMatches, selected]);
  useEffect(() => {
    if (!profileDirty || !data || data.preview) return;
    const revision = profileRevision.current;
    const t = setTimeout(
      () =>
        api("/profile", {
          method: "PUT",
          body: JSON.stringify({ needs, saved }),
        })
          .then(() => {
            if (profileRevision.current === revision) setProfileDirty(false);
          })
          .catch((e) => {
            setToast(`Preferences not saved: ${e.message}`);
          }),
      400,
    );
    return () => clearTimeout(t);
  }, [needs, saved, profileDirty]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    document.documentElement.classList.toggle("comfort", comfort);
  }, [comfort]);
  const toggleNeed = (k) => {
    setNeeds((v) => (v.includes(k) ? v.filter((x) => x !== k) : [...v, k]));
    profileRevision.current++;
    setProfileDirty(true);
  };
  const toggleSave = (id) => {
    setSaved((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
    profileRevision.current++;
    setProfileDirty(true);
  };
  const events = data?.events || [];
  const filtered = useMemo(
    () =>
      events
        .filter(
          (e) =>
            (category === "All events" || e.category === category) &&
            `${e.title} ${e.venue} ${e.area} ${e.description}`
              .toLowerCase()
              .includes(q.toLowerCase()) &&
            (!onlyMatches ||
              !needs.length ||
              matchEvent(e, needs).score === 100) &&
            (tab !== "saved" || saved.includes(e._id)) &&
            (tab !== "plans" ||
              data?.bookings.some((b) => b.eventId === e._id)),
        )
        .sort((a, b) =>
          sort === "price"
            ? a.price - b.price
            : sort === "date"
              ? new Date(a.date) - new Date(b.date)
              : (matchEvent(b, needs).score || 0) -
                  (matchEvent(a, needs).score || 0) ||
                Number(b.featured || 0) - Number(a.featured || 0),
        ),
    [events, category, q, onlyMatches, needs, tab, saved, data?.bookings, sort],
  );
  const event = events.find((e) => e._id === selected);
  const notify = setToast;
  const mutateEvent = (e) =>
    setData((d) => ({
      ...d,
      events: d.events.some((x) => x._id === e._id)
        ? d.events.map((x) => (x._id === e._id ? e : x))
        : [...d.events, e],
    }));
  const clear = () => {
    setQ("");
    setCategory("All events");
    setOnlyMatches(false);
  };
  const changeTab = (t) => {
    setTab(t);
    clear();
  };
  const featured = events.find((e) => e.featured);
  return (
    <>
      <a className="skip-link" href="#events">
        Skip to events
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Open Doors home">
          <DoorOpen size={31} strokeWidth={1.9} />
          <span>
            open doors<span className="brand-period">.</span>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={tab === "explore" ? "nav active" : "nav"}
            onClick={() => changeTab("explore")}
          >
            Explore events
          </button>
          <button
            className={tab === "plans" ? "nav active" : "nav"}
            onClick={() => changeTab("plans")}
          >
            My plans
            {data?.bookings.length > 0 && (
              <span className="nav-count">{data.bookings.length}</span>
            )}
          </button>
          <button
            className={tab === "saved" ? "nav active" : "nav"}
            onClick={() => changeTab("saved")}
          >
            Saved <Heart size={15} />
          </button>
        </nav>
        <div className="header-right">
          <button
            className="organise-link"
            onClick={() => setModal({ type: "organiser" })}
          >
            For organisers <ArrowUpRight size={16} />
          </button>
          <button
            className="profile-avatar"
            aria-label="Open your access profile"
            onClick={() => setModal({ type: "profile" })}
          >
            KR
          </button>
        </div>
      </header>
      {data?.preview && (
        <div className="preview-banner" role="status">
          <Info size={16} />
          <span>
            <strong>Design preview.</strong> Explore events, filters and
            comparisons. Reservations and organiser changes will be enabled when
            the database is connected.
          </span>
        </div>
      )}
      <main>
        {tab === "explore" && (
          <ReferenceLanding
            events={events}
            onSelect={setSelected}
            onProfile={() => setModal({ type: "profile" })}
          />
        )}
        {tab === "explore" && (
          <ReferenceCommunity
            onProfile={() => setModal({ type: "profile" })}
            onExplore={() =>
              document
                .getElementById("events")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        )}
        <section className="access-bar" aria-label="Your access preferences">
          <div className="access-intro">
            <span className="access-symbol">
              <SlidersHorizontal size={21} />
            </span>
            <div>
              <strong>A good fit starts with you.</strong>
              <span>Choose what makes going out easier.</span>
            </div>
          </div>
          <div className="quick-needs">
            {accessOptions.slice(0, 4).map((a) => (
              <button
                key={a.key}
                className={`need-chip ${needs.includes(a.key) ? "chosen" : ""}`}
                aria-pressed={needs.includes(a.key)}
                onClick={() => toggleNeed(a.key)}
              >
                <Icon name={a.key} />
                {a.short}
                {needs.includes(a.key) && <Check size={13} />}
              </button>
            ))}
          </div>
          <button
            className="text-button access-all"
            onClick={() => setModal({ type: "profile" })}
          >
            All access needs <Plus size={15} />
          </button>
        </section>
        <section id="events" className="directory">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                {tab === "explore"
                  ? "YOUR CITY. YOUR PACE."
                  : tab === "saved"
                    ? "KEEP THE POSSIBILITIES CLOSE."
                    : "SOMETHING TO LOOK FORWARD TO."}
              </div>
              <h2>
                {tab === "explore"
                  ? "Find your next good day."
                  : tab === "saved"
                    ? "Your little wish list."
                    : "Your plans, all together."}
              </h2>
            </div>
            <div className="view-switch" role="group" aria-label="Event view">
              <button
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={view === "grid" ? "selected" : ""}
                onClick={() => setView("grid")}
              >
                <Grid2X2 size={17} />
              </button>
              <button
                aria-label="Map view"
                aria-pressed={view === "map"}
                className={view === "map" ? "selected" : ""}
                onClick={() => setView("map")}
              >
                <Map size={17} />
              </button>
            </div>
          </div>
          <div className="browse-controls">
            <div className="categories" aria-label="Event categories">
              {Object.entries(categoryIcons).map(([c, I]) => (
                <button
                  key={c}
                  className={category === c ? "category selected" : "category"}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  <I size={15} />
                  {c}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={17} />
              <input
                name="search"
                aria-label="Search events"
                placeholder="Find something you love…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && (
                <button aria-label="Clear search" onClick={() => setQ("")}>
                  <X size={15} />
                </button>
              )}
            </label>
          </div>
          <div className="results-bar">
            <span aria-live="polite">
              {loading
                ? "Finding your next good day…"
                : `${filtered.length} ${filtered.length === 1 ? "event" : "events"} to make room for`}
              {needs.length > 0 && (
                <span className="results-context">
                  {" "}
                  • matched to {needs.length} access{" "}
                  {needs.length === 1 ? "need" : "needs"}
                </span>
              )}
            </span>
            <div className="result-tools">
              {needs.length > 0 && (
                <label className="match-toggle">
                  <input
                    type="checkbox"
                    checked={onlyMatches}
                    onChange={(e) => setOnlyMatches(e.target.checked)}
                  />
                  Full matches only
                </label>
              )}
              <label className="sort">
                Sort by:{" "}
                <select
                  aria-label="Sort events"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="date">Soonest first</option>
                  <option value="price">Price: low to high</option>
                </select>
              </label>
            </div>
          </div>
          {error ? (
            <div className="empty error-panel">
              <TriangleAlert size={32} />
              <h3>We couldn’t load the events.</h3>
              <p>{error}</p>
              <button
                className="primary"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="event-grid" aria-busy="true">
              {[1, 2, 3].map((n) => (
                <div className="skeleton" key={n}>
                  <div />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <DoorOpen size={40} />
              <h3>
                {tab === "saved"
                  ? "Leave a door open."
                  : tab === "plans"
                    ? "Your next good day is waiting."
                    : "A little more room to explore?"}
              </h3>
              <p>
                {tab === "saved"
                  ? "Tap the heart on an event to keep it here."
                  : tab === "plans"
                    ? "Book a place at an event and your plans will appear here."
                    : "Try another category or relax your filters. Unconfirmed details never count as a match."}
              </p>
              <button
                className="primary"
                onClick={() => {
                  changeTab("explore");
                }}
              >
                Explore all events
              </button>
            </div>
          ) : view === "map" ? (
            <MapView events={filtered} needs={needs} onSelect={setSelected} />
          ) : (
            <div className="event-grid">
              {filtered.map((e) => (
                <EventCard
                  key={e._id}
                  event={e}
                  needs={needs}
                  saved={saved.includes(e._id)}
                  compared={compare.includes(e._id)}
                  onCompare={() =>
                    setCompare((v) =>
                      v.includes(e._id)
                        ? v.filter((id) => id !== e._id)
                        : v.length < 3
                          ? [...v, e._id]
                          : (notify("Compare up to three events at a time."),
                            v),
                    )
                  }
                  booking={data.bookings.find((b) => b.eventId === e._id)}
                  onSave={() => toggleSave(e._id)}
                  onSelect={() => setSelected(e._id)}
                />
              ))}
            </div>
          )}
          <div className="demo-disclaimer">
            <Info size={14} />
            <span>
              A working demo, a real commitment to inclusion. Events and venue
              access details are illustrative. No real tickets, charges or
              attendance.
            </span>
          </div>
        </section>
        <ReferenceClosing
          onProfile={() => setModal({ type: "profile" })}
          onOrganiser={() => setModal({ type: "organiser" })}
        />
      </main>
      <footer>
        <a className="brand" href="/">
          <DoorOpen size={25} />
          <span>open doors.</span>
        </a>
        <span>Built with care by Karan Raj K R.</span>
        <div>
          <button className="text-button" onClick={() => setComfort((v) => !v)}>
            <Sun size={15} />
            {comfort ? "Standard display" : "Comfort display"}
          </button>
          <button
            className="text-button"
            onClick={() => setModal({ type: "about" })}
          >
            About this project <ArrowUpRight size={14} />
          </button>
        </div>
      </footer>
      {compare.length > 0 && (
        <div className="compare-tray">
          <div>
            <strong>{compare.length} events to compare</strong>
            <span>Find the space that fits you.</span>
          </div>
          <button
            className="primary"
            disabled={compare.length < 2}
            onClick={() => setModal({ type: "compare" })}
          >
            Compare access <ArrowRight size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Clear comparison"
            onClick={() => setCompare([])}
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div
        className="toast"
        role="status"
        aria-live="polite"
        data-visible={!!toast}
      >
        {toast && (
          <>
            <CheckCircle2 size={18} />
            <span>{toast}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
      {modal?.type === "profile" && (
        <Modal title="Your access profile" onClose={() => setModal(null)}>
          <div className="modal-body">
            <div className="modal-kicker">
              <SlidersHorizontal size={20} /> Made around you
            </div>
            <h2>
              What helps you feel
              <br />
              at home?
            </h2>
            <p>
              Choose what matters to you. We’ll explain what each event offers,
              without making assumptions.
            </p>
            <div className="profile-options">
              {accessOptions.map((a) => (
                <label
                  className={`profile-option ${needs.includes(a.key) ? "checked" : ""}`}
                  key={a.key}
                >
                  <span className="option-icon">
                    <Icon name={a.key} size={23} />
                  </span>
                  <span>
                    <strong>{a.label}</strong>
                    <small>{a.detail}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={needs.includes(a.key)}
                    onChange={() => toggleNeed(a.key)}
                  />
                </label>
              ))}
            </div>
            <div className="privacy-note">
              <Info size={16} />
              <span>
                Your choices belong to your demo session. You never need to
                disclose a diagnosis or explain your needs.
              </span>
            </div>
            <button
              className="primary full"
              onClick={() => {
                setModal(null);
                notify("Your directory is now tailored to you.");
              }}
            >
              Find my kind of event <ArrowRight size={17} />
            </button>
          </div>
        </Modal>
      )}
      {event && !modal && (
        <EventDetail
          preview={data?.preview}
          event={event}
          needs={needs}
          saved={saved.includes(event._id)}
          onSave={() => toggleSave(event._id)}
          onClose={() => setSelected(null)}
          booking={data.bookings.find((b) => b.eventId === event._id)}
          onBook={() => setModal({ type: "booking", event })}
          onCancel={async () => {
            setModal({ type: "cancel", event });
          }}
          notify={notify}
        />
      )}
      {modal?.type === "booking" && (
        <BookingModal
          event={modal.event}
          onClose={() => setModal(null)}
          onSuccess={async (b) => {
            setData((d) => ({
              ...d,
              bookings: [...d.bookings, b],
              events: d.events.map((e) =>
                e._id === b.eventId ? { ...e, booked: e.booked + 1 } : e,
              ),
            }));
            setModal({ type: "success", event: modal.event, booking: b });
          }}
        />
      )}
      {modal?.type === "success" && (
        <Modal title="You’re on the list" onClose={() => setModal(null)}>
          <div className="success-content">
            <span className="success-icon">
              <Check size={38} />
            </span>
            <h2>
              A good day
              <br />
              is on its way.
            </h2>
            <p>
              Your demo place at <strong>{modal.event.title}</strong> is
              reserved.
            </p>
            <div className="confirmation-ticket">
              <DoorOpen size={26} />
              <div>
                <small>YOUR DEMO PASS</small>
                <strong>{modal.booking.reference}</strong>
                <span>
                  {date(modal.event.date, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  at {time(modal.event.date)}
                </span>
              </div>
            </div>
            <button
              className="primary full"
              onClick={() => downloadCalendar(modal.event, modal.booking)}
            >
              Add to my calendar <Download size={16} />
            </button>
            <button
              className="text-button"
              onClick={() => {
                setModal(null);
                setSelected(null);
                changeTab("plans");
              }}
            >
              See my plans <ArrowRight size={16} />
            </button>
            <small>No payment was taken. This is an illustrative event.</small>
          </div>
        </Modal>
      )}
      {modal?.type === "cancel" && (
        <Modal title="Release your place?" onClose={() => setModal(null)}>
          <div className="modal-body">
            <h2>A change of plans?</h2>
            <p>
              This will cancel your demo reservation at {modal.event.title}. You
              can book again if a place is available.
            </p>
            <div className="button-row">
              <button className="outline" onClick={() => setModal(null)}>
                Keep my place
              </button>
              <button
                className="primary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await api(`/events/${modal.event._id}/bookings`, {
                      method: "DELETE",
                    });
                    await load();
                    setModal(null);
                    notify("Your place has been released.");
                  } catch (e) {
                    notify(e.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Releasing…" : "Release my place"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal?.type === "organiser" && (
        <Organiser
          preview={data?.preview}
          events={events}
          onClose={() => setModal(null)}
          onChange={mutateEvent}
          notify={notify}
        />
      )}
      {modal?.type === "compare" && (
        <CompareModal
          events={events.filter((e) => compare.includes(e._id))}
          needs={needs}
          onClose={() => setModal(null)}
          onSelect={(id) => {
            setModal(null);
            setSelected(id);
          }}
        />
      )}
      {modal?.type === "about" && (
        <Modal title="A little about Open Doors" onClose={() => setModal(null)}>
          <div className="modal-body about">
            <DoorOpen size={44} />
            <h2>
              More people.
              <br />
              More possibilities.
            </h2>
            <p>
              Open Doors is a Community Event Access project by{" "}
              <strong>Karan Raj K R</strong>, built for Semester 3 Backend
              Development CIA-II.
            </p>
            <h3>The idea is simple.</h3>
            <p>
              Practical access information should be part of every invitation.
              Filter by your needs, understand a venue before visiting, and
              follow updates from organisers.
            </p>
            <h3>A real full-stack application.</h3>
            <p>
              React interface, Node.js and Express REST API, and MongoDB
              persistence. Profiles, saved events, reservations and organiser
              updates are stored on the server.
            </p>
            <p className="privacy-note">
              Demo sessions are isolated. You can try the organiser tools
              without changing another visitor’s events. Access details are
              illustrative, not verified venue claims.
            </p>
            <button className="primary full" onClick={() => setModal(null)}>
              Keep exploring <ArrowRight size={17} />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
