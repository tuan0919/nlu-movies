import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { styles } from "../theme";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import { fallbackMoviesPoster, fetchImage185 } from "../api/moviedb";
import type { RootStackParamList } from "../navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Movie } from "../model/Movie";
var { width, height } = Dimensions.get("window");

type MovieListProp = {
  title: string, 
  movies: Movie[], 
  hideSeeAll?: boolean
}

export default function MovieList({ title, movies, hideSeeAll = false } : MovieListProp) : React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View className="mb-8 space-y-4">
      <View className="mx flex-row justify-between items-center">
        <Text className="text-white text-xl px-3">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity
          // 4.1.1 Nếu người dùng bấm vào nút "Xem Tất cả", chuyển đến đến See All Screen
            onPress={() => navigation.push("See All", { movies, title: title })}
          >
            <Text style={styles.text} className="text-lg px-3">
              Xem tất cả
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* movie row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {movies.map((movie, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push("Movie", movie)}
            >
              <View className="space-y-1 mr-4">
                <Image
                  source={{
                    uri:
                    movie.poster_path && fetchImage185(movie.poster_path) || fallbackMoviesPoster,
                  }}
                  className="rounded-3xl"
                  style={{ width: width * 0.33, height: height * 0.22 }}
                />
                <Text className="text-neutral-300 ml-1 text-center">
                  {movie.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
