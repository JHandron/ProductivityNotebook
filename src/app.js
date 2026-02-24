import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createEventsRouter } from "./routes/events.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = ({ eventService }) => {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, "../public")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/events", createEventsRouter(eventService));

  return app;
};
