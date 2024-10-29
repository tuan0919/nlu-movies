import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    circle: {
        height: 80,
        width: 80,
        borderColor: '#f5c518',
        backgroundColor: 'rgba(0,0,0,.5)',
        marginTop: 50,
    },
    circleText: {
        backgroundColor: '#f5c518',
        alignSelf: 'center',
        paddingHorizontal: 7,
        paddingVertical: 1,
    },
});

type IMDBProps = {
    imdb_score: number
}

export default function IMDB({imdb_score}: IMDBProps) {
    return (
        <View>
            <View className="border-4 rounded-full justify-center"
            style={styles.circle}>
                <View>
                <Text className="text-center text-white font-bold text-base">
                    {imdb_score}
                </Text>
                </View>
            </View>
            <Text className="text-center text-ne font-extrabold text-base whitespace-nowrap mt-3 rounded-md"
                style={styles.circleText}
            >
                IMDb
            </Text>
        </View>
    );
}
