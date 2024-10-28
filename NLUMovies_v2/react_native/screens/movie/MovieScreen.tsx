/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { type NavigationProp, type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/outline';
import { styles, theme, translate } from '../../theme';
import CastComponent from '../../components/Cast';
import MovieList from '../../components/MovieList';
import Loading from '../../components/Loading';
import {
  fallbackMoviesPoster,
  fetchImage500,
} from '../../api/moviedb';
import type { Cast } from '../../model/Cast';
import type { Movie } from '../../model/Movie';
import type { RootStackParamList } from '../../navigation';
import { IMDBRepository } from '../../repositories/imdbRepository';
import { CastRepository } from '../../repositories/CastRepository';
import { MovieRepository } from '../../repositories/MovieRepository';
import UserScore from '../movie/UserScore';
import type { MovieDetails } from '../../model/MovieDetails';
import { ApplicationException } from '../../exception/AppException';
import Poster from './Poster';
import IMDB from './IMDB';
import IconWrapper from './IconWrapper';
import MovieContent from './MovieContent';
var { height } = Dimensions.get('window');
export function MovieScreen() {
  const { params: item } = useRoute<RouteProp<RootStackParamList, 'Movie'>>();
  const navigation : NavigationProp<Movie | Cast[]> = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<MovieDetails | undefined>(undefined);
  const [imdb_score, setImdb_Score] = useState<number>(0);

  useEffect(() => {
    const imdbRepository = new IMDBRepository();
    const castRepository = new CastRepository();
    const movieRepository = new MovieRepository();
    setLoading(true);

    const loadDetailsMovie = async ({id} : Movie) => {
      const data = await movieRepository.fetchMovieDetails(id);
      data && setMovie(data);
      return data;
    };
    const loadCreditsMovie = async ({id} : Movie) => {
      const data = await castRepository.fetchPerson(id);
      data && setCast(data);
      return data;
    };
    const loadSimilarsMovie = async ({id} : Movie) => {
      const data = await movieRepository.fetchSimilarMovies(id);
      setSimilarMovies(data);
      return data;
    };

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
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 40,
        minHeight: height,
      }}
      className="flex-1 bg-neutral-900"
    >
      <View className="w-full">
        <IconWrapper>
         <>
          <TouchableOpacity
              className="rounded-xl p-1"
              style={styles.background}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <HeartIcon
                size={35}
                color={isFavorite ? theme.background : 'white'}
              />
            </TouchableOpacity>
         </>
        </IconWrapper>
        {loading ? (
          <Loading />
        ) : (
          <Poster posterLink={fetchImage500(movie?.poster_path) || fallbackMoviesPoster}>
            <>
              <UserScore vote_average={movie?.vote_average || 0}/>
              <IMDB imdb_score={imdb_score}/>
            </>
          </Poster>
        )}
      </View>
      {loading || (
        <>
          <MovieContent movieDetails={movie}/>
          {/* Diễn viên */}
          <CastComponent navigation={navigation} cast={cast} />
          {/* Phim cùng thể loại */}
          <View className="mt-6">
            <MovieList
              title={'Phim cùng thể loại'}
              hideSeeAll={true}
              movies={similarMovies}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}
