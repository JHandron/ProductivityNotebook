import { Router } from "express";

export const createEventsRouter = (eventService) => {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
      const startDate = req.query.startDate ?? monthStart.toISOString().slice(0, 10);
      const endDate = req.query.endDate ?? monthEnd.toISOString().slice(0, 10);

      const events = await eventService.listByDateRange({ startDate, endDate });
      res.json({ events });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const event = await eventService.create(req.body);
      res.status(201).json({ event });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};
