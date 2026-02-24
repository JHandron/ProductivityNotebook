import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { createRepositories } from "./persistence/eventRepository.js";
import { EventService } from "./services/eventService.js";
import { EventTypeService } from "./services/eventTypeService.js";
import { NoteService } from "./services/noteService.js";

const bootstrap = async () => {
  const { eventRepository, eventTypeRepository, noteRepository, close } = await createRepositories(env);
  const eventService = new EventService(eventRepository, eventTypeRepository);
  const eventTypeService = new EventTypeService(eventTypeRepository);
  const noteService = new NoteService(noteRepository);
  const app = createApp({ eventService, eventTypeService, noteService });

  const server = app.listen(env.port, () => {
    const mode = env.mongoUri ? "MongoDB" : "in-memory";
    console.log(`Productivity Notebook listening on http://localhost:${env.port} (${mode} mode)`);
  });

  const shutdown = async () => {
    await close();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});
