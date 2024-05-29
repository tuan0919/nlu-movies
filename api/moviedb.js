import axios from "axios";
const API_KEY = "db55323b8d3e4154498498a75642b381";
const API_KEY_IMDB = "b788cc0a90mshb82dc764acf1b06p12481djsn2e181b7b63f2";
const API_HOST = "imdb146.p.rapidapi.com";
// Endpoints
const apiBaseURL = "https://api.themoviedb.org/3";
const apiImdbURL = "https://imdb146.p.rapidapi.com/v1";

const trendings = `${apiBaseURL}/trending/movie/day?language=vi&language=en-US&api_key=${API_KEY}`;
const upcomings = `${apiBaseURL}/movie/upcoming?language=vi&language=en-US&api_key=${API_KEY}`;
const topRateds = `${apiBaseURL}/movie/top_rated?language=vi&language=en-US&api_key=${API_KEY}`;

// Chi tiet phim
const movieDetails = (id) =>
  `${apiBaseURL}/movie/${id}?language=vi&api_key=${API_KEY}`;
const movieCredits = (id) =>
  `${apiBaseURL}/movie/${id}/credits?language=vi&language=en-US&api_key=${API_KEY}`;
const movieSimilars = (id) =>
  `${apiBaseURL}/movie/${id}/similar?language=vi&api_key=${API_KEY}`;
const movieSearch = `${apiBaseURL}/search/movie?language=vi&api_key=${API_KEY}`;

// Chi tiet thong tin dien vien
const personDetails = (id) =>
  `${apiBaseURL}/person/${id}?language=en-US&api_key=${API_KEY}`;
const personMovies = (id) =>
  `${apiBaseURL}/person/${id}/movie_credits?language=vi&language=en-US&api_key=${API_KEY}`;

// binh luan
const reviewMovies = (id) =>
    `${apiBaseURL}/movie/${id}/reviews_movies?language=vi&language=en-US&api_key=${API_KEY}`;

export const fetchImage500 = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : null;
export const fetchImage342 = (path) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : null;
export const fetchImage185 = (path) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : null;

export const fallbackMoviesPoster =
  "https://www.kindpng.com/picc/m/736-7369205_play-button-png-pic-video-default-transparent-png.png";
export const fallbackPersonImage =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const apiCall = async (endpoints, params) => {
  const options = {
    method: "GET",
    url: endpoints,
    params: params ? params : {},
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {}
};

export const fetchTrendingMovies = () => {
  return apiCall(trendings);
};
export const fetchUpcomingMovies = () => {
  return apiCall(upcomings);
};
export const fetchTopRatedMovies = () => {
  return apiCall(topRateds);
};
export const fetchMovieDetails = (id) => {
  return apiCall(movieDetails(id));
};
export const fetchMovieCredits = (id) => {
  return apiCall(movieCredits(id));
};
export const fetchMovieSimilars = (id) => {
  return apiCall(movieSimilars(id));
};
export const fetchPersonDetails = (id) => {
  return apiCall(personDetails(id));
};
export const fetchPersonMovies = (id) => {
  return apiCall(personMovies(id));
};
export const fetchReviewMovies = (id) => {
  return apiCall(reviewMovies(id));
};
export const fetchSearchMovies = (params) => {
  return apiCall(movieSearch, params);
};
export const fetchMovieIMDB = (id) => {
  return (async function () {
    const options = {
      method: "GET",
      url: `${apiImdbURL}/title/?id=${id}`,
      headers: {
        "X-RapidAPI-Key": `${API_KEY_IMDB}`,
        "X-RapidAPI-Host": `${API_HOST}`,
      },
    };
    const response = await axios.request(options);
    const result = await response.data;
    return result;
  })();
};
