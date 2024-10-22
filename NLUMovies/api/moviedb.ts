import axios from "axios";
import { Movie } from "../model/Movie";
const API_KEY = "db55323b8d3e4154498498a75642b381";
const API_KEY_IMDB = "b788cc0a90mshb82dc764acf1b06p12481djsn2e181b7b63f2";
const API_HOST = "imdb146.p.rapidapi.com";
// Endpoints
const apiBaseURL = "https://api.themoviedb.org/3";
const apiImdbURL = "https://imdb146.p.rapidapi.com/v1";

export enum Endpoints {
  TRENDINGS = `${apiBaseURL}/trending/movie/day?language=vi&language=en-US&api_key=${API_KEY}`,
  UP_COMINGS = `${apiBaseURL}/movie/upcoming?language=vi&language=en-US&api_key=${API_KEY}`,
  TOP_RATEDS = `${apiBaseURL}/movie/top_rated?language=vi&language=en-US&api_key=${API_KEY}`
}

const movieDetails = (id: string) =>
  `${apiBaseURL}/movie/${id}?language=vi&api_key=${API_KEY}`;
const movieCredits = (id: string) =>
  `${apiBaseURL}/movie/${id}/credits?language=vi&language=en-US&api_key=${API_KEY}`;
const movieSimilars = (id: string) =>
  `${apiBaseURL}/movie/${id}/similar?language=vi&api_key=${API_KEY}`;
const movieSearch = `${apiBaseURL}/search/movie?language=vi&api_key=${API_KEY}`;
const personDetails = (id: string) =>
  `${apiBaseURL}/person/${id}?language=en-US&api_key=${API_KEY}`;
const personMovies = (id: string) =>
  `${apiBaseURL}/person/${id}/movie_credits?language=vi&language=en-US&api_key=${API_KEY}`;

export const fetchImage500 = (path: string) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : undefined;
export const fetchImage342 = (path: string) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : undefined;
export const fetchImage185 = (path: string) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : undefined;

export const fallbackMoviesPoster =
  "https://www.kindpng.com/picc/m/736-7369205_play-button-png-pic-video-default-transparent-png.png";
export const fallbackPersonImage =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export const apiCall = async <T> (endpoint: string, params?: any): Promise<T> => {
  const options = {
    method: "GET",
    url: endpoint,
    params: params ? params : {},
  };
  try {
    return axios.request(options).then(value => value.data as T);
  } catch (error) {
    console.error(error)
    throw Error(`Lỗi xảy ra khi fetch endpoint: ${endpoint}`)
  }
};

// 3.1.1
export const fetchTrendingMovies = async () : Promise<Movie[]> => {
  const defaultMovie: object = {
    poster_path: fallbackMoviesPoster,
    title: "Unknown Title",
    imdb_id: "N/A",
    vote_average: "0",
    imdb_score: "0",
    status: "Unknown",
    runtime: "0",
    release_date: "N/A",
    genres: [],
    overview: "No overview available",
  };

  const response = await apiCall<Movie[]>(Endpoints.TRENDINGS);
  return [...response].map(v => {
    return {
      ...defaultMovie,
      ...v
    }
  })
};

// 3.2.1
export const fetchUpcomingMovies = () : Promise<Movie[]> => {
  return apiCall(Endpoints.UP_COMINGS); // 3.2.2
};
// 3.3.1
export const fetchTopRatedMovies = () : Promise<Movie[]> => {
  return apiCall(Endpoints.TOP_RATEDS); // 3.3.2
};
export const fetchMovieDetails = (id: string) => {
  return apiCall<Movie>(movieDetails(id));
};
export const fetchMovieCredits = (id: string) => {
  return apiCall(movieCredits(id));
};
export const fetchMovieSimilars = (id: string) : Promise<Movie[]> => {
  return apiCall(movieSimilars(id));
};
export const fetchPersonDetails = (id: string) => {
  return apiCall(personDetails(id));
};
export const fetchPersonMovies = (id: string) => {
  return apiCall(personMovies(id));
};
export const fetchSearchMovies = (params: any) : Promise<Movie[]> => {
  return apiCall(movieSearch, params);
};
export const fetchMovieIMDB = (id: string) => {
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
