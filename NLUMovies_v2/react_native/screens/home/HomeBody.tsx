/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { ScrollView, View } from 'react-native';

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
