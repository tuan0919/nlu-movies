import axios from "axios";
import type { Movie } from "../model/Movie";
const API_KEY = "db55323b8d3e4154498498a75642b381";
const API_KEY_IMDB = "b788cc0a90mshb82dc764acf1b06p12481djsn2e181b7b63f2";
const API_HOST = "imdb146.p.rapidapi.com";
// Endpoints
const apiBaseURL = "https://api.themoviedb.org/3";
const apiImdbURL = "https://imdb146.p.rapidapi.com/v1";

export enum Endpoints {
  TRENDINGS = `${apiBaseURL}/trending/movie/day?language=vi&language=en-US&api_key=${API_KEY}`,
  UP_COMINGS = `${apiBaseURL}/movie/upcoming?language=vi&language=en-US&api_key=${API_KEY}`,
  TOP_RATEDS = `${apiBaseURL}/movie/top_rated?language=vi&language=en-US&api_key=${API_KEY}`,
  MOVIE_SEARCH = `${apiBaseURL}/search/movie?language=vi&api_key=${API_KEY}`
}

export const fetchImage500 = (path: string | undefined) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : undefined;
export const fetchImage342 = (path: string | undefined) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : undefined;
export const fetchImage185 = (path: string | undefined) =>
  path ? `https://image.tmdb.org/t/p/w185${path}` : undefined;

export const fallbackMoviesPoster =
  "https://www.kindpng.com/picc/m/736-7369205_play-button-png-pic-video-default-transparent-png.png";
export const fallbackPersonImage =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";