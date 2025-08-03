import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import jwt from "jsonwebtoken"
import fetch from "node-fetch"

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || "secret"

const users = [
  { id: 1, username: "demo", password: "password", favoriteDriver: "1" },
]

const app = express()
app.use(cors())
app.use(express.json())

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"]
  if (!authHeader) {
    console.log("Authentication failed: missing Authorization header")
    return res.sendStatus(401)
  }
  const token = authHeader.split(" ")[1]
  try {
    const user = jwt.verify(token, JWT_SECRET)
    console.log("Authenticated request for user", user.id)
    req.user = user
    next()
  } catch (err) {
    console.log("Authentication failed:", err.message)
    return res.sendStatus(403)
  }
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body
  console.log("Login attempt for", username)
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) {
    console.log("Login failed for", username)
    return res.status(401).json({ message: "Invalid credentials" })
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" })
  console.log("Login successful for", username)
  res.json({ token })
})

app.get("/api/favorite", authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  console.log("User", req.user.id, "requested favorite driver", user.favoriteDriver)
  res.json({ favoriteDriver: user.favoriteDriver })
})

app.post("/api/favorite", authenticate, (req, res) => {
  const { favoriteDriver } = req.body
  const user = users.find((u) => u.id === req.user.id)
  console.log("Updating favorite driver for user", req.user.id, "to", favoriteDriver)
  user.favoriteDriver = favoriteDriver
  res.json({ favoriteDriver })
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    console.log("Socket connection rejected: missing token")
    return next(new Error("unauthorized"))
  }
  try {
    const user = jwt.verify(token, JWT_SECRET)
    socket.user = user
    console.log("Socket authenticated for user", user.id)
    next()
  } catch (err) {
    console.log("Socket authentication failed:", err.message)
    next(new Error("unauthorized"))
  }
})

io.on("connection", async (socket) => {
  const user = users.find((u) => u.id === socket.user.id)
  console.log("Socket connected for user", user.id)

  const fetchAndEmit = async () => {
    if (!user.favoriteDriver) {
      console.log("User", user.id, "has no favorite driver set")
      return
    }
    try {
      console.log("Fetching data for driver", user.favoriteDriver)
      const session = await fetchLatestSession()
      console.log("Fetched latest session", session.session_key)
      const data = await fetchDriverData(user.favoriteDriver, session)
      socket.emit("telemetry", data)
      console.log("Emitted telemetry for driver", user.favoriteDriver)
    } catch (err) {
      console.error("Telemetry fetch/emit error:", err)
    }
  }

  const interval = setInterval(fetchAndEmit, 5000)
  await fetchAndEmit()

  socket.on("disconnect", () => {
    console.log("Socket disconnected for user", user.id)
    clearInterval(interval)
  })
})

async function fetchLatestSession() {
  console.log("Fetching latest session from OpenF1 API")
  const res = await fetch(
    "https://api.openf1.org/v1/sessions?session_key=latest"
  )
  const json = await res.json()
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error("No sessions found from OpenF1 API")
  }
  console.log("Latest session fetched", json[0].session_key)
  return json[0]
}

async function fetchDriverData(driverNumber, session) {
  if (!session || !session.session_key)
    throw new Error("Invalid session object")

  console.log(
    "Fetching driver data for",
    driverNumber,
    "in session",
    session.session_key
  )
  const lapRes = await fetch(
    `https://api.openf1.org/v1/laps?session_key=${session.session_key}&driver_number=${driverNumber}&order_by=-lap_number&limit=1`
  )
  const lapJson = await lapRes.json()
  const lap = Array.isArray(lapJson) && lapJson.length > 0 ? lapJson[0] : null
  console.log("Latest lap", lap ? lap.lap_number : "none")

  const telemetryRes = await fetch(
    `https://api.openf1.org/v1/telemetry?session_key=${session.session_key}&driver_number=${driverNumber}&order_by=-date&limit=1`
  )
  const telemetryJson = await telemetryRes.json()
  const telemetry =
    Array.isArray(telemetryJson) && telemetryJson.length > 0
      ? telemetryJson[0]
      : null
  console.log("Latest telemetry timestamp", telemetry ? telemetry.date : "none")

  return { lap, telemetry }
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
