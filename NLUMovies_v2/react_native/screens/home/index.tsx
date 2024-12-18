import {
  StatusBar,
} from 'react-native';
import {
  Bars3CenterLeftIcon,
} from 'react-native-heroicons/outline';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import type { RootStackParamList } from '../navigation/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavLogo } from './NavLogo';
import HomeHeader from './HomeHeader';
import HomeBody from './HomeBody';
import SearchButton from './SearchButton';
import type { Movie } from '../../model/Movie';
import { MovieRepository } from '../../repositories';
import { Loading, MovieList, TrendingMovies } from '../../components';

export default function HomeScreen() : JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => {
    const movieRepository = new MovieRepository();
    const loadTrendingMovies = async () => {
      const data = await movieRepository.fetchTrendingMovies();
      setTrending(data);
      console.log('done load trending movies')
    };
    const loadUpcomingMovies = async () => {
      const data = await movieRepository.fetchUpcomingMovies();
      setUpcoming(data);
      console.log('done load upcoming movies')
    };
    const loadTopRatedMovies = async () => {
      const data = await movieRepository.fetchTopRatedMovies();
      setTopRated(data);
      console.log('done load top reated movies')
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

  return (
    <>
      <HomeHeader>
          <>
            <StatusBar />
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color={'white'} />
            <NavLogo onPressLogo={() => startLoading()}/>
            <SearchButton onPressSearch={() => navigation.navigate('Search')}/>
          </>
      </HomeHeader>
      <HomeBody>
        {loading ? (
            <Loading/>
          ) : (
            <>
              {trending.length > 0 && <TrendingMovies movies={trending} />}
              <MovieList title="Phim sắp chiếu" movies={upcoming} />
              <MovieList title="Phim hot" movies={topRated} />
            </>
        )}
      </HomeBody>
    </>
  );
}
