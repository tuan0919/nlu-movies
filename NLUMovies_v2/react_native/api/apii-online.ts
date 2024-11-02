import axios from "axios";
import { ApplicationException } from "../exception/AppException";
import type { FilmDetails } from "../model/apii.online/MovieDetails";

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

export async function loadDemoMovie(): Promise<FilmDetails> {
    return _apiCall('https://apii.online/api/phim/dao-hai-tac-172435602431622')
}