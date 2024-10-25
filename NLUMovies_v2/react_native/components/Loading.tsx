import { Dimensions, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import { theme } from '../theme';
var { width, height } = Dimensions.get('window');
export default function Loading() {
  return (
    <View
      style={{ height, width }}
      className="z-70 absolute flex-row justify-center items-center"
    >
      <Progress.CircleSnail
        thickness={10}
        size={160}
        color={theme.background}
      />
    </View>
  );
}
