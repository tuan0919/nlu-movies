import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "../theme";
import { fallbackMoviesPoster, fetchImage185 } from "../api/moviedb";
var { width, height } = Dimensions.get("window");
export default function SeeAllScreen() {
  const {
    params: { data: movies, title },
  } = useRoute();
  const navigation = useNavigation();
  return (
    <ScrollView className="bg-neutral-800 flex-1">
      <SafeAreaView
        className={"z-20 w-full flex-row justify-between items-center px-4"}
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
      </SafeAreaView>
      <Text className="text-white text-base mx-3 my-4">
        Danh sách {title} ({movies.length})
      </Text>
      <View className="flex-row justify-between flex-wrap">
        {movies.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View className="space-y-2 mb-4 px-2">
                <Image
                  className="rounded-xl"
                  source={{
                    uri:
                      fetchImage185(item?.poster_path) || fallbackMoviesPoster,
                  }}
                  style={{ width: width * 0.44, height: height * 0.3 }}
                />
                <Text className="text-neutral-400 ml-1 text-center">
                  {item?.title.length > 22
                    ? item?.title.slice(0, 22) + "..."
                    : item?.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </ScrollView>
  );
}
