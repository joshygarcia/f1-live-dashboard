# F1 Live Dashboard

This project is an MVP (Minimum Viable Product) for a **real-time Formula 1 race dashboard** with live telemetry and user customization.

---

## 🚦 Features

* **User authentication** (JWT-based)
* **Live telemetry and lap data** for drivers via Socket.IO
* **User profile & favorite driver selection**
* **Interactive charts** (D3.js) for telemetry and lap times
* **Session selection:** View data from live or historic races
* **Planned:**

  * Real-time race position map
  * Customizable dashboard layout
  * Notifications for key events (pit stops, overtakes, crashes)
  * Multi-user support
  * (If possible) Push notification integration
* **Fallback:** Historical data viewing when live access is not available

---

## Prerequisites

* Node.js 18+
* npm 9+

---

## Packages

* **backend** – Node.js/Express server with JWT auth and Socket.IO streaming from OpenF1 API
* **frontend** – React dashboard using D3.js for charts

---

## Development Setup

### Backend

```sh
cd backend
npm install
npm run dev
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```

* Backend: [http://localhost:3000](http://localhost:3000)
* Frontend: [http://localhost:5173](http://localhost:5173)

---

## Seed User

A default user is pre-configured for quick login:

* **username:** demo
* **password:** password

---

## Testing

Each package includes a simple test script to confirm Node.js is available:

```sh
cd backend
npm test

cd frontend
npm test
```

---

## ⚠️ **Note on Live Data**

* **Live, real-time data from the OpenF1 API now requires a paid subscription.**
* For development, you can use **historic (past) data** for free.
* See the [OpenF1 website](https://openf1.org/) for more info and access requests.

---

Let me know if you want a **sample screenshot section, tech stack badges, or more project details**! If you have more planned features, just drop them here and I’ll add them.
