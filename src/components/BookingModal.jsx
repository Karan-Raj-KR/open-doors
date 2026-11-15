import { useState } from "react";
import { Info, Ticket, LoaderCircle } from "lucide-react";
import { date, time, api } from "../lib.js";
import Modal from "./Modal.jsx";

export default function BookingModal({ event, onClose, onSuccess }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Modal title="A place with your name on it" onClose={onClose}>
      <form
        className="modal-body form"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setBusy(true);
          const f = new FormData(e.currentTarget);
          try {
            const b = await api(`/events/${event._id}/bookings`, {
              method: "POST",
              body: JSON.stringify(Object.fromEntries(f)),
            });
            onSuccess(b);
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>You’re invited.</h2>
        <p>
          {event.title}
          <br />
          {date(event.date, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          at {time(event.date)}
        </p>
        <label>
          Your name
          <input
            name="name"
            required
            minLength="2"
            maxLength="80"
            autoComplete="name"
            placeholder="How should we welcome you?"
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength="254"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <small>Stored for the demo booking. No email will be sent.</small>
        </label>
        <label>
          Anything your host should know?{" "}
          <span className="muted">(optional)</span>
          <textarea
            name="note"
            maxLength="1000"
            rows="3"
            placeholder="A companion seat, a question about the entrance…"
          />
          <small>You only need to share what you’re comfortable with.</small>
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary full" disabled={busy}>
          {busy ? (
            <LoaderCircle size={17} className="spinner" />
          ) : (
            <Ticket size={17} />
          )}{" "}
          {busy ? "Reserving your place…" : "Reserve my demo place"}
        </button>
        <div className="privacy-note">
          <Info size={16} />
          No real ticket or payment. This reservation is stored in MongoDB for
          your session.
        </div>
      </form>
    </Modal>
  );
}
