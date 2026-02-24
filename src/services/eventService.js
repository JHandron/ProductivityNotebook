const isISODate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export class EventService {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async listByDateRange({ startDate, endDate }) {
    if (!isISODate(startDate) || !isISODate(endDate)) {
      throw new Error("startDate and endDate must be YYYY-MM-DD");
    }

    return this.eventRepository.listByDateRange(startDate, endDate);
  }

  async create(input) {
    if (!input.title?.trim()) {
      throw new Error("title is required");
    }

    if (!isISODate(input.date)) {
      throw new Error("date must be YYYY-MM-DD");
    }

    if (!input.eventType?.trim()) {
      throw new Error("eventType is required");
    }

    return this.eventRepository.create({
      title: input.title.trim(),
      date: input.date,
      eventType: input.eventType.trim(),
      details: input.details?.trim() ?? ""
    });
  }
}
