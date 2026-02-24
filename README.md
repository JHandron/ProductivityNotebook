# Productivity Notebook (Node + Express + Vanilla JS + MongoDB-ready)

This is a starter implementation of your 3-point plan:

1. Node + Express + Vanilla JS + MongoDB
2. Clean architecture (API -> service -> persistence)
3. Easy swap from MongoDB to SQLite later by replacing persistence adapters

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
- `src/persistence` - repositories/adapters (MongoDB or other DBs)
- `public` - HTML/CSS/vanilla JS frontend

## Initial API

- `GET /api/health`
- `GET /api/events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `POST /api/events`

Example create payload:

```json
{
  "title": "Leg Day",
  "date": "2026-01-05",
  "eventType": "Workout",
  "details": "Squat + accessories"
}
```
