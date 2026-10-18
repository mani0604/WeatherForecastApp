# Weather Forecast App

A static, client-side weather forecast app. Search any city (or use your current
location) to see current conditions, an hourly and 5-day forecast, air quality,
sunrise/sunset, self-computed severe-weather alerts, and an optional AI-powered
insight card and chat assistant — no build step, and no backend required for
local development. A pair of tiny serverless functions are included so it can
also be deployed (e.g. to Vercel) without ever putting an API key in the browser.

## Features
- Current conditions: temperature, feels-like, humidity, wind, pressure
- Day/night hero backdrop based on the searched city's actual sunrise/sunset
- Air Quality (AQI + PM2.5) stat card
- Hourly forecast (next 24 hours, 3-hour steps) and 5-day forecast, with inline SVG weather icons
- Self-computed severe-weather alerts (thunderstorm, high wind, extreme heat/cold) with optional browser notifications
- °C / °F unit toggle (re-renders from cached data, no refetch)
- Geolocation on load, with a manual city search fallback
- AI Insight card — one short, practical tip generated from the current forecast (Groq)
- Floating chat assistant that answers questions using only the currently displayed weather data (Groq)
- Animated splash intro (once per browser tab session), respecting `prefers-reduced-motion`

## Tech stack

- Plain HTML, CSS, and JavaScript (ES2017+) — no framework, no build step, no dependencies
- [OpenWeatherMap](https://openweathermap.org/api) — geocoding, current weather, 5-day/3-hour forecast, air pollution
- [Groq](https://groq.com/) (OpenAI-compatible chat completions) — AI Insight card and chat assistant
- Two Vercel serverless functions (`api/owm.js`, `api/groq.js`) — optional key-hiding proxies for deployment

## Setup (local development)

1. Get a free OpenWeatherMap API key: sign up at
   [home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up),
   then grab your key from [home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys).
   New keys can take a little while to activate.
2. (Optional) Get a free Groq API key from [console.groq.com/keys](https://console.groq.com/keys)
   to enable the AI Insight card and chat assistant.
3. Copy `config.example.js` to `config.js` and fill in your key(s):

   ```js
   window.CONFIG = {
     OWM_KEY: "your_openweathermap_api_key_here",
     GROQ_KEY: "your_groq_api_key_here", // optional
   };
   ```

4. Open `index.html` with a local server — e.g. the VS Code "Live Server" extension,
   or `python -m http.server` from this folder — and visit it in your browser.
   (Opening the file directly also works, but a local server avoids a couple of
   `file://`-specific quirks.)

`config.js` is gitignored, so your keys never get committed. With it filled in,
the app calls OpenWeatherMap/Groq directly from the browser, same as before.
Leave a key blank (or skip `config.js` entirely) and the app instead calls the
`/api/owm` / `/api/groq` serverless functions below — which only work once
deployed (or run locally via `vercel dev` with a `.env` holding `OWM_KEY` /
`GROQ_KEY`), so a bare Live Server session with no `config.js` will just show
the normal "couldn't load" error states instead of live data.

## Deploy (Vercel)

The app ships with two serverless functions, `api/owm.js` and `api/groq.js`,
that proxy OpenWeatherMap and Groq server-side so a deployed build never
exposes a key to the browser — `script.js` detects an empty `window.CONFIG`
and calls these instead of the providers directly.

1. Push this repo to GitHub (already done if you're reading this from there).
2. In the [Vercel dashboard](https://vercel.com/new), import the repo. No
   framework preset or build command is needed — it's a static site with an
   `api/` folder, which Vercel picks up automatically.
3. In the project's **Settings → Environment Variables**, add:
   - `OWM_KEY` — your OpenWeatherMap API key
   - `GROQ_KEY` — your Groq API key (optional; omit to leave AI Insight/chat erroring gracefully)
4. Deploy. `config.js` is gitignored and never ships with the build, so the
   deployed app automatically runs in proxy mode, no keys in the browser.

## Known limitations

- **This is a demo/learning project, not production-hardened.** In local
  `config.js` mode, whatever key is configured is visible to anyone who opens
  the browser's network tab — don't reuse a key that guards anything
  sensitive, and use free-tier keys only. The Vercel proxy mode avoids this
  (keys stay server-side), but still has no auth/rate-limiting beyond the
  basic request caps built into `api/groq.js`.
- No automated tests.
- OpenWeatherMap's free tier has no alerts or daily-forecast endpoint, so alerts
  and the 5-day forecast are derived/bucketed from the 3-hour forecast data.

## Screenshots

_(add screenshots here, e.g. `![Hero view](screenshots/hero.png)`)_
