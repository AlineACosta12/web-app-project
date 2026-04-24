// MoodPlay — Mock API Service
// Frontend-only mock service for the client-side assignment.
// No HTTP requests are made. Data is stored in browser localStorage.

import {
  getMovieById,
  getMoviesByMood,
  mockMovies,
  searchMoviesByTitle,
} from "./mockData";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));
const PAGE_SIZE = 8;

const STORAGE_KEYS = {
  users: "moodplay_mock_users",
  currentUser: "moodplay_mock_current_user",
  watchlist: "moodplay_mock_watchlist",
  ratings: "moodplay_mock_ratings",
};

function read(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser() {
  return read(STORAGE_KEYS.currentUser, null);
}

function requireAuth() {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

function paginate(items, page = 1) {
  const safePage = Number(page) || 1;
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return {
    results: items.slice(start, end),
    page: safePage,
    total_pages: Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
  };
}

function getMovieId(movie) {
  return movie?.id || movie?.tmdbId || movie?.movieId;
}

function getMovieTitle(movie) {
  return (
    movie?.title ||
    movie?.name ||
    movie?.original_title ||
    movie?.original_name ||
    "Untitled movie"
  );
}

function getMoviePoster(movie) {
  return movie?.poster || movie?.poster_path || movie?.posterPath || "";
}

export function pickArray(data) {
  if (Array.isArray(data)) return data;
  return data.movies || data.results || data.watchlist || data.items || [];
}

export function pickUser(data) {
  return data.user || data.profile || data.data?.user || data;
}

export const authApi = {
  register: async (formData) => {
    await delay();

    const users = read(STORAGE_KEYS.users, []);
    const username = formData.username.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!username || !email || !password) {
      throw new Error("Username, email and password are required.");
    }

    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters long.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    const exists = users.find(
      (user) => user.email === email || user.username === username,
    );

    if (exists) {
      throw new Error("Username or email already in use.");
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      avatar: "",
      role: "user",
    };

    users.push(newUser);
    write(STORAGE_KEYS.users, users);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
      },
    };
  },

  login: async (formData) => {
    await delay();

    const users = read(STORAGE_KEYS.users, []);
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    const user = users.find(
      (item) => item.email === email && item.password === password,
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    write(STORAGE_KEYS.currentUser, safeUser);

    return { user: safeUser };
  },

  logout: async () => {
    await delay();
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    return { message: "Logged out successfully" };
  },

  me: async () => {
    await delay();

    const user = getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    return { user };
  },
};

export const profileApi = {
  getProfile: async () => {
    await delay();
    const user = requireAuth();
    return { profile: user };
  },

  updateProfile: async (formData) => {
    await delay();

    const currentUser = requireAuth();
    const users = read(STORAGE_KEYS.users, []);
    const username = formData.username.trim();
    const email = formData.email.trim().toLowerCase();
    const avatar = formData.avatar || "";

    const duplicate = users.find(
      (user) =>
        user.id !== currentUser.id &&
        (user.username === username || user.email === email),
    );

    if (duplicate) {
      throw new Error("Username or email already in use.");
    }

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? { ...user, username, email, avatar } : user,
    );

    const updatedUser = {
      ...currentUser,
      username,
      email,
      avatar,
    };

    write(STORAGE_KEYS.users, updatedUsers);
    write(STORAGE_KEYS.currentUser, updatedUser);

    return { user: updatedUser };
  },

  changePassword: async (formData) => {
    await delay();

    const currentUser = requireAuth();
    const users = read(STORAGE_KEYS.users, []);
    const currentPassword = formData.currentPassword || formData.oldPassword;
    const newPassword = formData.newPassword;

    const userRecord = users.find((user) => user.id === currentUser.id);

    if (!userRecord || userRecord.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? { ...user, password: newPassword } : user,
    );

    write(STORAGE_KEYS.users, updatedUsers);

    return { message: "Password updated successfully" };
  },

  deleteProfile: async () => {
    await delay();

    const currentUser = requireAuth();

    const users = read(STORAGE_KEYS.users, []).filter(
      (user) => user.id !== currentUser.id,
    );

    const watchlist = read(STORAGE_KEYS.watchlist, []).filter(
      (item) => item.userId !== currentUser.id,
    );

    const ratings = read(STORAGE_KEYS.ratings, []).filter(
      (item) => item.userId !== currentUser.id,
    );

    write(STORAGE_KEYS.users, users);
    write(STORAGE_KEYS.watchlist, watchlist);
    write(STORAGE_KEYS.ratings, ratings);
    localStorage.removeItem(STORAGE_KEYS.currentUser);

    return { message: "Account deleted successfully" };
  },
};

export const moviesApi = {
  trending: async () => {
    await delay();
    return paginate(getMoviesByMood("bigscreen"), 1);
  },

  byMood: async (mood, page = 1) => {
    await delay();

    if (mood === "bigscreen") {
      return paginate(getMoviesByMood("bigscreen"), page);
    }

    if (mood === "fortuneteller") {
      const randomMovie =
        mockMovies[Math.floor(Math.random() * mockMovies.length)];

      return {
        results: [randomMovie],
        page: 1,
        total_pages: 1,
      };
    }

    return paginate(getMoviesByMood(mood), page);
  },

  details: async (id) => {
    await delay();

    const movie = getMovieById(id);

    if (!movie) {
      throw new Error("Movie not found");
    }

    return movie;
  },

  search: async (q, page = 1) => {
    await delay();

    if (!q || !q.trim()) {
      throw new Error('Search query "q" is required');
    }

    return paginate(searchMoviesByTitle(q), page);
  },
};

export const watchlistApi = {
  list: async () => {
    await delay();

    const user = requireAuth();
    const watchlist = read(STORAGE_KEYS.watchlist, []).filter(
      (item) => item.userId === user.id,
    );

    return { items: watchlist };
  },

  add: async (movie) => {
    await delay();

    const user = requireAuth();
    const watchlist = read(STORAGE_KEYS.watchlist, []);
    const movieId = getMovieId(movie);

    const exists = watchlist.find(
      (item) =>
        item.userId === user.id && String(item.tmdbId) === String(movieId),
    );

    if (exists) {
      throw new Error("Movie already in your watchlist");
    }

    const newItem = {
      userId: user.id,
      tmdbId: movieId,
      title: getMovieTitle(movie),
      poster: getMoviePoster(movie),
      status: "plan",
    };

    watchlist.push(newItem);
    write(STORAGE_KEYS.watchlist, watchlist);

    return newItem;
  },

  updateStatus: async (movieId, status) => {
    await delay();

    const user = requireAuth();
    const watchlist = read(STORAGE_KEYS.watchlist, []);

    const updated = watchlist.map((item) =>
      item.userId === user.id && String(item.tmdbId) === String(movieId)
        ? { ...item, status }
        : item,
    );

    write(STORAGE_KEYS.watchlist, updated);

    return { message: "Watchlist status updated" };
  },

  remove: async (movieId) => {
    await delay();

    const user = requireAuth();
    const updated = read(STORAGE_KEYS.watchlist, []).filter(
      (item) =>
        !(item.userId === user.id && String(item.tmdbId) === String(movieId)),
    );

    write(STORAGE_KEYS.watchlist, updated);

    return { message: "Removed successfully" };
  },
};

export const ratingApi = {
  addRating: async (movie, rating, review = "") => {
    await delay();

    const user = requireAuth();
    const ratings = read(STORAGE_KEYS.ratings, []);
    const movieId = getMovieId(movie);

    const exists = ratings.find(
      (item) =>
        item.userId === user.id && String(item.tmdbId) === String(movieId),
    );

    if (exists) {
      throw new Error("You already rated this movie");
    }

    const newRating = {
      userId: user.id,
      tmdbId: movieId,
      title: getMovieTitle(movie),
      poster: getMoviePoster(movie),
      score: rating,
      review,
    };

    ratings.push(newRating);
    write(STORAGE_KEYS.ratings, ratings);

    return newRating;
  },

  updateRating: async (movie, rating, review = "") => {
    await delay();

    const user = requireAuth();
    const movieId = getMovieId(movie);
    const ratings = read(STORAGE_KEYS.ratings, []);

    const updatedRatings = ratings.map((item) =>
      item.userId === user.id && String(item.tmdbId) === String(movieId)
        ? { ...item, score: rating, review }
        : item,
    );

    write(STORAGE_KEYS.ratings, updatedRatings);

    return { message: "Rating updated" };
  },

  getRatings: async () => {
    await delay();

    const user = requireAuth();
    const ratings = read(STORAGE_KEYS.ratings, []).filter(
      (item) => item.userId === user.id,
    );

    return { ratings };
  },

  getRating: async (movieId) => {
    await delay();

    const user = requireAuth();
    const rating = read(STORAGE_KEYS.ratings, []).find(
      (item) =>
        item.userId === user.id && String(item.tmdbId) === String(movieId),
    );

    return rating || null;
  },

  deleteRating: async (movieId) => {
    await delay();

    const user = requireAuth();
    const updatedRatings = read(STORAGE_KEYS.ratings, []).filter(
      (item) =>
        !(item.userId === user.id && String(item.tmdbId) === String(movieId)),
    );

    write(STORAGE_KEYS.ratings, updatedRatings);

    return { message: "Rating deleted" };
  },
};
