# BhashaSetu AI – CodeAlpha_AITranslator

BhashaSetu AI is a professional AI-powered multilingual communication platform built as part of the CodeAlpha Artificial Intelligence Internship (Task 1: Language Translation Tool). It is designed like a real product, not just a college assignment.

## Product vision

Instead of only “translate text”, BhashaSetu AI helps students, travelers, professionals and businesses:

- Translate text across 20+ languages.
- Listen to translations with speech.
- Track usage with history and analytics.
- Reuse past translations from a searchable history.

## Features

### Translator

- Large input and output areas with word, character and reading-time counters.
- Auto Detect source language option (internally defaults to English for the free API).
- 20+ target languages including English, Hindi, Telugu, Tamil, Marathi, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Urdu, French, Spanish, German, Italian, Portuguese, Russian, Arabic, Chinese, Japanese, Korean and Turkish.
- Swap languages button.
- Real-time translation using a free web-based translation API backend.
- **Respects free API limits:** only the first ~500 characters of the input are sent to the translation API (longer text is automatically trimmed and a note is shown to the user).
- Copy, Speak, Favorite (placeholder), Download (placeholder), Share (placeholder) actions.
- Local recent translations panel for quick reuse.

### History

- Dedicated History page backed by MongoDB Atlas.
- Fetches recent translations from the backend `/history` endpoint.
- Search box to filter by source or translated text.
- Copy translation action on each row.
- Scrollable list view styled with Tailwind CSS.

### Dashboard

- Dashboard page backed by `/analytics` endpoint.
- Cards showing:
  - Translations today.
  - Total translations.
  - Most used target language.
  - Approximate words translated today.
- Clean, product-style UI with Tailwind CSS.

### Backend (API)

- Flask-based backend (`server/app.py`) exposing:
  - `POST /translate` – translation + history insert.
  - `GET /history` – recent translations from MongoDB.
  - `GET /analytics` – aggregated usage statistics.
  - `GET /health` – service health check.
- Translation service implemented in `server/services/translation_service.py` using a free web translation API (MyMemory) with graceful fallback.
- Implements defensive logic for API limits:
  - Enforces a maximum of ~500 characters per translation request.
  - Falls back to a mock translation string if the external API returns an error.
- MongoDB Atlas integration via `server/services/db.py` using PyMongo.
- All translations stored in `translations` collection with text, translated, source, target and timestamps.

## Tech stack

- Frontend: React, Vite, Tailwind CSS.
- Backend: Python, Flask, PyMongo.
- Database: MongoDB Atlas.
- Translation: Free web-based translation API (MyMemory).
- Styling: Tailwind CSS with a modern SaaS-style UI.

## Folder structure

```text
CodeAlpha_AITranslator
├── client
│   └── src
│       ├── pages
│       │   ├── Translator.jsx
│       │   ├── Dashboard.jsx
│       │   └── History.jsx
│       ├── services
│       │   └── api.js
│       └── ...
├── server
│   ├── app.py
│   ├── services
│   │   ├── db.py
│   │   └── translation_service.py
│   └── ...
├── docs
│   ├── screenshots
│   └── diagrams
├── README.md
├── requirements.txt
└── .gitignore
```

## How to run (local)

### Backend

```bash
cd server
pip install -r ../requirements.txt
python app.py
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open the app at `http://localhost:5173` and ensure the backend is running at `http://127.0.0.1:5000`.

## Free API limits

BhashaSetu AI uses a free web translation API which enforces a maximum of 500 characters per request. To respect this limit without breaking the user experience:

- The frontend shows the current character count and an upper bound of 500.
- When the input exceeds 500 characters, only the first 500 are sent to the API and a small warning is displayed.
- The backend also trims text to 500 characters before calling the API to avoid errors.

This is explicitly documented so CodeAlpha reviewers and recruiters can see that the project handles real-world API constraints.

## Future scope

These features are planned and described in the project but not yet implemented:

- Login and user profiles.
- Cloud-based translation providers with authenticated keys.
- Advanced analytics: weekly charts, language usage breakdown, per-user stats.
- Favorites and export (CSV / PDF) from History.
- Voice conversation mode, OCR/image translation and meeting translator.
- Integration into a larger “Setu AI” ecosystem (PrashnaSetu AI, DrishtiSetu AI).