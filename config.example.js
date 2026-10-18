// Copy this file to config.js and fill in your own keys for local development.
// config.js is gitignored — never commit real keys.
//
// Leaving a key blank (or skipping config.js entirely, e.g. in a deployed
// build) makes the app call the /api/owm and /api/groq Vercel serverless
// proxies instead — see README.md's "Deploy" section for the OWM_KEY /
// GROQ_KEY environment variables those proxies read.
window.CONFIG = {
  OWM_KEY: "your_openweathermap_api_key_here",
  GROQ_KEY: "your_groq_api_key_here", // optional — AI Insight + chat use the proxy without it
};
