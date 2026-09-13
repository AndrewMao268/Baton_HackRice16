// Calls Google's Gemini API to turn raw activity into a 3-bullet handoff summary.
// The API key is read from process.env, which comes from your .env file.
// It never appears in any file that gets sent to the browser or the extension.

async function summarizeWithGemini({ tabs = [], commits = [], drafts = [] }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Check your .env file.');
  }

  const prompt = `
You are summarizing a work handoff for a teammate in a different timezone.

Open browser tabs:
${tabs.join('\n') || 'none'}

Recent git commits:
${commits.join('\n') || 'none'}

Drafted documents (titles/snippets):
${drafts.join('\n') || 'none'}

Write exactly 3 short bullet points covering:
1. What was finished
2. What is blocked (if anything)
3. Who should pick it up next, or what to check

Keep the whole thing under 60 words. No preamble, just the 3 bullets.
`;

  // NOTE: check https://ai.google.dev/gemini-api/docs/models for the current
  // recommended model name if this one has been renamed/retired.
  const MODEL = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return (text || 'No summary generated.').trim();
}

module.exports = { summarizeWithGemini };
