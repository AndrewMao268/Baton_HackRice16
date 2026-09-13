// A deliberately simple "database": one JSON file holding an array of handoffs.
// Good enough for a small team / prototype. When you outgrow it, swap this
// file for a real database (e.g. Postgres) without changing routes/handoff.js -
// that's the point of keeping storage behind these few functions.

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'handoffs.json');

function ensureDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
}

function readAll() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeAll(handoffs) {
  fs.writeFileSync(DB_FILE, JSON.stringify(handoffs, null, 2));
}

function addHandoff(handoff) {
  const all = readAll();
  all.push(handoff);
  writeAll(all);
  return handoff;
}

// Supports the "searchable by project, person, date, status" requirement
function getHandoffs({ project, person, status, date } = {}) {
  let all = readAll();
  if (project) all = all.filter(h => h.project.toLowerCase() === project.toLowerCase());
  if (person) all = all.filter(h => h.person.toLowerCase() === person.toLowerCase());
  if (status) all = all.filter(h => h.status === status);
  if (date) all = all.filter(h => h.createdAt.startsWith(date)); // date as "2026-09-11"
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Lets someone append a small late-breaking note without creating a whole new handoff
function addUpdateToHandoff(id, note) {
  const all = readAll();
  const handoff = all.find(h => h.id === id);
  if (!handoff) return null;
  handoff.updates.push({ note, addedAt: new Date().toISOString() });
  writeAll(all);
  return handoff;
}

module.exports = { addHandoff, getHandoffs, addUpdateToHandoff };
