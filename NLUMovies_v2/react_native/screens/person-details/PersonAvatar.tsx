import { View, Image } from "react-native"
import React from "react"

type PersonAvatarProps = {
    avatarLink: string,
    height: number,
    width: number,
    className?: string
}
export default function PersonAvatar({avatarLink, height, width, className} : PersonAvatarProps) {
    return (
        <View className={className}>
            <View
                className="items-center rounded-full overflow-hidden h-72 w-72 border-4"
                style={{ borderColor: '#37b24d' }}
            >
                <Image
                source={{ uri: avatarLink }}
                style={{ height: height, width: width }}
                />
            </View>
        </View>
    )
}