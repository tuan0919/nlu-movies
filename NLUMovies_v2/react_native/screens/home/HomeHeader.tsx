import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
  },
});

export default function HomeHeader({children} : {children: React.JSX.Element}): React.JSX.Element {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          {children}
        </View>
      </SafeAreaView>
    );
}
