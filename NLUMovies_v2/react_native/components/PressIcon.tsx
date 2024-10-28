import React from 'react';
import { TouchableOpacity, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';

type PressIconProps = {
    children: React.JSX.Element,
    onPress: (event: GestureResponderEvent) => void | undefined,
    className: string | undefined,
    style: StyleProp<ViewStyle>
}

export default function PressIcon({children: icon, onPress, style, className}: PressIconProps) {
    return (
        <TouchableOpacity
              className={className}
              style={style}
              onPress={onPress}
            >
            {icon}
        </TouchableOpacity>
    );
}
