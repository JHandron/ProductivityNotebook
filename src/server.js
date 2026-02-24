import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { createEventRepository } from "./persistence/eventRepository.js";
import { EventService } from "./services/eventService.js";

const bootstrap = async () => {
  const { repository, close } = await createEventRepository(env);
  const eventService = new EventService(repository);
  const app = createApp({ eventService });

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
