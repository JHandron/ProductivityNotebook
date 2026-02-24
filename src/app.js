import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createEventsRouter } from "./routes/events.js";
import { createEventTypesRouter } from "./routes/eventTypes.js";
import { createNotesRouter } from "./routes/notes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = ({ eventService, eventTypeService, noteService }) => {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, "../public")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/events", createEventsRouter(eventService));
  app.use("/api/event-types", createEventTypesRouter(eventTypeService));
  app.use("/api/notes", createNotesRouter(noteService));

  return app;
};
