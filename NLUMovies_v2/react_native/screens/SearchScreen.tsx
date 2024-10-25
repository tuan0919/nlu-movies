/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import React, { useCallback } from 'react';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Loading from '../components/Loading';
import { debounce } from 'lodash';
import {
  fallbackMoviesPoster,
  fetchImage185,
} from '../api/moviedb';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import type { Movie } from '../model/Movie';
import { MovieRepository } from '../repositories/MovieRepository';
var { width, height } = Dimensions.get('window');

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const movieRepository = new MovieRepository();

  const handleSearch = useCallback(
    debounce((value) => {
      if (value && value.length > 2) {
        setLoading(true);
        movieRepository.searchMovies({
          query: value,
          include_adult: 'false',
          language: 'vi',
          page: '1',
        }).then((data) => {
          setResults(data);
          setLoading(false);
        });
      } else {
        setResults([]);
        setLoading(false);
      }
    }, 400),
    [movieRepository, setLoading, setResults]
  );

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View
        className="mx-4 mb-3 flex-row justify-between
      items-center border border-neural-500 rounded-full mt-3"
      >
        <TextInput
          onChangeText={handleSearch}
          placeholder="Tìm thông tin phim"
          placeholderTextColor={'lightgray'}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="rounded-full p-3 bg-neutral-500"
        >
          <XMarkIcon size="25" color="white" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <Text className="text-white font-semibold ml-1">
            Kết quả ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              type MOVIE_DEFAULT = {
                poster_path: string,
                title: string
              }
              const {poster_path, title} : MOVIE_DEFAULT = {
                title: 'Unknown Title',
                poster_path: fallbackMoviesPoster,
                ... item,
              };
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push('Movie', item)}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      className="rounded-xl"
                      source={{
                        uri:fetchImage185(poster_path),
                      }}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text className="text-neutral-400 ml-1">
                      {title.length > 22
                        ? title.slice(0, 22) + '...'
                        : title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="items-center">
          <Image
            source={require('../assets/images/2371260.webp')}
            className="h-64 w-64"
          />
          <Text className="text-base text-white">Không tìm thấy phim</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
