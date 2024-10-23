import axios from "axios";
import { Endpoints } from "../api/moviedb";
import type { Movie } from "../model/Movie";
import type { MovieDetails } from "../model/MovieDetails";

export class MovieRepository {
    private static API_KEY = "db55323b8d3e4154498498a75642b381";
    private static apiBaseURL = "https://api.themoviedb.org/3";

    private _movieSimilars = (id: string) =>
        `${MovieRepository.apiBaseURL}/movie/${id}/similar?language=vi&api_key=${MovieRepository.API_KEY}`;

    private _movieDetails = (id: string) =>
        `${MovieRepository.apiBaseURL}/movie/${id}?language=vi&api_key=${MovieRepository.API_KEY}`;

    private _findCastedMoviesOfPerson = (id: string) =>
        `${MovieRepository.apiBaseURL}/person/${id}/movie_credits?language=vi&language=en-US&api_key=${MovieRepository.API_KEY}`;

    private async _apiCall <T>  (endpoint: string, params?: any): Promise<T> {
        const options = {
            method: "GET",
            url: endpoint,
            params: params ? params : {},
        };
        try {
            return axios.request<T>(options).then(value => value.data);
        } catch (error) {
            console.error(error)
            throw Error(`Lỗi xảy ra khi fetch endpoint: ${endpoint}`)
        }
    };

    async fetchTrendingMovies(): Promise<Movie[]> {
        type MovieResponse = {
            page: number,
            results: Movie[]
        }
        const {results : response} = await this._apiCall<MovieResponse>(Endpoints.TRENDINGS);
        return response;
    }
    
    async fetchTopRatedMovies(): Promise<Movie[]> {
        type MovieResponse = {
            page: number,
            results: Movie[]
        }
        const {results : response} = await this._apiCall<MovieResponse>(Endpoints.TOP_RATEDS);
        return response;
    }
    
    async fetchUpcomingMovies(): Promise<Movie[]> {
        type MovieResponse = {
            page: number,
            results: Movie[]
        }
        const {results : response} = await this._apiCall<MovieResponse>(Endpoints.UP_COMINGS);
        return response;
    }

    async searchMovies(params: any): Promise<Movie[]> {
        type MovieResponse = {
            page: number,
            results: Movie[]
        }
        const {results : response} = await this._apiCall<MovieResponse>(Endpoints.MOVIE_SEARCH, params);
        return response;
    }

    async fetchSimilarMovies(id : string): Promise<Movie[]> {
        type MovieResponse = {
            page: number,
            results: Movie[]
        }
        const {results : response} = await this._apiCall<MovieResponse>(this._movieSimilars(id));
        return response;
    }

    async fetchMovieDetails(id: string): Promise<MovieDetails> {
        const response = await this._apiCall<MovieDetails>(this._movieDetails(id));
        return response;
    }

    async fetchMoviesOfPerson(personId: string): Promise<Movie[]> {
        type CastList = {
            id: number,
            cast: Movie[]
        }
        const response = await this._apiCall<CastList>(this._findCastedMoviesOfPerson(personId));
        return response.cast;
    }
}