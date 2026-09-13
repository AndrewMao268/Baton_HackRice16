// Change this to your deployed backend URL once you deploy (e.g. Render/Railway).
// While developing locally, this points at your own machine.
const BACKEND_URL = 'http://localhost:3000';

document.getElementById('sendBtn').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const person = document.getElementById('person').value.trim();
  const project = document.getElementById('project').value.trim();

  if (!person || !project) {
    statusEl.textContent = 'Please enter your name and project.';
    return;
  }

  statusEl.textContent = 'Gathering tabs...';
  const tabs = await chrome.tabs.query({});
  const tabTitles = tabs.map(t => `${t.title} — ${t.url}`);

  statusEl.textContent = 'Sending to server...';

  try {
    const res = await fetch(`${BACKEND_URL}/api/handoff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        person,
        project,
        tabs: tabTitles,
        // Git commits and doc drafts aren't reachable from a browser extension
        // directly - see the README for how to wire those in later.
        commits: [],
        drafts: []
      })
    });

    const data = await res.json();
    statusEl.textContent = data.success ? 'Handoff posted!' : `Error: ${data.error || 'unknown'}`;
  } catch (err) {
    statusEl.textContent = 'Could not reach the server.';
  }
});
