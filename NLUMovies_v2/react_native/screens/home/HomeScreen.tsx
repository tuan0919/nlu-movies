/* eslint-disable react-native/no-inline-styles */
import {
  ScrollView,
  StatusBar,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  type GestureResponderEvent,
} from 'react-native';
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import { TrendingMovies } from '../../components/TrendingMovies';
import { useEffect } from 'react';
import MovieList from '../../components/MovieList';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import React from 'react';
import type { RootStackParamList } from '../../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { useMovies } from '../../../hooks/useMovies';


const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
  },
  nlu: {
    fontSize: 23,
    color: 'rgb(0, 194, 36)',
    fontWeight: 600,
  },
  movies: {
      fontSize: 18,
      color: 'white',
      fontWeight: '600',
  },
});

function HomeHeader({children} : {children: React.JSX.Element}): React.JSX.Element {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          {children}
        </View>
      </SafeAreaView>
    );
}

type LogoProps = {
  onPressLogo : (event: GestureResponderEvent) => void | undefined
}

function Logo({onPressLogo} : LogoProps) : React.JSX.Element {
  return (
      <TouchableOpacity onPress={onPressLogo}>
          <View className="flex-row gap-1 items-end">
            <Text style={styles.nlu}>Nông Lâm🌿</Text>
            <Text style={styles.movies}>Movies</Text>
          </View>
        </TouchableOpacity>
  );
}

function HomeBody({children} : {children: React.JSX.Element}) {
  return (
      <View className="flex-1 bg-neutral-800">
          <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}>
              {children}
          </ScrollView>
      </View>
  );
}

type SearchButtonProps = {
  onPressSearch: (event: GestureResponderEvent) => void | undefined;
}

function SearchButton({onPressSearch} : SearchButtonProps) {
  return (
      <TouchableOpacity onPress={onPressSearch}>
          <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
      </TouchableOpacity>
  );
}

export default function HomeScreen() : JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { trending, upcoming, topRated, loading, startLoading } = useMovies();
  const eventEmitter = new NativeEventEmitter(NativeModules.NativeS3Uploader);

  useEffect(() => {
    eventEmitter.addListener('updateProgress', (progress: number) => {
      console.log(progress);
    });
    return () => {
      eventEmitter.removeAllListeners('updateProgress');
    };
  });

  return (
    <>
      <HomeHeader>
          <>
            <StatusBar />
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color={'white'} />
            <Logo onPressLogo={() => startLoading()}/>
            <SearchButton onPressSearch={() => navigation.navigate('Search')}/>
          </>
      </HomeHeader>
      <HomeBody>
        {loading ? (
            <Loading />
          ) : (
            <>
              {trending.length > 0 && <TrendingMovies movies={trending} />}
              <MovieList title="Phim sắp chiếu" movies={upcoming} />
              <MovieList title="Phim hot" movies={topRated} />
            </>
        )}
      </HomeBody>
    </>
  );
}
