import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import React from 'react';
import HomeScreen  from '../home';
import { MovieScreen } from '../movie-details';
import PersonScreen from '../person-details';
import SearchScreen from '../SearchScreen';
import SeeAllScreen from '../SeeAllScreen';
import type { Movie } from '../../model/Movie';
import type { Cast } from '../../model/Cast';

export default function HomeStack() {
  // Navigation, dùng để chuyển hướng các screen của người dùng
  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Movie" component={MovieScreen} />
        <Stack.Screen name="Person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="See All" component={SeeAllScreen} />
      </Stack.Navigator>
  );
}

export type RootStackParamList = {
  'Home': undefined,
  'Movie': Movie,
  'Person': Cast,
  'Search': undefined,
  'See All': {movies: Movie[], title: string},
}
