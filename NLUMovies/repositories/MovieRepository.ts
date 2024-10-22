import { apiCall, Endpoints } from "../api/moviedb";
import { Movie } from "../model/Movie";

type MovieResponse = {
    page: number,
    results: Movie[]
}

export class MovieRepository {
    private fallbackMoviesPoster ="https://www.kindpng.com/picc/m/736-7369205_play-button-png-pic-video-default-transparent-png.png";
    private defaultMovie: Movie = {
        poster_path: this.fallbackMoviesPoster,
        title: "Unknown Title",
        imdb_id: "N/A",
        vote_average: "0",
        imdb_score: "0",
        status: "Unknown",
        runtime: "0",
        release_date: "N/A",
        genres: [],
        overview: "No overview available",
        id: ""
    };

    private handleMissing(movie: Movie): Movie {
        return {...this.defaultMovie, ... movie};
    }

    async fetchTrendingMovies(): Promise<Movie[]> {
        const {results : response} = await apiCall<MovieResponse>(Endpoints.TRENDINGS);
        return response.map(movie => this.handleMissing(movie));
    }
    
    async fetchTopRatedMovies(): Promise<Movie[]> {
        const {results : response} = await apiCall<MovieResponse>(Endpoints.TOP_RATEDS);
        return response.map(movie => this.handleMissing(movie));
    }
    
    async fetchUpcomingMovies(): Promise<Movie[]> {
        const {results : response} = await apiCall<MovieResponse>(Endpoints.UP_COMINGS);
        return response.map(movie => this.handleMissing(movie));
    }
}