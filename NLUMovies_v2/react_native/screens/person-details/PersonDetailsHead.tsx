import React from "react"
import { TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/navigation";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
const ios = Platform.OS === 'ios';
const topMargin = ios ? '' : 'mt-3';

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
});


export default function PersonDetailsHead() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <SafeAreaView
        className={
            'absolute z-20 w-full flex-row justify-between items-center px-4' +
            topMargin
        }
        style={styles.wrapper}
        >
          <TouchableOpacity
              className="rounded-xl p-1"
              onPress={() => navigation.goBack()}>
              <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
              <HeartIcon size={35} color={'white'}/>
          </TouchableOpacity>
      </SafeAreaView>
    )
}