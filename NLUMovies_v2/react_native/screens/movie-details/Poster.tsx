import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type PosterProps = {
    posterLink: string,
    children: React.JSX.Element
}

var { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        gap: 60,
    },
});

export default function Poster({posterLink, children} : PosterProps) {
    return (
        <>
            <Image
              source={{
                uri: posterLink,
              }}
              style={{ width, height: height * 0.35 }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,1)']}
              style={{ width, height: height * 0.1 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.9 }}
              className="absolute bottom-0"
            />
            <View style={styles.container}>
                {children}
            </View>
        </>
    );
}
