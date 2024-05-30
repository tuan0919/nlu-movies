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
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../api/moviedb";
const ios = Platform.OS === "ios";
export function HomeScreen() {
  const navigation = useNavigation();
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(false);
  const startLoading = () => {
    setLoading(true);
    const fetching = async () => {
      await loadTrendingMovies();
      await loadUpcomingMovies();
      await loadTopRatedMovies();
      setLoading(false);
    };
    fetching();
  };
  useEffect(startLoading, []);
  const loadTrendingMovies = async function () {
    const data = await fetchTrendingMovies();
    if (data && data.results) setTrending(data.results);
  };
  const loadUpcomingMovies = async function () {
    const data = await fetchUpcomingMovies();
    if (data && data.results) setUpcoming(data.results);
  };
  const loadTopRatedMovies = async function () {
    const data = await fetchTopRatedMovies();
    if (data && data.results) setTopRated(data.results);
  };
  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView>
        <StatusBar style="light" />
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
          <MovieList title="Phim sắp chiếu" data={upcoming} />
          {/* Top-rating movies */}
          <MovieList title="Phim hot" data={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
