const express = require('express');
const router = express.Router();

const { summarizeWithGemini } = require('../lib/gemini');
const { postToSlack } = require('../lib/slack');
const { addHandoff, getHandoffs, addUpdateToHandoff } = require('../lib/db');

// Called by the Chrome extension when someone clicks "Baton" at the end of their shift
router.post('/handoff', async (req, res) => {
  try {
    const { person, project, tabs, commits, drafts } = req.body;

    if (!person || !project) {
      return res.status(400).json({ error: 'person and project are required' });
    }

    const summary = await summarizeWithGemini({ tabs, commits, drafts });

    const handoff = {
      id: Date.now().toString(),
      person,
      project,
      summary,
      status: 'posted',
      createdAt: new Date().toISOString(),
      updates: []
    };

    await postToSlack(`*Handoff from ${person} (${project})*\n${summary}`);

    addHandoff(handoff);

    res.json({ success: true, handoff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong generating the handoff' });
  }
});

// Called by the website to list/search past handoffs
router.get('/handoffs', (req, res) => {
  const { project, person, status, date } = req.query;
  const results = getHandoffs({ project, person, status, date });
  res.json(results);
});

// Lets someone tack on a small late-breaking note to an existing handoff
router.post('/handoff/:id/update', (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ error: 'note is required' });
  }

  const updated = addUpdateToHandoff(id, note);
  if (!updated) return res.status(404).json({ error: 'Handoff not found' });

  res.json({ success: true, handoff: updated });
});

module.exports = router;
