import { Router } from "express";

export const createNotesRouter = (noteService) => {
  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const now = new Date();
      const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
      const startDate = req.query.startDate ?? monthStart.toISOString().slice(0, 10);
      const endDate = req.query.endDate ?? monthEnd.toISOString().slice(0, 10);

      const notes = await noteService.listByDateRange({ startDate, endDate });
      res.json({ notes });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.put("/:date", async (req, res) => {
    try {
      const note = await noteService.upsert({ date: req.params.date, content: req.body.content });
      res.json({ note });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};
