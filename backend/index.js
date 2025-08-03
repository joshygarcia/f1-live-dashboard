import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const users = [
  { id: 1, username: 'demo', password: 'password', favoriteDriver: '1' }
];

const app = express();
app.use(cors());
app.use(express.json());

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/favorite', authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json({ favoriteDriver: user.favoriteDriver });
});

app.post('/api/favorite', authenticate, (req, res) => {
  const { favoriteDriver } = req.body;
  const user = users.find((u) => u.id === req.user.id);
  user.favoriteDriver = favoriteDriver;
  res.json({ favoriteDriver });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('unauthorized'));
  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('unauthorized'));
  }
});

io.on('connection', async (socket) => {
  const user = users.find((u) => u.id === socket.user.id);

  const fetchAndEmit = async () => {
    if (!user.favoriteDriver) return;
    try {
      const session = await fetchLatestSession();
      const data = await fetchDriverData(user.favoriteDriver, session);
      socket.emit('telemetry', data);
    } catch (err) {
      console.error(err);
    }
  };

  const interval = setInterval(fetchAndEmit, 5000);
  await fetchAndEmit();

  socket.on('disconnect', () => clearInterval(interval));
});

async function fetchLatestSession() {
  const res = await fetch(
    'https://api.openf1.org/v1/sessions?order_by=-session_key&limit=1'
  );
  const [session] = await res.json();
  return session;
}

async function fetchDriverData(driverNumber, session) {
  const lapRes = await fetch(
    `https://api.openf1.org/v1/laps?session_key=${session.session_key}&driver_number=${driverNumber}&order_by=-lap_number&limit=1`
  );
  const [lap] = await lapRes.json();
  const telemetryRes = await fetch(
    `https://api.openf1.org/v1/telemetry?session_key=${session.session_key}&driver_number=${driverNumber}&order_by=-date&limit=1`
  );
  const [telemetry] = await telemetryRes.json();
  return { lap, telemetry };
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
