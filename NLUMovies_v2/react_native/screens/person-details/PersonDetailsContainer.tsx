import { Dimensions, ScrollView } from "react-native";
import React from "react";
var { height } = Dimensions.get('window');
type PersonDetailsContainerProps = {
    children: React.JSX.Element
}

export default function PersonDetailsContainer({children}: PersonDetailsContainerProps) {
    return (
    <ScrollView
        className="flex-1 bg-neutral-900"
        contentContainerStyle={{ paddingBottom: 50, minHeight: height }}
    >
        {children}
    </ScrollView>
    );
}