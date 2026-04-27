# MoodPlay

A mood-based movie recommendation web app. Tell us how you're feeling — we'll find something worth watching.

Built as part of the Web Technologies module at Griffith College Cork.

---

## Team

- Aline Andrade Costa - 3144949
- Byron Gift Ochieng Makasembo - 3062457
- Sergio Alves da Silva - 3139115

Module: Web Technologies — Year 3 | Griffith College Cork | Lecturer: Martin Dow

---

## Repository

GitHub repository: https://github.com/AlineACosta12/web-app-project

---

## Live Client Deployment

The client-side React version of MoodPlay is deployed on Render:

https://web-app-project-9lly.onrender.com/

This deployed version was created for the client-side React assignment. As required, no real HTTP requests are made. The app uses mock movie data and browser `localStorage` to simulate registration, login, profile, mood browsing, search, watchlist, and ratings.

Some movie poster images may not appear in this mock version because the final poster images are designed to come from the real backend connection to the TMDB API. In the full backend version, movie data and images are retrieved from TMDB through the backend API.

---

## Project Overview

MoodPlay helps users decide what to watch based on how they feel. Instead of browsing endlessly, users can select a mood and receive movie recommendations.

The project was built across two assignments:

- **Assignment 2 (server-side):** REST API with Express, MongoDB, session authentication, and TMDB integration — deployed on Render.
- **Assignment 3 (client-side):** Fully interactive React SPA with all user-facing features implemented. Runs standalone with a mock localStorage data layer — no backend required.

---

## Features

| #   | Feature        | Description                                            |
| --- | -------------- | ------------------------------------------------------ |
| F1  | Mood Browsing  | Pick a mood, get a genre-matched movie list            |
| F2  | Fortune Teller | Random movie recommendation                            |
| F3  | Big Screen     | Movies currently in cinemas                            |
| F4  | Auth           | Register, login, logout, and protected user sessions   |
| F5  | Watchlist      | Add movies, track status (Plan / Watching / Watched)   |
| F6  | Ratings        | Rate movies 1–5 stars with an optional written review  |
| F7  | Search         | Search for any movie by title                          |
| F8  | Profile        | Edit username, email, avatar, password, delete account |

---

## Features Implemented in Assignment 3 (Client-Side)

### Overview

Assignment 3 implements the complete React frontend as a self-contained SPA. All data is handled by a mock API layer that stores users, watchlist items, and ratings in the browser's `localStorage`. No backend connection is required to run or mark the client-side submission.

The real backend service is preserved in `client/src/services/api.backend.js` and can be swapped back in by replacing `api.js`.

---

### Pages

| Page          | Route            | Description                                                     |
| ------------- | ---------------- | --------------------------------------------------------------- |
| Home          | `/`              | Mood board with 8 mood cards and a featured movies section      |
| Results       | `/results?mood=` | Movie grid filtered by the selected mood                        |
| Movie Details | `/movie/:id`     | Full movie info, watchlist button, star rating, and review form |
| Search        | `/search?q=`     | Title search with paginated results and Load More               |
| Login         | `/login`         | Email and password login form with client-side validation       |
| Register      | `/register`      | Account creation form with validation                           |
| Watchlist     | `/watchlist`     | All saved movies with status selector and remove button         |
| Ratings       | `/ratings`       | All rated movies with star display and delete action            |
| Profile       | `/profile`       | Edit username, email, avatar; change password; delete account   |
| About         | `/about`         | App description, mood guide, how-it-works, and tech stack       |
| 404           | `*`              | Catch-all page for unknown routes                               |

---

### Components

| Component         | Location                                | Description                                                        |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------ |
| `Layout`          | `components/layout/Layout.jsx`          | Wraps all pages with Navbar and Footer via React Router `<Outlet>` |
| `Navbar`          | `components/layout/Navbar.jsx`          | Logo, nav links, inline search bar, login/logout, welcome message  |
| `Footer`          | `components/layout/Footer.jsx`          | Site footer with attribution                                       |
| `MovieCard`       | `components/movies/MovieCard.jsx`       | Reusable movie poster card linking to Movie Details                |
| `LoginForm`       | `components/auth/LoginForm.jsx`         | Reusable login form used by LoginPage                              |
| `BackToTopButton` | `components/common/BackToTopButton.jsx` | Floating scroll-to-top button                                      |

---

### Mock API Layer

The client-side submission uses a mock service (`src/services/api.js`) that mirrors the real backend API contract but stores all data in `localStorage`. This allows the full app to run without a server.

**`src/services/mockData.js`**

Contains 20 hardcoded movies covering every mood category (`happy`, `sad`, `motivated`, `romantic`, `bored`, `mindblow`, `bigscreen`, `fortuneteller`). Used by the mock API to serve mood-filtered, search, and detail results.

**`src/services/api.js` (mock)**

Simulates all API namespaces with a 200 ms artificial delay for realism:

| Namespace      | Methods                                                                | Storage        |
| -------------- | ---------------------------------------------------------------------- | -------------- |
| `authApi`      | `register`, `login`, `logout`, `me`                                    | `localStorage` |
| `profileApi`   | `getProfile`, `updateProfile`, `changePassword`, `deleteProfile`       | `localStorage` |
| `moviesApi`    | `trending`, `byMood`, `details`, `search`                              | `mockData.js`  |
| `watchlistApi` | `list`, `add`, `updateStatus`, `remove`                                | `localStorage` |
| `ratingApi`    | `addRating`, `updateRating`, `getRatings`, `getRating`, `deleteRating` | `localStorage` |

Mock storage keys:

- `moodplay_mock_users` — registered user accounts
- `moodplay_mock_current_user` — active session
- `moodplay_mock_watchlist` — watchlist items per user
- `moodplay_mock_ratings` — ratings and reviews per user

The Fortune Teller mood returns one random movie from `mockMovies`. The Big Screen mood returns movies tagged with `bigscreen` in `mockData.js`, paginated with 8 per page.

---

### Client-Side Validation

All forms include validation before any mock API call:

- **Register / Profile:** username ≥ 3 chars, valid email format, password ≥ 6 chars
- **Login:** both fields required, email must contain `@`
- **Password change:** current and new password required, new password ≥ 6 chars
- **Rating form:** star selection required before save
- **Search:** empty query is blocked

---

### Running the Client (Assignment 3)

No backend or environment variables needed.

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

**Demo flow:**

1. Register a new account on `/register`
2. Log in on `/login`
3. Pick a mood on the home page
4. Open a movie, add it to your watchlist, and leave a star rating with a review
5. View your watchlist at `/watchlist` and ratings at `/ratings`
6. Edit your profile and avatar at `/profile`

---

## Features Implemented in Assignment 2

### 1. User Management

- User registration
- User login
- User logout
- Current logged-in user retrieval
- Profile retrieval
- Profile update
- Password change
- Account deletion

### 2. Movie Features

- Browse movies by mood
- Random movie recommendation ("Fortune Teller")
- View movies currently playing in cinemas ("Big Screen")
- Search movies by title
- Get full movie details by TMDB ID

### 3. Watchlist CRUD

- Add movie to watchlist
- View watchlist
- Update watchlist status
- Remove movie from watchlist

### 4. Ratings CRUD

- Create rating and review
- View all user ratings
- View rating for a specific movie
- Update rating
- Delete rating

### 5. Validation

- Required field validation
- Email format validation
- Password length validation
- Username length validation
- Rating score validation
- Page number and TMDB ID validation
- Appropriate error messages returned from the server

### 6. State Management

- JWT authentication
- httpOnly auth cookie
- express-session support for server-side session state

### 7. Deployment

- Backend deployed online using Render
- Database hosted on MongoDB Atlas

---

## Hosted Backend

**Backend URL:**  
`https://moodplay-myvq.onrender.com`

**API Base URL:**  
`https://moodplay-myvq.onrender.com/api`

### Working Public Test Routes

- `/`
- `/api`
- `/api/health`
- `/api/movies/random`
- `/api/movies/nowplaying`

---

## Tech Stack

### Frontend

- React 18
- Vite
- React Router v6
- Fetch API (native — no Axios on the frontend)

### Backend

- Node.js
- Express
- Mongoose
- MongoDB Atlas

### Authentication / State

- bcryptjs
- express-session
- cookie-parser

### External API

- TMDB API v3

---

## Project Structure

```text
web-app-project/
├── bruno/
│   └── moodplay-api-tests/
├── client/
│   ├── public/
│   │   ├── avatars/          # 16 preset avatar images
│   │   └── moods/            # Mood GIF icons
│   └── src/
│       ├── assets/
│       │   └── MoodPlay_logo.png
│       ├── components/
│       │   ├── auth/
│       │   │   └── LoginForm.jsx
│       │   ├── common/
│       │   │   └── BackToTopButton.jsx
│       │   ├── layout/
│       │   │   ├── Footer.jsx
│       │   │   ├── Layout.jsx
│       │   │   └── Navbar.jsx
│       │   └── movies/
│       │       └── MovieCard.jsx
│       ├── pages/
│       │   ├── AboutPage.jsx
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── MovieDetailsPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── RatingsPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ResultsPage.jsx
│       │   ├── SearchPage.jsx
│       │   └── WatchlistPage.jsx
│       ├── services/
│       │   ├── api.js             # Mock API (localStorage) — used for Assignment 3
│       │   ├── api.backend.js     # Real backend API (fetch + sessions) — Assignment 2
│       │   └── mockData.js        # 20 hardcoded movies for the mock layer
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── database_export/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── movieController.js
│   │   │   ├── profileController.js
│   │   │   ├── ratingController.js
│   │   │   └── watchlistController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Rating.js
│   │   │   ├── User.js
│   │   │   └── WatchlistItem.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── movieRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   ├── ratingRoutes.js
│   │   │   └── watchlistRoutes.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── seed.js
├── coversheet.pdf
└── README.md
```

---

## Setup & Installation

### Running the frontend only (Assignment 3 — no backend needed)

```bash
git clone https://github.com/AlineACosta12/web-app-project.git
cd web-app-project/client
npm install
npm run dev
```

Open `http://localhost:5173`. Register an account and use the app fully offline — all data is stored in your browser's `localStorage`.

---

### Running the full stack (Assignment 2)

#### Prerequisites

- Node.js
- npm
- MongoDB Atlas connection string
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
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:5173
NODE_ENV=development
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

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/api/auth/register` | Register a new user        |
| POST   | `/api/auth/login`    | Log in a user              |
| POST   | `/api/auth/logout`   | Log out a user             |
| GET    | `/api/auth/me`       | Get current logged-in user |

### Movies

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/api/movies/mood/:mood` | Get movies by mood              |
| GET    | `/api/movies/random`     | Get a random movie              |
| GET    | `/api/movies/nowplaying` | Get movies currently in cinemas |
| GET    | `/api/movies/search?q=`  | Search movies by title          |
| GET    | `/api/movies/:tmdbId`    | Get movie details by TMDB ID    |

**Valid mood values:** `happy`, `sad`, `romantic`, `motivated`, `bored`, `mindblow`

### Profile

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/profile`          | Get logged-in user profile |
| PUT    | `/api/profile`          | Update profile             |
| PUT    | `/api/profile/password` | Change password            |
| DELETE | `/api/profile`          | Delete account             |

### Watchlist

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| GET    | `/api/watchlist`         | Get user's watchlist        |
| POST   | `/api/watchlist/:tmdbId` | Add movie to watchlist      |
| PUT    | `/api/watchlist/:tmdbId` | Update watchlist status     |
| DELETE | `/api/watchlist/:tmdbId` | Remove movie from watchlist |

### Ratings

| Method | Endpoint               | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| GET    | `/api/ratings`         | Get all ratings for the logged-in user |
| GET    | `/api/ratings/:tmdbId` | Get rating for one movie               |
| POST   | `/api/ratings/:tmdbId` | Create rating                          |
| PUT    | `/api/ratings/:tmdbId` | Update rating                          |
| DELETE | `/api/ratings/:tmdbId` | Delete rating                          |

### Protected Routes

Protected routes accept the JWT via either:

- `Authorization: Bearer <token>` header
- `token` httpOnly cookie set automatically by the server on login

---

## Database

The project uses **MongoDB Atlas** as the cloud-hosted database.

A seed script is included to generate demo data:

```bash
cd server
node seed.js
```

### Demo Accounts

- `demo@moodplay.com` / `Demo1234`
- `testuser@moodplay.com` / `Test1234`

---

## Testing

The MoodPlay backend API was tested using Bruno.

The following routes were tested successfully:

### Base routes

- GET /
- GET /api
- GET /api/health

### Authentication and protected access

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/profile
- Unauthorized access test for protected routes

### Movie routes

- GET /api/movies/mood/:mood

### Watchlist CRUD

- POST /api/watchlist/:tmdbId
- GET /api/watchlist
- PUT /api/watchlist/:tmdbId
- DELETE /api/watchlist/:tmdbId

### Ratings CRUD

- POST /api/ratings/:tmdbId
- GET /api/ratings
- GET /api/ratings/:tmdbId
- PUT /api/ratings/:tmdbId
- DELETE /api/ratings/:tmdbId

Testing confirmed that protected routes worked correctly after login, records could be created, read, updated, and deleted successfully, and unauthorized access was blocked when authentication cookies were removed.

Testing included protected CRUD operations for watchlist and ratings after authentication.

The Bruno collection and saved request files are included in the project submission.

---

## Changes from Initial Plan

The original project idea included both frontend and backend features across two assignment submissions.

**Assignment 2** focused on the server-side: REST API, authentication, database integration, validation, and deployment.

**Assignment 3** completed the client-side: all React pages, components, routing, client-side validation, and a mock localStorage data layer so the frontend runs fully without a backend. The real backend service is preserved in `api.backend.js` for reference and full-stack use.

---

# Division of Labour

Work was divided across the team as follows.

## Byron Gift Ochieng Makasembo

- Backend architecture
- Database seeding
- MongoDB Atlas setup
- Render deployment
- Backend API implementation support

## Aline Andrade Costa

- Project coordination
- Deployment verification
- Backend testing with Bruno
- Database testing using `mongosh`
- README and submission preparation
- Frontend integration preparation
- Client-side implementation and final project organisation

## Sergio Alves da Silva

- Documentation support
- Frontend decision support
- Backend code corrections
- Route and controller integration
- Project fixes
- Implementation updates
- Backend testing with Postman

---

# File Authorship / Contribution Notes

The project was developed collaboratively. The main areas of contribution were:

| Contributor | Main Contributions                                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Byron       | Backend structure, deployment, database seeding, MongoDB Atlas setup; client-side bug fixes and validation improvements across `LoginPage.jsx`, `RegisterPage.jsx`, `ProfilePage.jsx`, `SearchPage.jsx`, `MovieCard.jsx` |
| Aline       | Testing, documentation, project coordination, frontend integration, submission preparation                                        |
| Sergio      | Documentation support, frontend decision support, backend corrections, route integration, controller updates, and testing support |

---

## Project Status

**Frontend (Assignment 3):** Complete — all pages, components, mock API, and localStorage data layer implemented and functional as a standalone SPA.

**Backend (Assignment 2):** Complete — all server-side features implemented, tested, and deployed.

**Client Deployment:** Live — `https://web-app-project-9lly.onrender.com/`  
**Backend Deployment:** Live — `https://moodplay-myvq.onrender.com`  
**Database:** MongoDB Atlas

---

## References

- Express.js — https://expressjs.com/
- Mongoose — https://mongoosejs.com/docs/
- MongoDB Atlas — https://www.mongodb.com/docs/atlas/
- TMDB API — https://developer.themoviedb.org/
- bcryptjs — https://www.npmjs.com/package/bcryptjs
- express-session — https://www.npmjs.com/package/express-session
- cookie-parser — https://www.npmjs.com/package/cookie-parser
- Render — https://render.com/docs
- React — https://react.dev/
- Vite — https://vitejs.dev/
- React Router — https://reactrouter.com/
- Bruno — https://www.usebruno.com/
- Flaticon GIF icons — https://www.flaticon.com/
- MERN Stack Tutorial for Beginners with Deployment — https://www.youtube.com/watch?v=F9gB5b4jgOI
