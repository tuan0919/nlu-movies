/* eslint-disable react-native/no-inline-styles */
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import type { Cast } from '../model/Cast';
import { fallbackPersonImage, fetchImage185 } from '../api/moviedb';
import type { NavigationProp } from '@react-navigation/native';

type CastProps = {
  cast: Cast[];
  navigation: NavigationProp<any>;
};

export default function CastComponent({ cast, navigation }: CastProps): JSX.Element {
  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Diễn viên</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="mr-4 items-center"
                onPress={() => navigation.navigate('Person', person)}
              >
                <View className="overflow-hidden rounded-full h-20 w-20 border border-neutral-500">
                  <Image
                    className="rounded-2xl h-24 w-20"
                    source={{
                      uri:
                      fetchImage185(person?.profile_path) || fallbackPersonImage,
                    }}
                  />
                </View>
                <Text className="text-white text-xs mt-1">
                  {(person.character ?? 'Uknown Character').length > 10
                    ? (person.character ?? 'Uknown Character').slice(0, 10) + '...'
                    : person?.character}
                </Text>
                <Text className="text-neutral-400 text-xs mt-1">
                  {(person.original_name ?? 'Uknown name').length > 10
                    ? (person.original_name ?? 'Uknown name').slice(0, 10) + '...'
                    : person?.original_name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
