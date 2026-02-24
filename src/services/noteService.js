const isISODate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export class NoteService {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }

  async listByDateRange({ startDate, endDate }) {
    if (!isISODate(startDate) || !isISODate(endDate)) {
      throw new Error("startDate and endDate must be YYYY-MM-DD");
    }

    return this.noteRepository.listByDateRange(startDate, endDate);
  }

  async upsert(input) {
    if (!isISODate(input.date)) {
      throw new Error("date must be YYYY-MM-DD");
    }

    return this.noteRepository.upsert({ date: input.date, content: input.content?.trim() ?? "" });
  }
}
