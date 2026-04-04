# MoodPlay

A mood-based movie recommendation web app. Tell us how you're feeling — we'll find something worth watching.

Built as part of the Web Technologies module at Griffith College Cork.

---

## Team

- Aline Andrade Costa
- Byron Gift Ochieng Makasembo
- Sergio Alves da Silva

Module: Web Technologies — Year 3 | Griffith College Cork | Lecturer: Martin Dow

---

## Project Overview

MoodPlay helps users decide what to watch based on how they feel. Instead of browsing endlessly, users can select a mood and receive movie recommendations through the TMDB API.

For this server-side iteration, the project focuses on:

- user management
- server-side CRUD functionality
- server-side validation
- session and cookie handling
- database integration
- online deployment

This backend is deployed online and connected to MongoDB Atlas.

---

## Features

| #   | Feature        | Description                                           |
| --- | -------------- | ----------------------------------------------------- |
| F1  | Mood Browsing  | Pick a mood, get a genre-matched movie list           |
| F2  | Fortune Teller | Random movie recommendation                           |
| F3  | Big Screen     | Movies currently in cinemas                           |
| F4  | Auth           | Register, login, JWT-protected sessions               |
| F5  | Watchlist      | Add movies, track status (Plan / Watching / Watched)  |
| F6  | Ratings        | Rate movies 1–5 stars with an optional written review |

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

### Working Test Routes

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
- Axios

### Backend

- Node.js
- Express
- Mongoose
- MongoDB Atlas

### Authentication / State

- bcryptjs
- jsonwebtoken
- express-session
- cookie-parser

### External API

- TMDB API v3

---

## Project Structure

```text
web-app-project/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── main.jsx
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
└── README.md
```

---

## Setup & Installation

### Prerequisites

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

The backend was tested locally and against the deployed Render backend.

Testing included:

- registration
- login
- logout
- auth state
- profile endpoints
- movie endpoints
- watchlist CRUD
- ratings CRUD
- validation and error handling
- seed script and Atlas database checks

---

## Changes from Initial Plan

The original project idea included both frontend and backend features.

For this assignment iteration, the main focus was on implementing the **server-side components** required by the brief. The React frontend structure has been prepared, but the main completed work in this iteration is the backend API, authentication, database integration, validation, and deployment.

---

## Division of Labour

Work was divided across the team for this iteration as follows:

- **Byron Gift Ochieng Makasembo**  
  Backend architecture, database seeding, MongoDB Atlas setup, deployment to Render, and API implementation support.

- **Aline Andrade Costa**  
  Project coordination, deployment verification, backend testing, database testing using mongosh, README and submission preparation, and frontend integration preparation.

- **Sergio Alves da Silva**  
  Backend code corrections, route/controller integration, project fixes, and support with implementation updates.

---

## File Authorship / Contribution Notes

Main backend files were contributed to collaboratively, with stronger focus areas as follows:

- **Byron:** deployment, seeding, backend structure
- **Sergio:** backend corrections and integrations
- **Aline:** testing, deployment verification, submission preparation, frontend integration preparation

---

## Project Status

**Backend:** Complete — all main server-side features implemented and tested.

**Frontend:** In progress — pages and components are being connected to the API.

**Deployment:** Live — `https://moodplay-myvq.onrender.com`  
**Database:** MongoDB Atlas

---

## References

- Express.js — https://expressjs.com/
- Mongoose — https://mongoosejs.com/docs/
- MongoDB Atlas — https://www.mongodb.com/docs/atlas/
- TMDB API — https://developer.themoviedb.org/
- bcryptjs — https://www.npmjs.com/package/bcryptjs
- jsonwebtoken — https://www.npmjs.com/package/jsonwebtoken
- express-session — https://www.npmjs.com/package/express-session
- cookie-parser — https://www.npmjs.com/package/cookie-parser
- Render — https://render.com/docs
- React — https://react.dev/
- Vite — https://vitejs.dev/
