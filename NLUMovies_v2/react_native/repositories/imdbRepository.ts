import axios from 'axios';
import { ApplicationException } from '../exception/AppException';

interface imdbResponse {
    ratings: {
        imdb: {
            score: number
        },
    },
}

export class IMDBRepository {
    async fetchImdbScore(movie_id: string): Promise<number> {
        const options = {
            method: 'GET',
            url: `https://movies-ratings2.p.rapidapi.com/ratings?id=${movie_id}`,
            headers: {
              'x-rapidapi-key': 'ae90efe78cmsh6c4beb5321d6b04p1280cbjsnf13142e25e8d',
              'x-rapidapi-host': 'movies-ratings2.p.rapidapi.com',
            },
          };
        try {
            const response = await axios.request(options);
            const result = await response.data as imdbResponse;
            return result.ratings.imdb.score || 0;
        } catch (exception) {
            throw new ApplicationException({
                code: 9999,
                message: `Lỗi khi fetch điểm imdb của phim: ${movie_id}`,
                statusCode: 404,
            });
        }
    }
}
