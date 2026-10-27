# Food Verse AI — Simple Working Prototype

A lightweight food-intelligence dashboard built with the required technologies:
- **React.js** for the user interface (loaded from CDN)
- **JavaScript** for UI behaviour
- **HTML** for page structure
- **CSS** for responsive layout and animations/transitions
- **Python** standard library for the local backend/API

## No pip or npm install required

This prototype deliberately avoids Python third-party packages and a React build tool so it is easy to run on a Mac.

## Run locally

1. Make sure Python 3 is installed.
2. Open Terminal and move into the extracted project folder:
   ```bash
   cd path/to/Food-Verse-AI-Simple
   ```
3. Start the Python server:
   ```bash
   python3 server.py
   ```
4. Open **http://127.0.0.1:8000** in Chrome.
5. API health check: **http://127.0.0.1:8000/api/health**

Stop the server with **Ctrl+C**.

> The page loads React and Babel from public CDNs, so the browser needs an internet connection. The Python backend itself uses only the standard library.

## Features

- Dashboard with project overview
- Image/video/audio file selection and image/video preview
- Nutrition estimate lookup for a small set of common foods and adjustable servings
- Rule-based cooking ideas from entered ingredients
- Simple one-day meal planner (balanced, vegetarian, higher-protein)
- Restaurant/kitchen hygiene checklist and completion score
- Responsive UI for desktop and mobile
- Python JSON API endpoints

## Important limitations (be transparent in your demo)

This is a working **prototype**, not a production AI model. It does not perform trained computer-vision food recognition, scientific freshness detection, video-based hygiene detection, audio transcription, medical nutrition advice, or certified restaurant inspections. The media screen demonstrates the workflow and clearly states this limitation. Nutrition values are approximate sample data, and cooking/meal-plan suggestions are rule-based.

## API endpoints

- `GET /api/health`
- `POST /api/nutrition` — `{ "food": "banana", "servings": 1 }`
- `POST /api/cooking` — `{ "ingredients": "rice, dal, onion" }`
- `POST /api/meal-plan` — `{ "preference": "balanced" }`
- `POST /api/analyze-media` — `{ "filename": "meal.jpg", "mediaType": "image/jpeg" }`
- `POST /api/hygiene` — JSON object with checklist booleans

## Suggested next steps

To implement genuine multimodal AI, add a validated image classification model or vision API, speech-to-text, food composition data source, and a video-frame analysis pipeline. Do not describe demo outputs as AI-verified results.
