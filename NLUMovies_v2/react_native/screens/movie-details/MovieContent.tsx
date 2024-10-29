import React from 'react';
import { View, ScrollView, Text, Dimensions } from 'react-native';
import { translate, theme } from '../../theme';
import type { MovieDetails } from '../../model/MovieDetails';

var { height } = Dimensions.get('window');

type MovieContentProps = {
    movieDetails: MovieDetails | undefined,
}

export default function MovieContent({movieDetails : movie} : MovieContentProps) {
    return (
        <View style={{ marginTop: -(height * 0.1) }} className="space-y-3">
            <Text className="text-white text-center text-3xl font-bold tracking-wider">
              {movie?.title}
            </Text>
            {movie?.id ? (
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {movie.status && translate[movie.status as keyof typeof translate] || movie.status} •{' '}
                {movie?.release_date} • {movie.runtime / 60} giờ{' '}
                {Number(movie.runtime) % 60} phút
              </Text>
            ) : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row justify-center mx-4">
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
                        <Text className="text-neutral-500"> • </Text>
                      ) : null}
                    </Text>
                  );
                })}
              </View>
            </ScrollView>
            <Text className="text-neutral-400 mx-4 tracking-wide">
              {movie?.overview || 'Phim này chưa có mô tả...'}
            </Text>
        </View>
    );
}
