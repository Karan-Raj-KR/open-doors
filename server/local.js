import "dotenv/config";
import { mkdirSync } from "node:fs";
if (!process.env.MONGODB_URI) {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mkdirSync(".data/mongo", { recursive: true });
  const db = await MongoMemoryServer.create({
    instance: { dbPath: ".data/mongo", storageEngine: "wiredTiger" },
    binary: { downloadDir: "/private/tmp/open-doors-mongodb" },
  });
  process.env.MONGODB_URI = db.getUri("opendoors");
  console.log("Local MongoDB ready (data stored in .data/mongo).");
  for (const signal of ["SIGTERM", "SIGINT"])
    process.on(signal, async () => {
      await db.stop({ doCleanup: false });
      process.exit(0);
    });
}
const { default: app } = await import("./app.js");
if (process.env.NODE_ENV === "production")
  app.use((await import("express")).default.static("dist"));
app.listen(process.env.PORT || 3001, () =>
  console.log(`Open Doors API listening on port ${process.env.PORT || 3001}`),
);
