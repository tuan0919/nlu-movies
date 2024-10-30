import React, { useRef } from "react"
import { View, Text } from "react-native";
import Video, { type VideoRef } from "react-native-video"

export default function ViewVideo() {
    const videoRef = useRef<VideoRef>(null);
    return (
        <View>
            <Text>Hello?</Text>
            <Video
            source={{
                uri: 'https://s5.phim1280.tv/20241028/cCmVbWnx/index.m3u8',
                metadata: {
                title: 'Custom Title',
                subtitle: 'Custom Subtitle',
                artist: 'Custom Artist',
                description: 'Custom Description',
                imageUri: 'https://pbs.twimg.com/profile_images/1498641868397191170/6qW2XkuI_400x400.png'
                }
            }}
            bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 50000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000,
                backBufferDurationMs: 120000,
                cacheSizeMB: 0,
                live: {
                    targetOffsetMs: 500,
                },
              }}
            controls={true}
            fullscreenAutorotate={true}
            style={{ width: '100%', height: 200 }}
            resizeMode="contain"
            ref={videoRef}
            />
        </View>
    )
}