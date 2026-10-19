# Weather Forecast App

A fast, modern weather forecast web app. Search any city or use your current location to see live conditions, an hourly and 5-day forecast, air quality, sunrise and sunset times, severe-weather alerts, and an AI assistant that answers questions about the weather on screen.

Built with plain HTML, CSS and JavaScript. No framework and no build step.

**Live demo:** _add your deployed link here_

**Source code:** https://github.com/mani0604/WeatherForecastApp

## Features

- **Current conditions:** temperature, feels-like, humidity, wind and pressure
- **Hourly forecast:** next 24 hours in 3-hour steps
- **5-day forecast:** daily outlook with custom inline SVG weather icons
- **Air quality:** AQI level and PM2.5 card
- **Sunrise and sunset:** shown in the searched city's local time
- **Day and night theme:** the backdrop switches between sun and moon/stars based on the city's actual sunrise and sunset
- **Severe-weather alerts:** detects thunderstorms, high wind, extreme heat and extreme cold, with optional browser notifications
- **Unit toggle:** switch between °C and °F instantly, with no extra API call
- **Location search:** uses geolocation on load, with manual city search as a fallback
- **AI Insight card:** a short, practical tip generated from the current forecast
- **Weather chat assistant:** a floating chat that answers using only the weather data currently on screen
- **Polished UI:** animated splash screen (respects reduced-motion settings), responsive layout and accessible labels

## Tech Stack

- **Frontend:** HTML5, CSS3 and vanilla JavaScript (ES2017+), with no dependencies
- **Weather data:** OpenWeatherMap (geocoding, current weather, 5-day/3-hour forecast, air pollution)
- **AI:** Groq chat API (OpenAI-compatible) for the insight card and chat assistant
- **Deployment:** Vercel, with two small serverless functions (`api/owm.js` and `api/groq.js`) that keep API keys on the server

## Project Structure

```
index.html          Page markup
style.css           All styling
script.js           App logic: API calls, rendering, alerts, chat
config.example.js   Template for local API keys
api/owm.js          Serverless proxy for OpenWeatherMap
api/groq.js         Serverless proxy for Groq
README.md           Project documentation
```

## Run Locally

1. **Get an OpenWeatherMap key** (free). Sign up at https://home.openweathermap.org/users/sign_up, then copy your key from https://home.openweathermap.org/api_keys. New keys can take a while to activate.

2. **Get a Groq key** (free, optional). Create one at https://console.groq.com/keys to enable the AI Insight card and chat assistant.

3. **Create your config file.** Copy `config.example.js` to `config.js` and add your keys:

   ```js
   window.CONFIG = {
     OWM_KEY: "your_openweathermap_api_key_here",
     GROQ_KEY: "your_groq_api_key_here", // optional
   };
   ```

4. **Start a local server** and open the page. Use the VS Code Live Server extension, or run `python -m http.server` in the project folder and open the address it shows.

`config.js` is listed in `.gitignore`, so your keys are never committed.

## Known Limitations

- This is a learning project, not production-hardened.
- In local `config.js` mode your keys are visible in the browser's network tab, so use free-tier keys only.
- Vercel proxy mode keeps keys on the server, but it has no user authentication or rate limiting beyond basic request caps in `api/groq.js`.
- OpenWeatherMap's free tier has no alerts or daily-forecast endpoint, so alerts and the 5-day forecast are derived from the 3-hour forecast data.
- There are no automated tests yet.

## Possible Improvements

- Split `script.js` into ES modules
- Add automated tests for the alert and forecast logic
- Add saved cities and city autocomplete
- Add rate limiting to the serverless proxy

## Screenshots

### Home page

<img width="3456" height="1970" alt="Home page" src="https://github.com/user-attachments/assets/6f121f3b-9fb6-4f8d-b7f9-f35e81103885" />

### 24-hour and 5-day forecast

<img width="3456" height="1970" alt="24-hour and 5-day forecast" src="https://github.com/user-attachments/assets/dd119dbc-7ddf-4b35-9be1-0bdf213ab021" />

## Acknowledgements

- Weather data by OpenWeatherMap
- AI responses by Groq
- Built for a CSE Website Development project, with help from Claude Code (AI coding assistant)
