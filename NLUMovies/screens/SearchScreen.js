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
} from "react-native";
import React, { useCallback } from "react";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import Loading from "../components/Loading";
import { debounce } from "lodash";
import {
  fallbackMoviesPoster,
  fetchImage185,
  fetchSearchMovies,
} from "../api/moviedb";
var { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View
        className="mx-4 mb-3 flex-row justify-between
      items-center border border-neural-500 rounded-full mt-3"
      >
        <TextInput
          onChangeText={useCallback(
            debounce((value) => {
              if (value && value.length > 2) {
                setLoading(true);
                fetchSearchMovies({
                  query: value,
                  include_adult: "false",
                  language: "vi",
                  page: "1",
                }).then((data) => {
                  setLoading(false);
                  if (data && data.results) setResults(data.results);
                });
              } else {
                setLoading(false);
                setResults([]);
              }
            }, 400),
            []
          )}
          placeholder="Tìm thông tin phim"
          placeholderTextColor={"lightgray"}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
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
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View className="space-y-2 mb-4">
                    <Image
                      className="rounded-xl"
                      source={{
                        uri:
                          fetchImage185(item?.poster_path) ||
                          fallbackMoviesPoster,
                      }}
                      style={{ width: width * 0.44, height: height * 0.3 }}
                    />
                    <Text className="text-neutral-400 ml-1">
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
      ) : (
        <View className="items-center">
          <Image
            source={require("../assets/images/2371260.webp")}
            className="h-64 w-64"
          />
          <Text className="text-base text-white">Không tìm thấy phim</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
