export interface Movie {
    poster_path?: string,
    title?: string,
    id: string,
    imdb_id?: string,
    vote_average?: string,
    imdb_score?: string,
    status?: string,
    runtime: string,
    release_date: string,
    genres?: {'name': string}[],
    overview?: string,
}
