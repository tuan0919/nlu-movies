import {
  Dimensions,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import CastComponent from '../../components/Cast';
import MovieList from '../../components/MovieList';
import Loading from '../../components/Loading';
import MovieDetailsContainer from './MovieContainer';
import type { Cast } from '../../model/Cast';
import type { Movie } from '../../model/Movie';
import type { RootStackParamList } from '../navigation/navigation';
import { IMDBRepository } from '../../repositories/imdbRepository';
import { CastRepository } from '../../repositories/CastRepository';
import { MovieRepository } from '../../repositories/MovieRepository';
import UserScore from './UserScore';
import type { MovieDetails } from '../../model/MovieDetails';
import { ApplicationException } from '../../exception/AppException';
import Poster from './Poster';
import IMDB from './IMDB';
import MovieContent from './MovieContent';
import MovieDetailsHead from './MovieDetailsHead';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EpisodeList from './EpisodesList';
import { loadDemoMovie } from '../../api/apii-online';
import type { FilmDetails } from '../../model/apii.online/MovieDetails';
import type { TVSeriesDetails } from '../../model/moviedb/TVSeriesDetails';
import { loadSeasonDetails, loadTVSeriesDetails } from '../../api/moviedb';
import type { Season } from '../../model/moviedb/TVSeriesSeason';
import TabViewExample from './TestTab';
var { height } = Dimensions.get('window');
export function MovieScreen() {
  const { params: item } = useRoute<RouteProp<RootStackParamList, 'Movie'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<MovieDetails | undefined>(undefined);
  const [imdb_score, setImdb_Score] = useState<number>(0);
  const [filmDetails, setFilmDetails] = useState<FilmDetails>()
  const [tvSeriesDetails, setTvSeriesDetails] = useState<TVSeriesDetails>()
  const [seasons, setSeasons] = useState<Season[]>([])
  useEffect(() => {
    const imdbRepository = new IMDBRepository();
    const castRepository = new CastRepository();
    const movieRepository = new MovieRepository();
    setLoading(true);

    const loadDetailsMovie = async ({id} : Movie) => {
      const data = await movieRepository.fetchMovieDetails(id);
      data && setMovie(data);
      return data;
    }
    const loadCreditsMovie = async ({id} : Movie) => {
      const data = await castRepository.fetchPerson(id);
      data && setCast(data);
      return data;
    }
    const loadSimilarsMovie = async ({id} : Movie) => {
      const data = await movieRepository.fetchSimilarMovies(id);
      setSimilarMovies(data);
      return data;
    }
    const loadDemo = async () => {
      const data = await loadDemoMovie();
      setFilmDetails(data)
      return data
    }
    const getTVSeriesDetails = async (tvId: number) => {
        const data = await loadTVSeriesDetails(tvId);
        setTvSeriesDetails(data)
        return data;
    }
    const getSeasonDetails = async (tvId: number, seasonNumber: number): 
      Promise<Season> => {
        const data = await loadSeasonDetails(tvId, seasonNumber)
        setSeasons(ss => [...ss, data])
        console.log('season arr length: ', seasons.length)
        return data;
      }

    const fetching = async () => {
      try {
        const movieDetails = await loadDetailsMovie(item);
        await Promise.all([
          (async () => {
            if (movieDetails?.imdb_id) {
              const score = await imdbRepository.fetchImdbScore(movieDetails.imdb_id);
              console.log('điểm imdb: ', score);
              setImdb_Score(score);
            }
          })(),
          loadDemo()
            .then(res => getTVSeriesDetails(Number(res.movie.tmdb.id)))
            .then(tvDetails => {
              [...tvDetails.seasons]
                .forEach(season => getSeasonDetails(tvDetails.id, season.season_number))
            })
          ,
          loadCreditsMovie(item),
          loadSimilarsMovie(item),
        ]);
      } catch (error) {
        if (error instanceof ApplicationException) {
          const castedError = error as ApplicationException;
          console.error(castedError.message);
        }
        else {
          console.error('Lỗi không xác định:', error);
        }
      } finally {
        setLoading(false); // Đảm bảo setLoading được gọi trong khối finally
      }
    };
    fetching();
  }, [item]);

  return (
    <MovieDetailsContainer height={height}>
      <>
        <MovieDetailsHead>
        {loading || !filmDetails ? (
          <Loading />
        ) : (
          <Poster posterLink={filmDetails.movie.poster_url}>
            <>
              <UserScore vote_average={movie?.vote_average || 0}/>
              <IMDB imdb_score={imdb_score}/>
            </>
          </Poster>
        )}
        </MovieDetailsHead>
        {!filmDetails || (
          <View className='bg-neutral-950'>
            <MovieContent apiResponse={filmDetails}/>
            <>
              {seasons.map(ss => <EpisodeList filmDetails={filmDetails} season={ss}/>)}
            </>
            <CastComponent navigation={navigation} cast={cast} />
            {/* Phim cùng thể loại */}
            <MovieList title={'Phim cùng thể loại'} hideSeeAll={true} movies={similarMovies} />
          </View>
        )}
      </>
    </MovieDetailsContainer>
  );
}
