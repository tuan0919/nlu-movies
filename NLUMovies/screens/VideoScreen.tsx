import React from "react";
import Video from "react-native-video";

export default function VideoScreen() : React.JSX.Element {
    return (
        <Video source={{
            uri: 'https://s5.phim1280.tv/20241005/Lxuqvsik/index.m3u8'
        }}
        controls = {true}
        resizeMode="contain"
        >

        </Video>
    )
}