import test from "node:test";
import assert from "node:assert/strict";
import { EventService } from "../src/services/eventService.js";

class FakeEventRepository {
  constructor() {
    this.events = [];
  }

  async listByDateRange(startDate, endDate) {
    return this.events.filter((event) => event.date >= startDate && event.date <= endDate);
  }

  async create(event) {
    const created = { ...event, id: "1" };
    this.events.push(created);
    return created;
  }
}

class FakeEventTypeRepository {
  async list() {
    return [{ id: "type-workout", name: "Workout", colorHex: "#2563eb" }];
  }
}

test("creates and lists events in range", async () => {
  const repo = new FakeEventRepository();
  const eventTypeRepo = new FakeEventTypeRepository();
  const service = new EventService(repo, eventTypeRepo);

  await service.create({
    title: "Walk",
    date: "2026-01-02",
    eventTypeId: "type-workout",
    details: ""
  });
  const events = await service.listByDateRange({ startDate: "2026-01-01", endDate: "2026-01-31" });

  assert.equal(events.length, 1);
  assert.equal(events[0].title, "Walk");
});

test("validates date format", async () => {
  const repo = new FakeEventRepository();
  const eventTypeRepo = new FakeEventTypeRepository();
  const service = new EventService(repo, eventTypeRepo);

  await assert.rejects(() =>
    service.create({ title: "Walk", date: "01/02/2026", eventTypeId: "type-workout" })
  );
});

test("rejects unknown eventTypeId", async () => {
  const repo = new FakeEventRepository();
  const eventTypeRepo = new FakeEventTypeRepository();
  const service = new EventService(repo, eventTypeRepo);

  await assert.rejects(() =>
    service.create({ title: "Walk", date: "2026-01-02", eventTypeId: "missing-type" })
  );
});
