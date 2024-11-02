import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { PlayCircleIcon } from 'react-native-heroicons/outline';
import type { ApiResponse } from '../../api/apii-online';

type MovieContentProps = {
    apiResponse: ApiResponse,
    style?: StyleProp<ViewStyle> | undefined,
    className?: string | undefined
}

export default function MovieContent({apiResponse : response, className, style} : MovieContentProps) {
  const date = new Date();
  return (
        <View style={style} className={className}>
            <Text className="text-white text-center text-3xl font-bold">
                {response.movie.name}
            </Text>
            <View style={{alignItems: 'flex-start', marginTop: 20}}>
              <Text className="text-neutral-400 font-semibold">
                  {response.movie.status} •{' '}
                  {response.movie.created.time} • {response.movie.time}
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{maxWidth: '100%'}}
              >
                <View className="flex-row justify-center">
                  {(response.movie.category || []).map((genre, index, arr) => {
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
                {response.movie.content || 'Phim này chưa có mô tả...'}
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
