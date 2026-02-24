# Productivity Notebook (Node + Express + Vanilla JS + MongoDB-ready)

This project now includes a working month-grid starter with:

- Event types (name + color)
- Color-coded daily event occurrences
- Daily notes per date
- Month navigation and day selection

## IDE recommendation

**VS Code** is the best fit for this stack.

Recommended VS Code extensions:
- ESLint
- Prettier
- MongoDB for VS Code
- REST Client (optional, for API testing)

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MongoDB setup (optional)

By default, the app runs in-memory so you can start learning immediately.

To enable MongoDB, set:

```bash
export MONGO_URI='mongodb://127.0.0.1:27017'
export MONGO_DB_NAME='productivity_notebook'
npm run dev
```

## Project structure

- `src/routes` - Express route handlers (API layer)
- `src/services` - business logic (service layer)
- `src/persistence` - repositories/adapters (MongoDB or in-memory)
- `public` - HTML/CSS/vanilla JS frontend

## API

- `GET /api/health`
- `GET /api/event-types`
- `POST /api/event-types`
- `GET /api/events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `POST /api/events`
- `GET /api/notes?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `PUT /api/notes/:date`

Example create event type payload:

```json
{
  "name": "Workout",
  "colorHex": "#2563eb"
}
```

Example create event payload:

```json
{
  "title": "Leg Day",
  "date": "2026-01-05",
  "eventTypeId": "type-id-here",
  "details": "Squat + accessories"
}
```
