import { Router } from "express";

export const createEventTypesRouter = (eventTypeService) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    const eventTypes = await eventTypeService.list();
    res.json({ eventTypes });
  });

  router.post("/", async (req, res) => {
    try {
      const eventType = await eventTypeService.create(req.body);
      res.status(201).json({ eventType });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};
