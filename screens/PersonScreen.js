import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles, theme, translate } from "../theme";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import {
  fallbackPersonImage,
  fetchImage342,
  fetchPersonDetails,
  fetchPersonMovies,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const [personMovies, setPersonMovies] = useState([]);
  const [person, setPerson] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      await loadPersonDetails(item.id);
      await loadPersonMovies(item.id);
      setLoading(false);
    };
    fetch();
  }, [item]);

  // Hàm LoadPersonDetails sử dụng getPersonDetails để tìm nạp chi tiết diễn viên từ API.
  // Nó chờ phản hồi API, cập nhật trạng thái với dữ liệu được
  // tìm nạp nếu có và sau đó trả về dữ liệu.
  const loadPersonDetails = async function (id) {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
  };
  const loadPersonMovies = async function (id) {
    const data = await fetchPersonMovies(id);
    if (data) setPersonMovies(data.cast);
  };
  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 50, minHeight: height }}
    >
      <SafeAreaView
        className={
          "absolute z-20 w-full flex-row justify-between items-center px-4"
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
            color={isFavorite ? theme.background : "white"}
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
                {person?.gender == 1 ? "Nữ" : "Nam"}
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
                {translate[person?.known_for_department] ||
                  person?.known_for_department}
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
              {person?.biography || "Chưa có tiểu sử về người này"}
            </Text>
          </View>
          <View className="mt-7">
            <MovieList title="Phim cùng diễn viên" data={personMovies} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
