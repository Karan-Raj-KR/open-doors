import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { matchEvent } from "../server/validation.js";
let db, app, a, b, events;
before(async () => {
  db = await MongoMemoryServer.create({
    binary: { downloadDir: "/private/tmp/open-doors-mongodb" },
  });
  process.env.MONGODB_URI = db.getUri();
  process.env.SESSION_SECRET = "test-secret-at-least-thirty-two-characters";
  app = (await import("../server/app.js")).default;
  a = request.agent(app);
  b = request.agent(app);
});
after(async () => {
  await mongoose.disconnect();
  await db?.stop();
});
test("unknown and unavailable access never count as supported", () => {
  assert.deepEqual(
    matchEvent({ access: { stepFree: true, quiet: null, seating: false } }, [
      "stepFree",
      "quiet",
      "seating",
    ]),
    {
      supported: ["stepFree"],
      unavailable: ["seating"],
      unknown: ["quiet"],
      total: 3,
      score: 33,
    },
  );
});
test("bootstrap seeds MongoDB and persists the same session", async () => {
  const r = await a.get("/api/bootstrap").expect(200);
  events = r.body.events;
  assert.equal(events.length, 6);
  assert.equal(r.body.demo, true);
  const r2 = await a.get("/api/bootstrap").expect(200);
  assert.equal(r2.body.events[0]._id, events[0]._id);
});
test("visitors are isolated and cannot edit each other’s events", async () => {
  const r = await b.get("/api/bootstrap").expect(200);
  assert.notEqual(r.body.events[0]._id, events[0]._id);
  await b
    .post(`/api/events/${events[0]._id}/updates`)
    .send({ text: "This must not get through" })
    .expect(404);
});
test("access profile persists in MongoDB", async () => {
  await a
    .put("/api/profile")
    .send({ needs: ["stepFree", "quiet"], saved: [events[0]._id] })
    .expect(200);
  const r = await a.get("/api/bootstrap");
  assert.deepEqual(r.body.profile.needs, ["stepFree", "quiet"]);
  assert.deepEqual(r.body.profile.saved, [events[0]._id]);
});
test("filters require confirmed full matches", async () => {
  const r = await a
    .get("/api/events?needs=stepFree,signLanguage&match=true")
    .expect(200);
  assert.equal(r.body.length, 1);
  assert.equal(r.body[0].slug, "stories-in-sign");
});
test("bad input and malformed IDs return clear errors", async () => {
  await a.post("/api/events").send({ title: "x" }).expect(400);
  await a.post("/api/events/bad-id/bookings").send({}).expect(400);
  const r = await a
    .post(`/api/events/${events[0]._id}/bookings`)
    .send({ name: "A", email: "bad" })
    .expect(400);
  assert(r.body.errors.some((e) => e.field === "email"));
});
test("reservation persists, duplicates are rejected, cancellation restores capacity", async () => {
  const id = events[0]._id;
  const r = await a
    .post(`/api/events/${id}/bookings`)
    .send({
      name: "Demo Guest",
      email: "guest@example.com",
      note: "Companion seat please",
    })
    .expect(201);
  assert.match(r.body.reference, /^OD-/);
  await a
    .post(`/api/events/${id}/bookings`)
    .send({ name: "Demo Guest", email: "guest@example.com" })
    .expect(409);
  let state = await a.get("/api/bootstrap");
  assert.equal(state.body.bookings.length, 1);
  assert.equal(state.body.events.find((e) => e._id === id).booked, 1);
  assert.equal(state.body.bookings[0].email, undefined);
  await a.delete(`/api/events/${id}/bookings`).expect(200);
  state = await a.get("/api/bootstrap");
  assert.equal(state.body.bookings.length, 0);
  assert.equal(state.body.events.find((e) => e._id === id).booked, 0);
});
test("organiser updates persist and are visible to attendees", async () => {
  const id = events[0]._id;
  const text = "Use the west entrance. The north entrance is closed.";
  await a.post(`/api/events/${id}/updates`).send({ text }).expect(200);
  const r = await a.get("/api/bootstrap");
  assert.equal(
    r.body.events.find((e) => e._id === id).updates.at(-1).text,
    text,
  );
});
test("cross-origin writes are rejected", async () => {
  await a
    .put("/api/profile")
    .set("Origin", "https://other.example")
    .send({ needs: [], saved: [] })
    .expect(403);
});
test("parallel duplicate reservations keep a single place booked", async () => {
  const id = events[1]._id;
  const payload = { name: "Demo Guest", email: "guest@example.com" };
  const r = await Promise.all([
    a.post(`/api/events/${id}/bookings`).send(payload),
    a.post(`/api/events/${id}/bookings`).send(payload),
  ]);
  assert.deepEqual(r.map((x) => x.status).sort(), [201, 409]);
  const state = await a.get("/api/bootstrap");
  assert.equal(state.body.events.find((e) => e._id === id).booked, 1);
});

test("organisers can create and edit events with nullable access information", async () => {
  const payload = {
    title: "An accessible community afternoon",
    category: "Culture",
    description:
      "A relaxed community gathering with a short storytelling session and refreshments.",
    venue: "Demo community hall",
    area: "Jayanagar",
    date: new Date(Date.now() + 86400000).toISOString(),
    duration: 90,
    price: 0,
    capacity: 1,
    access: {
      stepFree: true,
      quiet: true,
      seating: true,
      transit: false,
      toilet: null,
      signLanguage: null,
    },
    accessNotes: "Level entrance. Restroom access has not yet been confirmed.",
    transport: "A bus stop is five minutes away.",
    noise: "Quiet discussion without music.",
  };
  const created = await a.post("/api/events").send(payload).expect(201);
  assert.equal(created.body.access.toilet, null);
  const id = created.body._id;
  await a
    .put(`/api/events/${id}`)
    .send({ ...payload, title: "Updated community afternoon" })
    .expect(200);
  await a
    .post(`/api/events/${id}/bookings`)
    .send({ name: "Demo Guest", email: "guest@example.com" })
    .expect(201);
  const state = await a.get("/api/bootstrap");
  const event = state.body.events.find((e) => e._id === id);
  assert.equal(event.title, "Updated community afternoon");
  assert.equal(event.booked, 1);
  assert.equal(event.capacity, 1);
  await a
    .put(`/api/events/${id}`)
    .send({ ...payload, capacity: 0 })
    .expect(400);
  await b.put(`/api/events/${id}`).send(payload).expect(404);
});

test("unconfigured deployments expose an explicit read-only preview and reject writes", async () => {
  const uri = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;
  try {
    const preview = await request(app).get("/api/bootstrap").expect(200);
    assert.equal(preview.body.preview, true);
    assert.equal(preview.body.events.length, 6);
    assert.equal(preview.body.events[0].booked, 0);
    await request(app)
      .put("/api/profile")
      .send({ needs: [], saved: [] })
      .expect(503);
  } finally {
    process.env.MONGODB_URI = uri;
  }
});
