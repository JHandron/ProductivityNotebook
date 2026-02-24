import crypto from "node:crypto";
import { MongoClient } from "mongodb";

const byName = (a, b) => a.name.localeCompare(b.name);

class InMemoryStore {
  eventTypes = [
    { id: crypto.randomUUID(), name: "Workout", colorHex: "#2563eb" },
    { id: crypto.randomUUID(), name: "Walk", colorHex: "#16a34a" }
  ];
  events = [];
  notes = [];
}

export class InMemoryEventRepository {
  constructor(store) {
    this.store = store;
  }

  async listByDateRange(startDate, endDate) {
    return this.store.events
      .filter((event) => event.date >= startDate && event.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async create(event) {
    const created = { ...event, id: crypto.randomUUID() };
    this.store.events.push(created);
    return created;
  }
}

export class InMemoryEventTypeRepository {
  constructor(store) {
    this.store = store;
  }

  async list() {
    return [...this.store.eventTypes].sort(byName);
  }

  async create(eventType) {
    const created = { ...eventType, id: crypto.randomUUID() };
    this.store.eventTypes.push(created);
    return created;
  }
}

export class InMemoryNoteRepository {
  constructor(store) {
    this.store = store;
  }

  async listByDateRange(startDate, endDate) {
    return this.store.notes
      .filter((note) => note.date >= startDate && note.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async upsert(noteInput) {
    const existing = this.store.notes.find((note) => note.date === noteInput.date);
    if (existing) {
      existing.content = noteInput.content;
      return existing;
    }

    const created = { id: crypto.randomUUID(), ...noteInput };
    this.store.notes.push(created);
    return created;
  }
}

export class MongoEventRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async listByDateRange(startDate, endDate) {
    const docs = await this.collection.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }).toArray();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      date: doc.date,
      eventTypeId: doc.eventTypeId,
      details: doc.details ?? ""
    }));
  }

  async create(event) {
    const result = await this.collection.insertOne(event);
    return { ...event, id: result.insertedId.toString() };
  }
}

export class MongoEventTypeRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async list() {
    const docs = await this.collection.find({}).sort({ name: 1 }).toArray();
    return docs.map((doc) => ({ id: doc._id.toString(), name: doc.name, colorHex: doc.colorHex }));
  }

  async create(eventType) {
    const result = await this.collection.insertOne(eventType);
    return { ...eventType, id: result.insertedId.toString() };
  }
}

export class MongoNoteRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async listByDateRange(startDate, endDate) {
    const docs = await this.collection.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }).toArray();
    return docs.map((doc) => ({ id: doc._id.toString(), date: doc.date, content: doc.content }));
  }

  async upsert(noteInput) {
    await this.collection.updateOne(
      { date: noteInput.date },
      { $set: { content: noteInput.content } },
      { upsert: true }
    );

    const doc = await this.collection.findOne({ date: noteInput.date });
    return { id: doc._id.toString(), date: doc.date, content: doc.content };
  }
}

export const createRepositories = async ({ mongoUri, mongoDbName }) => {
  if (!mongoUri) {
    const store = new InMemoryStore();
    return {
      eventRepository: new InMemoryEventRepository(store),
      eventTypeRepository: new InMemoryEventTypeRepository(store),
      noteRepository: new InMemoryNoteRepository(store),
      close: async () => {}
    };
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(mongoDbName);

  const events = db.collection("events");
  const eventTypes = db.collection("eventTypes");
  const notes = db.collection("notes");

  await Promise.all([
    events.createIndex({ date: 1 }),
    eventTypes.createIndex({ name: 1 }, { unique: true }),
    notes.createIndex({ date: 1 }, { unique: true })
  ]);

  return {
    eventRepository: new MongoEventRepository(events),
    eventTypeRepository: new MongoEventTypeRepository(eventTypes),
    noteRepository: new MongoNoteRepository(notes),
    close: async () => client.close()
  };
};
