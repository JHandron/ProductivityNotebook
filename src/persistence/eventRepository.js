import crypto from "node:crypto";
import { MongoClient } from "mongodb";

export class InMemoryEventRepository {
  #events = [];

  async listByDateRange(startDate, endDate) {
    return this.#events.filter((event) => event.date >= startDate && event.date <= endDate);
  }

  async create(event) {
    const created = { ...event, id: crypto.randomUUID() };
    this.#events.push(created);
    return created;
  }
}

export class MongoEventRepository {
  #collection;

  constructor(collection) {
    this.#collection = collection;
  }

  async listByDateRange(startDate, endDate) {
    const docs = await this.#collection
      .find({ date: { $gte: startDate, $lte: endDate } })
      .sort({ date: 1 })
      .toArray();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      date: doc.date,
      eventType: doc.eventType,
      details: doc.details ?? ""
    }));
  }

  async create(event) {
    const result = await this.#collection.insertOne({
      title: event.title,
      date: event.date,
      eventType: event.eventType,
      details: event.details
    });

    return { ...event, id: result.insertedId.toString() };
  }
}

export const createEventRepository = async ({ mongoUri, mongoDbName }) => {
  if (!mongoUri) {
    return { repository: new InMemoryEventRepository(), close: async () => {} };
  }

  const client = new MongoClient(mongoUri);
  await client.connect();

  const collection = client.db(mongoDbName).collection("events");
  await collection.createIndex({ date: 1 });

  return {
    repository: new MongoEventRepository(collection),
    close: async () => client.close()
  };
};
