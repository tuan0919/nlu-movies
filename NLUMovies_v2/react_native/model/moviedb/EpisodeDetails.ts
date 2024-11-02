interface CrewMember {
    department: string;
    job: string;
    credit_id: string;
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
}
  
interface GuestStar {
    character: string;
    credit_id: string;
    order: number; // Defaults to 0
    adult: boolean; // Defaults to true
    gender: number; // Defaults to 0
    id: number; // Defaults to 0
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number; // Defaults to 0
    profile_path: string;
}
  
export interface EpisodeDetails {
    air_date: string;
    crew: CrewMember[];
    episode_number: number; // Defaults to 0
    guest_stars: GuestStar[];
    name: string;
    overview: string;
    id: number; // Defaults to 0
    production_code: string;
    runtime: number; // Defaults to 0
    season_number: number; // Defaults to 0
    still_path: string;
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
}