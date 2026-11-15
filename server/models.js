import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    workspace: { type: String, required: true, index: true },
    slug: String,
    title: String,
    category: String,
    tagline: String,
    description: String,
    venue: String,
    area: String,
    date: Date,
    duration: Number,
    price: Number,
    capacity: Number,
    booked: { type: Number, default: 0 },
    image: String,
    color: String,
    host: String,
    access: {
      stepFree: { type: Boolean, default: null },
      quiet: { type: Boolean, default: null },
      seating: { type: Boolean, default: null },
      transit: { type: Boolean, default: null },
      toilet: { type: Boolean, default: null },
      signLanguage: { type: Boolean, default: null },
    },
    accessNotes: String,
    transport: String,
    noise: String,
    lat: Number,
    lng: Number,
    featured: Boolean,
    updates: [{ text: String, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true },
);
eventSchema.index({ workspace: 1, slug: 1 }, { unique: true });
const bookingSchema = new mongoose.Schema(
  {
    workspace: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    email: String,
    note: String,
    reference: String,
  },
  { timestamps: true },
);
bookingSchema.index({ workspace: 1, eventId: 1 }, { unique: true });
export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export const Profile =
  mongoose.models.Profile ||
  mongoose.model(
    "Profile",
    new mongoose.Schema({
      workspace: { type: String, unique: true },
      needs: [String],
      saved: [String],
    }),
  );
let promise;
export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error("MongoDB is not configured.");
  if (!promise)
    promise = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .catch((e) => {
        promise = null;
        throw e;
      });
  await promise;
  await Promise.all([Event.init(), Booking.init(), Profile.init()]);
}
