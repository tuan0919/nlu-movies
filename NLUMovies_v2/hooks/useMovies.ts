import { useEffect, useState } from 'react';
import { MovieRepository } from '../react_native/repositories/MovieRepository';
import type { Movie } from '../react_native/model/Movie';
export const useMovies = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => {
    const movieRepository = new MovieRepository();
    const loadTrendingMovies = async () => {
      const data = await movieRepository.fetchTrendingMovies();
      setTrending(data);
    };
    const loadUpcomingMovies = async () => {
      const data = await movieRepository.fetchUpcomingMovies();
      setUpcoming(data);
    };
    const loadTopRatedMovies = async () => {
      const data = await movieRepository.fetchTopRatedMovies();
      setTopRated(data);
    };

    setLoading(true);
    const fetching = async () => {
      await Promise.all([loadTrendingMovies(), loadUpcomingMovies(), loadTopRatedMovies()]);
      setLoading(false);
    };

    fetching();
  };

  useEffect(() => {
    startLoading();
  }, []);

  return { trending, upcoming, topRated, loading, startLoading };
};
