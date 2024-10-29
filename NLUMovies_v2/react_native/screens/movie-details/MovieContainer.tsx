import { ScrollView } from 'react-native';
import React from 'react';

type MovieDetailsContainerProps = {
    children: React.JSX.Element,
    height: number,
}

export default function MovieDetailsContainer({children, height} : MovieDetailsContainerProps) {
    return (
    <ScrollView
      // eslint-disable-next-line react-native/no-inline-styles
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

