import { ScrollView } from 'react-native';
import React from 'react';

type MovieDetailsContainerProps = {
    children: React.JSX.Element,
    height: number,
}

export default function MovieDetailsContainer({children, height} : MovieDetailsContainerProps) {
    return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 40,
        minHeight: height,
      }}
      className="flex-1 bg-neutral-900"
    >
        {children}
    </ScrollView>
    );
}

