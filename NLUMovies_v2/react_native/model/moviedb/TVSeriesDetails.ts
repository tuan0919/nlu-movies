interface Genre {
  id: number;
  name: string;
}

interface Network {
  id: number;
  logo_path: string | null; // It can be null if the logo does not exist
  name: string;
  origin_country: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null; // It can be null if the logo does not exist
  name: string;
  origin_country: string;
}

interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null; // It can be null if the poster does not exist
  season_number: number;
  vote_average: number | null; // It can be null if there are no votes
}

interface LastEpisode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null; // It can be null if the still path does not exist
}

export interface TVSeriesDetails {
  adult: boolean;
  backdrop_path: string | null; // It can be null if the backdrop does not exist
  created_by: any[]; // Adjust type as needed, if you have specific fields
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisode;
  name: string;
  next_episode_to_air: any | null; // Adjust type as needed
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null; // It can be null if the poster does not exist
  production_companies: ProductionCompany[];
  production_countries: { iso_3166_1: string; name: string }[];
  seasons: Season[];
}