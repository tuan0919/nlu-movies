/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { type NavigationProp, type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/outline';
import { styles, theme, translate } from '../theme';
import { LinearGradient } from 'react-native-linear-gradient';
import CastComponent from '../components/Cast';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import {
  fallbackMoviesPoster,
  fetchImage500,
} from '../api/moviedb';
import type { Cast } from '../model/Cast';
import type { Movie } from '../model/Movie';
import type { RootStackParamList } from '../navigation';
import { IMDBRepository } from '../repositories/imdbRepository';
import { CastRepository } from '../repositories/CastRepository';
import { MovieRepository } from '../repositories/MovieRepository';
import UserScore from '../components/UserScore';
import type { MovieDetails } from '../model/MovieDetails';
var { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : 'mt-3';
export function MovieScreen() {
  const { params: item } = useRoute<RouteProp<RootStackParamList, 'Movie'>>();
  const navigation : NavigationProp<Movie | Cast[]> = useNavigation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<MovieDetails | undefined>(undefined);
  const imdb_score = useRef(0);

  useEffect(() => {
    const imdbRepository = new IMDBRepository();
    const castRepository = new CastRepository();
    const movieRepository = new MovieRepository();
    setLoading(true);
    // Gọi api để lấy chi tiết thông tin phim
    const fetching = async () => {
      const loadDetailsMovie = async ({id} : Movie) => {
        const data = await movieRepository.fetchMovieDetails(id);
        setMovie(data);
      };
      const loadCreditsMovie = async ({id} : Movie) => {
        const data = await castRepository.fetchPerson(id);
        data && setCast(data);
      };
      const loadSimilarsMovie = async ({id} : Movie) => {
        const data = await movieRepository.fetchSimilarMovies(id);
        setSimilarMovies(data);
      };
      await loadDetailsMovie(item);
      await Promise.all([
        (async () => {
          if (movie) {
            imdb_score.current = await imdbRepository.fetchImdbScore(Number(movie.imdb_id));
          }
        })(),
        loadCreditsMovie(item),
        loadSimilarsMovie(item),
      ]);
      setLoading(false);
    };
    fetching();
  }, [item, movie]);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 40,
        minHeight: height,
      }}
      className="flex-1 bg-neutral-900"
    >
      <View className="w-full">
        <SafeAreaView
          className={
            'absolute z-20 w-full flex-row justify-between items-center px-4' +
            topMargin
          }
          style={{
            paddingHorizontal: 10,
            marginTop: 10,
          }}
        >
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
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: fetchImage500(movie?.poster_path || fallbackMoviesPoster),
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.9 }}
              className="absolute bottom-0"
            />
            {!!movie?.vote_average && !!imdb_score && (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  width: '100%',
                  height: '100%',
                  gap: 60,
                }}
              >
                <UserScore vote_average={movie.vote_average}/>
                <View>
                  <View
                    className="border-4 rounded-full justify-center"
                    style={{
                      height: 80,
                      width: 80,
                      borderColor: '#f5c518',
                      backgroundColor: 'rgba(0,0,0,.5)',
                      marginTop: 50,
                    }}
                  >
                    <View>
                      <Text className="text-center text-white font-bold text-base">
                        {imdb_score.current}%
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-center text-ne font-extrabold text-base whitespace-nowrap mt-3 rounded-md"
                    style={{
                      backgroundColor: '#f5c518',
                      alignSelf: 'center',
                      paddingHorizontal: 7,
                      paddingVertical: 1,
                    }}
                  >
                    IMDb
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
      {loading || (
        <>
          <View style={{ marginTop: -(height * 0.1) }} className="space-y-3">
            <Text className="text-white text-center text-3xl font-bold tracking-wider">
              {movie?.title}
            </Text>
            {movie?.id ? (
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {movie.status && translate[movie.status as keyof typeof translate] || movie.status} •{' '}
                {movie?.release_date} • {movie.runtime / 60} giờ{' '}
                {Number(movie.runtime) % 60} phút
              </Text>
            ) : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row justify-center mx-4">
                {(movie?.genres || []).map((genre, index, arr) => {
                  let last = index + 1 !== arr.length;
                  return (
                    <Text
                      className="text-neutral-400 font-semibold text-base"
                      key={index}
                      style={{ color: theme.background }}
                    >
                      {genre.name}
                      {last ? (
                        <Text className="text-neutral-500"> • </Text>
                      ) : null}
                    </Text>
                  );
                })}
              </View>
            </ScrollView>
            <Text className="text-neutral-400 mx-4 tracking-wide">
              {movie?.overview || 'Phim này chưa có mô tả...'}
            </Text>
          </View>
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
