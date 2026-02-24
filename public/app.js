const form = document.querySelector("#event-form");
const list = document.querySelector("#events-list");

const renderEvents = (events) => {
  list.innerHTML = "";

  if (!events.length) {
    list.innerHTML = "<li>No events yet for this month.</li>";
    return;
  }

  for (const event of events) {
    const item = document.createElement("li");
    item.textContent = `${event.date} — [${event.eventType}] ${event.title}`;
    list.appendChild(item);
  }
};

const loadEvents = async () => {
  const response = await fetch("/api/events");
  const payload = await response.json();
  renderEvents(payload.events ?? []);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const body = Object.fromEntries(formData.entries());

  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = await response.json();
    alert(payload.message ?? "Failed to create event");
    return;
  }

  form.reset();
  await loadEvents();
});

loadEvents();
