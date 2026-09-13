// This file only ever talks to OUR OWN backend (/api/...).
// It never calls Gemini or Slack directly, so it never needs a secret key.

async function loadHandoffs() {
  const project = document.getElementById('project').value;
  const person = document.getElementById('person').value;
  const status = document.getElementById('status').value;

  const params = new URLSearchParams();
  if (project) params.set('project', project);
  if (person) params.set('person', person);
  if (status) params.set('status', status);

  const res = await fetch(`/api/handoffs?${params.toString()}`);
  const handoffs = await res.json();

  const list = document.getElementById('list');

  if (handoffs.length === 0) {
    list.innerHTML = '<p>No handoffs found.</p>';
    return;
  }

  list.innerHTML = handoffs.map(h => `
    <div class="handoff-card">
      <h3>${h.project} — ${h.person}</h3>
      <p class="date">${new Date(h.createdAt).toLocaleString()}</p>
      <pre>${h.summary}</pre>
      ${h.updates.length ? `
        <div class="updates">
          <strong>Later updates:</strong>
          <ul>${h.updates.map(u => `<li>${u.note}</li>`).join('')}</ul>
        </div>` : ''
      }
    </div>
  `).join('');
}

loadHandoffs();
