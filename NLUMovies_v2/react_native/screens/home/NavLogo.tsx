import { StyleSheet,
    TouchableOpacity,
    Text,
    View, 
    type GestureResponderEvent } from "react-native";
import React from "react";

type LogoProps = {
  onPressLogo : (event: GestureResponderEvent) => void | undefined
}

const styles = StyleSheet.create({
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

export function NavLogo({onPressLogo} : LogoProps) : React.JSX.Element {
  return (
    <TouchableOpacity onPress={onPressLogo}>
        <View className="flex-row gap-1 items-end">
            <Text style={styles.nlu}>Nông Lâm🌿</Text>
            <Text style={styles.movies}>Movies</Text>
        </View>
    </TouchableOpacity>
  );
}