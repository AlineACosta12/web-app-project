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

## Assignment 2 — Server-Side Components

### What was implemented this iteration

| Area | Detail | Author |
|---|---|---|
| Express server scaffold | CORS, dotenv, MongoDB connect, health check | Byron |
| JWT authentication | Register, login, logout, `/api/auth/me` | Byron |
| httpOnly cookie auth | JWT stored in httpOnly cookie on login/register | Byron |
| Server-side sessions | express-session stores userId + username after login | Byron |
| Auth middleware | Accepts JWT from Authorization header or cookie | Byron |
| TMDB movie proxy | All 5 movie endpoints — mood, random, nowplaying, search, detail | Byron |
| Watchlist CRUD | GET / POST / PUT / DELETE — all userId-isolated | Byron |
| Ratings CRUD | GET / POST / DELETE — all userId-isolated | Byron |
| MongoDB schemas | User, WatchlistItem, Rating with unique indexes | Byron |
| Server-side validation | All routes validate inputs and return `{ message }` on error | Byron |
| Frontend (React) | All 6 pages and components connected to the API | Aline / Sergio |

### Division of Labour

Byron Gift Ochieng Makasembo — entire backend: Express server, all route logic, auth system (JWT + sessions + cookies), TMDB API integration, Mongoose models, middleware, git workflow, deployment.

Aline Andrade Costa — frontend: React pages, component structure, Axios integration, UI.

Sergio Alves da Silva — frontend support: CSS, styling, design.

### Changes from Assignment 1 plan

No changes to scope. All 6 features planned in Assignment 1 have been implemented as specified.

Session/cookie handling was added beyond the original plan to satisfy Assignment 2 requirements: the JWT is now stored in an httpOnly cookie and user state is maintained in a server-side express-session.

### Extra Credit — TMDB API Integration

The TMDB API integration goes beyond what was covered in module lectures. See `server/src/controllers/movieController.js` for full details and the `*** EXTRA CREDIT ***` comment block.

### References

- Express.js documentation — https://expressjs.com/
- Mongoose documentation — https://mongoosejs.com/docs/
- TMDB API v3 reference — https://developer.themoviedb.org/reference/intro/getting-started
- bcryptjs — https://www.npmjs.com/package/bcryptjs
- jsonwebtoken — https://www.npmjs.com/package/jsonwebtoken
- express-session — https://www.npmjs.com/package/express-session
- cookie-parser — https://www.npmjs.com/package/cookie-parser
- MongoDB Atlas — https://www.mongodb.com/atlas

---

## Project Status

**Backend:** Complete — all 6 features implemented and tested.

**Frontend:** In progress — pages and components being connected to the API.

**Deployment:** In progress — MongoDB Atlas and Render hosting being configured.
