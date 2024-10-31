/* eslint-disable react-native/no-inline-styles */
import { View, Text } from 'react-native';
import React from 'react';
import { theme } from '../../theme/index';

export default function UserScore({vote_average} : {vote_average : number}) : React.JSX.Element {
    return (
        <View>
            <View
            className="border-4 rounded-full justify-center"
            style={{
                height: 80,
                width: 80,
                borderColor: theme.text,
                backgroundColor: 'rgba(0,0,0,.5)',
                marginTop: 50,
            }}
            >
                <View>
                    <Text className="text-center text-white font-bold text-base">
                        {(vote_average * 10).toFixed(0)}%
                    </Text>
                </View>
            </View>
            <Text
                className="text-center text-white font-semibold text-base whitespace-nowrap mt-3 rounded-md"
                style={{
                    backgroundColor: theme.background,
                    alignSelf: 'center',
                    paddingHorizontal: 7,
                    paddingVertical: 1,
                }}
                >
                UserScore
            </Text>
      </View>
    );
}

