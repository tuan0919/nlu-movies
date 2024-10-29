import React from "react"
import { TouchableOpacity, View } from "react-native"
import IconWrapper from "./IconWrapper"
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/navigation";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";


type MovieDetailsHeadProps = {
    children: React.JSX.Element
}

export default function MovieDetailsHead({children} : MovieDetailsHeadProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
    <View className="w-full">
        <>
          <IconWrapper>
            <>
            <TouchableOpacity
                className="rounded-xl p-1"
                onPress={() => navigation.goBack()}>
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
                <HeartIcon size={35} color={'white'}/>
            </TouchableOpacity>
            </>
          </IconWrapper>
          {children}
        </>
    </View>
    )
}