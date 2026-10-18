// Vercel serverless proxy for OpenWeatherMap.
//
// Keeps OWM_KEY server-side only: the browser never sees it. Only forwards
// requests to a small allowlist of endpoint paths (the ones this app
// actually uses) — anything else is rejected before it ever reaches
// OpenWeatherMap. Configure OWM_KEY as an environment variable in the
// Vercel project (never committed, never logged).

const OWM_BASE = "https://api.openweathermap.org";

const ALLOWED_PATHS = new Set([
  "geo/1.0/direct",
  "geo/1.0/reverse",
  "data/2.5/weather",
  "data/2.5/forecast",
  "data/2.5/air_pollution",
]);

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const query = Object.assign({}, req.query);
  const path = query.path;
  delete query.path;
  delete query.appid; // never let the client supply/override the key

  if (typeof path !== "string" || !ALLOWED_PATHS.has(path)) {
    res.status(400).json({ error: "Invalid or missing path" });
    return;
  }

  const key = process.env.OWM_KEY;
  if (!key) {
    res.status(500).json({ error: "Server is not configured" });
    return;
  }

  const qs = new URLSearchParams();
  for (const name of Object.keys(query)) {
    const value = query[name];
    if (Array.isArray(value)) value.forEach((v) => qs.append(name, v));
    else if (value !== undefined) qs.append(name, value);
  }
  qs.set("appid", key);

  try {
    const upstream = await fetch(`${OWM_BASE}/${path}?${qs.toString()}`);
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(body);
  } catch {
    res.status(502).json({ error: "Upstream request failed" });
  }
};
