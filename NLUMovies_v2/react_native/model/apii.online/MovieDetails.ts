
interface Film {
    tmdb: {
        type: string;
        id: string;
        season: null | string;
        vote_average: number;
        vote_count: number;
    };
    imdb: {
        id: string;
    };
    created: {
        time: string;
    };
    modified: {
        time: string;
    };
    _id: string;
    name: string;
    origin_name: string;
    slug: string;
    content: string;
    type: string;
    status: string;
    poster_url: string;
    thumb_url: string;
    is_copyright: boolean;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    notify: string;
    showtimes: string;
    year: number;
    view: number;
    chieurap: boolean;
    sub_docquyen: boolean;
    actor: string[];
    director: string[];
    category: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    country: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface Episode {
    server_name: string;
    server_data: Array<{
        name: string;
        slug: string;
        filename: string;
        link_embed: string;
        link_m3u8: string;
    }>;
}

export interface FilmDetails {
    status: boolean;
    msg: string;
    movie: Film;
    episodes: Episode[];
}