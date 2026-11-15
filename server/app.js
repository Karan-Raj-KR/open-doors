import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { randomBytes, randomUUID } from "node:crypto";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import { Event, Booking, Profile, connectDB } from "./models.js";
import { seedEvents, accessOptions } from "./data.js";
import {
  eventInput,
  bookingInput,
  profileInput,
  matchEvent,
} from "./validation.js";
const app = express();
const secret =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? null
    : randomBytes(32).toString("hex"));
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "24kb" }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 180,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", database: "MongoDB", app: "Open Doors" });
  } catch {
    res
      .status(503)
      .json({ status: "unavailable", message: "MongoDB is not connected." });
  }
});
app.use("/api", async (req, res, next) => {
  try {
    if (!secret || secret.length < 32)
      return res.status(503).json({
        message:
          "The server needs a SESSION_SECRET before it can accept visitors.",
      });
    if (!["GET", "HEAD"].includes(req.method)) {
      const origin = req.get("origin");
      if (
        origin &&
        new URL(origin).host !== req.get("host") &&
        !(
          process.env.NODE_ENV !== "production" &&
          origin === "http://localhost:5173"
        )
      )
        return res.status(403).json({
          message: "This request must come from the Open Doors website.",
        });
    }
    let session;
    try {
      session = jwt.verify(req.cookies.od_session || "", secret, {
        algorithms: ["HS256"],
      });
    } catch {}
    if (!session) {
      session = { workspace: randomUUID() };
      res.cookie(
        "od_session",
        jwt.sign(session, secret, { expiresIn: "7d", algorithm: "HS256" }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 86400000,
          path: "/",
        },
      );
    }
    req.workspace = session.workspace;
    await connectDB();
    if (!(await Event.exists({ workspace: req.workspace }))) {
      try {
        await Event.insertMany(
          seedEvents().map((e) => ({ ...e, workspace: req.workspace })),
          { ordered: false },
        );
      } catch (e) {
        if (e.code !== 11000 && !e.writeErrors?.every((x) => x.code === 11000))
          throw e;
      }
    }
    next();
  } catch (e) {
    next(e);
  }
});
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);
const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id)
    ? next()
    : res.status(400).json({ message: "That event ID is invalid." });
app.get(
  "/api/bootstrap",
  wrap(async (req, res) => {
    const [events, profile, bookings] = await Promise.all([
      Event.find({ workspace: req.workspace }).sort({ date: 1 }).lean(),
      Profile.findOne({ workspace: req.workspace }).lean(),
      Booking.find({ workspace: req.workspace })
        .select("-email -note -workspace")
        .lean(),
    ]);
    res.json({
      events,
      profile: profile || { needs: [], saved: [] },
      bookings,
      accessOptions,
      demo: true,
    });
  }),
);
app.get(
  "/api/events",
  wrap(async (req, res) => {
    const needs = String(req.query.needs || "")
      .split(",")
      .filter((k) => accessOptions.some((a) => a.key === k));
    let events = await Event.find({ workspace: req.workspace })
      .sort({ date: 1 })
      .lean();
    if (req.query.q) {
      const q = String(req.query.q).slice(0, 100).toLowerCase();
      events = events.filter((e) =>
        `${e.title} ${e.area} ${e.venue}`.toLowerCase().includes(q),
      );
    }
    if (req.query.category)
      events = events.filter((e) => e.category === req.query.category);
    events = events.map((e) => ({ ...e, match: matchEvent(e, needs) }));
    if (req.query.match === "true")
      events = events.filter((e) => e.match.score === 100);
    res.json(events);
  }),
);
app.put(
  "/api/profile",
  wrap(async (req, res) => {
    const data = profileInput.parse(req.body);
    const p = await Profile.findOneAndUpdate(
      { workspace: req.workspace },
      data,
      { upsert: true, returnDocument: "after", runValidators: true },
    );
    res.json(p);
  }),
);
app.post(
  "/api/events",
  wrap(async (req, res) => {
    const data = eventInput.parse(req.body);
    const e = await Event.create({
      ...data,
      workspace: req.workspace,
      slug: randomUUID(),
      image: "garden",
      color: "#d9e0cd",
      host: "Your community",
      updates: [
        { text: "Event published. Access details provided by the organiser." },
      ],
    });
    res.status(201).json(e);
  }),
);
app.put(
  "/api/events/:id",
  validId,
  wrap(async (req, res) => {
    const data = eventInput.parse(req.body);
    const e = await Event.findOne({
      workspace: req.workspace,
      _id: req.params.id,
    });
    if (!e) return res.status(404).json({ message: "Event not found." });
    if (data.capacity < e.booked)
      return res.status(409).json({
        message: "Capacity cannot be below the number of existing bookings.",
      });
    Object.assign(e, data);
    await e.save();
    res.json(e);
  }),
);
app.post(
  "/api/events/:id/updates",
  validId,
  wrap(async (req, res) => {
    const text = String(req.body.text || "").trim();
    if (text.length < 5 || text.length > 1000)
      return res
        .status(400)
        .json({ message: "Write an update between 5 and 1,000 characters." });
    const e = await Event.findOneAndUpdate(
      { workspace: req.workspace, _id: req.params.id },
      {
        $push: {
          updates: { $each: [{ text, createdAt: new Date() }], $slice: -30 },
        },
      },
      { returnDocument: "after" },
    );
    if (!e) return res.status(404).json({ message: "Event not found." });
    res.json(e);
  }),
);
app.post(
  "/api/events/:id/bookings",
  validId,
  wrap(async (req, res) => {
    const data = bookingInput.parse(req.body);
    const filter = { workspace: req.workspace, eventId: req.params.id };
    const existing = await Booking.findOne(filter);
    if (existing)
      return res
        .status(409)
        .json({ message: "You already have a place at this event." });
    const e = await Event.findOneAndUpdate(
      {
        workspace: req.workspace,
        _id: req.params.id,
        date: { $gt: new Date() },
        $expr: { $lt: ["$booked", "$capacity"] },
      },
      { $inc: { booked: 1 } },
      { returnDocument: "after" },
    );
    if (!e)
      return res.status(409).json({
        message: "This event is full, has ended, or is no longer available.",
      });
    try {
      const booking = await Booking.create({
        ...data,
        ...filter,
        reference: `OD-${randomBytes(3).toString("hex").toUpperCase()}`,
      });
      res.status(201).json(booking);
    } catch (err) {
      await Event.updateOne({ _id: e._id }, { $inc: { booked: -1 } });
      if (err.code === 11000)
        return res
          .status(409)
          .json({ message: "You already have a place at this event." });
      throw err;
    }
  }),
);
app.delete(
  "/api/events/:id/bookings",
  validId,
  wrap(async (req, res) => {
    const b = await Booking.findOneAndDelete({
      workspace: req.workspace,
      eventId: req.params.id,
    });
    if (!b) return res.status(404).json({ message: "No booking found." });
    await Event.updateOne(
      { _id: req.params.id, workspace: req.workspace, booked: { $gt: 0 } },
      { $inc: { booked: -1 } },
    );
    res.json({ message: "Your place has been released." });
  }),
);
app.use("/api", (req, res) =>
  res.status(404).json({ message: "This API route does not exist." }),
);
app.use((err, req, res, next) => {
  if (err.name === "ZodError")
    return res.status(400).json({
      message: "Please check the form details.",
      errors: err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  if (err.type === "entity.parse.failed")
    return res
      .status(400)
      .json({ message: "Request body must be valid JSON." });
  console.error("API error:", err.name, err.code || "");
  res.status(503).json({
    message:
      "The service is temporarily unavailable. Please try again shortly.",
  });
});
export default app;
