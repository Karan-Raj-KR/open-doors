import {
  Grid2X2,
  Leaf,
  BookOpen,
  Music,
  Utensils,
  Palette,
} from "lucide-react";
export const categoryIcons = {
  "All events": Grid2X2,
  Outdoors: Leaf,
  Workshops: Palette,
  Music: Music,
  Culture: BookOpen,
  "Food & community": Utensils,
};
export const money = (n) =>
  n === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n);
export const date = (d, opts = { day: "numeric", month: "short" }) =>
  new Intl.DateTimeFormat("en-IN", {
    ...opts,
    timeZone: "Asia/Kolkata",
  }).format(new Date(d));
export const time = (d) => date(d, { hour: "numeric", minute: "2-digit" });
export async function api(path, opts = {}) {
  const r = await fetch(`/api${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts.headers },
  });
  let data;
  try {
    data = await r.json();
  } catch {
    throw new Error("The server could not respond. Please try again.");
  }
  if (!r.ok) {
    const e = new Error(
      data.errors?.map((x) => `${x.field}: ${x.message}`).join(" • ") ||
        data.message ||
        "Please try again.",
    );
    e.status = r.status;
    throw e;
  }
  return data;
}
export function downloadCalendar(e, b) {
  const fmt = (d) =>
    new Date(d)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const escape = (s) =>
    String(s)
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const text = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Open Doors//Community Event Access//EN",
    "BEGIN:VEVENT",
    `UID:${b?.reference || e._id}@opendoors.demo`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(e.date)}`,
    `DTEND:${fmt(new Date(new Date(e.date).getTime() + e.duration * 60000))}`,
    `SUMMARY:${escape("[DEMO] " + e.title)}`,
    `LOCATION:${escape(e.venue + ", " + e.area + ", Bengaluru")}`,
    `DESCRIPTION:${escape("Illustrative event. No real attendance. " + e.accessNotes)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([text], { type: "text/calendar;charset=utf-8" }),
  );
  a.download = `open-doors-${e.slug}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
