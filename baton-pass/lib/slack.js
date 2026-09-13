// Posts a message to Slack using an "Incoming Webhook" URL.
// This is the simplest way to post to Slack: no OAuth flow, no bot token,
// just one secret URL that you paste into your .env file.

async function postToSlack(text) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL is not set - skipping Slack post.');
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Slack webhook error (${response.status}): ${errText}`);
  }
}

module.exports = { postToSlack };
