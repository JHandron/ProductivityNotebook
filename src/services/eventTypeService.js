const isHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(value);

export class EventTypeService {
  constructor(eventTypeRepository) {
    this.eventTypeRepository = eventTypeRepository;
  }

  async list() {
    return this.eventTypeRepository.list();
  }

  async create(input) {
    if (!input.name?.trim()) {
      throw new Error("name is required");
    }
    if (!isHexColor(input.colorHex)) {
      throw new Error("colorHex must be a 6-digit hex color (e.g. #2563eb)");
    }

    return this.eventTypeRepository.create({ name: input.name.trim(), colorHex: input.colorHex });
  }
}
