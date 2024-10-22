import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { styles } from "../theme";
import { TrendingMovies } from "../components/TrendingMovies";
import { useEffect, useState } from "react";
import MovieList from "../components/MovieList";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { MovieRepository } from "../repositories/MovieRepository";
import React from "react";
import { RootStackParamList } from "../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Movie } from "../model/Movie";
const ios = Platform.OS === "ios";

export default function HomeScreen() : JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const movieRepository = new MovieRepository();
  const startLoading = () => {
    setLoading(true);
    const fetching = async () => {
      await Promise.all([loadTrendingMovies(), loadUpcomingMovies(), loadTopRatedMovies()])
      setLoading(false);
    };
    fetching();
  };
  const loadTrendingMovies = async function () {
    // request lên TMDB Server để fetch thông tin phim trending
    // Nếu kết quả hợp lệ, cập nhật lại state trending bằng kết quả vừa nhận được
    // Việc cập nhật state trending khiến cho component TrendingMovies chứa nó tự động re-render giao diện
    const data = await movieRepository.fetchTrendingMovies(); // 3.1.2 -> 3.1.6
    // 3.1.7
    setTrending(data);
  };
  const loadUpcomingMovies = async function () {
    // request lên TMDB Server để fetch thông tin phim upcoming
    // Nếu kết quả hợp lệ, cập nhật lại state upcoming bằng kết quả vừa nhận được
    // Việc cập nhật state upcoming khiến cho component MoviesList chứa nó tự động re-render giao diện
    const data = await movieRepository.fetchUpcomingMovies(); //3.2.2 -> 3.2.6
    // 3.2.7
    setUpcoming(data);
  };
  const loadTopRatedMovies = async function () {
    // request lên TMDB Server để fetch thông tin phim top rated
    // Nếu kết quả hợp lệ, cập nhật lại state topRated bằng kết quả vừa nhận được
    // Việc cập nhật state topRated khiến cho component MoviesList chứa nó tự động re-render giao diện
    const data = await movieRepository.fetchTopRatedMovies(); //3.3.2 -> 3.3.6
    //3.3.7
    setTopRated(data);
  };
  // 3. Tự động gọi hàm startLoading sau khi load component này
  useEffect(startLoading, []);
  // 4. Sau khi có được hết dữ liệu thì return component View
  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView>
        <StatusBar />
        <View className="flex-row justify-between items-center p-4 py-1 bg-neutral-950">
          <Bars3CenterLeftIcon size="30" strokeWidth={2} color={"white"} />
          <TouchableOpacity onPress={() => startLoading()}>
            <Text className="text-white text-3xl font-bold">
              <Text style={{ ...styles.text, fontSize: 21 }}>Nông Lâm🌿</Text>
              Movies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
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
          {trending.length > 0 && <TrendingMovies data={trending} />}
          {/* Upcoming movies */}
          <MovieList title="Phim sắp chiếu" movies={upcoming} />
          {/* Top-rating movies */}
          <MovieList title="Phim hot" movies={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
