import axios from "axios";
import type { Cast } from "../model/Cast";
import type { PersonDetails } from "../model/PersonDetails";

export class CastRepository {
    private static API_BASE_URL = "https://api.themoviedb.org/3";
    private static API_KEY = "db55323b8d3e4154498498a75642b381";

    private _findCastsInMovies = (id: string) : string =>
        `${CastRepository.API_BASE_URL}/movie/${id}/credits?language=vi&language=en-US&api_key=${CastRepository.API_KEY}`;
    
    private _findPersonDetails = (id: string) =>
        `${CastRepository.API_BASE_URL}/person/${id}?language=en-US&api_key=${CastRepository.API_KEY}`;

    async fetchPerson(movieId: string): Promise<Cast[]> {
        type MovieCredits = {
            id: number,
            cast: Cast[]
        }
        const endpoint: string = this._findCastsInMovies(movieId);
        const options = {
            method: "GET",
            url: endpoint
        };
        try {
            const result = await axios.request<MovieCredits>(options)
            const { data: credits } = result
            return credits.cast;
        } catch (error : any) {
            console.error(error)
            throw new Error(`Lỗi xảy ra khi fetch endpoint: ${endpoint}`)
        }
    }

    async fetchPersonDetails(personId: string): Promise<PersonDetails> {
        const endpoint: string = this._findPersonDetails(personId);
        const options = {
            method: "GET",
            url: endpoint
        };
        try {
            const result = await axios.request<PersonDetails>(options)
            const { data } = result
            return data;
        } catch (error : any) {
            console.error(error)
            throw new Error(`Lỗi xảy ra khi fetch endpoint: ${endpoint}`)
        }
    }
}