import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Info,
  CheckCircle2,
  Settings2,
  Music,
} from "lucide-react";
import { accessOptions } from "../../server/data.js";
import { categoryIcons, date, time, api } from "../lib.js";
import Icon from "./Icon.jsx";
import Modal from "./Modal.jsx";

export default function Organiser({ events, onClose, onChange, notify }) {
  const [screen, setScreen] = useState("list"),
    [editing, setEditing] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [updateId, setUpdateId] = useState(events[0]?._id || "");
  const [text, setText] = useState("");
  const [access, setAccess] = useState(
    Object.fromEntries(accessOptions.map((a) => [a.key, null])),
  );
  const formRef = useRef(null);
  const startEdit = (e) => {
    setEditing(e);
    setAccess(
      e?.access || Object.fromEntries(accessOptions.map((a) => [a.key, null])),
    );
    setError("");
    setScreen("edit");
  };
  useEffect(() => {
    if (screen !== "edit") return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [screen]);
  return (
    <Modal title="The organiser’s room" wide onClose={onClose}>
      <div className="organiser-body">
        <div className="organiser-intro">
          <div>
            <div className="eyebrow">MAKE ROOM FOR EVERYONE</div>
            <h2>
              {screen === "edit"
                ? editing
                  ? "Make the details count."
                  : "Open a new door."
                : "A better welcome starts here."}
            </h2>
            <p>
              Your own demo workspace. Changes persist for your session and
              never affect another visitor.
            </p>
          </div>
          {screen === "list" && (
            <button className="primary" onClick={() => startEdit(null)}>
              <Plus size={17} />
              Create an event
            </button>
          )}
        </div>
        {screen === "list" ? (
          <>
            <div className="organiser-tabs">
              <button className="active" onClick={() => setScreen("list")}>
                Your events <span>{events.length}</span>
              </button>
              <button onClick={() => setScreen("updates")}>
                Post an update <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="organiser-list">
              {events.map((e) => (
                <article key={e._id}>
                  <img
                    src={`/images/${e.image}.jpg`}
                    alt=""
                    width="80"
                    height="70"
                  />
                  <div>
                    <h3>{e.title}</h3>
                    <span>
                      {date(e.date, { day: "numeric", month: "short" })} •{" "}
                      {e.venue}
                    </span>
                  </div>
                  <span className="organiser-status">
                    <CheckCircle2 size={14} />
                    Published
                  </span>
                  <span>
                    {e.booked}/{e.capacity} booked
                  </span>
                  <button className="outline" onClick={() => startEdit(e)}>
                    Edit details <Settings2 size={15} />
                  </button>
                </article>
              ))}
            </div>
            <div className="organiser-bottom">
              <Info size={17} />
              <p>
                Attendees depend on these details. Mark a feature “Unconfirmed”
                if you’re unsure. It won’t count as a match until you confirm
                it.
              </p>
            </div>
          </>
        ) : screen === "updates" ? (
          <form
            className="form update-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const event = await api(`/events/${updateId}/updates`, {
                  method: "POST",
                  body: JSON.stringify({ text }),
                });
                onChange(event);
                setText("");
                notify(
                  "Update published. Attendees can see it in the event details.",
                );
              } catch (err) {
                setError(err.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <button
              type="button"
              className="text-button"
              onClick={() => setScreen("list")}
            >
              <ArrowLeft size={16} />
              Back to your events
            </button>
            <h3>Keep everyone in the loop.</h3>
            <label>
              Event
              <select
                value={updateId}
                onChange={(e) => setUpdateId(e.target.value)}
              >
                {events.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Organiser update
              <textarea
                required
                minLength="5"
                maxLength="1000"
                rows="5"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="New entrance information, a transport update, a change of plans…"
              />
            </label>
            <small>{text.length}/1,000 characters</small>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary" disabled={busy}>
              {busy ? "Publishing…" : "Publish update"}
              <ArrowUpRight size={16} />
            </button>
            <div className="posted-updates">
              {events
                .find((e) => e._id === updateId)
                ?.updates.slice()
                .reverse()
                .map((u, i) => (
                  <article key={i}>
                    <small>
                      {date(u.createdAt, {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </small>
                    <p>{u.text}</p>
                  </article>
                ))}
            </div>
          </form>
        ) : (
          <form
            ref={formRef}
            className="form event-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              const f = Object.fromEntries(new FormData(e.currentTarget));
              const payload = {
                ...f,
                date: new Date(f.date).toISOString(),
                price: Number(f.price),
                capacity: Number(f.capacity),
                duration: Number(f.duration),
                access,
              };
              try {
                const result = await api(
                  editing ? `/events/${editing._id}` : "/events",
                  {
                    method: editing ? "PUT" : "POST",
                    body: JSON.stringify(payload),
                  },
                );
                onChange(result);
                setScreen("list");
                notify(
                  editing
                    ? "Event details updated."
                    : "Your event is now in the directory.",
                );
              } catch (err) {
                setError(err.message);
                formRef.current?.querySelector(".form-error")?.focus();
              } finally {
                setBusy(false);
              }
            }}
          >
            <button
              type="button"
              className="text-button"
              onClick={() => setScreen("list")}
            >
              <ArrowLeft size={16} />
              Back to your events
            </button>
            <div className="form-two">
              <label>
                Event title
                <input
                  name="title"
                  required
                  minLength="3"
                  maxLength="100"
                  defaultValue={editing?.title}
                  placeholder="Give your good day a name…"
                />
              </label>
              <label>
                Category
                <select
                  name="category"
                  defaultValue={editing?.category || "Outdoors"}
                >
                  {Object.keys(categoryIcons)
                    .filter((c) => c !== "All events")
                    .map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                </select>
              </label>
            </div>
            <label>
              What can attendees expect?
              <textarea
                name="description"
                required
                minLength="20"
                maxLength="3000"
                rows="3"
                defaultValue={editing?.description}
                placeholder="Describe the pace, activities, and what to bring…"
              />
            </label>
            <div className="form-two">
              <label>
                Venue
                <input
                  name="venue"
                  required
                  minLength="3"
                  maxLength="120"
                  defaultValue={editing?.venue}
                  placeholder="Venue name…"
                />
              </label>
              <label>
                Neighbourhood
                <input
                  name="area"
                  required
                  minLength="2"
                  maxLength="80"
                  defaultValue={editing?.area}
                  placeholder="Bengaluru neighbourhood…"
                />
              </label>
            </div>
            <div className="form-four">
              <label>
                Date & time (your local time)
                <input
                  name="date"
                  type="datetime-local"
                  required
                  min={new Date(
                    Date.now() + 60000 - new Date().getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)}
                  defaultValue={
                    editing
                      ? new Date(
                          new Date(editing.date) -
                            new Date().getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                />
              </label>
              <label>
                Duration (minutes)
                <input
                  name="duration"
                  type="number"
                  min="15"
                  max="720"
                  required
                  defaultValue={editing?.duration || 90}
                />
              </label>
              <label>
                Price (₹)
                <input
                  name="price"
                  type="number"
                  min="0"
                  max="100000"
                  required
                  defaultValue={editing?.price || 0}
                />
              </label>
              <label>
                Capacity
                <input
                  name="capacity"
                  type="number"
                  min={Math.max(1, editing?.booked || 0)}
                  max="500"
                  required
                  defaultValue={editing?.capacity || 20}
                />
              </label>
            </div>
            <h3>Access information</h3>
            <p>Be specific. “Unconfirmed” is always better than a guess.</p>
            <div className="access-edit">
              {accessOptions.map((a) => (
                <label key={a.key}>
                  <span>
                    <Icon name={a.key} />
                    {a.label}
                  </span>
                  <select
                    aria-label={a.label}
                    value={
                      access[a.key] === true
                        ? "yes"
                        : access[a.key] === false
                          ? "no"
                          : "unknown"
                    }
                    onChange={(e) =>
                      setAccess((v) => ({
                        ...v,
                        [a.key]:
                          e.target.value === "yes"
                            ? true
                            : e.target.value === "no"
                              ? false
                              : null,
                      }))
                    }
                  >
                    <option value="unknown">Unconfirmed</option>
                    <option value="yes">Available</option>
                    <option value="no">Not available</option>
                  </select>
                </label>
              ))}
            </div>
            <label>
              Entrance & venue notes
              <textarea
                name="accessNotes"
                required
                minLength="10"
                maxLength="2000"
                rows="3"
                defaultValue={editing?.accessNotes}
                placeholder="Entrance route, door widths, ramps, restroom location…"
              />
            </label>
            <label>
              Getting there
              <textarea
                name="transport"
                required
                minLength="10"
                maxLength="1000"
                rows="2"
                defaultValue={editing?.transport}
                placeholder="Nearest stops, walking distance, drop-off information…"
              />
            </label>
            <label>
              Sound & atmosphere
              <textarea
                name="noise"
                required
                minLength="5"
                maxLength="1000"
                rows="2"
                defaultValue={editing?.noise}
                placeholder="Music volume, quiet areas, lighting…"
              />
            </label>
            {error && (
              <p tabIndex="-1" className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary" disabled={busy}>
              {busy
                ? "Saving details…"
                : editing
                  ? "Save event details"
                  : "Publish event"}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
