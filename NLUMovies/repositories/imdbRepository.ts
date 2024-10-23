import axios from "axios";

interface imdbResponse {
    metacritic?: {
        metascore?: {
            score: number
        },
    },
}

export class IMDBRepository {
    private static apiImdbURL = "https://imdb146.p.rapidapi.com/v1";
    private static API_KEY_IMDB = "b788cc0a90mshb82dc764acf1b06p12481djsn2e181b7b63f2";
    private static API_HOST = "imdb146.p.rapidapi.com";

    async fetchImdbScore(movie_id: number): Promise<number> {
        const options = {
            method: "GET",
            url: `${IMDBRepository.apiImdbURL}/title/?id=${movie_id}`,
            headers: {
              "X-RapidAPI-Key": `${IMDBRepository.API_KEY_IMDB}`,
              "X-RapidAPI-Host": `${IMDBRepository.API_HOST}`,
            },
          };
        const response = await axios.request(options);
        const result = await response.data as imdbResponse;
        return result.metacritic?.metascore?.score || 0;
    }
}