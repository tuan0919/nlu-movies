import React, { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from "react-native";
import Video, { type VideoRef } from "react-native-video"
import Orientation from "react-native-orientation-locker";
import SystemNavigationBar from "react-native-system-navigation-bar";
import type { Float } from "react-native/Libraries/Types/CodegenTypes";
import LottieView from "lottie-react-native";

export default function ViewVideo() {

    type OnProgressData = Readonly<{
        currentTime: Float;
        playableDuration: Float;
        seekableDuration: Float;
    }>

    const [isPaused, setIsPaused] = useState<boolean>(true)
    const [videoPressed, setVideoPressed] = useState<boolean>(false)
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [progress, setProgress] = useState<OnProgressData>()
    const [isBuffering, setIsBuffering] = useState<boolean>(true)
    const [resizeMode, setResizeMode] = useState<string>("contain")
    const videoRef = useRef<VideoRef>();

    useEffect(() => {
        Orientation.lockToLandscape();
    }, [])

    const handleVideoPressed = () => {
        setVideoPressed(!videoPressed)
    }

    const moveBackward = () => {

        progress?.currentTime && videoRef?.current?.seek(progress.currentTime - 10)
    }

    const moveForward = () => {
        progress?.currentTime && videoRef?.current?.seek(progress.currentTime + 10)
    }

    const playVideo = () => {
        setIsPaused(false)
    }

    const pauseVideo = () => {
        setIsPaused(true)
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden/>
            <Video
            style={styles.backgroundVideo}
            source={{
                uri: 'https://vip.opstream14.com/20220619/14926_7dc9f0f7/index.m3u8'
            }}
            paused={isPaused}
            muted={isMuted}
            resizeMode='cover'
            onLoad={videoInfo => console.log("Video Info:", videoInfo)}
            onBuffer={(bufferValue) => {
                setIsBuffering(bufferValue.isBuffering)
            }}
            ref={videoRef as React.LegacyRef<VideoRef>}
            onProgress={progress => {
                setProgress(progress)
            }}
            />
            <TouchableOpacity onPress={() => handleVideoPressed()} 
            style={[
                styles.videoScreenContainer, {
                    backgroundColor: videoPressed ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'
                }
            ]}>
                {
                    !isBuffering ? 
                    <View style={{opacity: videoPressed ? 1 : 0, flexDirection: 'row', alignItems: 'center', gap: 60}}>
                        <TouchableOpacity onPress={() => moveBackward()}>
                            <Image 
                            source={require('../../assets/backward-10-seconds.png')} 
                            style={{width: 50, height: 50}}/>
                        </TouchableOpacity>
                        {
                            isPaused ? (
                                <TouchableOpacity onPress={() => playVideo()}>
                                    <Image 
                                    source={require('../../assets/play.png')} 
                                    style={{width: 40, height: 40}}/>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => pauseVideo()}>
                                    <Image 
                                    source={require('../../assets/pause.png')} 
                                    style={{width: 40, height: 40}}/>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity onPress={() => moveForward()}>
                            <Image 
                            source={require('../../assets/forward-10-seconds.png')} 
                            style={{width: 50, height: 50}}/>
                        </TouchableOpacity>
                    </View> 
                    : (
                        <LottieView style={{width: 50, height: 50}} 
                        source={require('../../assets/loading.json')}
                        autoPlay loop/>
                    )
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        height: 500,
        width: '100%'
    },
    backgroundVideo: {
        width: '100%',
        height: '100%'
    },
    videoScreenContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',

    }
})