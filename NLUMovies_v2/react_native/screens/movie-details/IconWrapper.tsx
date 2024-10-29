import React from 'react';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : 'mt-3';

type IconWrapperProps = {
    children: React.JSX.Element
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
});

export default function IconWrapper({children}: IconWrapperProps) {
    return (
        <SafeAreaView
          className={
            'absolute z-20 w-full flex-row justify-between items-center px-4' +
            topMargin
          }
          style={styles.wrapper}
        >
            {children}
        </SafeAreaView>
    );
}
