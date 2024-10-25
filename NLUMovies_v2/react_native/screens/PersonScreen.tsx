/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles, theme, translate } from '../theme';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/outline';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
import {
  fallbackPersonImage,
  fetchImage342,
} from '../api/moviedb';
import type { PersonDetails } from '../model/PersonDetails';
import { CastRepository } from '../repositories/CastRepository';
import type { Movie } from '../model/Movie';
import type { RootStackParamList } from '../navigation';
import { MovieRepository } from '../repositories/MovieRepository';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

var { width, height } = Dimensions.get('window');
export default function PersonScreen() {
  const { params: item } = useRoute<RouteProp<RootStackParamList, 'Person'>>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [personMovies, setPersonMovies] = useState<Movie[]>([]);
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const castRepository = new CastRepository();
    const movieRepository = new MovieRepository();
    const loadPersonDetails = async function (personId: string) {
      const data = await castRepository.fetchPersonDetails(personId);
      setPerson(data);
    };
    const loadPersonMovies = async function (personId: string) {
      const data = await movieRepository.fetchMoviesOfPerson(personId);
      setPersonMovies(data);
    };
    const fetch = async () => {
      Promise.all([
        loadPersonDetails(item.id),
        loadPersonMovies(item.id),
      ]);
      setLoading(false);
    };
    fetch();
  }, [item]);
  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 50, minHeight: height }}
    >
      <SafeAreaView
        className={
          'absolute z-20 w-full flex-row justify-between items-center px-4'
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
          <View className="flex-row justify-center mt-14">
            <View
              className="items-center rounded-full overflow-hidden h-72 w-72 border-4"
              style={{ borderColor: theme.background }}
            >
              <Image
                source={{
                  uri:
                    fetchImage342(person?.profile_path) || fallbackPersonImage,
                }}
                style={{ height: height * 0.43, width: width * 0.74 }}
              />
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className="text-base text-neutral-500 font-bold text-center">
              {person?.place_of_birth}
            </Text>
          </View>
          <View className="mx-3 mt-6 p-4 flex-row justify-between items-center bg-neutral-700 rounded-full">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Giới tính</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.gender === 1 ? 'Nữ' : 'Nam'}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Ngày sinh</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.birthday}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Được biết đến</Text>
              <Text className="text-neutral-300 text-sm">
                {translate[person?.known_for_department as keyof typeof translate ] ?? 'Không rõ' }
              </Text>
            </View>
            <View className="px-2 items-center">
              <Text className="text-white font-semibold">Nổi tiếng</Text>
              <Text className="text-neutral-300 text-sm">
                {person?.popularity?.toFixed(2)} %
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Tiểu sử</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person?.biography || 'Chưa có tiểu sử về người này'}
            </Text>
          </View>
          <View className="mt-7">
            <MovieList title="Phim cùng diễn viên" movies={personMovies} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
