# MoodPlay

A mood-based movie recommendation web app. Tell us how you're feeling — we'll find something worth watching.

Built as part of the Web Technologies module at Griffith College Cork.

---

## Team



- Byron Gift Ochieng Makasembo 
- Aline Andrade Costa 
- Sergio Alves da Silva 

Module: Web Technologies — Year 3 | Griffith College Cork | Lecturer: Martin Dow

---

## What It Does

Users pick a mood from six options (Happy, Sad, Romantic, Motivated, Bored, Mind-blown) and get a curated list of movies via the TMDB API. Additional features include a Fortune Teller (random movie pick), Big Screen (now playing in cinemas), a personal watchlist with status tracking, and a star rating + review system.

---

## Tech Stack

**Frontend:** React 18, Vite, React Router v6, Axios

**Backend:** Node.js 20, Express 4, Mongoose 8, MongoDB 7

**Auth:** bcryptjs (10 rounds), JSON Web Tokens (7-day expiry), express-session, cookie-parser

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
│       ├── app.js           # Express setup, middleware, route mounting
│       └── index.js         # MongoDB connection, server start
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
PORT=5001
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

The app will be available at `http://localhost:5173`. The backend runs on `http://localhost:5001`.

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ username, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/logout` | Clears cookie and destroys session |
| GET | `/api/auth/me` | Returns current user (JWT required) |

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

Protected routes accept the JWT via either:
- `Authorization: Bearer <token>` header (Axios default)
- `token` httpOnly cookie (set automatically by the server on login)

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
   - Backend API + auth + security ✅
   - Frontend pages and components 🔨 in progress
8. **Testing**
   - Backend endpoints tested end-to-end ✅
   - Seed script included (`server/seed.js`) for demo data ✅
   - Frontend integration testing 🔨 in progress
9. **Deploy**
   - Backend live at https://moodplay-api.onrender.com ✅
   - MongoDB Atlas (eu-west-1 Ireland) ✅

---

## Testing

All backend endpoints have been tested end-to-end using curl against both the local server and the live deployment. Tests covered: registration, login, session/cookie auth, all five TMDB movie routes, full watchlist CRUD, full ratings CRUD, and logout.

A seed script is included at `server/seed.js` to populate demo data. Run it with:

```bash
cd server
node seed.js
```

Demo accounts created by the seed:
- `demo@moodplay.com` / `Demo1234`
- `testuser@moodplay.com` / `Test1234`

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

**Backend:** Complete — all 6 features implemented and tested.

**Frontend:** In progress — pages and components being connected to the API.

**Deployment:** Live — https://moodplay-api.onrender.com — MongoDB Atlas (eu-west-1), Render (Frankfurt).

---

## Database

The app uses MongoDB Atlas (cloud-hosted). A seed script is included at `server/seed.js` to populate the database with demo data. Run with `node seed.js` from the `server/` folder.

Demo accounts created by the seed:
- `demo@moodplay.com` / `Demo1234`
- `testuser@moodplay.com` / `Test1234`

---

## References

- Express.js — https://expressjs.com/
- Mongoose — https://mongoosejs.com/docs/
- TMDB API v3 — https://developer.themoviedb.org/
- bcryptjs — https://www.npmjs.com/package/bcryptjs
- jsonwebtoken — https://www.npmjs.com/package/jsonwebtoken
- express-session — https://www.npmjs.com/package/express-session
- cookie-parser — https://www.npmjs.com/package/cookie-parser
- MongoDB Atlas — https://www.mongodb.com/docs/atlas/
- React — https://react.dev/
- Vite — https://vitejs.dev/
- Render — https://render.com/docs
