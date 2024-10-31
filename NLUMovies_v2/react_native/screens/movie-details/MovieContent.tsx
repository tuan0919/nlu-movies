import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '../../theme';
import type { MovieDetails } from '../../model/MovieDetails';
import { PlayCircleIcon } from 'react-native-heroicons/outline';

type MovieContentProps = {
    movieDetails: MovieDetails | undefined,
    style?: StyleProp<ViewStyle> | undefined,
    className?: string | undefined
}

export default function MovieContent({movieDetails : movie, className, style} : MovieContentProps) {
  const date = new Date();
  return (
        <View style={style} className={className}>
            <Text className="text-white text-center text-3xl font-bold">
                {movie?.title}
            </Text>
            <View style={{alignItems: 'flex-start', marginTop: 20}}>
              {movie?.id ? (
                <Text className="text-neutral-400 font-semibold">
                  {movie.status || movie.status} •{' '}
                  {movie?.release_date} • {Math.floor(movie.runtime / 60)} giờ{' '}
                  {Number(movie.runtime) % 60} phút
                </Text>
              ) : null}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{maxWidth: '100%'}}
              >
                <View className="flex-row justify-center">
                  {(movie?.genres || []).map((genre, index, arr) => {
                    let last = index + 1 !== arr.length;
                    return (
                      <Text
                        className="text-neutral-400 font-semibold text-base"
                        key={index}
                        style={{ color: theme.background }}
                      >
                        {genre.name}
                        {last ? (
                          <Text className="text-neutral-500">, </Text>
                        ) : null}
                      </Text>
                    );
                  })}
                </View>
              </ScrollView>
              <Text className="text-neutral-400">
                {movie?.overview || 'Phim này chưa có mô tả...'}
              </Text>
              <TouchableOpacity style={
                {backgroundColor: 'green', 
                paddingHorizontal: 10, 
                paddingVertical: 5,
                borderRadius: 20,
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5}
              }>
                <PlayCircleIcon color='green' size={30} fill={'white'}/>
                <Text style={{fontSize: 18}} className='text-white'>Xem phim</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
}
