import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import React from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { MovieScreen } from "./screens/MovieScreen";
import PersonScreen from "./screens/PersonScreen";
import SearchScreen from "./screens/SearchScreen";
import SeeAllScreen from "./screens/SeeAllScreen";

export default function Navigation() {
  // Navigation, dùng để chuyển hướng các screen của người dùng
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 2. set HomeScreen làm screen mặc định (navigator sẽ load screen này đầu tiên) */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Movie" component={MovieScreen} />
        <Stack.Screen name="Person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="See All" component={SeeAllScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
