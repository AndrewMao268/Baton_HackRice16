// Loads variables from .env into process.env (GEMINI_API_KEY, SLACK_WEBHOOK_URL)
// This MUST be the first line so every other file can read those variables.
require('dotenv').config();

const express = require('express');
const path = require('path');
const handoffRoutes = require('./routes/handoff');

const app = express();

// Lets us read JSON bodies sent from the extension/website (req.body)
app.use(express.json());

// Allow the Chrome extension to call this server (browsers block cross-origin
// requests by default, so the server has to explicitly opt in).
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.startsWith('chrome-extension://')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serves everything in /public as a plain website (index.html, app.js, style.css)
app.use(express.static(path.join(__dirname, 'public')));

// All the actual API logic lives in routes/handoff.js
app.use('/api', handoffRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Baton Pass server running on http://localhost:${PORT}`);
});

