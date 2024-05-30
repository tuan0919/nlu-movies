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
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviesPoster, fetchImage185 } from "../api/moviedb";
var { width, height } = Dimensions.get("window");
export default function MovieList({ title, data, hideSeeAll }) {
  const navigation = useNavigation();
  return (
    <View className="mb-8 space-y-4">
      <View className="mx flex-row justify-between items-center">
        <Text className="text-white text-xl px-3">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity
            onPress={() => navigation.push("See All", { data, title: title })}
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
        {data.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View className="space-y-1 mr-4">
                <Image
                  source={{
                    uri:
                      fetchImage185(item.poster_path) || fallbackMoviesPoster,
                  }}
                  className="rounded-3xl"
                  style={{ width: width * 0.33, height: height * 0.22 }}
                />
                <Text className="text-neutral-300 ml-1 text-center">
                  {item.title.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
