const isISODate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export class EventService {
  constructor(eventRepository, eventTypeRepository) {
    this.eventRepository = eventRepository;
    this.eventTypeRepository = eventTypeRepository;
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

    if (!input.eventTypeId?.trim()) {
      throw new Error("eventTypeId is required");
    }

    const knownTypes = await this.eventTypeRepository.list();
    if (!knownTypes.some((eventType) => eventType.id === input.eventTypeId)) {
      throw new Error("eventTypeId does not exist");
    }

    return this.eventRepository.create({
      title: input.title.trim(),
      date: input.date,
      eventTypeId: input.eventTypeId,
      details: input.details?.trim() ?? ""
    });
  }
}
