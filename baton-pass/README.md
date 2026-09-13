# Baton Pass — setup guide

This is a working starter project: a backend server, a website, and a Chrome
extension. Follow these steps in order.

## 1. Install Node.js

Download and install Node.js (v18 or later) from https://nodejs.org if you
don't have it. Check it worked:

```
node -v
```

## 2. Install project dependencies

From inside the `baton-pass` folder:

```
npm install
```

This reads `package.json` and installs Express and dotenv into a
`node_modules` folder (never commit that folder — it's already in
`.gitignore`).

## 3. Get a Gemini API key

Go to https://aistudio.google.com/app/apikey, sign in, and create an API
key. Copy it somewhere safe for a moment.

## 4. Create a Slack Incoming Webhook

This is the simplest way to post to Slack — no bot setup required.

1. Go to https://api.slack.com/apps and click "Create New App" → "From
   scratch".
2. Name it (e.g. "Baton Pass") and pick your workspace.
3. In the left sidebar, click "Incoming Webhooks" and switch it on.
4. Click "Add New Webhook to Workspace", pick the channel to post to, and
   allow it.
5. Copy the webhook URL it gives you (looks like
   `https://hooks.slack.com/services/...`).

## 5. Set up your secrets

Copy the example env file:

```
cp .env.example .env
```

Open `.env` and paste in your real values:

```
GEMINI_API_KEY=paste_your_key_here
SLACK_WEBHOOK_URL=paste_your_webhook_url_here
PORT=3000
```

`.env` is already in `.gitignore`, so it will never get committed or
uploaded anywhere. This is the file that keeps your keys hidden.

## 6. Run the server

```
npm start
```

You should see:

```
Baton Pass server running on http://localhost:3000
```

## 7. Open the website

Visit http://localhost:3000 in your browser. It will be empty until you
post your first handoff (next step).

## 8. Load the Chrome extension

1. Open Chrome and go to `chrome://extensions`.
2. Turn on "Developer mode" (top right).
3. Click "Load unpacked" and select the `extension` folder inside
   `baton-pass`.
4. The Baton Pass icon should appear in your toolbar.

## 9. Test the whole flow

1. Open a few tabs, like you would during a normal shift.
2. Click the Baton Pass extension icon.
3. Enter your name and a project name, then click "Post handoff".
4. Check your Slack channel — you should see a 3-bullet summary appear.
5. Refresh http://localhost:3000 — the handoff should show up there too,
   and you can filter it by project/person/status.

## 10. Deploying so it works outside your own machine

Right now everything only works on your laptop. To make it usable by a real
team:

1. Push this project to a GitHub repo (`.env` won't be included, which is
   correct).
2. Deploy it to a host like Render, Railway, or Fly.io — all have free
   tiers and support Node.js out of the box.
3. In that host's dashboard, add `GEMINI_API_KEY` and `SLACK_WEBHOOK_URL`
   as environment variables (same names as in `.env`). This is the
   deployed equivalent of your local `.env` file — the keys still never
   appear in your code.
4. Update `BACKEND_URL` in `extension/popup.js` to your new deployed URL
   instead of `http://localhost:3000`.
5. Reload the unpacked extension in `chrome://extensions` so it picks up
   the change.

## Known gaps to build next

- **Git commits / doc drafts**: a browser extension can't read your local
  git history or file system directly. Options: (a) add a text box in the
  popup for a quick manual paste, or (b) write a tiny local script/CLI that
  reads `git log` and drafts, and have the extension call that instead of
  gathering everything itself.
- **Storage**: `data/handoffs.json` is a flat file — fine for a small team,
  but swap `lib/db.js` for a real database (e.g. Postgres) once you have
  more than a handful of people using this, since concurrent writes to one
  JSON file aren't safe at scale.
- **"Ask for clarification"**: add a button on the website that calls
  `POST /api/handoff/:id/update` (already built) and sets
  `status: "needs-clarification"` so it's easy to filter for handoffs that
  need a reply.
- **Timezone/calendar sync**: a separate feature — it would need Google
  Calendar OAuth, which follows the same rule as Gemini/Slack: tokens live
  only on the backend, never in the extension or website.
