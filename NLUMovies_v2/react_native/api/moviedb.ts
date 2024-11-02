import axios from "axios";
import { ApplicationException } from "../exception/AppException";
import type { TVSeriesDetails } from "../model/moviedb/TVSeriesDetails";
import type { EpisodeDetails } from "../model/moviedb/EpisodeDetails";
import type { Season } from "../model/moviedb/TVSeriesSeason";

const API_KEY = "db55323b8d3e4154498498a75642b381";
// Endpoints
const apiBaseURL = "https://api.themoviedb.org/3";

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

async function _apiCall <T>  (endpoint: string, params?: any): Promise<T> {
    const options = {
        method: 'GET',
        url: endpoint,
        params: params ? params : {},
    };
    try {
        return axios.request<T>(options).then(value => value.data);
    } catch (error) {
        throw new ApplicationException({
            message: `Lỗi khi fetch: ${endpoint}`,
            code: 999,
            statusCode: 400,
        });
    }
}

export async function loadTVSeriesDetails(tvId: number): Promise<TVSeriesDetails> {
  return _apiCall(`${apiBaseURL}/tv/${tvId}?api_key=${API_KEY}`) 
}

export async function loadTVEpisodeDetails(tvId: string, season: number, episode: number): Promise<EpisodeDetails> {
  return _apiCall(`${apiBaseURL}/tv/${tvId}/season/${season}/episode/${episode}?api_key=${API_KEY}`) 
}

export async function loadSeasonDetails(tvId: number, season: number): Promise<Season> {
  return _apiCall(`${apiBaseURL}/tv/${tvId}/season/${season}?api_key=${API_KEY}`) 
}