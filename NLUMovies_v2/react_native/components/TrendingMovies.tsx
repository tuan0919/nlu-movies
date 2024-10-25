/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import Carousel from 'react-native-snap-carousel-v4';
import { useNavigation } from '@react-navigation/native';
import { fetchImage500 } from '../api/moviedb';
import type { Movie } from '../model/Movie';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
var { width, height } = Dimensions.get('window');

type TrendingMoviesProps = {
  movies: Movie[]
}

export function TrendingMovies({ movies } : TrendingMoviesProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleClick = (movie : Movie) => {
    navigation.navigate('Movie', movie);
  };
  return (
    <View className="mb-8">
      <Text className="text-white text-xl mx-4 mb-5">Phim nổi bật</Text>
      <Carousel
        data={movies}
        renderItem={({ item } : {item: any}) => (
          <MovieCard movie={item as Movie} handleClick={handleClick} />
        )}
        firstItem={1}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{ display: 'flex', alignItems: 'center' }}
        vertical={false}
      />
    </View>
  );
}

type MovieCard = {
  movie : Movie,
  handleClick: Function
}

const MovieCard = ({ movie, handleClick } : MovieCard) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(movie)}>
      <Image
        source={{ uri: fetchImage500(movie.poster_path) }}
        style={{ width: width * 0.6, height: height * 0.4 }}
        className="rounded-xl"
      />
    </TouchableWithoutFeedback>
  );
};
