// MoodPlay — Mock Data
// Frontend-only movie data for the client-side assignment.

export const mockMovies = [
  {
    id: 101,
    title: "Inside Out 2",
    release_date: "2024-06-14",
    vote_average: 7.8,
    overview: "Riley enters her teenage years and new emotions arrive.",
    poster_path: "",
    moods: ["happy", "motivated", "bigscreen"],
  },
  {
    id: 102,
    title: "Paddington in Peru",
    release_date: "2024-11-08",
    vote_average: 7.2,
    overview: "Paddington goes on a family adventure full of charm and humour.",
    poster_path: "",
    moods: ["happy", "bored", "bigscreen"],
  },
  {
    id: 103,
    title: "The Wild Robot",
    release_date: "2024-09-27",
    vote_average: 8.1,
    overview:
      "A robot stranded on an island learns how to survive and connect.",
    poster_path: "",
    moods: ["happy", "motivated", "bigscreen"],
  },
  {
    id: 104,
    title: "A Man Called Otto",
    release_date: "2022-12-30",
    vote_average: 7.5,
    overview:
      "A lonely man finds renewed purpose through unexpected friendships.",
    poster_path: "",
    moods: ["sad", "motivated"],
  },
  {
    id: 105,
    title: "The Fault in Our Stars",
    release_date: "2014-06-06",
    vote_average: 7.6,
    overview:
      "Two teenagers with cancer fall in love and change each other’s lives.",
    poster_path: "",
    moods: ["sad", "romantic"],
  },
  {
    id: 106,
    title: "Rocky",
    release_date: "1976-11-21",
    vote_average: 8.0,
    overview:
      "An underdog boxer gets a once-in-a-lifetime chance to fight for glory.",
    poster_path: "",
    moods: ["motivated"],
  },
  {
    id: 107,
    title: "Hidden Figures",
    release_date: "2016-12-25",
    vote_average: 7.8,
    overview:
      "Three brilliant women at NASA help launch one of history’s great missions.",
    poster_path: "",
    moods: ["motivated"],
  },
  {
    id: 108,
    title: "La La Land",
    release_date: "2016-12-09",
    vote_average: 8.0,
    overview:
      "Two artists fall in love while chasing their dreams in Los Angeles.",
    poster_path: "",
    moods: ["romantic", "sad"],
  },
  {
    id: 109,
    title: "Pride and Prejudice",
    release_date: "2005-09-16",
    vote_average: 8.1,
    overview:
      "A classic romance built on misunderstandings, wit, and emotional growth.",
    poster_path: "",
    moods: ["romantic"],
  },
  {
    id: 110,
    title: "Game Night",
    release_date: "2018-02-23",
    vote_average: 6.9,
    overview: "A game night spirals into chaos when the mystery becomes real.",
    poster_path: "",
    moods: ["bored", "happy"],
  },
  {
    id: 111,
    title: "Knives Out",
    release_date: "2019-11-27",
    vote_average: 7.9,
    overview:
      "A detective investigates the strange death of a wealthy novelist.",
    poster_path: "",
    moods: ["bored", "mindblow"],
  },
  {
    id: 112,
    title: "Inception",
    release_date: "2010-07-16",
    vote_average: 8.3,
    overview:
      "A skilled thief enters dreams to steal ideas and faces impossible layers of reality.",
    poster_path: "",
    moods: ["mindblow"],
  },
  {
    id: 113,
    title: "Interstellar",
    release_date: "2014-11-07",
    vote_average: 8.7,
    overview:
      "A team travels through a wormhole in search of humanity’s future.",
    poster_path: "",
    moods: ["mindblow", "motivated"],
  },
  {
    id: 114,
    title: "Dune: Part Two",
    release_date: "2024-03-01",
    vote_average: 8.4,
    overview:
      "Paul Atreides embraces his destiny in an epic war across Arrakis.",
    poster_path: "",
    moods: ["bigscreen", "mindblow"],
  },
  {
    id: 115,
    title: "Wicked",
    release_date: "2024-11-22",
    vote_average: 7.4,
    overview: "The untold story of friendship and rivalry in the land of Oz.",
    poster_path: "",
    moods: ["bigscreen", "romantic"],
  },
  {
    id: 116,
    title: "Deadpool & Wolverine",
    release_date: "2024-07-26",
    vote_average: 7.7,
    overview: "Two chaotic heroes collide in a wildly entertaining adventure.",
    poster_path: "",
    moods: ["bigscreen", "happy", "bored"],
  },
  {
    id: 117,
    title: "The Notebook",
    release_date: "2004-06-25",
    vote_average: 7.9,
    overview: "A heartfelt romance that spans years and changing lives.",
    poster_path: "",
    moods: ["romantic", "sad"],
  },
  {
    id: 118,
    title: "The Pursuit of Happyness",
    release_date: "2006-12-15",
    vote_average: 8.0,
    overview: "A struggling father fights to build a better life for his son.",
    poster_path: "",
    moods: ["motivated", "sad"],
  },
  {
    id: 119,
    title: "Shutter Island",
    release_date: "2010-02-19",
    vote_average: 8.2,
    overview:
      "A U.S. Marshal investigates a psychiatric facility with disturbing secrets.",
    poster_path: "",
    moods: ["mindblow", "bored"],
  },
  {
    id: 120,
    title: "About Time",
    release_date: "2013-11-01",
    vote_average: 7.8,
    overview: "A romantic fantasy about love, family, and appreciating life.",
    poster_path: "",
    moods: ["romantic", "happy"],
  },
];

export function getMovieById(id) {
  return mockMovies.find((movie) => String(movie.id) === String(id));
}

export function getMoviesByMood(mood) {
  return mockMovies.filter((movie) => movie.moods.includes(mood));
}

export function searchMoviesByTitle(query) {
  const cleanQuery = query.trim().toLowerCase();

  return mockMovies.filter((movie) =>
    movie.title.toLowerCase().includes(cleanQuery),
  );
}
