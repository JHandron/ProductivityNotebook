const state = {
  monthCursor: new Date(),
  selectedDate: null,
  eventTypes: [],
  events: [],
  notes: []
};

const monthLabel = document.querySelector("#month-label");
const calendarGrid = document.querySelector("#calendar-grid");
const eventTypeList = document.querySelector("#event-types-list");
const eventTypeSelect = document.querySelector("#event-type-select");
const selectedDateLabel = document.querySelector("#selected-date-label");
const eventForm = document.querySelector("#event-form");
const noteForm = document.querySelector("#note-form");

const toISODate = (date) => date.toISOString().slice(0, 10);

const monthRange = (cursor) => {
  const start = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1));
  const end = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
  return { startDate: toISODate(start), endDate: toISODate(end), start, end };
};

const getEventType = (id) => state.eventTypes.find((eventType) => eventType.id === id);

const renderEventTypes = () => {
  eventTypeList.innerHTML = "";
  eventTypeSelect.innerHTML = "";

  for (const eventType of state.eventTypes) {
    const item = document.createElement("li");
    item.innerHTML = `<span class="event-dot" style="background:${eventType.colorHex}"></span>${eventType.name}`;
    eventTypeList.appendChild(item);

    const option = document.createElement("option");
    option.value = eventType.id;
    option.textContent = eventType.name;
    eventTypeSelect.appendChild(option);
  }
};

const renderCalendar = () => {
  calendarGrid.innerHTML = "";
  const { start, end } = monthRange(state.monthCursor);
  monthLabel.textContent = state.monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  for (let day = start.getUTCDate(); day <= end.getUTCDate(); day += 1) {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), day));
    const dateKey = toISODate(date);

    const dayEvents = state.events.filter((event) => event.date === dateKey);
    const note = state.notes.find((entry) => entry.date === dateKey);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `day-cell ${state.selectedDate === dateKey ? "selected" : ""}`;
    cell.dataset.date = dateKey;

    const eventLines = dayEvents
      .map((event) => {
        const eventType = getEventType(event.eventTypeId);
        const color = eventType?.colorHex ?? "#94a3b8";
        const name = eventType?.name ?? "Unknown";
        return `<div class="event-line"><span class="event-dot" style="background:${color}"></span>${name}: ${event.title}</div>`;
      })
      .join("");

    const noteMarker = note?.content ? `<div class="note-marker">📝 Note</div>` : "";

    cell.innerHTML = `<div class="day-num">${day}</div>${eventLines}${noteMarker}`;
    cell.addEventListener("click", () => {
      state.selectedDate = dateKey;
      selectedDateLabel.textContent = `Selected: ${dateKey}`;
      noteForm.elements.content.value = note?.content ?? "";
      renderCalendar();
    });

    calendarGrid.appendChild(cell);
  }
};

const loadMonthData = async () => {
  const { startDate, endDate } = monthRange(state.monthCursor);
  const params = new URLSearchParams({ startDate, endDate }).toString();

  const [eventTypesRes, eventsRes, notesRes] = await Promise.all([
    fetch("/api/event-types"),
    fetch(`/api/events?${params}`),
    fetch(`/api/notes?${params}`)
  ]);

  state.eventTypes = (await eventTypesRes.json()).eventTypes;
  state.events = (await eventsRes.json()).events;
  state.notes = (await notesRes.json()).notes;

  renderEventTypes();
  renderCalendar();
};

document.querySelector("#prev-month").addEventListener("click", async () => {
  state.monthCursor = new Date(Date.UTC(state.monthCursor.getUTCFullYear(), state.monthCursor.getUTCMonth() - 1, 1));
  await loadMonthData();
});

document.querySelector("#next-month").addEventListener("click", async () => {
  state.monthCursor = new Date(Date.UTC(state.monthCursor.getUTCFullYear(), state.monthCursor.getUTCMonth() + 1, 1));
  await loadMonthData();
});

document.querySelector("#event-type-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(event.target).entries());

  const response = await fetch("/api/event-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    alert((await response.json()).message ?? "Failed to add event type");
    return;
  }

  event.target.reset();
  await loadMonthData();
});

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedDate) {
    alert("Select a day in the calendar first.");
    return;
  }

  const body = Object.fromEntries(new FormData(eventForm).entries());
  body.date = state.selectedDate;

  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    alert((await response.json()).message ?? "Failed to create event");
    return;
  }

  eventForm.reset();
  await loadMonthData();
});

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.selectedDate) {
    alert("Select a day in the calendar first.");
    return;
  }

  const body = Object.fromEntries(new FormData(noteForm).entries());

  const response = await fetch(`/api/notes/${state.selectedDate}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    alert((await response.json()).message ?? "Failed to save note");
    return;
  }

  await loadMonthData();
});

await loadMonthData();
