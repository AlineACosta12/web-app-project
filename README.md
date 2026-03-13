# MoodPlay

A mood-based movie recommendation web app. Tell us how you're feeling — we'll find something worth watching.

Built as part of the Web Technologies module at Griffith College Cork.

---

## Team

| Name | Student No. | Role |
|---|---|---|
| Byron Gift Ochieng Makasembo | 3062457 | Backend, Auth, TMDB, Git, Deployment |
| Aline Andrade Costa | 3144929 | Frontend, React, UI |
| Sergio Alves da Silva | 3139115 | Frontend support, CSS, Design |

Module: Web Technologies — Year 3 | Griffith College Cork | Lecturer: Martin Dow

---

## What It Does

Users pick a mood from six options (Happy, Sad, Romantic, Motivated, Bored, Mind-blown) and get a curated list of movies via the TMDB API. Additional features include a Fortune Teller (random movie pick), Big Screen (now playing in cinemas), a personal watchlist with status tracking, and a star rating + review system.

---

## Tech Stack

**Frontend:** React 18, Vite, React Router v6, Axios

**Backend:** Node.js 20, Express 4, Mongoose 8, MongoDB 7

**Auth:** bcryptjs (10 rounds), JSON Web Tokens (7-day expiry)

**External API:** TMDB API v3 — all calls are proxied through the backend, the key never reaches the client

---

## Features

| # | Feature | Description |
|---|---|---|
| F1 | Mood Browsing | Pick a mood, get a genre-matched movie list |
| F2 | Fortune Teller | Random movie recommendation |
| F3 | Big Screen | Movies currently in cinemas |
| F4 | Auth | Register, login, JWT-protected sessions |
| F5 | Watchlist | Add movies, track status (Plan / Watching / Watched) |
| F6 | Ratings | Rate movies 1–5 stars with an optional written review |

---

## Project Structure

```
web-app-project/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       └── main.jsx
├── server/                  # Express backend
│   └── src/
│       ├── controllers/     # Route handler logic
│       ├── middleware/       # JWT auth middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routers
│       └── app.js
├── docs/                    # Wireframes and project documentation
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js 20+
- MongoDB 7 running locally (or a MongoDB Atlas URI)
- A TMDB API key — get one free at [themoviedb.org](https://www.themoviedb.org/settings/api)

### 1. Clone the repo

```bash
git clone https://github.com/AlineACosta12/web-app-project.git
cd web-app-project
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `/server` (use `.env.example` as a template):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodplay
JWT_SECRET=your_long_random_secret_here
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. The backend runs on `http://localhost:5000`.

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ username, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

### Movies (public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/mood/:mood` | Movies by mood |
| GET | `/api/movies/random` | Random movie pick |
| GET | `/api/movies/nowplaying` | Currently in cinemas |
| GET | `/api/movies/search?q=` | Search by title |
| GET | `/api/movies/:tmdbId` | Single movie detail |

Valid mood values: `happy` `sad` `romantic` `motivated` `bored` `mindblow`

### Watchlist (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/watchlist` | Get user's watchlist |
| POST | `/api/watchlist/:tmdbId` | Add a movie |
| PUT | `/api/watchlist/:tmdbId` | Update status |
| DELETE | `/api/watchlist/:tmdbId` | Remove a movie |

### Ratings (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ratings/:tmdbId` | Get user's rating for a movie |
| POST | `/api/ratings/:tmdbId` | Submit a rating and review |
| DELETE | `/api/ratings/:tmdbId` | Delete a rating |

Protected routes require the header: `Authorization: Bearer <token>`

---

## Project Workflow

1. **Idea & problem definition** ✅
2. **Research + requirements** ✅
3. **Project brief** ✅
4. **Scope + MVP definition** ✅
5. **Sitemap + user journeys** ✅
6. **Wireframes** ✅ — see `/docs/wireframes.html`
7. **Build**
   - Database design ✅
   - Backend API + auth + security 🔨 in progress
   - Frontend pages and components 🔨 in progress
8. **Testing**
   - API endpoint tests
   - Form validation
   - Responsive and browser checks
9. **Deploy**
   - Hosting + SSL
   - Live demo link

---

## Testing

Testing evidence will be stored in `/docs/testing/` and will include:
- API endpoint tests (auth, movies, watchlist, ratings)
- Form validation tests
- Link and navigation tests
- Responsive and cross-browser checks
- User feedback notes

---

## Git Workflow

```
main  ←  dev  ←  feature/byron-*
                  feature/aline-*
                  feature/sergio-*
```

- `main` is protected — never push directly
- All feature branches merge into `dev` first, then `dev` merges into `main`
- Commit prefixes: `feat` / `fix` / `chore` / `docs` / `style`

---

## Project Status

Backend in active development. Auth and TMDB movie routes complete. Watchlist and ratings routes in progress.
