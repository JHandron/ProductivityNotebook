import test from "node:test";
import assert from "node:assert/strict";
import { NoteService } from "../src/services/noteService.js";

class FakeNoteRepository {
  constructor() {
    this.notes = [];
  }

  async listByDateRange(startDate, endDate) {
    return this.notes.filter((note) => note.date >= startDate && note.date <= endDate);
  }

  async upsert(input) {
    const existing = this.notes.find((note) => note.date === input.date);
    if (existing) {
      existing.content = input.content;
      return existing;
    }

    const created = { id: `${this.notes.length + 1}`, ...input };
    this.notes.push(created);
    return created;
  }
}

test("upserts daily notes by date", async () => {
  const repository = new FakeNoteRepository();
  const service = new NoteService(repository);

  await service.upsert({ date: "2026-01-02", content: "Weight - 147.6 lbs." });
  await service.upsert({ date: "2026-01-02", content: "Weight - 147.1 lbs." });

  const notes = await service.listByDateRange({ startDate: "2026-01-01", endDate: "2026-01-31" });
  assert.equal(notes.length, 1);
  assert.equal(notes[0].content, "Weight - 147.1 lbs.");
});
