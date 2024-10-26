/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import { styles } from '../theme';
import { TrendingMovies } from '../components/TrendingMovies';
import { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { MovieRepository } from '../repositories/MovieRepository';
import React from 'react';
import type { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Movie } from '../model/Movie';

export default function HomeScreen() : JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const startLoading = () => {
    const movieRepository = new MovieRepository();
    const loadTrendingMovies = async function () {
      const data = await movieRepository.fetchTrendingMovies();
      setTrending(data);
    };
    const loadUpcomingMovies = async function () {
      const data = await movieRepository.fetchUpcomingMovies();
      setUpcoming(data);
    };
    const loadTopRatedMovies = async function () {
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
  useEffect(startLoading, []);
  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView>
        <StatusBar />
        <View className="flex-row justify-between items-center p-4 py-1 bg-neutral-950">
          <Bars3CenterLeftIcon size="30" strokeWidth={2} color={'white'} />
          <TouchableOpacity onPress={() => startLoading()}>
            <Text className="text-white text-3xl font-bold">
              <Text style={{ ...styles.text, fontSize: 21 }}>Nông Lâm🌿</Text>
              Movies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
        >
          {/* Trending movies carousel */}
          {trending.length > 0 && <TrendingMovies movies={trending} />}
          {/* Upcoming movies */}
          <MovieList title="Phim sắp chiếu" movies={upcoming} />
          {/* Top-rating movies */}
          <MovieList title="Phim hot" movies={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
