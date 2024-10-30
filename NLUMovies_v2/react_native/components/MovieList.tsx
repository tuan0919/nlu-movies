/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  StyleSheet
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { fallbackMoviesPoster, fetchImage185 } from '../api/moviedb';
import type { RootStackParamList } from '../screens/navigation/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Movie } from '../model/Movie';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowRightCircleIcon } from 'react-native-heroicons/outline';
var { width, height } = Dimensions.get('window');

type MovieListProp = {
  title: string,
  movies: Movie[],
  hideSeeAll?: boolean,
}

const styles = StyleSheet.create({
  seeAllText: {
    color: '#37b24d',
  },
  movieCard: {
    position: 'relative',
    marginHorizontal: 8
  },
  movieList: {
    display: 'flex',
    gap: 2,
    flexDirection: 'row'
  },
  cardInfo: {
    position: 'absolute',
    color: 'white',
    width: '100%',
    height: '50%',
    bottom: 0,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0)'
  },
  btnWatchVideo: {
    backgroundColor: 'rgba(0, 192, 22, 0.6)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    flexDirection: 'row',
    gap: 5
  }
})

export default function MovieList({ title, movies, hideSeeAll = false } : MovieListProp) : React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className="mb-8 space-y-4 gap-2 flex">
      <View className="mx flex-row justify-between items-center">
        <Text className="text-white text-xl px-3 font-bold">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity
          // 4.1.1 Nếu người dùng bấm vào nút "Xem Tất cả", chuyển đến đến See All Screen
            onPress={() => navigation.push('See All', { movies, title: title })}
          >
            <Text style={styles.seeAllText} className="text-lg px-3">
              Xem tất cả
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* movie row */}
      <ScrollView
        horizontal
        style={styles.movieList}
      >
        {movies.map((movie, index) => {
          return (
              <View style={styles.movieCard}>
                <TouchableWithoutFeedback
                  key={index}
                  style={styles.movieCard}
                  onPress={() => navigation.push('Movie', movie)}
                >
                  <Image
                  source={{
                    uri:
                    movie.poster_path && fetchImage185(movie.poster_path) || fallbackMoviesPoster,
                  }}
                  className="rounded-md"
                  style={{ width: width * 0.4, height: height * 0.22 }}
                />
                </TouchableWithoutFeedback>
                <LinearGradient 
                  colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
                  style={styles.cardInfo}>
                  <Text 
                  className="text-white font-semibold"
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  >
                    {movie.title}
                  </Text>
                  <View className='flex flex-row'>
                    <TouchableOpacity style={styles.btnWatchVideo}>
                      <ArrowRightCircleIcon size={20} color={'white'}/>
                      <Text className='text-white'>Xem ngay</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
