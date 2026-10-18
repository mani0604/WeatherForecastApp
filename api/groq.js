// Vercel serverless proxy for Groq chat completions.
//
// Keeps GROQ_KEY server-side only: the browser never sees it. Forces a
// fixed, inexpensive model and caps token/message limits regardless of what
// the client sends, so this can't be used as an open relay to run up costs
// on the configured key. Configure GROQ_KEY as an environment variable in
// the Vercel project (never committed, never logged).

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const MAX_TOKENS_CAP = 300;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 8000;
const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);

function validationError(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "messages must be a non-empty array";
  }
  if (messages.length > MAX_MESSAGES) {
    return `messages exceeds the limit of ${MAX_MESSAGES}`;
  }

  let totalChars = 0;
  for (const m of messages) {
    if (!m || typeof m !== "object") return "each message must be an object";
    if (!ALLOWED_ROLES.has(m.role)) return `invalid role "${m.role}"`;
    if (typeof m.content !== "string" || !m.content.trim()) return "message content must be a non-empty string";
    if (m.content.length > MAX_MESSAGE_CHARS) return `a message exceeds ${MAX_MESSAGE_CHARS} characters`;
    totalChars += m.content.length;
  }
  if (totalChars > MAX_TOTAL_CHARS) return `combined message length exceeds ${MAX_TOTAL_CHARS} characters`;
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const key = process.env.GROQ_KEY;
  if (!key) {
    res.status(500).json({ error: "Server is not configured" });
    return;
  }

  const body = req.body || {};
  const error = validationError(body.messages);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const temperature =
    typeof body.temperature === "number" && body.temperature >= 0 && body.temperature <= 2 ? body.temperature : 0.5;
  const requestedTokens = Number(body.max_tokens);
  const maxTokens = Math.min(Number.isFinite(requestedTokens) && requestedTokens > 0 ? requestedTokens : MAX_TOKENS_CAP, MAX_TOKENS_CAP);

  try {
    const upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature,
        max_tokens: maxTokens,
        reasoning_effort: "low",
        messages: body.messages,
      }),
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(text);
  } catch {
    res.status(502).json({ error: "Upstream request failed" });
  }
};
