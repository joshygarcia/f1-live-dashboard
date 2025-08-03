# F1 Live Dashboard

This project is an MVP for a real-time Formula 1 race dashboard.

## Prerequisites
- Node.js 18+
- npm 9+

## Packages
- `backend` – Node.js/Express server with JWT auth and Socket.IO streaming from the OpenF1 API.
- `frontend` – React dashboard using D3.js for charts.

## Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The backend runs on http://localhost:3000 and the frontend on http://localhost:5173.

A seed user exists:

```
username: demo
password: password
```

## Testing

Each package includes a simple test script to confirm Node.js is available:

```bash
cd backend
npm test

cd frontend
npm test
```
